/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-25 15:32:32
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-16 10:24:01
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Abnormal {
  /**
   * 获取多语言
   */
  static list (data = {}) {
    return request.get(`${URL.system}/sysExceptionMessage/selectAllValid`, data)
  }
  /**
   * 新增修改
   */
  static addEdit (data = {}) {
    if (data.edit) {
      return request.put(`${URL.system}/sysExceptionMessage/edit`, data)
    } else {
      return request.post(`${URL.system}/sysExceptionMessage/add`, data)
    }
  }
  /**
   * 删除
   */
  static remove (data = {}) {
    return request.delete(`${URL.system}/sysExceptionMessage/delete`, {}, {
      params: data
    })
  }
}

