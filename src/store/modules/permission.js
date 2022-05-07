import router, { constantRouterMap, resetRouter } from '@/router'
import _ from 'lodash'
import { Layout, common } from '@/layout/index'
import * as api from '@/api/index'
// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
        route.path = `/${route.path}`
      } else if (route.component === 'CommonLayout') {
        route.component = common
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

// 加载路由组件资源
export const loadView = (view) => {
  return () => import(`@/page/${view}`)
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    leftRouter: [],
    // 是否有顶部路由
    isTopMenu: true,
    topRouters: [],
    topRouterPath: '',
    topFramePaths: null
  },
  getters: {
    permission_routers: state => state.routers, // 所有路由
    addRouters: state => state.addRouters, // 权限过滤路由
    topRouters: state => state.topRouters.filter(it => it.path !== '*'), // 顶部路由
    topRouterPath: state => state.topRouterPath, // 顶部菜单的path
    leftRouter: state => state.leftRouter, // 左侧菜单路由
    isTopMenu: state => state.isTopMenu,
    topFramePaths: state => state.topFramePaths
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers // 权限路由
      state.routers = constantRouterMap.concat(routers) // 总路由
      if (state.isTopMenu) {
        state.topRouters = routers // 顶部路由
        state.topRouterPath = '/system'
        state.leftRouter = constantRouterMap.concat(routers.find(it => it.path === state.topRouterPath).children) // 左侧菜单路由
      } else {
        state.leftRouter = constantRouterMap.concat(routers) // 左侧菜单路由
      }
    },
    CLICK_TOP_MENU: (state, data) => {
      state.topRouterPath = data.path
      if (state.topRouters.find(it => it.path.includes(data.path))) {
        resetRouter()
        router.addRoutes(_.cloneDeep(state.addRouters))
        state.leftRouter = constantRouterMap.concat(state.routers.find(it => it.path === state.topRouterPath).children)
      } else {
        state.leftRouter = constantRouterMap
      }
    },
    SET_TOP_PATH: (state, data) => {
      state.topRouterPath = data
    },
    SET_FRAME_PATH: (state, data) => {
      state.topFramePaths = data
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }, data) {
      return new Promise(async (resolve) => {
        // 向后端请求路由数据
        const res = await api.default.user.getRouters(data)
        const accessedRoutes = filterAsyncRouter(res.data)
        commit('SET_ROUTERS', accessedRoutes)
        resolve(accessedRoutes)
      })
    },
    // 顶部一级菜单
    ClickTopMenu({ commit }, data) {
      commit('CLICK_TOP_MENU', data)
    },
    setTopPath({ commit }, data) {
      commit('SET_TOP_PATH', data)
    },
    setFramePath({ commit }, data) {
      commit('SET_FRAME_PATH', data)
    }
  }
}

export default permission
