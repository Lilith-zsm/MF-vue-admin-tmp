import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getAuthorizationList(params) {
  return request({
    url: `${baseUrl}/bas-auth-brand/list`,
    method: 'get',
    params
  })
}
// 修改
export function putAuthorization(params) {
  return request({
    url: `${baseUrl}/bas-auth-brand/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addAuthorization(params) {
  return request({
    url: `${baseUrl}/bas-auth-brand/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteAuthorization(params) {
  return request({
    url: `${baseUrl}/bas-auth-brand/remove`,
    method: 'delete',
    data: params
  })
}

