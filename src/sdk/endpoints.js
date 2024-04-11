
const cloneDeep = require('lodash/cloneDeep')

const urlJoin = require('./url-join')


const Endpoints = {
    domain: '',
    currentVersion: 'v1',
    versionEndpoints: {
        v1: '/api/v1/',
    },
    v1: {
        auth: '/',
        media: '',
        products: '/products',
        identityAssets: '/identity-assets',
        gating: '/gating',
        user: '/users',
    },
}


module.exports = function (domain) {
    const endpoints = cloneDeep(Endpoints)
    endpoints.domain = domain
    for (const version of Object.keys(endpoints.versionEndpoints)) {
        const versionEndpoint = urlJoin(domain, endpoints.versionEndpoints[version])
        endpoints.versionEndpoints[version] = versionEndpoint
        for (const moduleName of Object.keys(endpoints[version])) {
            endpoints[version][moduleName] = urlJoin(versionEndpoint, endpoints[version][moduleName])
        }
    }
    return endpoints
}
