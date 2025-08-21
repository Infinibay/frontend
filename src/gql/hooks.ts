import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: string; output: string; }
  JSONObject: { input: { [key: string]: any }; output: { [key: string]: any }; }
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

export type Gpu = {
  __typename?: 'GPU';
  memory: Scalars['Float']['output'];
  model: Scalars['String']['output'];
  pciBus: Scalars['String']['output'];
  vendor: Scalars['String']['output'];
};

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
  getGraphics: Array<Gpu>;
  getServiceStatusSummary: Array<ServiceStatusSummary>;
  /** Get supported OS types */
  getSupportedOSTypes: Array<Scalars['String']['output']>;
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

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInputType;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } };

export type CreateMachineTemplateMutationVariables = Exact<{
  input: MachineTemplateInputType;
}>;


export type CreateMachineTemplateMutation = { __typename?: 'Mutation', createMachineTemplate: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } };

export type UpdateMachineTemplateMutationVariables = Exact<{
  input: MachineTemplateInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateMachineTemplateMutation = { __typename?: 'Mutation', updateMachineTemplate: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } };

export type DestroyMachineTemplateMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DestroyMachineTemplateMutation = { __typename?: 'Mutation', destroyMachineTemplate: boolean };

export type DestroyMachineTemplateCategoryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DestroyMachineTemplateCategoryMutation = { __typename?: 'Mutation', destroyMachineTemplateCategory: boolean };

export type CreateMachineMutationVariables = Exact<{
  input: CreateMachineInputType;
}>;


export type CreateMachineMutation = { __typename?: 'Mutation', createMachine: { __typename?: 'Machine', id: string, name: string, configuration?: { [key: string]: any } | null, status: string, userId?: string | null, templateId?: string | null, createdAt?: string | null, template?: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } | null, department?: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } | null, user?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } | null } };

export type PowerOnMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PowerOnMutation = { __typename?: 'Mutation', powerOn: { __typename?: 'SuccessType', success: boolean, message: string } };

export type PowerOffMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PowerOffMutation = { __typename?: 'Mutation', powerOff: { __typename?: 'SuccessType', success: boolean, message: string } };

export type SuspendMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SuspendMutation = { __typename?: 'Mutation', suspend: { __typename?: 'SuccessType', success: boolean, message: string } };

export type DestroyMachineMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DestroyMachineMutation = { __typename?: 'Mutation', destroyMachine: { __typename?: 'SuccessType', success: boolean, message: string } };

export type ExecuteCommandMutationVariables = Exact<{
  command: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type ExecuteCommandMutation = { __typename?: 'Mutation', executeCommand: { __typename?: 'CommandExecutionResponseType', success: boolean, message: string, response?: string | null } };

export type MoveMachineMutationVariables = Exact<{
  departmentId: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type MoveMachineMutation = { __typename?: 'Mutation', moveMachine: { __typename?: 'Machine', id: string, name: string, configuration?: { [key: string]: any } | null, status: string, userId?: string | null, templateId?: string | null, createdAt?: string | null, template?: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } | null, department?: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } | null, user?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } | null } };

export type SetupNodeMutationVariables = Exact<{ [key: string]: never; }>;


export type SetupNodeMutation = { __typename?: 'Mutation', setupNode: { __typename?: 'DyummyType', value: string } };

export type CreateDepartmentMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } };

export type DestroyDepartmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DestroyDepartmentMutation = { __typename?: 'Mutation', destroyDepartment: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } };

export type CreateMachineTemplateCategoryMutationVariables = Exact<{
  input: MachineTemplateCategoryInputType;
}>;


export type CreateMachineTemplateCategoryMutation = { __typename?: 'Mutation', createMachineTemplateCategory: { __typename?: 'MachineTemplateCategoryType', id: string, name: string, description?: string | null, createdAt: string, totalTemplates?: number | null, totalMachines?: number | null } };

export type UpdateMachineTemplateCategoryMutationVariables = Exact<{
  input: MachineTemplateCategoryInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateMachineTemplateCategoryMutation = { __typename?: 'Mutation', updateMachineTemplateCategory: { __typename?: 'MachineTemplateCategoryType', id: string, name: string, description?: string | null, createdAt: string, totalTemplates?: number | null, totalMachines?: number | null } };

export type CreateApplicationMutationVariables = Exact<{
  input: CreateApplicationInputType;
}>;


export type CreateApplicationMutation = { __typename?: 'Mutation', createApplication: { __typename?: 'ApplicationType', id: string, name: string, description?: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters?: { [key: string]: any } | null, createdAt: string } };

export type UpdateApplicationMutationVariables = Exact<{
  input: CreateApplicationInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateApplicationMutation = { __typename?: 'Mutation', updateApplication: { __typename?: 'ApplicationType', id: string, name: string, description?: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters?: { [key: string]: any } | null, createdAt: string } };

export type DeleteApplicationMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteApplicationMutation = { __typename?: 'Mutation', deleteApplication: boolean };

export type CreateNetworkMutationVariables = Exact<{
  input: CreateNetworkInput;
}>;


export type CreateNetworkMutation = { __typename?: 'Mutation', createNetwork: boolean };

export type SetNetworkIpRangeMutationVariables = Exact<{
  input: IpRangeInput;
}>;


export type SetNetworkIpRangeMutation = { __typename?: 'Mutation', setNetworkIpRange: boolean };

export type SetNetworkIpMutationVariables = Exact<{
  input: NetworkIpInput;
}>;


export type SetNetworkIpMutation = { __typename?: 'Mutation', setNetworkIp: boolean };

export type SetNetworkBridgeNameMutationVariables = Exact<{
  input: BridgeNameInput;
}>;


export type SetNetworkBridgeNameMutation = { __typename?: 'Mutation', setNetworkBridgeName: boolean };

export type DeleteNetworkMutationVariables = Exact<{
  input: DeleteNetworkInput;
}>;


export type DeleteNetworkMutation = { __typename?: 'Mutation', deleteNetwork: boolean };

export type CreateFilterMutationVariables = Exact<{
  input: CreateFilterInput;
}>;


export type CreateFilterMutation = { __typename?: 'Mutation', createFilter: { __typename?: 'GenericFilter', id: string, name: string, description?: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules?: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null }> | null } };

export type UpdateFilterMutationVariables = Exact<{
  input: UpdateFilterInput;
  id: Scalars['ID']['input'];
}>;


export type UpdateFilterMutation = { __typename?: 'Mutation', updateFilter: { __typename?: 'GenericFilter', id: string, name: string, description?: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules?: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null }> | null } };

export type DeleteFilterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFilterMutation = { __typename?: 'Mutation', deleteFilter: boolean };

export type CreateFilterRuleMutationVariables = Exact<{
  input: CreateFilterRuleInput;
  filterId: Scalars['ID']['input'];
}>;


export type CreateFilterRuleMutation = { __typename?: 'Mutation', createFilterRule: { __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null } };

export type UpdateFilterRuleMutationVariables = Exact<{
  input: UpdateFilterRuleInput;
  id: Scalars['ID']['input'];
}>;


export type UpdateFilterRuleMutation = { __typename?: 'Mutation', updateFilterRule: { __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null } };

export type DeleteFilterRuleMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFilterRuleMutation = { __typename?: 'Mutation', deleteFilterRule: boolean };

export type FlushFilterMutationVariables = Exact<{
  filterId: Scalars['ID']['input'];
}>;


export type FlushFilterMutation = { __typename?: 'Mutation', flushFilter: boolean };

export type ToggleVmServiceMutationVariables = Exact<{
  vmId: Scalars['ID']['input'];
  serviceId: Scalars['ID']['input'];
  enabled: Scalars['Boolean']['input'];
  action: ServiceAction;
}>;


export type ToggleVmServiceMutation = { __typename?: 'Mutation', toggleVmService: { __typename?: 'VmServiceStatus', vmId: string, vmName: string, serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean, running: boolean, lastSeen?: string | null } };

export type ToggleDepartmentServiceMutationVariables = Exact<{
  departmentId: Scalars['ID']['input'];
  serviceId: Scalars['ID']['input'];
  enabled: Scalars['Boolean']['input'];
  action: ServiceAction;
}>;


export type ToggleDepartmentServiceMutation = { __typename?: 'Mutation', toggleDepartmentService: { __typename?: 'DepartmentServiceStatus', departmentId: string, departmentName: string, serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean, vmCount: number, enabledVmCount: number } };

export type ToggleGlobalServiceMutationVariables = Exact<{
  serviceId: Scalars['ID']['input'];
  enabled: Scalars['Boolean']['input'];
  action: ServiceAction;
}>;


export type ToggleGlobalServiceMutation = { __typename?: 'Mutation', toggleGlobalService: { __typename?: 'GlobalServiceStatus', serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string, namespace?: string | null } | null };

export type UserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } };

export type UsersQueryVariables = Exact<{
  pagination?: InputMaybe<PaginationInputType>;
  orderBy?: InputMaybe<UserOrderByInputType>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string }> };

export type LoginQueryVariables = Exact<{
  password: Scalars['String']['input'];
  email: Scalars['String']['input'];
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'UserToken', token: string } };

export type MachineTemplateQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MachineTemplateQuery = { __typename?: 'Query', machineTemplate?: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } | null };

export type MachineTemplatesQueryVariables = Exact<{
  orderBy?: InputMaybe<MachineTemplateOrderBy>;
  pagination?: InputMaybe<PaginationInputType>;
}>;


export type MachineTemplatesQuery = { __typename?: 'Query', machineTemplates: Array<{ __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null }> };

export type MachineQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MachineQuery = { __typename?: 'Query', machine?: { __typename?: 'Machine', id: string, name: string, configuration?: { [key: string]: any } | null, status: string, userId?: string | null, templateId?: string | null, createdAt?: string | null, template?: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } | null, department?: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } | null, user?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } | null } | null };

export type MachinesQueryVariables = Exact<{
  orderBy?: InputMaybe<MachineOrderBy>;
  pagination?: InputMaybe<PaginationInputType>;
}>;


export type MachinesQuery = { __typename?: 'Query', machines: Array<{ __typename?: 'Machine', id: string, name: string, configuration?: { [key: string]: any } | null, status: string, userId?: string | null, templateId?: string | null, createdAt?: string | null, template?: { __typename?: 'MachineTemplateType', id: string, name?: string | null, description?: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId?: string | null, totalMachines?: number | null } | null, department?: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } | null, user?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, createdAt: string } | null }> };

export type GraphicConnectionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GraphicConnectionQuery = { __typename?: 'Query', graphicConnection?: { __typename?: 'GraphicConfigurationType', link: string, password: string, protocol: string } | null };

export type CheckSetupStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckSetupStatusQuery = { __typename?: 'Query', checkSetupStatus: { __typename?: 'DyummyType', value: string } };

export type DepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DepartmentsQuery = { __typename?: 'Query', departments: Array<{ __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null }> };

export type DepartmentQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DepartmentQuery = { __typename?: 'Query', department?: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } | null };

