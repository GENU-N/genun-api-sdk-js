
const Base = require('./base')


class GatingAPI extends Base {
    constructor ({
        endPoints,
        ...config
    } = {}) {
        super({
            ...config,
            baseURL: endPoints.v1.gating,
        })
    }

    /**
     * @api {get} /api/v1/gating/verify Verify if user has special NFTs to access exclusive content
     * @apiName VerifyNFT
     * @requires logged-in
     * @returns {Object} { accessGranted: Boolean }
     */
    async verify () {
        return this.request({
            url: '/verify',
            method: 'get',
            timeout: 1000 * 60 * 30,
        })
    }
}


module.exports = GatingAPI
