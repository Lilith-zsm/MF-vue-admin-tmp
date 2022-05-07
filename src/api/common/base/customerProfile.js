import request from '@/utils/axios'
// /cms-business-cms
const baseUrl = '/crs-common/cms-customer'
// 查询
export function getCustomerProfileList(params) {
  return request({
    url: `${baseUrl}/page`,
    method: 'get',
    params
  })
}
// 查询详情
export function getCustomerProfileDetail(params) {
  return request({
    url: `${baseUrl}/getInfo/${params}`,
    method: 'get',
    params
  })
}
// 查询下拉
export function getCustomerProfileSelect(params) {
  return request({
    url: `${baseUrl}/getByPassCustomer`,
    method: 'get',
    params
  })
}
// 修改
export function putCustomerProfile(params) {
  return request({
    url: `${baseUrl}/edit`,
    method: 'post',
    data: params
  })
}
// 新增
export function addCustomerProfile(params) {
  return request({
    url: `${baseUrl}/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteCustomerProfile(params) {
  return request({
    url: `${baseUrl}/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportCustomerProfile(params) {
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
    url: `/bas/bas-attachment/uploadAttachment`,
    method: 'post',
    data: params
  })
}
// 上传图片地址
export const importFileUrl = '/api/bas/bas-attachment/uploadAttachment'
// 查询审核信息
export function getReviewList(params) {
  return request({
    url: `/crs-common/bas-audit-log/list`,
    method: 'get',
    params
  })
}
// 审核
export function addReview(params) {
  return request({
    url: `${baseUrl}/audit-customer`,
    method: 'post',
    data: params
  })
}
