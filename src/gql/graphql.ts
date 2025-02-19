/* eslint-disable */
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type ApplicationType = {
  __typename?: 'ApplicationType';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  installCommand: Scalars['JSONObject']['output'];
  name: Scalars['String']['output'];
  os: Array<Scalars['String']['output']>;
  parameters?: Maybe<Scalars['JSONObject']['output']>;
};

export type BridgeNameInput = {
  bridgeName?: Scalars['String']['input'];
  networkName?: Scalars['String']['input'];
};

export type CommandExecutionResponseType = {
  __typename?: 'CommandExecutionResponseType';
  message: Scalars['String']['output'];
  response?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CreateApplicationInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  installCommand: Scalars['JSONObject']['input'];
  name?: Scalars['String']['input'];
  os?: Array<Scalars['String']['input']>;
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CreateFilterInput = {
  chain?: InputMaybe<Scalars['String']['input']>;
  description?: Scalars['String']['input'];
  name?: Scalars['String']['input'];
  type?: InputMaybe<FilterType>;
};

export type CreateFilterRuleInput = {
  action?: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  direction?: Scalars['String']['input'];
  dstPortEnd?: InputMaybe<Scalars['Int']['input']>;
  dstPortStart?: InputMaybe<Scalars['Int']['input']>;
  filterId?: Scalars['String']['input'];
  ipVersion?: InputMaybe<Scalars['String']['input']>;
  priority?: Scalars['Int']['input'];
  protocol?: InputMaybe<Scalars['String']['input']>;
  srcPortEnd?: InputMaybe<Scalars['Int']['input']>;
  srcPortStart?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export type CreateMachineInputType = {
  applications?: Array<MachineApplicationInputType>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  name?: Scalars['String']['input'];
  os?: MachineOs;
  password?: Scalars['String']['input'];
  pciBus?: InputMaybe<Scalars['String']['input']>;
  productKey?: InputMaybe<Scalars['String']['input']>;
  templateId?: Scalars['String']['input'];
  username?: Scalars['String']['input'];
};

export type CreateNetworkInput = {
  bridgeName?: Scalars['String']['input'];
  description?: Scalars['String']['input'];
  enableIntraNetworkCommunication?: InputMaybe<Scalars['Boolean']['input']>;
  enabledServices?: InputMaybe<Array<Scalars['String']['input']>>;
  ipConfig?: InputMaybe<NetworkIpConfigInput>;
  name?: Scalars['String']['input'];
};

export type CreateUserInputType = {
  email?: Scalars['String']['input'];
  firstName?: Scalars['String']['input'];
  lastName?: Scalars['String']['input'];
  password?: Scalars['String']['input'];
  passwordConfirmation?: Scalars['String']['input'];
  role?: UserRole;
};

export type DeleteNetworkInput = {
  name: Scalars['String']['input'];
};

export type DepartmentType = {
  __typename?: 'DepartmentType';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  internetSpeed?: Maybe<Scalars['Int']['output']>;
  ipSubnet?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  totalMachines?: Maybe<Scalars['Float']['output']>;
};

export type DyummyType = {
  __typename?: 'DyummyType';
  value: Scalars['String']['output'];
};

export type FwRule = {
  __typename?: 'FWRule';
  action: Scalars['String']['output'];
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  direction: Scalars['String']['output'];
  dstIpAddr?: Maybe<Scalars['String']['output']>;
  dstIpMask?: Maybe<Scalars['String']['output']>;
  dstPortEnd?: Maybe<Scalars['Int']['output']>;
  dstPortStart?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  ipVersion?: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  protocol: Scalars['String']['output'];
  srcIpAddr?: Maybe<Scalars['String']['output']>;
  srcIpMask?: Maybe<Scalars['String']['output']>;
  srcMacAddr?: Maybe<Scalars['String']['output']>;
  srcPortEnd?: Maybe<Scalars['Int']['output']>;
  srcPortStart?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['JSONObject']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

/** Type of network filter */
export enum FilterType {
  Department = 'DEPARTMENT',
  Generic = 'GENERIC',
  Vm = 'VM'
}

export type FirewallFilter = {
  __typename?: 'FirewallFilter';
  chain?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  flushedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  internalName: Scalars['String']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  references: Array<Scalars['String']['output']>;
  rules?: Maybe<Array<FwRule>>;
  stateMatch: Scalars['Boolean']['output'];
  type: FilterType;
  updatedAt: Scalars['DateTimeISO']['output'];
  uuid: Scalars['String']['output'];
};

export type Gpu = {
  __typename?: 'GPU';
  memory: Scalars['Float']['output'];
  model: Scalars['String']['output'];
  pciBus: Scalars['String']['output'];
  vendor: Scalars['String']['output'];
};

export type GraphicConfigurationType = {
  __typename?: 'GraphicConfigurationType';
  link: Scalars['String']['output'];
  password: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
};

export type IpRangeInput = {
  end?: Scalars['String']['input'];
  networkName?: Scalars['String']['input'];
  start?: Scalars['String']['input'];
};

export type Machine = {
  __typename?: 'Machine';
  configuration?: Maybe<Scalars['JSONObject']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  department?: Maybe<DepartmentType>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  status: Scalars['String']['output'];
  template?: Maybe<MachineTemplateType>;
  templateId: Scalars['String']['output'];
  user?: Maybe<UserType>;
  userId: Scalars['String']['output'];
};

export type MachineApplicationInputType = {
  applicationId?: Scalars['String']['input'];
  machineId?: Scalars['String']['input'];
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type MachineOrderBy = {
  direction?: InputMaybe<OrderByDirection>;
  fieldName?: InputMaybe<MachineOrderByField>;
};

/** The field to order machines by */
export enum MachineOrderByField {
  Config = 'CONFIG',
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Status = 'STATUS',
  TemplateId = 'TEMPLATE_ID',
  UserId = 'USER_ID'
}

/** The os of the machine */
export enum MachineOs {
  Fedora = 'FEDORA',
  Ubuntu = 'UBUNTU',
  Windows10 = 'WINDOWS10',
  Windows11 = 'WINDOWS11'
}

export type MachineTemplateCategoryInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: Scalars['String']['input'];
};

export type MachineTemplateCategoryType = {
  __typename?: 'MachineTemplateCategoryType';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  totalMachines?: Maybe<Scalars['Int']['output']>;
  totalTemplates?: Maybe<Scalars['Int']['output']>;
};

export type MachineTemplateInputType = {
  /** The ID of the category for the machine template */
  categoryId?: InputMaybe<Scalars['ID']['input']>;
  /** The number of cores for the machine */
  cores?: Scalars['Int']['input'];
  /** A brief description of the machine template */
  description?: Scalars['String']['input'];
  /** The name of the machine template */
  name?: Scalars['String']['input'];
  /** The amount of RAM (in GB) for the machine */
  ram?: Scalars['Int']['input'];
  /** The storage space (in GB) for the machine */
  storage?: Scalars['Int']['input'];
};

export type MachineTemplateOrderBy = {
  direction?: InputMaybe<OrderByDirection>;
  fieldName?: InputMaybe<MachineTemplateOrderByField>;
};

/** The field to order machine templates by */
export enum MachineTemplateOrderByField {
  Cores = 'CORES',
  CreatedAt = 'CREATED_AT',
  Id = 'ID',
  Name = 'NAME',
  Ram = 'RAM',
  Storage = 'STORAGE'
}

export type MachineTemplateType = {
  __typename?: 'MachineTemplateType';
  categoryId?: Maybe<Scalars['ID']['output']>;
  cores: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  ram: Scalars['Int']['output'];
  storage: Scalars['Int']['output'];
  totalMachines?: Maybe<Scalars['Int']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createApplication: ApplicationType;
  createDepartment: DepartmentType;
  createFilter: FirewallFilter;
  createFilterRule: FwRule;
  createMachine: Machine;
  createMachineTemplate: MachineTemplateType;
  createMachineTemplateCategory: MachineTemplateCategoryType;
  createNetwork: Scalars['Boolean']['output'];
  createUser: UserType;
  deleteApplication: Scalars['Boolean']['output'];
  deleteFilter: Scalars['Boolean']['output'];
  deleteFilterRule: Scalars['Boolean']['output'];
  deleteNetwork: Scalars['Boolean']['output'];
  destroyDepartment: DepartmentType;
  destroyMachine: SuccessType;
  destroyMachineTemplate: Scalars['Boolean']['output'];
  destroyMachineTemplateCategory: Scalars['Boolean']['output'];
  executeCommand: CommandExecutionResponseType;
  /** Apply a network filter inmediatly */
  flushFilter: Scalars['Boolean']['output'];
  moveMachine: Machine;
  powerOff: SuccessType;
  powerOn: SuccessType;
  setNetworkBridgeName: Scalars['Boolean']['output'];
  setNetworkIp: Scalars['Boolean']['output'];
  setNetworkIpRange: Scalars['Boolean']['output'];
  setupNode: DyummyType;
  suspend: SuccessType;
  updateApplication: ApplicationType;
  updateFilter: FirewallFilter;
  updateFilterRule: FwRule;
  updateMachineTemplate: MachineTemplateType;
  updateMachineTemplateCategory: MachineTemplateCategoryType;
  updateUser: UserType;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInputType;
};


export type MutationCreateDepartmentArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateFilterArgs = {
  input: CreateFilterInput;
};


export type MutationCreateFilterRuleArgs = {
  filterId: Scalars['ID']['input'];
  input: CreateFilterRuleInput;
};


export type MutationCreateMachineArgs = {
  input: CreateMachineInputType;
};


export type MutationCreateMachineTemplateArgs = {
  input: MachineTemplateInputType;
};


export type MutationCreateMachineTemplateCategoryArgs = {
  input: MachineTemplateCategoryInputType;
};


export type MutationCreateNetworkArgs = {
  input: CreateNetworkInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInputType;
};


export type MutationDeleteApplicationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFilterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFilterRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNetworkArgs = {
  input: DeleteNetworkInput;
};


export type MutationDestroyDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type MutationDestroyMachineArgs = {
  id: Scalars['String']['input'];
};


export type MutationDestroyMachineTemplateArgs = {
  id: Scalars['String']['input'];
};


export type MutationDestroyMachineTemplateCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationExecuteCommandArgs = {
  command: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationFlushFilterArgs = {
  filterId: Scalars['ID']['input'];
};


export type MutationMoveMachineArgs = {
  departmentId: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationPowerOffArgs = {
  id: Scalars['String']['input'];
};


export type MutationPowerOnArgs = {
  id: Scalars['String']['input'];
};


export type MutationSetNetworkBridgeNameArgs = {
  input: BridgeNameInput;
};


export type MutationSetNetworkIpArgs = {
  input: NetworkIpInput;
};


export type MutationSetNetworkIpRangeArgs = {
  input: IpRangeInput;
};


export type MutationSuspendArgs = {
  id: Scalars['String']['input'];
};


export type MutationUpdateApplicationArgs = {
  id: Scalars['String']['input'];
  input: CreateApplicationInputType;
};


export type MutationUpdateFilterArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFilterInput;
};


export type MutationUpdateFilterRuleArgs = {
  id: Scalars['ID']['input'];
  input: UpdateFilterRuleInput;
};


export type MutationUpdateMachineTemplateArgs = {
  id: Scalars['String']['input'];
  input: MachineTemplateInputType;
};


export type MutationUpdateMachineTemplateCategoryArgs = {
  id: Scalars['String']['input'];
  input: MachineTemplateCategoryInputType;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInputType;
};

export type Network = {
  __typename?: 'Network';
  bridge: NetworkBridge;
  description?: Maybe<Scalars['String']['output']>;
  ip: NetworkIp;
  name: Scalars['String']['output'];
  uuid: Scalars['String']['output'];
};

export type NetworkBridge = {
  __typename?: 'NetworkBridge';
  delay: Scalars['String']['output'];
  name: Scalars['String']['output'];
  stp: Scalars['String']['output'];
};

export type NetworkDhcp = {
  __typename?: 'NetworkDhcp';
  range: NetworkDhcpRange;
};

export type NetworkDhcpRange = {
  __typename?: 'NetworkDhcpRange';
  end: Scalars['String']['output'];
  start: Scalars['String']['output'];
};

export type NetworkDhcpRangeInput = {
  end?: Scalars['String']['input'];
  start?: Scalars['String']['input'];
};

export type NetworkIp = {
  __typename?: 'NetworkIp';
  address: Scalars['String']['output'];
  dhcp?: Maybe<NetworkDhcp>;
  netmask: Scalars['String']['output'];
};

export type NetworkIpConfigInput = {
  address?: Scalars['String']['input'];
  dhcp?: InputMaybe<NetworkDhcpRangeInput>;
  netmask?: Scalars['String']['input'];
};

export type NetworkIpInput = {
  address?: Scalars['String']['input'];
  netmask?: Scalars['String']['input'];
  networkName?: Scalars['String']['input'];
};

export enum OrderByDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type PaginationInputType = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};

export type Query = {
  __typename?: 'Query';
  application?: Maybe<ApplicationType>;
  applications: Array<ApplicationType>;
  checkSetupStatus: DyummyType;
  currentUser: UserType;
  department?: Maybe<DepartmentType>;
  departments: Array<DepartmentType>;
  findDepartmentByName?: Maybe<DepartmentType>;
  getFilter?: Maybe<FirewallFilter>;
  getGraphics: Array<Gpu>;
  graphicConnection?: Maybe<GraphicConfigurationType>;
  listFilterRules: Array<FwRule>;
  listFilters: Array<FirewallFilter>;
  login: UserToken;
  machine?: Maybe<Machine>;
  machineTemplate?: Maybe<MachineTemplateType>;
  machineTemplateCategories: Array<MachineTemplateCategoryType>;
  machineTemplateCategory?: Maybe<MachineTemplateCategoryType>;
  machineTemplates: Array<MachineTemplateType>;
  machines: Array<Machine>;
  network: Network;
  networks: Array<Network>;
  user: UserType;
  users: Array<UserType>;
};


export type QueryApplicationArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindDepartmentByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetFilterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGraphicConnectionArgs = {
  id: Scalars['String']['input'];
};


export type QueryListFilterRulesArgs = {
  filterId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryListFiltersArgs = {
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  vmId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type QueryMachineArgs = {
  id: Scalars['String']['input'];
};


export type QueryMachineTemplateArgs = {
  id: Scalars['String']['input'];
};


export type QueryMachineTemplateCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryMachineTemplatesArgs = {
  orderBy?: InputMaybe<MachineTemplateOrderBy>;
  pagination?: InputMaybe<PaginationInputType>;
};


export type QueryMachinesArgs = {
  orderBy?: InputMaybe<MachineOrderBy>;
  pagination?: InputMaybe<PaginationInputType>;
};


export type QueryNetworkArgs = {
  name: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  orderBy?: InputMaybe<UserOrderByInputType>;
  pagination?: InputMaybe<PaginationInputType>;
};

export type SuccessType = {
  __typename?: 'SuccessType';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateFilterInput = {
  chain?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFilterRuleInput = {
  action?: Scalars['String']['input'];
  comment?: InputMaybe<Scalars['String']['input']>;
  direction?: Scalars['String']['input'];
  dstPortEnd?: InputMaybe<Scalars['Int']['input']>;
  dstPortStart?: InputMaybe<Scalars['Int']['input']>;
  ipVersion?: InputMaybe<Scalars['String']['input']>;
  priority?: Scalars['Int']['input'];
  protocol?: InputMaybe<Scalars['String']['input']>;
  srcPortEnd?: InputMaybe<Scalars['Int']['input']>;
  srcPortStart?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInputType = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  passwordConfirmation?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

/** The field to order users by */
export enum UserOrderByField {
  CreatedAt = 'CREATED_AT',
  Email = 'EMAIL',
  FirstName = 'FIRST_NAME',
  Id = 'ID',
  LastName = 'LAST_NAME',
  Role = 'ROLE',
  UpdatedAt = 'UPDATED_AT'
}

export type UserOrderByInputType = {
  direction?: InputMaybe<OrderByDirection>;
  fieldName?: InputMaybe<UserOrderByField>;
};

/** The basic roles of users */
export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

/** Token used to log in */
export type UserToken = {
  __typename?: 'UserToken';
  token: Scalars['String']['output'];
};

/** User model */
export type UserType = {
  __typename?: 'UserType';
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  role: Scalars['String']['output'];
};
