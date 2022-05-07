/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-25 15:32:32
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-02 14:23:17
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Tenant {
  /**
   * 通过租户code查询租户信息
   * @param code
   */
  static getByCode (code) {
    return request.get(`${URL.system}/tenant/code/${code}`)
  }
  /**
   * token分页查询
   */
  static list (data = {}) {
    return request.get(`${URL.system}/tenant/page`, data)
  }
  /**
   * 新增修改租户
   */
  static addEdit (data = {}) {
    if (data.tenantId) {
      return request.put(`${URL.system}/tenant/update`, data)
    } else {
      return request.post(`${URL.system}/tenant/add`, data)
    }
  }
  /**
   * 删除租户
   */
  static remove (tenantId) {
    return request.delete(`${URL.system}/tenant/${tenantId}`)
  }
}
