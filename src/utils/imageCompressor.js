/**
 * 图片压缩，默认同比例压缩
 * @param {Object} fileObj
 * 图片对象
 * 回调函数有2个参数，1. base64的字符串数据, 2.base64的图片url数据转换为Blob
 * 用法： imageCompressor(file, function (base64url, blobData) {//do something});
 */
export function imageCompressor(fileObj, callback) {
  try {
    var image = new Image()
    var reader = new FileReader()
    reader.readAsDataURL(fileObj)
    reader.onload = function () {
      image.src = this.result
    }
    image.onload = function () {
      var base64url = compress(image)
      // 压缩完成执行回调
      var blob = convertBase64UrlToBlob(base64url)
      callback(base64url, blob)
    }
  } catch (e) {
    console.log('压缩失败!')
  }
}

/**
 * 使用canvas对大图片进行压缩
 */
function compress(img) {
  // 用于压缩图片的canvas
  var canvas = document.createElement('canvas')
  var ctx = canvas.getContext('2d')
  // 瓦片canvas
  var tCanvas = document.createElement('canvas')
  var tctx = tCanvas.getContext('2d')
  var initSize = img.src.length
  var width
  var height
  if (typeof img.naturalWidth === 'undefined') {
    width = 'img.width'
    height = img.height
  } else {
    width = img.naturalWidth
    height = img.naturalHeight
  }
  // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
  var ratio
  if ((ratio = width * height / 4000000) > 1) {
    ratio = Math.sqrt(ratio)
    width /= ratio
    height /= ratio
  } else {
    ratio = 1
  }
  canvas.width = width
  canvas.height = height
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  // 如果图片像素大于100万则使用瓦片绘制
  var count
  if ((count = width * height / 1000000) > 1) {
    count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
    //	计算每块瓦片的宽和高
    var nw = ~~(width / count)
    var nh = ~~(height / count)
    tCanvas.width = nw
    tCanvas.height = nh
    for (var i = 0; i < count; i++) {
      for (var j = 0; j < count; j++) {
        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
      }
    }
  } else {
    ctx.drawImage(img, 0, 0, width, height)
  }
  var quality = 0.9
  var ndata = canvas.toDataURL('image/jpeg', quality)
  while (ndata.length > 1000000) {
    quality -= 0.1
    ndata = canvas.toDataURL('image/jpeg', quality)
  }
  // 进行最小压缩
  // var ndata = canvas.toDataURL('image/jpeg', 0.1);
  console.log('源文件：' + (initSize / 1024) + 'KB, 压缩后传输大小：' + (ndata.length / 1024) + 'KB (省' + (~~(100 * (initSize - ndata.length) / initSize)) + '%)')
  tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
  return ndata
}

/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
function convertBase64UrlToBlob(urlData) {
  if (!urlData) {
    return null
  }
  var bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
  // 处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length)
  var ia = new Uint8Array(ab)
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }
  /*   return new Blob( [ab] , {type : 'image/jpeg'}); */
  return getBlob([ab], 'image/jpeg')
}

/**
 * 获取blob对象的兼容性写法
 *
 * @param buffer
 * @param format
 * @returns {*}
 */
function getBlob(buffer, format) {
  try {
    return new Blob(buffer, {
      type: format
    })
  } catch (e) {
    var bb = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MSBlobBuilder)()
    buffer.forEach(function (buf) {
      bb.append(buf)
    })
    return bb.getBlob(format)
  }
}

/**
 * 获取formdata

function getFormData() {
  var isNeedShim = ~navigator.userAgent.indexOf('Android') &&
		~navigator.vendor.indexOf('Google') &&
		!~navigator.userAgent.indexOf('Chrome') &&
		navigator.userAgent.match(/AppleWebKit\/(\d+)/).pop() <= 534
  return isNeedShim ? new FormDataShim() : new FormData()
}
*/

/**
 * formdata 补丁, 给不支持formdata上传blob的android机打补丁
 *
 * @constructor

function FormDataShim() {
  console.warn('using formdata shim')
  var o = this
  var parts = []
  var boundary = Array(21).join('-') + (+new Date() * (1e16 * Math.random())).toString(36)
  var oldSend = XMLHttpRequest.prototype.send
  this.append = function (name, value, filename) {
    parts.push('--' + boundary + '\r\nContent-Disposition: form-data; name="' + name + '"')
    if (value instanceof Blob) {
      parts.push('; filename="' + (filename || 'blob') + '"\r\nContent-Type: ' + value.type + '\r\n\r\n')
      parts.push(value)
    } else {
      parts.push('\r\n\r\n' + value)
    }
    parts.push('\r\n')
  }
  // Override XHR send()
  XMLHttpRequest.prototype.send = function (val) {
    var fr
    var data
    var oXHR = this
    if (val === o) {
      // Append the final boundary string
      parts.push('--' + boundary + '--\r\n')
      // Create the blob
      data = getBlob(parts)
      // Set up and read the blob into an array to be sent
      fr = new FileReader()
      fr.onload = function () {
        oldSend.call(oXHR, fr.result)
      }
      fr.onerror = function (err) {
        throw err
      }
      fr.readAsArrayBuffer(data)
      // Set the multipart content type and boudary
      this.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary)
      XMLHttpRequest.prototype.send = oldSend
    } else {
      oldSend.call(this, val)
    }
  }
}
 */
