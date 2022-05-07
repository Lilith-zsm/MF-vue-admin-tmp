import request from '@/utils/axios'

const baseUrl = '/dms-bas/bas-attachment'

// 附件
// 上传附件
export function uploadAttachmentApi(data) {
  return request({
    url: `${baseUrl}/uploadAttachment`,
    method: 'post',
    data
  })
}

// 附件列表
export function getAttachmentListApi(params) {
  return request({
    url: `${baseUrl}/list`,
    method: 'get',
    params
  })
}
