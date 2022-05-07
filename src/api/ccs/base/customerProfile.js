import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getCustomerProfileList(params) {
  return request({
    url: `/dms-bas/bas-customer/list`,
    method: 'get',
    params
  })
}
// 查询下拉
export function getCustomerProfileData(params) {
  return request({
    url: `/dms-bas/bas-customer/selectList`,
    method: 'get',
    params
  })
}
// 修改
export function putCustomerProfile(params) {
  return request({
    url: `/dms-bas/bas-customer/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addCustomerProfile(params) {
  return request({
    url: `/dms-bas/bas-customer/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteCustomerProfile(params) {
  return request({
    url: `/dms-bas/bas-customer/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportCustomerProfile(params) {
  return request({
    url: `/dms-bas/bas-customer/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 上传
export function getUploadCustomerPro(params) {
  return request({
    url: `/dms-bas/bas-file-info/upload`,
    method: 'post',
    data: params
  })
}
// 附件查询
export function getUploadList(params) {
  return request({
    url: `/dms-bas/bas-file-info/list`,
    method: 'get',
    params
  })
}
// 图片查询
export function getUploadImgList(params) {
  return request({
    url: `/dms-bas/bas-file-info/downloadById/${params}`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 附件删除
export function deleteUpload(params) {
  return request({
    url: `/dms-bas/bas-file-info/remove`,
    method: 'delete',
    data: params
  })
}
// 下载
export function exportUpload(params) {
  return request({
    url: `/dms-bas/bas-file-info/downloadById/${params}`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 上传文件地址
export const importFileUrl = '/api/dms-bas/bas-file-info/upload'

// 下载模板
export function exportTemplate(params) {
  return request({
    url: `${baseUrl}/bas-customer/downloadImportTemplate`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 导入上传
export function uploadFileList(params) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `/dms-bas/bas-customer/importData`,
    method: 'post',
    timeout: 900000,
    data: params
  })
}
// 导入地址
export const importClient1 = '/api/dms-bas/bas-customer/importData'
