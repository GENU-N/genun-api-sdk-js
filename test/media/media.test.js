
const {
    expect,
} = require('chai')
const axios = require('axios')

const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


describe('Media Tests', function () {
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


    it('should load media successfully', async () => {
        const mediaUrl = await sdk.media.generateMediaResourceUrl(AppConfig.media.existsId)
        expect(mediaUrl).to.be.a('string')
        const res = await axios.get(mediaUrl)
        expect(res.status).to.equal(200)
        expect(res.headers['content-type']).to.match(/^image/)
    })

    it('should fail to load non-exist media', async () => {
        const mediaUrl = await sdk.media.generateMediaResourceUrl(AppConfig.media.nonExistsId)
        expect(mediaUrl).to.be.a('string')
        try {
            await axios.get(mediaUrl)
            throw new Error('Expected an error but none was thrown')
        } catch (error) {
            expect(error.response.status).to.equal(404)
        }
    })
})
