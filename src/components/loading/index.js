import Vue from 'vue'
import LoadingComponent from './index.vue'

let showLoading = false // 存储loading显示状态
let loadingNode = null // 存储loading节点元素
const LoadingConstructor = Vue.extend(LoadingComponent)

const Loading = {
  show: () => {
    if (showLoading) {
      return
    }
    if (!loadingNode) {
      loadingNode = new LoadingConstructor({
        data: {
          isShowLoading: showLoading
        }
      })
      loadingNode.$mount()
      document.body.appendChild(loadingNode.$el)
    }
    loadingNode.isShowLoading = showLoading = true
  },
  hide: () => {
    loadingNode.isShowLoading = showLoading = false
  }
}

export default Loading
