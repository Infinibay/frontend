import { gql } from '@apollo/client';
import * as ApolloReactCommon from '@apollo/client';
import * as ApolloReactHooks from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
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

export type AdvancedPortInput = {
  /** Description of the port configuration */
  description: InputMaybe<Scalars['String']['input']>;
  /** Type of port configuration */
  type: PortInputType;
  /** Port specification string */
  value: Scalars['String']['input'];
};

export type AppSettings = {
  __typename?: 'AppSettings';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  interfaceSize: Scalars['String']['output'];
  logoUrl: Maybe<Scalars['String']['output']>;
  theme: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  wallpaper: Scalars['String']['output'];
};

export type AppSettingsInput = {
  interfaceSize: InputMaybe<Scalars['String']['input']>;
  logoUrl: InputMaybe<Scalars['String']['input']>;
  theme: InputMaybe<Scalars['String']['input']>;
  wallpaper: InputMaybe<Scalars['String']['input']>;
};

export type ApplicationInfo = {
  __typename?: 'ApplicationInfo';
  installDate: Maybe<Scalars['DateTimeISO']['output']>;
  installLocation: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  publisher: Maybe<Scalars['String']['output']>;
  sizeInMB: Maybe<Scalars['Float']['output']>;
  version: Maybe<Scalars['String']['output']>;
};

export type ApplicationInventory = {
  __typename?: 'ApplicationInventory';
  applications: Array<ApplicationInfo>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  totalCount: Scalars['Int']['output'];
  vmId: Scalars['ID']['output'];
};

export type ApplicationType = {
  __typename?: 'ApplicationType';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  icon: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  installCommand: Scalars['JSONObject']['output'];
  name: Scalars['String']['output'];
  os: Array<Scalars['String']['output']>;
  parameters: Maybe<Scalars['JSONObject']['output']>;
};

export type ApplicationUpdateInfo = {
  __typename?: 'ApplicationUpdateInfo';
  applicationName: Scalars['String']['output'];
  availableVersion: Scalars['String']['output'];
  canUpdate: Scalars['Boolean']['output'];
  currentVersion: Scalars['String']['output'];
  downloadUrl: Maybe<Scalars['String']['output']>;
  installDate: Maybe<Scalars['DateTimeISO']['output']>;
  installLocation: Maybe<Scalars['String']['output']>;
  installType: Maybe<Scalars['String']['output']>;
  isSecurityUpdate: Scalars['Boolean']['output'];
  lastUpdateCheck: Maybe<Scalars['DateTimeISO']['output']>;
  registryKey: Maybe<Scalars['String']['output']>;
  releaseDate: Maybe<Scalars['DateTimeISO']['output']>;
  sizeInMB: Maybe<Scalars['Float']['output']>;
  updateSizeBytes: Maybe<Scalars['Float']['output']>;
  updateSource: Maybe<Scalars['String']['output']>;
  updateType: Maybe<Scalars['String']['output']>;
  vendor: Maybe<Scalars['String']['output']>;
};

export type ApplicationUpdates = {
  __typename?: 'ApplicationUpdates';
  availableUpdates: Array<ApplicationUpdateInfo>;
  error: Maybe<Scalars['String']['output']>;
  executionTimeMs: Maybe<Scalars['Int']['output']>;
  microsoftStoreUpdatesCount: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
  summary: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTimeISO']['output'];
  totalUpdatesCount: Scalars['Int']['output'];
  vmId: Scalars['ID']['output'];
  windowsUpdatesCount: Maybe<Scalars['Int']['output']>;
};

export type ApplyDepartmentTemplateInput = {
  departmentId: Scalars['ID']['input'];
  templateFilterId: Scalars['ID']['input'];
};

export type ApplyFirewallTemplateInput = {
  /** Virtual machine ID */
  machineId: Scalars['ID']['input'];
  /** Firewall template to apply */
  template: FirewallTemplate;
};

export type BackgroundHealthServiceStatus = {
  __typename?: 'BackgroundHealthServiceStatus';
  activeQueues: Scalars['Int']['output'];
  cronActive: Scalars['Boolean']['output'];
  isRunning: Scalars['Boolean']['output'];
  lastRun: Scalars['DateTimeISO']['output'];
  nextRun: Maybe<Scalars['DateTimeISO']['output']>;
  pendingChecks: Scalars['Int']['output'];
  totalVMsMonitored: Scalars['Int']['output'];
};

export type BridgeNameInput = {
  bridgeName: Scalars['String']['input'];
  networkName: Scalars['String']['input'];
};

