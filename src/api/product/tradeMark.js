// 获取品牌管理数据模块

// /admin/product/baseTrademark/{page}/{limit}
// 导入axios的二次封装文件
import request from '@/utils/request'
// export const reqtradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 由于接口不能使用，需要更换新接口，使用这种写法，/api在vue.config.js中配置
import Axios from 'axios'
export const reqtradeMarkList = (page, limit) => Axios({ url: `/api/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })

// 由于两者只相差id这一个参数，所以将新增产品和修改产品接口合并
export const addOrUpdateTradeMark = (obj) => {
  if (obj.id) {
    // 有id的时候返回修改接口
    return Axios({ url: '/api/admin/product/baseTrademark/update', method: 'put', data: obj })
  } else {
    // 没有id的时候返回新增接口
    return Axios({ url: '/api/admin/product/baseTrademark/save', method: 'post', data: obj })
  }
}

// 删除文件接口
export const deleteDateTM = (id) => Axios({ url: `/api/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