export type FindDepartmentByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type FindDepartmentByNameQuery = { __typename?: 'Query', findDepartmentByName?: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed?: number | null, ipSubnet?: string | null, totalMachines?: number | null } | null };

export type MachineTemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type MachineTemplateCategoriesQuery = { __typename?: 'Query', machineTemplateCategories: Array<{ __typename?: 'MachineTemplateCategoryType', id: string, name: string, description?: string | null, createdAt: string, totalTemplates?: number | null, totalMachines?: number | null }> };

export type MachineTemplateCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MachineTemplateCategoryQuery = { __typename?: 'Query', machineTemplateCategory?: { __typename?: 'MachineTemplateCategoryType', id: string, name: string, description?: string | null, createdAt: string, totalTemplates?: number | null, totalMachines?: number | null } | null };

export type ApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ApplicationsQuery = { __typename?: 'Query', applications: Array<{ __typename?: 'ApplicationType', id: string, name: string, description?: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters?: { [key: string]: any } | null, icon?: string | null, createdAt: string }> };

export type ApplicationQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ApplicationQuery = { __typename?: 'Query', application?: { __typename?: 'ApplicationType', id: string, name: string, description?: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters?: { [key: string]: any } | null, icon?: string | null, createdAt: string } | null };

export type GetGraphicsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGraphicsQuery = { __typename?: 'Query', getGraphics: Array<{ __typename?: 'GPU', pciBus: string, vendor: string, model: string, memory: number }> };

export type NetworksQueryVariables = Exact<{ [key: string]: never; }>;


export type NetworksQuery = { __typename?: 'Query', networks: Array<{ __typename?: 'Network', name: string, uuid: string, description?: string | null, bridge: { __typename?: 'NetworkBridge', name: string, stp: string, delay: string }, ip: { __typename?: 'NetworkIp', address: string, netmask: string, dhcp?: { __typename?: 'NetworkDhcp', range: { __typename?: 'NetworkDhcpRange', start: string, end: string } } | null } }> };

export type NetworkQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type NetworkQuery = { __typename?: 'Query', network: { __typename?: 'Network', name: string, uuid: string, description?: string | null, bridge: { __typename?: 'NetworkBridge', name: string, stp: string, delay: string }, ip: { __typename?: 'NetworkIp', address: string, netmask: string, dhcp?: { __typename?: 'NetworkDhcp', range: { __typename?: 'NetworkDhcpRange', start: string, end: string } } | null } } };

export type ListFiltersQueryVariables = Exact<{
  vmId?: InputMaybe<Scalars['ID']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ListFiltersQuery = { __typename?: 'Query', listFilters: Array<{ __typename?: 'GenericFilter', id: string, name: string, description?: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules?: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null }> | null }> };

export type GetFilterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFilterQuery = { __typename?: 'Query', getFilter?: { __typename?: 'GenericFilter', id: string, name: string, description?: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules?: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null }> | null } | null };

export type ListFilterRulesQueryVariables = Exact<{
  filterId?: InputMaybe<Scalars['ID']['input']>;
}>;


export type ListFilterRulesQuery = { __typename?: 'Query', listFilterRules: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion?: string | null, srcMacAddr?: string | null, srcIpAddr?: string | null, srcIpMask?: string | null, dstIpAddr?: string | null, dstIpMask?: string | null, srcPortStart?: number | null, srcPortEnd?: number | null, dstPortStart?: number | null, dstPortEnd?: number | null, state?: { [key: string]: any } | null, comment?: string | null, createdAt?: string | null, updatedAt?: string | null }> };

export type ListServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type ListServicesQuery = { __typename?: 'Query', listServices: Array<{ __typename?: 'ServiceDefinition', id: string, name: string, displayName: string, description: string, riskLevel: ServiceRiskLevel, riskDescription: string, ports: Array<{ __typename?: 'ServicePort', protocol: string, portStart: number, portEnd: number }> }> };

export type GetVmServiceStatusQueryVariables = Exact<{
  serviceId: Scalars['ID']['input'];
  vmId: Scalars['ID']['input'];
}>;


export type GetVmServiceStatusQuery = { __typename?: 'Query', getVmServiceStatus: Array<{ __typename?: 'VmServiceStatus', vmId: string, vmName: string, serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean, running: boolean, lastSeen?: string | null }> };

export type GetDepartmentServiceStatusQueryVariables = Exact<{
  serviceId: Scalars['ID']['input'];
  departmentId: Scalars['ID']['input'];
}>;


export type GetDepartmentServiceStatusQuery = { __typename?: 'Query', getDepartmentServiceStatus: Array<{ __typename?: 'DepartmentServiceStatus', departmentId: string, departmentName: string, serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean, vmCount: number, enabledVmCount: number }> };

export type GetGlobalServiceStatusQueryVariables = Exact<{
  serviceId: Scalars['ID']['input'];
}>;


export type GetGlobalServiceStatusQuery = { __typename?: 'Query', getGlobalServiceStatus: Array<{ __typename?: 'GlobalServiceStatus', serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean }> };

export type GetServiceStatusSummaryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetServiceStatusSummaryQuery = { __typename?: 'Query', getServiceStatusSummary: Array<{ __typename?: 'ServiceStatusSummary', serviceId: string, serviceName: string, totalVms: number, runningVms: number, enabledVms: number }> };


export const CreateUserDocument = gql`
    mutation createUser($input: CreateUserInputType!) {
  createUser(input: $input) {
    id
    firstName
    lastName
    role
    email
    createdAt
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($input: UpdateUserInputType!, $id: String!) {
  updateUser(input: $input, id: $id) {
    id
    firstName
    lastName
    role
    email
    createdAt
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const CreateMachineTemplateDocument = gql`
    mutation createMachineTemplate($input: MachineTemplateInputType!) {
  createMachineTemplate(input: $input) {
    id
    name
    description
    cores
    ram
    storage
    createdAt
    categoryId
    totalMachines
  }
}
    `;
export type CreateMachineTemplateMutationFn = Apollo.MutationFunction<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>;

/**
 * __useCreateMachineTemplateMutation__
 *
 * To run a mutation, you first call `useCreateMachineTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMachineTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMachineTemplateMutation, { data, loading, error }] = useCreateMachineTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMachineTemplateMutation(baseOptions?: Apollo.MutationHookOptions<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>(CreateMachineTemplateDocument, options);
      }
export type CreateMachineTemplateMutationHookResult = ReturnType<typeof useCreateMachineTemplateMutation>;
export type CreateMachineTemplateMutationResult = Apollo.MutationResult<CreateMachineTemplateMutation>;
export type CreateMachineTemplateMutationOptions = Apollo.BaseMutationOptions<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>;
export const UpdateMachineTemplateDocument = gql`
    mutation updateMachineTemplate($input: MachineTemplateInputType!, $id: String!) {
  updateMachineTemplate(input: $input, id: $id) {
    id
    name
    description
    cores
    ram
    storage
    createdAt
    categoryId
    totalMachines
  }
}
    `;
export type UpdateMachineTemplateMutationFn = Apollo.MutationFunction<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>;

