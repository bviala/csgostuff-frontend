import gql from 'graphql-tag'

export const STUFF_LIST_QUERY = gql`
    query allStuffQuery{
        stuffs {
            id
            name
            map
            stuffType
            gifURL
            score
        }
    }
`
