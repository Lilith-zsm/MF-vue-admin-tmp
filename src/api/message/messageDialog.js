import request from '@/utils/axios'
// 消息表
const baseUrl = '/bil/bil-warn-info'
// 查询
export function getMesssageList(params) {
  return request({
    url: `${baseUrl}/list`,
    method: 'get',
    params
  })
}
