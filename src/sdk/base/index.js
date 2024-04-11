
const isFunction = require('lodash/isFunction')

const Request = require('./request')
const Runtime = require('./runtime')


class APIClient extends Request {
    constructor ({
        successCode,
        loginRequiredErrorCode,
        loginRequiredHook,
        apiKey = null,
        debug = false,
        ...config
    } = {}) {
        super(config)

        this.successCode = successCode
        this.loginRequiredErrorCode = loginRequiredErrorCode
        this.loginRequiredHook = loginRequiredHook
        this.token = null
        this.debug = debug
        this.Runtime = Runtime
        if (Runtime.apiKey !== apiKey) {
            Runtime.apiKey = apiKey
        }
    }

    baseRequestHandler (config) {
        if (config.skipApiKey !== true && this.Runtime.apiKey) {
            config.headers['x-api-key'] = this.Runtime.apiKey
        }

        if (config.skipAuth !== true && this.Runtime.token) {
            config.headers.Authorization = `Bearer ${ this.Runtime.token }`
        }

        // if (Runtime.activeRequestCount === 0 && Runtime.hasPromptedLogin === true) {
        //     Runtime.hasPromptedLogin = false
        // }

        return config
    }

    baseResponseErrorHandler (error) {
        return Promise.reject(error)
    }

    baseResponseHandler (response) {
        const {
            loginRequiredErrorCode,
            loginRequiredHook,
        } = this

        const data = response.data || {}

        if (data.code === loginRequiredErrorCode && isFunction(loginRequiredHook)) {
            this.Runtime.removeToken()
            return loginRequiredHook(data)
        }

        if (data.code !== this.successCode) {
            if (this.debug) {
                console.log('TokenGatingAPIClient:error:response', response)
            }
            return Promise.reject(data)
        }

        return typeof data.data === 'undefined' ? data : data.data
    }

    hasLoggedIn () {
        return !!this.Runtime.token
    }

    getToken () {
        return this.Runtime.token
    }
}


module.exports = APIClient
