/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2022-02-25 15:06:22
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-02-25 16:28:33
 */
import HttpRequest from './axios'
const baseApi = process.env.VUE_APP_BASE_URL
const axios = new HttpRequest(baseApi)
export default axios
