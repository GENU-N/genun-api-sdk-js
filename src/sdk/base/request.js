
const axios = require('axios')
const isFunction = require('lodash/isFunction')

const Runtime = require('./runtime')

const isBrowser = typeof navigator === 'object'
const defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'


const retryableHttpNetworkErrors = [
    'RETRY', // Custom error code, used to initiate a retry request when a business logic error occurs
    // 'EBADF', // Socket is not a valid file descriptor
    // 'ENOTSOCK', // File descriptor is not a socket
    // 'EADDRNOTAVAIL', // The specified address is not available on the remote machine
    // 'EAFNOSUPPORT', // Socket does not support the address family of addr
    // 'EISCONN', // Socket is already connected
    'EPIPE', // Broken pipe
    'ETIMEDOUT', // Connection timed out
    'ECONNREFUSED', // Connection actively refused by the server
    'ENETUNREACH', // Network is unreachable from the local machine to the given addr
    // 'EADDRINUSE', // The socket address of the given addr is already in use
    // 'EINPROGRESS', // Socket is non-blocking and the connection cannot be established immediately
    // 'EALREADY', // Socket is non-blocking and has a pending connection
    'ENOTFOUND', // DNS resolution issue
    'ECONNABORTED', // Connection aborted by software
    'ECONNRESET' // Connection reset by peer
]

const formatterError = function (error) {
    const err = new Error()
    err.code = error.code
    err.status = error.response ? error.response.status : ''
    err.message = error.message
    err.syscall = error.syscall
    err.address = error.address
    err.port = error.port
    err.config = error.config
    err.stack = error.stack

    if (retryableHttpNetworkErrors.includes(err.code)) {
        err.retryable = true
    }

    return err
}


class Request {
    constructor ({
        requestHandler,
        requestErrorHandler,
        successHandler,
        errorHandler,
        ...config
    }) {
        config.headers = config.headers || {}
        if (!isBrowser) {
            config.headers['User-Agent'] = config.headers['User-Agent'] || defaultUserAgent
        }
        this.request = axios.create(config)
        this.requestHandler = requestHandler
        this.requestErrorHandler = requestErrorHandler
        this.successHandler = successHandler
        this.errorHandler = errorHandler

        // this.addRequestInterceptor({
        //     requestHandler (config) {
        //         Runtime.activeRequestCount += 1
        //         return config
        //     }
        // })
        // this.addResponseInterceptor({
        //     successHandler (res) {
        //         Runtime.activeRequestCount -= 1
        //         return res
        //     },
        //     errorHandler (error) {
        //         Runtime.activeRequestCount -= 1
        //         return Promise.reject(error)
        //     }
        // })


        this.addRequestInterceptor({
            requestHandler: this.baseRequestHandler.bind(this),
            requestErrorHandler: this.baseRequestErrorHandler.bind(this),
        })
        this.addResponseInterceptor({
            successHandler: this.baseResponseHandler.bind(this),
            errorHandler: this.baseResponseErrorHandler.bind(this),
        })


        this.addRequestInterceptor({
            requestHandler,
            requestErrorHandler,
        })

        this.addResponseInterceptor({
            successHandler,
            errorHandler,
        })
    }

    addRequestInterceptor ({
        requestHandler,
        requestErrorHandler,
    }) {
        if (!isFunction(requestHandler) && !isFunction(requestErrorHandler)) {
            return
        }

        requestHandler = isFunction(requestHandler) ? requestHandler : undefined
        requestErrorHandler = isFunction(requestErrorHandler) ? requestErrorHandler : undefined

        this.request.interceptors.request.use(requestHandler, requestErrorHandler)
    }

    addResponseInterceptor ({
        successHandler,
        errorHandler,
    }) {
        if (!isFunction(successHandler) && !isFunction(errorHandler)) {
            return
        }

        successHandler = isFunction(successHandler) ? successHandler : undefined
        errorHandler = isFunction(errorHandler) ? errorHandler : undefined

        this.request.interceptors.response.use(successHandler, errorHandler)
    }

    baseRequestHandler (config) {
        return config
    }

    baseRequestErrorHandler (error) {
        return Promise.reject(error)
    }

    baseResponseHandler (res) {
        return res.data
    }

    baseResponseErrorHandler (error) {
        return Promise.reject(formatterError(error))
    }
}


module.exports = Request
