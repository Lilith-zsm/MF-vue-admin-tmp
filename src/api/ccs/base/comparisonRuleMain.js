import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getComparisonRuleMainList(params) {
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
export function putComparisonRuleMain(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addComparisonRuleMain(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteComparisonRuleMain(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule/remove`,
    method: 'delete',
    data: params
  })
}

// 查询明细
export function getComparisonRuleDetail(params) {
  return request({
    url: `${baseUrl}/bas-contrast-rule-item/page`,
    method: 'get',
    params
  })
}
//