export type CommandExecutionResponseType = {
  __typename?: 'CommandExecutionResponseType';
  message: Scalars['String']['output'];
  response: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

/** Generic command execution result */
export type CommandResult = {
  __typename?: 'CommandResult';
  /** Error message if command failed */
  error: Maybe<Scalars['String']['output']>;
  /** Command output */
  output: Maybe<Scalars['String']['output']>;
  /** Standard error */
  stderr: Maybe<Scalars['String']['output']>;
  /** Standard output */
  stdout: Maybe<Scalars['String']['output']>;
  /** Whether the command was successful */
  success: Scalars['Boolean']['output'];
};

export type CreateAdvancedFirewallRuleInput = {
  /** Firewall action (accept, drop, reject) */
  action: Scalars['String']['input'];
  /** Optional rule description */
  description: InputMaybe<Scalars['String']['input']>;
  /** Traffic direction (in, out, inout) */
  direction: Scalars['String']['input'];
  /** Virtual machine ID */
  machineId: Scalars['ID']['input'];
  /** Advanced port configuration */
  ports: AdvancedPortInput;
  /** Network protocol (tcp, udp, icmp) */
  protocol: Scalars['String']['input'];
};

export type CreateApplicationInputType = {
  description: InputMaybe<Scalars['String']['input']>;
  installCommand: Scalars['JSONObject']['input'];
  name: Scalars['String']['input'];
  os: Array<Scalars['String']['input']>;
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CreateFilterInput = {
  chain: InputMaybe<Scalars['String']['input']>;
  departmentId: InputMaybe<Scalars['ID']['input']>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  type: InputMaybe<FilterType>;
};

export type CreateFilterRuleInput = {
  action: Scalars['String']['input'];
  comment: InputMaybe<Scalars['String']['input']>;
  direction: Scalars['String']['input'];
  dstPortEnd: InputMaybe<Scalars['Int']['input']>;
  dstPortStart: InputMaybe<Scalars['Int']['input']>;
  filterId: Scalars['String']['input'];
  ipVersion: InputMaybe<Scalars['String']['input']>;
  priority: Scalars['Int']['input'];
  protocol: InputMaybe<Scalars['String']['input']>;
  srcPortEnd: InputMaybe<Scalars['Int']['input']>;
  srcPortStart: InputMaybe<Scalars['Int']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
};

export type CreateMachineInputType = {
  applications: Array<MachineApplicationInputType>;
  customCores: InputMaybe<Scalars['Int']['input']>;
  customRam: InputMaybe<Scalars['Int']['input']>;
  customStorage: InputMaybe<Scalars['Int']['input']>;
  departmentId: InputMaybe<Scalars['ID']['input']>;
  name: Scalars['String']['input'];
  os: MachineOs;
  password: Scalars['String']['input'];
  pciBus: InputMaybe<Scalars['String']['input']>;
  productKey: InputMaybe<Scalars['String']['input']>;
  templateId: InputMaybe<Scalars['String']['input']>;
  username: Scalars['String']['input'];
};

export type CreateMaintenanceTaskInput = {
  cronSchedule: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  isEnabled: Scalars['Boolean']['input'];
  isRecurring: Scalars['Boolean']['input'];
  machineId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
  runAt: InputMaybe<Scalars['DateTimeISO']['input']>;
  taskType: MaintenanceTaskType;
};

export type CreateNetworkInput = {
  bridgeName: Scalars['String']['input'];
  description: Scalars['String']['input'];
  enableIntraNetworkCommunication: InputMaybe<Scalars['Boolean']['input']>;
  enabledServices: InputMaybe<Array<Scalars['String']['input']>>;
  ipConfig: InputMaybe<NetworkIpConfigInput>;
  name: Scalars['String']['input'];
};

export type CreateSimplifiedFirewallRuleInput = {
  /** Firewall action (accept, drop, reject) */
  action: Scalars['String']['input'];
  /** Optional rule description */
  description: InputMaybe<Scalars['String']['input']>;
  /** Traffic direction (in, out, inout) */
  direction: Scalars['String']['input'];
  /** Virtual machine ID */
  machineId: Scalars['ID']['input'];
  /** Port specification (e.g., "80", "443", "all") */
  port: Scalars['String']['input'];
  /** Network protocol (tcp, udp, icmp) */
  protocol: Scalars['String']['input'];
};

export type CreateSnapshotInput = {
  description: InputMaybe<Scalars['String']['input']>;
  machineId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateUserInputType = {
  /** User avatar image path */
  avatar: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirmation: Scalars['String']['input'];
  role: UserRole;
};

export type DefenderScanResult = {
  __typename?: 'DefenderScanResult';
  error: Maybe<Scalars['String']['output']>;
  filesScanned: Scalars['Int']['output'];
  scanDuration: Scalars['Float']['output'];
  scanType: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  threatsFound: Scalars['Int']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type DeleteNetworkInput = {
  name: Scalars['String']['input'];
};

export type DeleteSnapshotInput = {
  machineId: Scalars['String']['input'];
  snapshotName: Scalars['String']['input'];
};

export type DepartmentFirewallState = {
  __typename?: 'DepartmentFirewallState';
  appliedTemplates: Array<Scalars['String']['output']>;
  customRules: Array<FwRule>;
  departmentId: Scalars['ID']['output'];
  effectiveRules: Array<FwRule>;
  lastSync: Scalars['DateTimeISO']['output'];
  vmCount: Scalars['Int']['output'];
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
  internetSpeed: Maybe<Scalars['Int']['output']>;
  ipSubnet: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  totalMachines: Maybe<Scalars['Float']['output']>;
};

export type DiskCleanupResult = {
  __typename?: 'DiskCleanupResult';
  drive: Scalars['String']['output'];
  error: Maybe<Scalars['String']['output']>;
  filesDeleted: Scalars['Int']['output'];
  spaceClearedMB: Scalars['Float']['output'];
  success: Scalars['Boolean']['output'];
  targetsProcessed: Array<Scalars['String']['output']>;
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type DiskDriveInfo = {
  __typename?: 'DiskDriveInfo';
  drive: Scalars['String']['output'];
  freeGB: Scalars['Float']['output'];
  label: Scalars['String']['output'];
  status: HealthCheckSeverity;
  totalGB: Scalars['Float']['output'];
  usedGB: Scalars['Float']['output'];
  usedPercent: Scalars['Float']['output'];
};

export type DiskSpaceInfo = {
  __typename?: 'DiskSpaceInfo';
  criticalThreshold: Maybe<Scalars['Float']['output']>;
  drives: Array<DiskDriveInfo>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
  warningThreshold: Maybe<Scalars['Float']['output']>;
};

export type DyummyType = {
  __typename?: 'DyummyType';
  value: Scalars['String']['output'];
};

export type ExecuteMaintenanceInput = {
  machineId: Scalars['ID']['input'];
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
  taskType: MaintenanceTaskType;
};

export type FwRule = {
  __typename?: 'FWRule';
  action: Scalars['String']['output'];
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Maybe<Scalars['DateTimeISO']['output']>;
  direction: Scalars['String']['output'];
  dstIpAddr: Maybe<Scalars['String']['output']>;
  dstIpMask: Maybe<Scalars['String']['output']>;
  dstPortEnd: Maybe<Scalars['Int']['output']>;
  dstPortStart: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  ipVersion: Maybe<Scalars['String']['output']>;
  priority: Scalars['Int']['output'];
  protocol: Scalars['String']['output'];
  srcIpAddr: Maybe<Scalars['String']['output']>;
  srcIpMask: Maybe<Scalars['String']['output']>;
  srcMacAddr: Maybe<Scalars['String']['output']>;
  srcPortEnd: Maybe<Scalars['Int']['output']>;
  srcPortStart: Maybe<Scalars['Int']['output']>;
  state: Maybe<Scalars['JSONObject']['output']>;
  updatedAt: Maybe<Scalars['DateTimeISO']['output']>;
};

/** Type of network filter */
export enum FilterType {
  Department = 'DEPARTMENT',
  Generic = 'GENERIC',
  Vm = 'VM'
}

/** Predefined firewall template configurations for common use cases */
export enum FirewallTemplate {
  Database = 'DATABASE',
  Desktop = 'DESKTOP',
  Development = 'DEVELOPMENT',
  WebServer = 'WEB_SERVER'
}

export type FirewallTemplateInfo = {
  __typename?: 'FirewallTemplateInfo';
  /** Human-readable template description */
  description: Scalars['String']['output'];
  /** Template name identifier */
  name: Scalars['String']['output'];
  /** List of rules included in this template */
  rules: Array<SimplifiedFirewallRule>;
  /** Template identifier (e.g., WEB_SERVER, DATABASE) */
  template: Scalars['String']['output'];
};

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
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  references: Array<Scalars['String']['output']>;
  rules: Maybe<Array<FwRule>>;
  type: FilterType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GenericHealthCheckResponse = {
  __typename?: 'GenericHealthCheckResponse';
  checkName: Scalars['String']['output'];
  details: Maybe<Scalars['String']['output']>;
  error: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  severity: HealthCheckSeverity;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
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

/** Available health check types that can be executed individually */
export enum HealthCheckName {
  ApplicationHealth = 'APPLICATION_HEALTH',
  BootTime = 'BOOT_TIME',
  CpuUsage = 'CPU_USAGE',
  CriticalServices = 'CRITICAL_SERVICES',
  DiskFragmentation = 'DISK_FRAGMENTATION',
  DiskHealth = 'DISK_HEALTH',
  DiskSpace = 'DISK_SPACE',
  EventLogErrors = 'EVENT_LOG_ERRORS',
  FirewallStatus = 'FIREWALL_STATUS',
  MemoryUsage = 'MEMORY_USAGE',
  NetworkConnectivity = 'NETWORK_CONNECTIVITY',
  PerformanceCounters = 'PERFORMANCE_COUNTERS',
  RegistryHealth = 'REGISTRY_HEALTH',
  ResourceOptimization = 'RESOURCE_OPTIMIZATION',
  SecurityUpdates = 'SECURITY_UPDATES',
  StartupPrograms = 'STARTUP_PROGRAMS',
  SystemFiles = 'SYSTEM_FILES',
  SystemTemperature = 'SYSTEM_TEMPERATURE',
  UpdateServices = 'UPDATE_SERVICES',
  WindowsDefender = 'WINDOWS_DEFENDER',
  WindowsUpdates = 'WINDOWS_UPDATES'
}

export type HealthCheckResult = {
  __typename?: 'HealthCheckResult';
  checkName: Scalars['String']['output'];
  details: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  severity: HealthCheckSeverity;
  timestamp: Scalars['DateTimeISO']['output'];
};

export type HealthCheckRoundResult = {
  __typename?: 'HealthCheckRoundResult';
  error: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  taskId: Scalars['String']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
};

/** Severity level of health check results */
export enum HealthCheckSeverity {
  Failed = 'FAILED',
  Info = 'INFO',
  Passed = 'PASSED',
  Warning = 'WARNING'
}

export type HealthCheckStatus = {
  __typename?: 'HealthCheckStatus';
  checks: Array<HealthCheckResult>;
  error: Maybe<Scalars['String']['output']>;
  overallScore: Scalars['Float']['output'];
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type Iso = {
  __typename?: 'ISO';
  checksum: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  downloadUrl: Maybe<Scalars['String']['output']>;
  filename: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isAvailable: Scalars['Boolean']['output'];
  lastVerified: Maybe<Scalars['DateTimeISO']['output']>;
  os: Scalars['String']['output'];
  path: Scalars['String']['output'];
  size: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  uploadedAt: Scalars['DateTimeISO']['output'];
  version: Maybe<Scalars['String']['output']>;
};

export type IsoAvailabilityMap = {
  __typename?: 'ISOAvailabilityMap';
  available: Scalars['Boolean']['output'];
  os: Scalars['String']['output'];
};

export type IsoStatus = {
  __typename?: 'ISOStatus';
  available: Scalars['Boolean']['output'];
  iso: Maybe<Iso>;
  os: Scalars['String']['output'];
};

export type InfiniServiceStatus = {
  __typename?: 'InfiniServiceStatus';
  error: Maybe<Scalars['String']['output']>;
  installed: Scalars['Boolean']['output'];
  running: Scalars['Boolean']['output'];
};

export type IpRangeInput = {
  end: Scalars['String']['input'];
  networkName: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

/** Login response with user data and token */
export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
  user: UserType;
};

export type Machine = {
  __typename?: 'Machine';
  configuration: Maybe<Scalars['JSONObject']['output']>;
  cpuCores: Maybe<Scalars['Int']['output']>;
  createdAt: Maybe<Scalars['DateTimeISO']['output']>;
  department: Maybe<DepartmentType>;
  departmentId: Maybe<Scalars['String']['output']>;
  diskSizeGB: Maybe<Scalars['Int']['output']>;
  gpuPciAddress: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internalName: Scalars['String']['output'];
  localIP: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  os: Scalars['String']['output'];
  publicIP: Maybe<Scalars['String']['output']>;
  ramGB: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  template: Maybe<MachineTemplateType>;
  templateId: Maybe<Scalars['String']['output']>;
  user: Maybe<UserType>;
  userId: Maybe<Scalars['String']['output']>;
};

export type MachineApplicationInputType = {
  applicationId: Scalars['String']['input'];
  machineId: Scalars['String']['input'];
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
};

export type MachineOrderBy = {
  direction: InputMaybe<OrderByDirection>;
  fieldName: InputMaybe<MachineOrderByField>;
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
  description: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type MachineTemplateCategoryType = {
  __typename?: 'MachineTemplateCategoryType';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  totalMachines: Maybe<Scalars['Int']['output']>;
  totalTemplates: Maybe<Scalars['Int']['output']>;
};

export type MachineTemplateInputType = {
  /** The ID of the category for the machine template */
  categoryId: InputMaybe<Scalars['ID']['input']>;
  /** The number of cores for the machine */
  cores: Scalars['Int']['input'];
  /** A brief description of the machine template */
  description: Scalars['String']['input'];
  /** The name of the machine template */
  name: Scalars['String']['input'];
  /** The amount of RAM (in GB) for the machine */
  ram: Scalars['Int']['input'];
  /** The storage space (in GB) for the machine */
  storage: Scalars['Int']['input'];
};

export type MachineTemplateOrderBy = {
  direction: InputMaybe<OrderByDirection>;
  fieldName: InputMaybe<MachineTemplateOrderByField>;
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
  categoryId: Maybe<Scalars['ID']['output']>;
  cores: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Maybe<Scalars['String']['output']>;
  ram: Scalars['Int']['output'];
  storage: Scalars['Int']['output'];
  totalMachines: Maybe<Scalars['Int']['output']>;
};

export type MaintenanceExecutionResponse = {
  __typename?: 'MaintenanceExecutionResponse';
  error: Maybe<Scalars['String']['output']>;
  execution: Maybe<MaintenanceHistory>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MaintenanceHistory = {
  __typename?: 'MaintenanceHistory';
  duration: Maybe<Scalars['Float']['output']>;
  error: Maybe<Scalars['String']['output']>;
  executedAt: Scalars['DateTimeISO']['output'];
  executedByUserId: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  machineId: Scalars['ID']['output'];
  parameters: Maybe<Scalars['JSONObject']['output']>;
  result: Maybe<Scalars['JSONObject']['output']>;
  status: MaintenanceStatus;
  taskId: Maybe<Scalars['ID']['output']>;
  taskType: MaintenanceTaskType;
  triggeredBy: MaintenanceTrigger;
};

export type MaintenanceStats = {
  __typename?: 'MaintenanceStats';
  enabledTasks: Scalars['Float']['output'];
  failedExecutions: Scalars['Float']['output'];
  lastExecutionDate: Maybe<Scalars['DateTimeISO']['output']>;
  machineId: Scalars['ID']['output'];
  pendingTasks: Scalars['Float']['output'];
  recurringTasks: Scalars['Float']['output'];
  successfulExecutions: Scalars['Float']['output'];
  totalExecutions: Scalars['Float']['output'];
  totalTasks: Scalars['Float']['output'];
};

/** Status of maintenance task execution */
export enum MaintenanceStatus {
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Running = 'RUNNING',
  Success = 'SUCCESS',
  Timeout = 'TIMEOUT'
}

export type MaintenanceTask = {
  __typename?: 'MaintenanceTask';
  createdAt: Scalars['DateTimeISO']['output'];
  createdByUserId: Scalars['ID']['output'];
  cronSchedule: Maybe<Scalars['String']['output']>;
  description: Maybe<Scalars['String']['output']>;
  executionStatus: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  isRecurring: Scalars['Boolean']['output'];
  lastRunAt: Maybe<Scalars['DateTimeISO']['output']>;
  machineId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nextRunAt: Maybe<Scalars['DateTimeISO']['output']>;
  parameters: Maybe<Scalars['JSONObject']['output']>;
  runAt: Maybe<Scalars['DateTimeISO']['output']>;
  taskType: MaintenanceTaskType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type MaintenanceTaskResponse = {
  __typename?: 'MaintenanceTaskResponse';
  error: Maybe<Scalars['String']['output']>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  task: Maybe<MaintenanceTask>;
};

/** Types of maintenance tasks that can be performed */
export enum MaintenanceTaskType {
  CustomScript = 'CUSTOM_SCRIPT',
  DefenderScan = 'DEFENDER_SCAN',
  Defrag = 'DEFRAG',
  DiskCheck = 'DISK_CHECK',
  DiskCleanup = 'DISK_CLEANUP',
  RegistryCleanup = 'REGISTRY_CLEANUP',
  SystemFileCheck = 'SYSTEM_FILE_CHECK',
  WindowsUpdates = 'WINDOWS_UPDATES'
}

/** What triggered the maintenance task execution */
export enum MaintenanceTrigger {
  Manual = 'MANUAL',
  Scheduled = 'SCHEDULED'
}

export type Mutation = {
  __typename?: 'Mutation';
  /** Add a filter reference for template application */
  addFilterReference: Scalars['Boolean']['output'];
  applyDepartmentFirewallTemplate: Scalars['Boolean']['output'];
  applyFirewallTemplate: VmFirewallState;
  /** Calculate ISO checksum */
  calculateISOChecksum: Scalars['String']['output'];
  /** Control a service on a virtual machine */
  controlService: ServiceStatusType;
  /** Create advanced firewall rule with flexible port configuration */
  createAdvancedFirewallRule: VmFirewallState;
  createApplication: ApplicationType;
  createDepartment: DepartmentType;
  createDepartmentFirewallRule: FwRule;
  createFilter: GenericFilter;
  createFilterRule: FwRule;
  createMachine: Machine;
  createMachineTemplate: MachineTemplateType;
  createMachineTemplateCategory: MachineTemplateCategoryType;
  createMaintenanceTask: MaintenanceTaskResponse;
  createNetwork: Scalars['Boolean']['output'];
  /** Create firewall rule for a specific port range */
  createPortRangeRule: VmFirewallState;
  createSimplifiedFirewallRule: VmFirewallState;
  /** Create a snapshot of a virtual machine */
  createSnapshot: SnapshotResult;
  createUser: UserType;
  deleteApplication: Scalars['Boolean']['output'];
  deleteDepartmentFirewallRule: Scalars['Boolean']['output'];
  deleteFilter: Scalars['Boolean']['output'];
  deleteFilterRule: Scalars['Boolean']['output'];
  deleteMaintenanceTask: MaintenanceTaskResponse;
  deleteNetwork: Scalars['Boolean']['output'];
  /** Delete a snapshot from a virtual machine */
  deleteSnapshot: SuccessType;
  destroyDepartment: DepartmentType;
  destroyMachine: SuccessType;
  destroyMachineTemplate: Scalars['Boolean']['output'];
  destroyMachineTemplateCategory: Scalars['Boolean']['output'];
  executeCommand: CommandExecutionResponseType;
  executeImmediateMaintenance: MaintenanceExecutionResponse;
  executeMaintenanceTask: MaintenanceExecutionResponse;
  flushDepartmentFirewall: Scalars['Boolean']['output'];
  /** Apply a network filter inmediatly */
  flushFilter: Scalars['Boolean']['output'];
  forcePowerOff: SuccessType;
  /** Force power off and restore snapshot (emergency recovery) */
  forceRestoreSnapshot: SuccessType;
  /** Install a package on a virtual machine (legacy compatibility) */
  installPackage: CommandResult;
  killProcess: ProcessControlResult;
  killProcesses: Array<ProcessControlResult>;
  login: Maybe<LoginResponse>;
  /** Install, remove, or update a package on a virtual machine */
  managePackage: PackageManagementResult;
  moveMachine: Machine;
  /** Perform disk cleanup on a VM */
  performDiskCleanup: DiskCleanupResult;
  powerOff: SuccessType;
  powerOn: SuccessType;
  queueAllVMHealthChecks: HealthCheckRoundResult;
  refreshDepartmentVMFilters: Scalars['Boolean']['output'];
  /** Register uploaded ISO */
  registerISO: Iso;
  removeDepartmentFirewallTemplate: Scalars['Boolean']['output'];
  /** Remove a filter reference */
  removeFilterReference: Scalars['Boolean']['output'];
  removeFirewallTemplate: VmFirewallState;
  /** Remove ISO file */
  removeISO: Scalars['Boolean']['output'];
  /** Remove a package from a virtual machine (legacy compatibility) */
  removePackage: CommandResult;
  removeSimplifiedFirewallRule: VmFirewallState;
  resetMachine: SuccessType;
  restartMachine: SuccessType;
  /** Restore a virtual machine to a snapshot */
  restoreSnapshot: SuccessType;
  /** Run Windows Defender quick scan on a VM */
  runDefenderQuickScan: DefenderScanResult;
  setNetworkBridgeName: Scalars['Boolean']['output'];
  setNetworkIp: Scalars['Boolean']['output'];
  setNetworkIpRange: Scalars['Boolean']['output'];
  setupNode: DyummyType;
  suspend: SuccessType;
  /** Sync ISOs with filesystem */
  syncISOs: Scalars['Boolean']['output'];
  toggleDepartmentFirewallTemplate: Scalars['Boolean']['output'];
  toggleDepartmentService: DepartmentServiceStatus;
  toggleFirewallTemplate: VmFirewallState;
  toggleGlobalService: GlobalServiceStatus;
  toggleMaintenanceTask: MaintenanceTaskResponse;
  toggleVmService: VmServiceStatus;
  triggerHealthCheckRound: HealthCheckRoundResult;
  updateAppSettings: AppSettings;
  updateApplication: ApplicationType;
  updateDepartmentFirewallRule: FwRule;
  updateDepartmentName: DepartmentType;
  updateFilter: GenericFilter;
  updateFilterRule: FwRule;
  updateMachineHardware: Machine;
  updateMachineName: Machine;
  updateMachineTemplate: MachineTemplateType;
  updateMachineTemplateCategory: MachineTemplateCategoryType;
  updateMachineUser: Machine;
  updateMaintenanceTask: MaintenanceTaskResponse;
  /** Update a package on a virtual machine (legacy compatibility) */
  updatePackage: CommandResult;
  updateUser: UserType;
  /** Validate ISO file integrity */
  validateISO: Scalars['Boolean']['output'];
};


export type MutationAddFilterReferenceArgs = {
  sourceFilterId: Scalars['ID']['input'];
  targetFilterId: Scalars['ID']['input'];
};


export type MutationApplyDepartmentFirewallTemplateArgs = {
  input: ApplyDepartmentTemplateInput;
};


export type MutationApplyFirewallTemplateArgs = {
  input: ApplyFirewallTemplateInput;
};


export type MutationCalculateIsoChecksumArgs = {
  isoId: Scalars['String']['input'];
};


export type MutationControlServiceArgs = {
  input: ServiceControlInput;
};


export type MutationCreateAdvancedFirewallRuleArgs = {
  input: CreateAdvancedFirewallRuleInput;
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInputType;
};


export type MutationCreateDepartmentArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateDepartmentFirewallRuleArgs = {
  departmentId: Scalars['ID']['input'];
  input: CreateFilterRuleInput;
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


export type MutationCreateMaintenanceTaskArgs = {
  input: CreateMaintenanceTaskInput;
};


export type MutationCreateNetworkArgs = {
  input: CreateNetworkInput;
};


export type MutationCreatePortRangeRuleArgs = {
  action?: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  direction?: Scalars['String']['input'];
  endPort: Scalars['Int']['input'];
  machineId: Scalars['ID']['input'];
  protocol?: Scalars['String']['input'];
  startPort: Scalars['Int']['input'];
};


export type MutationCreateSimplifiedFirewallRuleArgs = {
  input: CreateSimplifiedFirewallRuleInput;
};


export type MutationCreateSnapshotArgs = {
  input: CreateSnapshotInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInputType;
};


export type MutationDeleteApplicationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteDepartmentFirewallRuleArgs = {
  ruleId: Scalars['ID']['input'];
};


export type MutationDeleteFilterArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteFilterRuleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteMaintenanceTaskArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteNetworkArgs = {
  input: DeleteNetworkInput;
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
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


export type MutationExecuteImmediateMaintenanceArgs = {
  input: ExecuteMaintenanceInput;
};


export type MutationExecuteMaintenanceTaskArgs = {
  taskId: Scalars['ID']['input'];
};


export type MutationFlushDepartmentFirewallArgs = {
  departmentId: Scalars['ID']['input'];
};


export type MutationFlushFilterArgs = {
  filterId: Scalars['ID']['input'];
};


export type MutationForcePowerOffArgs = {
  id: Scalars['String']['input'];
};


export type MutationForceRestoreSnapshotArgs = {
  input: RestoreSnapshotInput;
};


export type MutationInstallPackageArgs = {
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
};


export type MutationKillProcessArgs = {
  force?: Scalars['Boolean']['input'];
  machineId: Scalars['String']['input'];
  pid: Scalars['Int']['input'];
};


export type MutationKillProcessesArgs = {
  force?: Scalars['Boolean']['input'];
  machineId: Scalars['String']['input'];
  pids: Array<Scalars['Int']['input']>;
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationManagePackageArgs = {
  input: PackageManagementInput;
};


export type MutationMoveMachineArgs = {
  departmentId: Scalars['String']['input'];
  id: Scalars['String']['input'];
};


export type MutationPerformDiskCleanupArgs = {
  drive: Scalars['String']['input'];
  targets: InputMaybe<Array<Scalars['String']['input']>>;
  vmId: Scalars['ID']['input'];
};


export type MutationPowerOffArgs = {
  id: Scalars['String']['input'];
};


export type MutationPowerOnArgs = {
  id: Scalars['String']['input'];
};


export type MutationRefreshDepartmentVmFiltersArgs = {
  departmentId: Scalars['ID']['input'];
};


export type MutationRegisterIsoArgs = {
  filename: Scalars['String']['input'];
  os: Scalars['String']['input'];
  path: Scalars['String']['input'];
  size: Scalars['Float']['input'];
};


export type MutationRemoveDepartmentFirewallTemplateArgs = {
  departmentId: Scalars['ID']['input'];
  templateFilterId: Scalars['ID']['input'];
};


export type MutationRemoveFilterReferenceArgs = {
  sourceFilterId: Scalars['ID']['input'];
  targetFilterId: Scalars['ID']['input'];
};


export type MutationRemoveFirewallTemplateArgs = {
  machineId: Scalars['ID']['input'];
  template: FirewallTemplate;
};


export type MutationRemoveIsoArgs = {
  isoId: Scalars['String']['input'];
};


export type MutationRemovePackageArgs = {
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
};


export type MutationRemoveSimplifiedFirewallRuleArgs = {
  machineId: Scalars['ID']['input'];
  ruleId: Scalars['ID']['input'];
};


export type MutationResetMachineArgs = {
  id: Scalars['String']['input'];
};


export type MutationRestartMachineArgs = {
  id: Scalars['String']['input'];
};


export type MutationRestoreSnapshotArgs = {
  input: RestoreSnapshotInput;
};


export type MutationRunDefenderQuickScanArgs = {
  vmId: Scalars['ID']['input'];
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


export type MutationToggleDepartmentFirewallTemplateArgs = {
  departmentId: Scalars['ID']['input'];
  templateFilterId: Scalars['ID']['input'];
};


export type MutationToggleDepartmentServiceArgs = {
  input: ToggleDepartmentServiceInput;
};


export type MutationToggleFirewallTemplateArgs = {
  machineId: Scalars['ID']['input'];
  template: FirewallTemplate;
};


export type MutationToggleGlobalServiceArgs = {
  input: ToggleServiceInput;
};


export type MutationToggleMaintenanceTaskArgs = {
  enabled: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationToggleVmServiceArgs = {
  input: ToggleVmServiceInput;
};


export type MutationUpdateAppSettingsArgs = {
  input: AppSettingsInput;
};


export type MutationUpdateApplicationArgs = {
  id: Scalars['String']['input'];
  input: CreateApplicationInputType;
};


export type MutationUpdateDepartmentFirewallRuleArgs = {
  input: UpdateFilterRuleInput;
  ruleId: Scalars['ID']['input'];
};


export type MutationUpdateDepartmentNameArgs = {
  input: UpdateDepartmentNameInput;
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


export type MutationUpdateMachineNameArgs = {
  input: UpdateMachineNameInput;
};


export type MutationUpdateMachineTemplateArgs = {
  id: Scalars['String']['input'];
  input: MachineTemplateInputType;
};


export type MutationUpdateMachineTemplateCategoryArgs = {
  id: Scalars['String']['input'];
  input: MachineTemplateCategoryInputType;
};


export type MutationUpdateMachineUserArgs = {
  input: UpdateMachineUserInput;
};


export type MutationUpdateMaintenanceTaskArgs = {
  input: UpdateMaintenanceTaskInput;
};


export type MutationUpdatePackageArgs = {
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
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
  description: Maybe<Scalars['String']['output']>;
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
  end: Scalars['String']['input'];
  start: Scalars['String']['input'];
};

export type NetworkIp = {
  __typename?: 'NetworkIp';
  address: Scalars['String']['output'];
  dhcp: Maybe<NetworkDhcp>;
  netmask: Scalars['String']['output'];
};

export type NetworkIpConfigInput = {
  address: Scalars['String']['input'];
  dhcp: InputMaybe<NetworkDhcpRangeInput>;
  netmask: Scalars['String']['input'];
};

export type NetworkIpInput = {
  address: Scalars['String']['input'];
  netmask: Scalars['String']['input'];
  networkName: Scalars['String']['input'];
};

export enum OrderByDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Available package management actions */
export enum PackageAction {
  Install = 'INSTALL',
  Remove = 'REMOVE',
  Update = 'UPDATE'
}

/** Information about a software package */
export type PackageInfo = {
  __typename?: 'PackageInfo';
  /** Package description */
  description: Maybe<Scalars['String']['output']>;
  /** Whether the package is installed */
  installed: Scalars['Boolean']['output'];
  /** Package name */
  name: Scalars['String']['output'];
  /** Package publisher or vendor */
  publisher: Maybe<Scalars['String']['output']>;
  /** Package source or repository */
  source: Maybe<Scalars['String']['output']>;
  /** Package version */
  version: Scalars['String']['output'];
};

/** Input for package management operations */
export type PackageManagementInput = {
  /** Action to perform on the package */
  action: PackageAction;
  /** ID of the target machine */
  machineId: Scalars['ID']['input'];
  /** Name of the package to manage */
  packageName: Scalars['String']['input'];
};

/** Result of a package management operation */
export type PackageManagementResult = {
  __typename?: 'PackageManagementResult';
  /** Error message if operation failed */
  error: Maybe<Scalars['String']['output']>;
  /** Human-readable message about the operation */
  message: Scalars['String']['output'];
  /** List of packages (for list operations) */
  packages: Maybe<Array<PackageInfo>>;
  /** Standard error from the command */
  stderr: Maybe<Scalars['String']['output']>;
  /** Standard output from the command */
  stdout: Maybe<Scalars['String']['output']>;
  /** Whether the operation was successful */
  success: Scalars['Boolean']['output'];
};

export type PaginationInputType = {
  skip: InputMaybe<Scalars['Int']['input']>;
  take: InputMaybe<Scalars['Int']['input']>;
};

/** Types of port configurations supported in advanced firewall rules */
export enum PortInputType {
  All = 'ALL',
  Multiple = 'MULTIPLE',
  Range = 'RANGE',
  Single = 'SINGLE'
}

export type ProcessControlResult = {
  __typename?: 'ProcessControlResult';
  error: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  pid: Maybe<Scalars['Int']['output']>;
  processName: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get all ISOs (available and unavailable) */
  allISOs: Array<Iso>;
  application: Maybe<ApplicationType>;
  applications: Array<ApplicationType>;
  /** Get all available ISOs */
  availableISOs: Array<Iso>;
  backgroundHealthServiceStatus: BackgroundHealthServiceStatus;
  /** Check for application updates on a VM */
  checkApplicationUpdates: ApplicationUpdates;
  /** Check if ISO is available for specific OS */
  checkISOStatus: IsoStatus;
  /** Check availability for multiple OS types */
  checkMultipleOSAvailability: Array<IsoAvailabilityMap>;
  /** Check resource optimization opportunities for a VM */
  checkResourceOptimization: ResourceOptimizationInfo;
  checkSetupStatus: DyummyType;
  /** Check overall system readiness */
  checkSystemReadiness: SystemReadiness;
  /** Check disk space status for a VM */
  checkVMDiskSpace: DiskSpaceInfo;
  /** Check Windows Defender status for a VM */
  checkWindowsDefender: WindowsDefenderStatus;
  /** Check Windows Updates status for a VM */
  checkWindowsUpdates: WindowsUpdateInfo;
  /** Get the current snapshot of a virtual machine */
  currentSnapshot: Maybe<Snapshot>;
  currentUser: Maybe<UserType>;
  department: Maybe<DepartmentType>;
  departments: Array<DepartmentType>;
  dueMaintenanceTasks: Array<MaintenanceTask>;
  findDepartmentByName: Maybe<DepartmentType>;
  getAppSettings: AppSettings;
  getAvailableFirewallTemplates: Array<FirewallTemplateInfo>;
  getAvailableTemplatesForDepartment: Array<GenericFilter>;
  getDepartmentFirewallRules: Array<FwRule>;
  getDepartmentFirewallState: DepartmentFirewallState;
  getDepartmentServiceStatus: Array<DepartmentServiceStatus>;
  getFilter: Maybe<GenericFilter>;
  getFirewallTemplateInfo: Maybe<FirewallTemplateInfo>;
  getGlobalServiceStatus: Array<GlobalServiceStatus>;
  getGraphics: Array<Gpu>;
  getLatestVMHealth: Maybe<VmHealthSnapshotType>;
  getServiceStatusSummary: Array<ServiceStatusSummary>;
  getSimplifiedFirewallRules: Array<SimplifiedFirewallRule>;
  /** Get supported OS types */
  getSupportedOSTypes: Array<Scalars['String']['output']>;
  getSystemResources: SystemResources;
  /** Get installed applications inventory for a VM */
  getVMApplicationInventory: ApplicationInventory;
  getVMFirewallState: VmFirewallState;
  /** Get comprehensive health check status for a VM */
  getVMHealthStatus: HealthCheckStatus;
  /** Get automated recommendations for VM optimization, security, and maintenance based on system analysis. Returns up to 20 recommendations by default to prevent over-fetch. Use pagination for more results. */
  getVMRecommendations: Array<VmRecommendationType>;
  getVmServiceStatus: Array<VmServiceStatus>;
  /** Get Windows Update history for a VM */
  getWindowsUpdateHistory: WindowsUpdateHistory;
  graphicConnection: Maybe<GraphicConfigurationType>;
  healthCheckQueueStats: QueueStatsType;
  healthQueueStatistics: QueueStatistics;
  latestVMHealthSnapshot: Maybe<VmHealthSnapshotType>;
  listFilterRules: Array<FwRule>;
  listFilters: Array<GenericFilter>;
  /** List all installed packages on a virtual machine */
  listInstalledPackages: Array<PackageInfo>;
  listSecurityServices: Array<ServiceDefinition>;
  /** List all services running on a virtual machine */
  listServices: Array<ServiceInfo>;
  machine: Maybe<Machine>;
  /** List all snapshots for a virtual machine */
  machineSnapshots: SnapshotListResult;
  machineTemplate: Maybe<MachineTemplateType>;
  machineTemplateCategories: Array<MachineTemplateCategoryType>;
  machineTemplateCategory: Maybe<MachineTemplateCategoryType>;
  machineTemplates: Array<MachineTemplateType>;
  machines: Array<Machine>;
  maintenanceHistory: Array<MaintenanceHistory>;
  maintenanceStats: MaintenanceStats;
  maintenanceTask: Maybe<MaintenanceTask>;
  maintenanceTasks: Array<MaintenanceTask>;
  network: Network;
  networks: Array<Network>;
  /** Run a specific health check on a VM */
  runHealthCheck: GenericHealthCheckResponse;
  /** Search for available packages on a virtual machine */
  searchPackages: Array<PackageInfo>;
  /** Get current socket connection statistics for all VMs */
  socketConnectionStats: Maybe<SocketConnectionStats>;
  user: UserType;
  users: Array<UserType>;
  vmHealthCheckQueue: Array<VmHealthCheckQueueType>;
  vmHealthHistory: Array<VmHealthSnapshotType>;
  vmHealthStats: VmHealthStatsType;
  /** Get comprehensive diagnostics for VM socket connection issues */
  vmSocketDiagnostics: VmDiagnostics;
};


export type QueryApplicationArgs = {
  id: Scalars['String']['input'];
};


export type QueryCheckApplicationUpdatesArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryCheckIsoStatusArgs = {
  os: Scalars['String']['input'];
};


export type QueryCheckMultipleOsAvailabilityArgs = {
  osList: Array<Scalars['String']['input']>;
};


export type QueryCheckResourceOptimizationArgs = {
  evaluationWindowDays: InputMaybe<Scalars['Float']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryCheckVmDiskSpaceArgs = {
  criticalThreshold: InputMaybe<Scalars['Float']['input']>;
  vmId: Scalars['ID']['input'];
  warningThreshold: InputMaybe<Scalars['Float']['input']>;
};


export type QueryCheckWindowsDefenderArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryCheckWindowsUpdatesArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryCurrentSnapshotArgs = {
  machineId: Scalars['String']['input'];
};


export type QueryDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryFindDepartmentByNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetAvailableTemplatesForDepartmentArgs = {
  departmentId: Scalars['ID']['input'];
};


export type QueryGetDepartmentFirewallRulesArgs = {
  departmentId: Scalars['ID']['input'];
};


export type QueryGetDepartmentFirewallStateArgs = {
  departmentId: Scalars['ID']['input'];
};


export type QueryGetDepartmentServiceStatusArgs = {
  departmentId: Scalars['ID']['input'];
  serviceId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetFilterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFirewallTemplateInfoArgs = {
  template: FirewallTemplate;
};


export type QueryGetGlobalServiceStatusArgs = {
  serviceId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetLatestVmHealthArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryGetSimplifiedFirewallRulesArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryGetVmApplicationInventoryArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmFirewallStateArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryGetVmHealthStatusArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmRecommendationsArgs = {
  filter: InputMaybe<RecommendationFilterInput>;
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmServiceStatusArgs = {
  serviceId: InputMaybe<Scalars['ID']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryGetWindowsUpdateHistoryArgs = {
  days: InputMaybe<Scalars['Float']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryGraphicConnectionArgs = {
  id: Scalars['String']['input'];
};


export type QueryLatestVmHealthSnapshotArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryListFilterRulesArgs = {
  filterId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryListFiltersArgs = {
  departmentId: InputMaybe<Scalars['ID']['input']>;
  vmId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryListInstalledPackagesArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryListServicesArgs = {
  machineId: Scalars['String']['input'];
};


export type QueryMachineArgs = {
  id: Scalars['String']['input'];
};


export type QueryMachineSnapshotsArgs = {
  machineId: Scalars['String']['input'];
};


export type QueryMachineTemplateArgs = {
  id: Scalars['String']['input'];
};


export type QueryMachineTemplateCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryMachineTemplatesArgs = {
  orderBy: InputMaybe<MachineTemplateOrderBy>;
  pagination: InputMaybe<PaginationInputType>;
};


export type QueryMachinesArgs = {
  orderBy: InputMaybe<MachineOrderBy>;
  pagination: InputMaybe<PaginationInputType>;
};


export type QueryMaintenanceHistoryArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  machineId: Scalars['ID']['input'];
  status: InputMaybe<MaintenanceStatus>;
  taskType: InputMaybe<MaintenanceTaskType>;
};


export type QueryMaintenanceStatsArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryMaintenanceTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaintenanceTasksArgs = {
  machineId: Scalars['ID']['input'];
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryNetworkArgs = {
  name: Scalars['String']['input'];
};


export type QueryRunHealthCheckArgs = {
  checkName: HealthCheckName;
  vmId: Scalars['ID']['input'];
};


export type QuerySearchPackagesArgs = {
  machineId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  orderBy: InputMaybe<UserOrderByInputType>;
  pagination: InputMaybe<PaginationInputType>;
};


export type QueryVmHealthCheckQueueArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineId: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status: InputMaybe<Scalars['String']['input']>;
};


export type QueryVmHealthHistoryArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineId: Scalars['ID']['input'];
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryVmHealthStatsArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryVmSocketDiagnosticsArgs = {
  vmId: Scalars['String']['input'];
};

export type QueueStatistics = {
  __typename?: 'QueueStatistics';
  activeChecks: Scalars['Int']['output'];
  completedToday: Scalars['Int']['output'];
  failedToday: Scalars['Int']['output'];
  pendingTasks: Scalars['Int']['output'];
  totalQueues: Scalars['Int']['output'];
};

export type QueueStatsType = {
  __typename?: 'QueueStatsType';
  completed: Scalars['Int']['output'];
  failed: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  retryScheduled: Scalars['Int']['output'];
  running: Scalars['Int']['output'];
  totalToday: Scalars['Int']['output'];
};

/** Filters for querying VM recommendations with specific criteria */
export type RecommendationFilterInput = {
  /** Only return recommendations created after this date/time */
  createdAfter: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** Only return recommendations created before this date/time */
  createdBefore: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** Maximum number of recommendations to return (for pagination, defaults to 20, max 100) */
  limit: InputMaybe<Scalars['Float']['input']>;
  /** Filter by specific recommendation types (e.g., only security or storage recommendations) */
  types: InputMaybe<Array<RecommendationType>>;
};

/** Types of VM recommendations that can be generated by the system based on health checks and system analysis */
export enum RecommendationType {
  /** Generated when application updates, especially security updates, are available */
  AppUpdateAvailable = 'APP_UPDATE_AVAILABLE',
  /** Generated when Windows Defender antivirus or real-time protection is disabled */
  DefenderDisabled = 'DEFENDER_DISABLED',
  /** Generated when Windows Defender has detected active threats or quarantined items */
  DefenderThreat = 'DEFENDER_THREAT',
  /** Generated when disk space usage exceeds warning thresholds (typically 80-90%) */
  DiskSpaceLow = 'DISK_SPACE_LOW',
  /** Generated when specific applications are consuming excessive CPU resources */
  HighCpuApp = 'HIGH_CPU_APP',
  /** Generated when specific applications are consuming excessive memory resources */
  HighRamApp = 'HIGH_RAM_APP',
  /** Generated when critical or security Windows updates are available */
  OsUpdateAvailable = 'OS_UPDATE_AVAILABLE',
  /** Generated for miscellaneous recommendations that do not fit other categories */
  Other = 'OTHER',
  /** Generated when VM resources (CPU/RAM) are consistently underutilized over time */
  OverProvisioned = 'OVER_PROVISIONED',
  /** Generated when firewall rules are blocking ports that applications are trying to use */
  PortBlocked = 'PORT_BLOCKED',
  /** Generated when VM resources are consistently over-utilized and affecting performance */
  UnderProvisioned = 'UNDER_PROVISIONED'
}

export type ResourceOptimizationInfo = {
  __typename?: 'ResourceOptimizationInfo';
  error: Maybe<Scalars['String']['output']>;
  evaluationWindowDays: Maybe<Scalars['Float']['output']>;
  overallStatus: HealthCheckSeverity;
  recommendations: Array<ResourceRecommendation>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type ResourceRecommendation = {
  __typename?: 'ResourceRecommendation';
  currentValue: Scalars['Float']['output'];
  potentialSavingsPercent: Maybe<Scalars['Float']['output']>;
  reason: Scalars['String']['output'];
  recommendedValue: Scalars['Float']['output'];
  resource: Scalars['String']['output'];
  unit: Scalars['String']['output'];
};

export type RestoreSnapshotInput = {
  machineId: Scalars['String']['input'];
  snapshotName: Scalars['String']['input'];
};

/** Service action type (USE for outbound, PROVIDE for inbound) */
export enum ServiceAction {
  Provide = 'PROVIDE',
  Use = 'USE'
}

export type ServiceControlInput = {
  action: VmServiceAction;
  machineId: Scalars['String']['input'];
  serviceName: Scalars['String']['input'];
};

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

export type ServiceInfo = {
  __typename?: 'ServiceInfo';
  description: Maybe<Scalars['String']['output']>;
  displayName: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pid: Maybe<Scalars['Float']['output']>;
  startType: Maybe<ServiceStartType>;
  status: ServiceStatus;
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

/** The startup type of a system service */
export enum ServiceStartType {
  Automatic = 'AUTOMATIC',
  Disabled = 'DISABLED',
  Manual = 'MANUAL',
  Unknown = 'UNKNOWN'
}

/** The current status of a system service */
export enum ServiceStatus {
  Disabled = 'DISABLED',
  Running = 'RUNNING',
  Stopped = 'STOPPED',
  Unknown = 'UNKNOWN'
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

export type ServiceStatusType = {
  __typename?: 'ServiceStatusType';
  error: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  service: Maybe<ServiceInfo>;
  success: Scalars['Boolean']['output'];
};

export type SimplifiedFirewallRule = {
  __typename?: 'SimplifiedFirewallRule';
  /** Firewall action (accept, drop, reject) */
  action: Scalars['String']['output'];
  /** Rule description */
  description: Maybe<Scalars['String']['output']>;
  /** Traffic direction (in, out, inout) */
  direction: Scalars['String']['output'];
  /** Unique rule identifier */
  id: Maybe<Scalars['ID']['output']>;
  /** Port specification (e.g., "80", "80-90", "all") */
  port: Scalars['String']['output'];
  /** Network protocol (tcp, udp, icmp) */
  protocol: Scalars['String']['output'];
  /** Rule sources (templates or custom) */
  sources: Maybe<Array<Scalars['String']['output']>>;
};

export type Snapshot = {
  __typename?: 'Snapshot';
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  hasMetadata: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isCurrent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentId: Maybe<Scalars['String']['output']>;
  state: Scalars['String']['output'];
  vmId: Scalars['String']['output'];
  vmName: Scalars['String']['output'];
};

export type SnapshotListResult = {
  __typename?: 'SnapshotListResult';
  message: Scalars['String']['output'];
  snapshots: Array<Snapshot>;
  success: Scalars['Boolean']['output'];
};

export type SnapshotResult = {
  __typename?: 'SnapshotResult';
  message: Scalars['String']['output'];
  snapshot: Maybe<Snapshot>;
  success: Scalars['Boolean']['output'];
};

export type SocketConnectionStats = {
  __typename?: 'SocketConnectionStats';
  activeConnections: Maybe<Scalars['Float']['output']>;
  connections: Maybe<Array<VmConnectionInfo>>;
  isConnected: Maybe<Scalars['Boolean']['output']>;
  lastMessageTime: Maybe<Scalars['String']['output']>;
  reconnectAttempts: Maybe<Scalars['Float']['output']>;
  totalConnections: Maybe<Scalars['Float']['output']>;
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

export type UpdateDepartmentNameInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateFilterInput = {
  chain: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  type: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFilterRuleInput = {
  action: Scalars['String']['input'];
  comment: InputMaybe<Scalars['String']['input']>;
  direction: Scalars['String']['input'];
  dstPortEnd: InputMaybe<Scalars['Int']['input']>;
  dstPortStart: InputMaybe<Scalars['Int']['input']>;
  ipVersion: InputMaybe<Scalars['String']['input']>;
  priority: Scalars['Int']['input'];
  protocol: InputMaybe<Scalars['String']['input']>;
  srcPortEnd: InputMaybe<Scalars['Int']['input']>;
  srcPortStart: InputMaybe<Scalars['Int']['input']>;
  state: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMachineHardwareInput = {
  /** New number of CPU cores */
  cpuCores: InputMaybe<Scalars['Int']['input']>;
  /** New GPU PCI address (e.g., 0000:01:00.0). Set to null to remove GPU. */
  gpuPciAddress: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  /** New RAM in GB */
  ramGB: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateMachineNameInput = {
  id: Scalars['ID']['input'];
  /** New name for the machine */
  name: Scalars['String']['input'];
};

export type UpdateMachineUserInput = {
  id: Scalars['ID']['input'];
  /** User ID to assign to the machine. Set to null to unassign. */
  userId: InputMaybe<Scalars['String']['input']>;
};

export type UpdateMaintenanceTaskInput = {
  cronSchedule: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
  isRecurring: InputMaybe<Scalars['Boolean']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
  runAt: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type UpdateUserInputType = {
  /** User avatar image path */
  avatar: InputMaybe<Scalars['String']['input']>;
  /** Current password required when updating password */
  currentPassword: InputMaybe<Scalars['String']['input']>;
  firstName: InputMaybe<Scalars['String']['input']>;
  lastName: InputMaybe<Scalars['String']['input']>;
  password: InputMaybe<Scalars['String']['input']>;
  passwordConfirmation: InputMaybe<Scalars['String']['input']>;
  role: InputMaybe<UserRole>;
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
  direction: InputMaybe<OrderByDirection>;
  fieldName: InputMaybe<UserOrderByField>;
};

/** The basic roles of users */
export enum UserRole {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER'
}

/** User model */
export type UserType = {
  __typename?: 'UserType';
  /** User avatar image path */
  avatar: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  /** User namespace for real-time events */
  namespace: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type VmFirewallState = {
  __typename?: 'VMFirewallState';
  /** Applied firewall templates */
  appliedTemplates: Array<Scalars['String']['output']>;
  /** Custom firewall rules */
  customRules: Array<SimplifiedFirewallRule>;
  /** All effective firewall rules */
  effectiveRules: Array<SimplifiedFirewallRule>;
  /** Last sync with hypervisor */
  lastSync: Maybe<Scalars['DateTimeISO']['output']>;
};

export type VmHealthCheckQueueType = {
  __typename?: 'VMHealthCheckQueueType';
  attempts: Scalars['Int']['output'];
  checkType: Scalars['String']['output'];
  completedAt: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error: Maybe<Scalars['String']['output']>;
  executedAt: Maybe<Scalars['DateTimeISO']['output']>;
  executionTimeMs: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  machineId: Scalars['ID']['output'];
  maxAttempts: Scalars['Int']['output'];
  payload: Maybe<Scalars['JSONObject']['output']>;
  priority: Scalars['String']['output'];
  result: Maybe<Scalars['JSONObject']['output']>;
  scheduledFor: Scalars['DateTimeISO']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type VmHealthSnapshotType = {
  __typename?: 'VMHealthSnapshotType';
  applicationInventory: Maybe<Scalars['JSONObject']['output']>;
  checksCompleted: Scalars['Int']['output'];
  checksFailed: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  customCheckResults: Maybe<Scalars['JSONObject']['output']>;
  defenderStatus: Maybe<Scalars['JSONObject']['output']>;
  diskSpaceInfo: Maybe<Scalars['JSONObject']['output']>;
  errorSummary: Maybe<Scalars['String']['output']>;
  executionTimeMs: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  machineId: Scalars['ID']['output'];
  osType: Maybe<Scalars['String']['output']>;
  overallStatus: Scalars['String']['output'];
  resourceOptInfo: Maybe<Scalars['JSONObject']['output']>;
  snapshotDate: Scalars['DateTimeISO']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  windowsUpdateInfo: Maybe<Scalars['JSONObject']['output']>;
};

export type VmHealthStatsType = {
  __typename?: 'VMHealthStatsType';
  errorSnapshots: Scalars['Int']['output'];
  healthySnapshots: Scalars['Int']['output'];
  lastHealthCheck: Maybe<Scalars['DateTimeISO']['output']>;
  lastHealthStatus: Maybe<Scalars['String']['output']>;
  totalSnapshots: Scalars['Int']['output'];
  warningSnapshots: Scalars['Int']['output'];
};

/** Represents an automated recommendation for VM optimization, security, or maintenance */
export type VmRecommendationType = {
  __typename?: 'VMRecommendationType';
  /** Suggested action to address the recommendation */
  actionText: Scalars['String']['output'];
  /** Timestamp when this recommendation was generated */
  createdAt: Scalars['DateTimeISO']['output'];
  /** Additional structured data specific to this recommendation type (metrics, thresholds, affected resources) */
  data: Maybe<Scalars['JSONObject']['output']>;
  /** Unique identifier for the recommendation */
  id: Scalars['ID']['output'];
  /** ID of the VM this recommendation applies to */
  machineId: Scalars['ID']['output'];
  /** ID of the health snapshot that generated this recommendation, if applicable */
  snapshotId: Maybe<Scalars['ID']['output']>;
  /** Human-readable description of the issue or opportunity identified */
  text: Scalars['String']['output'];
  /** Category of recommendation (storage, performance, security, etc.) */
  type: RecommendationType;
};

/** Actions that can be performed on a VM service */
export enum VmServiceAction {
  Disable = 'DISABLE',
  Enable = 'ENABLE',
  Restart = 'RESTART',
  Start = 'START',
  Status = 'STATUS',
  Stop = 'STOP'
}

export type VmConnectionInfo = {
  __typename?: 'VmConnectionInfo';
  isConnected: Scalars['Boolean']['output'];
  lastMessageTime: Scalars['String']['output'];
  reconnectAttempts: Scalars['Float']['output'];
  vmId: Scalars['String']['output'];
};

export type VmDiagnostics = {
  __typename?: 'VmDiagnostics';
  connectionStats: Maybe<SocketConnectionStats>;
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
  lastSeen: Maybe<Scalars['DateTimeISO']['output']>;
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

export type WindowsDefenderStatus = {
  __typename?: 'WindowsDefenderStatus';
  antispywareEnabled: Scalars['Boolean']['output'];
  antivirusEnabled: Scalars['Boolean']['output'];
  antivirusSignatureLastUpdated: Scalars['DateTimeISO']['output'];
  antivirusSignatureVersion: Scalars['String']['output'];
  error: Maybe<Scalars['String']['output']>;
  lastFullScanTime: Maybe<Scalars['DateTimeISO']['output']>;
  lastQuickScanTime: Maybe<Scalars['DateTimeISO']['output']>;
  overallStatus: HealthCheckSeverity;
  realTimeProtectionEnabled: Scalars['Boolean']['output'];
  success: Scalars['Boolean']['output'];
  threatsDetected: Scalars['Int']['output'];
  threatsQuarantined: Scalars['Int']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type WindowsUpdateHistory = {
  __typename?: 'WindowsUpdateHistory';
  daysIncluded: Maybe<Scalars['Float']['output']>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  totalCount: Scalars['Int']['output'];
  updates: Array<WindowsUpdateHistoryItem>;
  vmId: Scalars['ID']['output'];
};

export type WindowsUpdateHistoryItem = {
  __typename?: 'WindowsUpdateHistoryItem';
  description: Maybe<Scalars['String']['output']>;
  installDate: Scalars['DateTimeISO']['output'];
  kbArticle: Maybe<Scalars['String']['output']>;
  resultCode: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type WindowsUpdateInfo = {
  __typename?: 'WindowsUpdateInfo';
  criticalUpdatesCount: Scalars['Int']['output'];
  error: Maybe<Scalars['String']['output']>;
  lastCheckTime: Maybe<Scalars['DateTimeISO']['output']>;
  lastInstallTime: Maybe<Scalars['DateTimeISO']['output']>;
  pendingUpdates: Array<WindowsUpdateItem>;
  pendingUpdatesCount: Scalars['Int']['output'];
  securityUpdatesCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type WindowsUpdateItem = {
  __typename?: 'WindowsUpdateItem';
  description: Maybe<Scalars['String']['output']>;
  kbArticle: Maybe<Scalars['String']['output']>;
  severity: Scalars['String']['output'];
  sizeInMB: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInputType;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } };

export type CreateMachineTemplateMutationVariables = Exact<{
  input: MachineTemplateInputType;
}>;


export type CreateMachineTemplateMutation = { __typename?: 'Mutation', createMachineTemplate: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } };

export type UpdateMachineTemplateMutationVariables = Exact<{
  input: MachineTemplateInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateMachineTemplateMutation = { __typename?: 'Mutation', updateMachineTemplate: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } };

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


export type CreateMachineMutation = { __typename?: 'Mutation', createMachine: { __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null } };

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


export type ExecuteCommandMutation = { __typename?: 'Mutation', executeCommand: { __typename?: 'CommandExecutionResponseType', success: boolean, message: string, response: string | null } };

export type UpdateMachineHardwareMutationVariables = Exact<{
  input: UpdateMachineHardwareInput;
}>;


export type UpdateMachineHardwareMutation = { __typename?: 'Mutation', updateMachineHardware: { __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null } };

export type UpdateMachineNameMutationVariables = Exact<{
  input: UpdateMachineNameInput;
}>;


export type UpdateMachineNameMutation = { __typename?: 'Mutation', updateMachineName: { __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null } };

export type UpdateMachineUserMutationVariables = Exact<{
  input: UpdateMachineUserInput;
}>;


export type UpdateMachineUserMutation = { __typename?: 'Mutation', updateMachineUser: { __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null } };

export type MoveMachineMutationVariables = Exact<{
  departmentId: Scalars['String']['input'];
  id: Scalars['String']['input'];
}>;


export type MoveMachineMutation = { __typename?: 'Mutation', moveMachine: { __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null } };

export type SetupNodeMutationVariables = Exact<{ [key: string]: never; }>;


export type SetupNodeMutation = { __typename?: 'Mutation', setupNode: { __typename?: 'DyummyType', value: string } };

export type CreateDepartmentMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } };

export type DestroyDepartmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DestroyDepartmentMutation = { __typename?: 'Mutation', destroyDepartment: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } };

export type UpdateDepartmentNameMutationVariables = Exact<{
  input: UpdateDepartmentNameInput;
}>;


export type UpdateDepartmentNameMutation = { __typename?: 'Mutation', updateDepartmentName: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } };

export type CreateMachineTemplateCategoryMutationVariables = Exact<{
  input: MachineTemplateCategoryInputType;
}>;


export type CreateMachineTemplateCategoryMutation = { __typename?: 'Mutation', createMachineTemplateCategory: { __typename?: 'MachineTemplateCategoryType', id: string, name: string, description: string | null, createdAt: string, totalTemplates: number | null, totalMachines: number | null } };

export type UpdateMachineTemplateCategoryMutationVariables = Exact<{
  input: MachineTemplateCategoryInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateMachineTemplateCategoryMutation = { __typename?: 'Mutation', updateMachineTemplateCategory: { __typename?: 'MachineTemplateCategoryType', id: string, name: string, description: string | null, createdAt: string, totalTemplates: number | null, totalMachines: number | null } };

export type CreateApplicationMutationVariables = Exact<{
  input: CreateApplicationInputType;
}>;


export type CreateApplicationMutation = { __typename?: 'Mutation', createApplication: { __typename?: 'ApplicationType', id: string, name: string, description: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters: { [key: string]: any } | null, createdAt: string } };

export type UpdateApplicationMutationVariables = Exact<{
  input: CreateApplicationInputType;
  id: Scalars['String']['input'];
}>;


export type UpdateApplicationMutation = { __typename?: 'Mutation', updateApplication: { __typename?: 'ApplicationType', id: string, name: string, description: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters: { [key: string]: any } | null, createdAt: string } };

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


export type CreateFilterMutation = { __typename?: 'Mutation', createFilter: { __typename?: 'GenericFilter', id: string, name: string, description: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null }> | null } };

export type UpdateFilterMutationVariables = Exact<{
  input: UpdateFilterInput;
  id: Scalars['ID']['input'];
}>;


export type UpdateFilterMutation = { __typename?: 'Mutation', updateFilter: { __typename?: 'GenericFilter', id: string, name: string, description: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null }> | null } };

export type DeleteFilterMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteFilterMutation = { __typename?: 'Mutation', deleteFilter: boolean };

export type CreateFilterRuleMutationVariables = Exact<{
  input: CreateFilterRuleInput;
  filterId: Scalars['ID']['input'];
}>;


export type CreateFilterRuleMutation = { __typename?: 'Mutation', createFilterRule: { __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null } };

export type UpdateFilterRuleMutationVariables = Exact<{
  input: UpdateFilterRuleInput;
  id: Scalars['ID']['input'];
}>;


export type UpdateFilterRuleMutation = { __typename?: 'Mutation', updateFilterRule: { __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null } };

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


export type ToggleVmServiceMutation = { __typename?: 'Mutation', toggleVmService: { __typename?: 'VmServiceStatus', vmId: string, vmName: string, serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean, running: boolean, lastSeen: string | null } };

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

export type RunDefenderQuickScanMutationVariables = Exact<{
  vmId: Scalars['ID']['input'];
}>;


export type RunDefenderQuickScanMutation = { __typename?: 'Mutation', runDefenderQuickScan: { __typename?: 'DefenderScanResult', success: boolean, error: string | null, vmId: string, scanType: string, scanDuration: number, threatsFound: number, filesScanned: number, timestamp: string } };

export type PerformDiskCleanupMutationVariables = Exact<{
  vmId: Scalars['ID']['input'];
  drive: Scalars['String']['input'];
  targets: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type PerformDiskCleanupMutation = { __typename?: 'Mutation', performDiskCleanup: { __typename?: 'DiskCleanupResult', success: boolean, error: string | null, vmId: string, drive: string, spaceClearedMB: number, filesDeleted: number, targetsProcessed: Array<string>, timestamp: string } };

export type ApplyFirewallTemplateMutationVariables = Exact<{
  input: ApplyFirewallTemplateInput;
}>;


export type ApplyFirewallTemplateMutation = { __typename?: 'Mutation', applyFirewallTemplate: { __typename?: 'VMFirewallState', appliedTemplates: Array<string>, lastSync: string | null, customRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }>, effectiveRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }> } };

export type RemoveFirewallTemplateMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
  template: FirewallTemplate;
}>;


export type RemoveFirewallTemplateMutation = { __typename?: 'Mutation', removeFirewallTemplate: { __typename?: 'VMFirewallState', appliedTemplates: Array<string>, lastSync: string | null, customRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }>, effectiveRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }> } };

export type CreateSimplifiedFirewallRuleMutationVariables = Exact<{
  input: CreateSimplifiedFirewallRuleInput;
}>;


export type CreateSimplifiedFirewallRuleMutation = { __typename?: 'Mutation', createSimplifiedFirewallRule: { __typename?: 'VMFirewallState', appliedTemplates: Array<string>, lastSync: string | null, customRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }>, effectiveRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }> } };

export type RemoveSimplifiedFirewallRuleMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
  ruleId: Scalars['ID']['input'];
}>;


export type RemoveSimplifiedFirewallRuleMutation = { __typename?: 'Mutation', removeSimplifiedFirewallRule: { __typename?: 'VMFirewallState', appliedTemplates: Array<string>, lastSync: string | null, customRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }>, effectiveRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, port: string, protocol: string, direction: string, action: string, description: string | null, sources: Array<string> | null }> } };

export type CreateMaintenanceTaskMutationVariables = Exact<{
  input: CreateMaintenanceTaskInput;
}>;


export type CreateMaintenanceTaskMutation = { __typename?: 'Mutation', createMaintenanceTask: { __typename?: 'MaintenanceTaskResponse', success: boolean, message: string | null, error: string | null, task: { __typename?: 'MaintenanceTask', id: string, machineId: string, taskType: MaintenanceTaskType, name: string, description: string | null, isEnabled: boolean, isRecurring: boolean, cronSchedule: string | null, nextRunAt: string | null, lastRunAt: string | null, runAt: string | null, executionStatus: string, parameters: { [key: string]: any } | null, createdByUserId: string, createdAt: string, updatedAt: string } | null } };

export type UpdateMaintenanceTaskMutationVariables = Exact<{
  input: UpdateMaintenanceTaskInput;
}>;


export type UpdateMaintenanceTaskMutation = { __typename?: 'Mutation', updateMaintenanceTask: { __typename?: 'MaintenanceTaskResponse', success: boolean, message: string | null, error: string | null, task: { __typename?: 'MaintenanceTask', id: string, machineId: string, taskType: MaintenanceTaskType, name: string, description: string | null, isEnabled: boolean, isRecurring: boolean, cronSchedule: string | null, nextRunAt: string | null, lastRunAt: string | null, runAt: string | null, executionStatus: string, parameters: { [key: string]: any } | null, createdByUserId: string, createdAt: string, updatedAt: string } | null } };

export type DeleteMaintenanceTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteMaintenanceTaskMutation = { __typename?: 'Mutation', deleteMaintenanceTask: { __typename?: 'MaintenanceTaskResponse', success: boolean, message: string | null, error: string | null } };

export type ExecuteMaintenanceTaskMutationVariables = Exact<{
  taskId: Scalars['ID']['input'];
}>;


export type ExecuteMaintenanceTaskMutation = { __typename?: 'Mutation', executeMaintenanceTask: { __typename?: 'MaintenanceExecutionResponse', success: boolean, message: string | null, error: string | null, execution: { __typename?: 'MaintenanceHistory', id: string, taskId: string | null, machineId: string, taskType: MaintenanceTaskType, status: MaintenanceStatus, triggeredBy: MaintenanceTrigger, executedByUserId: string | null, executedAt: string, duration: number | null, result: { [key: string]: any } | null, error: string | null, parameters: { [key: string]: any } | null } | null } };

export type ExecuteImmediateMaintenanceMutationVariables = Exact<{
  input: ExecuteMaintenanceInput;
}>;


export type ExecuteImmediateMaintenanceMutation = { __typename?: 'Mutation', executeImmediateMaintenance: { __typename?: 'MaintenanceExecutionResponse', success: boolean, message: string | null, error: string | null, execution: { __typename?: 'MaintenanceHistory', id: string, taskId: string | null, machineId: string, taskType: MaintenanceTaskType, status: MaintenanceStatus, triggeredBy: MaintenanceTrigger, executedByUserId: string | null, executedAt: string, duration: number | null, result: { [key: string]: any } | null, error: string | null, parameters: { [key: string]: any } | null } | null } };

export type ToggleMaintenanceTaskMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  enabled: Scalars['Boolean']['input'];
}>;


export type ToggleMaintenanceTaskMutation = { __typename?: 'Mutation', toggleMaintenanceTask: { __typename?: 'MaintenanceTaskResponse', success: boolean, message: string | null, error: string | null, task: { __typename?: 'MaintenanceTask', id: string, machineId: string, taskType: MaintenanceTaskType, name: string, description: string | null, isEnabled: boolean, isRecurring: boolean, cronSchedule: string | null, nextRunAt: string | null, lastRunAt: string | null, runAt: string | null, executionStatus: string, parameters: { [key: string]: any } | null, createdByUserId: string, createdAt: string, updatedAt: string } | null } };

export type RestartMachineMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RestartMachineMutation = { __typename?: 'Mutation', restartMachine: { __typename?: 'SuccessType', success: boolean, message: string } };

export type ForcePowerOffMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ForcePowerOffMutation = { __typename?: 'Mutation', forcePowerOff: { __typename?: 'SuccessType', success: boolean, message: string } };

export type ResetMachineMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ResetMachineMutation = { __typename?: 'Mutation', resetMachine: { __typename?: 'SuccessType', success: boolean, message: string } };

export type PowerOnMachineMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PowerOnMachineMutation = { __typename?: 'Mutation', powerOn: { __typename?: 'SuccessType', success: boolean, message: string } };

export type PowerOffMachineMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type PowerOffMachineMutation = { __typename?: 'Mutation', powerOff: { __typename?: 'SuccessType', success: boolean, message: string } };

export type ManagePackageMutationVariables = Exact<{
  input: PackageManagementInput;
}>;


export type ManagePackageMutation = { __typename?: 'Mutation', managePackage: { __typename?: 'PackageManagementResult', success: boolean, message: string, stdout: string | null, stderr: string | null, error: string | null, packages: Array<{ __typename?: 'PackageInfo', name: string, version: string, description: string | null, installed: boolean, publisher: string | null, source: string | null }> | null } };

export type InstallPackageMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
}>;


export type InstallPackageMutation = { __typename?: 'Mutation', installPackage: { __typename?: 'CommandResult', success: boolean, output: string | null, stdout: string | null, stderr: string | null, error: string | null } };

export type RemovePackageMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
}>;


export type RemovePackageMutation = { __typename?: 'Mutation', removePackage: { __typename?: 'CommandResult', success: boolean, output: string | null, stdout: string | null, stderr: string | null, error: string | null } };

export type UpdatePackageMutationVariables = Exact<{
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
}>;


export type UpdatePackageMutation = { __typename?: 'Mutation', updatePackage: { __typename?: 'CommandResult', success: boolean, output: string | null, stdout: string | null, stderr: string | null, error: string | null } };

export type KillProcessMutationVariables = Exact<{
  machineId: Scalars['String']['input'];
  pid: Scalars['Int']['input'];
  force?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type KillProcessMutation = { __typename?: 'Mutation', killProcess: { __typename?: 'ProcessControlResult', success: boolean, message: string, pid: number | null, processName: string | null, error: string | null } };

export type KillProcessesMutationVariables = Exact<{
  machineId: Scalars['String']['input'];
  pids: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
  force?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type KillProcessesMutation = { __typename?: 'Mutation', killProcesses: Array<{ __typename?: 'ProcessControlResult', success: boolean, message: string, pid: number | null, processName: string | null, error: string | null }> };

export type ExecuteImmediateMaintenanceFromRecommendationsMutationVariables = Exact<{
  input: ExecuteMaintenanceInput;
}>;


export type ExecuteImmediateMaintenanceFromRecommendationsMutation = { __typename?: 'Mutation', executeImmediateMaintenance: { __typename?: 'MaintenanceExecutionResponse', success: boolean, error: string | null, message: string | null, execution: { __typename?: 'MaintenanceHistory', id: string, machineId: string, taskType: MaintenanceTaskType, status: MaintenanceStatus, executedAt: string, duration: number | null, result: { [key: string]: any } | null } | null } };

export type CreateMaintenanceTaskFromRecommendationsMutationVariables = Exact<{
  input: CreateMaintenanceTaskInput;
}>;


export type CreateMaintenanceTaskFromRecommendationsMutation = { __typename?: 'Mutation', createMaintenanceTask: { __typename?: 'MaintenanceTaskResponse', success: boolean, error: string | null, message: string | null, task: { __typename?: 'MaintenanceTask', id: string, name: string, description: string | null, taskType: MaintenanceTaskType, machineId: string, isEnabled: boolean, isRecurring: boolean, runAt: string | null, cronSchedule: string | null, createdAt: string } | null } };

export type ControlServiceFromRecommendationsMutationVariables = Exact<{
  input: ServiceControlInput;
}>;


export type ControlServiceFromRecommendationsMutation = { __typename?: 'Mutation', controlService: { __typename?: 'ServiceStatusType', success: boolean, error: string | null, message: string, service: { __typename?: 'ServiceInfo', name: string, displayName: string | null, status: ServiceStatus, startType: ServiceStartType | null, description: string | null } | null } };

export type ControlServiceMutationVariables = Exact<{
  input: ServiceControlInput;
}>;


export type ControlServiceMutation = { __typename?: 'Mutation', controlService: { __typename?: 'ServiceStatusType', success: boolean, message: string, error: string | null, service: { __typename?: 'ServiceInfo', name: string, displayName: string | null, status: ServiceStatus, startType: ServiceStartType | null, description: string | null, pid: number | null } | null } };

export type CreateSnapshotMutationVariables = Exact<{
  input: CreateSnapshotInput;
}>;


export type CreateSnapshotMutation = { __typename?: 'Mutation', createSnapshot: { __typename?: 'SnapshotResult', success: boolean, message: string, snapshot: { __typename?: 'Snapshot', id: string, name: string, description: string | null, vmId: string, vmName: string, createdAt: string, isCurrent: boolean, parentId: string | null, hasMetadata: boolean, state: string } | null } };

export type RestoreSnapshotMutationVariables = Exact<{
  input: RestoreSnapshotInput;
}>;


export type RestoreSnapshotMutation = { __typename?: 'Mutation', restoreSnapshot: { __typename?: 'SuccessType', success: boolean, message: string } };

export type DeleteSnapshotMutationVariables = Exact<{
  input: DeleteSnapshotInput;
}>;


export type DeleteSnapshotMutation = { __typename?: 'Mutation', deleteSnapshot: { __typename?: 'SuccessType', success: boolean, message: string } };

export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type CurrentUserQuery = { __typename?: 'Query', currentUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string, namespace: string | null } | null };

export type UserQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } };

export type UsersQueryVariables = Exact<{
  pagination: InputMaybe<PaginationInputType>;
  orderBy: InputMaybe<UserOrderByInputType>;
}>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string }> };

export type MachineTemplateQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MachineTemplateQuery = { __typename?: 'Query', machineTemplate: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null };

export type MachineTemplatesQueryVariables = Exact<{
  orderBy: InputMaybe<MachineTemplateOrderBy>;
  pagination: InputMaybe<PaginationInputType>;
}>;


export type MachineTemplatesQuery = { __typename?: 'Query', machineTemplates: Array<{ __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null }> };

export type MachineQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MachineQuery = { __typename?: 'Query', machine: { __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, localIP: string | null, publicIP: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null } | null };

export type MachinesQueryVariables = Exact<{
  orderBy: InputMaybe<MachineOrderBy>;
  pagination: InputMaybe<PaginationInputType>;
}>;


export type MachinesQuery = { __typename?: 'Query', machines: Array<{ __typename?: 'Machine', id: string, name: string, configuration: { [key: string]: any } | null, status: string, userId: string | null, templateId: string | null, createdAt: string | null, localIP: string | null, publicIP: string | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number, createdAt: string, categoryId: string | null, totalMachines: number | null } | null, department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null, user: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar: string | null, createdAt: string } | null }> };

export type GraphicConnectionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GraphicConnectionQuery = { __typename?: 'Query', graphicConnection: { __typename?: 'GraphicConfigurationType', link: string, password: string, protocol: string } | null };

export type CheckSetupStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type CheckSetupStatusQuery = { __typename?: 'Query', checkSetupStatus: { __typename?: 'DyummyType', value: string } };

export type DepartmentsQueryVariables = Exact<{ [key: string]: never; }>;


export type DepartmentsQuery = { __typename?: 'Query', departments: Array<{ __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null }> };

export type DepartmentQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DepartmentQuery = { __typename?: 'Query', department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null };

export type FindDepartmentByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type FindDepartmentByNameQuery = { __typename?: 'Query', findDepartmentByName: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } | null };

export type MachineTemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type MachineTemplateCategoriesQuery = { __typename?: 'Query', machineTemplateCategories: Array<{ __typename?: 'MachineTemplateCategoryType', id: string, name: string, description: string | null, createdAt: string, totalTemplates: number | null, totalMachines: number | null }> };

export type MachineTemplateCategoryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type MachineTemplateCategoryQuery = { __typename?: 'Query', machineTemplateCategory: { __typename?: 'MachineTemplateCategoryType', id: string, name: string, description: string | null, createdAt: string, totalTemplates: number | null, totalMachines: number | null } | null };

export type ApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type ApplicationsQuery = { __typename?: 'Query', applications: Array<{ __typename?: 'ApplicationType', id: string, name: string, description: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters: { [key: string]: any } | null, icon: string | null, createdAt: string }> };

export type ApplicationQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type ApplicationQuery = { __typename?: 'Query', application: { __typename?: 'ApplicationType', id: string, name: string, description: string | null, os: Array<string>, installCommand: { [key: string]: any }, parameters: { [key: string]: any } | null, icon: string | null, createdAt: string } | null };

export type GetGraphicsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGraphicsQuery = { __typename?: 'Query', getGraphics: Array<{ __typename?: 'GPU', pciBus: string, vendor: string, model: string, memory: number }> };

export type GetSystemResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemResourcesQuery = { __typename?: 'Query', getSystemResources: { __typename?: 'SystemResources', cpu: { __typename?: 'SystemResourceCPU', total: number, available: number }, memory: { __typename?: 'SystemResourceMemory', total: number, available: number }, disk: { __typename?: 'SystemResourceDisk', total: number, available: number, used: number } } };

export type NetworksQueryVariables = Exact<{ [key: string]: never; }>;


export type NetworksQuery = { __typename?: 'Query', networks: Array<{ __typename?: 'Network', name: string, uuid: string, description: string | null, bridge: { __typename?: 'NetworkBridge', name: string, stp: string, delay: string }, ip: { __typename?: 'NetworkIp', address: string, netmask: string, dhcp: { __typename?: 'NetworkDhcp', range: { __typename?: 'NetworkDhcpRange', start: string, end: string } } | null } }> };

export type NetworkQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type NetworkQuery = { __typename?: 'Query', network: { __typename?: 'Network', name: string, uuid: string, description: string | null, bridge: { __typename?: 'NetworkBridge', name: string, stp: string, delay: string }, ip: { __typename?: 'NetworkIp', address: string, netmask: string, dhcp: { __typename?: 'NetworkDhcp', range: { __typename?: 'NetworkDhcpRange', start: string, end: string } } | null } } };

export type ListFiltersQueryVariables = Exact<{
  vmId: InputMaybe<Scalars['ID']['input']>;
  departmentId: InputMaybe<Scalars['ID']['input']>;
}>;


export type ListFiltersQuery = { __typename?: 'Query', listFilters: Array<{ __typename?: 'GenericFilter', id: string, name: string, description: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null }> | null }> };

export type GetFilterQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFilterQuery = { __typename?: 'Query', getFilter: { __typename?: 'GenericFilter', id: string, name: string, description: string | null, type: FilterType, references: Array<string>, createdAt: string, updatedAt: string, rules: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null }> | null } | null };

export type ListFilterRulesQueryVariables = Exact<{
  filterId: InputMaybe<Scalars['ID']['input']>;
}>;


export type ListFilterRulesQuery = { __typename?: 'Query', listFilterRules: Array<{ __typename?: 'FWRule', id: string, protocol: string, direction: string, action: string, priority: number, ipVersion: string | null, srcMacAddr: string | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, state: { [key: string]: any } | null, comment: string | null, createdAt: string | null, updatedAt: string | null }> };

export type ListServicesQueryVariables = Exact<{
  machineId: Scalars['String']['input'];
}>;


export type ListServicesQuery = { __typename?: 'Query', listServices: Array<{ __typename?: 'ServiceInfo', name: string, displayName: string | null, status: ServiceStatus, startType: ServiceStartType | null, pid: number | null, description: string | null }> };

export type GetVmServiceStatusQueryVariables = Exact<{
  serviceId: Scalars['ID']['input'];
  vmId: Scalars['ID']['input'];
}>;


export type GetVmServiceStatusQuery = { __typename?: 'Query', getVmServiceStatus: Array<{ __typename?: 'VmServiceStatus', vmId: string, vmName: string, serviceId: string, serviceName: string, useEnabled: boolean, provideEnabled: boolean, running: boolean, lastSeen: string | null }> };

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

export type VmDetailedInfoQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type VmDetailedInfoQuery = { __typename?: 'Query', machine: { __typename?: 'Machine', id: string, name: string, status: string, userId: string | null, templateId: string | null, createdAt: string | null, configuration: { [key: string]: any } | null, localIP: string | null, publicIP: string | null, department: { __typename?: 'DepartmentType', id: string, name: string } | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number } | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName: string, role: string } | null } | null };

export type GetSimplifiedFirewallRulesQueryVariables = Exact<{
  machineId: Scalars['ID']['input'];
}>;


export type GetSimplifiedFirewallRulesQuery = { __typename?: 'Query', getSimplifiedFirewallRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, action: string, direction: string, port: string, protocol: string, description: string | null, sources: Array<string> | null }> };

export type GetVmFirewallStateQueryVariables = Exact<{
  machineId: Scalars['ID']['input'];
}>;


export type GetVmFirewallStateQuery = { __typename?: 'Query', getVMFirewallState: { __typename?: 'VMFirewallState', appliedTemplates: Array<string>, lastSync: string | null, customRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, action: string, direction: string, port: string, protocol: string, description: string | null, sources: Array<string> | null }>, effectiveRules: Array<{ __typename?: 'SimplifiedFirewallRule', id: string | null, action: string, direction: string, port: string, protocol: string, description: string | null, sources: Array<string> | null }> } };

export type GetAvailableFirewallTemplatesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableFirewallTemplatesQuery = { __typename?: 'Query', getAvailableFirewallTemplates: Array<{ __typename?: 'FirewallTemplateInfo', template: string, name: string, description: string, rules: Array<{ __typename?: 'SimplifiedFirewallRule', port: string, protocol: string, direction: string, action: string, description: string | null }> }> };

export type GetVmRecommendationsQueryVariables = Exact<{
  vmId: Scalars['ID']['input'];
  filter: InputMaybe<RecommendationFilterInput>;
  refresh: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetVmRecommendationsQuery = { __typename?: 'Query', getVMRecommendations: Array<{ __typename?: 'VMRecommendationType', id: string, machineId: string, snapshotId: string | null, type: RecommendationType, text: string, actionText: string, data: { [key: string]: any } | null, createdAt: string }> };


export const CreateUserDocument = gql`
    mutation createUser($input: CreateUserInputType!) {
  createUser(input: $input) {
    id
    firstName
    lastName
    role
    email
    avatar
    createdAt
  }
}
    `;
export type CreateUserMutationFn = ApolloReactCommon.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

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
export function useCreateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($input: UpdateUserInputType!, $id: String!) {
  updateUser(input: $input, id: $id) {
    id
    firstName
    lastName
    role
    email
    avatar
    createdAt
  }
}
    `;
export type UpdateUserMutationFn = ApolloReactCommon.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

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
export function useUpdateUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = ApolloReactCommon.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
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
export type CreateMachineTemplateMutationFn = ApolloReactCommon.MutationFunction<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>;

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
export function useCreateMachineTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>(CreateMachineTemplateDocument, options);
      }
export type CreateMachineTemplateMutationHookResult = ReturnType<typeof useCreateMachineTemplateMutation>;
export type CreateMachineTemplateMutationResult = ApolloReactCommon.MutationResult<CreateMachineTemplateMutation>;
export type CreateMachineTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMachineTemplateMutation, CreateMachineTemplateMutationVariables>;
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
export type UpdateMachineTemplateMutationFn = ApolloReactCommon.MutationFunction<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>;

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
export function useUpdateMachineTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>(UpdateMachineTemplateDocument, options);
      }
export type UpdateMachineTemplateMutationHookResult = ReturnType<typeof useUpdateMachineTemplateMutation>;
export type UpdateMachineTemplateMutationResult = ApolloReactCommon.MutationResult<UpdateMachineTemplateMutation>;
export type UpdateMachineTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMachineTemplateMutation, UpdateMachineTemplateMutationVariables>;
export const DestroyMachineTemplateDocument = gql`
    mutation destroyMachineTemplate($id: String!) {
  destroyMachineTemplate(id: $id)
}
    `;
export type DestroyMachineTemplateMutationFn = ApolloReactCommon.MutationFunction<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>;

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
export function useDestroyMachineTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>(DestroyMachineTemplateDocument, options);
      }
export type DestroyMachineTemplateMutationHookResult = ReturnType<typeof useDestroyMachineTemplateMutation>;
export type DestroyMachineTemplateMutationResult = ApolloReactCommon.MutationResult<DestroyMachineTemplateMutation>;
export type DestroyMachineTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<DestroyMachineTemplateMutation, DestroyMachineTemplateMutationVariables>;
export const DestroyMachineTemplateCategoryDocument = gql`
    mutation destroyMachineTemplateCategory($id: String!) {
  destroyMachineTemplateCategory(id: $id)
}
    `;
export type DestroyMachineTemplateCategoryMutationFn = ApolloReactCommon.MutationFunction<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>;

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
export function useDestroyMachineTemplateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>(DestroyMachineTemplateCategoryDocument, options);
      }
export type DestroyMachineTemplateCategoryMutationHookResult = ReturnType<typeof useDestroyMachineTemplateCategoryMutation>;
export type DestroyMachineTemplateCategoryMutationResult = ApolloReactCommon.MutationResult<DestroyMachineTemplateCategoryMutation>;
export type DestroyMachineTemplateCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<DestroyMachineTemplateCategoryMutation, DestroyMachineTemplateCategoryMutationVariables>;
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
      avatar
      createdAt
    }
  }
}
    `;
export type CreateMachineMutationFn = ApolloReactCommon.MutationFunction<CreateMachineMutation, CreateMachineMutationVariables>;

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
export function useCreateMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMachineMutation, CreateMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMachineMutation, CreateMachineMutationVariables>(CreateMachineDocument, options);
      }
export type CreateMachineMutationHookResult = ReturnType<typeof useCreateMachineMutation>;
export type CreateMachineMutationResult = ApolloReactCommon.MutationResult<CreateMachineMutation>;
export type CreateMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMachineMutation, CreateMachineMutationVariables>;
export const PowerOnDocument = gql`
    mutation powerOn($id: String!) {
  powerOn(id: $id) {
    success
    message
  }
}
    `;
export type PowerOnMutationFn = ApolloReactCommon.MutationFunction<PowerOnMutation, PowerOnMutationVariables>;

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
export function usePowerOnMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PowerOnMutation, PowerOnMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PowerOnMutation, PowerOnMutationVariables>(PowerOnDocument, options);
      }
export type PowerOnMutationHookResult = ReturnType<typeof usePowerOnMutation>;
export type PowerOnMutationResult = ApolloReactCommon.MutationResult<PowerOnMutation>;
export type PowerOnMutationOptions = ApolloReactCommon.BaseMutationOptions<PowerOnMutation, PowerOnMutationVariables>;
export const PowerOffDocument = gql`
    mutation powerOff($id: String!) {
  powerOff(id: $id) {
    success
    message
  }
}
    `;
export type PowerOffMutationFn = ApolloReactCommon.MutationFunction<PowerOffMutation, PowerOffMutationVariables>;

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
export function usePowerOffMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PowerOffMutation, PowerOffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PowerOffMutation, PowerOffMutationVariables>(PowerOffDocument, options);
      }
export type PowerOffMutationHookResult = ReturnType<typeof usePowerOffMutation>;
export type PowerOffMutationResult = ApolloReactCommon.MutationResult<PowerOffMutation>;
export type PowerOffMutationOptions = ApolloReactCommon.BaseMutationOptions<PowerOffMutation, PowerOffMutationVariables>;
export const SuspendDocument = gql`
    mutation suspend($id: String!) {
  suspend(id: $id) {
    success
    message
  }
}
    `;
export type SuspendMutationFn = ApolloReactCommon.MutationFunction<SuspendMutation, SuspendMutationVariables>;

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
export function useSuspendMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SuspendMutation, SuspendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SuspendMutation, SuspendMutationVariables>(SuspendDocument, options);
      }
export type SuspendMutationHookResult = ReturnType<typeof useSuspendMutation>;
export type SuspendMutationResult = ApolloReactCommon.MutationResult<SuspendMutation>;
export type SuspendMutationOptions = ApolloReactCommon.BaseMutationOptions<SuspendMutation, SuspendMutationVariables>;
export const DestroyMachineDocument = gql`
    mutation destroyMachine($id: String!) {
  destroyMachine(id: $id) {
    success
    message
  }
}
    `;
export type DestroyMachineMutationFn = ApolloReactCommon.MutationFunction<DestroyMachineMutation, DestroyMachineMutationVariables>;

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
export function useDestroyMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DestroyMachineMutation, DestroyMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DestroyMachineMutation, DestroyMachineMutationVariables>(DestroyMachineDocument, options);
      }
export type DestroyMachineMutationHookResult = ReturnType<typeof useDestroyMachineMutation>;
export type DestroyMachineMutationResult = ApolloReactCommon.MutationResult<DestroyMachineMutation>;
export type DestroyMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<DestroyMachineMutation, DestroyMachineMutationVariables>;
export const ExecuteCommandDocument = gql`
    mutation executeCommand($command: String!, $id: String!) {
  executeCommand(command: $command, id: $id) {
    success
    message
    response
  }
}
    `;
export type ExecuteCommandMutationFn = ApolloReactCommon.MutationFunction<ExecuteCommandMutation, ExecuteCommandMutationVariables>;

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
export function useExecuteCommandMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ExecuteCommandMutation, ExecuteCommandMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ExecuteCommandMutation, ExecuteCommandMutationVariables>(ExecuteCommandDocument, options);
      }
export type ExecuteCommandMutationHookResult = ReturnType<typeof useExecuteCommandMutation>;
export type ExecuteCommandMutationResult = ApolloReactCommon.MutationResult<ExecuteCommandMutation>;
export type ExecuteCommandMutationOptions = ApolloReactCommon.BaseMutationOptions<ExecuteCommandMutation, ExecuteCommandMutationVariables>;
export const UpdateMachineHardwareDocument = gql`
    mutation updateMachineHardware($input: UpdateMachineHardwareInput!) {
  updateMachineHardware(input: $input) {
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
      avatar
      createdAt
    }
  }
}
    `;
export type UpdateMachineHardwareMutationFn = ApolloReactCommon.MutationFunction<UpdateMachineHardwareMutation, UpdateMachineHardwareMutationVariables>;

/**
 * __useUpdateMachineHardwareMutation__
 *
 * To run a mutation, you first call `useUpdateMachineHardwareMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMachineHardwareMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMachineHardwareMutation, { data, loading, error }] = useUpdateMachineHardwareMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMachineHardwareMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMachineHardwareMutation, UpdateMachineHardwareMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMachineHardwareMutation, UpdateMachineHardwareMutationVariables>(UpdateMachineHardwareDocument, options);
      }
export type UpdateMachineHardwareMutationHookResult = ReturnType<typeof useUpdateMachineHardwareMutation>;
export type UpdateMachineHardwareMutationResult = ApolloReactCommon.MutationResult<UpdateMachineHardwareMutation>;
export type UpdateMachineHardwareMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMachineHardwareMutation, UpdateMachineHardwareMutationVariables>;
export const UpdateMachineNameDocument = gql`
    mutation updateMachineName($input: UpdateMachineNameInput!) {
  updateMachineName(input: $input) {
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
      avatar
      createdAt
    }
  }
}
    `;
export type UpdateMachineNameMutationFn = ApolloReactCommon.MutationFunction<UpdateMachineNameMutation, UpdateMachineNameMutationVariables>;

/**
 * __useUpdateMachineNameMutation__
 *
 * To run a mutation, you first call `useUpdateMachineNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMachineNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMachineNameMutation, { data, loading, error }] = useUpdateMachineNameMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMachineNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMachineNameMutation, UpdateMachineNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMachineNameMutation, UpdateMachineNameMutationVariables>(UpdateMachineNameDocument, options);
      }
export type UpdateMachineNameMutationHookResult = ReturnType<typeof useUpdateMachineNameMutation>;
export type UpdateMachineNameMutationResult = ApolloReactCommon.MutationResult<UpdateMachineNameMutation>;
export type UpdateMachineNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMachineNameMutation, UpdateMachineNameMutationVariables>;
export const UpdateMachineUserDocument = gql`
    mutation updateMachineUser($input: UpdateMachineUserInput!) {
  updateMachineUser(input: $input) {
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
      avatar
      createdAt
    }
  }
}
    `;
export type UpdateMachineUserMutationFn = ApolloReactCommon.MutationFunction<UpdateMachineUserMutation, UpdateMachineUserMutationVariables>;

/**
 * __useUpdateMachineUserMutation__
 *
 * To run a mutation, you first call `useUpdateMachineUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMachineUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMachineUserMutation, { data, loading, error }] = useUpdateMachineUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMachineUserMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMachineUserMutation, UpdateMachineUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMachineUserMutation, UpdateMachineUserMutationVariables>(UpdateMachineUserDocument, options);
      }
export type UpdateMachineUserMutationHookResult = ReturnType<typeof useUpdateMachineUserMutation>;
export type UpdateMachineUserMutationResult = ApolloReactCommon.MutationResult<UpdateMachineUserMutation>;
export type UpdateMachineUserMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMachineUserMutation, UpdateMachineUserMutationVariables>;
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
      avatar
      createdAt
    }
  }
}
    `;
export type MoveMachineMutationFn = ApolloReactCommon.MutationFunction<MoveMachineMutation, MoveMachineMutationVariables>;

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
export function useMoveMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<MoveMachineMutation, MoveMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<MoveMachineMutation, MoveMachineMutationVariables>(MoveMachineDocument, options);
      }
export type MoveMachineMutationHookResult = ReturnType<typeof useMoveMachineMutation>;
export type MoveMachineMutationResult = ApolloReactCommon.MutationResult<MoveMachineMutation>;
export type MoveMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<MoveMachineMutation, MoveMachineMutationVariables>;
export const SetupNodeDocument = gql`
    mutation setupNode {
  setupNode {
    value
  }
}
    `;
export type SetupNodeMutationFn = ApolloReactCommon.MutationFunction<SetupNodeMutation, SetupNodeMutationVariables>;

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
export function useSetupNodeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetupNodeMutation, SetupNodeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetupNodeMutation, SetupNodeMutationVariables>(SetupNodeDocument, options);
      }
export type SetupNodeMutationHookResult = ReturnType<typeof useSetupNodeMutation>;
export type SetupNodeMutationResult = ApolloReactCommon.MutationResult<SetupNodeMutation>;
export type SetupNodeMutationOptions = ApolloReactCommon.BaseMutationOptions<SetupNodeMutation, SetupNodeMutationVariables>;
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
export type CreateDepartmentMutationFn = ApolloReactCommon.MutationFunction<CreateDepartmentMutation, CreateDepartmentMutationVariables>;

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
export function useCreateDepartmentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDepartmentMutation, CreateDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateDepartmentMutation, CreateDepartmentMutationVariables>(CreateDepartmentDocument, options);
      }
export type CreateDepartmentMutationHookResult = ReturnType<typeof useCreateDepartmentMutation>;
export type CreateDepartmentMutationResult = ApolloReactCommon.MutationResult<CreateDepartmentMutation>;
export type CreateDepartmentMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDepartmentMutation, CreateDepartmentMutationVariables>;
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
export type DestroyDepartmentMutationFn = ApolloReactCommon.MutationFunction<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>;

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
export function useDestroyDepartmentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>(DestroyDepartmentDocument, options);
      }
export type DestroyDepartmentMutationHookResult = ReturnType<typeof useDestroyDepartmentMutation>;
export type DestroyDepartmentMutationResult = ApolloReactCommon.MutationResult<DestroyDepartmentMutation>;
export type DestroyDepartmentMutationOptions = ApolloReactCommon.BaseMutationOptions<DestroyDepartmentMutation, DestroyDepartmentMutationVariables>;
export const UpdateDepartmentNameDocument = gql`
    mutation updateDepartmentName($input: UpdateDepartmentNameInput!) {
  updateDepartmentName(input: $input) {
    id
    name
    createdAt
    internetSpeed
    ipSubnet
    totalMachines
  }
}
    `;
export type UpdateDepartmentNameMutationFn = ApolloReactCommon.MutationFunction<UpdateDepartmentNameMutation, UpdateDepartmentNameMutationVariables>;

/**
 * __useUpdateDepartmentNameMutation__
 *
 * To run a mutation, you first call `useUpdateDepartmentNameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDepartmentNameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDepartmentNameMutation, { data, loading, error }] = useUpdateDepartmentNameMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDepartmentNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateDepartmentNameMutation, UpdateDepartmentNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateDepartmentNameMutation, UpdateDepartmentNameMutationVariables>(UpdateDepartmentNameDocument, options);
      }
export type UpdateDepartmentNameMutationHookResult = ReturnType<typeof useUpdateDepartmentNameMutation>;
export type UpdateDepartmentNameMutationResult = ApolloReactCommon.MutationResult<UpdateDepartmentNameMutation>;
export type UpdateDepartmentNameMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateDepartmentNameMutation, UpdateDepartmentNameMutationVariables>;
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
export type CreateMachineTemplateCategoryMutationFn = ApolloReactCommon.MutationFunction<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>;

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
export function useCreateMachineTemplateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>(CreateMachineTemplateCategoryDocument, options);
      }
export type CreateMachineTemplateCategoryMutationHookResult = ReturnType<typeof useCreateMachineTemplateCategoryMutation>;
export type CreateMachineTemplateCategoryMutationResult = ApolloReactCommon.MutationResult<CreateMachineTemplateCategoryMutation>;
export type CreateMachineTemplateCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMachineTemplateCategoryMutation, CreateMachineTemplateCategoryMutationVariables>;
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
export type UpdateMachineTemplateCategoryMutationFn = ApolloReactCommon.MutationFunction<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>;

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
export function useUpdateMachineTemplateCategoryMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>(UpdateMachineTemplateCategoryDocument, options);
      }
export type UpdateMachineTemplateCategoryMutationHookResult = ReturnType<typeof useUpdateMachineTemplateCategoryMutation>;
export type UpdateMachineTemplateCategoryMutationResult = ApolloReactCommon.MutationResult<UpdateMachineTemplateCategoryMutation>;
export type UpdateMachineTemplateCategoryMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMachineTemplateCategoryMutation, UpdateMachineTemplateCategoryMutationVariables>;
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
export type CreateApplicationMutationFn = ApolloReactCommon.MutationFunction<CreateApplicationMutation, CreateApplicationMutationVariables>;

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
export function useCreateApplicationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateApplicationMutation, CreateApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateApplicationMutation, CreateApplicationMutationVariables>(CreateApplicationDocument, options);
      }
export type CreateApplicationMutationHookResult = ReturnType<typeof useCreateApplicationMutation>;
export type CreateApplicationMutationResult = ApolloReactCommon.MutationResult<CreateApplicationMutation>;
export type CreateApplicationMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateApplicationMutation, CreateApplicationMutationVariables>;
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
export type UpdateApplicationMutationFn = ApolloReactCommon.MutationFunction<UpdateApplicationMutation, UpdateApplicationMutationVariables>;

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
export function useUpdateApplicationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateApplicationMutation, UpdateApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateApplicationMutation, UpdateApplicationMutationVariables>(UpdateApplicationDocument, options);
      }
export type UpdateApplicationMutationHookResult = ReturnType<typeof useUpdateApplicationMutation>;
export type UpdateApplicationMutationResult = ApolloReactCommon.MutationResult<UpdateApplicationMutation>;
export type UpdateApplicationMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateApplicationMutation, UpdateApplicationMutationVariables>;
export const DeleteApplicationDocument = gql`
    mutation deleteApplication($id: String!) {
  deleteApplication(id: $id)
}
    `;
export type DeleteApplicationMutationFn = ApolloReactCommon.MutationFunction<DeleteApplicationMutation, DeleteApplicationMutationVariables>;

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
export function useDeleteApplicationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteApplicationMutation, DeleteApplicationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteApplicationMutation, DeleteApplicationMutationVariables>(DeleteApplicationDocument, options);
      }
export type DeleteApplicationMutationHookResult = ReturnType<typeof useDeleteApplicationMutation>;
export type DeleteApplicationMutationResult = ApolloReactCommon.MutationResult<DeleteApplicationMutation>;
export type DeleteApplicationMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteApplicationMutation, DeleteApplicationMutationVariables>;
export const CreateNetworkDocument = gql`
    mutation createNetwork($input: CreateNetworkInput!) {
  createNetwork(input: $input)
}
    `;
export type CreateNetworkMutationFn = ApolloReactCommon.MutationFunction<CreateNetworkMutation, CreateNetworkMutationVariables>;

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
export function useCreateNetworkMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateNetworkMutation, CreateNetworkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateNetworkMutation, CreateNetworkMutationVariables>(CreateNetworkDocument, options);
      }
export type CreateNetworkMutationHookResult = ReturnType<typeof useCreateNetworkMutation>;
export type CreateNetworkMutationResult = ApolloReactCommon.MutationResult<CreateNetworkMutation>;
export type CreateNetworkMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateNetworkMutation, CreateNetworkMutationVariables>;
export const SetNetworkIpRangeDocument = gql`
    mutation setNetworkIpRange($input: IpRangeInput!) {
  setNetworkIpRange(input: $input)
}
    `;
export type SetNetworkIpRangeMutationFn = ApolloReactCommon.MutationFunction<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>;

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
export function useSetNetworkIpRangeMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>(SetNetworkIpRangeDocument, options);
      }
export type SetNetworkIpRangeMutationHookResult = ReturnType<typeof useSetNetworkIpRangeMutation>;
export type SetNetworkIpRangeMutationResult = ApolloReactCommon.MutationResult<SetNetworkIpRangeMutation>;
export type SetNetworkIpRangeMutationOptions = ApolloReactCommon.BaseMutationOptions<SetNetworkIpRangeMutation, SetNetworkIpRangeMutationVariables>;
export const SetNetworkIpDocument = gql`
    mutation setNetworkIp($input: NetworkIpInput!) {
  setNetworkIp(input: $input)
}
    `;
export type SetNetworkIpMutationFn = ApolloReactCommon.MutationFunction<SetNetworkIpMutation, SetNetworkIpMutationVariables>;

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
export function useSetNetworkIpMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetNetworkIpMutation, SetNetworkIpMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetNetworkIpMutation, SetNetworkIpMutationVariables>(SetNetworkIpDocument, options);
      }
export type SetNetworkIpMutationHookResult = ReturnType<typeof useSetNetworkIpMutation>;
export type SetNetworkIpMutationResult = ApolloReactCommon.MutationResult<SetNetworkIpMutation>;
export type SetNetworkIpMutationOptions = ApolloReactCommon.BaseMutationOptions<SetNetworkIpMutation, SetNetworkIpMutationVariables>;
export const SetNetworkBridgeNameDocument = gql`
    mutation setNetworkBridgeName($input: BridgeNameInput!) {
  setNetworkBridgeName(input: $input)
}
    `;
export type SetNetworkBridgeNameMutationFn = ApolloReactCommon.MutationFunction<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>;

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
export function useSetNetworkBridgeNameMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>(SetNetworkBridgeNameDocument, options);
      }
export type SetNetworkBridgeNameMutationHookResult = ReturnType<typeof useSetNetworkBridgeNameMutation>;
export type SetNetworkBridgeNameMutationResult = ApolloReactCommon.MutationResult<SetNetworkBridgeNameMutation>;
export type SetNetworkBridgeNameMutationOptions = ApolloReactCommon.BaseMutationOptions<SetNetworkBridgeNameMutation, SetNetworkBridgeNameMutationVariables>;
export const DeleteNetworkDocument = gql`
    mutation deleteNetwork($input: DeleteNetworkInput!) {
  deleteNetwork(input: $input)
}
    `;
export type DeleteNetworkMutationFn = ApolloReactCommon.MutationFunction<DeleteNetworkMutation, DeleteNetworkMutationVariables>;

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
export function useDeleteNetworkMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteNetworkMutation, DeleteNetworkMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteNetworkMutation, DeleteNetworkMutationVariables>(DeleteNetworkDocument, options);
      }
export type DeleteNetworkMutationHookResult = ReturnType<typeof useDeleteNetworkMutation>;
export type DeleteNetworkMutationResult = ApolloReactCommon.MutationResult<DeleteNetworkMutation>;
export type DeleteNetworkMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteNetworkMutation, DeleteNetworkMutationVariables>;
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
export type CreateFilterMutationFn = ApolloReactCommon.MutationFunction<CreateFilterMutation, CreateFilterMutationVariables>;

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
export function useCreateFilterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateFilterMutation, CreateFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateFilterMutation, CreateFilterMutationVariables>(CreateFilterDocument, options);
      }
export type CreateFilterMutationHookResult = ReturnType<typeof useCreateFilterMutation>;
export type CreateFilterMutationResult = ApolloReactCommon.MutationResult<CreateFilterMutation>;
export type CreateFilterMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateFilterMutation, CreateFilterMutationVariables>;
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
export type UpdateFilterMutationFn = ApolloReactCommon.MutationFunction<UpdateFilterMutation, UpdateFilterMutationVariables>;

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
export function useUpdateFilterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateFilterMutation, UpdateFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateFilterMutation, UpdateFilterMutationVariables>(UpdateFilterDocument, options);
      }
export type UpdateFilterMutationHookResult = ReturnType<typeof useUpdateFilterMutation>;
export type UpdateFilterMutationResult = ApolloReactCommon.MutationResult<UpdateFilterMutation>;
export type UpdateFilterMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateFilterMutation, UpdateFilterMutationVariables>;
export const DeleteFilterDocument = gql`
    mutation deleteFilter($id: ID!) {
  deleteFilter(id: $id)
}
    `;
export type DeleteFilterMutationFn = ApolloReactCommon.MutationFunction<DeleteFilterMutation, DeleteFilterMutationVariables>;

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
export function useDeleteFilterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteFilterMutation, DeleteFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteFilterMutation, DeleteFilterMutationVariables>(DeleteFilterDocument, options);
      }
export type DeleteFilterMutationHookResult = ReturnType<typeof useDeleteFilterMutation>;
export type DeleteFilterMutationResult = ApolloReactCommon.MutationResult<DeleteFilterMutation>;
export type DeleteFilterMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteFilterMutation, DeleteFilterMutationVariables>;
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
export type CreateFilterRuleMutationFn = ApolloReactCommon.MutationFunction<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>;

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
export function useCreateFilterRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>(CreateFilterRuleDocument, options);
      }
export type CreateFilterRuleMutationHookResult = ReturnType<typeof useCreateFilterRuleMutation>;
export type CreateFilterRuleMutationResult = ApolloReactCommon.MutationResult<CreateFilterRuleMutation>;
export type CreateFilterRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateFilterRuleMutation, CreateFilterRuleMutationVariables>;
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
export type UpdateFilterRuleMutationFn = ApolloReactCommon.MutationFunction<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>;

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
export function useUpdateFilterRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>(UpdateFilterRuleDocument, options);
      }
export type UpdateFilterRuleMutationHookResult = ReturnType<typeof useUpdateFilterRuleMutation>;
export type UpdateFilterRuleMutationResult = ApolloReactCommon.MutationResult<UpdateFilterRuleMutation>;
export type UpdateFilterRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateFilterRuleMutation, UpdateFilterRuleMutationVariables>;
export const DeleteFilterRuleDocument = gql`
    mutation deleteFilterRule($id: ID!) {
  deleteFilterRule(id: $id)
}
    `;
export type DeleteFilterRuleMutationFn = ApolloReactCommon.MutationFunction<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>;

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
export function useDeleteFilterRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>(DeleteFilterRuleDocument, options);
      }
export type DeleteFilterRuleMutationHookResult = ReturnType<typeof useDeleteFilterRuleMutation>;
export type DeleteFilterRuleMutationResult = ApolloReactCommon.MutationResult<DeleteFilterRuleMutation>;
export type DeleteFilterRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteFilterRuleMutation, DeleteFilterRuleMutationVariables>;
export const FlushFilterDocument = gql`
    mutation flushFilter($filterId: ID!) {
  flushFilter(filterId: $filterId)
}
    `;
export type FlushFilterMutationFn = ApolloReactCommon.MutationFunction<FlushFilterMutation, FlushFilterMutationVariables>;

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
export function useFlushFilterMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<FlushFilterMutation, FlushFilterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<FlushFilterMutation, FlushFilterMutationVariables>(FlushFilterDocument, options);
      }
export type FlushFilterMutationHookResult = ReturnType<typeof useFlushFilterMutation>;
export type FlushFilterMutationResult = ApolloReactCommon.MutationResult<FlushFilterMutation>;
export type FlushFilterMutationOptions = ApolloReactCommon.BaseMutationOptions<FlushFilterMutation, FlushFilterMutationVariables>;
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
export type ToggleVmServiceMutationFn = ApolloReactCommon.MutationFunction<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>;

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
export function useToggleVmServiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>(ToggleVmServiceDocument, options);
      }
export type ToggleVmServiceMutationHookResult = ReturnType<typeof useToggleVmServiceMutation>;
export type ToggleVmServiceMutationResult = ApolloReactCommon.MutationResult<ToggleVmServiceMutation>;
export type ToggleVmServiceMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleVmServiceMutation, ToggleVmServiceMutationVariables>;
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
export type ToggleDepartmentServiceMutationFn = ApolloReactCommon.MutationFunction<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>;

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
export function useToggleDepartmentServiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>(ToggleDepartmentServiceDocument, options);
      }
export type ToggleDepartmentServiceMutationHookResult = ReturnType<typeof useToggleDepartmentServiceMutation>;
export type ToggleDepartmentServiceMutationResult = ApolloReactCommon.MutationResult<ToggleDepartmentServiceMutation>;
export type ToggleDepartmentServiceMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleDepartmentServiceMutation, ToggleDepartmentServiceMutationVariables>;
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
export type ToggleGlobalServiceMutationFn = ApolloReactCommon.MutationFunction<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>;

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
export function useToggleGlobalServiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>(ToggleGlobalServiceDocument, options);
      }
export type ToggleGlobalServiceMutationHookResult = ReturnType<typeof useToggleGlobalServiceMutation>;
export type ToggleGlobalServiceMutationResult = ApolloReactCommon.MutationResult<ToggleGlobalServiceMutation>;
export type ToggleGlobalServiceMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleGlobalServiceMutation, ToggleGlobalServiceMutationVariables>;
export const RunDefenderQuickScanDocument = gql`
    mutation runDefenderQuickScan($vmId: ID!) {
  runDefenderQuickScan(vmId: $vmId) {
    success
    error
    vmId
    scanType
    scanDuration
    threatsFound
    filesScanned
    timestamp
  }
}
    `;
export type RunDefenderQuickScanMutationFn = ApolloReactCommon.MutationFunction<RunDefenderQuickScanMutation, RunDefenderQuickScanMutationVariables>;

/**
 * __useRunDefenderQuickScanMutation__
 *
 * To run a mutation, you first call `useRunDefenderQuickScanMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRunDefenderQuickScanMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [runDefenderQuickScanMutation, { data, loading, error }] = useRunDefenderQuickScanMutation({
 *   variables: {
 *      vmId: // value for 'vmId'
 *   },
 * });
 */
export function useRunDefenderQuickScanMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RunDefenderQuickScanMutation, RunDefenderQuickScanMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RunDefenderQuickScanMutation, RunDefenderQuickScanMutationVariables>(RunDefenderQuickScanDocument, options);
      }
