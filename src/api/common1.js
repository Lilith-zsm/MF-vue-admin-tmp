import request from '@/utils/axios'
import URL from '@/api/baseUrl'
// 获取数据字典
export function getSubName(params) {
  return request({
    url: `${URL.comBasic}/bas-sub/getSubName`,
    method: 'get',
    params
  })
}

export function getSub(params) {
  return request({
    url: `${URL.comBasic}/bas-sub/getSub`,
    method: 'get',
    params
  })
}

// 获取国家
export function getCountry(params) {
  return request({
    url: `${URL.comBasic}/bas-country/list`,
    method: 'get',
    params
  })
}

// 获取省
export function getProvince(params) {
  return request({
    url: `${URL.comBasic}/bas-province/list`,
    method: 'get',
    params
  })
}

// 获取市
export function getCity(params) {
  return request({
    url: `${URL.comBasic}/bas-city/list`,
    method: 'get',
    params
  })
}

// 获取区
export function getArea(params) {
  return request({
    url: `${URL.comBasic}/bas-area/list`,
    method: 'get',
    params
  })
}
