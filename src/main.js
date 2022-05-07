/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-03-04 16:08:20
 */
import Vue from 'vue'
import App from './App.vue'
import * as api from '@/api'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import './assets/element-variables.scss'
import './assets/icon.css'
import './assets/base.scss'
import '@/permission'
import i18n from '@/lang'
import permission from './directive/permission'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
VXETable.setup({
  // 对组件内置的提示语进行国际化翻译
  i18n: (key, args) => i18n.t(key, args)
})
Vue.use(VXETable)
// 组件
import table from '@/components/table/index'
import form from '@/components/form/index'
import { message } from '@/utils/resetMessage'
import svgIcon from '@/components/svgIcon/index'
import inputClearable from '@/components/inputClearable/index'
import baseDialog from '@/components/baseDialog/index'
import conditionForm from '@/components/conditionForm/index'

import VueBarcode from 'vue-barcode'
import Print from '@/utils/print'
// 拖拽组件
import './utils/directives.js'
import '@/components/table/components/index.js'

Vue.component('m-table', table)
Vue.component('m-form', form)
Vue.component('svg-icon', svgIcon)
Vue.component('input-clearable', inputClearable)
Vue.component('base-dialog', baseDialog)
Vue.component('condition-form', conditionForm)
Vue.component('barcode', VueBarcode)
Vue.use(Print)

import mUtils from '@/utils/index.js'

Vue.config.productionTip = false
Vue.prototype.$api = api.default
Vue.prototype.$Utils = mUtils
Vue.prototype.message = message
// ElementUI 组件多语言
Vue.use(ElementUI, { size: 'mini', i18n: (key, value) => i18n.t(key, value) })
Vue.use(permission)
new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
