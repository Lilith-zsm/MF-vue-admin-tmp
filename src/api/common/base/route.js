import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getRouteList(params) {
  return request({
    url: `${baseUrl}/bas-flight/list`,
    method: 'get',
    params
  })
}
// 修改
export function putRoute(params) {
  return request({
    url: `${baseUrl}/bas-flight/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addRoute(params) {
  return request({
    url: `${baseUrl}/bas-flight/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteRoute(params) {
  return request({
    url: `${baseUrl}/bas-flight/remove`,
    method: 'delete',
    data: params
  })
}

