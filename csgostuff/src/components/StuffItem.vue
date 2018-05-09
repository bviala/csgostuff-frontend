<template>
    <v-flex>
        <v-card flat >
            <v-card-media :src="stuff.gifURL" height="450px"></v-card-media>
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
        upvoted: this.stuff.myVote === 'UPVOTE',
        downvoted: this.stuff.myVote === 'DOWNVOTE',
        offsetScore: this.stuff.myVote === 'UPVOTE' ? 1 : this.stuff.myVote === 'DOWNVOTE' ? -1 : 0 // keeps in memory the user vote at load time
      }
    },
    computed: {
      isUserSignedIn () {
        return this.$store.state.isUserSignedIn
      },
      upvoteButtonColor () {
        return this.upvoted ? 'green' : ''
      },
      downvoteButtonColor () {
        return this.downvoted ? 'red' : ''
      },
      localScore () {
        if (this.upvoted) {
          return this.stuff.score + 1 - this.offsetScore
        } else if (this.downvoted) {
          return this.stuff.score - 1 - this.offsetScore
        } else {
          return this.stuff.score - this.offsetScore
        }
      }
    },
    methods: {
      upvote () {
        if (this.upvoted) {
          this.apolloRemoveVote()
        } else {
          this.apolloVote('UPVOTE')
        }

        this.upvoted = !this.upvoted
        this.downvoted = false
      },
      downvote () {
        if (this.downvoted) {
          this.apolloRemoveVote()
        } else {
          this.apolloVote('DOWNVOTE')
        }

        this.downvoted = !this.downvoted
        this.upvoted = false
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
