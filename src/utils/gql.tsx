import { createClient } from "@urql/core";

import { settings } from "../settings";

import appState from "../providers/global";

export const client = createClient({
  url: settings.apiUrl,
  fetchOptions: () => {
    const token = appState.token()
    return {
      headers: { Authorization: token ? `Bearer ${token}` : '' },
    };
  },
});

// List of queries
export const queries = {
  currentUser: `
    query {
      currentUser {
        user {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt  
        }
        error
      }
    }
  `,
  vms: `
    query {
      virtualMachines {
        id
        name
        os
        version
        vcpus
        ram
        diskSize
        createdAt
        updatedAt
      }
    `,
    systemSettings: `
      query {
        systemSettings {
          id
          path
          value
        }
      }
    `,
    logIn: `
    query data($email: String!, $password: String!) {
      logIn(
        email: $email,
        password: $password
      ) {
        token
        user {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt
        }
        errors {
          message
        }
      }
    }
  `,
}

// List of mutations

export const mutations = {
  
  // VMs
  createVM: `
  mutation ($name: String!, $memory: Int!, $cpu: Int!, $diskSize: Int!, $cdrom: string!) {
    createVirtualMachine(
      input: { name: $name, vcpus: $vcpu, memory: $memory, diskSize: $diskSize, cdrom: $cdrom }
    ) {
      message
      status
    }
  }
  `,
  updatePaths: `
    mutation (
      $isosPath: String!, 
      $disksPath: String!, 
      $downloadsPath: String!, 
      $extractIsosPath: String!, 
      $modifiedIsosPath: String!
    ) {
      updatePaths(
        input: { 
          isosPath: $isosPath, 
          disksPath: $disksPath, 
          downloadsPath: $downloadsPath, 
          extractIsosPath: $extractIsosPath, 
          modifiedIsosPath: $modifiedIsosPath 
        }
      ) {
        success
        errors {
          path
          message
        }
      }
    }
  `,
}

// List of subscriptions
