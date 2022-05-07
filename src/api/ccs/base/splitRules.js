import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getsplitRulesList(params) {
  return request({
    url: `/dms-bas/bas-smart-split-rules/list`,
    method: 'get',
    params
  })
}
// 修改
export function putsplitRules(params) {
  return request({
    url: `/dms-bas/bas-smart-split-rules/edit`,
    method: 'put',
    data: params
  })
}

// 新增
export function addsplitRules(params) {
  return request({
    url: `/dms-bas/bas-smart-split-rules/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deletesplitRules(params) {
  return request({
    url: `/dms-bas/bas-smart-split-rules/remove`,
    method: 'delete',
    data: params
  })
}
