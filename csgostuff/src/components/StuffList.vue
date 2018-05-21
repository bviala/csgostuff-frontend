<template>
  <v-container grid-list-xl fluid>
    <v-layout row class="pa-3">
      <v-flex xs3 id="sidePanel">
        <v-select
          label="Map" 
          :items="mapOptions" 
          v-model="selectedMap"
          @change="filterChanged">
        </v-select>
        <v-select
          label="Type" 
          :items="typeOptions" 
          v-model="selectedType"
          @change="filterChanged">
        </v-select> 
      </v-flex>
      <v-flex xs9 offset-xs3>
        <v-layout column class="ml-3"> 
              
          <v-list id="stuffList" v-if="stuffsConnection">
            <template v-for="edge in stuffsConnection.edges">
              <stuff-item
                :key="edge.node.id"
                :stuff="edge.node">
              </stuff-item>
            </template>
          </v-list>

          <!-- v-if prevent infiniteHandler to be called at page creation -->
          <infinite-loading
            v-if="hasInitialQueryBeenDone"
            @infinite="infiniteHandler" 
            :distance="0"
            ref="infiniteLoading">
            <span slot='no-more'>
              No more stuffs !
            </span>
          </infinite-loading>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import { STUFFS_CONNECTION } from '../constants/graphql.js'
    import StuffItem from './StuffItem'
    import InfiniteLoading from 'vue-infinite-loading'

    const pageSize = 3

    // prevents from infinite scroll bug with chrome: see https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
    window.addEventListener('mousewheel', (e) => {
      if (e.deltaY === 1) {
        e.preventDefault()
      }
    })

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
          stuffsConnection: null,
          hasInitialQueryBeenDone: false
        }
      },
      computed: {
        isUserSignedIn () {
          return this.$store.state.isUserSignedIn
        }
      },
      watch: {
        // when user sign in, refetch to get current vote for each stuff
        isUserSignedIn: function (value) {
          if (value === true) this.filterChanged()
        },
        stuffsConnection: function (value) {
          this.hasInitialQueryBeenDone = true
        }
      },
      components: {
        StuffItem,
        InfiniteLoading
      },
      apollo: {
        stuffsConnection: { // initialQuery: this query WILL execute, but just ONCE at app creation. Subsequent queries are managed by infiniteHandler
          query: STUFFS_CONNECTION,
          variables: {
            first: pageSize
          }
        }
      },
      methods: {
        async filterChanged () {
          console.log('filterChanged')
          await this.$vuetify.goTo(0, {duration: 0})
          this.stuffsConnection = null
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        },

        async infiniteHandler ($state) { // manage ALL queries, EXCEPT initial one at page creation
          console.log('infiniteHandler triggered')

          const cursor = this.stuffsConnection ? this.stuffsConnection.pageInfo.endCursor : null
          let localHasNextPage

          await this.$apollo.queries.stuffsConnection.fetchMore({
            variables: {
              map: this.selectedMap,
              stuffType: this.selectedType,
              first: pageSize,
              after: cursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.stuffsConnection.edges

              const edges = this.stuffsConnection ? [...this.stuffsConnection.edges, ...newEdges] : newEdges
              const newPageInfo = fetchMoreResult.stuffsConnection.pageInfo

              localHasNextPage = newPageInfo.hasNextPage

              return {
                stuffsConnection: {
                  __typename: previousResult.stuffsConnection.__typename,
                  edges: edges,
                  pageInfo: newPageInfo
                }
              }
            }
          })
          $state.loaded()
          if (!localHasNextPage) $state.complete()
        }
      }

    }
</script>
<style>
  #sidePanel {
    position: fixed;
    width: 100%;
  }
  #vpc {
    text-align: center;
    padding-top: 50px;
  }
  #stuffList{
    
    background-color: transparent;
  }
</style>