/**
 * __useUpdateMachineTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateMachineTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMachineTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMachineTemplateMutation, { data, loading, error }] = useUpdateMachineTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateMachineTemplateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>(UpdateMachineTemplateDocument, options);
      }
export type UpdateMachineTemplateMutationHookResult = ReturnType<typeof useUpdateMachineTemplateMutation>;
export type UpdateMachineTemplateMutationResult = Apollo.MutationResult<UpdateMachineTemplateMutation>;
export type UpdateMachineTemplateMutationOptions = Apollo.BaseMutationOptions<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>;
export const DestroyMachineTemplateDocument = gql`
    mutation destroyMachineTemplate($id: String!) {
  destroyMachineTemplate(id: $id)
}
    `;
export type DestroyMachineTemplateMutationFn = Apollo.MutationFunction<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>;

/**
 * __useDestroyMachineTemplateMutation__
 *
 * To run a mutation, you first call `useDestroyMachineTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyMachineTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyMachineTemplateMutation, { data, loading, error }] = useDestroyMachineTemplateMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDestroyMachineTemplateMutation(baseOptions?: Apollo.MutationHookOptions<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>(DestroyMachineTemplateDocument, options);
      }
export type DestroyMachineTemplateMutationHookResult = ReturnType<typeof useDestroyMachineTemplateMutation>;
export type DestroyMachineTemplateMutationResult = Apollo.MutationResult<DestroyMachineTemplateMutation>;
export type DestroyMachineTemplateMutationOptions = Apollo.BaseMutationOptions<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>;
export const DestroyMachineTemplateCategoryDocument = gql`
    mutation destroyMachineTemplateCategory($id: String!) {
  destroyMachineTemplateCategory(id: $id)
}
    `;
export type DestroyMachineTemplateCategoryMutationFn = Apollo.MutationFunction<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>;

/**
 * __useDestroyMachineTemplateCategoryMutation__
 *
 * To run a mutation, you first call `useDestroyMachineTemplateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyMachineTemplateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyMachineTemplateCategoryMutation, { data, loading, error }] = useDestroyMachineTemplateCategoryMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDestroyMachineTemplateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>(DestroyMachineTemplateCategoryDocument, options);
      }
export type DestroyMachineTemplateCategoryMutationHookResult = ReturnType<typeof useDestroyMachineTemplateCategoryMutation>;
export type DestroyMachineTemplateCategoryMutationResult = Apollo.MutationResult<DestroyMachineTemplateCategoryMutation>;
export type DestroyMachineTemplateCategoryMutationOptions = Apollo.BaseMutationOptions<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>;
export const CreateMachineDocument = gql`
    mutation createMachine($input: CreateMachineInputType!) {
  createMachine(input: $input) {
    id
    name
    configuration
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
      categoryId
      totalMachines
    }
    department {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
    user {
      id
      firstName
      lastName
      role
      email
      createdAt
    }
  }
}
    `;
export type CreateMachineMutationFn = Apollo.MutationFunction<CreateMachineMutation, CreateMachineMutationVariables>;

/**
 * __useCreateMachineMutation__
 *
 * To run a mutation, you first call `useCreateMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMachineMutation, { data, loading, error }] = useCreateMachineMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMachineMutation(baseOptions?: Apollo.MutationHookOptions<CreateMachineMutation, CreateMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMachineMutation, CreateMachineMutationVariables>(CreateMachineDocument, options);
      }
export type CreateMachineMutationHookResult = ReturnType<typeof useCreateMachineMutation>;
export type CreateMachineMutationResult = Apollo.MutationResult<CreateMachineMutation>;
export type CreateMachineMutationOptions = Apollo.BaseMutationOptions<CreateMachineMutation, CreateMachineMutationVariables>;
export const PowerOnDocument = gql`
    mutation powerOn($id: String!) {
  powerOn(id: $id) {
    success
    message
  }
}
    `;
export type PowerOnMutationFn = Apollo.MutationFunction<PowerOnMutation, PowerOnMutationVariables>;

/**
 * __usePowerOnMutation__
 *
 * To run a mutation, you first call `usePowerOnMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePowerOnMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [powerOnMutation, { data, loading, error }] = usePowerOnMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePowerOnMutation(baseOptions?: Apollo.MutationHookOptions<PowerOnMutation, PowerOnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PowerOnMutation, PowerOnMutationVariables>(PowerOnDocument, options);
      }
export type PowerOnMutationHookResult = ReturnType<typeof usePowerOnMutation>;
export type PowerOnMutationResult = Apollo.MutationResult<PowerOnMutation>;
export type PowerOnMutationOptions = Apollo.BaseMutationOptions<PowerOnMutation, PowerOnMutationVariables>;
export const PowerOffDocument = gql`
    mutation powerOff($id: String!) {
  powerOff(id: $id) {
    success
    message
  }
}
    `;
export type PowerOffMutationFn = Apollo.MutationFunction<PowerOffMutation, PowerOffMutationVariables>;

/**
 * __usePowerOffMutation__
 *
 * To run a mutation, you first call `usePowerOffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePowerOffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [powerOffMutation, { data, loading, error }] = usePowerOffMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePowerOffMutation(baseOptions?: Apollo.MutationHookOptions<PowerOffMutation, PowerOffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<PowerOffMutation, PowerOffMutationVariables>(PowerOffDocument, options);
      }
export type PowerOffMutationHookResult = ReturnType<typeof usePowerOffMutation>;
export type PowerOffMutationResult = Apollo.MutationResult<PowerOffMutation>;
export type PowerOffMutationOptions = Apollo.BaseMutationOptions<PowerOffMutation, PowerOffMutationVariables>;
export const SuspendDocument = gql`
    mutation suspend($id: String!) {
  suspend(id: $id) {
    success
    message
  }
}
    `;
export type SuspendMutationFn = Apollo.MutationFunction<SuspendMutation, SuspendMutationVariables>;

/**
 * __useSuspendMutation__
 *
 * To run a mutation, you first call `useSuspendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSuspendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [suspendMutation, { data, loading, error }] = useSuspendMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSuspendMutation(baseOptions?: Apollo.MutationHookOptions<SuspendMutation, SuspendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SuspendMutation, SuspendMutationVariables>(SuspendDocument, options);
      }
export type SuspendMutationHookResult = ReturnType<typeof useSuspendMutation>;
export type SuspendMutationResult = Apollo.MutationResult<SuspendMutation>;
export type SuspendMutationOptions = Apollo.BaseMutationOptions<SuspendMutation, SuspendMutationVariables>;
export const DestroyMachineDocument = gql`
    mutation destroyMachine($id: String!) {
  destroyMachine(id: $id) {
    success
    message
  }
}
    `;
export type DestroyMachineMutationFn = Apollo.MutationFunction<DestroyMachineMutation, DestroyMachineMutationVariables>;

/**
 * __useDestroyMachineMutation__
 *
 * To run a mutation, you first call `useDestroyMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyMachineMutation, { data, loading, error }] = useDestroyMachineMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDestroyMachineMutation(baseOptions?: Apollo.MutationHookOptions<DestroyMachineMutation, DestroyMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DestroyMachineMutation, DestroyMachineMutationVariables>(DestroyMachineDocument, options);
      }
export type DestroyMachineMutationHookResult = ReturnType<typeof useDestroyMachineMutation>;
export type DestroyMachineMutationResult = Apollo.MutationResult<DestroyMachineMutation>;
export type DestroyMachineMutationOptions = Apollo.BaseMutationOptions<DestroyMachineMutation, DestroyMachineMutationVariables>;
export const ExecuteCommandDocument = gql`
    mutation executeCommand($command: String!, $id: String!) {
  executeCommand(command: $command, id: $id) {
    success
    message
    response
  }
}
    `;
export type ExecuteCommandMutationFn = Apollo.MutationFunction<ExecuteCommandMutation, ExecuteCommandMutationVariables>;

/**
 * __useExecuteCommandMutation__
 *
 * To run a mutation, you first call `useExecuteCommandMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteCommandMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeCommandMutation, { data, loading, error }] = useExecuteCommandMutation({
 *   variables: {
 *      command: // value for 'command'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useExecuteCommandMutation(baseOptions?: Apollo.MutationHookOptions<ExecuteCommandMutation, ExecuteCommandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ExecuteCommandMutation, ExecuteCommandMutationVariables>(ExecuteCommandDocument, options);
      }
export type ExecuteCommandMutationHookResult = ReturnType<typeof useExecuteCommandMutation>;
export type ExecuteCommandMutationResult = Apollo.MutationResult<ExecuteCommandMutation>;
export type ExecuteCommandMutationOptions = Apollo.BaseMutationOptions<ExecuteCommandMutation, ExecuteCommandMutationVariables>;
export const MoveMachineDocument = gql`
    mutation moveMachine($departmentId: String!, $id: String!) {
  moveMachine(departmentId: $departmentId, id: $id) {
    id
    name
    configuration
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
      categoryId
      totalMachines
    }
    department {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
    user {
      id
      firstName
      lastName
      role
      email
      createdAt
    }
  }
}
    `;
export type MoveMachineMutationFn = Apollo.MutationFunction<MoveMachineMutation, MoveMachineMutationVariables>;

/**
 * __useMoveMachineMutation__
 *
 * To run a mutation, you first call `useMoveMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMoveMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moveMachineMutation, { data, loading, error }] = useMoveMachineMutation({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMoveMachineMutation(baseOptions?: Apollo.MutationHookOptions<MoveMachineMutation, MoveMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MoveMachineMutation, MoveMachineMutationVariables>(MoveMachineDocument, options);
      }
export type MoveMachineMutationHookResult = ReturnType<typeof useMoveMachineMutation>;
export type MoveMachineMutationResult = Apollo.MutationResult<MoveMachineMutation>;
export type MoveMachineMutationOptions = Apollo.BaseMutationOptions<MoveMachineMutation, MoveMachineMutationVariables>;
export const SetupNodeDocument = gql`
    mutation setupNode {
  setupNode {
    value
  }
}
    `;
export type SetupNodeMutationFn = Apollo.MutationFunction<SetupNodeMutation, SetupNodeMutationVariables>;

/**
 * __useSetupNodeMutation__
 *
 * To run a mutation, you first call `useSetupNodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetupNodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setupNodeMutation, { data, loading, error }] = useSetupNodeMutation({
 *   variables: {
 *   },
 * });
 */
export function useSetupNodeMutation(baseOptions?: Apollo.MutationHookOptions<SetupNodeMutation, SetupNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetupNodeMutation, SetupNodeMutationVariables>(SetupNodeDocument, options);
      }
export type SetupNodeMutationHookResult = ReturnType<typeof useSetupNodeMutation>;
export type SetupNodeMutationResult = Apollo.MutationResult<SetupNodeMutation>;
export type SetupNodeMutationOptions = Apollo.BaseMutationOptions<SetupNodeMutation, SetupNodeMutationVariables>;
export const CreateDepartmentDocument = gql`
    mutation createDepartment($name: String!) {
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
export type CreateDepartmentMutationFn = Apollo.MutationFunction<CreateDepartmentMutation, CreateDepartmentMutationVariables>;

/**
 * __useCreateDepartmentMutation__
 *
 * To run a mutation, you first call `useCreateDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDepartmentMutation, { data, loading, error }] = useCreateDepartmentMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<CreateDepartmentMutation, CreateDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDepartmentMutation, CreateDepartmentMutationVariables>(CreateDepartmentDocument, options);
      }
export type CreateDepartmentMutationHookResult = ReturnType<typeof useCreateDepartmentMutation>;
export type CreateDepartmentMutationResult = Apollo.MutationResult<CreateDepartmentMutation>;
export type CreateDepartmentMutationOptions = Apollo.BaseMutationOptions<CreateDepartmentMutation, CreateDepartmentMutationVariables>;
export const DestroyDepartmentDocument = gql`
    mutation destroyDepartment($id: String!) {
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
export type DestroyDepartmentMutationFn = Apollo.MutationFunction<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>;

/**
 * __useDestroyDepartmentMutation__
 *
 * To run a mutation, you first call `useDestroyDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDestroyDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [destroyDepartmentMutation, { data, loading, error }] = useDestroyDepartmentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDestroyDepartmentMutation(baseOptions?: Apollo.MutationHookOptions<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>(DestroyDepartmentDocument, options);
      }
export type DestroyDepartmentMutationHookResult = ReturnType<typeof useDestroyDepartmentMutation>;
export type DestroyDepartmentMutationResult = Apollo.MutationResult<DestroyDepartmentMutation>;
export type DestroyDepartmentMutationOptions = Apollo.BaseMutationOptions<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>;
export const CreateMachineTemplateCategoryDocument = gql`
    mutation createMachineTemplateCategory($input: MachineTemplateCategoryInputType!) {
  createMachineTemplateCategory(input: $input) {
    id
    name
    description
    createdAt
    totalTemplates
    totalMachines
  }
}
    `;
export type CreateMachineTemplateCategoryMutationFn = Apollo.MutationFunction<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>;

