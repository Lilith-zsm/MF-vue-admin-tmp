import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getSenderList(params) {
  return request({
    url: `/dms-bas/bas-contact/page`,
    method: 'get',
    params
  })
}
// 修改
export function putSender(params) {
  return request({
    url: `/dms-bas/bas-contact/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addSender(params) {
  return request({
    url: `/dms-bas/bas-contact/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteSender(params) {
  return request({
    url: `/dms-bas/bas-contact/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportSender(params) {
  return request({
    url: `/dms-bas/bas-contact/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
