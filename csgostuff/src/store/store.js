import Vue from 'vue'
import Vuex from 'vuex'
import { GSI_CLIENT_ID } from '../secrets'

Vue.use(Vuex)

const EXPIRATION_TIMER_PERIOD = 1000 // ms

export default new Vuex.Store({
  state: {
    isUserSignedIn: false,
    tokenExpirationTimerId: null,
    token: null,
    tokenExpirationDate: null
  },
  mutations: {
    signedOut (state) {
      state.isUserSignedIn = false
      state.token = null
      state.tokenExpirationDate = null
      console.log('removeExpirationTimer')
      clearInterval(state.tokenExpirationTimerId)
      state.tokenExpirationTimerId = null
    },
    signedIn (state, {token, tokenExpirationDate, tokenExpirationTimerId}) {
      state.isUserSignedIn = true
      state.token = token
      state.tokenExpirationDate = tokenExpirationDate
      state.tokenExpirationTimerId = tokenExpirationTimerId
    }
  },
  actions: {
    initAuth ({ state, commit, dispatch }) { // rename Init Auth or smthg
      console.log('initAuth action')

      window.gapi.load('auth2', () => {
        console.log('auth2 loaded')
        const googleAuthInstance = window.gapi.auth2.init({
          client_id: GSI_CLIENT_ID
        })
        googleAuthInstance.then((googleAuthInstance) => {
          console.log('googleAuthInstance initialized')
          if (googleAuthInstance.isSignedIn.get()) { // user already connected
            dispatch('signedInAction', googleAuthInstance.currentUser.get())
          }
        })
      })
    },
    signInAction ({ dispatch, commit }) {
      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signIn({
        prompt: 'select_account'
      }).then((googleUser) => {
        dispatch('signedInAction', googleUser)
      })
    },
    signedInAction ({ dispatch, commit }, googleUser) {
      console.log('signedInaction')

      const token = googleUser.getAuthResponse().id_token
      const tokenExpirationDate = googleUser.getAuthResponse().expires_at
      console.log('token: ' + token)
      console.log('expires_at: ' + tokenExpirationDate)

      const tokenExpirationTimerId = setInterval(
        () => {
          console.log('checking date')
          if (Date.now() > tokenExpirationDate) { // - 3590000) { // expire after 10s for test purpose
            console.log('outdated token, dispatching signOutAction')
            // SEND EVENT FOR DIALOG DISPLAY ?
            dispatch('signOutAction')
          }
        },
        EXPIRATION_TIMER_PERIOD
      )
      commit('signedIn', {
        token: token,
        tokenExpirationDate: tokenExpirationDate,
        tokenExpirationTimerId: tokenExpirationTimerId
      })
    },
    signOutAction ({ dispatch, commit }) {
      console.log('signOutAction')

      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signOut()

      commit('signedOut')
    }
  }
})
