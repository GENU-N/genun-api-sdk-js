
const detectEthereumProvider = require('@metamask/detect-provider')
const { MetaMaskSDK } = require('@metamask/sdk')
const sleep = require('sleep-promise')
const uuidv4 = require('uuid').v4

const uaDetect = require('./uaDetect')
const SDKBase = require('./base/sdk')


const isMobile = uaDetect.isMobile && !window.ethereum

const DEFAULT_EIP712 = {
    domain: {
        name: 'GENU.N Authentication',
        version: '1.0',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    primaryType: 'Request',
    types: {
        Request: [
            { name: 'id', type: 'string' },
            { name: 'account', type: 'address' },
            { name: 'timestamp', type: 'uint256' },
        ],
    },
}

const MetaMask = class extends SDKBase {
    constructor ({
        options = {
            // injectProvider: true,
            // checkInstallationImmediately: true,
            // checkInstallationOnAllCalls: true,
            // The following two conditions being true can, in some cases,
            // lead to a failure in connecting with MetaMask and redirect
            // to the MetaMask official website:
            // preferDesktop: true,
            // autoConnect: {
            //     enable: true,
            // },
            useDeeplink: isMobile,
            communicationLayerPreference: 'socket',
            dappMetadata: {
                url: window.location.href,
                name: document.title,
            },
            // storage: {
            //     enabled: true,
            // },
            enableDebug: true,
        },
        EIP712 = DEFAULT_EIP712,
    } = {}) {
        super({
            EIP712,
            walletType: 'MetaMask',
        })

        this.options = options
        this.sdk = null
        this.ethereum = null
        this.hasInstalled = false
        this.hasInited = false
    }

    async initMetaMask () {
        if (!this.hasInited) {
            if (isMobile) {
                if (this.ethereum) {
                    this.ethereum.disconnect()
                }
                this.sdk = null
                this.ethereum = null
                this.provider = null
                this.hasInstalled = false
                this.hasInited = false
                super.reset()
            }
            this.sdk = new MetaMaskSDK(this.options)
            await this.sdk.init()
            await this.detectMetaMask()
            this.hasInited = true
        }
        return this
    }

    async reInitMetaMask () {
        this.hasInited = false
        await this.sdk.init()
        await this.detectMetaMask()
        this.hasInited = true
        return this
    }

    async detectMetaMaskOnPC () {
        const _ethereum = window.ethereum || await detectEthereumProvider()
        if (!_ethereum.isMetaMask) {
            throw new Error('Please install MetaMask or set MetaMask as the default wallet!')
        }

        if (_ethereum) {
            this.ethereum = _ethereum
            await this.connectWallet()

            this.ethereum.on('accountsChanged', (wallets) => {
                this.setAccounts(wallets)
            })
            this.provider = new this.ethers.BrowserProvider(_ethereum)
            this.signer = await this.provider.getSigner()
        } else {
            // When MetaMask is not installed, the official MetaMask installation
            // guide is displayed. Showing the official MetaMask installation
            // guide within a closure function does not prevent the error thrown
            // to the caller below:
            (async () => {
                try {
                    // Display the official MetaMask installation guide
                    await this.sdk.connect()
                } catch (err) {
                    console.log(err)
                }
            })()

            throw new Error('Please install MetaMask and create wallet in MetaMask!')
        }
    }

    /**
     * On iOS Safari, the MetaMask installation interface cannot pop up if the
     * 'Block Pop-ups' feature is enabled (
     *   Settings -> Safari Browser -> General -> Block Pop-ups
     * ), resulting in a console error:
     * WebSocket connection to 'wss://metamask-sdk-socket.metafi.codefi.network/socket.io/?EIO=4&transport=websocket&sid=cwcuZ2n-xmQebB-vZiB-' failed: The operation couldn’t be completed. Software caused connection abort
     */
    async detectMetaMaskOnMobile () {
        const _ethereum = await detectEthereumProvider()
        this.ethereum = _ethereum
        try {
            await this.connectWallet()
        } catch (error) {
            return Promise.reject(error)
        }

        if (_ethereum) {
            this.provider = new this.ethers.BrowserProvider(_ethereum)
            this.signer = await this.provider.getSigner()
        } else {
            throw new Error('Please install MetaMask!')
        }
    }

    async detectMetaMask () {
        if (isMobile) {
            await this.detectMetaMaskOnMobile()
        } else {
            await this.detectMetaMaskOnPC()
        }
    }

    async connectWallet () {
        try {
            const accounts = await this.ethereum.request({ method: 'eth_requestAccounts', params: []  })
            this.setAccounts(accounts)
        } catch (err) {
            /**
             * Used to handle errors when fetching the MetaMask wallet address,
             * but the user has denied the connection:
             */
            if (err.code === 4001) {
                console.log('@connectWallet.err.code: 4001')
                throw new Error('Please connect to MetaMask.')
                // await this.initMetaMask()
                // return this.connectWallet()
            }

            /**
             * Used to resolve errors that occur when the user has not completed
             * the action after the initMetaMask() call which pops up the MetaMask
             * connection box, but then connectWallet() is called again:
             * {
             *      code: -32002,
             *      message: "Request of type 'wallet_requestPermissions' already pending for origin. Please wait."
             * }
             */
            if (err.code === -32002) {
                console.log('@connectWallet.err.code: -32002')
                await sleep(2000)
                return this.connectWallet()
            }

            console.log('@connectWallet.err:', err)
            throw new Error(err.message)
        }
    }

    async addChain ({
        chainId = 0,
        chainName = '',
        nativeCurrency = {
            name: '',
            symbol: '',
            decimals: 18,
        },
        rpcUrls = [
        ],
        blockExplorerUrls = [
        ],
    }) {
        chainId = this.parseChainId(chainId)
        rpcUrls = this.parseRpcUrls(rpcUrls)
        blockExplorerUrls = this.parseBlockExplorerUrls(blockExplorerUrls)

        await this.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
                {
                    chainId,
                    chainName,
                    nativeCurrency,
                    rpcUrls,
                    blockExplorerUrls,
                },
            ]
        })
        await this.reInitMetaMask()
    }

    async switchChain ({
        chainId = 1,
        chainName = '',
        nativeCurrency = {
            name: '',
            symbol: '',
            decimals: 18,
        },

        rpcUrls = [
        ],
        blockExplorerUrls = [
        ],
    }) {
        chainId = this.parseChainId(chainId)

        try {
            await (window.ethereum || this.ethereum).request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId,
                    },
                ]
            })
            await this.reInitMetaMask()
        } catch (err) {
            if (err.message.indexOf('Unrecognized chain ID') > -1) {
                await this.addChain({
                    chainId,
                    chainName,
                    nativeCurrency,
                    rpcUrls,
                    blockExplorerUrls,
                })
            } else if (err.message === 'Received unexpected keys on object parameter. Unsupported keys:\nmethod,params') {
                /**
                 * Due to a MetaMask bug, when a user calls MetaMask for the first
                 * time on the current site, switching networks will cause an error:
                 * Received unexpected keys on object parameter. Unsupported keys:
                 * \nmethod,params Therefore, it is necessary to refresh the page
                 * and re-execute the related MetaMask processes:
                 */
                location.reload()
            } else {
                throw err
            }
        }
    }

    // // No need this method, the bug has been fixed after MetaMask 0.18.2
    // async _getSignature (message) {
    //     try {
    //         const signature = await this.ethereum.request({
    //             method: 'eth_signTypedData_v4',
    //             params: [
    //                 account, JSON.stringify(message),
    //             ],
    //         })
    //         return signature
    //     } catch (err) {
    //         console.log('_getSignature.err:', err)
    //         /**
    //          * Due to a MetaMask bug, when a user calls MetaMask for the first
    //          * time on the current site, switching networks will cause an error:
    //          * Received unexpected keys on object parameter. Unsupported keys:
    //          * \nmethod,params Therefore, it is necessary to refresh the page
    //          * and re-execute the related MetaMask processes:
    //          */
    //         if (err.code === -32000 && err.message === 'Invalid input.') {
    //             location.reload()
    //         } else {
    //             throw err
    //         }
    //     }
    // }

    async getSignature () {
        if (!this.account) {
            this.account = await this.getAccount()
        }

        if (!this.account) {
            throw new Error('Wallet account is required')
        }

        const account = this.account.toLowerCase()

        const value = {
            id: uuidv4(),
            account,
            timestamp: Math.floor(+new Date() / 1000),
        }
        const {
            EIP712,
        } = this

        const message = this.ethers.TypedDataEncoder.getPayload(EIP712.domain, EIP712.types, value)

        const signature = await this.ethereum.request({
            method: 'eth_signTypedData_v4',
            params: [
                account, JSON.stringify(message),
            ],
        })
        // const signature = await this._getSignature(message)

        return {
            ...value,
            signature,
        }
    }
}


module.exports = MetaMask
