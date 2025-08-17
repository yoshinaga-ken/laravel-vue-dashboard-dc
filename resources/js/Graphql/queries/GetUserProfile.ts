import { gql } from 'graphql-tag'

export const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      name
      email
      current_team_id
      profile_photo_path
      profile_photo_url
      created_at
      updated_at
      articles(first: 10, page: 1) {
        paginatorInfo {
          count
          total
          currentPage
          lastPage
        }
        data {
          id
          title
          body
          tags {
            id
            name
          }
        }
      }
      followers(first: 12, page: 1) {
        paginatorInfo {
          count
          total
        }
        data {
          id
          name
          profile_photo_url
        }
      }
      following(first: 12, page: 1) {
        paginatorInfo {
          count
          total
        }
        data {
          id
          name
          profile_photo_url
        }
      }
      ownedTeams {
        id
        name
        personal_team
      }
      teams {
        id
        name
        personal_team
      }
    }
  }
`