export type RunDefenderQuickScanMutationHookResult = ReturnType<typeof useRunDefenderQuickScanMutation>;
export type RunDefenderQuickScanMutationResult = ApolloReactCommon.MutationResult<RunDefenderQuickScanMutation>;
export type RunDefenderQuickScanMutationOptions = ApolloReactCommon.BaseMutationOptions<RunDefenderQuickScanMutation, RunDefenderQuickScanMutationVariables>;
export const PerformDiskCleanupDocument = gql`
    mutation performDiskCleanup($vmId: ID!, $drive: String!, $targets: [String!]) {
  performDiskCleanup(vmId: $vmId, drive: $drive, targets: $targets) {
    success
    error
    vmId
    drive
    spaceClearedMB
    filesDeleted
    targetsProcessed
    timestamp
  }
}
    `;
export type PerformDiskCleanupMutationFn = ApolloReactCommon.MutationFunction<PerformDiskCleanupMutation, PerformDiskCleanupMutationVariables>;

/**
 * __usePerformDiskCleanupMutation__
 *
 * To run a mutation, you first call `usePerformDiskCleanupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePerformDiskCleanupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [performDiskCleanupMutation, { data, loading, error }] = usePerformDiskCleanupMutation({
 *   variables: {
 *      vmId: // value for 'vmId'
 *      drive: // value for 'drive'
 *      targets: // value for 'targets'
 *   },
 * });
 */
