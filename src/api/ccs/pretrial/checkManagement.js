import request from '@/utils/axios'

// 分页查询预审运单信息模块列表 - 查验列表
export function list(params) {
  return request({
    url: `/ccs-business-ord/ord-bill/checkPage`,
    method: 'get',
    params
  })
}

// 分页查询预审运单信息模块列表 - 新增查验
export function add(params) {
  return request({
    url: `/ccs-business-ord/ord-bill/addCheck`,
    method: 'post',
    data: params
  })
}

// 分页查询预审运单信息模块列表 - 编辑查验
export function edit(params) {
  return request({
    url: `/ccs-business-ord/ord-bill/editCheck`,
    method: 'post',
    data: params
  })
}

// 分页查询预审运单信息模块列表 - 删除查验
export function remove(params) {
  return request({
    url: `/ccs-business-ord/ord-bill/deleteCheck`,
    method: 'post',
    data: params
  })
}

// 上传文件地址
export const importFileUrl = '/dms-bas/bas-file-info/upload'

// 图片上传
export function uploadFileList(params) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `/dms-bas/bas-file-info/upload`,
    method: 'post',
    timeout: 900000,
    data: params
  })
}

// 保存导入文件
export function _export(params) {
  return request({
    url: `/ccs-business-ord/ord-bill/importCheck`,
    method: 'post',
    timeout: 900000,
    data: params
  })
}
