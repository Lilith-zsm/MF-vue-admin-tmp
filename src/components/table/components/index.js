import Vue from 'vue'
import VXETable from 'vxe-table'

import FilterComplex from './FilterComplex.vue'
import FilterTimeRange from './FilterTimeRange.vue'
import FilterInput from './FilterInput.vue'
Vue.component(FilterComplex.name, FilterComplex)
Vue.component(FilterTimeRange.name, FilterTimeRange)
Vue.component(FilterInput.name, FilterInput)
// 创建一个条件的渲染器
VXETable.renderer.add('FilterComplex', {
  // 不显示底部按钮，使用自定义的按钮
  isFooter: false,
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-complex params={ params }></filter-complex>
    ]
  },
  // 重置数据方法
  filterResetMethod ({ options }) {
  },
  // 筛选数据方法
  filterMethod ({ option, row, column }) {
    return false
  }
})
// 创建一个条件的渲染器
VXETable.renderer.add('FilterTimeRange', {
  // 不显示底部按钮，使用自定义的按钮
  isFooter: false,
  // 筛选模板
  renderFilter (h, renderOpts, params) {
    return [
      <filter-time-range params={ params }></filter-time-range>
    ]
  },
  // 重置数据方法
  filterResetMethod ({ options }) {
  },
  // 筛选数据方法
  filterMethod ({ option, row, column }) {
    return false
  }
})

// 创建一个条件的渲染器
VXETable.renderer.add('FilterInput', {
  // 不显示底部按钮，使用自定义的按钮
  isFooter: false,
  // 筛选模板
  renderFilter(h, renderOpts, params) {
    return [
      <filter-input params={ params }></filter-input>
    ]
  },
  // 重置数据方法
  filterResetMethod ({ options }) {
  },
  // 筛选数据方法
  filterMethod ({ option, row, column }) {
    return false
  }
})
