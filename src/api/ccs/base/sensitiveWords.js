import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getSensitiveWordsList(params) {
  return request({
    url: `/dms-bas/bas-sensitive-words/list`,
    method: 'get',
    params
  })
}
// 修改
export function putSensitiveWords(params) {
  return request({
    url: `/dms-bas/bas-sensitive-words/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addSensitiveWords(params) {
  return request({
    url: `/dms-bas/bas-sensitive-words/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteSensitiveWords(params) {
  return request({
    url: `/dms-bas/bas-sensitive-words/remove`,
    method: 'delete',
    data: params
  })
}
