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


describe('User Tests', function () {
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

    it('should fail list user items without logged-in and not submit userId', async () => {
        try {
            await sdk.user.items({})
        } catch (error) {
            // console.log('error', error)
            expect(error).to.have.property('code').that.equals('Authentication.NeedLogin')
        }
    })

    it('should list specified user\'s items successfully', async () => {
        const response = await sdk.user.items({
            userId: '665012099939827712',
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
    })

    it('should list current user\'s items successfully', async () => {
        await global.login()
        const response = await sdk.user.items()
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
        await sdk.auth.logout()
    })

    it('should paginate user\'s items successfully', async () => {
        const page = 2
        const limit = 2
        const response = await sdk.user.items({
            userId: '665012099939827712',
            limit,
            page,
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('data')
        expect(response).to.have.property('skip').that.equals((page - 1) * limit)
    })

    it('should list user\'s nfts successfully', async () => {
        const response = await sdk.user.nfts({
            userId: '665012099939827712',
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
    })

    it('should paginate user\'s nfts successfully', async () => {
        const page = 2
        const limit = 2
        const response = await sdk.user.nfts({
            userId: '665012099939827712',
            limit,
            page,
        })
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('data')
        expect(response).to.have.property('skip').that.equals((page - 1) * limit)
    })

    it('should list current user\'s nfts successfully', async () => {
        await global.login()
        const response = await sdk.user.nfts()
        // console.log('response', JSON.stringify(response))
        expect(response).to.have.property('total')
        expect(response).to.have.property('data')
        await sdk.auth.logout()
    })
})
