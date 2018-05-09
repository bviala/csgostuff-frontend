import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isUserSignedIn: false
  },
  mutations: {
    signIn (state) {
      state.isUserSignedIn = true
    },
    signOut (state) {
      state.isUserSignedIn = false
    }
  }
})
