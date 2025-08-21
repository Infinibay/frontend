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
  icon?: Maybe<Scalars['String']['output']>;
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
  customCores?: InputMaybe<Scalars['Int']['input']>;
  customRam?: InputMaybe<Scalars['Int']['input']>;
  customStorage?: InputMaybe<Scalars['Int']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  name?: Scalars['String']['input'];
  os?: MachineOs;
  password?: Scalars['String']['input'];
  pciBus?: InputMaybe<Scalars['String']['input']>;
  productKey?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['String']['input']>;
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

export type DepartmentServiceStatus = {
  __typename?: 'DepartmentServiceStatus';
  /** Unique identifier for the department */
  departmentId: Scalars['ID']['output'];
  /** Name of the department */
  departmentName: Scalars['String']['output'];
  /** Number of VMs in the department with this service enabled */
  enabledVmCount: Scalars['Float']['output'];
  /** Whether the service is enabled for inbound traffic */
  provideEnabled: Scalars['Boolean']['output'];
  /** Unique identifier for the service */
  serviceId: Scalars['ID']['output'];
  /** Name of the service */
  serviceName: Scalars['String']['output'];
  /** Whether the service is enabled for outbound traffic */
  useEnabled: Scalars['Boolean']['output'];
  /** Total number of VMs in the department */
  vmCount: Scalars['Float']['output'];
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
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  updatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
};

/** Type of network filter */
export enum FilterType {
  Department = 'DEPARTMENT',
  Generic = 'GENERIC',
  Vm = 'VM'
}

