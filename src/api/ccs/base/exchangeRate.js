import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getExchangeRateList(params) {
  return request({
    url: `/dms-bas/bas-rate-info/list`,
    method: 'get',
    params
  })
}
// 修改
export function putExchangeRate(params) {
  return request({
    url: `/dms-bas/bas-rate-info/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addExchangeRate(params) {
  return request({
    url: `/dms-bas/bas-rate-info/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteExchangeRate(params) {
  return request({
    url: `/dms-bas/bas-rate-info/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportExchangeRate(params) {
  return request({
    url: `/dms-bas/bas-rate-info/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
