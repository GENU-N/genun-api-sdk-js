
const path = require('path')
const { ethers } = require('ethers')
const uuidv4 = require('uuid').v4
const { LocalStorage } = require('node-localstorage')

const configPath = path.resolve(__dirname, './.mocharc-app-config.js')

const MetaMask = class {
    constructor ({
        EIP712,
        privateKey,
        rpcUrl = 'https://ethereum-rpc.publicnode.com',
    } = {}) {
        this.EIP712 = EIP712
        this.provider = new ethers.JsonRpcProvider(rpcUrl)
        this.wallet = new ethers.Wallet(privateKey, this.provider)
    }

    async getSignature () {
        const {
            EIP712,
            wallet,
        } = this
        const account = wallet.address.toLowerCase()
        const value = {
            id: uuidv4(),
            account,
            timestamp: Math.floor(+new Date() / 1000),
        }

        const signature = await wallet.signTypedData(EIP712.domain, EIP712.types, value)

        return {
            ...value,
            signature,
        }
    }
}


try {
    global.localStorage = new LocalStorage('./.cache/local-storage')
    const AppConfig = require(configPath)
    global.AppConfig = AppConfig
    global.metamask = new MetaMask({
        EIP712: AppConfig.EIP712,
        privateKey: AppConfig.privateKey,
    })
} catch (error) {
    console.error(`Cannot load config from ${ configPath }:`, error)
    throw error
}
