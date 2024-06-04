
const Base = require('./base')


class ProductAPI extends Base {
    constructor ({
        endPoints,
        ...config
    } = {}) {
        super({
            ...config,
            baseURL: endPoints.v1.products,
        })
    }

    /**
     * @api {get} /api/v1/products List products
     * @apiName ListProducts
     * @apiDescription List all products
     * @apiParam {Number} [limit=10] - The size of each page
     * @apiParam {Number} [page=1] - The number of the page
     * @returns {Object[]} Products - An array of products
     */
    async list ({
        limit = 10,
        page = 1,
        ...params
    }) {
        page = page > 0 ? page : 1
        const skip = (page - 1) * limit

        const res = await this.request({
            url: '/',
            method: 'get',
            params: {
                ...params,
                $limit: limit,
                $skip: skip,
            },
        })

        if (res?.total) {
            res.page = page
        }
        return res
    }

    /**
     * @api {get} /api/v1/products/:productId Get a product
     * @apiName GetProduct
     * @apiDescription Get a product
     * @apiParam {String} productId - required, product id
     * @returns {Object[]} Product - An array of products
     */
    async detail (productId) {
        return this.request({
            url: `/${ productId }`,
            method: 'get',
            timeout: 1000 * 60 * 30,
        })
    }

    /**
     * @api {get} /api/v1/products/:productId/items List Product Items
     * @apiName ListProductItems
     * @apiDescription List product items
     * @apiParam {String} productId - required, product id
     * @apiParam {Number} [limit=10] - The size of each page
     * @apiParam {Number} [page=1] - The number of the page
     * @returns {Object[]} ProductItems - An array of product items
     */
    async items ({
        productId,
        limit = 10,
        page = 1,
        ...params
    }) {
        page = page > 0 ? page : 1
        const skip = (page - 1) * limit

        const res = await this.request({
            url: `/${ productId }/items`,
            method: 'get',
            params: {
                ...params,
                $limit: limit,
                $skip: skip,
            },
        })

        if (res?.total) {
            res.page = page
        }
        return res
    }

    /**
     * @api {get} /api/v1/products/items/:productItemId Get a product item
     * @apiName GetProductItem
     * @apiDescription Get a product item
     * @apiParam {String} productItemId - required, productItem id
     * @returns {Object} ProductItem
     */
    async itemDetail ({
        productItemId,
        // userId,
    } = {}) {
        return this.request({
            url: `/items/${ productItemId }`,
            method: 'get',
            params: {
                // u: userId,
            },
            timeout: 1000 * 60 * 30,
        })
    }

    /**
     * @api {post} /api/v1/products/:productItemId/claim Claim a product item
     * @apiName ClaimProductItem
     * @apiDescription Claim a product item
     * @apiParam {String} productItemId - required, productItem id
     * @apiParam {String} rewardCode - optional, reward code
     * @returns {Object} ProductItem
     */
    async claimItem ({
        productItemId,
        rewardCode,
    } = {}) {
        return this.request({
            url: `/items/${ productItemId }/claim`,
            method: 'post',
            data: {
                rewardCode,
            },
        })
    }

    /**
     * @api {post} /api/v1/products/:productId/claim Claim a product
     * @apiName ClaimProduct
     * @apiDescription Claim a Multi-Claim product
     * @apiParam {String} productId - required, product id
     * @apiParam {String} rewardCode - optional, reward code
     * @returns {Object} Product
     */
    async claimProduct ({
        productId,
        rewardCode,
    } = {}) {
        return this.request({
            url: `/${ productId }/claim`,
            method: 'post',
            data: {
                rewardCode,
            },
        })
    }
}


module.exports = ProductAPI
