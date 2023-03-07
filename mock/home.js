// 因为有data.json文件，所以不需要使用生成的测试数据，直接导入文件数据即可
// const Mock = require('mockjs')
//
// const data = Mock.mock({
//   'items|30': [{
//     id: '@id',
//     title: '@sentence(10, 20)',
//     'status|1': ['published', 'draft', 'deleted'],
//     author: 'name',
//     display_time: '@datetime',
//     pageviews: '@integer(300, 5000)'
//   }]
// })
const data = require('./data.json')
module.exports = [
  {
    // 路径进行配置
    url: '/home/list',
    // 发送的请求类型
    type: 'get',
    // 返回的数据
    response: config => {
      return {
        code: 20000,
        data: data // 可以使用省略写法
      }
    }
  }
]
