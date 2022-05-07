import request from '@/utils/axios'

// 列表
export function regionList(params) {
  return request({
    url: '/dms-bas/bas-region/list',
    method: 'get',
    params
  })
}

// 新增
export function regionAdd(data) {
  return request({
    url: '/dms-bas/bas-region/add',
    method: 'post',
    data
  })
}

// 编辑
export function regionEdit(data) {
  return request({
    url: '/dms-bas/bas-region/edit',
    method: 'put',
    data
  })
}

// 删除
export function regionRemove(data) {
  return request({
    url: '/dms-bas/bas-region/remove',
    method: 'delete',
    data
  })
}
// /bas/bas-region/listCountry 获取国家信息
export function listCountry() {
  return request({
    url: '/dms-bas/bas-region/listCountry',
    method: 'get'
  })
}
