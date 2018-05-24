<template>
  <v-container grid-list-xl fluid>
    <v-layout row class="pa-3">
      <v-flex xs3 id="sidePanel">
        <v-select
          attach
          label="Map" 
          :items="mapOptions" 
          v-model="selectedMap"
          @change="filterChanged">
        </v-select>
        <v-select
          attach
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

          <!-- v-if prevent infiniteHandler to be called during apollo automatic fetches -->
          <infinite-loading
            v-if="!lockInfiniteHandler"
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
    import mapOptions from '../constants/mapOptions.js'
    import stuffTypeOptions from '../constants/stuffTypeOptions.js'

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
          mapOptions: mapOptions,
          typeOptions: stuffTypeOptions,
          stuffsConnection: null,
          lockInfiniteHandler: true
        }
      },
      computed: {
        isUserSignedIn () {
          return this.$store.state.isUserSignedIn
        }
      },
      watch: {
        // when user signs in, get current vote for each stuff
        isUserSignedIn: function (value) {
          if (value === true) {
            console.log('refetching')

            this.$apollo.queries.stuffsConnection.fetchMore({
              variables: {
                map: this.selectedMap,
                stuffType: this.selectedType,
                first: Number(this.stuffsConnection.pageInfo.endCursor) + 1,
                after: null
              },
              updateQuery: (previousResult, { fetchMoreResult }) => {
                console.log(previousResult)
                console.log(fetchMoreResult)
                return {
                  stuffsConnection: {
                    __typename: previousResult.stuffsConnection.__typename,
                    edges: fetchMoreResult.stuffsConnection.edges,
                    pageInfo: previousResult.stuffsConnection.pageInfo
                  }
                }
              }
            })
          }
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
          },
          manual: true,
          result ({ data, loading }) {
            if (!loading) {
              this.stuffsConnection = data.stuffsConnection
              this.lockInfiniteHandler = false // unlock the infinite handler after apollo automatic fetches and refetches()
              console.log('endCursor: ' + data.stuffsConnection.pageInfo.endCursor)
            }
          }
        }
      },
      methods: {
        async filterChanged () {
          console.log('filterChanged')
          await this.$vuetify.goTo(0, {duration: 0})
          this.lockInfiniteHandler = true // lock the infinite handler on filter change to let apollo manage the refetch
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
        },

        async infiniteHandler ($state) {
          console.log('infiniteHandler triggered')

          if (!this.stuffsConnection.pageInfo.hasNextPage) { // skip if apollo automatic fetch have already loaded all the stuffs
            $state.loaded()
            $state.complete()
            return
          }

          let localHasNextPage
          await this.$apollo.queries.stuffsConnection.fetchMore({
            variables: {
              map: this.selectedMap,
              stuffType: this.selectedType,
              first: pageSize,
              after: this.stuffsConnection.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              localHasNextPage = fetchMoreResult.stuffsConnection.pageInfo.hasNextPage
              return {
                stuffsConnection: {
                  __typename: previousResult.stuffsConnection.__typename,
                  edges: [...previousResult.stuffsConnection.edges, ...fetchMoreResult.stuffsConnection.edges],
                  pageInfo: fetchMoreResult.stuffsConnection.pageInfo
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

