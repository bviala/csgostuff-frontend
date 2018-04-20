<template>
  <v-app>
    <v-toolbar dark fixed>
      <v-toolbar-title class="mx-auto">CSGO Stuff</v-toolbar-title>
      <button 
        v-if="signedIn"
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
    <v-content class="mt-5" >
      <router-view/>
    </v-content>
    <v-footer fixed class="pa-2">
      <div class="mx-auto">WORK IN PROGRESS</div>
    </v-footer>
  </v-app>
</template>

<script>
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
        client_id: '775629744845-hljgo5fqpsmeeo6e028qs64ae73j6e59.apps.googleusercontent.com'
      },
      signedIn: localStorage.getItem('ID_TOKEN') != null
    }
  },
  methods: {
    onSignInSuccess (googleUser) {
      localStorage.setItem('ID_TOKEN', googleUser.getAuthResponse().id_token)
      this.signedIn = true

      // console.log(localStorage.getItem('ID_TOKEN'))

      // `googleUser` is the GoogleUser object that represents the just-signed-in user.
      // See https://developers.google.com/identity/sign-in/web/reference#users

      console.log('LOGGED ! ID_TOKEN: ' + googleUser.getAuthResponse().id_token)
    },
    onSignInError (error) {
      // `error` contains any error occurred.
      console.log('OH NOES', error)
    },
    logout () {
      localStorage.removeItem('ID_TOKEN')
      this.signedIn = false
    }
  }
}
</script>

<style>
  .g-signin-button {
    /* This is where you control how the button looks. Be creative! */
    display: inline-block;
    padding: 4px 8px;
    /* border-radius: 3px; */
    background-color: #3c82f7;
    color: #fff;
    /* box-shadow: 0 3px 0 #0f69ff; */
  }
</style>
