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
        }
    }
`
