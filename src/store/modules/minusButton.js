const minusButton = {
  state: {
    buttonList: []
  },
  mutations: {
    ADD_MINUS_BUTTON: (state, btn) => {
      const list = state.buttonList.map((item) => item.label)
      if (list.includes(btn.label)) return
      state.buttonList.push(btn)
    },
    OPEN_MINUS_DIALOG: (state, btn) => {
      state.buttonList.forEach(item => {
        if (item.label === btn) {
          item.open = true
        }
      })
    },
    CLOSE_MINUS_DIALOG: (state, btn) => {
      state.buttonList = state.buttonList.map(item => {
        return btn.label === item.label ? { ...item, open: false } : item
      })
    },
    DEL_MINUS_BUTTON: (state, btn) => {
      const index = state.buttonList.findIndex(item => item.label === btn)
      index > -1 && state.buttonList.splice(index, 1)
    },
    CLEAR_MINUS_BUTTON: (state) => {
      state.buttonList = []
    }
  },
  actions: {
    addMinusButton({ commit }, btn) {
      commit('ADD_MINUS_BUTTON', btn)
    },
    delMinusButton({ commit }, btn) {
      commit('DEL_MINUS_BUTTON', btn)
    },
    openMiunsDialog({ commit }, btn) {
      commit('OPEN_MINUS_DIALOG', btn)
    },
    closeMiunsDialog({ commit }, btn) {
      commit('CLOSE_MINUS_DIALOG', btn)
    },
    clearMiunsButton({ commit }) {
      commit('CLEAR_MINUS_BUTTON')
    }
  }
}
export default minusButton
