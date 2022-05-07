import request from '@/utils/axios'

// 分页查询预审运单信息模块列表
export function list(params) {
  return request({
    url: `/ccs-business-ord/ord-bill/page`,
    method: 'get',
    params
  })
}
