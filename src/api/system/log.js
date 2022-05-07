/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-03-23 10:40:07
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-24 17:44:11
 */
import request from '@/utils/request'
export default class Lang {
  /**
   * 登录日志
   */
  static loginList (data = {}) {
    return request.get(`/log/log/page`, data)
  }
  /**
   * 操作日志
   */
  static oprList (data = {}) {
    return request.get(`/log/basOperationLog/list`, data)
  }
}