/**
 * __useCreateMachineTemplateCategoryMutation__
 *
 * To run a mutation, you first call `useCreateMachineTemplateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMachineTemplateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMachineTemplateCategoryMutation, { data, loading, error }] = useCreateMachineTemplateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMachineTemplateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>(CreateMachineTemplateCategoryDocument, options);
      }
export type CreateMachineTemplateCategoryMutationHookResult = ReturnType<typeof useCreateMachineTemplateCategoryMutation>;
export type CreateMachineTemplateCategoryMutationResult = Apollo.MutationResult<CreateMachineTemplateCategoryMutation>;
export type CreateMachineTemplateCategoryMutationOptions = Apollo.BaseMutationOptions<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>;
export const UpdateMachineTemplateCategoryDocument = gql`
    mutation updateMachineTemplateCategory($input: MachineTemplateCategoryInputType!, $id: String!) {
  updateMachineTemplateCategory(input: $input, id: $id) {
    id
    name
    description
    createdAt
    totalTemplates
    totalMachines
  }
}
    `;
export type UpdateMachineTemplateCategoryMutationFn = Apollo.MutationFunction<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>;

/**
 * __useUpdateMachineTemplateCategoryMutation__
 *
 * To run a mutation, you first call `useUpdateMachineTemplateCategoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMachineTemplateCategoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMachineTemplateCategoryMutation, { data, loading, error }] = useUpdateMachineTemplateCategoryMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateMachineTemplateCategoryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>(UpdateMachineTemplateCategoryDocument, options);
      }
export type UpdateMachineTemplateCategoryMutationHookResult = ReturnType<typeof useUpdateMachineTemplateCategoryMutation>;
export type UpdateMachineTemplateCategoryMutationResult = Apollo.MutationResult<UpdateMachineTemplateCategoryMutation>;
export type UpdateMachineTemplateCategoryMutationOptions = Apollo.BaseMutationOptions<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>;
export const CreateApplicationDocument = gql`
    mutation createApplication($input: CreateApplicationInputType!) {
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
export type CreateApplicationMutationFn = Apollo.MutationFunction<CreateApplicationMutation, CreateApplicationMutationVariables>;

/**
 * __useCreateApplicationMutation__
 *
 * To run a mutation, you first call `useCreateApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApplicationMutation, { data, loading, error }] = useCreateApplicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateApplicationMutation(baseOptions?: Apollo.MutationHookOptions<CreateApplicationMutation, CreateApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateApplicationMutation, CreateApplicationMutationVariables>(CreateApplicationDocument, options);
      }
export type CreateApplicationMutationHookResult = ReturnType<typeof useCreateApplicationMutation>;
export type CreateApplicationMutationResult = Apollo.MutationResult<CreateApplicationMutation>;
export type CreateApplicationMutationOptions = Apollo.BaseMutationOptions<CreateApplicationMutation, CreateApplicationMutationVariables>;
export const UpdateApplicationDocument = gql`
    mutation updateApplication($input: CreateApplicationInputType!, $id: String!) {
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
export type UpdateApplicationMutationFn = Apollo.MutationFunction<UpdateApplicationMutation, UpdateApplicationMutationVariables>;

/**
 * __useUpdateApplicationMutation__
 *
 * To run a mutation, you first call `useUpdateApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApplicationMutation, { data, loading, error }] = useUpdateApplicationMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateApplicationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateApplicationMutation, UpdateApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateApplicationMutation, UpdateApplicationMutationVariables>(UpdateApplicationDocument, options);
      }
export type UpdateApplicationMutationHookResult = ReturnType<typeof useUpdateApplicationMutation>;
export type UpdateApplicationMutationResult = Apollo.MutationResult<UpdateApplicationMutation>;
export type UpdateApplicationMutationOptions = Apollo.BaseMutationOptions<UpdateApplicationMutation, UpdateApplicationMutationVariables>;
export const DeleteApplicationDocument = gql`
    mutation deleteApplication($id: String!) {
  deleteApplication(id: $id)
}
    `;
export type DeleteApplicationMutationFn = Apollo.MutationFunction<DeleteApplicationMutation, DeleteApplicationMutationVariables>;

/**
 * __useDeleteApplicationMutation__
 *
 * To run a mutation, you first call `useDeleteApplicationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteApplicationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteApplicationMutation, { data, loading, error }] = useDeleteApplicationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteApplicationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteApplicationMutation, DeleteApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteApplicationMutation, DeleteApplicationMutationVariables>(DeleteApplicationDocument, options);
      }
export type DeleteApplicationMutationHookResult = ReturnType<typeof useDeleteApplicationMutation>;
export type DeleteApplicationMutationResult = Apollo.MutationResult<DeleteApplicationMutation>;
export type DeleteApplicationMutationOptions = Apollo.BaseMutationOptions<DeleteApplicationMutation, DeleteApplicationMutationVariables>;
export const CreateNetworkDocument = gql`
    mutation createNetwork($input: CreateNetworkInput!) {
  createNetwork(input: $input)
}
    `;
export type CreateNetworkMutationFn = Apollo.MutationFunction<CreateNetworkMutation, CreateNetworkMutationVariables>;

/**
 * __useCreateNetworkMutation__
 *
 * To run a mutation, you first call `useCreateNetworkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNetworkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNetworkMutation, { data, loading, error }] = useCreateNetworkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNetworkMutation(baseOptions?: Apollo.MutationHookOptions<CreateNetworkMutation, CreateNetworkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNetworkMutation, CreateNetworkMutationVariables>(CreateNetworkDocument, options);
      }
export type CreateNetworkMutationHookResult = ReturnType<typeof useCreateNetworkMutation>;
export type CreateNetworkMutationResult = Apollo.MutationResult<CreateNetworkMutation>;
export type CreateNetworkMutationOptions = Apollo.BaseMutationOptions<CreateNetworkMutation, CreateNetworkMutationVariables>;
export const SetNetworkIpRangeDocument = gql`
    mutation setNetworkIpRange($input: IpRangeInput!) {
  setNetworkIpRange(input: $input)
}
    `;
export type SetNetworkIpRangeMutationFn = Apollo.MutationFunction<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>;

/**
 * __useSetNetworkIpRangeMutation__
 *
 * To run a mutation, you first call `useSetNetworkIpRangeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNetworkIpRangeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNetworkIpRangeMutation, { data, loading, error }] = useSetNetworkIpRangeMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetNetworkIpRangeMutation(baseOptions?: Apollo.MutationHookOptions<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>(SetNetworkIpRangeDocument, options);
      }
export type SetNetworkIpRangeMutationHookResult = ReturnType<typeof useSetNetworkIpRangeMutation>;
export type SetNetworkIpRangeMutationResult = Apollo.MutationResult<SetNetworkIpRangeMutation>;
export type SetNetworkIpRangeMutationOptions = Apollo.BaseMutationOptions<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>;
export const SetNetworkIpDocument = gql`
    mutation setNetworkIp($input: NetworkIpInput!) {
  setNetworkIp(input: $input)
}
    `;
export type SetNetworkIpMutationFn = Apollo.MutationFunction<SetNetworkIpMutation, SetNetworkIpMutationVariables>;

/**
 * __useSetNetworkIpMutation__
 *
 * To run a mutation, you first call `useSetNetworkIpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNetworkIpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNetworkIpMutation, { data, loading, error }] = useSetNetworkIpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetNetworkIpMutation(baseOptions?: Apollo.MutationHookOptions<SetNetworkIpMutation, SetNetworkIpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetNetworkIpMutation, SetNetworkIpMutationVariables>(SetNetworkIpDocument, options);
      }
export type SetNetworkIpMutationHookResult = ReturnType<typeof useSetNetworkIpMutation>;
export type SetNetworkIpMutationResult = Apollo.MutationResult<SetNetworkIpMutation>;
export type SetNetworkIpMutationOptions = Apollo.BaseMutationOptions<SetNetworkIpMutation, SetNetworkIpMutationVariables>;
export const SetNetworkBridgeNameDocument = gql`
    mutation setNetworkBridgeName($input: BridgeNameInput!) {
  setNetworkBridgeName(input: $input)
}
    `;
export type SetNetworkBridgeNameMutationFn = Apollo.MutationFunction<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>;

/**
 * __useSetNetworkBridgeNameMutation__
 *
 * To run a mutation, you first call `useSetNetworkBridgeNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetNetworkBridgeNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setNetworkBridgeNameMutation, { data, loading, error }] = useSetNetworkBridgeNameMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSetNetworkBridgeNameMutation(baseOptions?: Apollo.MutationHookOptions<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>(SetNetworkBridgeNameDocument, options);
      }
export type SetNetworkBridgeNameMutationHookResult = ReturnType<typeof useSetNetworkBridgeNameMutation>;
export type SetNetworkBridgeNameMutationResult = Apollo.MutationResult<SetNetworkBridgeNameMutation>;
export type SetNetworkBridgeNameMutationOptions = Apollo.BaseMutationOptions<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>;
export const DeleteNetworkDocument = gql`
    mutation deleteNetwork($input: DeleteNetworkInput!) {
  deleteNetwork(input: $input)
}
    `;
export type DeleteNetworkMutationFn = Apollo.MutationFunction<DeleteNetworkMutation, DeleteNetworkMutationVariables>;

/**
 * __useDeleteNetworkMutation__
 *
 * To run a mutation, you first call `useDeleteNetworkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNetworkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNetworkMutation, { data, loading, error }] = useDeleteNetworkMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteNetworkMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNetworkMutation, DeleteNetworkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNetworkMutation, DeleteNetworkMutationVariables>(DeleteNetworkDocument, options);
      }
export type DeleteNetworkMutationHookResult = ReturnType<typeof useDeleteNetworkMutation>;
export type DeleteNetworkMutationResult = Apollo.MutationResult<DeleteNetworkMutation>;
export type DeleteNetworkMutationOptions = Apollo.BaseMutationOptions<DeleteNetworkMutation, DeleteNetworkMutationVariables>;
export const CreateFilterDocument = gql`
    mutation createFilter($input: CreateFilterInput!) {
  createFilter(input: $input) {
    id
    name
    description
    type
    rules {
      id
      protocol
      direction
      action
      priority
      ipVersion
      srcMacAddr
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      state
      comment
      createdAt
      updatedAt
    }
    references
    createdAt
    updatedAt
  }
}
    `;
export type CreateFilterMutationFn = Apollo.MutationFunction<CreateFilterMutation, CreateFilterMutationVariables>;

/**
 * __useCreateFilterMutation__
 *
 * To run a mutation, you first call `useCreateFilterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFilterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFilterMutation, { data, loading, error }] = useCreateFilterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateFilterMutation(baseOptions?: Apollo.MutationHookOptions<CreateFilterMutation, CreateFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFilterMutation, CreateFilterMutationVariables>(CreateFilterDocument, options);
      }
export type CreateFilterMutationHookResult = ReturnType<typeof useCreateFilterMutation>;
export type CreateFilterMutationResult = Apollo.MutationResult<CreateFilterMutation>;
export type CreateFilterMutationOptions = Apollo.BaseMutationOptions<CreateFilterMutation, CreateFilterMutationVariables>;
export const UpdateFilterDocument = gql`
    mutation updateFilter($input: UpdateFilterInput!, $id: ID!) {
  updateFilter(input: $input, id: $id) {
    id
    name
    description
    type
    rules {
      id
      protocol
      direction
      action
      priority
      ipVersion
      srcMacAddr
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      state
      comment
      createdAt
      updatedAt
    }
    references
    createdAt
    updatedAt
  }
}
    `;
export type UpdateFilterMutationFn = Apollo.MutationFunction<UpdateFilterMutation, UpdateFilterMutationVariables>;

/**
 * __useUpdateFilterMutation__
 *
 * To run a mutation, you first call `useUpdateFilterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFilterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFilterMutation, { data, loading, error }] = useUpdateFilterMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateFilterMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFilterMutation, UpdateFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFilterMutation, UpdateFilterMutationVariables>(UpdateFilterDocument, options);
      }
export type UpdateFilterMutationHookResult = ReturnType<typeof useUpdateFilterMutation>;
export type UpdateFilterMutationResult = Apollo.MutationResult<UpdateFilterMutation>;
export type UpdateFilterMutationOptions = Apollo.BaseMutationOptions<UpdateFilterMutation, UpdateFilterMutationVariables>;
export const DeleteFilterDocument = gql`
    mutation deleteFilter($id: ID!) {
  deleteFilter(id: $id)
}
    `;
export type DeleteFilterMutationFn = Apollo.MutationFunction<DeleteFilterMutation, DeleteFilterMutationVariables>;

/**
 * __useDeleteFilterMutation__
 *
 * To run a mutation, you first call `useDeleteFilterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFilterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFilterMutation, { data, loading, error }] = useDeleteFilterMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFilterMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFilterMutation, DeleteFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFilterMutation, DeleteFilterMutationVariables>(DeleteFilterDocument, options);
      }
export type DeleteFilterMutationHookResult = ReturnType<typeof useDeleteFilterMutation>;
export type DeleteFilterMutationResult = Apollo.MutationResult<DeleteFilterMutation>;
export type DeleteFilterMutationOptions = Apollo.BaseMutationOptions<DeleteFilterMutation, DeleteFilterMutationVariables>;
export const CreateFilterRuleDocument = gql`
    mutation createFilterRule($input: CreateFilterRuleInput!, $filterId: ID!) {
  createFilterRule(input: $input, filterId: $filterId) {
    id
    protocol
    direction
    action
    priority
    ipVersion
    srcMacAddr
    srcIpAddr
    srcIpMask
    dstIpAddr
    dstIpMask
    srcPortStart
    srcPortEnd
    dstPortStart
    dstPortEnd
    state
    comment
    createdAt
    updatedAt
  }
}
    `;
export type CreateFilterRuleMutationFn = Apollo.MutationFunction<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>;

/**
 * __useCreateFilterRuleMutation__
 *
 * To run a mutation, you first call `useCreateFilterRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFilterRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFilterRuleMutation, { data, loading, error }] = useCreateFilterRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *      filterId: // value for 'filterId'
 *   },
 * });
 */
