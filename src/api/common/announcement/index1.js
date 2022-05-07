import request from '@/utils/axios'
const baseUrl = '/dms-bas'
// 查询
export function getAnnouncementList(params) {
  return request({
    url: `${baseUrl}/bas-notice/list`,
    method: 'get',
    params
  })
}
// 删除
export function deleteAnnouncement(params) {
  return request({
    url: `${baseUrl}/bas-notice/${params}`,
    method: 'delete',
    data: params
  })
}
// 发公告
export function addAnnouncement(params) {
  return request({
    url: `${baseUrl}/bas-notice`,
    method: 'post',
    data: params
  })
}
// 上传附件地址
export const importFileUrl = '/api/bas/bas-notice/adddoc'
