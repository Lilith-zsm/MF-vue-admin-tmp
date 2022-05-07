import mUtils from '@/utils/index.js'
import { Notification } from 'element-ui'
import i18n from '@/lang'
const ws = {
  state: {
    websock: {},
    message: '',
    lockReconnect: false,
    heartCheck: {
      timeout: 1000,
      timeoutObj: null,
      serverTimeoutObj: null
    },
    readyState: false
  },
  getters: {
    websockMessage: state => state.message,
    readyState: state => state.readyState
  },
  mutations: {
    CREATED_WEBSOCKET(state, url) {
      state.websock = new WebSocket(url)
      window.onbeforeunload = function() {
        state.websock.close()
      }
    },
    CHANGE_LOCKRECONNECT(state, data) {
      state.lockReconnect = data
    },
    WEBSOCKET_SEND(state, message) {
      state.websock.send(message)
    },
    START_HEARTCHECK(state) {
      state.heartCheck.timeoutObj = setTimeout(function() {
        state.websock.send('ping')
        state.heartCheck.serverTimeoutObj = setTimeout(function() {
          state.websock.close()
        }, state.heartCheck.timeout)
      }, state.heartCheck.timeout)
    },
    RESET_HEARTCHECK(state) {
      clearTimeout(state.heartCheck.timeoutObj)
      clearTimeout(state.heartCheck.serverTimeoutObj)
    },
    CHANGE_READYSTATE(state, data) {
      state.readyState = data
    }
  },
  actions: {
    createdWebsocket({ commit, dispatch }, url) {
      try {
        if ('WebSocket' in window) {
          commit('CREATED_WEBSOCKET', url)
        }
        dispatch('initeventHandle', url)
      } catch (e) {
        dispatch('reconnect', url)
        console.log(e)
      }
    },
    initeventHandle({ state, dispatch, commit }, url) {
      state.websock.onopen = function() {
        // dispatch('heartCheckReset')
        // dispatch('heartCheckStart')
        commit('CHANGE_READYSTATE', true)
        console.log('websocket 连接成功')
      }
      state.websock.onmessage = function(callBack) {
        const data = mUtils.isJsonString(callBack.data) ? JSON.parse(callBack.data) : null
        state.message = data || callBack.data
        if (data && data.msg && data.msg === 'batchPushCreateOrder') {
          Notification({
            message: data.code === 200 ? i18n.tc('转第三方推送成功') : i18n.tc('转第三方推送失败'),
            position: 'bottom-right'
          })
        }
      }
      state.websock.οnerrοr = function() {
        commit('CHANGE_READYSTATE', false)
        dispatch('reconnect', url)
        console.log('websocket 连接错误')
      }
      state.websock.onclose = function(e) {
        commit('CHANGE_READYSTATE', false)
        dispatch('reconnect', url)
        console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
        console.log(e)
      }
    },
    reconnect({ commit, dispatch, state }, url) {
      if (state.lockReconnect) return
      commit('CHANGE_LOCKRECONNECT', true)
      setTimeout(function () {
        dispatch('createdWebsocket', url)
        commit('CHANGE_LOCKRECONNECT', false)
      }, 2000)
    },
    websocketSend({ commit }, message) {
      commit('WEBSOCKET_SEND', message)
    },
    heartCheckStart({ commit }) {
      commit('START_HEARTCHECK')
    },
    heartCheckReset({ commit }) {
      commit('RESET_HEARTCHECK')
    }
  }
}
export default ws
