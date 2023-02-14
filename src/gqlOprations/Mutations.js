import { gql } from "@apollo/client";

export const USER_REGISTER = gql `
mutation Mutation($input: userInput) {
  createUser(input: $input) {
    Email
    First_Name
    Last_Name
    Password
    User_Image
    id
    token
  }
}
`

export const USER_LOGIN = gql `
mutation Mutation($input: for_login) {
  Login(input: $input) {
    First_Name
    Last_Name
    User_Type
    id
    token
    Email
  }
}
`

export const USER_PROFILE_UPDATE = gql `
mutation Mutation($input: userInput) {
  updateUser(input: $input) {
    User_Image
    First_Name
    Last_Name
    Email
    token
  }
}
`

export const CHANGE_USER_PASSWORD = gql `
mutation Mutation($input: Authentication) {
  resetPassword(input: $input)
}
`

export const EMAIL_VERIFICATION = gql `
mutation ForgetPassword($input: forget_password) {
  forgetPassword(input: $input)
}
`

export const CREATE_ISO = gql `
mutation Mutation($input: for_IOS) {
  createIOS(input: $input) {
    Name
    Size
    Type
    createdAt
    id
    userId
  }
}
`

export const CREATE_VM = gql `
mutation Mutation($input: For_VirtualMachine) {
  createVM(input: $input) {
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

export const UPDATE_VM = gql `
mutation Mutation($input: VM) {
  upadteVM(input: $input) {
    Config
    Description
    GU_ID
    Status
    Title
    VirtualMachine_Name
    VM_Image
    id
  }
}
`
export const DELETE_VM = gql `
mutation Mutation($input: for_ids_token) {
  deleteVM(input: $input)
}
`
export const DELETE_USER = gql `
mutation DeleteUser($input: for_id_token) {
  deleteUser(input: $input)
}
`

export const VM_ACTION = gql `
mutation Mutation($input: status) {
  forStatus(input: $input)
}
`

export const DELETE_ISO = gql `
mutation Mutation($input: for_id_token) {
  deleteIOS(input: $input)
}
`