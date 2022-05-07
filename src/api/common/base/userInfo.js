import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// 查询
export function getUserInfoList(params) {
  return request({
    url: `${baseUrl}/bas-employees/list`,
    method: 'get',
    params
  })
}
// 修改
export function updateUserInfo(params) {
  return request({
    url: `${baseUrl}/bas-employees`,
    method: 'put',
    data: params
  })
}
// 新增
export function addUserInfo(params) {
  return request({
    url: `${baseUrl}/bas-employees`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteUserInfo(params) {
  return request({
    url: `${baseUrl}/bas-employees/${params}`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportUserInfo(params) {
  return request({
    url: `${baseUrl}/bas-employees/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
