/*
 * @Descripttion:
 * @version:
 * @Author: zhusanmei
 * @Date: 2021-12-30 16:06:04
 * @LastEditors: zhusanmei
 * @LastEditTime: 2022-04-21 11:00:32
 */
import { getCookie, removeCookie } from '@/utils/cache'
import * as api from '@/api/index'
import router from '@/router'

const user = {
  state: {
    userInfo: {}, // 用户信息
    userType: '00', // 用户类型：00-系统用户 01-VIP用户
    type: '1', // 用户类型：1-PC  2-APP  3-大客户
    token: getCookie('TOKEN_MSD_E3'),
    roles: [],
    permissions: [] // 权限标识
  },
  getters: {
    userInfo: state => state.userInfo,
    userType: state => state.userType,
    type: state => state.type,
    token: state => state.token,
    roles: state => state.roles,
    permissions: state => state.permissions
  },
  mutations: {
    SET_USERINFO: (state, data) => {
      state.userInfo = data
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, data) => {
      state.permissions = data
    }
  },
  actions: {
    // 登出
    LogOut({ commit }, data) {
      return new Promise(async (resolve) => {
        await api.default.user.logout(data)
        removeCookie(process.env.VUE_APP_TOKEN_STR)
        commit('SET_USERINFO', {})
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeCookie(process.env.VUE_APP_TENANT_STR)
        router.replace('/login')
        resolve()
      })
    },
    // 清空
    LogInit({ commit }) {
      return new Promise((resolve) => {
        removeCookie(process.env.VUE_APP_TOKEN_STR)
        commit('SET_USERINFO', {})
        commit('SET_ROLES', [])
        commit('SET_PERMISSIONS', [])
        removeCookie(process.env.VUE_APP_TENANT_STR)
        resolve()
      })
    }
  }
}

export default user

/**
 * 1、用户退出,需要调取后台接口吗？后台具体的业务逻辑是什么？
 *
 *
 */
