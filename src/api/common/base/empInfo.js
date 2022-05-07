import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// 查询
export function getEmpInfoList(params) {
  return request({
    url: `${baseUrl}/bas-employees/list`,
    method: 'get',
    params
  })
}
// 修改
export function updateEmpInfo(params) {
  return request({
    url: `${baseUrl}/bas-employee`,
    method: 'put',
    data: params
  })
}
// 重置密码
export function updatePassword(params) {
  return request({
    url: `${baseUrl}/bas-employee/updatePassword`,
    method: 'put',
    data: params
  })
}
// 新增
export function addEmpInfo(params) {
  return request({
    url: `${baseUrl}/bas-employee`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteEmpInfo(params) {
  return request({
    url: `${baseUrl}/bas-employee/${params}`,
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

// 查询员工资料下拉
export function getEmpsApi(params) {
  return request({
    url: `${baseUrl}/bas-employee/getEmps`,
    method: 'get',
    params
  })
}
