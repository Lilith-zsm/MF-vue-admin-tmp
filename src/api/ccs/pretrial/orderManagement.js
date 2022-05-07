import request from '@/utils/axios'

// 分页查询预审订单信息模块列表
export function list(params) {
  return request({
    url: `/ccs-business-ord/ord-order/page`,
    method: 'get',
    params
  })
}

// 预审订单 - 编辑仓单
export function edit(params) {
  return request({
    url: `/ccs-business-ord/ord-order/editManifest`,
    method: 'post',
    data: params
  })
}
