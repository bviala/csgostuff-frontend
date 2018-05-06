import gql from 'graphql-tag'

export const STUFF_LIST_QUERY = gql`
    query allStuffQuery($map: Map, $stuffType: StuffType){
        stuffs(map: $map, stuffType: $stuffType){
            id
            name
            map
            stuffType
            gifURL
            score
            myVote
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
