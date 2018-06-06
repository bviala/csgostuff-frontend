<template>
  <v-container class="creationForm">
    <div class="headline py-3">
      New stuff creation
    </div>
    <v-dialog
      max-width="500px"
      v-model="helpDialog">
      <v-card>
        <v-card-title class="headline">Help</v-card-title>
        <v-card-text>
          <h4>Stuff name:</h4>
          Min 5 characters, max 50 characters, no special characters
        </v-card-text>
        <v-card-text>
          <h4>.mp4 URL examples:</h4>
          https://media.giphy.com/media/l0HlUIl8snxmgscE0/giphy.mp4
          https://zippy.gfycat.com/ZanyAngelicHusky.mp4
          https://fat.gfycat.com/ZanyAngelicHusky.mp4
          https://giant.gfycat.com/ForcefulNiftyBoilweevil.mp4<br><br>
          Please check in your browser if the ressource exists before submitting
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-btn
      icon flat
      @click="showHelpDialog">
      <v-icon>info</v-icon>
    </v-btn>
    <v-text-field 
      label="Stuff Name"
      v-model="stuffName"
      :error-messages="stuffNameErrorMessage">
    </v-text-field>
    <v-select
      label="Map"
      :items="mapOptions"
      v-model="selectedMap">
    </v-select>
    <v-select
      label="Type"
      :items="stuffTypeOptions"
      v-model="selectedStuffType">
    </v-select>
    <v-text-field 
      label=".mp4 URL"
      v-model="mp4Url"
      :error-messages="mp4UrlErrorMessage">
    </v-text-field>
    <v-btn
      color="pink"
      :dark="isFormValid"
      :disabled="!isFormValid"
      @click="createStuff">
      Create Stuff !
    </v-btn>
    <v-snackbar
      :timeout="2000"
      bottom
      v-model="validationSnackbar">
      Stuff successfully created !
      <v-btn flat color="pink" @click.native="validationSnackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar
      :timeout="2000"
      bottom
      v-model="errorSnackbar">
      An error occurred... Please try again
      <v-btn flat color="pink" @click.native="errorSnackbar = false">Close</v-btn>
    </v-snackbar>

  </v-container>
</template>
<script>
import mapOptions from '../constants/mapOptions.js'
import stuffTypeOptions from '../constants/stuffTypeOptions.js'
import { CREATE_STUFF_MUTATION } from '../constants/graphql'
import _ from 'lodash'

const stuffNameValidator = /^(?=.{5,50}$)\w+((\s|')\w+)*$/
const mp4UrlValidator = /(^https:\/\/(zippy|fat|giant).gfycat.com\/.+\.(mp4|webm)$)|(^https:\/\/media.giphy.com\/media\/.+\/giphy.mp4$)/

export default {
  data () {
    return {
      stuffName: null,
      selectedMap: null,
      selectedStuffType: null,
      mapOptions: mapOptions,
      stuffTypeOptions: stuffTypeOptions,
      mp4Url: null,
      stuffNameErrorMessage: [],
      mp4UrlErrorMessage: [],
      validationSnackbar: false,
      errorSnackbar: false,
      helpDialog: false
    }
  },
  computed: {
    isFormValid () {
      return !!this.stuffName && this.stuffNameErrorMessage.length === 0 &&
        !!this.mp4Url && this.mp4UrlErrorMessage.length === 0 &&
        !!this.selectedMap &&
        !!this.selectedStuffType
    },
    isUserSignedIn () {
      return this.$store.state.isUserSignedIn
    }
  },
  watch: {
    stuffName: function () {
      this.debouncedCheckStuffName()
    },
    mp4Url: function () {
      this.debouncedCheckMp4Url()
    },
    isUserSignedIn: function (isUserSignedIn) {
      if (!isUserSignedIn) this.$router.push('/')
    }
  },
  created () {
    this.debouncedCheckStuffName = _.debounce(this.checkStuffName, 500)
    this.debouncedCheckMp4Url = _.debounce(this.checkMp4Url, 500)
  },
  methods: {
    showHelpDialog () {
      this.helpDialog = true
    },
    resetForm () {
      this.stuffName = null
      this.selectedMap = null
      this.selectedStuffType = null
      this.mp4Url = null
      this.stuffNameErrorMessage = []
      this.mp4UrlErrorMessage = []
    },
    setForm ({ stuffName, selectedMap, selectedStuffType, mp4Url }) {
      this.stuffName = stuffName
      this.selectedMap = selectedMap
      this.selectedStuffType = selectedStuffType
      this.mp4Url = mp4Url
    },
    checkStuffName () {
      if (this.stuffName) {
        this.stuffNameErrorMessage = stuffNameValidator.test(this.stuffName) ? [] : 'Invalid name'
      }
    },
    checkMp4Url () {
      if (this.mp4Url) {
        this.mp4UrlErrorMessage = mp4UrlValidator.test(this.mp4Url) ? [] : 'Invalid URL'
      }
    },
    createStuff () {
      const savedForm = {
        stuffName: this.stuffName,
        selectedMap: this.selectedMap,
        selectedStuffType: this.selectedStuffType,
        mp4Url: this.mp4Url
      }
      this.resetForm()
      this.$apollo.mutate({
        mutation: CREATE_STUFF_MUTATION,
        variables: {
          name: savedForm.stuffName,
          map: savedForm.selectedMap,
          stuffType: savedForm.selectedStuffType,
          gifURL: savedForm.mp4Url
        }
      }).then((data) => {
        this.validationSnackbar = true
        console.log(data)
      }).catch((error) => {
        this.setForm(savedForm)
        this.errorSnackbar = true
        console.log(error)
      })
    }
  }
}
</script>
<style>
.creationForm {
  margin-top: 30px;
  padding-right: 250px;
  padding-left: 250px;
}
</style>
