import Vue from 'vue'
import Router from 'vue-router'
import {
  Layout
} from '../layout' // 页面整体布局

process.env.NODE_ENV === 'development' ? Vue.use(Router) : null

/**
 * path:''与path:'*'的区别：
 * 1、path:'*', 会匹配所有路径
 * 2、path:''，也是会匹配到路由
 *
 */
// 默认不需要权限的页面
export const constantRouterMap = [{
  path: '/login',
  name: 'login',
  component: () => import('@/page/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/page/errorPage/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/page/errorPage/401'),
  hidden: true
},
{ path: '/reg', name: 'register', component: () => import('@/page/register/index'), hidden: true },
{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: (resolve) => require(['@/page/redirect'], resolve)
  }]
},
{
  path: '/home',
  component: Layout,
  meta: {
    title: '首页',
    icon: 'icon-shouye'
  },
  constant: true,
  alwaysShow: true,
  noDropdown: true,
  hidden: false,
  children: [{
    path: 'index',
    name: 'index',
    meta: {
      title: '首页',
      icon: 'icon-shouye',
      affix: true
    },
    component: () => import('@/page/home/index')
  }]
},
{
  path: '/demo',
  name: 'demo',
  component: Layout,
  meta: {
    title: '组件demo',
    icon: 'icon-texiaolizi'
  },
  children: [{
    path: 'table',
    name: 'table',
    meta: {
      title: '表格'
    },
    component: () => import('@/page/demo/table')
  },
  {
    path: 'editTable',
    name: 'editTable',
    meta: {
      title: '编辑表格'
    },
    component: () => import('@/page/demo/editTable')
  },
  {
    path: 'tabTable',
    name: 'tabTable',
    meta: {
      title: '切换表格'
    },
    component: () => import('@/page/demo/tabTable/index')
  },
  {
    path: 'tree',
    name: 'tree',
    meta: {
      title: '树形'
    },
    component: () => import('@/page/demo/tree')
  },
  {
    path: 'treeTable',
    name: 'treeTable',
    meta: {
      title: '树形表格'
    },
    component: () => import('@/page/demo/treeTable')
  }, {
    path: 'filterTable',
    name: 'filterTable',
    meta: {
      title: '表头列筛选表格'
    },
    component: () => import('@/page/demo/filterTable')
  },
  {
    path: 'common',
    name: 'common',
    meta: {
      title: '公共组件'
    },
    component: () => import('@/page/demo/common')
  },
  {
    path: 'conditionForm',
    name: 'conditionForm',
    meta: {
      title: '筛选Form'
    },
    component: () => import('@/page/demo/conditionForm')
  }, {
    path: 'button',
    name: 'button',
    meta: {
      title: '按钮'
    },
    component: () => import('@/page/demo/button')
  }, {
    path: 'upload',
    name: 'upload',
    meta: {
      title: '文件上传下载'
    },
    component: () => import('@/page/demo/upload')
  }, {
    path: 'dialogForm',
    name: 'dialogForm',
    meta: {
      title: '表单'
    },
    component: () => import('@/page/demo/dialogForm')
  }
  ]
}
]
const code = location.pathname.match('[^/]+') ? location.pathname.match('[^/]+')[0] : 'msd'
const createRouter = () => new Router({
  mode: 'history', // 默认为'hash'模式
  base: '/' + code, // 添加跟目录,对应服务器部署子目录
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // the relevant part
}

// 异步路由（需要权限的页面）
export const asyncRouterMap = [

]

const routerMethods = ['push', 'replace']
routerMethods.forEach(method => {
  const originalCall = Router.prototype[method]
  Router.prototype[method] = function (location, onResolve, onReject) {
    if (onResolve || onReject) {
      return originalCall.call(this, location, onResolve, onReject)
    }
    return originalCall.call(this, location).catch(err => err)
  }
})

export default router

/**
 *  路由设置要求：
 * 1、该路由有子菜单,可以设置多层嵌套路由children;如果没有子菜单,不需要设置children;通过item.children.length来判断路由的级数;
 * 2、登录成功后,定位到系统首页时,需要加载页面整体布局组件Layout并进行子路由定向加载;
 *
 * 按需加载路由组件的2种方法：
 * 1、component: () => import('@/page/login')
 * 2、component:resolve => require(['@/page/fundPosition'], resolve)
 *
 *
 *
 * 什么情况下，路由会定位到404页面?
 * 路由中redirect:'',不起作用？
 * 三级子菜单要在顶部展示？
 *
 *
 *
 */
