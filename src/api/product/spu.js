import Axios from 'axios'

/**
 * spu产品列表
 * @param page
 * @param limit
 * @param category3Id
 * @returns {AxiosPromise}
 */
export const reqSpuList = (page, limit, category3Id) => { return Axios({ url: `api/admin/product/${page}/${limit}`, method: 'get', params: { category3Id }}) }

/**
 * 单个spu产品详情
 * @param spuId
 * @returns {AxiosPromise}
 */
export const reqSpu = (spuId) => { return Axios({ url: `api/admin/product/getSpuById/${spuId}`, method: 'get' }) }

/**
 * 品牌列表信息
 * @returns {AxiosPromise}
 */
export const reqTradeMarkList = () => { return Axios({ url: 'api/admin/product/baseTrademark/getTrademarkList', method: 'get' }) }

/**
 * spu图片列表
 * @param spuId
 * @returns {AxiosPromise}
 */
export const reqSpuImageList = (spuId) => { return Axios({ url: `api/admin/product/spuImageList/${spuId}`, method: 'get' }) }

/**
 * 获取平台全部销售属性（一共三个）
 * @returns {AxiosPromise}
 */
export const reqBaseSaleAttrList = () => { return Axios({ url: 'api/admin/product/baseSaleAttrList', method: 'get' }) }

/**
 * 新增或者更新spu
 * @param spu
 * @returns {AxiosPromise}
 */
export const reqSaveOrUpdateSpu = (spu) => {
  // 根据是否有 id 来判断是新增还是更新操作
  if (spu.id) {
    return Axios({ url: 'api/admin/product/updateSpuInfo', method: 'post', data: spu })
  } else {
    return Axios({ url: 'api/admin/product/saveSpuInfo', method: 'post', data: spu })
  }
}

/**
 * 删除spu
 * @param spuId
 * @returns {AxiosPromise}
 */
export const reqDeleteSpu = (spuId) => {
  return Axios({
    url: `api/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
  })
}

/**
 * 获取销售属性数据
 * @param spuId
 * @returns {AxiosPromise}
 */
export const reqSpuSaleAttrList = (spuId) => {
  return Axios({
    url: `api/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
  })
}

/**
 * 获取平台属性的数据
 * @param category1Id
 * @param category2Id
 * @param category3Id
 * @returns {AxiosPromise}
 */
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
  return Axios({
    url: `api/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}

/**
 * 添加sku
 * @param skuInfo
 * @returns {AxiosPromise}
 */
export const reqAddSku = (skuInfo) => { return Axios({ url: `/api/admin/product/saveSkuInfo`, method: 'post', data: skuInfo }) }

/**
 * 获取sku列表
 * @param spuId
 * @returns {AxiosPromise}
 */
export const reqSkuList = (spuId) => { return Axios({ url: `/api/admin/product/saveSkuInfo/${spuId}`, method: 'get' }) }
