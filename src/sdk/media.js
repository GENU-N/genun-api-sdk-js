
const urlJoin = require('./url-join')
const Base = require('./base')


class MediaAPI extends Base {
    constructor ({
        domain,
        mediaEndpoint = '/api/uploaded/',
        endPoints,
        ...config
    } = {}) {
        super({
            ...config,
            baseURL: endPoints.v1.media,
        })
        this.domain = domain
        this.mediaEndpoint = mediaEndpoint
        this.endpoint = urlJoin(domain, mediaEndpoint)
    }

    /**
     * Generates the URL for accessing media resources hosted on the platform.
     *
     * @param {String} mediaId - The unique identifier for the media resource.
     * @returns {String} - The full URL to access the media resource.
     */
    async generateMediaResourceUrl (mediaId) {
        return urlJoin(this.endpoint, mediaId)
    }
}


module.exports = MediaAPI