export type GenericFilter = {
  __typename?: 'GenericFilter';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  references: Array<Scalars['String']['output']>;
  rules?: Maybe<Array<FwRule>>;
  type: FilterType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GlobalServiceStatus = {
  __typename?: 'GlobalServiceStatus';
  /** Whether the service is enabled for inbound traffic */
  provideEnabled: Scalars['Boolean']['output'];
  /** Unique identifier for the service */
  serviceId: Scalars['ID']['output'];
  /** Name of the service */
  serviceName: Scalars['String']['output'];
  /** Whether the service is enabled for outbound traffic */
  useEnabled: Scalars['Boolean']['output'];
};

export type GraphicConfigurationType = {
  __typename?: 'GraphicConfigurationType';
  link: Scalars['String']['output'];
  password: Scalars['String']['output'];
  protocol: Scalars['String']['output'];
};

export type Iso = {
  __typename?: 'ISO';
  checksum?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  downloadUrl?: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAvailable: Scalars['Boolean']['output'];
  lastVerified?: Maybe<Scalars['DateTimeISO']['output']>;
  os: Scalars['String']['output'];
  path: Scalars['String']['output'];
  size: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  uploadedAt: Scalars['DateTimeISO']['output'];
  version?: Maybe<Scalars['String']['output']>;
};

export type IsoAvailabilityMap = {
  __typename?: 'ISOAvailabilityMap';
  available: Scalars['Boolean']['output'];
  os: Scalars['String']['output'];
};

export type IsoStatus = {
  __typename?: 'ISOStatus';
  available: Scalars['Boolean']['output'];
  iso?: Maybe<Iso>;
  os: Scalars['String']['output'];
};

export type InfiniServiceStatus = {
  __typename?: 'InfiniServiceStatus';
  error?: Maybe<Scalars['String']['output']>;
  installed: Scalars['Boolean']['output'];
  running: Scalars['Boolean']['output'];
};

export type IpRangeInput = {
  end?: Scalars['String']['input'];
  networkName?: Scalars['String']['input'];
  start?: Scalars['String']['input'];
};

export type Machine = {
  __typename?: 'Machine';
  configuration?: Maybe<Scalars['JSONObject']['output']>;
  cpuCores?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  department?: Maybe<DepartmentType>;
  gpuPciAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  ramGB?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  template?: Maybe<MachineTemplateType>;
  templateId?: Maybe<Scalars['String']['output']>;
  user?: Maybe<UserType>;
  userId?: Maybe<Scalars['String']['output']>;
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
  /** Calculate ISO checksum */
  calculateISOChecksum: Scalars['String']['output'];
  createApplication: ApplicationType;
  createDepartment: DepartmentType;
  createFilter: GenericFilter;
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
  /** Register uploaded ISO */
  registerISO: Iso;
  /** Remove ISO file */
  removeISO: Scalars['Boolean']['output'];
  setNetworkBridgeName: Scalars['Boolean']['output'];
  setNetworkIp: Scalars['Boolean']['output'];
  setNetworkIpRange: Scalars['Boolean']['output'];
  setupNode: DyummyType;
  suspend: SuccessType;
  /** Sync ISOs with filesystem */
  syncISOs: Scalars['Boolean']['output'];
  toggleDepartmentService: DepartmentServiceStatus;
  toggleGlobalService: GlobalServiceStatus;
  toggleVmService: VmServiceStatus;
  updateApplication: ApplicationType;
  updateFilter: GenericFilter;
  updateFilterRule: FwRule;
  updateMachineHardware: Machine;
  updateMachineTemplate: MachineTemplateType;
  updateMachineTemplateCategory: MachineTemplateCategoryType;
  updateUser: UserType;
  /** Validate ISO file integrity */
  validateISO: Scalars['Boolean']['output'];
};


export type MutationCalculateIsoChecksumArgs = {
  isoId: Scalars['String']['input'];
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


export type MutationRegisterIsoArgs = {
  filename: Scalars['String']['input'];
  os: Scalars['String']['input'];
  path: Scalars['String']['input'];
  size: Scalars['Float']['input'];
};


export type MutationRemoveIsoArgs = {
  isoId: Scalars['String']['input'];
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


export type MutationToggleDepartmentServiceArgs = {
  input: ToggleDepartmentServiceInput;
};


export type MutationToggleGlobalServiceArgs = {
  input: ToggleServiceInput;
};


export type MutationToggleVmServiceArgs = {
  input: ToggleVmServiceInput;
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


export type MutationUpdateMachineHardwareArgs = {
  input: UpdateMachineHardwareInput;
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


export type MutationValidateIsoArgs = {
  isoId: Scalars['String']['input'];
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
  /** Get all ISOs (available and unavailable) */
  allISOs: Array<Iso>;
  application?: Maybe<ApplicationType>;
  applications: Array<ApplicationType>;
  /** Get all available ISOs */
  availableISOs: Array<Iso>;
  /** Check if ISO is available for specific OS */
  checkISOStatus: IsoStatus;
  /** Check availability for multiple OS types */
  checkMultipleOSAvailability: Array<IsoAvailabilityMap>;
  checkSetupStatus: DyummyType;
  /** Check overall system readiness */
  checkSystemReadiness: SystemReadiness;
  currentUser?: Maybe<UserType>;
  department?: Maybe<DepartmentType>;
  departments: Array<DepartmentType>;
  findDepartmentByName?: Maybe<DepartmentType>;
  getDepartmentServiceStatus: Array<DepartmentServiceStatus>;
  getFilter?: Maybe<GenericFilter>;
  getGlobalServiceStatus: Array<GlobalServiceStatus>;
  getServiceStatusSummary: Array<ServiceStatusSummary>;
  /** Get supported OS types */
  getSupportedOSTypes: Array<Scalars['String']['output']>;
  getSystemResources: SystemResources;
  getVmServiceStatus: Array<VmServiceStatus>;
  graphicConnection?: Maybe<GraphicConfigurationType>;
  listFilterRules: Array<FwRule>;
  listFilters: Array<GenericFilter>;
  listServices: Array<ServiceDefinition>;
  login: UserToken;
  machine?: Maybe<Machine>;
  machineTemplate?: Maybe<MachineTemplateType>;
  machineTemplateCategories: Array<MachineTemplateCategoryType>;
  machineTemplateCategory?: Maybe<MachineTemplateCategoryType>;
  machineTemplates: Array<MachineTemplateType>;
  machines: Array<Machine>;
  network: Network;
  networks: Array<Network>;
  /** Get current socket connection statistics for all VMs */
  socketConnectionStats?: Maybe<SocketConnectionStats>;
  user: UserType;
  users: Array<UserType>;
  /** Get comprehensive diagnostics for VM socket connection issues */
  vmSocketDiagnostics: VmDiagnostics;
};


export type QueryApplicationArgs = {
  id: Scalars['String']['input'];
};


export type QueryCheckIsoStatusArgs = {
  os: Scalars['String']['input'];
};


export type QueryCheckMultipleOsAvailabilityArgs = {
  osList: Array<Scalars['String']['input']>;
};


export type QueryDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindDepartmentByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetDepartmentServiceStatusArgs = {
  departmentId: Scalars['ID']['input'];
  serviceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetFilterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetGlobalServiceStatusArgs = {
  serviceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetVmServiceStatusArgs = {
  serviceId?: InputMaybe<Scalars['ID']['input']>;
  vmId: Scalars['ID']['input'];
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


export type QueryVmSocketDiagnosticsArgs = {
  vmId: Scalars['String']['input'];
};

/** Service action type (USE for outbound, PROVIDE for inbound) */
export enum ServiceAction {
  Provide = 'PROVIDE',
  Use = 'USE'
}

export type ServiceDefinition = {
  __typename?: 'ServiceDefinition';
  /** Description of the service */
  description: Scalars['String']['output'];
  /** Human-readable name of the service */
  displayName: Scalars['String']['output'];
  /** Unique identifier for the service */
  id: Scalars['ID']['output'];
  /** Internal name of the service */
  name: Scalars['String']['output'];
  /** Port configurations for the service */
  ports: Array<ServicePort>;
  /** Description of the risk */
  riskDescription: Scalars['String']['output'];
  /** Risk level of the service */
  riskLevel: ServiceRiskLevel;
};

export type ServicePort = {
  __typename?: 'ServicePort';
  /** Ending port number */
  portEnd: Scalars['Float']['output'];
  /** Starting port number */
  portStart: Scalars['Float']['output'];
  /** Protocol (TCP or UDP) */
  protocol: Scalars['String']['output'];
};

/** Risk level of a service */
export enum ServiceRiskLevel {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

export type ServiceStatusSummary = {
  __typename?: 'ServiceStatusSummary';
  /** Number of VMs with this service enabled */
  enabledVms: Scalars['Float']['output'];
  /** Number of VMs with this service running */
  runningVms: Scalars['Float']['output'];
  /** Unique identifier for the service */
  serviceId: Scalars['ID']['output'];
  /** Name of the service */
  serviceName: Scalars['String']['output'];
  /** Total number of VMs */
  totalVms: Scalars['Float']['output'];
};

export type SocketConnectionStats = {
  __typename?: 'SocketConnectionStats';
  activeConnections?: Maybe<Scalars['Float']['output']>;
  connections?: Maybe<Array<VmConnectionInfo>>;
  isConnected?: Maybe<Scalars['Boolean']['output']>;
  lastMessageTime?: Maybe<Scalars['String']['output']>;
  reconnectAttempts?: Maybe<Scalars['Float']['output']>;
  totalConnections?: Maybe<Scalars['Float']['output']>;
};

export type SuccessType = {
  __typename?: 'SuccessType';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type SystemReadiness = {
  __typename?: 'SystemReadiness';
  availableOS: Array<Scalars['String']['output']>;
  missingOS: Array<Scalars['String']['output']>;
  ready: Scalars['Boolean']['output'];
};

export type SystemResourceCpu = {
  __typename?: 'SystemResourceCPU';
  available: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type SystemResourceDisk = {
  __typename?: 'SystemResourceDisk';
  available: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
  used: Scalars['Float']['output'];
};

export type SystemResourceMemory = {
  __typename?: 'SystemResourceMemory';
  available: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type SystemResources = {
  __typename?: 'SystemResources';
  cpu: SystemResourceCpu;
  disk: SystemResourceDisk;
  memory: SystemResourceMemory;
};

export type ToggleDepartmentServiceInput = {
  /** Service action (USE for outbound, PROVIDE for inbound) */
  action: ServiceAction;
  /** Unique identifier of the department */
  departmentId: Scalars['ID']['input'];
  /** Whether to enable or disable the service */
  enabled: Scalars['Boolean']['input'];
  /** Unique identifier of the service to toggle */
  serviceId: Scalars['ID']['input'];
};

export type ToggleServiceInput = {
  /** Service action (USE for outbound, PROVIDE for inbound) */
  action: ServiceAction;
  /** Whether to enable or disable the service */
  enabled: Scalars['Boolean']['input'];
  /** Unique identifier of the service to toggle */
  serviceId: Scalars['ID']['input'];
};

export type ToggleVmServiceInput = {
  /** Service action (USE for outbound, PROVIDE for inbound) */
  action: ServiceAction;
  /** Whether to enable or disable the service */
  enabled: Scalars['Boolean']['input'];
  /** Unique identifier of the service to toggle */
  serviceId: Scalars['ID']['input'];
  /** Unique identifier of the VM */
  vmId: Scalars['ID']['input'];
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

export type UpdateMachineHardwareInput = {
  /** New number of CPU cores */
  cpuCores?: InputMaybe<Scalars['Int']['input']>;
  /** New GPU PCI address (e.g., 0000:01:00.0). Set to null to remove GPU. */
  gpuPciAddress?: InputMaybe<Scalars['String']['input']>;
  id?: Scalars['ID']['input'];
  /** New RAM in GB */
  ramGB?: InputMaybe<Scalars['Int']['input']>;
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
  /** User namespace for real-time events */
  namespace?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type VmConnectionInfo = {
  __typename?: 'VmConnectionInfo';
  isConnected: Scalars['Boolean']['output'];
  lastMessageTime: Scalars['String']['output'];
  reconnectAttempts: Scalars['Float']['output'];
  vmId: Scalars['String']['output'];
};

export type VmDiagnostics = {
  __typename?: 'VmDiagnostics';
  connectionStats?: Maybe<SocketConnectionStats>;
  diagnostics: Array<Scalars['String']['output']>;
  infiniService: InfiniServiceStatus;
  manualCommands: Array<Scalars['String']['output']>;
  recommendations: Array<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  vmId: Scalars['String']['output'];
  vmName: Scalars['String']['output'];
  vmStatus: Scalars['String']['output'];
};

export type VmServiceStatus = {
  __typename?: 'VmServiceStatus';
  /** When the service was last seen running */
  lastSeen?: Maybe<Scalars['DateTimeISO']['output']>;
  /** Whether the service is enabled for inbound traffic */
  provideEnabled: Scalars['Boolean']['output'];
  /** Whether the service is currently running */
  running: Scalars['Boolean']['output'];
  /** Unique identifier for the service */
  serviceId: Scalars['ID']['output'];
  /** Name of the service */
  serviceName: Scalars['String']['output'];
  /** Whether the service is enabled for outbound traffic */
  useEnabled: Scalars['Boolean']['output'];
  /** Unique identifier for the VM */
  vmId: Scalars['ID']['output'];
  /** Name of the VM */
  vmName: Scalars['String']['output'];
};
