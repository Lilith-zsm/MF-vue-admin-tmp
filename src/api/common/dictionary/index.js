/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-23 16:30:50
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-25 17:23:57
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Dictionary {
  /**
   * 根据code获取类别
   * @param {} data
   */
  static getSub (data = {}) {
    return request.get(`${URL.comBasic}/bas-sub/getSub`, data)
  }
  /**
   * 查询主类别
   */
  static mainList (data = {}) {
    return request.get(`${URL.comBasic}/bas-main/lists`, data)
  }
  /**
   * 新增/编辑主类别
   */
  static addEditMain (data = {}) {
    if (data.mainCode) {
      return request.put(`${URL.comBasic}/bas-main/edit`, data)
    } else {
      return request.post(`${URL.comBasic}/bas-main/add`, data)
    }
  }
  /**
   * 删除主类别
   */
  static deleteMain (data = {}) {
    return request.delete(`${URL.comBasic}/bas-main/delete`, data)
  }
  /**
   * 根据主类查询子类
   */
  static getSubByMain (data = {}) {
    return request.get(`${URL.comBasic}/bas-sub/list`, data)
  }
  /**
   * 新增/编辑子类
   */
  static addEditSub (data = {}) {
    if (data.subCode) {
      return request.put(`${URL.comBasic}/bas-sub/edit`, data)
    } else {
      return request.post(`${URL.comBasic}/bas-sub/add`, data)
    }
  }
  /**
   * 删除子类
   */
  static deleteSub (data = {}) {
    return request.delete(`${URL.comBasic}/bas-sub/delete`, data)
  }
}
