
const tokenKeyInLocalStorage = 'genun_token'

const Runtime = {
    hasPromptedLogin: false,
    activeRequestCount: 0,
    apiKey: null,
    token: null,
    tokenKeyInAPIResponse: 'token',
    setToken (token) {
        Runtime.token = token
        localStorage.setItem(tokenKeyInLocalStorage, token)
    },
    // getToken () {
    //     return Runtime.token || localStorage.getItem(tokenKeyInLocalStorage) || null
    // },
    removeToken () {
        Runtime.token = null
        localStorage.removeItem(tokenKeyInLocalStorage)
    },
}

Runtime.token = localStorage.getItem(tokenKeyInLocalStorage) || null

module.exports = Runtime