export function usePerformDiskCleanupMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PerformDiskCleanupMutation, PerformDiskCleanupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PerformDiskCleanupMutation, PerformDiskCleanupMutationVariables>(PerformDiskCleanupDocument, options);
      }
export type PerformDiskCleanupMutationHookResult = ReturnType<typeof usePerformDiskCleanupMutation>;
export type PerformDiskCleanupMutationResult = ApolloReactCommon.MutationResult<PerformDiskCleanupMutation>;
export type PerformDiskCleanupMutationOptions = ApolloReactCommon.BaseMutationOptions<PerformDiskCleanupMutation, PerformDiskCleanupMutationVariables>;
export const ApplyFirewallTemplateDocument = gql`
    mutation applyFirewallTemplate($input: ApplyFirewallTemplateInput!) {
  applyFirewallTemplate(input: $input) {
    appliedTemplates
    customRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    effectiveRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    lastSync
  }
}
    `;
export type ApplyFirewallTemplateMutationFn = ApolloReactCommon.MutationFunction<ApplyFirewallTemplateMutation, ApplyFirewallTemplateMutationVariables>;

/**
 * __useApplyFirewallTemplateMutation__
 *
 * To run a mutation, you first call `useApplyFirewallTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApplyFirewallTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [applyFirewallTemplateMutation, { data, loading, error }] = useApplyFirewallTemplateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useApplyFirewallTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ApplyFirewallTemplateMutation, ApplyFirewallTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ApplyFirewallTemplateMutation, ApplyFirewallTemplateMutationVariables>(ApplyFirewallTemplateDocument, options);
      }
export type ApplyFirewallTemplateMutationHookResult = ReturnType<typeof useApplyFirewallTemplateMutation>;
export type ApplyFirewallTemplateMutationResult = ApolloReactCommon.MutationResult<ApplyFirewallTemplateMutation>;
export type ApplyFirewallTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<ApplyFirewallTemplateMutation, ApplyFirewallTemplateMutationVariables>;
export const RemoveFirewallTemplateDocument = gql`
    mutation removeFirewallTemplate($machineId: ID!, $template: FirewallTemplate!) {
  removeFirewallTemplate(machineId: $machineId, template: $template) {
    appliedTemplates
    customRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    effectiveRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    lastSync
  }
}
    `;
export type RemoveFirewallTemplateMutationFn = ApolloReactCommon.MutationFunction<RemoveFirewallTemplateMutation, RemoveFirewallTemplateMutationVariables>;

/**
 * __useRemoveFirewallTemplateMutation__
 *
 * To run a mutation, you first call `useRemoveFirewallTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFirewallTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFirewallTemplateMutation, { data, loading, error }] = useRemoveFirewallTemplateMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      template: // value for 'template'
 *   },
 * });
 */
