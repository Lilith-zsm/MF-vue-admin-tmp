/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-04-14 17:30:07
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-14 17:38:47
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class PrintModule {
  /**
   * 查询列表
   */
  static list (data = {}) {
    return request.get(`${URL.system}/rul-print-module/list`, data)
  }
  /**
   * 新增
   */
  static add (data = {}) {
    return request.post(`${URL.system}/rul-print-module/add`, data)
  }
  /**
   * 编辑
   */
  static edit (data = {}) {
    return request.put(`${URL.system}/rul-print-module/edit`, data)
  }
  /**
   * 删除
   */
  static remove (data = {}) {
    return request.delete(`${URL.system}/rul-print-module/remove`, data)
  }
  /**
   * 查看
   */
  static getInfo (id) {
    return request.get(`${URL.system}/rul-print-module/getInfo${id}`)
  }
}
