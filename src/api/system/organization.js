/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 10:53:09
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-02-28 13:52:22
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Organization {
  /**
   * 查询网点管理列表
   */
  static list (data = {}) {
    return request.get(`${URL.system}/site/treeselect`, data)
  }
  /**
   * 查询网点详情
   */
  static getInfo (id) {
    return request.get(`${URL.system}/site/getInfo/${id}`)
  }
  /**
   * 删除网点
   */
  static delete (id) {
    return request.delete(`${URL.system}/site/delete/${id}`)
  }
  /**
   * 查询网点管理列表(有分页)
   */
  static alertList (data = {}) {
    return request.get(`${URL.system}/site/alertList`, data)
  }
  /**
   * 新增网点管理
   */
  static add (data = {}) {
    return request.post(`${URL.system}/site/add`, data)
  }
  /**
   * 修改网点管理
   */
  static edit (data = {}) {
    return request.put(`${URL.system}/site/edit`, data)
  }
  /**
   * 删除网点管理
   */
  static remove (data = {}) {
    return request.delete(`${URL.system}/site/remove`, data)
  }
}
