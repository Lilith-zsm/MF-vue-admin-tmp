import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getPackagMateList(params) {
  return request({
    url: `/dms-bas/bas-packing/page`,
    method: 'get',
    params
  })
}
// 修改
export function putPackagMate(params) {
  return request({
    url: `/dms-bas/bas-packing/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addPackagMate(params) {
  return request({
    url: `/dms-bas/bas-packing/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deletePackagMate(params) {
  return request({
    url: `/dms-bas/bas-packing/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportPackagMate(params) {
  return request({
    url: `/dms-bas/bas-packing/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
