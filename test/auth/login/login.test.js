
const {
    expect,
} = require('chai')

const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


describe('Auth Login Tests', function () {
    this.timeout(300000)

    let sdk = null
    let AppConfig = null

    before(async () => {
        sdk = global.sdk
        AppConfig = global.AppConfig
        if (!sdk) {
            throw new Error('SDK not initialized')
        }
    })

    afterEach(async function() {
        await sleep(800)
    })


    it('should login via wallet successfully', async () => {
        const response = await global.login()
        // console.log('response', JSON.stringify(response))

        expect(response).to.have.property('token')
    })
})
