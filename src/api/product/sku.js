import Axios from 'axios'
/**
 * 获取sku列表
 * @param page
 * @param limit
 * @returns {*}
 */
export const reqSkuList = (page, limit) => {
  return Axios({
    url: `/api/admin/product/list/${page}/${limit}`,
    method: 'get'
  })
}

/**
 * 上架
 * @param skuId
 * @returns {AxiosPromise}
 */
export const onSale = (skuId) => {
  return Axios({
    url: `/api/admin/product/onSale/${skuId}`,
    method: 'get'
  })
}

/**
 * 下架
 * @param skuId
 * @returns {AxiosPromise}
 */
export const cancelSale = (skuId) => {
  return Axios({
    url: `/api/admin/product/cancelSale/${skuId}`,
    method: 'get'
  })
}

/**
 * 获取sku详情
 * @param skuId
 * @returns {AxiosPromise}
 */
export const reqSkuById = (skuId) => {
  return Axios({
    url: `/api/admin/product/getSkuById/${skuId}`,
    method: 'get'
  })
}