export function useRemoveFirewallTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveFirewallTemplateMutation, RemoveFirewallTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveFirewallTemplateMutation, RemoveFirewallTemplateMutationVariables>(RemoveFirewallTemplateDocument, options);
      }
export type RemoveFirewallTemplateMutationHookResult = ReturnType<typeof useRemoveFirewallTemplateMutation>;
export type RemoveFirewallTemplateMutationResult = ApolloReactCommon.MutationResult<RemoveFirewallTemplateMutation>;
export type RemoveFirewallTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveFirewallTemplateMutation, RemoveFirewallTemplateMutationVariables>;
export const CreateSimplifiedFirewallRuleDocument = gql`
    mutation createSimplifiedFirewallRule($input: CreateSimplifiedFirewallRuleInput!) {
  createSimplifiedFirewallRule(input: $input) {
    appliedTemplates
    customRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    effectiveRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    lastSync
  }
}
    `;
export type CreateSimplifiedFirewallRuleMutationFn = ApolloReactCommon.MutationFunction<CreateSimplifiedFirewallRuleMutation, CreateSimplifiedFirewallRuleMutationVariables>;

/**
 * __useCreateSimplifiedFirewallRuleMutation__
 *
 * To run a mutation, you first call `useCreateSimplifiedFirewallRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSimplifiedFirewallRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSimplifiedFirewallRuleMutation, { data, loading, error }] = useCreateSimplifiedFirewallRuleMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSimplifiedFirewallRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSimplifiedFirewallRuleMutation, CreateSimplifiedFirewallRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSimplifiedFirewallRuleMutation, CreateSimplifiedFirewallRuleMutationVariables>(CreateSimplifiedFirewallRuleDocument, options);
      }
export type CreateSimplifiedFirewallRuleMutationHookResult = ReturnType<typeof useCreateSimplifiedFirewallRuleMutation>;
export type CreateSimplifiedFirewallRuleMutationResult = ApolloReactCommon.MutationResult<CreateSimplifiedFirewallRuleMutation>;
export type CreateSimplifiedFirewallRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSimplifiedFirewallRuleMutation, CreateSimplifiedFirewallRuleMutationVariables>;
export const RemoveSimplifiedFirewallRuleDocument = gql`
    mutation removeSimplifiedFirewallRule($machineId: ID!, $ruleId: ID!) {
  removeSimplifiedFirewallRule(machineId: $machineId, ruleId: $ruleId) {
    appliedTemplates
    customRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    effectiveRules {
      id
      port
      protocol
      direction
      action
      description
      sources
    }
    lastSync
  }
}
    `;
export type RemoveSimplifiedFirewallRuleMutationFn = ApolloReactCommon.MutationFunction<RemoveSimplifiedFirewallRuleMutation, RemoveSimplifiedFirewallRuleMutationVariables>;

/**
 * __useRemoveSimplifiedFirewallRuleMutation__
 *
 * To run a mutation, you first call `useRemoveSimplifiedFirewallRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSimplifiedFirewallRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSimplifiedFirewallRuleMutation, { data, loading, error }] = useRemoveSimplifiedFirewallRuleMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      ruleId: // value for 'ruleId'
 *   },
 * });
 */
export function useRemoveSimplifiedFirewallRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemoveSimplifiedFirewallRuleMutation, RemoveSimplifiedFirewallRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemoveSimplifiedFirewallRuleMutation, RemoveSimplifiedFirewallRuleMutationVariables>(RemoveSimplifiedFirewallRuleDocument, options);
      }
export type RemoveSimplifiedFirewallRuleMutationHookResult = ReturnType<typeof useRemoveSimplifiedFirewallRuleMutation>;
export type RemoveSimplifiedFirewallRuleMutationResult = ApolloReactCommon.MutationResult<RemoveSimplifiedFirewallRuleMutation>;
export type RemoveSimplifiedFirewallRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<RemoveSimplifiedFirewallRuleMutation, RemoveSimplifiedFirewallRuleMutationVariables>;
export const CreateMaintenanceTaskDocument = gql`
    mutation createMaintenanceTask($input: CreateMaintenanceTaskInput!) {
  createMaintenanceTask(input: $input) {
    success
    message
    task {
      id
      machineId
      taskType
      name
      description
      isEnabled
      isRecurring
      cronSchedule
      nextRunAt
      lastRunAt
      runAt
      executionStatus
      parameters
      createdByUserId
      createdAt
      updatedAt
    }
    error
  }
}
    `;
export type CreateMaintenanceTaskMutationFn = ApolloReactCommon.MutationFunction<CreateMaintenanceTaskMutation, CreateMaintenanceTaskMutationVariables>;

/**
 * __useCreateMaintenanceTaskMutation__
 *
 * To run a mutation, you first call `useCreateMaintenanceTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMaintenanceTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMaintenanceTaskMutation, { data, loading, error }] = useCreateMaintenanceTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMaintenanceTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMaintenanceTaskMutation, CreateMaintenanceTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMaintenanceTaskMutation, CreateMaintenanceTaskMutationVariables>(CreateMaintenanceTaskDocument, options);
      }
export type CreateMaintenanceTaskMutationHookResult = ReturnType<typeof useCreateMaintenanceTaskMutation>;
export type CreateMaintenanceTaskMutationResult = ApolloReactCommon.MutationResult<CreateMaintenanceTaskMutation>;
export type CreateMaintenanceTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMaintenanceTaskMutation, CreateMaintenanceTaskMutationVariables>;
export const UpdateMaintenanceTaskDocument = gql`
    mutation updateMaintenanceTask($input: UpdateMaintenanceTaskInput!) {
  updateMaintenanceTask(input: $input) {
    success
    message
    task {
      id
      machineId
      taskType
      name
      description
      isEnabled
      isRecurring
      cronSchedule
      nextRunAt
      lastRunAt
      runAt
      executionStatus
      parameters
      createdByUserId
      createdAt
      updatedAt
    }
    error
  }
}
    `;
export type UpdateMaintenanceTaskMutationFn = ApolloReactCommon.MutationFunction<UpdateMaintenanceTaskMutation, UpdateMaintenanceTaskMutationVariables>;

/**
 * __useUpdateMaintenanceTaskMutation__
 *
 * To run a mutation, you first call `useUpdateMaintenanceTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMaintenanceTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMaintenanceTaskMutation, { data, loading, error }] = useUpdateMaintenanceTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMaintenanceTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateMaintenanceTaskMutation, UpdateMaintenanceTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateMaintenanceTaskMutation, UpdateMaintenanceTaskMutationVariables>(UpdateMaintenanceTaskDocument, options);
      }
export type UpdateMaintenanceTaskMutationHookResult = ReturnType<typeof useUpdateMaintenanceTaskMutation>;
export type UpdateMaintenanceTaskMutationResult = ApolloReactCommon.MutationResult<UpdateMaintenanceTaskMutation>;
export type UpdateMaintenanceTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateMaintenanceTaskMutation, UpdateMaintenanceTaskMutationVariables>;
export const DeleteMaintenanceTaskDocument = gql`
    mutation deleteMaintenanceTask($id: ID!) {
  deleteMaintenanceTask(id: $id) {
    success
    message
    error
  }
}
    `;
export type DeleteMaintenanceTaskMutationFn = ApolloReactCommon.MutationFunction<DeleteMaintenanceTaskMutation, DeleteMaintenanceTaskMutationVariables>;

/**
 * __useDeleteMaintenanceTaskMutation__
 *
 * To run a mutation, you first call `useDeleteMaintenanceTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMaintenanceTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMaintenanceTaskMutation, { data, loading, error }] = useDeleteMaintenanceTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteMaintenanceTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteMaintenanceTaskMutation, DeleteMaintenanceTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteMaintenanceTaskMutation, DeleteMaintenanceTaskMutationVariables>(DeleteMaintenanceTaskDocument, options);
      }
export type DeleteMaintenanceTaskMutationHookResult = ReturnType<typeof useDeleteMaintenanceTaskMutation>;
export type DeleteMaintenanceTaskMutationResult = ApolloReactCommon.MutationResult<DeleteMaintenanceTaskMutation>;
export type DeleteMaintenanceTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteMaintenanceTaskMutation, DeleteMaintenanceTaskMutationVariables>;
export const ExecuteMaintenanceTaskDocument = gql`
    mutation executeMaintenanceTask($taskId: ID!) {
  executeMaintenanceTask(taskId: $taskId) {
    success
    message
    execution {
      id
      taskId
      machineId
      taskType
      status
      triggeredBy
      executedByUserId
      executedAt
      duration
      result
      error
      parameters
    }
    error
  }
}
    `;
export type ExecuteMaintenanceTaskMutationFn = ApolloReactCommon.MutationFunction<ExecuteMaintenanceTaskMutation, ExecuteMaintenanceTaskMutationVariables>;

/**
 * __useExecuteMaintenanceTaskMutation__
 *
 * To run a mutation, you first call `useExecuteMaintenanceTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteMaintenanceTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeMaintenanceTaskMutation, { data, loading, error }] = useExecuteMaintenanceTaskMutation({
 *   variables: {
 *      taskId: // value for 'taskId'
 *   },
 * });
 */
export function useExecuteMaintenanceTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ExecuteMaintenanceTaskMutation, ExecuteMaintenanceTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ExecuteMaintenanceTaskMutation, ExecuteMaintenanceTaskMutationVariables>(ExecuteMaintenanceTaskDocument, options);
      }
export type ExecuteMaintenanceTaskMutationHookResult = ReturnType<typeof useExecuteMaintenanceTaskMutation>;
export type ExecuteMaintenanceTaskMutationResult = ApolloReactCommon.MutationResult<ExecuteMaintenanceTaskMutation>;
export type ExecuteMaintenanceTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<ExecuteMaintenanceTaskMutation, ExecuteMaintenanceTaskMutationVariables>;
export const ExecuteImmediateMaintenanceDocument = gql`
    mutation executeImmediateMaintenance($input: ExecuteMaintenanceInput!) {
  executeImmediateMaintenance(input: $input) {
    success
    message
    execution {
      id
      taskId
      machineId
      taskType
      status
      triggeredBy
      executedByUserId
      executedAt
      duration
      result
      error
      parameters
    }
    error
  }
}
    `;
export type ExecuteImmediateMaintenanceMutationFn = ApolloReactCommon.MutationFunction<ExecuteImmediateMaintenanceMutation, ExecuteImmediateMaintenanceMutationVariables>;

/**
 * __useExecuteImmediateMaintenanceMutation__
 *
 * To run a mutation, you first call `useExecuteImmediateMaintenanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteImmediateMaintenanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeImmediateMaintenanceMutation, { data, loading, error }] = useExecuteImmediateMaintenanceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExecuteImmediateMaintenanceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ExecuteImmediateMaintenanceMutation, ExecuteImmediateMaintenanceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ExecuteImmediateMaintenanceMutation, ExecuteImmediateMaintenanceMutationVariables>(ExecuteImmediateMaintenanceDocument, options);
      }
export type ExecuteImmediateMaintenanceMutationHookResult = ReturnType<typeof useExecuteImmediateMaintenanceMutation>;
export type ExecuteImmediateMaintenanceMutationResult = ApolloReactCommon.MutationResult<ExecuteImmediateMaintenanceMutation>;
export type ExecuteImmediateMaintenanceMutationOptions = ApolloReactCommon.BaseMutationOptions<ExecuteImmediateMaintenanceMutation, ExecuteImmediateMaintenanceMutationVariables>;
export const ToggleMaintenanceTaskDocument = gql`
    mutation toggleMaintenanceTask($id: ID!, $enabled: Boolean!) {
  toggleMaintenanceTask(id: $id, enabled: $enabled) {
    success
    message
    task {
      id
      machineId
      taskType
      name
      description
      isEnabled
      isRecurring
      cronSchedule
      nextRunAt
      lastRunAt
      runAt
      executionStatus
      parameters
      createdByUserId
      createdAt
      updatedAt
    }
    error
  }
}
    `;
export type ToggleMaintenanceTaskMutationFn = ApolloReactCommon.MutationFunction<ToggleMaintenanceTaskMutation, ToggleMaintenanceTaskMutationVariables>;

/**
 * __useToggleMaintenanceTaskMutation__
 *
 * To run a mutation, you first call `useToggleMaintenanceTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleMaintenanceTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleMaintenanceTaskMutation, { data, loading, error }] = useToggleMaintenanceTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      enabled: // value for 'enabled'
 *   },
 * });
 */
export function useToggleMaintenanceTaskMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ToggleMaintenanceTaskMutation, ToggleMaintenanceTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ToggleMaintenanceTaskMutation, ToggleMaintenanceTaskMutationVariables>(ToggleMaintenanceTaskDocument, options);
      }
export type ToggleMaintenanceTaskMutationHookResult = ReturnType<typeof useToggleMaintenanceTaskMutation>;
export type ToggleMaintenanceTaskMutationResult = ApolloReactCommon.MutationResult<ToggleMaintenanceTaskMutation>;
export type ToggleMaintenanceTaskMutationOptions = ApolloReactCommon.BaseMutationOptions<ToggleMaintenanceTaskMutation, ToggleMaintenanceTaskMutationVariables>;
export const RestartMachineDocument = gql`
    mutation restartMachine($id: String!) {
  restartMachine(id: $id) {
    success
    message
  }
}
    `;
export type RestartMachineMutationFn = ApolloReactCommon.MutationFunction<RestartMachineMutation, RestartMachineMutationVariables>;

/**
 * __useRestartMachineMutation__
 *
 * To run a mutation, you first call `useRestartMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestartMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restartMachineMutation, { data, loading, error }] = useRestartMachineMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRestartMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RestartMachineMutation, RestartMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RestartMachineMutation, RestartMachineMutationVariables>(RestartMachineDocument, options);
      }
export type RestartMachineMutationHookResult = ReturnType<typeof useRestartMachineMutation>;
export type RestartMachineMutationResult = ApolloReactCommon.MutationResult<RestartMachineMutation>;
export type RestartMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<RestartMachineMutation, RestartMachineMutationVariables>;
export const ForcePowerOffDocument = gql`
    mutation forcePowerOff($id: String!) {
  forcePowerOff(id: $id) {
    success
    message
  }
}
    `;
export type ForcePowerOffMutationFn = ApolloReactCommon.MutationFunction<ForcePowerOffMutation, ForcePowerOffMutationVariables>;

/**
 * __useForcePowerOffMutation__
 *
 * To run a mutation, you first call `useForcePowerOffMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForcePowerOffMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forcePowerOffMutation, { data, loading, error }] = useForcePowerOffMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useForcePowerOffMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ForcePowerOffMutation, ForcePowerOffMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ForcePowerOffMutation, ForcePowerOffMutationVariables>(ForcePowerOffDocument, options);
      }
export type ForcePowerOffMutationHookResult = ReturnType<typeof useForcePowerOffMutation>;
export type ForcePowerOffMutationResult = ApolloReactCommon.MutationResult<ForcePowerOffMutation>;
export type ForcePowerOffMutationOptions = ApolloReactCommon.BaseMutationOptions<ForcePowerOffMutation, ForcePowerOffMutationVariables>;
export const ResetMachineDocument = gql`
    mutation resetMachine($id: String!) {
  resetMachine(id: $id) {
    success
    message
  }
}
    `;
export type ResetMachineMutationFn = ApolloReactCommon.MutationFunction<ResetMachineMutation, ResetMachineMutationVariables>;

/**
 * __useResetMachineMutation__
 *
 * To run a mutation, you first call `useResetMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetMachineMutation, { data, loading, error }] = useResetMachineMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useResetMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ResetMachineMutation, ResetMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ResetMachineMutation, ResetMachineMutationVariables>(ResetMachineDocument, options);
      }
export type ResetMachineMutationHookResult = ReturnType<typeof useResetMachineMutation>;
export type ResetMachineMutationResult = ApolloReactCommon.MutationResult<ResetMachineMutation>;
export type ResetMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<ResetMachineMutation, ResetMachineMutationVariables>;
export const PowerOnMachineDocument = gql`
    mutation powerOnMachine($id: String!) {
  powerOn(id: $id) {
    success
    message
  }
}
    `;
export type PowerOnMachineMutationFn = ApolloReactCommon.MutationFunction<PowerOnMachineMutation, PowerOnMachineMutationVariables>;

/**
 * __usePowerOnMachineMutation__
 *
 * To run a mutation, you first call `usePowerOnMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePowerOnMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [powerOnMachineMutation, { data, loading, error }] = usePowerOnMachineMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePowerOnMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PowerOnMachineMutation, PowerOnMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PowerOnMachineMutation, PowerOnMachineMutationVariables>(PowerOnMachineDocument, options);
      }
export type PowerOnMachineMutationHookResult = ReturnType<typeof usePowerOnMachineMutation>;
export type PowerOnMachineMutationResult = ApolloReactCommon.MutationResult<PowerOnMachineMutation>;
export type PowerOnMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<PowerOnMachineMutation, PowerOnMachineMutationVariables>;
export const PowerOffMachineDocument = gql`
    mutation powerOffMachine($id: String!) {
  powerOff(id: $id) {
    success
    message
  }
}
    `;
export type PowerOffMachineMutationFn = ApolloReactCommon.MutationFunction<PowerOffMachineMutation, PowerOffMachineMutationVariables>;

/**
 * __usePowerOffMachineMutation__
 *
 * To run a mutation, you first call `usePowerOffMachineMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePowerOffMachineMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [powerOffMachineMutation, { data, loading, error }] = usePowerOffMachineMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function usePowerOffMachineMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<PowerOffMachineMutation, PowerOffMachineMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<PowerOffMachineMutation, PowerOffMachineMutationVariables>(PowerOffMachineDocument, options);
      }
export type PowerOffMachineMutationHookResult = ReturnType<typeof usePowerOffMachineMutation>;
export type PowerOffMachineMutationResult = ApolloReactCommon.MutationResult<PowerOffMachineMutation>;
export type PowerOffMachineMutationOptions = ApolloReactCommon.BaseMutationOptions<PowerOffMachineMutation, PowerOffMachineMutationVariables>;
export const ManagePackageDocument = gql`
    mutation managePackage($input: PackageManagementInput!) {
  managePackage(input: $input) {
    success
    message
    stdout
    stderr
    error
    packages {
      name
      version
      description
      installed
      publisher
      source
    }
  }
}
    `;
export type ManagePackageMutationFn = ApolloReactCommon.MutationFunction<ManagePackageMutation, ManagePackageMutationVariables>;

/**
 * __useManagePackageMutation__
 *
 * To run a mutation, you first call `useManagePackageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useManagePackageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [managePackageMutation, { data, loading, error }] = useManagePackageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useManagePackageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ManagePackageMutation, ManagePackageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ManagePackageMutation, ManagePackageMutationVariables>(ManagePackageDocument, options);
      }
export type ManagePackageMutationHookResult = ReturnType<typeof useManagePackageMutation>;
export type ManagePackageMutationResult = ApolloReactCommon.MutationResult<ManagePackageMutation>;
export type ManagePackageMutationOptions = ApolloReactCommon.BaseMutationOptions<ManagePackageMutation, ManagePackageMutationVariables>;
export const InstallPackageDocument = gql`
    mutation installPackage($machineId: ID!, $packageName: String!) {
  installPackage(machineId: $machineId, packageName: $packageName) {
    success
    output
    stdout
    stderr
    error
  }
}
    `;
export type InstallPackageMutationFn = ApolloReactCommon.MutationFunction<InstallPackageMutation, InstallPackageMutationVariables>;

/**
 * __useInstallPackageMutation__
 *
 * To run a mutation, you first call `useInstallPackageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInstallPackageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [installPackageMutation, { data, loading, error }] = useInstallPackageMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      packageName: // value for 'packageName'
 *   },
 * });
 */
export function useInstallPackageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<InstallPackageMutation, InstallPackageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<InstallPackageMutation, InstallPackageMutationVariables>(InstallPackageDocument, options);
      }
export type InstallPackageMutationHookResult = ReturnType<typeof useInstallPackageMutation>;
export type InstallPackageMutationResult = ApolloReactCommon.MutationResult<InstallPackageMutation>;
export type InstallPackageMutationOptions = ApolloReactCommon.BaseMutationOptions<InstallPackageMutation, InstallPackageMutationVariables>;
export const RemovePackageDocument = gql`
    mutation removePackage($machineId: ID!, $packageName: String!) {
  removePackage(machineId: $machineId, packageName: $packageName) {
    success
    output
    stdout
    stderr
    error
  }
}
    `;
