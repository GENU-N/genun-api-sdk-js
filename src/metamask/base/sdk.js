
const { ethers } = require('ethers')
const isString = require('lodash/isString')
const isArray = require('lodash/isArray')


const MetaMask = class {
    constructor ({
        EIP712 = {},
        walletType = 'MetaMask',
    } = {}) {
        this.ethers = ethers
        this.walletType = walletType
        this.EIP712 = EIP712

        this.reset()
    }

    reset () {
        this.provider = null
        this.signer = null
        this.chainId = null
        this.accounts = []
        this.account = null
    }

    _formatErr (err) {
        console.log('[SKYM-MetaMask].err', err)
        if (err.maker === 'CONTRACT_BASE_CONSTRUCTOR') {
            return err
        }
        err.maker = 'CONTRACT_BASE_CONSTRUCTOR'

        if (err.code === 'SERVER_ERROR') {
            const _err = new Error(err.serverError.message.replace('Error:', '').trim())
            _err.code = err.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err.code === 'INVALID_ARGUMENT') {
            const _err = new Error(err.reason)
            _err.code = err.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err?.error?.body) {
            const errInfo = JSON.parse(err?.error?.body)
            const _err = new Error(errInfo.error.message)
            _err.code = errInfo.error.code
            _err.maker = err.maker
            return _err
        }
        if (err?.error?.data) {
            const message = err.error.data.message.indexOf('insufficient funds') > 0
                ? 'Insufficient balance, unable to pay gas fee'
                : err.error.data.message
            const _err = new Error(message)
            _err.code = err.error.data.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err?.error) {
            const _err = new Error(err.error.message)
            _err.code = err.error.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }
        if (err.reason) {
            const _err = new Error(err.reason)
            _err.code = err.code
            _err.origin = err
            _err.maker = err.maker
            return _err
        }

        return err
    }

    setAccounts (accounts) {
        this.accounts = accounts
        this.account = accounts[0] || null
    }

    // async connectWallet () {}

    async getAccount () {
        if (this.accounts.length === 0) {
            await this.connectWallet()
        }
        return this.account
    }

    parseChainId (chainId) {
        if (isString(chainId) && chainId.indexOf('0x') === 0) {
            return chainId
        }
        chainId = parseInt(chainId)
        chainId = `0x${ parseInt(chainId).toString(16) }`
        return chainId
    }

    parseUrlsAsArray (urls, urlName = 'urls') {
        if (!isString(urls) && !isArray(urls)) {
            throw new Error(`'${ urlName }' must be a string or an array, but got ${ typeof urls }`)
        }

        if (isString(urls)) {
            urls = urls.trim()
            if (urls.length < 1) {
                throw new Error(`'${ urlName }' must be a string or an array, but got empty string`)
            }

            urls = [
                urls,
            ]

            return urls
        }

        if (urls.length < 0) {
            throw new Error(`'${ urlName }' must be a string or an array, but got empty array`)
        }

        return urls
    }

    parseRpcUrls (rpcUrls) {
        return this.parseUrlsAsArray(rpcUrls, 'rpcUrls')
    }

    parseBlockExplorerUrls (blockExplorerUrls) {
        return blockExplorerUrls
            ? this.parseUrlsAsArray(blockExplorerUrls, 'blockExplorerUrls')
            : []
    }

    // async addChain ({...}) {}

    // async switchChain ({...}) {}

    // async getSignature () {}

    isAddress (address) {
        return this.ethers.isAddress(address)
    }

    parseUnits (amount, unit) {
        const value = this.ethers.parseUnits(amount, unit)
        return value
    }

    formatUnits (amount, unit) {
        const value = this.ethers.formatUnits(amount, unit)
        return value
    }

    parseEther (amount) {
        const value = this.ethers.parseEther(amount)
        return value
    }

    async getAccountFromSigner () {
        const account = this.signer.address || await this.signer.getAddress()
        return account
    }

    async getGasPrice () {
        try {
            const gasPrice = await this.provider.getGasPrice()
            return gasPrice.mul(2)
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getNonce (address) {
        try {
            address = address || await this.getAccount()
            const nonce = await this.provider.getTransactionCount(address)
            return nonce
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async balanceOf (address) {
        try {
            address = address || await this.getAccount()
            const balance = await this.provider.getBalance(address)
            return balance
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getTransactionReceipt (txHash) {
        try {
            const receipt = await this.provider.getTransactionReceipt(txHash)
            return receipt
        } catch (err) {
            throw this._formatErr(err)
        }
    }

    async getTransaction (txHash) {
        try {
            const tx = await this.provider.getTransaction(txHash)
            return tx
        } catch (err) {
            throw this._formatErr(err)
        }
    }
}


module.exports = MetaMask
