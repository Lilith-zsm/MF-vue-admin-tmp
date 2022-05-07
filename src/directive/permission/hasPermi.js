/**
 * 操作权限处理
 */

import Vue from 'vue'

export default {
  inserted(el, binding, vnode) {
    const { value } = binding
    if (value && value instanceof Array && value.length > 0) {
      const hasPermissions = Vue.prototype.$Utils.hasPermi(value)
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // throw new Error(`请设置操作权限标签值`)
    }
  }
}