export function useCreateFilterRuleMutation(baseOptions?: Apollo.MutationHookOptions<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>(CreateFilterRuleDocument, options);
      }
export type CreateFilterRuleMutationHookResult = ReturnType<typeof useCreateFilterRuleMutation>;
export type CreateFilterRuleMutationResult = Apollo.MutationResult<CreateFilterRuleMutation>;
export type CreateFilterRuleMutationOptions = Apollo.BaseMutationOptions<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>;
export const UpdateFilterRuleDocument = gql`
    mutation updateFilterRule($input: UpdateFilterRuleInput!, $id: ID!) {
  updateFilterRule(input: $input, id: $id) {
    id
    protocol
    direction
    action
    priority
    ipVersion
    srcMacAddr
    srcIpAddr
    srcIpMask
    dstIpAddr
    dstIpMask
    srcPortStart
    srcPortEnd
    dstPortStart
    dstPortEnd
    state
    comment
    createdAt
    updatedAt
  }
}
    `;
export type UpdateFilterRuleMutationFn = Apollo.MutationFunction<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>;

/**
 * __useUpdateFilterRuleMutation__
 *
 * To run a mutation, you first call `useUpdateFilterRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFilterRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFilterRuleMutation, { data, loading, error }] = useUpdateFilterRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUpdateFilterRuleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>(UpdateFilterRuleDocument, options);
      }
export type UpdateFilterRuleMutationHookResult = ReturnType<typeof useUpdateFilterRuleMutation>;
export type UpdateFilterRuleMutationResult = Apollo.MutationResult<UpdateFilterRuleMutation>;
export type UpdateFilterRuleMutationOptions = Apollo.BaseMutationOptions<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>;
export const DeleteFilterRuleDocument = gql`
    mutation deleteFilterRule($id: ID!) {
  deleteFilterRule(id: $id)
}
    `;
export type DeleteFilterRuleMutationFn = Apollo.MutationFunction<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>;

/**
 * __useDeleteFilterRuleMutation__
 *
 * To run a mutation, you first call `useDeleteFilterRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFilterRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFilterRuleMutation, { data, loading, error }] = useDeleteFilterRuleMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFilterRuleMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>(DeleteFilterRuleDocument, options);
      }
export type DeleteFilterRuleMutationHookResult = ReturnType<typeof useDeleteFilterRuleMutation>;
export type DeleteFilterRuleMutationResult = Apollo.MutationResult<DeleteFilterRuleMutation>;
export type DeleteFilterRuleMutationOptions = Apollo.BaseMutationOptions<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>;
export const FlushFilterDocument = gql`
    mutation flushFilter($filterId: ID!) {
  flushFilter(filterId: $filterId)
}
    `;
export type FlushFilterMutationFn = Apollo.MutationFunction<FlushFilterMutation, FlushFilterMutationVariables>;

/**
 * __useFlushFilterMutation__
 *
 * To run a mutation, you first call `useFlushFilterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFlushFilterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [flushFilterMutation, { data, loading, error }] = useFlushFilterMutation({
 *   variables: {
 *      filterId: // value for 'filterId'
 *   },
 * });
 */
export function useFlushFilterMutation(baseOptions?: Apollo.MutationHookOptions<FlushFilterMutation, FlushFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<FlushFilterMutation, FlushFilterMutationVariables>(FlushFilterDocument, options);
      }
export type FlushFilterMutationHookResult = ReturnType<typeof useFlushFilterMutation>;
export type FlushFilterMutationResult = Apollo.MutationResult<FlushFilterMutation>;
export type FlushFilterMutationOptions = Apollo.BaseMutationOptions<FlushFilterMutation, FlushFilterMutationVariables>;
export const ToggleVmServiceDocument = gql`
    mutation toggleVmService($vmId: ID!, $serviceId: ID!, $enabled: Boolean!, $action: ServiceAction!) {
  toggleVmService(
    input: {vmId: $vmId, serviceId: $serviceId, enabled: $enabled, action: $action}
  ) {
    vmId
    vmName
    serviceId
    serviceName
    useEnabled
    provideEnabled
    running
    lastSeen
  }
}
    `;
export type ToggleVmServiceMutationFn = Apollo.MutationFunction<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>;

/**
 * __useToggleVmServiceMutation__
 *
 * To run a mutation, you first call `useToggleVmServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleVmServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleVmServiceMutation, { data, loading, error }] = useToggleVmServiceMutation({
 *   variables: {
 *      vmId: // value for 'vmId'
 *      serviceId: // value for 'serviceId'
 *      enabled: // value for 'enabled'
 *      action: // value for 'action'
 *   },
 * });
 */
export function useToggleVmServiceMutation(baseOptions?: Apollo.MutationHookOptions<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>(ToggleVmServiceDocument, options);
      }
export type ToggleVmServiceMutationHookResult = ReturnType<typeof useToggleVmServiceMutation>;
export type ToggleVmServiceMutationResult = Apollo.MutationResult<ToggleVmServiceMutation>;
export type ToggleVmServiceMutationOptions = Apollo.BaseMutationOptions<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>;
export const ToggleDepartmentServiceDocument = gql`
    mutation toggleDepartmentService($departmentId: ID!, $serviceId: ID!, $enabled: Boolean!, $action: ServiceAction!) {
  toggleDepartmentService(
    input: {departmentId: $departmentId, serviceId: $serviceId, enabled: $enabled, action: $action}
  ) {
    departmentId
    departmentName
    serviceId
    serviceName
    useEnabled
    provideEnabled
    vmCount
    enabledVmCount
  }
}
    `;
export type ToggleDepartmentServiceMutationFn = Apollo.MutationFunction<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>;

/**
 * __useToggleDepartmentServiceMutation__
 *
 * To run a mutation, you first call `useToggleDepartmentServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleDepartmentServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleDepartmentServiceMutation, { data, loading, error }] = useToggleDepartmentServiceMutation({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *      serviceId: // value for 'serviceId'
 *      enabled: // value for 'enabled'
 *      action: // value for 'action'
 *   },
 * });
 */
export function useToggleDepartmentServiceMutation(baseOptions?: Apollo.MutationHookOptions<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>(ToggleDepartmentServiceDocument, options);
      }
export type ToggleDepartmentServiceMutationHookResult = ReturnType<typeof useToggleDepartmentServiceMutation>;
export type ToggleDepartmentServiceMutationResult = Apollo.MutationResult<ToggleDepartmentServiceMutation>;
export type ToggleDepartmentServiceMutationOptions = Apollo.BaseMutationOptions<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>;
export const ToggleGlobalServiceDocument = gql`
    mutation toggleGlobalService($serviceId: ID!, $enabled: Boolean!, $action: ServiceAction!) {
  toggleGlobalService(
    input: {serviceId: $serviceId, enabled: $enabled, action: $action}
  ) {
    serviceId
    serviceName
    useEnabled
    provideEnabled
  }
}
    `;
export type ToggleGlobalServiceMutationFn = Apollo.MutationFunction<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>;

/**
 * __useToggleGlobalServiceMutation__
 *
 * To run a mutation, you first call `useToggleGlobalServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleGlobalServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleGlobalServiceMutation, { data, loading, error }] = useToggleGlobalServiceMutation({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *      enabled: // value for 'enabled'
 *      action: // value for 'action'
 *   },
 * });
 */
export function useToggleGlobalServiceMutation(baseOptions?: Apollo.MutationHookOptions<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>(ToggleGlobalServiceDocument, options);
      }
export type ToggleGlobalServiceMutationHookResult = ReturnType<typeof useToggleGlobalServiceMutation>;
export type ToggleGlobalServiceMutationResult = Apollo.MutationResult<ToggleGlobalServiceMutation>;
export type ToggleGlobalServiceMutationOptions = Apollo.BaseMutationOptions<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>;
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    id
    firstName
    lastName
    role
    email
    createdAt
    namespace
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export function useCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export function refetchCurrentUserQuery(variables?: CurrentUserQueryVariables) {
      return { query: CurrentUserDocument, variables: variables }
    }
export const UserDocument = gql`
    query user($id: String!) {
  user(id: $id) {
    id
    firstName
    lastName
    role
    email
    createdAt
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables> & ({ variables: UserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export function refetchUserQuery(variables: UserQueryVariables) {
      return { query: UserDocument, variables: variables }
    }
export const UsersDocument = gql`
    query users($pagination: PaginationInputType, $orderBy: UserOrderByInputType) {
  users(pagination: $pagination, orderBy: $orderBy) {
    id
    firstName
    lastName
    role
    email
    createdAt
  }
}
    `;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      orderBy: // value for 'orderBy'
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
    }
export const LoginDocument = gql`
    query login($password: String!, $email: String!) {
  login(password: $password, email: $email) {
    token
  }
}
    `;

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      password: // value for 'password'
 *      email: // value for 'email'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables> & ({ variables: LoginQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export function useLoginSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginSuspenseQueryHookResult = ReturnType<typeof useLoginSuspenseQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
export function refetchLoginQuery(variables: LoginQueryVariables) {
      return { query: LoginDocument, variables: variables }
    }
export const MachineTemplateDocument = gql`
    query machineTemplate($id: String!) {
  machineTemplate(id: $id) {
    id
    name
    description
    cores
    ram
    storage
    createdAt
    categoryId
    totalMachines
  }
}
    `;

/**
 * __useMachineTemplateQuery__
 *
 * To run a query within a React component, call `useMachineTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachineTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachineTemplateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMachineTemplateQuery(baseOptions: Apollo.QueryHookOptions<MachineTemplateQuery, MachineTemplateQueryVariables> & ({ variables: MachineTemplateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachineTemplateQuery, MachineTemplateQueryVariables>(MachineTemplateDocument, options);
      }
export function useMachineTemplateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachineTemplateQuery, MachineTemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachineTemplateQuery, MachineTemplateQueryVariables>(MachineTemplateDocument, options);
        }
export function useMachineTemplateSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MachineTemplateQuery, MachineTemplateQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MachineTemplateQuery, MachineTemplateQueryVariables>(MachineTemplateDocument, options);
        }
