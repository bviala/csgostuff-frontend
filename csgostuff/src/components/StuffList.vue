<template>
    <div>
        <v-container grid-list-xl>
            <v-flex xs12 sm6 offset-sm3>
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
    import { STUFF_LIST_QUERY} from '../constants/graphql.js'
    import StuffItem from './StuffItem'
    export default {
        name: 'StuffList',
        data () {
            return {
                stuffs: [],
                loading: 0
            };
        },
        components: {
            StuffItem
        },
        apollo: {
            stuffs: {
                query: STUFF_LIST_QUERY
            }
        }

    }
</script>

