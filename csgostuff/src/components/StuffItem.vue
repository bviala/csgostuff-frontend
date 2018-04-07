<template>
    <v-flex>
        <v-card>
            <v-card-media :src="stuff.gifURL" height="300px"></v-card-media>
            <v-card-title primary-title>
                <h3 class="headline mb-0">
                     {{stuff.name}}
                </h3>
            </v-card-title>
            <v-card-actions>
                <v-btn dark>See</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>

<script>
    export default {
        name: 'StuffItem',
        props: ['stuff']       
    }
</script>
