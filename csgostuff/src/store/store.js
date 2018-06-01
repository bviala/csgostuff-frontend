import Vue from 'vue'
import Vuex from 'vuex'
import { GSI_CLIENT_ID } from '../secrets'

Vue.use(Vuex)

const EXPIRATION_TIMER_PERIOD = 1000 // ms
const googleSignInParams = {
  client_id: GSI_CLIENT_ID
}

export default new Vuex.Store({
  state: {
    isUserSignedIn: false,
    pendingSignIn: false,
    expirationTimerId: null
  },
  mutations: {
    signIn (state) {
      state.isUserSignedIn = true
    },
    signOut (state) {
      state.isUserSignedIn = false
    },
    signedIn (state) {
      state.pendingSignIn = false
      state.isUserSignedIn = true
    },
    setExpirationTimerId (state, id) {
      state.expirationTimerId = id
    },
    removeExpirationTimer (state) {
      console.log('removeExpirationTimer Mutation')
      clearInterval(state.expirationTimerId)
      state.expirationTimerId = null
    }
  },
  actions: {
    async signOutAction ({ dispatch, commit }) {
      console.log('signOutAction')
      await window.gapi.load('auth2')
      const auth2 = await window.gapi.auth2.init(googleSignInParams)
      // await auth2.disconnect()
      await auth2.signOut()
      localStorage.removeItem('ID_TOKEN')
      localStorage.removeItem('ID_TOKEN_EXPIRATION')

      commit('removeExpirationTimer')
      commit('signOut')
    },
    async checkLocalStorageForToken ({ commit, dispatch }) { // rename Init Auth or smthg
      console.log('checkLocalStorageForToken Action')

      window.gapi.load('auth2', () => {
        console.log('auth2 loaded')
        const googleAuthInstance = window.gapi.auth2.init({
          client_id: GSI_CLIENT_ID
        })
        googleAuthInstance.then((googleAuthInstance) => {
          console.log('auth2 init')
          return googleAuthInstance.isSignedIn.get()
          // return googleAuthInstance
        }).then((isUserSignedIn) => {
          console.log('isUserSignedIn: ' + isUserSignedIn)
        })
      })

      if ( // valid ID token in localStorage
        localStorage.getItem('ID_TOKEN') != null &&
        localStorage.getItem('ID_TOKEN_EXPIRATION') != null &&
        Date.now() < localStorage.getItem('ID_TOKEN_EXPIRATION')
      ) {
        dispatch('signedInAction')
      }
    },
    signedInAction ({ dispatch, commit }) {
      console.log('signedInaction')
      const expirationDate = localStorage.getItem('ID_TOKEN_EXPIRATION')
      const expirationTimerId = setInterval(
        () => {
          console.log('checking date')
          if (Date.now() > expirationDate - 3590000) { // expire after 10s for test purpose
            console.log('outdated token, dispatching signOutAction')
            // SEND EVENT FOR DIALOG DISPLAY ?
            dispatch('signOutAction')
          }
        },
        EXPIRATION_TIMER_PERIOD
      )
      commit('setExpirationTimerId', expirationTimerId)
      commit('signedIn')
    },
    /* signInAction ({ dispatch, commit }, googleUser) {
      console.log('LOGGED ! ID_TOKEN: ' + googleUser.getAuthResponse().id_token)
      localStorage.setItem('ID_TOKEN', googleUser.getAuthResponse().id_token)
      localStorage.setItem('ID_TOKEN_EXPIRATION', googleUser.getAuthResponse().expires_at)

      dispatch('signedInAction')
    } */
    signInAction ({ dispatch, commit }) {
      const auth2 = window.gapi.auth2.getAuthInstance()
      auth2.signIn({
        prompt: 'select_account'
      }).then((googleUser) => {
        console.log('LOGGED ! ID_TOKEN: ' + googleUser.getAuthResponse().id_token)
        localStorage.setItem('ID_TOKEN', googleUser.getAuthResponse().id_token)
        localStorage.setItem('ID_TOKEN_EXPIRATION', googleUser.getAuthResponse().expires_at)
        dispatch('signedInAction')
      })
    }
  }
})
