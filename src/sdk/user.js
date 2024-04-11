
const Base = require('./base')


class ProductAPI extends Base {
    constructor ({
        endPoints,
        ...config
    } = {}) {
        super({
            ...config,
            baseURL: endPoints.v1.user,
        })
    }

    /**
     * @api {get} /api/v1/users/items List items for a specified user
     * @apiName ListItems
     * @apiDescription List items of user
     * @apiParam {String} userId - optional, used to list items for a certain user Id. If not provided, the current user's items will be listed
     * @apiParam {Number} [limit=10] - The size of each page
     * @apiParam {Number} [page=1] - The number of the page
     * @returns {Object[]} Items - An array of items
     */
    async items ({
        userId,
        limit = 10,
        page = 1,
        ...params
    } = {}) {
        page = page > 0 ? page : 1
        const skip = (page - 1) * limit

        const res = await this.request({
            url: '/items',
            params: {
                ...params,
                u: userId,
                $limit: limit,
                $skip: skip,
            },
            method: 'get',
        })

        if (res?.total) {
            res.page = page
        }
        return res
    }

    /**
     * @api {get} /api/v1/users/nfts List nfts for a specified user
     * @apiName ListNfts
     * @apiDescription List nfts of user
     * @apiParam {String} userId - optional, used to list nfts for a certain user Id. If not provided, the current user's nfts will be listed
     * @apiParam {Number} [limit=10] - The size of each page
     * @apiParam {Number} [page=1] - The number of the page
     * @returns {Object[]} Nfts
     */
    async nfts ({
        userId,
        limit = 10,
        page = 1,
        ...params
    } = {}) {
        page = page > 0 ? page : 1
        const skip = (page - 1) * limit

        const res = await this.request({
            url: '/nfts',
            params: {
                ...params,
                u: userId,
                $limit: limit,
                $skip: skip,
            },
            method: 'get',
        })

        if (res?.total) {
            res.page = page
        }
        return res
    }

    /**
     * @api {post} /api/v1/users/security-auth-password Security auth current logged-in user's password
     * @apiName SecurityAuthUserPassword
     * @requires logged-in
     * @apiParam {String} password - required, password
     * @returns {Object} { code: 200 }
     */
    async securityAuthPassword ({
        password,
    } = {}) {
        return this.request({
            url: '/security-auth-password',
            data: {
                password,
            },
            method: 'post',
        })
    }

    /**
     * @api {post} /api/v1/users/security-auth-wallet Security auth current logged-in user's wallet
     * @apiName SecurityAuthUserWallet
     * @requires logged-in
     * @apiParam {String} id - required, id
     * @apiParam {String} account - required, wallet account
     * @apiParam {String} timestamp - required, unix timestamp
     * @apiParam {String} signature - required, an EIP712 signature generated by a wallet tool such as MetaMask
     * @apiParam {String} walletType - required, wallet type
     * @returns {Object} { code: 200 }
     */
    async securityAuthWallet ({
        id,
        account,
        timestamp,
        signature,
        walletType,
    } = {}) {
        return this.request({
            url: '/security-auth-wallet',
            data: {
                id,
                account,
                timestamp,
                signature,
                walletType,
            },
            method: 'post',
        })
    }


    /**
     * @api {get} /api/v1/users/profile Get current logged-in user's profile
     * @apiName GetUserProfile
     * @requires logged-in
     * @returns {Object} Profile
     */
    async getProfile (userId) {
        return this.request({
            url: '/profile',
            method: 'get',
            params: {
                u: userId,
            },
        })
    }

    /**
     * @api {post} /api/v1/users/check-email Check if a email was registered on the platform
     * @apiName Users.checkIfEmailExists
     * @apiParam {String} email - required, email
     * @returns {Object} { exists }
     */
    async checkEmail (email) {
        return this.request({
            url: '/check-email',
            method: 'post',
            data: {
                email,
            },
        })
    }

    /**
     * @api {post} /api/v1/users/otp Send OTP to email
     * @apiName Users.sendOTP
     * @apiParam {String} email - required, email
     * @returns {Object} { code: 200, message: 'OTP has been sent to your email' }
     */
    async sendOTP ({
        email,
    } = {}) {
        return this.request({
            url: '/otp',
            method: 'post',
            data: {
                email,
            },
        })
    }

    /**
     * @api {post} /api/v1/users/profile Update current logged-in user's profile
     * @apiName UpdateUserProfile
     * @requires logged-in
     * @apiParam {String} email - optional
     * @apiParam {String} otp - optional
     * @apiParam {String} firstName - optional
     * @apiParam {String} lastName - optional
     * @returns {Object} Profile
     */
    async modifyProfile ({
        email,
        otp,
        firstName,
        lastName,
    } = {}) {
        if (birthday && !isValidDateString(birthday)) {
            const error = new Error('Invalid Date of Birth')
            error.code = 'Account.InvalidBirthday'
            error.internalCode = 'Account.InvalidBirthday'
            error.name = 'GENUNClient'
            error.level = 'error'
            error.cause = {
                birthday,
            }
            error.timestamp = new Date().toISOString()
        }
        return this.request({
            url: '/profile',
            data: {
                email,
                otp,
                firstName,
                lastName,
            },
            method: 'post',
        })
    }

    /**
     * @api {get} /api/v1/users/password/status Get current logged-in user's password status
     * @apiName GetUserPasswordStatus
     * @requires logged-in
     * @returns {Object} { passwordHasBeenSet: Boolean }
     */
    async getPasswordStatus () {
        return this.request({
            url: '/password/status',
            method: 'get',
        })
    }

    /**
     * @api {post} /api/v1/users/password Modify current logged-in user's password
     * @apiName ModifyUserPassword
     * @requires logged-in
     * @apiParam {String} oldPassword - optional, old password
     * @apiParam {String} newPassword - required, new password
     * @apiParam {String} reconfirmNewPassword - required, reconfirm new password
     * @returns {Object} { code: 200 }
     */
    async modifyPassword ({
        oldPassword,
        newPassword,
        reconfirmNewPassword,
    } = {}) {
        return this.request({
            url: '/password',
            data: {
                oldPassword,
                newPassword,
                reconfirmNewPassword,
            },
            method: 'post',
        })
    }
}


module.exports = ProductAPI
