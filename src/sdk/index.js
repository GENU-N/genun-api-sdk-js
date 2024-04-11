
const isArray = require('lodash/isArray')
const cloneDeep = require('lodash/cloneDeep')

const Endpoints = require('./endpoints')
const Runtime = require('./base/runtime')

// API Modules
const Media = require('./media')
const Auth = require('./auth')
const Gating = require('./gating')
const Product = require('./product')
const IdentityAsset = require('./identity-asset')
const User = require('./user')


const loginRequiredErrorCode = 'Authentication.NeedLogin' // Login required status code
const successCode = 200 // Success status code

const privateProperty = Symbol('ClientSDK#PrivateProperty')
const privateMountApiModules = Symbol('ClientSDK#mountModules')
const privateAddCommonResponsesHandlers = Symbol('ClientSDK#addCommonResponsesHandlers')
const privateInitializeInterceptors = Symbol('ClientSDK#initializeInterceptors')
const privateSetApiKey = Symbol('ClientSDK#setApiKey')

/**
 * SDK
 * @class
 * @classdesc SDK for interacting with the API.
 * @param {String} domain - The API domain.
 * @param {String} apiKey - The API Key.
 * @param {Array} commonResponseHandlers - Optional, response handlers for processing data returned by the API, structure: [[responseHandler, responseErrorHandler], ...].
 * @param {Function} loginRequiredHook - Optional, a login verification hook that is triggered when the API returns a `loginRequiredErrorCode`.
 * @param {Boolean} debug - Optional, whether to enable debug mode, defaults to `false`. When enabled, more error logs are output.
 * @param {Any} anyAxiosParam - Optional, axios configuration, see: https://axios-http.com/docs/req_config for details.
 */
class GENUNClient {
    constructor ({
        domain,
        apiKey,
        commonResponseHandlers = [],
        loginRequiredHook,
        debug = false,
        ...axiosConfig
    } = {}) {
        this[privateProperty] = {}
        this[privateProperty].domain = domain
        this[privateProperty].apiKey = apiKey
        this[privateProperty].debug = debug
        this[privateProperty].loginRequiredErrorCode = loginRequiredErrorCode
        this.endPoints = Endpoints(domain)

        this[privateProperty].config = {
            ...axiosConfig,
            debug,
            domain,
            apiKey,
            endPoints: this.endPoints,
            successCode,
            loginRequiredErrorCode,
            loginRequiredHook,
        }

        this[privateProperty].commonResponseHandlers = commonResponseHandlers
        this[privateProperty].modules = {
        }

        this[privateMountApiModules]('media', Media)
        this[privateMountApiModules]('auth', Auth)
        this[privateMountApiModules]('gating', Gating)
        this[privateMountApiModules]('product', Product)
        this[privateMountApiModules]('identityAsset', IdentityAsset)
        this[privateMountApiModules]('user', User)

        this[privateAddCommonResponsesHandlers]()
    }

    [privateMountApiModules] (moduleName, ApiModule) {
        const config = cloneDeep(this[privateProperty].config)
        const apiModule = new ApiModule(config)
        this[privateProperty].modules[moduleName] = apiModule
        this[moduleName] = apiModule
    }

    [privateAddCommonResponsesHandlers] (commonResponseHandlers) {
        commonResponseHandlers = commonResponseHandlers || this.commonResponseHandlers
        if (!isArray(commonResponseHandlers) || commonResponseHandlers.length < 1) {
            return
        }

        for (const [successHandler, errorHandler] of commonResponseHandlers) {
            for (const moduleName of Object.keys(this[privateProperty].modules)) {
                this[moduleName].addResponseInterceptor({
                    successHandler,
                    errorHandler,
                })
            }
        }
    }

    removeToken () {
        Runtime.token = null
    }
}

module.exports = GENUNClient
