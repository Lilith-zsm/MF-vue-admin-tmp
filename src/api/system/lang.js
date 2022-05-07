/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-25 15:32:32
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-02-28 14:49:45
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class Lang {
  /**
   * 获取多语言
   */
  static list (data = {}) {
    return request.get(`${URL.system}/syslanres/list`, data)
  }
  /**
   * 新增
   */
  static add (data = {}) {
    return request.post(`${URL.system}/syslanres/add`, data)
  }
  /**
   * 新增
   */
  static addMore (data = {}) {
    return request.post(`${URL.system}/syslanres/addMore`, data)
  }
  /**
   * 修改
   */
  static edit (data = {}) {
    return request.put(`${URL.system}/syslanres/edit`, data)
  }
  /**
   * 删除
   */
  static remove (data = {}) {
    return request.delete(`${URL.system}/syslanres/delete`, data)
  }
  /**
   * 导出
   */
  static export (data = {}) {
    return request.get(`${URL.system}/syslanres/export`, data, {
      responseType: 'blob'
    })
  }
  /**
   * 导入
   */
  static import (data = {}, fn) {
    return request.post(`${URL.system}/syslanres/import`, data, {
      onUploadProgress(e) {
        fn(e)
      }
    })
  }
  /**
   * 下载模板
   */
  static downloadTemp (data = {}) {
    return request.get(`${URL.system}/syslanres/downloadImportTemplate`, data, {
      responseType: 'blob'
    })
  }
}

