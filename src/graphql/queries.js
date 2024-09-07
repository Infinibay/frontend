import { gql } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      firstName
      lastName
      email
      role
      createdAt
    }
  }
`;
