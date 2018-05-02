<template>
    <v-flex>
        <v-card flat >
            <v-card-media :src="stuff.gifURL" height="450px"></v-card-media>
            <v-layout row>
              
              <v-flex xs1 class="ml-2">
                <v-layout column align-center="true">
                  <v-btn icon flat color="green">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>
                  {{stuff.score}}
                  <v-btn icon flat color="red">
                    <v-icon>keyboard_arrow_down</v-icon>
                  </v-btn>
                </v-layout>
              </v-flex>

              <v-flex>
                <v-layout column>
                  <v-card-title class="headline pb-1">
                    {{stuff.name}}
                  </v-card-title>
                  <v-card-title class="py-0">
                    {{stuff.map}}
                  </v-card-title>
                  <v-card-title class="py-0">
                    {{stuff.stuffType}}
                  </v-card-title>
                </v-layout>              
              </v-flex>
              
            </v-layout>
        </v-card>
    </v-flex>
</template>

<script>
  export default {
    name: 'StuffItem',
    props: ['stuff']
  }
</script>
