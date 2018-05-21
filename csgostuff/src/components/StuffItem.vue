<template>
    <v-flex>
        <v-card flat>
            <v-card-media height="500px">
              <video 
                class="video-full-width" 
                :src="stuff.gifURL" 
                autoplay 
                muted 
                loop>
              </video>
            </v-card-media>
            <v-layout row>
              <v-flex xs1 class="ml-2">
                <v-layout column align-center="true">
                  <v-btn 
                    icon flat
                    v-bind:disabled="!isUserSignedIn"
                    v-bind:color="upvoteButtonColor"
                    @click="upvote">
                    <v-icon>keyboard_arrow_up</v-icon>
                  </v-btn>
                  {{localScore}}
                  <v-btn
                    icon flat
                    v-bind:disabled="!isUserSignedIn"
                    v-bind:color="downvoteButtonColor"
                    @click="downvote">
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
  import { VOTE_MUTATION, REMOVE_VOTE_MUTATION } from '../constants/graphql'
  export default {
    name: 'StuffItem',
    props: ['stuff'],
    data () {
      return {
        localMyVote: this.stuff.myVote,
        localScore: this.stuff.score
      }
    },
    computed: {
      isUserSignedIn () {
        return this.$store.state.isUserSignedIn
      },
      upvoteButtonColor () {
        return this.localMyVote === 'UPVOTE' ? 'green' : ''
      },
      downvoteButtonColor () {
        return this.localMyVote === 'DOWNVOTE' ? 'red' : ''
      }
    },
    /* watch: {
      // update localMyVote on user sign in
      stuff: function (value) {
        this.localMyVote = value.myVote
      }
    }, */
    methods: {
      upvote () {
        if (this.localMyVote === 'UPVOTE') {
          this.apolloRemoveVote()
          this.localMyVote = null
          this.localScore--
        } else if (this.localMyVote === 'DOWNVOTE') {
          this.apolloVote('UPVOTE')
          this.localMyVote = 'UPVOTE'
          this.localScore += 2
        } else {
          this.apolloVote('UPVOTE')
          this.localMyVote = 'UPVOTE'
          this.localScore++
        }
      },
      downvote () {
        if (this.localMyVote === 'DOWNVOTE') {
          this.apolloRemoveVote()
          this.localMyVote = null
          this.localScore++
        } else if (this.localMyVote === 'UPVOTE') {
          this.apolloVote('DOWNVOTE')
          this.localMyVote = 'DOWNVOTE'
          this.localScore -= 2
        } else {
          this.apolloVote('DOWNVOTE')
          this.localMyVote = 'DOWNVOTE'
          this.localScore--
        }
      },
      apolloVote (voteType) {
        this.$apollo.mutate({
          mutation: VOTE_MUTATION,
          variables: {
            stuffID: this.stuff.id,
            voteType: voteType
          }
        })
      },
      apolloRemoveVote () {
        this.$apollo.mutate({
          mutation: REMOVE_VOTE_MUTATION,
          variables: {
            stuffID: this.stuff.id
          }
        })
      }
    }
  }
</script>
<style>
.video-full-width {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>