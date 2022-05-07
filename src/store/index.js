import Vue from 'vue'
import Vuex from 'vuex'
if (process.env.NODE_ENV === 'development') {
  Vue.use(Vuex)
}

import user from './modules/user'
import permission from './modules/permission'
import menu from './modules/menu'
import tagsView from './modules/tagsView'
import lang from './modules/lang'
import minusButton from './modules/minusButton'
import ws from './modules/ws'

export default new Vuex.Store({
  modules: {
    user,
    permission,
    menu,
    tagsView,
    lang,
    minusButton,
    ws
  }
})

