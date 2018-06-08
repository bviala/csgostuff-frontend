<template>
  <v-app>
    <v-toolbar flat dark fixed>
      <v-toolbar-title id="toolbar-title" class="mx-4">CSGO Stuff</v-toolbar-title>
        // WORK IN PROGRESS
      <v-spacer></v-spacer>

      <v-btn
        v-if="isUserSignedIn"
        flat
        color="white"
        @click="$store.dispatch('signOutAction')">
        Sign out
      </v-btn>
      <v-btn
        v-else
        flat
        color="white"
        @click="$store.dispatch('signInAction')">
        Sign in with Google
      </v-btn>
    </v-toolbar>
    <v-content class="mt-5" >
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('initAuth')
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
