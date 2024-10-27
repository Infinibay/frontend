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
        port
        address
      }
    }
  }
`;
