<template>
    <v-flex>
        <v-card>
            <v-card-media :src="stuff.gifURL" height="300px"></v-card-media>
            <v-card-title class="mb-0">
              <h3 class="headline">
                    {{stuff.name}}
              </h3>
            </v-card-title>
            <v-card-text class="mt-0 pt-0">
              <div>{{stuff.map}}</div> 
              <div>{{stuff.stuffType}}</div>
              <div>{{stuff.score}}</div>
            </v-card-text>
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
