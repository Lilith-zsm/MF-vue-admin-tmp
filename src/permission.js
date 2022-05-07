import router from './router'
import store from './store'
import i18n from './lang'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import thLocale from 'element-ui/lib/locale/lang/th'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import enUS from 'vxe-table/lib/locale/lang/en-US'
import NProgress from 'nprogress' // Progress 进度条
process.env.NODE_ENV === 'development' && import('nprogress/nprogress.css')
import { message } from './utils/resetMessage.js'
import { getCookie } from '@/utils/cache' // 验权(从cookie中获取)
import * as api from '@/api/index'
// 设置多语言
const setLocale = (data) => {
  i18n.setLocaleMessage('zh', { ...data.zh, ...zhLocale, ...zhCN })
  i18n.setLocaleMessage('en', { ...data.en, ...enLocale, ...enUS })
  i18n.setLocaleMessage('ar', { ...data.ar, ...thLocale })
}

const whiteList = ['/login', '/reg'] // 不重定向的白名单
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const langList = store.getters.langList
  if (!langList.zh) {
    // 拿取多语言JSON
    try {
      const { data } = await api.default.user.getLang()
      store.commit('SET_LANGLIST', data)
      setLocale(data)
    } catch {
      message.error('多语言获取失败')
    }
  } else {
    setLocale(langList)
  }
  // 点击登录时，拿到了token并存入了cookie,保证页面刷新时,始终可以拿到token
  if (getCookie(process.env.VUE_APP_TOKEN_STR)) {
    if (to.path === '/login') {
      // 拿取多语言JSON
      try {
        const { data } = await api.default.user.getLang()
        store.commit('SET_LANGLIST', data)
        setLocale(data)
      } catch {
        message.error('多语言获取失败')
      }
      next({ path: '/home/index' })
      NProgress.done()
    } else {
      if (store.getters.roles.length === 0) {
        const params = {
          type: store.getters.type
        }
        try {
          const res = await api.default.user.getUserInfo(params)
          if (!res.data.user || !res.data.permissions.length || res.data.permissions.length < 1) {
            message.error('该用户有误！')
            NProgress.done()
            store.dispatch('LogOut').then(() => {
              location.reload()
            })
            return
          }
          store.commit('SET_USERINFO', res.data.user)
          store.commit('SET_ROLES', res.data.roles)
          store.commit('SET_PERMISSIONS', res.data.permissions)
          const params1 = {
            type: store.getters.type
          }
          store.dispatch('GenerateRoutes', params1).then(accessRoutes => { // 根据roles权限生成可访问的路由表
            accessRoutes.push({ path: '*', redirect: '/home/index', hidden: true })
            console.log('accessRoutes', accessRoutes)
            router.addRoutes(accessRoutes) // 动态添加可访问权限路由表
            // 顶部路由层
            if (store.getters.isTopMenu) {
              let path = ''
              if (to.path === '/') {
                path = '/home'
              } else {
                path = to.path.split('/')
                path = `/${path.length > 1 ? path[1] : '/system'}`
              }
              store.commit('CLICK_TOP_MENU', { path: path })
            }
            NProgress.done()
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
          })
        } catch {
          store.dispatch('LogInit').then(() => {
            NProgress.done()
            next({ path: '/' })
          })
        }
      } else {
        NProgress.done()
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 点击退出时,会定位到这里
      NProgress.done()
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

window.addEventListener('message', function(event) {
  if (event.data === 'reload') {
    location.reload()
  }
  if (event.data['setLeftCollapse']) {
    const isCollapse = event.data['setLeftCollapse'] !== 'false'
    store.dispatch('changeLeftCollapse', {
      isCollapse,
      sidebar: event.data['handleLeftMenu']
    })
  }
}, false)
/**
 本系统权限逻辑分析：
 1、路由对象区分权限路由对象和非权限路由对象；初始化时，将非权限路由对象赋值给Router;同时设置权限路由中的meta对象，如:meta:{roles:['admin','editor']}
 表示该roles所拥有的路由权限;
 2、通过用户登录成功之后返回的roles值，进行路由的匹配并生成新的路由对象;
 3、用户成功登录并跳转到首页时，根据刚刚生成的路由对象，渲染左侧的菜单;即，不同的用户看到的菜单是不一样的;

 用户点击登录和退出之后的业务逻辑分析：
 1、用户点击登录按钮，通过路由导航钩子router.beforeEach()函数确定下一步的跳转逻辑,如下：
 1.1、用户已经登录成功过，并从cookie中拿到了token值;
 1.1.1、用户访问登录页面,直接定位到登录页面;
 1.1.1、用户访问非登录页面,需要根据用户是否有roles信息，进行不同的业务逻辑,如下：
 (1)、初始情况下,用户roles信息为空;
 1.通过getUserInfo()函数,根据token拉取用户信息;并通过store将该用户roles,name,avatar信息存储于vuex;
 2.通过store.dispatch('GenerateRoutes', { roles })去重新过滤和生成路由,通过router.addRoutes()合并路由表;
 3.如果在获取用户信息接口时出现错误，则调取store.dispatch('LogOut')接口,返回到login页面;

 (2)、用户已经拥有roles信息；
 1.点击页面路由，通过roles权限判断 hasPermission()。如果用户有该路由权限，直接跳转对应的页面;如果没有权限，则跳转至401提示页面;

 2.用户点击退出,token已被清空
 1.如果设置了白名单用户，则直接跳转到相应的页面;
 2.反之,则跳转至登录页面;
 */
