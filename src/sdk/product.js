
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
     * @api {get} /api/v1/products/:shopMerchandiseId Get a product
     * @apiName GetProduct
     * @apiDescription Get a product
     * @apiParam {String} shopMerchandiseId - required, shopMerchandise id
     * @returns {Object[]} Product - An array of products
     */
    async detail (shopMerchandiseId) {
        return this.request({
            url: `/${ shopMerchandiseId }`,
            method: 'get',
            timeout: 1000 * 60 * 30,
        })
    }

    /**
     * @api {get} /api/v1/products/:shopMerchandiseId/items List Product Items
     * @apiName ListProductItems
     * @apiDescription List product items
     * @apiParam {String} shopMerchandiseId - required, shopMerchandise id
     * @apiParam {Number} [limit=10] - The size of each page
     * @apiParam {Number} [page=1] - The number of the page
     * @returns {Object[]} ProductItems - An array of product items
     */
    async items ({
        shopMerchandiseId,
        limit = 10,
        page = 1,
        ...params
    }) {
        page = page > 0 ? page : 1
        const skip = (page - 1) * limit

        const res = await this.request({
            url: `/${ shopMerchandiseId }/items`,
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
     * @api {get} /api/v1/products/items/:shopMerchandiseSKUId Get a product item
     * @apiName GetProductItem
     * @apiDescription Get a product item
     * @apiParam {String} shopMerchandiseSKUId - required, shopMerchandiseSKU id
     * @returns {Object} ProductItem
     */
    async itemDetail ({
        shopMerchandiseSKUId,
        // userId,
    } = {}) {
        return this.request({
            url: `/items/${ shopMerchandiseSKUId }`,
            method: 'get',
            params: {
                // u: userId,
            },
            timeout: 1000 * 60 * 30,
        })
    }

    /**
     * @api {post} /api/v1/products/:shopMerchandiseSKUId/claim Claim a product item
     * @apiName ClaimProductItem
     * @apiDescription Claim a product item
     * @apiParam {String} shopMerchandiseSKUId - required, shopMerchandiseSKU id
     * @returns {Object} ProductItem
     */
    async claimItem (shopMerchandiseSKUId) {
        return this.request({
            url: `/${ shopMerchandiseSKUId }/claim`,
            method: 'post',
            data: {
                shopMerchandiseSKUId,
            },
        })
    }
}


module.exports = ProductAPI
