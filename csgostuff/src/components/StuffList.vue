<template>
    <div>
        <v-container grid-list-xl>
            <v-layout>
                <stuff-item
                    v-for="stuff in allStuffs"
                    :key="stuff.id"
                    :stuff="stuff">
                </stuff-item>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import StuffItem from './StuffItem'
    export default {
        name: 'StuffList',
        data () {
            return {
                allStuffs: [
                    {
                        id: 1,
                        name: 'mirage flash',
                        url: 'https://media.giphy.com/media/1qZ7LI7NTa1ewfe3fu/giphy.gif'
                    },
                    {
                        id: 2,
                        name: 'overpass boost',
                        url: 'https://media.giphy.com/media/1qZ7LI7NTa1ewfe3fu/giphy.gif'
                    },
                    {
                        id: 3,
                        name: 'dust2 smoke',
                        url: 'https://media.giphy.com/media/1qZ7LI7NTa1ewfe3fu/giphy.gif'
                    }
                ]
            }
        },
        components: {
            StuffItem
        }
    }
</script>

