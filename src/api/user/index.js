/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-02 13:44:47
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class User {
  /**
   * 获取验证码
   * @param {} data
   */
  static code (data = {}) {
    return request.get(`/code`, data)
  }
  /**
   * 登录
   * @param {} data
   */
  static token (data = {}) {
    return request.post(`${URL.auth}/oauth/token`, {}, {
      headers: { 'Authorization': 'Basic dGVzdDp0ZXN0' },
      params: data
    })
  }

  /**
   * 登出
   * @param {} data
   */
  static logout (data = {}) {
    return request.delete(`${URL.auth}/token/logout`, data)
  }

  /**
   * 获取用户信息
   * @param {} data
   */
  static getUserInfo (data = {}) {
    return request.get(`${URL.system}/user/getInfo`, data)
  }

  /**
   * 获取多语言
   * @param {} data
   */
  static getLang (data = {}) {
    return request.get(`${URL.system}/syslanres/lists`, data)
  }
  /**
   * 获取路由
   * @param {} data
   */
  static getRouters (data = {}) {
    return request.get(`${URL.system}/menu/getRouters`, data)
  }
  /**
   * 修改密码
   * @param {} data
   */
  static editPsw (data = {}) {
    return request.put(`${URL.system}/user/editPsw`, data)
  }
  /**
   * 获取用户列表
   * @param {} data
   */
  static getUserList (data = {}) {
    return request.put(`${URL.user}/list/get`, data)
  }
}

