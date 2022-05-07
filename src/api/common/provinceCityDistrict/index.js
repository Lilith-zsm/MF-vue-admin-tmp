/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-28 19:37:28
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-30 10:38:53
 */
import request from '@/utils/request'
import URL from '@/api/baseUrl'
export default class ProvinceCityDistrict {
  /**
   * 获取国家
   */
  static getCountry (data = {}) {
    return request.get(`${URL.comBasic}/bas-country/list`, data)
  }
  /**
   * 获取省
   */
  static getProvince (data = {}) {
    return request.get(`${URL.comBasic}/bas-province/list`, data)
  }
  /**
   * 获取市
   */
  static getCity (data = {}) {
    return request.get(`${URL.comBasic}/bas-city/list`, data)
  }
  /**
   * 获取区
   */
  static getArea (data = {}) {
    return request.get(`${URL.comBasic}/bas-area/list`, data)
  }
}
