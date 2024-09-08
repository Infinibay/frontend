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

export const USERS_QUERY = gql`
  query {
    users {
      id
      firstName
      lastName
      email
      role
      createdAt
    }
  }
`;

export const MACHINE_TEMPLATES_QUERY = gql`
  query {
    machineTemplates {
    id
    name
    description
    cores
    ram
    storage
    createdAt
    template {
      id
      name
      description
      cores
      ram
      storage
      createdAt
    }
    user {
      id
      firstName
      lastName
      role
      createdAt
    }
  }
}
`;

export const MACHINES_QUERY = gql`
  query {
    machines {
    id
    name
    config
    status
    userId
    templateId
    createdAt
      template {
      id
      name
    }
      user {
      id
      firstName
      lastName
    }
  }
}
`;