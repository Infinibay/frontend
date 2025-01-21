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
      status
      userId
      templateId
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
      }
      department {
       id
       name
      }
       configuration {
         graphicHost
         graphicPort
         graphicProtocol
         graphicPassword
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
// DEPARTEMENTS

export const DEPARTMENTS_QUERY = gql`
  query {
    departments {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
    }
  }
`;

export const DEPARTMENT_QUERY = gql`
  query department($id: String!) {
    department(id: $id) {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
  }
`;

export const FIND_DEPARTMENT_BY_NAME_QUERY = gql`
  query findDepartmentByName($name: String!) {
    findDepartmentByName(name: $name) {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
  }
`;

// APPLICATIONS

export const APPLICATIONS_QUERY = gql`
  query {
    applications {
      id
      name
      description
      os
      installCommand
      parameters
      createdAt
    }
  }
`;

export const APPLICATION_QUERY = gql`
  query application($id: String!) {
    application(id: $id) {
      id
      name
      description
      os
      installCommand
      parameters
      createdAt
    }
  }
`;
