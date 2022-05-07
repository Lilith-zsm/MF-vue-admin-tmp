/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 10:43:09
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-02-28 10:46:29
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class User {
  /**
   * 获取用户列表
   * @param {} data
   */
  static list (data = {}) {
    return request.get(`${URL.system}/user/list`, data)
  }
  /**
   * 新增用户
   * @param {} data
   */
  static add (data = {}) {
    return request.post(`${URL.system}/user`, data)
  }
  /**
   * 修改用户
   * @param {} data
   */
  static edit (data = {}) {
    return request.put(`${URL.system}/user`, data)
  }
  /**
   * 修改用户PC
   * @param {} data
   */
  static editPC (data = {}) {
    return request.put(`${URL.system}/user/edit`, data)
  }
  /**
   * 修改用户APP
   * @param {} data
   */
  static editAPP (data = {}) {
    return request.put(`${URL.system}/user/editapp`, data)
  }
  /**
   *  状态修改
   * @param {} data
   */
  static changeStatus (data = {}) {
    return request.put(`${URL.system}/user/changeStatus`, data)
  }
  /**
   *  删除用户
   * @param {} data
   */
  static remove (data = {}) {
    return request.delete(`${URL.system}/user/${data}`, data)
  }
  /**
   *  根据用户编号获取详细信息
   * @param {} data
   */
  static getInfo (data = {}) {
    return request.get(`${URL.system}/user/${data}`, data)
  }
}
