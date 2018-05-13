import gql from 'graphql-tag'

export const STUFFS_CONNECTION = gql`
    query stuffsConnection($map: Map, $stuffType: StuffType, $first: Int, $after: String){
        stuffsConnection(map: $map, stuffType: $stuffType, first: $first, after: $after){
            edges{
                node{
                    id
                    name
                    map
                    stuffType
                    gifURL
                    score
                    myVote
                }
            }
            pageInfo{
                endCursor
                hasNextPage
            }
        }
    }
`
export const VOTE_MUTATION = gql`
    mutation voteMutation($stuffID: ID!, $voteType: VoteType!){ 
        vote(stuffID: $stuffID, voteType: $voteType) 
    }
`
export const REMOVE_VOTE_MUTATION = gql`
    mutation removeVoteMutation($stuffID: ID!){ 
        removeVote(stuffID: $stuffID) 
    }
`
