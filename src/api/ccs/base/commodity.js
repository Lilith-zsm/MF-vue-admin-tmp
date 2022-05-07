import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getCommodityList(params) {
  return request({
    url: `/dms-bas/bas-commodity/list`,
    method: 'get',
    params
  })
}
// 查询详情
export function getCommodityDelita(params) {
  return request({
    url: `/dms-bas/bas-commodity/getInfo/${params}`,
    method: 'get',
    params
  })
}
// 修改
export function putCommodity(params) {
  return request({
    url: `/dms-bas/bas-commodity/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addCommodity(params) {
  return request({
    url: `/dms-bas/bas-commodity/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteCommodity(params) {
  return request({
    url: `/dms-bas/bas-commodity/remove`,
    method: 'delete',
    data: params
  })
}
// 关口下拉
export function getGatewayInfoData(params) {
  return request({
    url: `/dms-bas/bas-pass-info/selectList`,
    method: 'get',
    params
  })
}
// 启用
export function unlockState(params) {
  return request({
    url: `/dms-bas/bas-commodity/enabled`,
    method: 'post',
    data: params
  })
}
// 禁用
export function lock(params) {
  return request({
    url: `/dms-bas/bas-commodity/disabled`,
    method: 'post',
    data: params
  })
}
// 导入上传
export function uploadFileList(params) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `/dms-bas/bas-commodity/importData`,
    method: 'post',
    timeout: 900000,
    data: params
  })
}
// 导入地址
export const importCommodity1 = '/api/dms-bas/bas-commodity/importData'
