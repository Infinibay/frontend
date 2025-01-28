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
    }
  }
`;

export const DELETE_MACHINE_MUTATION = gql`
  mutation DeleteMachine($id: String!) {
    destroyMachine(id: $id) {
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
export const DELETE_DEPARTMENT_MUTATION = gql`
  mutation DeleteDepartment($id: String!) {
    destroyDepartment(id: $id) {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
  }
`;

export const CREATE_DEPARTMENT_MUTATION = gql`
  mutation CreateDepartment($name: String!) {
    createDepartment(name: $name) {
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

export const CREATE_APPLICATION_MUTATION = gql`
  mutation CreateApplication($input: CreateApplicationInputType!) {
    createApplication(input: $input) {
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

export const UPDATE_APPLICATION_MUTATION = gql`
  mutation UpdateApplication($input: CreateApplicationInputType!, $id: String!) {
    updateApplication(input: $input, id: $id) {
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

export const DELETE_APPLICATION_MUTATION = gql`
  mutation DeleteApplication($id: String!) {
    destroyApplication(id: $id)
  }
`;

export const CREATE_MACHINE_TEMPLATE_MUTATION = gql`
  mutation CreateMachineTemplate($input: MachineTemplateInputType!) {
    createMachineTemplate(input: $input) {
      id
      name
      description
      cores
      ram
      storage
      createdAt
      categoryId
    }
  }
`;

export const UPDATE_MACHINE_TEMPLATE_MUTATION = gql`
  mutation UpdateMachineTemplate($input: MachineTemplateInputType!, $id: String!) {
    updateMachineTemplate(input: $input, id: $id) {
      id
      name
      description
      cores
      ram
      storage
      createdAt
      categoryId
    }
  }
`;

export const CREATE_MACHINE_TEMPLATE_CATEGORY_MUTATION = gql`
  mutation CreateMachineTemplateCategory($input: MachineTemplateCategoryInputType!) {
    createMachineTemplateCategory(input: $input) {
      id
      name
      description
      createdAt
    }
  }
`;

export const UPDATE_MACHINE_TEMPLATE_CATEGORY_MUTATION = gql`
  mutation UpdateMachineTemplateCategory($input: MachineTemplateCategoryInputType!, $id: String!) {
    updateMachineTemplateCategory(input: $input, id: $id) {
      id
      name
      description
      createdAt
    }
  }
`;

export const DESTROY_MACHINE_TEMPLATE_MUTATION = gql`
  mutation DestroyMachineTemplate($id: String!) {
    destroyMachineTemplate(id: $id)
  }
`;

export const DESTROY_MACHINE_TEMPLATE_CATEGORY_MUTATION = gql`
  mutation DestroyMachineTemplateCategory($id: String!) {
    destroyMachineTemplateCategory(id: $id)
  }
`;

export const MOVE_MACHINE_MUTATION = gql`
  mutation MoveMachine($departmentId: String!, $id: String!) {
    moveMachine(departmentId: $departmentId, id: $id) {
      id
      name
      status
      department {
        id
        name
      }
    }
  }
`;