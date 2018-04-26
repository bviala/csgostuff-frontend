<template>
    <v-flex>
        <v-card flat >
            <v-card-media :src="stuff.gifURL" height="500px"></v-card-media>
            <v-layout row>
              <v-flex xs2>
                <v-card-text class="my-0 py-0 ml-2">
                <div>{{stuff.map}}</div> 
                <div>{{stuff.stuffType}}</div>
                <!-- <div>{{stuff.score}}</div> -->
                </v-card-text>
              </v-flex>
              <v-flex>
                <v-card-title class="mt-1 mb-0 py-0">
                <h3 class="headline">
                      {{stuff.name}}
                </h3>
                </v-card-title>
              </v-flex>
            </v-layout>
            
            
            <!-- <v-card-actions>
                <v-btn flat>See more</v-btn>
            </v-card-actions> -->
        </v-card>
    </v-flex>
</template>

<script>
  export default {
    name: 'StuffItem',
    props: ['stuff']
  }
</script>
