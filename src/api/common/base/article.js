import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// 查询
export function getArticleList(params) {
  return request({
    url: `${baseUrl}/bas-products/productList`,
    method: 'get',
    params
  })
}
// 修改主品名
export function putArticle(params) {
  return request({
    url: `${baseUrl}/bas-products/edit`,
    method: 'put',
    data: params
  })
}

// 新增主品名
export function addArticle(params) {
  return request({
    url: `${baseUrl}/bas-products/add`,
    method: 'post',
    data: params
  })
}
// 删除
export function deleteArticle(params) {
  return request({
    url: `${baseUrl}/bas-products/remove`,
    method: 'delete',
    data: params
  })
}
// 导出
export function exportArticle(params) {
  return request({
    url: `${baseUrl}/bas-products/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 新增子品名
export function addArticleSub(params) {
  return request({
    url: `${baseUrl}/bas-sub-products/add`,
    method: 'post',
    data: params
  })
}
// 修改主品名
export function putArticleSub(params) {
  return request({
    url: `${baseUrl}/bas-sub-products/edit`,
    method: 'put',
    data: params
  })
}
// 查询子品名详情
export function getArticDataSub(params) {
  return request({
    url: `${baseUrl}/bas-sub-products/getInfo/${params}`,
    method: 'get',
    params
  })
}
// 查询主品名下拉
export function getArticData(params) {
  return request({
    url: `${baseUrl}/bas-products/list`,
    method: 'get',
    params
  })
}
// 查询子品名弹窗
export function getSubData(params) {
  return request({
    url: `${baseUrl}/bas-sub-products/list`,
    method: 'get',
    params
  })
}
// 查询主类品名管理下拉框
export function getProductsApi(params) {
  return request({
    url: `${baseUrl}/bas-products/getProducts`,
    method: 'get',
    params
  })
}
// 查询子品名下拉框
export function getSubProductApi(params) {
  return request({
    url: `${baseUrl}/bas-sub-products/getSubProduct`,
    method: 'get',
    params
  })
}
