import { gql } from 'graphql-tag'

export const GET_CURRENT_USER_FOLLOWING = gql`
  query GetCurrentUserFollowing {
    loginUser {
      id
      following(first: 1000) {
        data {
          id
          name
        }
      }
    }
  }
`
