const {
    assert,
    expect,
} = require('chai')
const {
    faker,
} = require('@faker-js/faker')
const MailSlurp = require('mailslurp-client').default
const {
    cloneDeep,
    isString, // eslint-disable-line no-unused-vars
} = require('lodash')

const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


describe('Gating Tests', function () {
    this.timeout(300000)

    let sdk = null

    before(async () => {
        sdk = global.sdk
        if (!sdk) {
            throw new Error('SDK not initialized')
        }
        await global.login()
    })

    afterEach(async function() {
        await sleep(800)
    })

    it('should gating verify successfully', async () => {
        const response = await sdk.gating.verify()
        // console.log('response', JSON.stringify(response))

        assert.isBoolean(response.accessGranted, 'accessGranted should be a boolean')
    })
})
