const {
    assert,
    expect,
} = require('chai')
const {
    cloneDeep,
    isString, // eslint-disable-line no-unused-vars
} = require('lodash')

const sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


describe('Product Tests', function () {
    this.timeout(300000)

    let sdk = null

    before(async () => {
        sdk = global.sdk
        if (!sdk) {
            throw new Error('SDK not initialized')
        }
    })

    afterEach(async function() {
        await sleep(800)
    })

    it('should list products successfully', async () => {
        const response = await sdk.product.list({
            limit: 10,
            page: 1,
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
    })

    it('should paginate products successfully', async () => {
        const page = 2
        const limit = 2
        const response = await sdk.product.list({
            limit,
            page,
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
        expect(response.page).to.equal(page)
        expect(response).to.have.property('skip').that.equals((page - 1) * limit)
    })

    it('should fail get product detail with non-exists product id', async () => {
        const response = await sdk.product.detail('1')
        // console.log('@response', response)
        assert.isNull(response, 'response should be null')
    })

    it('should get product detail successfully', async () => {
        const response = await sdk.product.detail('684205362919768064')
        // console.log('@response', JSON.stringify(response))
        expect(response).to.have.property('id')
        // assert.isNotNull(response.shopMerchandiseSKU.id, 'shopMerchandiseSKU.id should not be null')
    })

    it('should list product items successfully', async () => {
        const response = await sdk.product.items({
            shopMerchandiseId: '684205362919768064',
            limit: 10,
            page: 1,
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
    })

    it('should paginate product items successfully', async () => {
        const page = 2
        const limit = 2
        const response = await sdk.product.items({
            shopMerchandiseId: '684205362919768064',
            limit,
            page,
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
        expect(response.page).to.equal(page)
        expect(response).to.have.property('skip').that.equals((page - 1) * limit)
    })

    it('should get product item detail successfully', async () => {
        const response = await sdk.product.itemDetail({
            shopMerchandiseSKUId: '662806582458843136',
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('shopMerchandiseSKU')
        assert.isNotNull(response.shopMerchandiseSKU.id, 'shopMerchandiseSKU.id should not be null')
    })

    it('should get product item detail by logged-in user successfully', async () => {
        await global.login()
        const response = await sdk.product.itemDetail({
            shopMerchandiseSKUId: '662806582458843136',
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('shopMerchandiseSKU')
        assert.isNotNull(response.shopMerchandiseSKU.id, 'shopMerchandiseSKU.id should not be null')
        await sdk.auth.logout()
    })

    // // Manual configuration of `claimableItem.qrcodeUrl` required in `.mocharc-app-config.js`
    // it('should authenticate item url successfully', async () => {
    //     if (!AppConfig?.claimableItem?.qrcodeUrl) {
    //         this.skip()
    //     }
    //     const parsedUrl = new URL(AppConfig.claimableItem.qrcodeUrl)
    //     const queryParams = new URLSearchParams(parsedUrl.search)
    //     const secureCode = (queryParams.get('e') || '').trim()
    //     if (!secureCode) {
    //         this.skip()
    //     }

    //     await global.login()

    //     const response = await sdk.identityAsset.authenticate(secureCode)
    //     // console.log('response', JSON.stringify(response))
    //     expect(response).to.have.property('shopMerchandiseSKUId')
    // })

    it('should claim item successfully', async function () {
        if (!AppConfig?.claimableItem?.qrcodeUrl) {
            this.skip()
        }
        const parsedUrl = new URL(AppConfig.claimableItem.qrcodeUrl)
        const queryParams = new URLSearchParams(parsedUrl.search)
        const secureCode = (queryParams.get('e') || '').trim()
        if (!secureCode) {
            this.skip()
        }

        await global.login()

        const response = await sdk.identityAsset.authenticate(secureCode)
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('shopMerchandiseSKUId')

        const claimResponse = await sdk.product.claimItem(response.shopMerchandiseSKUId)
        // console.log('claimResponse', JSON.stringify(claimResponse))
        expect(claimResponse).to.have.property('shopMerchandiseSKU')
        assert.isNotNull(claimResponse.shopMerchandiseSKU.id, 'shopMerchandiseSKU.id should not be null')
        await sdk.auth.logout()
    })
})
