
const {
    expect,
} = require('chai')

const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


describe('Auth Logout Tests', function () {
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


    it('should logout successfully', async () => {
        const response = await sdk.auth.logout()
        // console.log('response', JSON.stringify(response))

        expect(response).to.have.property('code').that.equals(200)
    })
})
