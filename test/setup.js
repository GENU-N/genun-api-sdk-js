
// This file is used to setup the test environment before running the tests.

const {
    cloneDeep,
} = require('lodash')

const SDK = require('../src/sdk')


before(async () => {
    try {
        const {
            AppConfig,
            metamask,
        } = global

        if (!AppConfig) {
            throw new Error('AppConfig not initialized')
        }
        if (!metamask) {
            throw new Error('MetaMask not initialized')
        }

        global.SDK = SDK
        global.sdk = new SDK(cloneDeep(AppConfig.SDK))

        global.login = async () => {
            const {
                id,
                account,
                signature,
                timestamp,
            } = await metamask.getSignature()
            // console.log('login.params', {
            //     id,
            //     account,
            //     timestamp,
            //     signature,
            //     walletType: 2, // MetaMask
            // })
            const response = await global.sdk.auth.loginWithWallet({
                id,
                account,
                timestamp,
                signature,
                walletType: 2, // MetaMask
            })
            // console.log('login.response', JSON.stringify(response))
            return response
        }
    } catch (error) {
        console.error('Error during initialization:', error)
    }
})
