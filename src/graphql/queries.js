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
    users(pagination: {}, orderBy: {}) {
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

export const GET_VNC_QUERY = gql`
  query getVnc($machineId: String!) {
    vncConnection(id: $machineId) {
      link
      password
    }
  }
`;