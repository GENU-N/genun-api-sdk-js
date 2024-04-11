
const Base = require('./base')


class ProductAPI extends Base {
    constructor ({
        endPoints,
        ...config
    } = {}) {
        super({
            ...config,
            baseURL: endPoints.v1.identityAssets,
        })
    }

    /**
     * @api {post} /api/v1/identity-assets/authenticate Authenticate Identity Asset (Ntag or QR Code Authentication)
     * @apiName AuthenticateIdentityAsset
     * @apiParam {String} secureCode - required, the "e" parameter within the query of the authentication URL from Ntag chip or QR Code
     * @returns {Object} { tagHasNotBeenTampered, shopMerchandiseSKUId }
     */
    async authenticate (secureCode) {
        return this.request({
            url: '/authenticate',
            data: {
                secureCode,
            },
            method: 'post',
        })
    }
}


module.exports = ProductAPI
