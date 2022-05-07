import request from '@/utils/axios'
// const baseUrl = '/bas'
// const url = 'http://192.168.100.58:15201'
// 查询
export function getArticleList(params) {
  return request({
    url: `/dms-bas/bas-product/productList`,
    method: 'get',
    params
  })
}
// 修改主品名
export function putArticle(params) {
  return request({
    url: `/dms-bas/bas-product/edit`,
    method: 'put',
    data: params
  })
}

// 新增主品名
export function addArticle(params) {
  return request({
    url: `/dms-bas/bas-product/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteArticle(params) {
  return request({
    url: `/dms-bas/bas-product/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportArticle(params) {
  return request({
    url: `/dms-bas/bas-product/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 新增子品名
export function addArticleSub(params) {
  return request({
    url: `/dms-bas/bas-sub-product/add`,
    method: 'post',
    data: params
  })
}
// 修改主品名
export function putArticleSub(params) {
  return request({
    url: `/dms-bas/bas-sub-product/edit`,
    method: 'put',
    data: params
  })
}
// 查询子品名详情
export function getArticDataSub(params) {
  return request({
    url: `/dms-bas/bas-sub-product/getInfo/${params}`,
    method: 'get',
    params
  })
}
// 查询主品名下拉
export function getArticData(params) {
  return request({
    url: `/dms-bas/bas-product/productSelectList`,
    method: 'get',
    params
  })
}
// 查询子品名弹窗
export function getSubData(params) {
  return request({
    url: `/dms-bas/bas-sub-product/selectPageList`,
    method: 'get',
    params
  })
}
