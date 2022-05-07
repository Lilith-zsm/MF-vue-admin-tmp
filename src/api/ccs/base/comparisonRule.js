import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getComparisonRuleList(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule/page`,
    method: 'get',
    params
  })
}
// // 查询详情
// export function getCommodityDelita(params) {
//   return request({
//     url: `/ccs-dms-bas/bas-commodity/getInfo/${params}`,
//     method: 'get',
//     params
//   })
// }
// 修改
export function putComparisonRule(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule-item/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addComparisonRule(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule-item/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteComparisonRule(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule-item/remove`,
    method: 'delete',
    data: params
  })
}
