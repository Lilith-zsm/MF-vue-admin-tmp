import request from '@/utils/axios'

// 列表
export function fileInfoList(params) {
  return request({
    url: '/dms-bas/bas-file-info/list',
    method: 'get',
    params
  })
}

// 上传文件
export function fileInfoUpload(data) {
  return request({
    url: '/dms-bas/bas-file-info/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
      'compressionEnabled': 'false'
    }
  })
}

// 文件下载
export function fileInfoDownload(params) {
  const paths = [params.bizCode, params.bizId]
  return request({
    url: '/dms-bas/bas-file-info/download/' + paths.join('/'),
    method: 'get',
    responseType: 'blob'
  })
}

// 文件下载
export function fileInfoDownloadById(params) {
  return request({
    url: '/dms-bas/bas-file-info/downloadById/' + params.id,
    method: 'get',
    responseType: 'blob'
  })
}

