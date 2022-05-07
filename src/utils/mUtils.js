import store from '@/store'
import moment from 'moment-timezone'
import { getCookie } from '@/utils/cache'
/**
 * 返回两位的小数的字符串
 */
export const toFixedNum = (num) => {
  const tonum = Number(num).toFixed(2)
  return tonum
}

/**
 * 读取base64
 */
export const readFile = file => {
  // 判断是否是图片类型
  if (!/image\/\w+/.test(file.raw.type)) {
    alert('只能选择图片')
    return false
  }
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function (e) {
    alert(e.target.result)
  }
}
/**
 * 动态插入css
 */
export const loadStyle = url => {
  const link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = url
  const head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

export const param2Obj = url => {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
}

// 是否为正整数
export const isInteger = (s) => {
  var re = /^[0-9]+$/
  return re.test(s)
}

// 导出文件（适用于post和get请求）
export const handleDownloadFile = (response, fileName = '') => {
  if (response) {
    const content = response.data
    const contentDisposition = response.headers['content-disposition']
    const fileName = fileName || decodeURI(contentDisposition.split(';')[1].split('filename=')[1])
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      // 非IE下载
      const elink = document.createElement('a')
      elink.download = fileName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href) // 释放URL 对象
      document.body.removeChild(elink)
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName)
    }
  }
}
/**
 * 数据筛选赋值
 */
export const assignment = (checkedCities, _columnsList) => {
  const columnsList = []
  for (const i in _columnsList) {
    if (_columnsList[i].prop !== 'ids' && _columnsList[i].prop !== 'opeText') {
      for (const k in checkedCities) {
        if (_columnsList[i].label === checkedCities[k]) {
          columnsList.push(_columnsList[i])
        }
      }
    }
  }
  columnsList.unshift({
    prop: 'ids',
    label: '序号',
    align: 'center'
  })
  const opeTextCol = _columnsList.find(it => it.prop === 'opeText')
  if (opeTextCol) {
    columnsList.push(opeTextCol)
  }
  return columnsList
}

// /**
//  * 构造树型结构数据
//  * @param {*} data 数据源
//  * @param {*} id id字段 默认 'id'
//  * @param {*} parentId 父节点字段 默认 'parentId'
//  * @param {*} children 孩子节点字段 默认 'children'
//  * @param {*} rootId 根Id 默认 0
//  */

export const handleTree = (data, id, parentId, children, rootId) => {
  id = id || 'id'
  parentId = parentId || 'parentId'
  children = children || 'children'
  rootId = rootId || 0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[parentId]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回第一层
    return father[parentId] === rootId
  })
  return treeData !== '' ? treeData : data
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * 权限匹配
 * @param {*} idsArray  权限标识数组
 */
export function hasPermi(idsArray = []) {
  const all_permission = '*:*:*'
  const permissions = store.getters && store.getters.permissions
  const permissionFlag = idsArray
  return permissions.some(permission => {
    return all_permission === permission || permissionFlag.includes(permission)
  })
}

/**
 * 通过key值拿到对应的Name
 * @param {Array} array  数组数据
 * @param {String} keyVal  code值
 * @param {String} key  数组code的参数名，默认是id
 * @param {String} val  数组name的参数名，默认是value
 */
export function matchValue(array = [], keyVal, key = 'id', val = 'value') {
  if (!keyVal || !array.length) {
    return ''
  }
  const matchObj = array.find(item => (item[key] === keyVal))
  let a = ''
  if (matchObj) {
    a = matchObj[val]
  }
  return a
}

/**
 * 设置表格高度
 * @param {*} cusHeight 自定义高度
 */
export function setTableHeight(cusHeight = 0) {
  const mspace = 5 // 标签
  const contentDom = document.querySelector('.menu_content') // 右侧内容
  const conditionFormDom = document.querySelector('.condition-form') // 条件筛选
  const buttonRowsDom = document.querySelector('.con-button-rows') // 行内按钮
  const tabsDom = document.querySelector('.con-tab') // tabs
  const pagerDom = document.querySelector('.con-pager')
  const contentDomHeight = contentDom ? contentDom.offsetHeight : 0
  const filterHeight = conditionFormDom ? conditionFormDom.offsetHeight + mspace : 0
  const buttonRowsHeight = buttonRowsDom ? buttonRowsDom.offsetHeight + mspace : 0
  const pagerHeight = pagerDom ? pagerDom.offsetHeight : 0
  const tabsHeight = tabsDom ? tabsDom.offsetHeight : 0
  const comHeight = filterHeight + buttonRowsHeight + tabsHeight + pagerHeight + cusHeight + mspace * 4
  return contentDomHeight - comHeight
}

/**
 * 设置弹框内表格高度
 * @param {*} cusHeight 自定义高度
 */
export function setDialogTableHeight(cusHeight = 0) {
  const mspace = 5 // 标签
  const contentDom = document.querySelector('.my-dialog-body') // 弹窗内容
  const conditionFormDom = document.querySelector('.my-dialog-body .condition-form') // 条件筛选
  const buttonRowsDom = document.querySelector('.my-dialog-body .con-button-rows') // 行内按钮
  const footerDom = document.querySelector('.my-dialog-body .el-dialog__footer')
  const contentDomHeight = contentDom ? contentDom.offsetHeight : 0
  const filterHeight = conditionFormDom ? conditionFormDom.offsetHeight + mspace : 0
  const buttonRowsHeight = buttonRowsDom ? buttonRowsDom.offsetHeight + mspace : 0
  const footerDomHeight = footerDom ? footerDom.offsetHeight + mspace : 0
  const comHeight = filterHeight + buttonRowsHeight + cusHeight + footerDomHeight + mspace * 4
  return contentDomHeight - comHeight - 80
}

// 设置内容高度
export function setContentHeight(cusHeight = 0) {
  const contentDom = document.querySelector('.menu_content')
  const contentDomHeight = contentDom ? contentDom.offsetHeight : 0
  return (contentDomHeight - 10 - cusHeight) + 'px'
}

// 2个数字相减
export function argSubtraction(arg1 = 0, arg2 = 0) {
  const result = Math.round((Number(arg1) - Number(arg2)) * 100) / 100
  return result
}

// 2个数字相加
export function argAdd(arg1 = 0, arg2 = 0) {
  const result = Math.round((Number(arg1) + Number(arg2)) * 100) / 100
  return result
}

export function isJsonString(str) {
  try {
    if (typeof JSON.parse(str) === 'object') {
      return true
    }
  } catch (e) {
    //
  }
  return false
}
// 查找form column
export function columnFilters(arr, keys) {
  let rows = {}
  try {
    arr.forEach(item => {
      const flag = item.content.find(o => o.prop === keys)
      if (flag) {
        rows = flag
        throw new Error()
      }
    })
  } catch (e) {
    return rows
  }
}

export function formatterTimeZones(val, valueFormat = 'YYYY-MM-DD HH:mm:ss') {
  const timeZone = getCookie(process.env.VUE_APP_TIME_ZONE_STR)
  return val ? moment(val).tz(timeZone).format(valueFormat) : ''
}
