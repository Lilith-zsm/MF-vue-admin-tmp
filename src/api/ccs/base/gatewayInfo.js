import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getGatewayInfoList(params) {
  return request({
    url: `/dms-bas/bas-pass-info/list`,
    method: 'get',
    params
  })
}
// 修改
export function putGatewayInfo(params) {
  return request({
    url: `/dms-bas/bas-pass-info/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addGatewayInfo(params) {
  return request({
    url: `/dms-bas/bas-pass-info/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteGatewayInfo(params) {
  return request({
    url: `/dms-bas/bas-pass-info/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportGatewayInfo(params) {
  return request({
    url: `/dms-bas/bas-pass-info/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
