import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getLicensedItemsList(params) {
  return request({
    url: `/dms-bas/bas-license-info/list`,
    method: 'get',
    params
  })
}
// 修改
export function putLicensedItems(params) {
  return request({
    url: `/dms-bas/bas-license-info/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addLicensedItems(params) {
  return request({
    url: `/dms-bas/bas-license-info/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteLicensedItems(params) {
  return request({
    url: `/dms-bas/bas-license-info/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportLicensedItems(params) {
  return request({
    url: `/dms-bas/bas-license-info/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
