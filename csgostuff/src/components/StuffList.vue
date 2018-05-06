<template>
        
  <v-container grid-list-xl fluid>
    {{ isUserConnected }}
    <v-layout row class="pa-3">
      <v-flex xs3 id="sidePanel">
        <v-select 
          label="Map" 
          :items="mapOptions" 
          v-model="selectedMap"
          @change="$vuetify.goTo(0, null)">
        </v-select>
        <v-select 
          label="Type" 
          :items="typeOptions" 
          v-model="selectedType"
          @change="$vuetify.goTo(0, null)">
        </v-select> 
      </v-flex>
      <v-flex xs9 offset-xs3>
        <v-layout column class="ml-3">
          <h4 class="headline mb-0" v-if="loading">Loading stuffs...</h4>
          <stuff-item
            v-for="stuff in stuffs"
            :key="stuff.id"
            :stuff="stuff">
          </stuff-item>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>

</template>

<script>
    import { STUFF_LIST_QUERY } from '../constants/graphql.js'
    import StuffItem from './StuffItem'
    export default {
      name: 'StuffList',
      data () {
        return {
          selectedMap: null,
          selectedType: null,
          mapOptions: [
            {text: 'All', value: null},
            {text: 'Cache', value: 'CACHE'},
            {text: 'Cobblestone', value: 'COBBLESTONE'},
            {text: 'Dust 2', value: 'DUST2'},
            {text: 'Inferno', value: 'INFERNO'},
            {text: 'Mirage', value: 'MIRAGE'},
            {text: 'Nuke', value: 'NUKE'},
            {text: 'Overpass', value: 'OVERPASS'},
            {text: 'Train', value: 'TRAIN'}
          ],
          typeOptions: [
            {text: 'All', value: null},
            {text: 'Boost', value: 'BOOST'},
            {text: 'Flash', value: 'FLASH'},
            {text: 'Incendiary', value: 'INCENDIARY'},
            {text: 'Smoke', value: 'SMOKE'}
          ],
          stuffs: [],
          loading: 0
        }
      },
      components: {
        StuffItem
      },
      apollo: {
        stuffs: {
          query: STUFF_LIST_QUERY,
          variables () {
            return {
              map: this.selectedMap,
              stuffType: this.selectedType
            }
          }
        }
      }

    }
</script>
<style>
  #sidePanel {
    position: fixed;
    width: 100%;
    /* border: 1px solid red; */
  }
</style>

