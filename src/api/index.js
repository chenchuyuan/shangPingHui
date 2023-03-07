// 将4个文件的接口统一处理
import * as tradeMark from '@/api/product/tradeMark'
import * as attr from '@/api/product/attr'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'

import * as user from '@/api/acl/user'
import role from '@/api/acl/role'
import permission from '@/api/acl/permission'
// 对外暴露
export default {
  tradeMark,
  attr,
  sku,
  spu,
  user,
  role,
  permission
}