export type MachineTemplateQueryHookResult = ReturnType<typeof useMachineTemplateQuery>;
export type MachineTemplateLazyQueryHookResult = ReturnType<typeof useMachineTemplateLazyQuery>;
export type MachineTemplateSuspenseQueryHookResult = ReturnType<typeof useMachineTemplateSuspenseQuery>;
export type MachineTemplateQueryResult = Apollo.QueryResult<MachineTemplateQuery, MachineTemplateQueryVariables>;
export function refetchMachineTemplateQuery(variables: MachineTemplateQueryVariables) {
      return { query: MachineTemplateDocument, variables: variables }
    }
export const MachineTemplatesDocument = gql`
    query machineTemplates($orderBy: MachineTemplateOrderBy, $pagination: PaginationInputType) {
  machineTemplates(orderBy: $orderBy, pagination: $pagination) {
    id
    name
    description
    cores
    ram
    storage
    createdAt
    categoryId
    totalMachines
  }
}
    `;

/**
 * __useMachineTemplatesQuery__
 *
 * To run a query within a React component, call `useMachineTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachineTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachineTemplatesQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useMachineTemplatesQuery(baseOptions?: Apollo.QueryHookOptions<MachineTemplatesQuery, MachineTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachineTemplatesQuery, MachineTemplatesQueryVariables>(MachineTemplatesDocument, options);
      }
export function useMachineTemplatesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachineTemplatesQuery, MachineTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachineTemplatesQuery, MachineTemplatesQueryVariables>(MachineTemplatesDocument, options);
        }
export function useMachineTemplatesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MachineTemplatesQuery, MachineTemplatesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MachineTemplatesQuery, MachineTemplatesQueryVariables>(MachineTemplatesDocument, options);
        }
export type MachineTemplatesQueryHookResult = ReturnType<typeof useMachineTemplatesQuery>;
export type MachineTemplatesLazyQueryHookResult = ReturnType<typeof useMachineTemplatesLazyQuery>;
export type MachineTemplatesSuspenseQueryHookResult = ReturnType<typeof useMachineTemplatesSuspenseQuery>;
export type MachineTemplatesQueryResult = Apollo.QueryResult<MachineTemplatesQuery, MachineTemplatesQueryVariables>;
export function refetchMachineTemplatesQuery(variables?: MachineTemplatesQueryVariables) {
      return { query: MachineTemplatesDocument, variables: variables }
    }
export const MachineDocument = gql`
    query machine($id: String!) {
  machine(id: $id) {
    id
    name
    configuration
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
      categoryId
      totalMachines
    }
    department {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
    user {
      id
      firstName
      lastName
      role
      email
      createdAt
    }
  }
}
    `;

/**
 * __useMachineQuery__
 *
 * To run a query within a React component, call `useMachineQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachineQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachineQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMachineQuery(baseOptions: Apollo.QueryHookOptions<MachineQuery, MachineQueryVariables> & ({ variables: MachineQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachineQuery, MachineQueryVariables>(MachineDocument, options);
      }
export function useMachineLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachineQuery, MachineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachineQuery, MachineQueryVariables>(MachineDocument, options);
        }
export function useMachineSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MachineQuery, MachineQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MachineQuery, MachineQueryVariables>(MachineDocument, options);
        }
export type MachineQueryHookResult = ReturnType<typeof useMachineQuery>;
export type MachineLazyQueryHookResult = ReturnType<typeof useMachineLazyQuery>;
export type MachineSuspenseQueryHookResult = ReturnType<typeof useMachineSuspenseQuery>;
export type MachineQueryResult = Apollo.QueryResult<MachineQuery, MachineQueryVariables>;
export function refetchMachineQuery(variables: MachineQueryVariables) {
      return { query: MachineDocument, variables: variables }
    }
export const MachinesDocument = gql`
    query machines($orderBy: MachineOrderBy, $pagination: PaginationInputType) {
  machines(orderBy: $orderBy, pagination: $pagination) {
    id
    name
    configuration
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
      categoryId
      totalMachines
    }
    department {
      id
      name
      createdAt
      internetSpeed
      ipSubnet
      totalMachines
    }
    user {
      id
      firstName
      lastName
      role
      email
      createdAt
    }
  }
}
    `;

/**
 * __useMachinesQuery__
 *
 * To run a query within a React component, call `useMachinesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachinesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachinesQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useMachinesQuery(baseOptions?: Apollo.QueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
      }
export function useMachinesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
        }
export function useMachinesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
        }
export type MachinesQueryHookResult = ReturnType<typeof useMachinesQuery>;
export type MachinesLazyQueryHookResult = ReturnType<typeof useMachinesLazyQuery>;
export type MachinesSuspenseQueryHookResult = ReturnType<typeof useMachinesSuspenseQuery>;
export type MachinesQueryResult = Apollo.QueryResult<MachinesQuery, MachinesQueryVariables>;
export function refetchMachinesQuery(variables?: MachinesQueryVariables) {
      return { query: MachinesDocument, variables: variables }
    }
export const GraphicConnectionDocument = gql`
    query graphicConnection($id: String!) {
  graphicConnection(id: $id) {
    link
    password
    protocol
  }
}
    `;

/**
 * __useGraphicConnectionQuery__
 *
 * To run a query within a React component, call `useGraphicConnectionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGraphicConnectionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGraphicConnectionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGraphicConnectionQuery(baseOptions: Apollo.QueryHookOptions<GraphicConnectionQuery, GraphicConnectionQueryVariables> & ({ variables: GraphicConnectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GraphicConnectionQuery, GraphicConnectionQueryVariables>(GraphicConnectionDocument, options);
      }
export function useGraphicConnectionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GraphicConnectionQuery, GraphicConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GraphicConnectionQuery, GraphicConnectionQueryVariables>(GraphicConnectionDocument, options);
        }
export function useGraphicConnectionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GraphicConnectionQuery, GraphicConnectionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GraphicConnectionQuery, GraphicConnectionQueryVariables>(GraphicConnectionDocument, options);
        }
export type GraphicConnectionQueryHookResult = ReturnType<typeof useGraphicConnectionQuery>;
export type GraphicConnectionLazyQueryHookResult = ReturnType<typeof useGraphicConnectionLazyQuery>;
export type GraphicConnectionSuspenseQueryHookResult = ReturnType<typeof useGraphicConnectionSuspenseQuery>;
export type GraphicConnectionQueryResult = Apollo.QueryResult<GraphicConnectionQuery, GraphicConnectionQueryVariables>;
export function refetchGraphicConnectionQuery(variables: GraphicConnectionQueryVariables) {
      return { query: GraphicConnectionDocument, variables: variables }
    }
export const CheckSetupStatusDocument = gql`
    query checkSetupStatus {
  checkSetupStatus {
    value
  }
}
    `;

/**
 * __useCheckSetupStatusQuery__
 *
 * To run a query within a React component, call `useCheckSetupStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useCheckSetupStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCheckSetupStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useCheckSetupStatusQuery(baseOptions?: Apollo.QueryHookOptions<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>(CheckSetupStatusDocument, options);
      }
export function useCheckSetupStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>(CheckSetupStatusDocument, options);
        }
export function useCheckSetupStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>(CheckSetupStatusDocument, options);
        }
export type CheckSetupStatusQueryHookResult = ReturnType<typeof useCheckSetupStatusQuery>;
export type CheckSetupStatusLazyQueryHookResult = ReturnType<typeof useCheckSetupStatusLazyQuery>;
export type CheckSetupStatusSuspenseQueryHookResult = ReturnType<typeof useCheckSetupStatusSuspenseQuery>;
export type CheckSetupStatusQueryResult = Apollo.QueryResult<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>;
export function refetchCheckSetupStatusQuery(variables?: CheckSetupStatusQueryVariables) {
      return { query: CheckSetupStatusDocument, variables: variables }
    }
export const DepartmentsDocument = gql`
    query departments {
  departments {
    id
    name
    createdAt
    internetSpeed
    ipSubnet
    totalMachines
  }
}
    `;

/**
 * __useDepartmentsQuery__
 *
 * To run a query within a React component, call `useDepartmentsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentsQuery({
 *   variables: {
 *   },
 * });
 */
export function useDepartmentsQuery(baseOptions?: Apollo.QueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
      }
export function useDepartmentsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
        }
export function useDepartmentsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
        }
export type DepartmentsQueryHookResult = ReturnType<typeof useDepartmentsQuery>;
export type DepartmentsLazyQueryHookResult = ReturnType<typeof useDepartmentsLazyQuery>;
export type DepartmentsSuspenseQueryHookResult = ReturnType<typeof useDepartmentsSuspenseQuery>;
export type DepartmentsQueryResult = Apollo.QueryResult<DepartmentsQuery, DepartmentsQueryVariables>;
export function refetchDepartmentsQuery(variables?: DepartmentsQueryVariables) {
      return { query: DepartmentsDocument, variables: variables }
    }
export const DepartmentDocument = gql`
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

/**
 * __useDepartmentQuery__
 *
 * To run a query within a React component, call `useDepartmentQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDepartmentQuery(baseOptions: Apollo.QueryHookOptions<DepartmentQuery, DepartmentQueryVariables> & ({ variables: DepartmentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<DepartmentQuery, DepartmentQueryVariables>(DepartmentDocument, options);
      }
export function useDepartmentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DepartmentQuery, DepartmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<DepartmentQuery, DepartmentQueryVariables>(DepartmentDocument, options);
        }
export function useDepartmentSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<DepartmentQuery, DepartmentQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<DepartmentQuery, DepartmentQueryVariables>(DepartmentDocument, options);
        }
export type DepartmentQueryHookResult = ReturnType<typeof useDepartmentQuery>;
export type DepartmentLazyQueryHookResult = ReturnType<typeof useDepartmentLazyQuery>;
export type DepartmentSuspenseQueryHookResult = ReturnType<typeof useDepartmentSuspenseQuery>;
export type DepartmentQueryResult = Apollo.QueryResult<DepartmentQuery, DepartmentQueryVariables>;
export function refetchDepartmentQuery(variables: DepartmentQueryVariables) {
      return { query: DepartmentDocument, variables: variables }
    }
export const FindDepartmentByNameDocument = gql`
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

/**
 * __useFindDepartmentByNameQuery__
 *
 * To run a query within a React component, call `useFindDepartmentByNameQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindDepartmentByNameQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindDepartmentByNameQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useFindDepartmentByNameQuery(baseOptions: Apollo.QueryHookOptions<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables> & ({ variables: FindDepartmentByNameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>(FindDepartmentByNameDocument, options);
      }
export function useFindDepartmentByNameLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>(FindDepartmentByNameDocument, options);
        }
export function useFindDepartmentByNameSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>(FindDepartmentByNameDocument, options);
        }
export type FindDepartmentByNameQueryHookResult = ReturnType<typeof useFindDepartmentByNameQuery>;
export type FindDepartmentByNameLazyQueryHookResult = ReturnType<typeof useFindDepartmentByNameLazyQuery>;
export type FindDepartmentByNameSuspenseQueryHookResult = ReturnType<typeof useFindDepartmentByNameSuspenseQuery>;
export type FindDepartmentByNameQueryResult = Apollo.QueryResult<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>;
export function refetchFindDepartmentByNameQuery(variables: FindDepartmentByNameQueryVariables) {
      return { query: FindDepartmentByNameDocument, variables: variables }
    }
