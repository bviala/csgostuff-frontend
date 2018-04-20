<template>
    <div>
        <v-container grid-list-xl>
            <v-flex xs12 sm6 offset-sm3>
                <v-layout row wrap>
                    <v-flex d-flex xs12>
                        <v-select class="pr-2" label="Map" :items="mapOptions" v-model="selectedMap"></v-select>
                        <v-select class="pl-2" label="Type" :items="typeOptions" v-model="selectedType"></v-select>
                    </v-flex>
                </v-layout>
                <v-layout column wrap>
                    <h4 class="headline mb-0" v-if="loading">Loading stuffs...</h4>
                    <stuff-item
                        v-for="stuff in stuffs"
                        :key="stuff.id"
                        :stuff="stuff">
                    </stuff-item>
                </v-layout>
            </v-flex>
        </v-container>
    </div>
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

