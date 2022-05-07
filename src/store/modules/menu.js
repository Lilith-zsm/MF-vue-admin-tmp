
const types = {
  HANDLE_LEFT_MENU: 'HANDLE_LEFT_MENU', // 收缩左侧菜单
  INIT_LEFT_MENU: 'INIT_LEFT_MENU', // 初始化左侧菜单
  SET_LEFT_COLLAPSE: 'SET_LEFT_COLLAPSE', // 改变左边菜单的收缩宽度
  SET_FOOTER_SHOW: 'SET_FOOTER_SHOW', // 显示隐藏底部layout
  HANDLE_TOP_MENU_WIDTH: 'HANDLE_TOP_MENU_WIDTH', // 顶部菜单宽度
  CHANGE_LEFT_COLLAPSE: 'CHANGE_LEFT_COLLAPSE'// 改变左边菜单栏宽度
}
const menu = {
  state: {
    minLeftMenuWidth: 60,
    maxLeftMenuWidth: 200,
    sidebar: {
      opened: true,
      width: 200
    },
    isCollapse: false, // 菜单默认展开
    isFooter: false,
    topMenuWidth: 200
  },
  getters: {
    sidebar: state => state.sidebar,
    isCollapse: state => state.isCollapse,
    isFooter: state => state.isFooter,
    topMenuWidth: state => state.topMenuWidth,
    minLeftMenuWidth: state => state.minLeftMenuWidth,
    maxLeftMenuWidth: state => state.maxLeftMenuWidth
  },
  mutations: {
    [types.HANDLE_LEFT_MENU](state) {
      if (state.sidebar.opened) { // true
        state.sidebar.width = state.minLeftMenuWidth
      } else {
        state.sidebar.width = state.maxLeftMenuWidth
      }
      state.sidebar.opened = !state.sidebar.opened
    },
    [types.INIT_LEFT_MENU](state) {
      const state1 = state
      state.sidebar = state1.sidebar
    },
    [types.SET_LEFT_COLLAPSE](state) {
      state.isCollapse = !state.isCollapse
    },
    [types.SET_FOOTER_SHOW](state) {
      state.isFooter = true
    },
    [types.HANDLE_TOP_MENU_WIDTH](state) {
      const menuLeftWidth = state.sidebar.width
      const breadcrumbWidth = document.querySelector('.breadcrumb') ? document.querySelector('.breadcrumb').offsetWidth : 0
      const headerRightWidth = document.querySelector('.header-right') ? document.querySelector('.header-right').offsetWidth : 0
      const width = menuLeftWidth + breadcrumbWidth + headerRightWidth + 80
      state.topMenuWidth = `calc(100vw - (${width}px))`
    },
    [types.CHANGE_LEFT_COLLAPSE](state, data) {
      state.isCollapse = data.isCollapse
      state.sidebar = data.sidebar
    }
  },
  actions: {
    handleLeftMenu: ({ commit }) => {
      commit(types.HANDLE_LEFT_MENU)
      commit(types.HANDLE_TOP_MENU_WIDTH)
    },
    initLeftMenu: ({ commit }) => {
      commit(types.INIT_LEFT_MENU)
    },
    setLeftCollapse: ({ commit }) => {
      commit(types.SET_LEFT_COLLAPSE)
    },
    setTopMenuWidth: ({ commit }) => {
      commit(types.HANDLE_TOP_MENU_WIDTH)
    },
    changeLeftCollapse: ({ commit }, data) => {
      commit(types.CHANGE_LEFT_COLLAPSE, data)
    }
  }

}

export default menu