export const MachineTemplateCategoriesDocument = gql`
    query machineTemplateCategories {
  machineTemplateCategories {
    id
    name
    description
    createdAt
    totalTemplates
    totalMachines
  }
}
    `;

/**
 * __useMachineTemplateCategoriesQuery__
 *
 * To run a query within a React component, call `useMachineTemplateCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachineTemplateCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachineTemplateCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMachineTemplateCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>(MachineTemplateCategoriesDocument, options);
      }
export function useMachineTemplateCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>(MachineTemplateCategoriesDocument, options);
        }
export function useMachineTemplateCategoriesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>(MachineTemplateCategoriesDocument, options);
        }
export type MachineTemplateCategoriesQueryHookResult = ReturnType<typeof useMachineTemplateCategoriesQuery>;
export type MachineTemplateCategoriesLazyQueryHookResult = ReturnType<typeof useMachineTemplateCategoriesLazyQuery>;
export type MachineTemplateCategoriesSuspenseQueryHookResult = ReturnType<typeof useMachineTemplateCategoriesSuspenseQuery>;
export type MachineTemplateCategoriesQueryResult = Apollo.QueryResult<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>;
export function refetchMachineTemplateCategoriesQuery(variables?: MachineTemplateCategoriesQueryVariables) {
      return { query: MachineTemplateCategoriesDocument, variables: variables }
    }
export const MachineTemplateCategoryDocument = gql`
    query machineTemplateCategory($id: String!) {
  machineTemplateCategory(id: $id) {
    id
    name
    description
    createdAt
    totalTemplates
    totalMachines
  }
}
    `;

/**
 * __useMachineTemplateCategoryQuery__
 *
 * To run a query within a React component, call `useMachineTemplateCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useMachineTemplateCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMachineTemplateCategoryQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMachineTemplateCategoryQuery(baseOptions: Apollo.QueryHookOptions<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables> & ({ variables: MachineTemplateCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>(MachineTemplateCategoryDocument, options);
      }
export function useMachineTemplateCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>(MachineTemplateCategoryDocument, options);
        }
export function useMachineTemplateCategorySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>(MachineTemplateCategoryDocument, options);
        }
export type MachineTemplateCategoryQueryHookResult = ReturnType<typeof useMachineTemplateCategoryQuery>;
export type MachineTemplateCategoryLazyQueryHookResult = ReturnType<typeof useMachineTemplateCategoryLazyQuery>;
export type MachineTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useMachineTemplateCategorySuspenseQuery>;
export type MachineTemplateCategoryQueryResult = Apollo.QueryResult<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>;
export function refetchMachineTemplateCategoryQuery(variables: MachineTemplateCategoryQueryVariables) {
      return { query: MachineTemplateCategoryDocument, variables: variables }
    }
export const ApplicationsDocument = gql`
    query applications {
  applications {
    id
    name
    description
    os
    installCommand
    parameters
    icon
    createdAt
  }
}
    `;

/**
 * __useApplicationsQuery__
 *
 * To run a query within a React component, call `useApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
      }
export function useApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
        }
export function useApplicationsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
        }
export type ApplicationsQueryHookResult = ReturnType<typeof useApplicationsQuery>;
export type ApplicationsLazyQueryHookResult = ReturnType<typeof useApplicationsLazyQuery>;
export type ApplicationsSuspenseQueryHookResult = ReturnType<typeof useApplicationsSuspenseQuery>;
export type ApplicationsQueryResult = Apollo.QueryResult<ApplicationsQuery, ApplicationsQueryVariables>;
export function refetchApplicationsQuery(variables?: ApplicationsQueryVariables) {
      return { query: ApplicationsDocument, variables: variables }
    }
export const ApplicationDocument = gql`
    query application($id: String!) {
  application(id: $id) {
    id
    name
    description
    os
    installCommand
    parameters
    icon
    createdAt
  }
}
    `;

/**
 * __useApplicationQuery__
 *
 * To run a query within a React component, call `useApplicationQuery` and pass it any options that fit your needs.
 * When your component renders, `useApplicationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApplicationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApplicationQuery(baseOptions: Apollo.QueryHookOptions<ApplicationQuery, ApplicationQueryVariables> & ({ variables: ApplicationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ApplicationQuery, ApplicationQueryVariables>(ApplicationDocument, options);
      }
export function useApplicationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ApplicationQuery, ApplicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ApplicationQuery, ApplicationQueryVariables>(ApplicationDocument, options);
        }
export function useApplicationSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ApplicationQuery, ApplicationQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ApplicationQuery, ApplicationQueryVariables>(ApplicationDocument, options);
        }
export type ApplicationQueryHookResult = ReturnType<typeof useApplicationQuery>;
export type ApplicationLazyQueryHookResult = ReturnType<typeof useApplicationLazyQuery>;
export type ApplicationSuspenseQueryHookResult = ReturnType<typeof useApplicationSuspenseQuery>;
export type ApplicationQueryResult = Apollo.QueryResult<ApplicationQuery, ApplicationQueryVariables>;
export function refetchApplicationQuery(variables: ApplicationQueryVariables) {
      return { query: ApplicationDocument, variables: variables }
    }
export const GetGraphicsDocument = gql`
    query getGraphics {
  getGraphics {
    pciBus
    vendor
    model
    memory
  }
}
    `;

/**
 * __useGetGraphicsQuery__
 *
 * To run a query within a React component, call `useGetGraphicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGraphicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGraphicsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetGraphicsQuery(baseOptions?: Apollo.QueryHookOptions<GetGraphicsQuery, GetGraphicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGraphicsQuery, GetGraphicsQueryVariables>(GetGraphicsDocument, options);
      }
export function useGetGraphicsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGraphicsQuery, GetGraphicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGraphicsQuery, GetGraphicsQueryVariables>(GetGraphicsDocument, options);
        }
export function useGetGraphicsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGraphicsQuery, GetGraphicsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGraphicsQuery, GetGraphicsQueryVariables>(GetGraphicsDocument, options);
        }
export type GetGraphicsQueryHookResult = ReturnType<typeof useGetGraphicsQuery>;
export type GetGraphicsLazyQueryHookResult = ReturnType<typeof useGetGraphicsLazyQuery>;
export type GetGraphicsSuspenseQueryHookResult = ReturnType<typeof useGetGraphicsSuspenseQuery>;
export type GetGraphicsQueryResult = Apollo.QueryResult<GetGraphicsQuery, GetGraphicsQueryVariables>;
export function refetchGetGraphicsQuery(variables?: GetGraphicsQueryVariables) {
      return { query: GetGraphicsDocument, variables: variables }
    }
export const NetworksDocument = gql`
    query networks {
  networks {
    name
    uuid
    bridge {
      name
      stp
      delay
    }
    ip {
      address
      netmask
      dhcp {
        range {
          start
          end
        }
      }
    }
    description
  }
}
    `;

/**
 * __useNetworksQuery__
 *
 * To run a query within a React component, call `useNetworksQuery` and pass it any options that fit your needs.
 * When your component renders, `useNetworksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworksQuery({
 *   variables: {
 *   },
 * });
 */
export function useNetworksQuery(baseOptions?: Apollo.QueryHookOptions<NetworksQuery, NetworksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NetworksQuery, NetworksQueryVariables>(NetworksDocument, options);
      }
export function useNetworksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworksQuery, NetworksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NetworksQuery, NetworksQueryVariables>(NetworksDocument, options);
        }
export function useNetworksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NetworksQuery, NetworksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NetworksQuery, NetworksQueryVariables>(NetworksDocument, options);
        }
export type NetworksQueryHookResult = ReturnType<typeof useNetworksQuery>;
export type NetworksLazyQueryHookResult = ReturnType<typeof useNetworksLazyQuery>;
export type NetworksSuspenseQueryHookResult = ReturnType<typeof useNetworksSuspenseQuery>;
export type NetworksQueryResult = Apollo.QueryResult<NetworksQuery, NetworksQueryVariables>;
export function refetchNetworksQuery(variables?: NetworksQueryVariables) {
      return { query: NetworksDocument, variables: variables }
    }
export const NetworkDocument = gql`
    query network($name: String!) {
  network(name: $name) {
    name
    uuid
    bridge {
      name
      stp
      delay
    }
    ip {
      address
      netmask
      dhcp {
        range {
          start
          end
        }
      }
    }
    description
  }
}
    `;

/**
 * __useNetworkQuery__
 *
 * To run a query within a React component, call `useNetworkQuery` and pass it any options that fit your needs.
 * When your component renders, `useNetworkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNetworkQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useNetworkQuery(baseOptions: Apollo.QueryHookOptions<NetworkQuery, NetworkQueryVariables> & ({ variables: NetworkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<NetworkQuery, NetworkQueryVariables>(NetworkDocument, options);
      }
export function useNetworkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<NetworkQuery, NetworkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<NetworkQuery, NetworkQueryVariables>(NetworkDocument, options);
        }
export function useNetworkSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<NetworkQuery, NetworkQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<NetworkQuery, NetworkQueryVariables>(NetworkDocument, options);
        }
export type NetworkQueryHookResult = ReturnType<typeof useNetworkQuery>;
export type NetworkLazyQueryHookResult = ReturnType<typeof useNetworkLazyQuery>;
export type NetworkSuspenseQueryHookResult = ReturnType<typeof useNetworkSuspenseQuery>;
export type NetworkQueryResult = Apollo.QueryResult<NetworkQuery, NetworkQueryVariables>;
export function refetchNetworkQuery(variables: NetworkQueryVariables) {
      return { query: NetworkDocument, variables: variables }
    }
export const ListFiltersDocument = gql`
    query listFilters($vmId: ID, $departmentId: ID) {
  listFilters(vmId: $vmId, departmentId: $departmentId) {
    id
    name
    description
    type
    rules {
      id
      protocol
      direction
      action
      priority
      ipVersion
      srcMacAddr
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      state
      comment
      createdAt
      updatedAt
    }
    references
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useListFiltersQuery__
 *
 * To run a query within a React component, call `useListFiltersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListFiltersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListFiltersQuery({
 *   variables: {
 *      vmId: // value for 'vmId'
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useListFiltersQuery(baseOptions?: Apollo.QueryHookOptions<ListFiltersQuery, ListFiltersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListFiltersQuery, ListFiltersQueryVariables>(ListFiltersDocument, options);
      }
export function useListFiltersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListFiltersQuery, ListFiltersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListFiltersQuery, ListFiltersQueryVariables>(ListFiltersDocument, options);
        }
export function useListFiltersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListFiltersQuery, ListFiltersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListFiltersQuery, ListFiltersQueryVariables>(ListFiltersDocument, options);
        }
export type ListFiltersQueryHookResult = ReturnType<typeof useListFiltersQuery>;
export type ListFiltersLazyQueryHookResult = ReturnType<typeof useListFiltersLazyQuery>;
export type ListFiltersSuspenseQueryHookResult = ReturnType<typeof useListFiltersSuspenseQuery>;
export type ListFiltersQueryResult = Apollo.QueryResult<ListFiltersQuery, ListFiltersQueryVariables>;
export function refetchListFiltersQuery(variables?: ListFiltersQueryVariables) {
      return { query: ListFiltersDocument, variables: variables }
    }
export const GetFilterDocument = gql`
    query getFilter($id: ID!) {
  getFilter(id: $id) {
    id
    name
    description
    type
    rules {
      id
      protocol
      direction
      action
      priority
      ipVersion
      srcMacAddr
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      state
      comment
      createdAt
      updatedAt
    }
    references
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetFilterQuery__
 *
 * To run a query within a React component, call `useGetFilterQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFilterQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFilterQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetFilterQuery(baseOptions: Apollo.QueryHookOptions<GetFilterQuery, GetFilterQueryVariables> & ({ variables: GetFilterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFilterQuery, GetFilterQueryVariables>(GetFilterDocument, options);
      }
export function useGetFilterLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFilterQuery, GetFilterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFilterQuery, GetFilterQueryVariables>(GetFilterDocument, options);
        }
export function useGetFilterSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFilterQuery, GetFilterQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFilterQuery, GetFilterQueryVariables>(GetFilterDocument, options);
        }
export type GetFilterQueryHookResult = ReturnType<typeof useGetFilterQuery>;
export type GetFilterLazyQueryHookResult = ReturnType<typeof useGetFilterLazyQuery>;
export type GetFilterSuspenseQueryHookResult = ReturnType<typeof useGetFilterSuspenseQuery>;
export type GetFilterQueryResult = Apollo.QueryResult<GetFilterQuery, GetFilterQueryVariables>;
export function refetchGetFilterQuery(variables: GetFilterQueryVariables) {
      return { query: GetFilterDocument, variables: variables }
    }
export const ListFilterRulesDocument = gql`
    query listFilterRules($filterId: ID) {
  listFilterRules(filterId: $filterId) {
    id
    protocol
    direction
    action
    priority
    ipVersion
    srcMacAddr
    srcIpAddr
    srcIpMask
    dstIpAddr
    dstIpMask
    srcPortStart
    srcPortEnd
    dstPortStart
    dstPortEnd
    state
    comment
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useListFilterRulesQuery__
 *
 * To run a query within a React component, call `useListFilterRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListFilterRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListFilterRulesQuery({
 *   variables: {
 *      filterId: // value for 'filterId'
 *   },
 * });
 */
