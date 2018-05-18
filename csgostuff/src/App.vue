<template>
  <v-app>
    <v-toolbar flat dark fixed>
      <v-toolbar-title id="toolbar-title" class="mx-4">CSGO Stuff</v-toolbar-title>
        // WORK IN PROGRESS
      <v-spacer></v-spacer>
      <button
        id="signoutButton"
        v-if="isUserSignedIn"
        v-on:click="logout">
        Sign out
      </button>
      <g-signin-button
        v-else
        :params="googleSignInParams"
        @success="onSignInSuccess"
        @error="onSignInError">
        Sign in with Google
      </g-signin-button>
    </v-toolbar>
    <v-dialog v-model="disconnectedDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Session expired
        </v-card-title>
        <v-card-text>
          Please sign in again
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-content class="mt-5" >
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { GSI_CLIENT_ID } from './secrets'
export default {
  data () {
    return {
      /**
       * The Auth2 parameters, as seen on
       * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
       * As the very least, a valid client_id must present.
       * @type {Object}
       */
      googleSignInParams: {
        client_id: GSI_CLIENT_ID
      },
      tokenExpirationWatcherID: null,
      disconnectedDialog: false
    }
  },
  created () {
    if (
      localStorage.getItem('ID_TOKEN') != null &&
      localStorage.getItem('ID_TOKEN_EXPIRATION') != null &&
      Date.now() < localStorage.getItem('ID_TOKEN_EXPIRATION')
    ) {
      this.$store.commit('signIn')
      this.startTokenExpirationWatcher()
    }
  },
  computed: {
    isUserSignedIn () {
      return this.$store.state.isUserSignedIn
    }
  },
  methods: {
    startTokenExpirationWatcher () {
      console.log('Starting TokenExpirationWatcher')
      const expirationDate = localStorage.getItem('ID_TOKEN_EXPIRATION')
      const autoLogout = this.autoLogout
      const checkTokenValidity = () => {
        const now = Date.now()
        if (now > expirationDate) { // - 3590000) { // 10s margin
          console.log('ID token expired, calling autologout()')
          autoLogout()
        }
      }
      this.tokenExpirationWatcherID = setInterval(checkTokenValidity, 1000) // check every second for token validity
    },
    stopTokenExpirationWatcher () {
      console.log('Stopping TokenExpirationWatcher')
      clearInterval(this.tokenExpirationWatcherID)
    },
    onSignInSuccess (googleUser) {
      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users

      localStorage.setItem('ID_TOKEN', googleUser.getAuthResponse().id_token)
      console.log('LOGGED ! ID_TOKEN: ' + googleUser.getAuthResponse().id_token)

      localStorage.setItem('ID_TOKEN_EXPIRATION', googleUser.getAuthResponse().expires_at)
      console.log('JWT will expire at ' + googleUser.getAuthResponse().expires_at)

      this.$store.commit('signIn')
      this.startTokenExpirationWatcher()
    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('OH NOES', error)
    },
    autoLogout () {
      this.logout()
      this.disconnectedDialog = true
    },
    logout () {
      window.gapi.load('auth2', () => {
        const auth2 = window.gapi.auth2.init(this.googleSignInParams)
        auth2.then(() => {
          auth2.disconnect().then(() => {
            localStorage.removeItem('ID_TOKEN')
            localStorage.removeItem('ID_TOKEN_EXPIRATION')

            this.$store.commit('signOut')
            this.stopTokenExpirationWatcher()
            console.log('User disconnected.')
          })
        })
      })
    }
  }
}
</script>

<style>
  .g-signin-button {
    /* This is where you control how the button looks. Be creative! */
    display: inline-block;
    padding: 4px 8px;
    background-color: #3c82f7;
    color: #fff;
    cursor: pointer;
  }
  #signoutButton {
    display: inline-block;
    padding: 4px 8px;
    background-color: #3c82f7;
    color: #fff;
  }
  #toolbar-title{
    font-weight: normal;
  } 
</style>
