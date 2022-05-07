/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 19:37:28
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-01 13:52:56
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class File {
  /**
   * 上传附件
   */
  static upload (data = {}) {
    return request.post(`${URL.system}/sys-file/uploadDir`, data)
  }
  /**
   * 下载附件
   */
  static download (data = {}) {
    return request.get(`${URL.system}/sys-file/szmsddir`, data, {
      responseType: 'blob'
    })
  }
}