export function useListFilterRulesQuery(baseOptions?: Apollo.QueryHookOptions<ListFilterRulesQuery, ListFilterRulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListFilterRulesQuery, ListFilterRulesQueryVariables>(ListFilterRulesDocument, options);
      }
export function useListFilterRulesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListFilterRulesQuery, ListFilterRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListFilterRulesQuery, ListFilterRulesQueryVariables>(ListFilterRulesDocument, options);
        }
export function useListFilterRulesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListFilterRulesQuery, ListFilterRulesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListFilterRulesQuery, ListFilterRulesQueryVariables>(ListFilterRulesDocument, options);
        }
export type ListFilterRulesQueryHookResult = ReturnType<typeof useListFilterRulesQuery>;
export type ListFilterRulesLazyQueryHookResult = ReturnType<typeof useListFilterRulesLazyQuery>;
export type ListFilterRulesSuspenseQueryHookResult = ReturnType<typeof useListFilterRulesSuspenseQuery>;
export type ListFilterRulesQueryResult = Apollo.QueryResult<ListFilterRulesQuery, ListFilterRulesQueryVariables>;
export function refetchListFilterRulesQuery(variables?: ListFilterRulesQueryVariables) {
      return { query: ListFilterRulesDocument, variables: variables }
    }
export const ListServicesDocument = gql`
    query listServices {
  listServices {
    id
    name
    displayName
    description
    riskLevel
    riskDescription
    ports {
      protocol
      portStart
      portEnd
    }
  }
}
    `;

/**
 * __useListServicesQuery__
 *
 * To run a query within a React component, call `useListServicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useListServicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListServicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useListServicesQuery(baseOptions?: Apollo.QueryHookOptions<ListServicesQuery, ListServicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ListServicesQuery, ListServicesQueryVariables>(ListServicesDocument, options);
      }
export function useListServicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ListServicesQuery, ListServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ListServicesQuery, ListServicesQueryVariables>(ListServicesDocument, options);
        }
export function useListServicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ListServicesQuery, ListServicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ListServicesQuery, ListServicesQueryVariables>(ListServicesDocument, options);
        }
export type ListServicesQueryHookResult = ReturnType<typeof useListServicesQuery>;
export type ListServicesLazyQueryHookResult = ReturnType<typeof useListServicesLazyQuery>;
export type ListServicesSuspenseQueryHookResult = ReturnType<typeof useListServicesSuspenseQuery>;
export type ListServicesQueryResult = Apollo.QueryResult<ListServicesQuery, ListServicesQueryVariables>;
export function refetchListServicesQuery(variables?: ListServicesQueryVariables) {
      return { query: ListServicesDocument, variables: variables }
    }
export const GetVmServiceStatusDocument = gql`
    query getVmServiceStatus($serviceId: ID!, $vmId: ID!) {
  getVmServiceStatus(serviceId: $serviceId, vmId: $vmId) {
    vmId
    vmName
    serviceId
    serviceName
    useEnabled
    provideEnabled
    running
    lastSeen
  }
}
    `;

/**
 * __useGetVmServiceStatusQuery__
 *
 * To run a query within a React component, call `useGetVmServiceStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmServiceStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmServiceStatusQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *      vmId: // value for 'vmId'
 *   },
 * });
 */
export function useGetVmServiceStatusQuery(baseOptions: Apollo.QueryHookOptions<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables> & ({ variables: GetVmServiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>(GetVmServiceStatusDocument, options);
      }
export function useGetVmServiceStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>(GetVmServiceStatusDocument, options);
        }
export function useGetVmServiceStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>(GetVmServiceStatusDocument, options);
        }
export type GetVmServiceStatusQueryHookResult = ReturnType<typeof useGetVmServiceStatusQuery>;
export type GetVmServiceStatusLazyQueryHookResult = ReturnType<typeof useGetVmServiceStatusLazyQuery>;
export type GetVmServiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetVmServiceStatusSuspenseQuery>;
export type GetVmServiceStatusQueryResult = Apollo.QueryResult<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>;
export function refetchGetVmServiceStatusQuery(variables: GetVmServiceStatusQueryVariables) {
      return { query: GetVmServiceStatusDocument, variables: variables }
    }
export const GetDepartmentServiceStatusDocument = gql`
    query getDepartmentServiceStatus($serviceId: ID!, $departmentId: ID!) {
  getDepartmentServiceStatus(serviceId: $serviceId, departmentId: $departmentId) {
    departmentId
    departmentName
    serviceId
    serviceName
    useEnabled
    provideEnabled
    vmCount
    enabledVmCount
  }
}
    `;

/**
 * __useGetDepartmentServiceStatusQuery__
 *
 * To run a query within a React component, call `useGetDepartmentServiceStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDepartmentServiceStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDepartmentServiceStatusQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useGetDepartmentServiceStatusQuery(baseOptions: Apollo.QueryHookOptions<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables> & ({ variables: GetDepartmentServiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>(GetDepartmentServiceStatusDocument, options);
      }
export function useGetDepartmentServiceStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>(GetDepartmentServiceStatusDocument, options);
        }
export function useGetDepartmentServiceStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>(GetDepartmentServiceStatusDocument, options);
        }
export type GetDepartmentServiceStatusQueryHookResult = ReturnType<typeof useGetDepartmentServiceStatusQuery>;
export type GetDepartmentServiceStatusLazyQueryHookResult = ReturnType<typeof useGetDepartmentServiceStatusLazyQuery>;
export type GetDepartmentServiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetDepartmentServiceStatusSuspenseQuery>;
export type GetDepartmentServiceStatusQueryResult = Apollo.QueryResult<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>;
export function refetchGetDepartmentServiceStatusQuery(variables: GetDepartmentServiceStatusQueryVariables) {
      return { query: GetDepartmentServiceStatusDocument, variables: variables }
    }
export const GetGlobalServiceStatusDocument = gql`
    query getGlobalServiceStatus($serviceId: ID!) {
  getGlobalServiceStatus(serviceId: $serviceId) {
    serviceId
    serviceName
    useEnabled
    provideEnabled
  }
}
    `;

/**
 * __useGetGlobalServiceStatusQuery__
 *
 * To run a query within a React component, call `useGetGlobalServiceStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGlobalServiceStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGlobalServiceStatusQuery({
 *   variables: {
 *      serviceId: // value for 'serviceId'
 *   },
 * });
 */
export function useGetGlobalServiceStatusQuery(baseOptions: Apollo.QueryHookOptions<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables> & ({ variables: GetGlobalServiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>(GetGlobalServiceStatusDocument, options);
      }
export function useGetGlobalServiceStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>(GetGlobalServiceStatusDocument, options);
        }
export function useGetGlobalServiceStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>(GetGlobalServiceStatusDocument, options);
        }
export type GetGlobalServiceStatusQueryHookResult = ReturnType<typeof useGetGlobalServiceStatusQuery>;
export type GetGlobalServiceStatusLazyQueryHookResult = ReturnType<typeof useGetGlobalServiceStatusLazyQuery>;
export type GetGlobalServiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetGlobalServiceStatusSuspenseQuery>;
export type GetGlobalServiceStatusQueryResult = Apollo.QueryResult<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>;
export function refetchGetGlobalServiceStatusQuery(variables: GetGlobalServiceStatusQueryVariables) {
      return { query: GetGlobalServiceStatusDocument, variables: variables }
    }
export const GetServiceStatusSummaryDocument = gql`
    query getServiceStatusSummary {
  getServiceStatusSummary {
    serviceId
    serviceName
    totalVms
    runningVms
    enabledVms
  }
}
    `;

/**
 * __useGetServiceStatusSummaryQuery__
 *
 * To run a query within a React component, call `useGetServiceStatusSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetServiceStatusSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetServiceStatusSummaryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetServiceStatusSummaryQuery(baseOptions?: Apollo.QueryHookOptions<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>(GetServiceStatusSummaryDocument, options);
      }
export function useGetServiceStatusSummaryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>(GetServiceStatusSummaryDocument, options);
        }
export function useGetServiceStatusSummarySuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>(GetServiceStatusSummaryDocument, options);
        }
export type GetServiceStatusSummaryQueryHookResult = ReturnType<typeof useGetServiceStatusSummaryQuery>;
export type GetServiceStatusSummaryLazyQueryHookResult = ReturnType<typeof useGetServiceStatusSummaryLazyQuery>;
export type GetServiceStatusSummarySuspenseQueryHookResult = ReturnType<typeof useGetServiceStatusSummarySuspenseQuery>;
export type GetServiceStatusSummaryQueryResult = Apollo.QueryResult<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>;
export function refetchGetServiceStatusSummaryQuery(variables?: GetServiceStatusSummaryQueryVariables) {
      return { query: GetServiceStatusSummaryDocument, variables: variables }
    }