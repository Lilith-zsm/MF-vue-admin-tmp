import request from '@/utils/axios'
const baseUrl = '/dms-bas/bas-supplier-information'
// 查询
export function getSupplierList(params) {
  return request({
    url: `${baseUrl}/page`,
    method: 'get',
    params
  })
}
// 查询图片
export function getSupplierDetail(params) {
  return request({
    url: `${baseUrl}/getInfo/${params}`,
    method: 'get',
    params
  })
}
// 修改
export function putSupplier(params) {
  return request({
    url: `${baseUrl}/update`,
    method: 'put',
    data: params
  })
}
// // 新增
// export function addCustomerProfile(params) {
//   return request({
//     url: `${baseUrl}/add`,
//     method: 'post',
//     data: params
//   })
// }
// 删除
export function deleteSupplier(params) {
  return request({
    url: `${baseUrl}/delete`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportSupplier(params) {
  return request({
    url: `${baseUrl}/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 上传
export function getUploadCustomerPro(params) {
  return request({
    url: `/dms-bas/bas-attachment/uploadAttachment`,
    method: 'post',
    data: params
  })
}
// 上传图片地址
export const importFileUrl = '/api/bas/bas-attachment/uploadAttachment'
// 查询审核信息
export function getReviewList(params) {
  return request({
    url: `/cms-business-cms/bas-audit-log/list`,
    method: 'get',
    params
  })
}
// 审核
export function addSupplierReview(params) {
  return request({
    url: `${baseUrl}/review`,
    method: 'put',
    data: params
  })
}
// 返审
export function putSupplierBackReview(params) {
  return request({
    url: `${baseUrl}/back-review`,
    method: 'put',
    data: params
  })
}
