import { gql } from '@apollo/client';

export const CREATE_MACHINE_MUTATION = gql`
  mutation CreateMachine($input: CreateMachineInputType!) {
    createMachine(input: $input) {
      id
      name
      status
      userId
      templateId
      createdAt
      user {
        id
        firstName
        lastName
        email
        role
      }
      template {
        id
        name
        description
        cores
        ram
        storage
      }
      config {
        vnc
      }
    }
  }
`;

export const DELETE_MACHINE_MUTATION = gql`
  mutation DeleteMachine($id: String!) {
    destroyMachine(id: ID) {
      success
      message
    }
  }
`;

export const POWER_ON_MUTATION = gql`
  mutation PowerOn($id: String!) {
    powerOn(id: $id) {
      success
      message
    }
  }
`;

export const POWER_OFF_MUTATION = gql`
  mutation PowerOff($id: String!) {
    powerOff(id: $id) {
      success
      message
    }
  }
`;

export const SUSPEND_MUTATION = gql`
  mutation Suspend($id: String!) {
    suspend(id: $id) {
      success
      message
    }
  }
`;
// DEPARTMENTS
export const DELETE_DEPARMENT_MUTATION = gql`
  mutation DeleteDepartment($id: String!) {
    destroyDepartment(id: $id) {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
    }
  }
`;

export const CREATE_DEPARMENT_MUTATION = gql`
  mutation CreateDepartment($name: String!) {
    createDepartment(name: $name) {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
    }
  }
`;