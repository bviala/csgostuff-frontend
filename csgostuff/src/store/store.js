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
    async initAuth ({ state, commit, dispatch }) { // rename Init Auth or smthg
      window.gapi.load('auth2', () => {
        window.gapi.auth2.init({
          client_id: GSI_CLIENT_ID
        })
          .then((googleAuthInstance) => {
            console.log('googleAuthInstance initialized')
            if (googleAuthInstance.isSignedIn.get()) { // user already connected
              dispatch('signedInAction', googleAuthInstance.currentUser.get().getAuthResponse())
            }
          })
      })
    },
    async signInAction ({ dispatch, commit }) {
      const googleUser = await window.gapi.auth2.getAuthInstance().signIn({
        prompt: 'select_account'
      })
      dispatch('signedInAction', googleUser.getAuthResponse())
    },
    signedInAction ({ state, dispatch, commit }, authResponse) {
      console.log('signedInaction')

      clearInterval(state.tokenExpirationTimerId) // remove any previously set timer

      const token = authResponse.id_token
      const tokenExpirationDate = authResponse.expires_at
      console.log('token: ' + token)
      console.log('expires_at: ' + tokenExpirationDate)

      const tokenExpirationTimerId = setInterval(
        () => {
          console.log('checking date')
          if (Date.now() > tokenExpirationDate - 60000) { // - 3590000) { // expire after 10s for test purpose
            console.log('almost outdated token, try renew it')
            window.gapi.auth2.getAuthInstance().currentUser.get().reloadAuthResponse()
              .then(authResponse => dispatch('signedInAction', authResponse))
              .catch(err => {
                console.log(err)
                commit('signedOut')
              })
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
      window.gapi.auth2.getAuthInstance().signOut()
      commit('signedOut')
    }
  }
})
