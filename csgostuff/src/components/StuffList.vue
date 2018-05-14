<template>
  <v-container grid-list-xl fluid>
    <v-layout row class="pa-3">
      <v-flex xs3 id="sidePanel">
        <v-select
          label="Map" 
          :items="mapOptions" 
          v-model="selectedMap"
          @change="resetStuffList">
        </v-select>
        <v-select
          label="Type" 
          :items="typeOptions" 
          v-model="selectedType"
          @change="resetStuffList">
        </v-select> 
      </v-flex>
      <v-flex xs9 offset-xs3>
        <v-layout column class="ml-3">
          <div v-if="loading" id="vpc">
            <v-progress-circular :size="75" indeterminate color="primary"></v-progress-circular>
          </div>         
          <v-list v-if="stuffsConnection">
            <template v-for="edge in stuffsConnection.edges">
              <stuff-item
                :key="edge.node.id"
                :stuff="edge.node">
              </stuff-item>
            </template>
          </v-list>

          <!-- v-if prevent infiniteHandler to be called  -->
          <infinite-loading 
            v-if="stuffsConnection"
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
          loading: 0,
          stuffListPaginationCursor: null,
          hasNextPage: true // pageSize - 1
        }
      },
      computed: {
        isUserSignedIn () {
          return this.$store.state.isUserSignedIn
        }
      },
      watch: {
        // when user sign in, refetch to get current vote for each stuff
        isUserSignedIn: async function (value) {
          if (value === true) this.resetStuffList()
        },
        stuffsConnection: function (value) {
          console.log('stuffsConnection update: ' + value)
          this.stuffListPaginationCursor = value.pageInfo.endCursor

          console.log('hasNextPage: ' + value.pageInfo.hasNextPage)
          this.hasNextPage = value.pageInfo.hasNextPage
        }
      },
      components: {
        StuffItem,
        InfiniteLoading
      },
      apollo: {
        stuffsConnection: {
          query: STUFFS_CONNECTION,
          variables () {
            return {
              map: this.selectedMap,
              stuffType: this.selectedType,
              first: pageSize,
              after: null
            }
          }
        }
      },
      methods: {
        async resetStuffList () {
          console.log('resetStuffList')
          await this.$vuetify.goTo(0, {duration: 0})
          await this.$apollo.queries.stuffsConnection.refetch()
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        },
        async infiniteHandler ($state) {
          console.log('infiniteHandler triggered')
          if (this.hasNextPage) {
            let localHasNextPage
            await this.$apollo.queries.stuffsConnection.fetchMore({
              variables: {
                map: this.selectedMap,
                stuffType: this.selectedType,
                first: pageSize,
                after: this.stuffListPaginationCursor
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                const newEdges = fetchMoreResult.stuffsConnection.edges
                const pageInfo = fetchMoreResult.stuffsConnection.pageInfo

                localHasNextPage = pageInfo.hasNextPage

                return {
                  stuffsConnection: {
                    __typename: this.stuffsConnection.__typename,
                    edges: [...this.stuffsConnection.edges, ...newEdges],
                    pageInfo: pageInfo
                  }
                }
              }
            })
            $state.loaded()
            if (!localHasNextPage) $state.complete()
          } else {
            $state.loaded()
            $state.complete()
          }
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
  .lol {
    height: 400px;
  }
</style>