export type RemovePackageMutationFn = ApolloReactCommon.MutationFunction<RemovePackageMutation, RemovePackageMutationVariables>;

/**
 * __useRemovePackageMutation__
 *
 * To run a mutation, you first call `useRemovePackageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemovePackageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removePackageMutation, { data, loading, error }] = useRemovePackageMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      packageName: // value for 'packageName'
 *   },
 * });
 */
export function useRemovePackageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RemovePackageMutation, RemovePackageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RemovePackageMutation, RemovePackageMutationVariables>(RemovePackageDocument, options);
      }
export type RemovePackageMutationHookResult = ReturnType<typeof useRemovePackageMutation>;
export type RemovePackageMutationResult = ApolloReactCommon.MutationResult<RemovePackageMutation>;
export type RemovePackageMutationOptions = ApolloReactCommon.BaseMutationOptions<RemovePackageMutation, RemovePackageMutationVariables>;
export const UpdatePackageDocument = gql`
    mutation updatePackage($machineId: ID!, $packageName: String!) {
  updatePackage(machineId: $machineId, packageName: $packageName) {
    success
    output
    stdout
    stderr
    error
  }
}
    `;
export type UpdatePackageMutationFn = ApolloReactCommon.MutationFunction<UpdatePackageMutation, UpdatePackageMutationVariables>;

/**
 * __useUpdatePackageMutation__
 *
 * To run a mutation, you first call `useUpdatePackageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePackageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePackageMutation, { data, loading, error }] = useUpdatePackageMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      packageName: // value for 'packageName'
 *   },
 * });
 */
export function useUpdatePackageMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdatePackageMutation, UpdatePackageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdatePackageMutation, UpdatePackageMutationVariables>(UpdatePackageDocument, options);
      }
export type UpdatePackageMutationHookResult = ReturnType<typeof useUpdatePackageMutation>;
export type UpdatePackageMutationResult = ApolloReactCommon.MutationResult<UpdatePackageMutation>;
export type UpdatePackageMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdatePackageMutation, UpdatePackageMutationVariables>;
export const KillProcessDocument = gql`
    mutation killProcess($machineId: String!, $pid: Int!, $force: Boolean = false) {
  killProcess(machineId: $machineId, pid: $pid, force: $force) {
    success
    message
    pid
    processName
    error
  }
}
    `;
export type KillProcessMutationFn = ApolloReactCommon.MutationFunction<KillProcessMutation, KillProcessMutationVariables>;

/**
 * __useKillProcessMutation__
 *
 * To run a mutation, you first call `useKillProcessMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useKillProcessMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [killProcessMutation, { data, loading, error }] = useKillProcessMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      pid: // value for 'pid'
 *      force: // value for 'force'
 *   },
 * });
 */
export function useKillProcessMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<KillProcessMutation, KillProcessMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<KillProcessMutation, KillProcessMutationVariables>(KillProcessDocument, options);
      }
export type KillProcessMutationHookResult = ReturnType<typeof useKillProcessMutation>;
export type KillProcessMutationResult = ApolloReactCommon.MutationResult<KillProcessMutation>;
export type KillProcessMutationOptions = ApolloReactCommon.BaseMutationOptions<KillProcessMutation, KillProcessMutationVariables>;
export const KillProcessesDocument = gql`
    mutation killProcesses($machineId: String!, $pids: [Int!]!, $force: Boolean = false) {
  killProcesses(machineId: $machineId, pids: $pids, force: $force) {
    success
    message
    pid
    processName
    error
  }
}
    `;
export type KillProcessesMutationFn = ApolloReactCommon.MutationFunction<KillProcessesMutation, KillProcessesMutationVariables>;

/**
 * __useKillProcessesMutation__
 *
 * To run a mutation, you first call `useKillProcessesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useKillProcessesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [killProcessesMutation, { data, loading, error }] = useKillProcessesMutation({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      pids: // value for 'pids'
 *      force: // value for 'force'
 *   },
 * });
 */
export function useKillProcessesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<KillProcessesMutation, KillProcessesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<KillProcessesMutation, KillProcessesMutationVariables>(KillProcessesDocument, options);
      }
export type KillProcessesMutationHookResult = ReturnType<typeof useKillProcessesMutation>;
export type KillProcessesMutationResult = ApolloReactCommon.MutationResult<KillProcessesMutation>;
export type KillProcessesMutationOptions = ApolloReactCommon.BaseMutationOptions<KillProcessesMutation, KillProcessesMutationVariables>;
export const ExecuteImmediateMaintenanceFromRecommendationsDocument = gql`
    mutation executeImmediateMaintenanceFromRecommendations($input: ExecuteMaintenanceInput!) {
  executeImmediateMaintenance(input: $input) {
    success
    error
    message
    execution {
      id
      machineId
      taskType
      status
      executedAt
      duration
      result
    }
  }
}
    `;
export type ExecuteImmediateMaintenanceFromRecommendationsMutationFn = ApolloReactCommon.MutationFunction<ExecuteImmediateMaintenanceFromRecommendationsMutation, ExecuteImmediateMaintenanceFromRecommendationsMutationVariables>;

