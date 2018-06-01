<template>
  <v-app>
    <v-toolbar flat dark fixed>
      <v-toolbar-title id="toolbar-title" class="mx-4">CSGO Stuff</v-toolbar-title>
        // WORK IN PROGRESS
      <v-spacer></v-spacer>
      <button
        class="authButton"
        v-if="isUserSignedIn"
        v-on:click="$store.dispatch('signOutAction')">
        Sign out
      </button>
      <button
        class="authButton"
        v-else
        v-on:click="$store.dispatch('signInAction')">
        Sign in with Google
      </button>
    </v-toolbar>
    <!-- <v-dialog v-model="disconnectedDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">
          Session expired
        </v-card-title>
        <v-card-text>
          Please sign in again
        </v-card-text>
      </v-card>
    </v-dialog> -->
    <v-content class="mt-5" >
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('checkLocalStorageForToken')
  },
  beforeDestroy () {
    this.$store.commit('removeExpirationTimer')
  },
  computed: {
    isUserSignedIn () {
      return this.$store.state.isUserSignedIn
    }
  }
}
</script>

<style>
  .authButton {
    display: inline-block;
    padding: 4px 8px;
    background-color: #3c82f7;
    color: #fff;
  }
  #toolbar-title{
    font-weight: normal;
  } 
</style>
