/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-14 17:30:07
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-14 17:43:52
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class printTemplate {
  /**
   * 查询列表
   */
  static list (data = {}) {
    return request.get(`${URL.system}/rul-print-template/list`, data)
  }
  /**
   * 新增
   */
  static add (data = {}) {
    return request.post(`${URL.system}/rul-print-template/add`, data)
  }
  /**
   * 编辑
   */
  static edit (data = {}) {
    return request.put(`${URL.system}/rul-print-template/edit`, data)
  }
  /**
   * 删除
   */
  static remove (data = {}) {
    return request.delete(`${URL.system}/rul-print-template/remove`, data)
  }
  /**
   * 查看
   */
  static getInfo (id) {
    return request.get(`${URL.system}/rul-print-template/getInfo${id}`)
  }
  /**
   * 修改状态
   */
  static updateState (data = {}) {
    return request.put(`${URL.system}/rul-print-template/state`, data)
  }
  /**
   * 预览
   */
  static preview (data = {}) {
    return request.post(`${URL.system}/rul-print-template/preview`, data, {
      responseType: 'blob'
    })
  }
  /**
   * 服务配置
   */
  static serviceConfig (data = {}) {
    return request.put(`${URL.system}/rul-print-template/serviceConfig`, data)
  }
}
