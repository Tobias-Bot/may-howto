import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    savedCards: [],
  },
  getters: {
    getCards: (state) => state.savedCards,
  },
  mutations: {
    setCards(state, payload) {
      state.savedCards = payload;

      localStorage.setItem("savedCards", JSON.stringify(payload));
    },
  },
  actions: {
  },
  modules: {
  }
})
