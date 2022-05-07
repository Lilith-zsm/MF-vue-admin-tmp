import axios from 'axios'
import {
  message
} from './resetMessage.js'
import {
  getCookie
} from './cache'
import store from '../store'
import i18n from '@/lang'
import qs from 'qs'
class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      // timeout: 1000 * 180,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }
    return config
  }

  // 设定拦截器
  interceptors(instance) {
    instance.interceptors.request.use((config) => {
      const token = getCookie(process.env.VUE_APP_TOKEN_STR)
      const langr = getCookie(process.env.VUE_APP_LANG_STR)
      const tenantId = getCookie(process.env.VUE_APP_TENANT_STR)
      if (config.method === 'get') {
        // get请求方式下，把数组转成同名参数
        config.paramsSerializer = function (params) {
          return qs.stringify(params, {
            arrayFormat: 'repeat'
          })
        }
      }
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token // 携带权限参数
      }
      if (langr) {
        config.headers['Langr'] = langr // 携带多语言参数
      }
      if (tenantId) {
        config.headers['tenantId'] = tenantId // 携带租户id
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(response => {
      const {
        data
      } = response
      if (data.code === 200) {
        return Promise.resolve(data)
      } else if (response.config.responseType === 'blob') {
        if (response.data.type.includes('application/json')) {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
              const content = reader.result
              const fileRes = JSON.parse(content)
              message.error(i18n.tc(fileRes.msg))
              reject(fileRes)
            }
            reader.readAsText(response.data)
          })
        } else {
          return Promise.resolve(response)
        }
      } else {
        if (data.code === 403) {
          store.dispatch('LogInit', {},).then(() => {
            location.reload()
          })
        }
        data.msg ? message.error(data.msg) : ''
        return Promise.reject(response)
      }
    }, error => {
      message.error(error.response.data && error.response.data.msg ? error.response.data.msg : i18n.tc('连接失败'))
      if (error.response.status === 401) {
        store.dispatch('LogInit', {},).then(() => {
          location.reload()
        })
      }
      return Promise.reject(error)
    })
  }

  // 创建实例
  request(optios) {
    const instance = axios.create()
    const _options = Object.assign(this.getInsideConfig(), optios)
    this.interceptors(instance)
    return instance.request(_options)
  }

  get(url, params, config) {
    const options = Object.assign({
      method: 'get',
      url: url,
      params: params
    }, config)
    return this.request(options)
  }
  post(url, params, config) {
    const options = Object.assign({
      method: 'post',
      url: url,
      data: params
    }, config)
    return this.request(options)
  }

  put(url, data) {
    return this.request({
      method: 'put',
      url,
      data
    })
  }

  delete(url, data, config) {
    return this.request({
      method: 'delete',
      url,
      data,
      ...config
    })
  }
}

export default HttpRequest
