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
        const response = await sdk.product.detail('715996676510187520')
        // console.log('@response', JSON.stringify(response))
        expect(response).to.have.property('id')
        // assert.isNotNull(response.productItem.id, 'productItem.id should not be null')
    })

    it('should list product items successfully', async () => {
        const response = await sdk.product.items({
            productId: '715996676510187520',
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
            productId: '715996676510187520',
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
            productItemId: '715996898548252672',
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('productItem')
        assert.isNotNull(response.productItem.id, 'productItem.id should not be null')
    })

    it('should get product item detail by logged-in user successfully', async () => {
        await global.login()
        const response = await sdk.product.itemDetail({
            productItemId: '715996898548252672',
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('productItem')
        assert.isNotNull(response.productItem.id, 'productItem.id should not be null')
        await sdk.auth.logout()
    })

    // // Individually test the authentication URL of the product (item)
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
    //     expect(response).to.have.property('productItemId')
    // })

    // Test the authentication URL of the product (item) + claim product(item)
    it('should claim One-Time Claim product item successfully', async function () {
        try {
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
            expect(response).to.have.property('productItemId')

            const claimResponse = await sdk.product.claimItem({ productItemId: response.productItemId })
            // console.log('claimResponse', JSON.stringify(claimResponse))
            expect(claimResponse).to.have.property('productItem')
            assert.isNotNull(claimResponse.productItem.id, 'productItem.id should not be null')
            await sdk.auth.logout()
        } catch (error) {
            console.log('error', error)
            throw error
        }
    })

    // // Test the authentication URL of the product (item) + claim product(item)
    // it('should claim Multi-Time Claim product item successfully', async function () {
    //     try {
    //         if (!AppConfig?.claimableProduct?.qrcodeUrl) {
    //             this.skip()
    //         }
    //         const parsedUrl = new URL(AppConfig.claimableProduct.qrcodeUrl)
    //         const queryParams = new URLSearchParams(parsedUrl.search)
    //         const secureCode = (queryParams.get('e') || '').trim()
    //         if (!secureCode) {
    //             this.skip()
    //         }

    //         await global.login()

    //         const response = await sdk.identityAsset.authenticate(secureCode)
    //         console.log('response', JSON.stringify(response))
    //         expect(response).to.have.property('productId')

    //         const claimResponse = await sdk.product.claimProduct({
    //             productId: response.productId,
    //         })
    //         console.log('claimResponse', JSON.stringify(claimResponse))
    //         expect(claimResponse).to.have.property('product')
    //         assert.isNotNull(claimResponse.product.id, 'product.id should not be null')
    //         await sdk.auth.logout()
    //     } catch (error) {
    //         console.log('error', error)
    //         throw error
    //     }
    // })
})
