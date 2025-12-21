import { gql } from 'graphql-tag'

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
      profile_photo_path
      profile_photo_url
      created_at
      updated_at
    }
  }
`

