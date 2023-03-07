// 平台属性管理模块接口
import Axios from 'axios'

/**
 * 级联选择一接口
 * @returns {Obj} list数组
 */
export const reqCategoryOne = () => { return Axios({ url: '/api/admin/product/getCategory1', method: 'get' }) }

/**
 * 级联选择二接口
 * @param {number} category1Id
 * @returns
 */
export const reqCategoryTwo = (category1Id) => { return Axios({ url: `/api/admin/product/getCategory2/${category1Id}`, method: 'get' }) }

/**
 * 级联选择三接口
 * @param {number} category2Id
 * @returns
 */
export const reqCategoryThree = (category2Id) => { return Axios({ url: `/api/admin/product/getCategory3/${category2Id}`, method: 'get' }) }

/**
 * 获取属性列表
 * @param category1Id
 * @param category2Id
 * @param category3Id
 * @returns {AxiosPromise}
 */
export const getAttrInfoList = (category1Id, category2Id, category3Id) => { return Axios({ url: `/api/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get' }) }

/**
 * 添加|编辑属性
 * @param data
 * @returns {AxiosPromise}
 */
export const saveOrEditAttrInfo = (data) => { return Axios({ url: 'api/admin/product/saveAttrInfo', method: 'post', data }) }
