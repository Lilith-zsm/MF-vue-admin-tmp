import request from '@/utils/axios'
const baseUrl = `/ccs-business-ord`
// 获取用户列表
export function list(params) {
  return request({
    url: `${baseUrl}/ord-import-order/page`,
    method: 'get',
    params
  })
}
// 导出订单模板
export function _orderexport(params1, params2) {
  return request({
    url: `/dms-bas/bas-file-info/download/${params1}/${params2}`,
    method: 'get',
    params1,
    params2,
    responseType: 'blob'
  })
}
// 图片上传
export function uploadFile(params) {
  return request({
    headers: { 'Content-Type': 'multipart/form-data' },
    url: `/bas/bas-employee-check-record/upload`,
    method: 'post',
    data: params
  })
}
// 保存导入6PL文件
export function add6PL(params) {
  return request({
    url: `/ccs-business-ord/ord-import-bill/import6pl`,
    method: 'post',
    timeout: 900000,
    data: params
  })
}
// 保存导入CAT文件
export function addCat(params) {
  return request({
    url: `/ccs-business-ord/ord-import-bill/importCat`,
    method: 'post',
    timeout: 900000,
    data: params
  })
}
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
// 上传文件地址
export const importFileUrl = '/dms-bas/bas-file-info/upload'

// 导入订单信息 - 获取预审分析状态
export function getSmartStatus(params) {
  return request({
    url: `/ccs-business-ord/ord-import-order/getPretreatmentState`,
    method: 'post',
    data: params
  })
}

// 进度条信息 - 获取进度条
export function getLoadingMessage(params) {
  return request({
    url: `/ccs-business-ord/progress-bar/get`,
    method: 'get',
    params
  })
}

// 分页查询导入订单预处理信息模块列表
export function getBillPage(params) {
  return request({
    url: `/ccs-business-ord/ord-import-bill-pretreatment/page`,
    method: 'get',
    params
  })
}

// 删除导入订单信息模块
export function remove(params) {
  return request({
    url: `/ccs-business-ord/ord-import-order/remove`,
    method: 'delete',
    data: params
  })
}

// 预审分析 - 生成新订单
export function createNewOrder(params) {
  return request({
    url: `/ccs-business-ord/ord-import-order/generateNewOrder`,
    method: 'post',
    data: params
  })
}

