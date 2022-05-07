import request from '@/utils/axios'

// 报关清单 - 分页列表
export function list(params) {
  return request({
    url: `/ccs-business-ord/ord-custom/pageList`,
    method: 'get',
    params
  })
}

// 报关清单 - 导出
export function download(params) {
  return request({
    url: `/ccs-business-ord/ord-custom/export`,
    method: 'post',
    data: params,
    responseType: 'blob',
    timeout: 8000
  })
}
