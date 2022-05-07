/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-11 14:02:24
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Announcement {
  /**
   * 查询
   * @param {} data
   */
  static list (data = {}) {
    return request.get(`${URL.dms}/bas-notice/list`, data)
  }
  /**
   * 发公告
   */
  static add (data = {}) {
    return request.post(`${URL.comBasic}/bas-notice`, data)
  }
  /**
   * 删除
   */
  static delete (data) {
    return request.delete(`${URL.comBasic}/bas-notice/${data}`, data)
  }
}
