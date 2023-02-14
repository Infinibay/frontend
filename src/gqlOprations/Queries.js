import { gql } from "@apollo/client";

export const GET_USER_BY_ID = gql`
query GetUserByID($input: for_id_token) {
    getUserByID(input: $input) {
      User_Image
      First_Name
      Last_Name
      User_Type
      Email
      token
    }
  }
  `

  export const GET_IOS_BY_ID = gql `
  query Query($input: for_search) {
    getIOSById(input: $input) {
      Name
      Size
      Type
      createdAt
      id
      userId
    }
  }
  `

  export const GET_CONFIG = gql `
  query Query {
    getConfigFile
  }
  `

  export const GET_USER_VMS = gql `
  query GetUserAllVM($input: for_search__user) {
    getUserAllVM(input: $input) {
      Config
      VM_Image
      Title
      Status
      GU_ID
      Description
      VirtualMachine_Name
      id
    }
  }
  `

  export const GET_SPECIFIC_VM = gql `
  query Query($input: for_id_token) {
    getSpecificVM(input: $input) {
      Config
      Description
      Status
      Title
      VirtualMachine_Name
      id
      VM_Image
    }
  }
  `

  export const GET_ALL_USERS = gql `
  query Query($input: for_search) {
    getUserList(input: $input) {
      Email
      First_Name
      Last_Name
      User_Image
      User_Type
      id
      token
    }
  }
  `

  export const GET_ALL_VMS = gql `
  query Query($input: for_search_all) {
    getAllVM(input: $input) {
      Config
      Description
      GU_ID
      Status
      Title
      VM_Image
      VirtualMachine_Name
      id
    }
  }
  `

  export const CHECK_VM_NAME = gql `
  query Query($input: forfindVM) {
    findVMName(input: $input)
  }
  `