/**
 * __useExecuteImmediateMaintenanceFromRecommendationsMutation__
 *
 * To run a mutation, you first call `useExecuteImmediateMaintenanceFromRecommendationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteImmediateMaintenanceFromRecommendationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeImmediateMaintenanceFromRecommendationsMutation, { data, loading, error }] = useExecuteImmediateMaintenanceFromRecommendationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExecuteImmediateMaintenanceFromRecommendationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ExecuteImmediateMaintenanceFromRecommendationsMutation, ExecuteImmediateMaintenanceFromRecommendationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ExecuteImmediateMaintenanceFromRecommendationsMutation, ExecuteImmediateMaintenanceFromRecommendationsMutationVariables>(ExecuteImmediateMaintenanceFromRecommendationsDocument, options);
      }
export type ExecuteImmediateMaintenanceFromRecommendationsMutationHookResult = ReturnType<typeof useExecuteImmediateMaintenanceFromRecommendationsMutation>;
export type ExecuteImmediateMaintenanceFromRecommendationsMutationResult = ApolloReactCommon.MutationResult<ExecuteImmediateMaintenanceFromRecommendationsMutation>;
export type ExecuteImmediateMaintenanceFromRecommendationsMutationOptions = ApolloReactCommon.BaseMutationOptions<ExecuteImmediateMaintenanceFromRecommendationsMutation, ExecuteImmediateMaintenanceFromRecommendationsMutationVariables>;
export const CreateMaintenanceTaskFromRecommendationsDocument = gql`
    mutation createMaintenanceTaskFromRecommendations($input: CreateMaintenanceTaskInput!) {
  createMaintenanceTask(input: $input) {
    success
    error
    message
    task {
      id
      name
      description
      taskType
      machineId
      isEnabled
      isRecurring
      runAt
      cronSchedule
      createdAt
    }
  }
}
    `;
export type CreateMaintenanceTaskFromRecommendationsMutationFn = ApolloReactCommon.MutationFunction<CreateMaintenanceTaskFromRecommendationsMutation, CreateMaintenanceTaskFromRecommendationsMutationVariables>;

/**
 * __useCreateMaintenanceTaskFromRecommendationsMutation__
 *
 * To run a mutation, you first call `useCreateMaintenanceTaskFromRecommendationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMaintenanceTaskFromRecommendationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMaintenanceTaskFromRecommendationsMutation, { data, loading, error }] = useCreateMaintenanceTaskFromRecommendationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateMaintenanceTaskFromRecommendationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateMaintenanceTaskFromRecommendationsMutation, CreateMaintenanceTaskFromRecommendationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateMaintenanceTaskFromRecommendationsMutation, CreateMaintenanceTaskFromRecommendationsMutationVariables>(CreateMaintenanceTaskFromRecommendationsDocument, options);
      }
export type CreateMaintenanceTaskFromRecommendationsMutationHookResult = ReturnType<typeof useCreateMaintenanceTaskFromRecommendationsMutation>;
export type CreateMaintenanceTaskFromRecommendationsMutationResult = ApolloReactCommon.MutationResult<CreateMaintenanceTaskFromRecommendationsMutation>;
export type CreateMaintenanceTaskFromRecommendationsMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateMaintenanceTaskFromRecommendationsMutation, CreateMaintenanceTaskFromRecommendationsMutationVariables>;
export const ControlServiceFromRecommendationsDocument = gql`
    mutation controlServiceFromRecommendations($input: ServiceControlInput!) {
  controlService(input: $input) {
    success
    error
    message
    service {
      name
      displayName
      status
      startType
      description
    }
  }
}
    `;
export type ControlServiceFromRecommendationsMutationFn = ApolloReactCommon.MutationFunction<ControlServiceFromRecommendationsMutation, ControlServiceFromRecommendationsMutationVariables>;

/**
 * __useControlServiceFromRecommendationsMutation__
 *
 * To run a mutation, you first call `useControlServiceFromRecommendationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useControlServiceFromRecommendationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [controlServiceFromRecommendationsMutation, { data, loading, error }] = useControlServiceFromRecommendationsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useControlServiceFromRecommendationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ControlServiceFromRecommendationsMutation, ControlServiceFromRecommendationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ControlServiceFromRecommendationsMutation, ControlServiceFromRecommendationsMutationVariables>(ControlServiceFromRecommendationsDocument, options);
      }
export type ControlServiceFromRecommendationsMutationHookResult = ReturnType<typeof useControlServiceFromRecommendationsMutation>;
export type ControlServiceFromRecommendationsMutationResult = ApolloReactCommon.MutationResult<ControlServiceFromRecommendationsMutation>;
export type ControlServiceFromRecommendationsMutationOptions = ApolloReactCommon.BaseMutationOptions<ControlServiceFromRecommendationsMutation, ControlServiceFromRecommendationsMutationVariables>;
export const ControlServiceDocument = gql`
    mutation controlService($input: ServiceControlInput!) {
  controlService(input: $input) {
    success
    message
    error
    service {
      name
      displayName
      status
      startType
      description
      pid
    }
  }
}
    `;
export type ControlServiceMutationFn = ApolloReactCommon.MutationFunction<ControlServiceMutation, ControlServiceMutationVariables>;

/**
 * __useControlServiceMutation__
 *
 * To run a mutation, you first call `useControlServiceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useControlServiceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [controlServiceMutation, { data, loading, error }] = useControlServiceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useControlServiceMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ControlServiceMutation, ControlServiceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ControlServiceMutation, ControlServiceMutationVariables>(ControlServiceDocument, options);
      }
export type ControlServiceMutationHookResult = ReturnType<typeof useControlServiceMutation>;
export type ControlServiceMutationResult = ApolloReactCommon.MutationResult<ControlServiceMutation>;
export type ControlServiceMutationOptions = ApolloReactCommon.BaseMutationOptions<ControlServiceMutation, ControlServiceMutationVariables>;
export const CreateSnapshotDocument = gql`
    mutation createSnapshot($input: CreateSnapshotInput!) {
  createSnapshot(input: $input) {
    success
    message
    snapshot {
      id
      name
      description
      vmId
      vmName
      createdAt
      isCurrent
      parentId
      hasMetadata
      state
    }
  }
}
    `;
export type CreateSnapshotMutationFn = ApolloReactCommon.MutationFunction<CreateSnapshotMutation, CreateSnapshotMutationVariables>;

/**
 * __useCreateSnapshotMutation__
 *
 * To run a mutation, you first call `useCreateSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSnapshotMutation, { data, loading, error }] = useCreateSnapshotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSnapshotMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSnapshotMutation, CreateSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSnapshotMutation, CreateSnapshotMutationVariables>(CreateSnapshotDocument, options);
      }
export type CreateSnapshotMutationHookResult = ReturnType<typeof useCreateSnapshotMutation>;
export type CreateSnapshotMutationResult = ApolloReactCommon.MutationResult<CreateSnapshotMutation>;
export type CreateSnapshotMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSnapshotMutation, CreateSnapshotMutationVariables>;
export const RestoreSnapshotDocument = gql`
    mutation restoreSnapshot($input: RestoreSnapshotInput!) {
  restoreSnapshot(input: $input) {
    success
    message
  }
}
    `;
export type RestoreSnapshotMutationFn = ApolloReactCommon.MutationFunction<RestoreSnapshotMutation, RestoreSnapshotMutationVariables>;

/**
 * __useRestoreSnapshotMutation__
 *
 * To run a mutation, you first call `useRestoreSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRestoreSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [restoreSnapshotMutation, { data, loading, error }] = useRestoreSnapshotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRestoreSnapshotMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RestoreSnapshotMutation, RestoreSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RestoreSnapshotMutation, RestoreSnapshotMutationVariables>(RestoreSnapshotDocument, options);
      }
export type RestoreSnapshotMutationHookResult = ReturnType<typeof useRestoreSnapshotMutation>;
export type RestoreSnapshotMutationResult = ApolloReactCommon.MutationResult<RestoreSnapshotMutation>;
export type RestoreSnapshotMutationOptions = ApolloReactCommon.BaseMutationOptions<RestoreSnapshotMutation, RestoreSnapshotMutationVariables>;
export const DeleteSnapshotDocument = gql`
    mutation deleteSnapshot($input: DeleteSnapshotInput!) {
  deleteSnapshot(input: $input) {
    success
    message
  }
}
    `;
export type DeleteSnapshotMutationFn = ApolloReactCommon.MutationFunction<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>;

/**
 * __useDeleteSnapshotMutation__
 *
 * To run a mutation, you first call `useDeleteSnapshotMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSnapshotMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSnapshotMutation, { data, loading, error }] = useDeleteSnapshotMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteSnapshotMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>(DeleteSnapshotDocument, options);
      }
export type DeleteSnapshotMutationHookResult = ReturnType<typeof useDeleteSnapshotMutation>;
export type DeleteSnapshotMutationResult = ApolloReactCommon.MutationResult<DeleteSnapshotMutation>;
export type DeleteSnapshotMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteSnapshotMutation, DeleteSnapshotMutationVariables>;
export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    id
    firstName
    lastName
    role
    email
    avatar
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
export function useCurrentUserQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export function useCurrentUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = ApolloReactCommon.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
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
    avatar
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
export function useUserQuery(baseOptions: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables> & ({ variables: UserQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export function useUserSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserSuspenseQueryHookResult = ReturnType<typeof useUserSuspenseQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<UserQuery, UserQueryVariables>;
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
    avatar
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
export function useUsersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export function useUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersSuspenseQueryHookResult = ReturnType<typeof useUsersSuspenseQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<UsersQuery, UsersQueryVariables>;
export function refetchUsersQuery(variables?: UsersQueryVariables) {
      return { query: UsersDocument, variables: variables }
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
export function useMachineTemplateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MachineTemplateQuery, MachineTemplateQueryVariables> & ({ variables: MachineTemplateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MachineTemplateQuery, MachineTemplateQueryVariables>(MachineTemplateDocument, options);
      }
export function useMachineTemplateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MachineTemplateQuery, MachineTemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MachineTemplateQuery, MachineTemplateQueryVariables>(MachineTemplateDocument, options);
        }
export function useMachineTemplateSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MachineTemplateQuery, MachineTemplateQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MachineTemplateQuery, MachineTemplateQueryVariables>(MachineTemplateDocument, options);
        }
export type MachineTemplateQueryHookResult = ReturnType<typeof useMachineTemplateQuery>;
export type MachineTemplateLazyQueryHookResult = ReturnType<typeof useMachineTemplateLazyQuery>;
export type MachineTemplateSuspenseQueryHookResult = ReturnType<typeof useMachineTemplateSuspenseQuery>;
export type MachineTemplateQueryResult = ApolloReactCommon.QueryResult<MachineTemplateQuery, MachineTemplateQueryVariables>;
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
export function useMachineTemplatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MachineTemplatesQuery, MachineTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MachineTemplatesQuery, MachineTemplatesQueryVariables>(MachineTemplatesDocument, options);
      }
export function useMachineTemplatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MachineTemplatesQuery, MachineTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MachineTemplatesQuery, MachineTemplatesQueryVariables>(MachineTemplatesDocument, options);
        }
export function useMachineTemplatesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MachineTemplatesQuery, MachineTemplatesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MachineTemplatesQuery, MachineTemplatesQueryVariables>(MachineTemplatesDocument, options);
        }
export type MachineTemplatesQueryHookResult = ReturnType<typeof useMachineTemplatesQuery>;
export type MachineTemplatesLazyQueryHookResult = ReturnType<typeof useMachineTemplatesLazyQuery>;
export type MachineTemplatesSuspenseQueryHookResult = ReturnType<typeof useMachineTemplatesSuspenseQuery>;
export type MachineTemplatesQueryResult = ApolloReactCommon.QueryResult<MachineTemplatesQuery, MachineTemplatesQueryVariables>;
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
    localIP
    publicIP
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
      avatar
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
export function useMachineQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MachineQuery, MachineQueryVariables> & ({ variables: MachineQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MachineQuery, MachineQueryVariables>(MachineDocument, options);
      }
export function useMachineLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MachineQuery, MachineQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MachineQuery, MachineQueryVariables>(MachineDocument, options);
        }
export function useMachineSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MachineQuery, MachineQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MachineQuery, MachineQueryVariables>(MachineDocument, options);
        }
export type MachineQueryHookResult = ReturnType<typeof useMachineQuery>;
export type MachineLazyQueryHookResult = ReturnType<typeof useMachineLazyQuery>;
export type MachineSuspenseQueryHookResult = ReturnType<typeof useMachineSuspenseQuery>;
export type MachineQueryResult = ApolloReactCommon.QueryResult<MachineQuery, MachineQueryVariables>;
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
    localIP
    publicIP
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
      avatar
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
export function useMachinesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
      }
export function useMachinesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
        }
export function useMachinesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MachinesQuery, MachinesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MachinesQuery, MachinesQueryVariables>(MachinesDocument, options);
        }
export type MachinesQueryHookResult = ReturnType<typeof useMachinesQuery>;
export type MachinesLazyQueryHookResult = ReturnType<typeof useMachinesLazyQuery>;
export type MachinesSuspenseQueryHookResult = ReturnType<typeof useMachinesSuspenseQuery>;
export type MachinesQueryResult = ApolloReactCommon.QueryResult<MachinesQuery, MachinesQueryVariables>;
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
export function useGraphicConnectionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GraphicConnectionQuery, GraphicConnectionQueryVariables> & ({ variables: GraphicConnectionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GraphicConnectionQuery, GraphicConnectionQueryVariables>(GraphicConnectionDocument, options);
      }
export function useGraphicConnectionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GraphicConnectionQuery, GraphicConnectionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GraphicConnectionQuery, GraphicConnectionQueryVariables>(GraphicConnectionDocument, options);
        }
export function useGraphicConnectionSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GraphicConnectionQuery, GraphicConnectionQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GraphicConnectionQuery, GraphicConnectionQueryVariables>(GraphicConnectionDocument, options);
        }
export type GraphicConnectionQueryHookResult = ReturnType<typeof useGraphicConnectionQuery>;
export type GraphicConnectionLazyQueryHookResult = ReturnType<typeof useGraphicConnectionLazyQuery>;
export type GraphicConnectionSuspenseQueryHookResult = ReturnType<typeof useGraphicConnectionSuspenseQuery>;
export type GraphicConnectionQueryResult = ApolloReactCommon.QueryResult<GraphicConnectionQuery, GraphicConnectionQueryVariables>;
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
export function useCheckSetupStatusQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>(CheckSetupStatusDocument, options);
      }
export function useCheckSetupStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>(CheckSetupStatusDocument, options);
        }
export function useCheckSetupStatusSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>(CheckSetupStatusDocument, options);
        }
export type CheckSetupStatusQueryHookResult = ReturnType<typeof useCheckSetupStatusQuery>;
export type CheckSetupStatusLazyQueryHookResult = ReturnType<typeof useCheckSetupStatusLazyQuery>;
export type CheckSetupStatusSuspenseQueryHookResult = ReturnType<typeof useCheckSetupStatusSuspenseQuery>;
export type CheckSetupStatusQueryResult = ApolloReactCommon.QueryResult<CheckSetupStatusQuery, CheckSetupStatusQueryVariables>;
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
export function useDepartmentsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
      }
export function useDepartmentsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
        }
export function useDepartmentsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<DepartmentsQuery, DepartmentsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<DepartmentsQuery, DepartmentsQueryVariables>(DepartmentsDocument, options);
        }
export type DepartmentsQueryHookResult = ReturnType<typeof useDepartmentsQuery>;
export type DepartmentsLazyQueryHookResult = ReturnType<typeof useDepartmentsLazyQuery>;
export type DepartmentsSuspenseQueryHookResult = ReturnType<typeof useDepartmentsSuspenseQuery>;
export type DepartmentsQueryResult = ApolloReactCommon.QueryResult<DepartmentsQuery, DepartmentsQueryVariables>;
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
export function useDepartmentQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DepartmentQuery, DepartmentQueryVariables> & ({ variables: DepartmentQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DepartmentQuery, DepartmentQueryVariables>(DepartmentDocument, options);
      }
export function useDepartmentLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DepartmentQuery, DepartmentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DepartmentQuery, DepartmentQueryVariables>(DepartmentDocument, options);
        }
export function useDepartmentSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<DepartmentQuery, DepartmentQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<DepartmentQuery, DepartmentQueryVariables>(DepartmentDocument, options);
        }
export type DepartmentQueryHookResult = ReturnType<typeof useDepartmentQuery>;
export type DepartmentLazyQueryHookResult = ReturnType<typeof useDepartmentLazyQuery>;
export type DepartmentSuspenseQueryHookResult = ReturnType<typeof useDepartmentSuspenseQuery>;
export type DepartmentQueryResult = ApolloReactCommon.QueryResult<DepartmentQuery, DepartmentQueryVariables>;
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
export function useFindDepartmentByNameQuery(baseOptions: ApolloReactHooks.QueryHookOptions<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables> & ({ variables: FindDepartmentByNameQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>(FindDepartmentByNameDocument, options);
      }
export function useFindDepartmentByNameLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>(FindDepartmentByNameDocument, options);
        }
export function useFindDepartmentByNameSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>(FindDepartmentByNameDocument, options);
        }
export type FindDepartmentByNameQueryHookResult = ReturnType<typeof useFindDepartmentByNameQuery>;
export type FindDepartmentByNameLazyQueryHookResult = ReturnType<typeof useFindDepartmentByNameLazyQuery>;
export type FindDepartmentByNameSuspenseQueryHookResult = ReturnType<typeof useFindDepartmentByNameSuspenseQuery>;
export type FindDepartmentByNameQueryResult = ApolloReactCommon.QueryResult<FindDepartmentByNameQuery, FindDepartmentByNameQueryVariables>;
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
export function useMachineTemplateCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>(MachineTemplateCategoriesDocument, options);
      }
export function useMachineTemplateCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>(MachineTemplateCategoriesDocument, options);
        }
export function useMachineTemplateCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>(MachineTemplateCategoriesDocument, options);
        }
export type MachineTemplateCategoriesQueryHookResult = ReturnType<typeof useMachineTemplateCategoriesQuery>;
export type MachineTemplateCategoriesLazyQueryHookResult = ReturnType<typeof useMachineTemplateCategoriesLazyQuery>;
export type MachineTemplateCategoriesSuspenseQueryHookResult = ReturnType<typeof useMachineTemplateCategoriesSuspenseQuery>;
export type MachineTemplateCategoriesQueryResult = ApolloReactCommon.QueryResult<MachineTemplateCategoriesQuery, MachineTemplateCategoriesQueryVariables>;
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
export function useMachineTemplateCategoryQuery(baseOptions: ApolloReactHooks.QueryHookOptions<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables> & ({ variables: MachineTemplateCategoryQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>(MachineTemplateCategoryDocument, options);
      }
export function useMachineTemplateCategoryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>(MachineTemplateCategoryDocument, options);
        }
export function useMachineTemplateCategorySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>(MachineTemplateCategoryDocument, options);
        }
export type MachineTemplateCategoryQueryHookResult = ReturnType<typeof useMachineTemplateCategoryQuery>;
export type MachineTemplateCategoryLazyQueryHookResult = ReturnType<typeof useMachineTemplateCategoryLazyQuery>;
export type MachineTemplateCategorySuspenseQueryHookResult = ReturnType<typeof useMachineTemplateCategorySuspenseQuery>;
export type MachineTemplateCategoryQueryResult = ApolloReactCommon.QueryResult<MachineTemplateCategoryQuery, MachineTemplateCategoryQueryVariables>;
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
export function useApplicationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
      }
export function useApplicationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
        }
export function useApplicationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ApplicationsQuery, ApplicationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ApplicationsQuery, ApplicationsQueryVariables>(ApplicationsDocument, options);
        }
export type ApplicationsQueryHookResult = ReturnType<typeof useApplicationsQuery>;
export type ApplicationsLazyQueryHookResult = ReturnType<typeof useApplicationsLazyQuery>;
export type ApplicationsSuspenseQueryHookResult = ReturnType<typeof useApplicationsSuspenseQuery>;
export type ApplicationsQueryResult = ApolloReactCommon.QueryResult<ApplicationsQuery, ApplicationsQueryVariables>;
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
export function useApplicationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ApplicationQuery, ApplicationQueryVariables> & ({ variables: ApplicationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ApplicationQuery, ApplicationQueryVariables>(ApplicationDocument, options);
      }
export function useApplicationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ApplicationQuery, ApplicationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ApplicationQuery, ApplicationQueryVariables>(ApplicationDocument, options);
        }
export function useApplicationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ApplicationQuery, ApplicationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ApplicationQuery, ApplicationQueryVariables>(ApplicationDocument, options);
        }
export type ApplicationQueryHookResult = ReturnType<typeof useApplicationQuery>;
export type ApplicationLazyQueryHookResult = ReturnType<typeof useApplicationLazyQuery>;
export type ApplicationSuspenseQueryHookResult = ReturnType<typeof useApplicationSuspenseQuery>;
export type ApplicationQueryResult = ApolloReactCommon.QueryResult<ApplicationQuery, ApplicationQueryVariables>;
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
export function useGetGraphicsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetGraphicsQuery, GetGraphicsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGraphicsQuery, GetGraphicsQueryVariables>(GetGraphicsDocument, options);
      }
export function useGetGraphicsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGraphicsQuery, GetGraphicsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGraphicsQuery, GetGraphicsQueryVariables>(GetGraphicsDocument, options);
        }
export function useGetGraphicsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetGraphicsQuery, GetGraphicsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetGraphicsQuery, GetGraphicsQueryVariables>(GetGraphicsDocument, options);
        }
export type GetGraphicsQueryHookResult = ReturnType<typeof useGetGraphicsQuery>;
export type GetGraphicsLazyQueryHookResult = ReturnType<typeof useGetGraphicsLazyQuery>;
export type GetGraphicsSuspenseQueryHookResult = ReturnType<typeof useGetGraphicsSuspenseQuery>;
export type GetGraphicsQueryResult = ApolloReactCommon.QueryResult<GetGraphicsQuery, GetGraphicsQueryVariables>;
export function refetchGetGraphicsQuery(variables?: GetGraphicsQueryVariables) {
      return { query: GetGraphicsDocument, variables: variables }
    }
export const GetSystemResourcesDocument = gql`
    query GetSystemResources {
  getSystemResources {
    cpu {
      total
      available
    }
    memory {
      total
      available
    }
    disk {
      total
      available
      used
    }
  }
}
    `;

/**
 * __useGetSystemResourcesQuery__
 *
 * To run a query within a React component, call `useGetSystemResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemResourcesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemResourcesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSystemResourcesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>(GetSystemResourcesDocument, options);
      }
export function useGetSystemResourcesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>(GetSystemResourcesDocument, options);
        }
export function useGetSystemResourcesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>(GetSystemResourcesDocument, options);
        }
export type GetSystemResourcesQueryHookResult = ReturnType<typeof useGetSystemResourcesQuery>;
export type GetSystemResourcesLazyQueryHookResult = ReturnType<typeof useGetSystemResourcesLazyQuery>;
export type GetSystemResourcesSuspenseQueryHookResult = ReturnType<typeof useGetSystemResourcesSuspenseQuery>;
export type GetSystemResourcesQueryResult = ApolloReactCommon.QueryResult<GetSystemResourcesQuery, GetSystemResourcesQueryVariables>;
export function refetchGetSystemResourcesQuery(variables?: GetSystemResourcesQueryVariables) {
      return { query: GetSystemResourcesDocument, variables: variables }
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
export function useNetworksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<NetworksQuery, NetworksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<NetworksQuery, NetworksQueryVariables>(NetworksDocument, options);
      }
export function useNetworksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NetworksQuery, NetworksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<NetworksQuery, NetworksQueryVariables>(NetworksDocument, options);
        }
export function useNetworksSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<NetworksQuery, NetworksQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<NetworksQuery, NetworksQueryVariables>(NetworksDocument, options);
        }
export type NetworksQueryHookResult = ReturnType<typeof useNetworksQuery>;
export type NetworksLazyQueryHookResult = ReturnType<typeof useNetworksLazyQuery>;
export type NetworksSuspenseQueryHookResult = ReturnType<typeof useNetworksSuspenseQuery>;
export type NetworksQueryResult = ApolloReactCommon.QueryResult<NetworksQuery, NetworksQueryVariables>;
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
export function useNetworkQuery(baseOptions: ApolloReactHooks.QueryHookOptions<NetworkQuery, NetworkQueryVariables> & ({ variables: NetworkQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<NetworkQuery, NetworkQueryVariables>(NetworkDocument, options);
      }
export function useNetworkLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<NetworkQuery, NetworkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<NetworkQuery, NetworkQueryVariables>(NetworkDocument, options);
        }
export function useNetworkSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<NetworkQuery, NetworkQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<NetworkQuery, NetworkQueryVariables>(NetworkDocument, options);
        }
export type NetworkQueryHookResult = ReturnType<typeof useNetworkQuery>;
export type NetworkLazyQueryHookResult = ReturnType<typeof useNetworkLazyQuery>;
export type NetworkSuspenseQueryHookResult = ReturnType<typeof useNetworkSuspenseQuery>;
export type NetworkQueryResult = ApolloReactCommon.QueryResult<NetworkQuery, NetworkQueryVariables>;
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
export function useListFiltersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListFiltersQuery, ListFiltersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListFiltersQuery, ListFiltersQueryVariables>(ListFiltersDocument, options);
      }
export function useListFiltersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListFiltersQuery, ListFiltersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListFiltersQuery, ListFiltersQueryVariables>(ListFiltersDocument, options);
        }
export function useListFiltersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListFiltersQuery, ListFiltersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListFiltersQuery, ListFiltersQueryVariables>(ListFiltersDocument, options);
        }
export type ListFiltersQueryHookResult = ReturnType<typeof useListFiltersQuery>;
export type ListFiltersLazyQueryHookResult = ReturnType<typeof useListFiltersLazyQuery>;
export type ListFiltersSuspenseQueryHookResult = ReturnType<typeof useListFiltersSuspenseQuery>;
export type ListFiltersQueryResult = ApolloReactCommon.QueryResult<ListFiltersQuery, ListFiltersQueryVariables>;
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
export function useGetFilterQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetFilterQuery, GetFilterQueryVariables> & ({ variables: GetFilterQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetFilterQuery, GetFilterQueryVariables>(GetFilterDocument, options);
      }
export function useGetFilterLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetFilterQuery, GetFilterQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetFilterQuery, GetFilterQueryVariables>(GetFilterDocument, options);
        }
export function useGetFilterSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetFilterQuery, GetFilterQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetFilterQuery, GetFilterQueryVariables>(GetFilterDocument, options);
        }
export type GetFilterQueryHookResult = ReturnType<typeof useGetFilterQuery>;
export type GetFilterLazyQueryHookResult = ReturnType<typeof useGetFilterLazyQuery>;
export type GetFilterSuspenseQueryHookResult = ReturnType<typeof useGetFilterSuspenseQuery>;
export type GetFilterQueryResult = ApolloReactCommon.QueryResult<GetFilterQuery, GetFilterQueryVariables>;
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
export function useListFilterRulesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListFilterRulesQuery, ListFilterRulesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListFilterRulesQuery, ListFilterRulesQueryVariables>(ListFilterRulesDocument, options);
      }
export function useListFilterRulesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListFilterRulesQuery, ListFilterRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListFilterRulesQuery, ListFilterRulesQueryVariables>(ListFilterRulesDocument, options);
        }
export function useListFilterRulesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListFilterRulesQuery, ListFilterRulesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListFilterRulesQuery, ListFilterRulesQueryVariables>(ListFilterRulesDocument, options);
        }
export type ListFilterRulesQueryHookResult = ReturnType<typeof useListFilterRulesQuery>;
export type ListFilterRulesLazyQueryHookResult = ReturnType<typeof useListFilterRulesLazyQuery>;
export type ListFilterRulesSuspenseQueryHookResult = ReturnType<typeof useListFilterRulesSuspenseQuery>;
export type ListFilterRulesQueryResult = ApolloReactCommon.QueryResult<ListFilterRulesQuery, ListFilterRulesQueryVariables>;
export function refetchListFilterRulesQuery(variables?: ListFilterRulesQueryVariables) {
      return { query: ListFilterRulesDocument, variables: variables }
    }
export const ListServicesDocument = gql`
    query listServices($machineId: String!) {
  listServices(machineId: $machineId) {
    name
    displayName
    status
    startType
    pid
    description
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
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useListServicesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ListServicesQuery, ListServicesQueryVariables> & ({ variables: ListServicesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListServicesQuery, ListServicesQueryVariables>(ListServicesDocument, options);
      }
export function useListServicesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListServicesQuery, ListServicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListServicesQuery, ListServicesQueryVariables>(ListServicesDocument, options);
        }
export function useListServicesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListServicesQuery, ListServicesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListServicesQuery, ListServicesQueryVariables>(ListServicesDocument, options);
        }
export type ListServicesQueryHookResult = ReturnType<typeof useListServicesQuery>;
export type ListServicesLazyQueryHookResult = ReturnType<typeof useListServicesLazyQuery>;
export type ListServicesSuspenseQueryHookResult = ReturnType<typeof useListServicesSuspenseQuery>;
export type ListServicesQueryResult = ApolloReactCommon.QueryResult<ListServicesQuery, ListServicesQueryVariables>;
export function refetchListServicesQuery(variables: ListServicesQueryVariables) {
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
export function useGetVmServiceStatusQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables> & ({ variables: GetVmServiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>(GetVmServiceStatusDocument, options);
      }
export function useGetVmServiceStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>(GetVmServiceStatusDocument, options);
        }
export function useGetVmServiceStatusSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>(GetVmServiceStatusDocument, options);
        }
export type GetVmServiceStatusQueryHookResult = ReturnType<typeof useGetVmServiceStatusQuery>;
export type GetVmServiceStatusLazyQueryHookResult = ReturnType<typeof useGetVmServiceStatusLazyQuery>;
export type GetVmServiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetVmServiceStatusSuspenseQuery>;
export type GetVmServiceStatusQueryResult = ApolloReactCommon.QueryResult<GetVmServiceStatusQuery, GetVmServiceStatusQueryVariables>;
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
export function useGetDepartmentServiceStatusQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables> & ({ variables: GetDepartmentServiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>(GetDepartmentServiceStatusDocument, options);
      }
export function useGetDepartmentServiceStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>(GetDepartmentServiceStatusDocument, options);
        }
export function useGetDepartmentServiceStatusSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>(GetDepartmentServiceStatusDocument, options);
        }
export type GetDepartmentServiceStatusQueryHookResult = ReturnType<typeof useGetDepartmentServiceStatusQuery>;
export type GetDepartmentServiceStatusLazyQueryHookResult = ReturnType<typeof useGetDepartmentServiceStatusLazyQuery>;
export type GetDepartmentServiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetDepartmentServiceStatusSuspenseQuery>;
export type GetDepartmentServiceStatusQueryResult = ApolloReactCommon.QueryResult<GetDepartmentServiceStatusQuery, GetDepartmentServiceStatusQueryVariables>;
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
export function useGetGlobalServiceStatusQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables> & ({ variables: GetGlobalServiceStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>(GetGlobalServiceStatusDocument, options);
      }
export function useGetGlobalServiceStatusLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>(GetGlobalServiceStatusDocument, options);
        }
export function useGetGlobalServiceStatusSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>(GetGlobalServiceStatusDocument, options);
        }
export type GetGlobalServiceStatusQueryHookResult = ReturnType<typeof useGetGlobalServiceStatusQuery>;
export type GetGlobalServiceStatusLazyQueryHookResult = ReturnType<typeof useGetGlobalServiceStatusLazyQuery>;
export type GetGlobalServiceStatusSuspenseQueryHookResult = ReturnType<typeof useGetGlobalServiceStatusSuspenseQuery>;
export type GetGlobalServiceStatusQueryResult = ApolloReactCommon.QueryResult<GetGlobalServiceStatusQuery, GetGlobalServiceStatusQueryVariables>;
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
export function useGetServiceStatusSummaryQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>(GetServiceStatusSummaryDocument, options);
      }
export function useGetServiceStatusSummaryLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>(GetServiceStatusSummaryDocument, options);
        }
export function useGetServiceStatusSummarySuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>(GetServiceStatusSummaryDocument, options);
        }
export type GetServiceStatusSummaryQueryHookResult = ReturnType<typeof useGetServiceStatusSummaryQuery>;
export type GetServiceStatusSummaryLazyQueryHookResult = ReturnType<typeof useGetServiceStatusSummaryLazyQuery>;
export type GetServiceStatusSummarySuspenseQueryHookResult = ReturnType<typeof useGetServiceStatusSummarySuspenseQuery>;
export type GetServiceStatusSummaryQueryResult = ApolloReactCommon.QueryResult<GetServiceStatusSummaryQuery, GetServiceStatusSummaryQueryVariables>;
export function refetchGetServiceStatusSummaryQuery(variables?: GetServiceStatusSummaryQueryVariables) {
      return { query: GetServiceStatusSummaryDocument, variables: variables }
    }
export const VmDetailedInfoDocument = gql`
    query vmDetailedInfo($id: String!) {
  machine(id: $id) {
    id
    name
    status
    userId
    templateId
    createdAt
    configuration
    localIP
    publicIP
    department {
      id
      name
    }
    template {
      id
      name
      description
      cores
      ram
      storage
    }
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
    `;

/**
 * __useVmDetailedInfoQuery__
 *
 * To run a query within a React component, call `useVmDetailedInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useVmDetailedInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVmDetailedInfoQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVmDetailedInfoQuery(baseOptions: ApolloReactHooks.QueryHookOptions<VmDetailedInfoQuery, VmDetailedInfoQueryVariables> & ({ variables: VmDetailedInfoQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<VmDetailedInfoQuery, VmDetailedInfoQueryVariables>(VmDetailedInfoDocument, options);
      }
export function useVmDetailedInfoLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<VmDetailedInfoQuery, VmDetailedInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<VmDetailedInfoQuery, VmDetailedInfoQueryVariables>(VmDetailedInfoDocument, options);
        }
export function useVmDetailedInfoSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<VmDetailedInfoQuery, VmDetailedInfoQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<VmDetailedInfoQuery, VmDetailedInfoQueryVariables>(VmDetailedInfoDocument, options);
        }
export type VmDetailedInfoQueryHookResult = ReturnType<typeof useVmDetailedInfoQuery>;
export type VmDetailedInfoLazyQueryHookResult = ReturnType<typeof useVmDetailedInfoLazyQuery>;
export type VmDetailedInfoSuspenseQueryHookResult = ReturnType<typeof useVmDetailedInfoSuspenseQuery>;
export type VmDetailedInfoQueryResult = ApolloReactCommon.QueryResult<VmDetailedInfoQuery, VmDetailedInfoQueryVariables>;
export function refetchVmDetailedInfoQuery(variables: VmDetailedInfoQueryVariables) {
      return { query: VmDetailedInfoDocument, variables: variables }
    }
export const GetSimplifiedFirewallRulesDocument = gql`
    query getSimplifiedFirewallRules($machineId: ID!) {
  getSimplifiedFirewallRules(machineId: $machineId) {
    id
    action
    direction
    port
    protocol
    description
    sources
  }
}
    `;

/**
 * __useGetSimplifiedFirewallRulesQuery__
 *
 * To run a query within a React component, call `useGetSimplifiedFirewallRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSimplifiedFirewallRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSimplifiedFirewallRulesQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useGetSimplifiedFirewallRulesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables> & ({ variables: GetSimplifiedFirewallRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables>(GetSimplifiedFirewallRulesDocument, options);
      }
export function useGetSimplifiedFirewallRulesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables>(GetSimplifiedFirewallRulesDocument, options);
        }
export function useGetSimplifiedFirewallRulesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables>(GetSimplifiedFirewallRulesDocument, options);
        }
export type GetSimplifiedFirewallRulesQueryHookResult = ReturnType<typeof useGetSimplifiedFirewallRulesQuery>;
export type GetSimplifiedFirewallRulesLazyQueryHookResult = ReturnType<typeof useGetSimplifiedFirewallRulesLazyQuery>;
export type GetSimplifiedFirewallRulesSuspenseQueryHookResult = ReturnType<typeof useGetSimplifiedFirewallRulesSuspenseQuery>;
export type GetSimplifiedFirewallRulesQueryResult = ApolloReactCommon.QueryResult<GetSimplifiedFirewallRulesQuery, GetSimplifiedFirewallRulesQueryVariables>;
export function refetchGetSimplifiedFirewallRulesQuery(variables: GetSimplifiedFirewallRulesQueryVariables) {
      return { query: GetSimplifiedFirewallRulesDocument, variables: variables }
    }
export const GetVmFirewallStateDocument = gql`
    query getVMFirewallState($machineId: ID!) {
  getVMFirewallState(machineId: $machineId) {
    appliedTemplates
    customRules {
      id
      action
      direction
      port
      protocol
      description
      sources
    }
    effectiveRules {
      id
      action
      direction
      port
      protocol
      description
      sources
    }
    lastSync
  }
}
    `;

/**
 * __useGetVmFirewallStateQuery__
 *
 * To run a query within a React component, call `useGetVmFirewallStateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmFirewallStateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmFirewallStateQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useGetVmFirewallStateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables> & ({ variables: GetVmFirewallStateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables>(GetVmFirewallStateDocument, options);
      }
export function useGetVmFirewallStateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables>(GetVmFirewallStateDocument, options);
        }
export function useGetVmFirewallStateSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables>(GetVmFirewallStateDocument, options);
        }
export type GetVmFirewallStateQueryHookResult = ReturnType<typeof useGetVmFirewallStateQuery>;
export type GetVmFirewallStateLazyQueryHookResult = ReturnType<typeof useGetVmFirewallStateLazyQuery>;
export type GetVmFirewallStateSuspenseQueryHookResult = ReturnType<typeof useGetVmFirewallStateSuspenseQuery>;
export type GetVmFirewallStateQueryResult = ApolloReactCommon.QueryResult<GetVmFirewallStateQuery, GetVmFirewallStateQueryVariables>;
export function refetchGetVmFirewallStateQuery(variables: GetVmFirewallStateQueryVariables) {
      return { query: GetVmFirewallStateDocument, variables: variables }
    }
export const GetAvailableFirewallTemplatesDocument = gql`
    query getAvailableFirewallTemplates {
  getAvailableFirewallTemplates {
    template
    name
    description
    rules {
      port
      protocol
      direction
      action
      description
    }
  }
}
    `;

/**
 * __useGetAvailableFirewallTemplatesQuery__
 *
 * To run a query within a React component, call `useGetAvailableFirewallTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableFirewallTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableFirewallTemplatesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAvailableFirewallTemplatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>(GetAvailableFirewallTemplatesDocument, options);
      }
export function useGetAvailableFirewallTemplatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>(GetAvailableFirewallTemplatesDocument, options);
        }
export function useGetAvailableFirewallTemplatesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>(GetAvailableFirewallTemplatesDocument, options);
        }
export type GetAvailableFirewallTemplatesQueryHookResult = ReturnType<typeof useGetAvailableFirewallTemplatesQuery>;
export type GetAvailableFirewallTemplatesLazyQueryHookResult = ReturnType<typeof useGetAvailableFirewallTemplatesLazyQuery>;
export type GetAvailableFirewallTemplatesSuspenseQueryHookResult = ReturnType<typeof useGetAvailableFirewallTemplatesSuspenseQuery>;
export type GetAvailableFirewallTemplatesQueryResult = ApolloReactCommon.QueryResult<GetAvailableFirewallTemplatesQuery, GetAvailableFirewallTemplatesQueryVariables>;
export function refetchGetAvailableFirewallTemplatesQuery(variables?: GetAvailableFirewallTemplatesQueryVariables) {
      return { query: GetAvailableFirewallTemplatesDocument, variables: variables }
    }
export const GetVmRecommendationsDocument = gql`
    query getVMRecommendations($vmId: ID!, $filter: RecommendationFilterInput, $refresh: Boolean) {
  getVMRecommendations(vmId: $vmId, filter: $filter, refresh: $refresh) {
    id
    machineId
    snapshotId
    type
    text
    actionText
    data
    createdAt
  }
}
    `;

/**
 * __useGetVmRecommendationsQuery__
 *
 * To run a query within a React component, call `useGetVmRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmRecommendationsQuery({
 *   variables: {
 *      vmId: // value for 'vmId'
 *      filter: // value for 'filter'
 *      refresh: // value for 'refresh'
 *   },
 * });
 */
export function useGetVmRecommendationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables> & ({ variables: GetVmRecommendationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables>(GetVmRecommendationsDocument, options);
      }
export function useGetVmRecommendationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables>(GetVmRecommendationsDocument, options);
        }
export function useGetVmRecommendationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables>(GetVmRecommendationsDocument, options);
        }
export type GetVmRecommendationsQueryHookResult = ReturnType<typeof useGetVmRecommendationsQuery>;
export type GetVmRecommendationsLazyQueryHookResult = ReturnType<typeof useGetVmRecommendationsLazyQuery>;
export type GetVmRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGetVmRecommendationsSuspenseQuery>;
export type GetVmRecommendationsQueryResult = ApolloReactCommon.QueryResult<GetVmRecommendationsQuery, GetVmRecommendationsQueryVariables>;
export function refetchGetVmRecommendationsQuery(variables: GetVmRecommendationsQueryVariables) {
      return { query: GetVmRecommendationsDocument, variables: variables }
    }