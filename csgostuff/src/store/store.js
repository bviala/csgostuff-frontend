import Vue from 'vue'
import Vuex from 'vuex'
import { GSI_CLIENT_ID } from '../secrets'

Vue.use(Vuex)

const EXPIRATION_TIMER_PERIOD = 1000 // ms

export default new Vuex.Store({
  state: {
    isUserSignedIn: false,
    tokenExpirationTimerId: null
  },
  mutations: {
    signedOut (state) {
      state.isUserSignedIn = false
      localStorage.removeItem('ID_TOKEN')
      localStorage.removeItem('ID_TOKEN_EXPIRATION_DATE')
    },
    signedIn (state, {token, tokenExpirationDate}) {
      state.isUserSignedIn = true
      localStorage.setItem('ID_TOKEN', token)
      localStorage.setItem('ID_TOKEN_EXPIRATION_DATE', tokenExpirationDate)
    },
    setTokenExpirationTimerID (state, timerID) {
      state.tokenExpirationTimerId = timerID
    },
    removeTokenExpirationTimer (state) {
      console.log('removeExpirationTimer')
      clearInterval(state.tokenExpirationTimerId)
      state.tokenExpirationTimerId = null
    }
  },
  actions: {
    initAuth ({ commit, dispatch }) {
      if (
        !!localStorage.getItem('ID_TOKEN') &&
        !!localStorage.getItem('ID_TOKEN_EXPIRATION_DATE') &&
        localStorage.getItem('ID_TOKEN_EXPIRATION_DATE') > Date.now()
      ) {
        commit('signedIn', {
          token: localStorage.getItem('ID_TOKEN'),
          tokenExpirationDate: localStorage.getItem('ID_TOKEN_EXPIRATION_DATE')
        })
        dispatch('startTokenExpirationTimer')
      }
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: GSI_CLIENT_ID
        })
      })
    },
    async signInAction ({ commit, dispatch }) {
      const googleUser = await window.gapi.auth2.getAuthInstance().signIn({
        prompt: 'select_account'
      })
      const authResponse = googleUser.getAuthResponse()
      commit('signedIn', {
        token: authResponse.id_token,
        tokenExpirationDate: authResponse.expires_at
      })
      dispatch('startTokenExpirationTimer')
    },
    startTokenExpirationTimer ({ commit, dispatch }) {
      const tokenExpirationTimerId = setInterval(
        () => {
          const tokenExpirationDate = localStorage.getItem('ID_TOKEN_EXPIRATION_DATE')
          if (Date.now() > tokenExpirationDate - 60000) { // 3590000) { // expire after 10s for test purpose
            console.log('almost outdated token, try renew it')
            window.gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
              .then(authResponse => commit('signedIn', {
                token: authResponse.id_token,
                tokenExpirationDate: authResponse.expires_at
              }))
              .catch(err => {
                console.log(err)
                dispatch('signOutAction')
              })
          }
        },
        EXPIRATION_TIMER_PERIOD
      )
      commit('setTokenExpirationTimerID', tokenExpirationTimerId)
    },
    signOutAction ({ commit }) {
      window.gapi.auth2.getAuthInstance().signOut()
      commit('removeTokenExpirationTimer')
      commit('signedOut')
    }
  }
})
