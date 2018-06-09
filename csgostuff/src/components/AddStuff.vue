<template>
  <v-container class="creationForm">
    <div class="headline py-3">
      Add a new stuff
    </div>
    <!-- <v-dialog
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
    </v-btn> -->
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
      label="gfycat URL"
      v-model="gifUrl"
      :error-messages="gifUrlErrorMessage">
    </v-text-field>
    <v-btn
      color="primary"
      :dark="isFormValid"
      :disabled="!isFormValid"
      @click="createStuff">
      submit
    </v-btn>
    <!-- <v-card
      v-if="validatedGifMp4Url">
      <v-card-media>
        <video
          class="video-full-width"
          :src="validatedGifMp4Url"
          autoplay 
          muted 
          loop>
        </video>
      </v-card-media>
    </v-card> -->
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
import axios from 'axios'

const stuffNameMinLength = 5
const stuffNameMaxLength = 50
const gfycatGifUrlValidator = /^https:\/\/gfycat.com\/[a-zA-Z]{2}\/gifs\/detail\/([a-zA-Z]+)$/

export default {
  data () {
    return {
      stuffName: null,
      stuffNameErrorMessage: [],
      stuffNameValidated: false,

      selectedMap: null,
      mapOptions: mapOptions,

      selectedStuffType: null,
      stuffTypeOptions: stuffTypeOptions,

      gifUrl: null,
      gifUrlErrorMessage: [],
      validatedGifMp4Url: null,

      validationSnackbar: false,
      errorSnackbar: false,
      helpDialog: false
    }
  },
  computed: {
    isFormValid () {
      return this.stuffNameValidated &&
        !!this.validatedGifMp4Url &&
        !!this.selectedMap &&
        !!this.selectedStuffType
    },
    isUserSignedIn () {
      return this.$store.state.isUserSignedIn
    }
  },
  watch: {
    stuffName: function () {
      this.debouncedValidateStuffName()
    },
    gifUrl: function () {
      this.debouncedCheckGifUrl()
    },
    isUserSignedIn: function (isUserSignedIn) {
      if (!isUserSignedIn) this.$router.push('/')
    }
  },
  created () {
    this.debouncedValidateStuffName = _.debounce(this.validateStuffName, 500)
    this.debouncedCheckGifUrl = _.debounce(this.checkGifUrl, 500)
  },
  methods: {
    showHelpDialog () {
      this.helpDialog = true
    },
    resetForm () {
      this.stuffName = null
      this.selectedMap = null
      this.selectedStuffType = null
      this.gifUrl = null
      this.stuffNameErrorMessage = []
      this.gifUrlErrorMessage = []
    },
    setForm ({ stuffName, selectedMap, selectedStuffType, gifUrl }) {
      this.stuffName = stuffName
      this.selectedMap = selectedMap
      this.selectedStuffType = selectedStuffType
      this.gifUrl = gifUrl
    },
    validateStuffName () {
      this.stuffNameValidated = false
      if (!this.stuffName) {
        this.stuffNameErrorMessage = []
        return
      }
      this.stuffNameErrorMessage = []
      if (this.stuffName.length < stuffNameMinLength) {
        this.stuffNameErrorMessage = `Too short ! Minimum ${stuffNameMinLength} characters`
        return
      }
      if (this.stuffName.length > stuffNameMaxLength) {
        this.stuffNameErrorMessage = `Too long ! Maximum ${stuffNameMaxLength} characters`
        return
      }
      if (!/^\w+((\s|')\w+)*$/.test(this.stuffName)) {
        this.stuffNameErrorMessage = 'Unallowed characters or unnecessary whitespace'
        return
      }
      this.stuffNameValidated = true
    },
    async checkGifUrl () {
      this.validatedGifMp4Url = null
      if (!this.gifUrl) {
        this.gifUrlErrorMessage = []
        return
      }
      this.gifUrlErrorMessage = []
      const gifId = gfycatGifUrlValidator.exec(this.gifUrl)
      if (!gifId) {
        this.gifUrlErrorMessage = 'Invalid URL'
        return
      }
      const gifDetails = await axios.get(`https://gfycat.com/cajax/get/${gifId[1]}`)
      if (gifDetails.data.error) {
        this.gifUrlErrorMessage = 'Invalid GIF ID'
        return
      }
      this.validatedGifMp4Url = gifDetails.data.gfyItem.mp4Url
    },
    createStuff () {
      const savedForm = {
        stuffName: this.stuffName,
        selectedMap: this.selectedMap,
        selectedStuffType: this.selectedStuffType,
        gifUrl: this.gifUrl
      }
      const savedValidatedGifMp4Url = this.validatedGifMp4Url
      this.resetForm()
      this.$apollo.mutate({
        mutation: CREATE_STUFF_MUTATION,
        variables: {
          name: savedForm.stuffName,
          map: savedForm.selectedMap,
          stuffType: savedForm.selectedStuffType,
          gifURL: savedValidatedGifMp4Url
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
.video-full-width {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
