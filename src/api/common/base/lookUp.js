import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// 查询主类别
export function getLookUpTree(params) {
  return request({
    url: `${baseUrl}/bas-main/lists`,
    method: 'get',
    params
  })
}
// 查询主类别(带分页)
export function getLookUpList(params) {
  return request({
    url: `${baseUrl}/bas-main/list`,
    method: 'get',
    params
  })
}
// 新增主类别
export function addLookUpMain(params) {
  return request({
    url: `${baseUrl}/bas-main`,
    method: 'post',
    data: params
  })
}
// 查询子类别
export function getLookUpSub(params) {
  return request({
    url: `${baseUrl}/bas-sub/list`,
    method: 'get',
    params
  })
}
// 根据name，code查询子类别（下拉框）
export function getSubName(params) {
  return request({
    url: `${baseUrl}/bas-sub/getSubName`,
    method: 'get',
    params
  })
}
// 新增子类别
export function addLookUpSub(params) {
  return request({
    url: `${baseUrl}/bas-sub`,
    method: 'post',
    data: params
  })
}
// 修改子类别
export function putLookUpSub(params) {
  return request({
    url: `${baseUrl}/bas-sub`,
    method: 'put',
    data: params
  })
}
// 子类别
// export function addLookUpSub(params) {
//   return request({
//     url: `${baseUrl}/bas-sub`,
//     method: 'post',
//     data: params
//   })
// }
// 子类别上传图片地址
export const importFileUrl = `/api${baseUrl}/bas-notice/addFile`
// 删除
export function deleteEmpInfo(params) {
  return request({
    url: `${baseUrl}/bas-sub/${params}`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportEmpInfo(params) {
  return request({
    url: `${baseUrl}/bas-employee/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
