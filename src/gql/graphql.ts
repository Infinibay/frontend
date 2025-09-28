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

export type AdvancedPortInput = {
  /** Description of the port configuration */
  description?: InputMaybe<Scalars['String']['input']>;
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
  logoUrl?: Maybe<Scalars['String']['output']>;
  theme: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  wallpaper: Scalars['String']['output'];
};

export type AppSettingsInput = {
  interfaceSize?: InputMaybe<Scalars['String']['input']>;
  logoUrl?: InputMaybe<Scalars['String']['input']>;
  theme?: InputMaybe<Scalars['String']['input']>;
  wallpaper?: InputMaybe<Scalars['String']['input']>;
};

export type ApplicationInfo = {
  __typename?: 'ApplicationInfo';
  installDate?: Maybe<Scalars['DateTimeISO']['output']>;
  installLocation?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  publisher?: Maybe<Scalars['String']['output']>;
  sizeInMB?: Maybe<Scalars['Float']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};

export type ApplicationInventory = {
  __typename?: 'ApplicationInventory';
  applications: Array<ApplicationInfo>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  totalCount: Scalars['Int']['output'];
  vmId: Scalars['ID']['output'];
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

export type ApplicationUpdateInfo = {
  __typename?: 'ApplicationUpdateInfo';
  applicationName: Scalars['String']['output'];
  availableVersion: Scalars['String']['output'];
  canUpdate: Scalars['Boolean']['output'];
  currentVersion: Scalars['String']['output'];
  downloadUrl?: Maybe<Scalars['String']['output']>;
  installDate?: Maybe<Scalars['DateTimeISO']['output']>;
  installLocation?: Maybe<Scalars['String']['output']>;
  installType?: Maybe<Scalars['String']['output']>;
  isSecurityUpdate: Scalars['Boolean']['output'];
  lastUpdateCheck?: Maybe<Scalars['DateTimeISO']['output']>;
  registryKey?: Maybe<Scalars['String']['output']>;
  releaseDate?: Maybe<Scalars['DateTimeISO']['output']>;
  sizeInMB?: Maybe<Scalars['Float']['output']>;
  updateSizeBytes?: Maybe<Scalars['Float']['output']>;
  updateSource?: Maybe<Scalars['String']['output']>;
  updateType?: Maybe<Scalars['String']['output']>;
  vendor?: Maybe<Scalars['String']['output']>;
};

export type ApplicationUpdates = {
  __typename?: 'ApplicationUpdates';
  availableUpdates: Array<ApplicationUpdateInfo>;
  error?: Maybe<Scalars['String']['output']>;
  executionTimeMs?: Maybe<Scalars['Int']['output']>;
  microsoftStoreUpdatesCount?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
  summary?: Maybe<Scalars['String']['output']>;
  timestamp: Scalars['DateTimeISO']['output'];
  totalUpdatesCount: Scalars['Int']['output'];
  vmId: Scalars['ID']['output'];
  windowsUpdatesCount?: Maybe<Scalars['Int']['output']>;
};

export type ApplyDepartmentTemplateInput = {
  departmentId?: Scalars['ID']['input'];
  templateFilterId?: Scalars['ID']['input'];
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
  nextRun?: Maybe<Scalars['DateTimeISO']['output']>;
  pendingChecks: Scalars['Int']['output'];
  totalVMsMonitored: Scalars['Int']['output'];
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

/** Generic command execution result */
export type CommandResult = {
  __typename?: 'CommandResult';
  /** Error message if command failed */
  error?: Maybe<Scalars['String']['output']>;
  /** Command output */
  output?: Maybe<Scalars['String']['output']>;
  /** Standard error */
  stderr?: Maybe<Scalars['String']['output']>;
  /** Standard output */
  stdout?: Maybe<Scalars['String']['output']>;
  /** Whether the command was successful */
  success: Scalars['Boolean']['output'];
};

export type CreateAdvancedFirewallRuleInput = {
  /** Firewall action (accept, drop, reject) */
  action?: Scalars['String']['input'];
  /** Optional rule description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Traffic direction (in, out, inout) */
  direction?: Scalars['String']['input'];
  /** Virtual machine ID */
  machineId: Scalars['ID']['input'];
  /** Advanced port configuration */
  ports: AdvancedPortInput;
  /** Network protocol (tcp, udp, icmp) */
  protocol?: Scalars['String']['input'];
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
  departmentId?: InputMaybe<Scalars['ID']['input']>;
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

export type CreateMaintenanceTaskInput = {
  cronSchedule?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isEnabled?: Scalars['Boolean']['input'];
  isRecurring?: Scalars['Boolean']['input'];
  machineId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
  runAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
  taskType: MaintenanceTaskType;
};

export type CreateNetworkInput = {
  bridgeName?: Scalars['String']['input'];
  description?: Scalars['String']['input'];
  enableIntraNetworkCommunication?: InputMaybe<Scalars['Boolean']['input']>;
  enabledServices?: InputMaybe<Array<Scalars['String']['input']>>;
  ipConfig?: InputMaybe<NetworkIpConfigInput>;
  name?: Scalars['String']['input'];
};

export type CreateSimplifiedFirewallRuleInput = {
  /** Firewall action (accept, drop, reject) */
  action?: Scalars['String']['input'];
  /** Optional rule description */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Traffic direction (in, out, inout) */
  direction?: Scalars['String']['input'];
  /** Virtual machine ID */
  machineId: Scalars['ID']['input'];
  /** Port specification (e.g., "80", "443", "all") */
  port: Scalars['String']['input'];
  /** Network protocol (tcp, udp, icmp) */
  protocol?: Scalars['String']['input'];
};

export type CreateSnapshotInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  machineId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateUserInputType = {
  email?: Scalars['String']['input'];
  firstName?: Scalars['String']['input'];
  lastName?: Scalars['String']['input'];
  password?: Scalars['String']['input'];
  passwordConfirmation?: Scalars['String']['input'];
  role?: UserRole;
};

export type DefenderScanResult = {
  __typename?: 'DefenderScanResult';
  error?: Maybe<Scalars['String']['output']>;
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
  internetSpeed?: Maybe<Scalars['Int']['output']>;
  ipSubnet?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  totalMachines?: Maybe<Scalars['Float']['output']>;
};

export type DiskCleanupResult = {
  __typename?: 'DiskCleanupResult';
  drive: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
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
  criticalThreshold?: Maybe<Scalars['Float']['output']>;
  drives: Array<DiskDriveInfo>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
  warningThreshold?: Maybe<Scalars['Float']['output']>;
};

export type DyummyType = {
  __typename?: 'DyummyType';
  value: Scalars['String']['output'];
};

export type ExecuteMaintenanceInput = {
  machineId: Scalars['ID']['input'];
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
  taskType: MaintenanceTaskType;
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
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  references: Array<Scalars['String']['output']>;
  rules?: Maybe<Array<FwRule>>;
  type: FilterType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type GenericHealthCheckResponse = {
  __typename?: 'GenericHealthCheckResponse';
  checkName: Scalars['String']['output'];
  details?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
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
  details?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  severity: HealthCheckSeverity;
  timestamp: Scalars['DateTimeISO']['output'];
};

export type HealthCheckRoundResult = {
  __typename?: 'HealthCheckRoundResult';
  error?: Maybe<Scalars['String']['output']>;
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
  error?: Maybe<Scalars['String']['output']>;
  overallScore: Scalars['Float']['output'];
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
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

/** Login response with user data and token */
export type LoginResponse = {
  __typename?: 'LoginResponse';
  token: Scalars['String']['output'];
  user: UserType;
};

export type Machine = {
  __typename?: 'Machine';
  configuration?: Maybe<Scalars['JSONObject']['output']>;
  cpuCores?: Maybe<Scalars['Int']['output']>;
  createdAt?: Maybe<Scalars['DateTimeISO']['output']>;
  department?: Maybe<DepartmentType>;
  departmentId?: Maybe<Scalars['String']['output']>;
  diskSizeGB?: Maybe<Scalars['Int']['output']>;
  gpuPciAddress?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internalName: Scalars['String']['output'];
  localIP?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  os: Scalars['String']['output'];
  publicIP?: Maybe<Scalars['String']['output']>;
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

export type MaintenanceExecutionResponse = {
  __typename?: 'MaintenanceExecutionResponse';
  error?: Maybe<Scalars['String']['output']>;
  execution?: Maybe<MaintenanceHistory>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type MaintenanceHistory = {
  __typename?: 'MaintenanceHistory';
  duration?: Maybe<Scalars['Float']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  executedAt: Scalars['DateTimeISO']['output'];
  executedByUserId?: Maybe<Scalars['ID']['output']>;
  id: Scalars['ID']['output'];
  machineId: Scalars['ID']['output'];
  parameters?: Maybe<Scalars['JSONObject']['output']>;
  result?: Maybe<Scalars['JSONObject']['output']>;
  status: MaintenanceStatus;
  taskId?: Maybe<Scalars['ID']['output']>;
  taskType: MaintenanceTaskType;
  triggeredBy: MaintenanceTrigger;
};

export type MaintenanceStats = {
  __typename?: 'MaintenanceStats';
  enabledTasks: Scalars['Float']['output'];
  failedExecutions: Scalars['Float']['output'];
  lastExecutionDate?: Maybe<Scalars['DateTimeISO']['output']>;
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
  cronSchedule?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  executionStatus: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  isRecurring: Scalars['Boolean']['output'];
  lastRunAt?: Maybe<Scalars['DateTimeISO']['output']>;
  machineId: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  nextRunAt?: Maybe<Scalars['DateTimeISO']['output']>;
  parameters?: Maybe<Scalars['JSONObject']['output']>;
  runAt?: Maybe<Scalars['DateTimeISO']['output']>;
  taskType: MaintenanceTaskType;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type MaintenanceTaskResponse = {
  __typename?: 'MaintenanceTaskResponse';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  task?: Maybe<MaintenanceTask>;
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
  login?: Maybe<LoginResponse>;
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
  updateFilter: GenericFilter;
  updateFilterRule: FwRule;
  updateMachineHardware: Machine;
  updateMachineTemplate: MachineTemplateType;
  updateMachineTemplateCategory: MachineTemplateCategoryType;
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
  description?: InputMaybe<Scalars['String']['input']>;
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
  targets?: InputMaybe<Array<Scalars['String']['input']>>;
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
  description?: Maybe<Scalars['String']['output']>;
  /** Whether the package is installed */
  installed: Scalars['Boolean']['output'];
  /** Package name */
  name: Scalars['String']['output'];
  /** Package publisher or vendor */
  publisher?: Maybe<Scalars['String']['output']>;
  /** Package source or repository */
  source?: Maybe<Scalars['String']['output']>;
  /** Package version */
  version: Scalars['String']['output'];
};

/** Input for package management operations */
export type PackageManagementInput = {
  /** Action to perform on the package */
  action?: PackageAction;
  /** ID of the target machine */
  machineId?: Scalars['ID']['input'];
  /** Name of the package to manage */
  packageName?: Scalars['String']['input'];
};

/** Result of a package management operation */
export type PackageManagementResult = {
  __typename?: 'PackageManagementResult';
  /** Error message if operation failed */
  error?: Maybe<Scalars['String']['output']>;
  /** Human-readable message about the operation */
  message: Scalars['String']['output'];
  /** List of packages (for list operations) */
  packages?: Maybe<Array<PackageInfo>>;
  /** Standard error from the command */
  stderr?: Maybe<Scalars['String']['output']>;
  /** Standard output from the command */
  stdout?: Maybe<Scalars['String']['output']>;
  /** Whether the operation was successful */
  success: Scalars['Boolean']['output'];
};

export type PaginationInputType = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
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
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  pid?: Maybe<Scalars['Int']['output']>;
  processName?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** Get all ISOs (available and unavailable) */
  allISOs: Array<Iso>;
  application?: Maybe<ApplicationType>;
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
  currentSnapshot?: Maybe<Snapshot>;
  currentUser?: Maybe<UserType>;
  department?: Maybe<DepartmentType>;
  departments: Array<DepartmentType>;
  dueMaintenanceTasks: Array<MaintenanceTask>;
  findDepartmentByName?: Maybe<DepartmentType>;
  getAppSettings: AppSettings;
  getAvailableFirewallTemplates: Array<FirewallTemplateInfo>;
  getAvailableTemplatesForDepartment: Array<GenericFilter>;
  getDepartmentFirewallRules: Array<FwRule>;
  getDepartmentFirewallState: DepartmentFirewallState;
  getDepartmentServiceStatus: Array<DepartmentServiceStatus>;
  getFilter?: Maybe<GenericFilter>;
  getFirewallTemplateInfo?: Maybe<FirewallTemplateInfo>;
  getGlobalServiceStatus: Array<GlobalServiceStatus>;
  getGraphics: Array<Gpu>;
  getLatestVMHealth?: Maybe<VmHealthSnapshotType>;
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
  graphicConnection?: Maybe<GraphicConfigurationType>;
  healthCheckQueueStats: QueueStatsType;
  healthQueueStatistics: QueueStatistics;
  latestVMHealthSnapshot?: Maybe<VmHealthSnapshotType>;
  listFilterRules: Array<FwRule>;
  listFilters: Array<GenericFilter>;
  /** List all installed packages on a virtual machine */
  listInstalledPackages: Array<PackageInfo>;
  listSecurityServices: Array<ServiceDefinition>;
  /** List all services running on a virtual machine */
  listServices: Array<ServiceInfo>;
  machine?: Maybe<Machine>;
  /** List all snapshots for a virtual machine */
  machineSnapshots: SnapshotListResult;
  machineTemplate?: Maybe<MachineTemplateType>;
  machineTemplateCategories: Array<MachineTemplateCategoryType>;
  machineTemplateCategory?: Maybe<MachineTemplateCategoryType>;
  machineTemplates: Array<MachineTemplateType>;
  machines: Array<Machine>;
  maintenanceHistory: Array<MaintenanceHistory>;
  maintenanceStats: MaintenanceStats;
  maintenanceTask?: Maybe<MaintenanceTask>;
  maintenanceTasks: Array<MaintenanceTask>;
  network: Network;
  networks: Array<Network>;
  /** Run a specific health check on a VM */
  runHealthCheck: GenericHealthCheckResponse;
  /** Search for available packages on a virtual machine */
  searchPackages: Array<PackageInfo>;
  /** Get current socket connection statistics for all VMs */
  socketConnectionStats?: Maybe<SocketConnectionStats>;
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
  evaluationWindowDays?: InputMaybe<Scalars['Float']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryCheckVmDiskSpaceArgs = {
  criticalThreshold?: InputMaybe<Scalars['Float']['input']>;
  vmId: Scalars['ID']['input'];
  warningThreshold?: InputMaybe<Scalars['Float']['input']>;
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
  serviceId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryGetFilterArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetFirewallTemplateInfoArgs = {
  template: FirewallTemplate;
};


export type QueryGetGlobalServiceStatusArgs = {
  serviceId?: InputMaybe<Scalars['ID']['input']>;
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
  filter?: InputMaybe<RecommendationFilterInput>;
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmServiceStatusArgs = {
  serviceId?: InputMaybe<Scalars['ID']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryGetWindowsUpdateHistoryArgs = {
  days?: InputMaybe<Scalars['Float']['input']>;
  vmId: Scalars['ID']['input'];
};


export type QueryGraphicConnectionArgs = {
  id: Scalars['String']['input'];
};


export type QueryLatestVmHealthSnapshotArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryListFilterRulesArgs = {
  filterId?: InputMaybe<Scalars['ID']['input']>;
};


export type QueryListFiltersArgs = {
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  vmId?: InputMaybe<Scalars['ID']['input']>;
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
  orderBy?: InputMaybe<MachineTemplateOrderBy>;
  pagination?: InputMaybe<PaginationInputType>;
};


export type QueryMachinesArgs = {
  orderBy?: InputMaybe<MachineOrderBy>;
  pagination?: InputMaybe<PaginationInputType>;
};


export type QueryMaintenanceHistoryArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  machineId: Scalars['ID']['input'];
  status?: InputMaybe<MaintenanceStatus>;
  taskType?: InputMaybe<MaintenanceTaskType>;
};


export type QueryMaintenanceStatsArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryMaintenanceTaskArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMaintenanceTasksArgs = {
  machineId: Scalars['ID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
  orderBy?: InputMaybe<UserOrderByInputType>;
  pagination?: InputMaybe<PaginationInputType>;
};


export type QueryVmHealthCheckQueueArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineId?: InputMaybe<Scalars['ID']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
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
  createdAfter?: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** Only return recommendations created before this date/time */
  createdBefore?: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** Maximum number of recommendations to return (for pagination, defaults to 20, max 100) */
  limit?: InputMaybe<Scalars['Float']['input']>;
  /** Filter by specific recommendation types (e.g., only security or storage recommendations) */
  types?: InputMaybe<Array<RecommendationType>>;
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
  error?: Maybe<Scalars['String']['output']>;
  evaluationWindowDays?: Maybe<Scalars['Float']['output']>;
  overallStatus: HealthCheckSeverity;
  recommendations: Array<ResourceRecommendation>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type ResourceRecommendation = {
  __typename?: 'ResourceRecommendation';
  currentValue: Scalars['Float']['output'];
  potentialSavingsPercent?: Maybe<Scalars['Float']['output']>;
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
  description?: Maybe<Scalars['String']['output']>;
  displayName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  pid?: Maybe<Scalars['Float']['output']>;
  startType?: Maybe<ServiceStartType>;
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
  error?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  service?: Maybe<ServiceInfo>;
  success: Scalars['Boolean']['output'];
};

export type SimplifiedFirewallRule = {
  __typename?: 'SimplifiedFirewallRule';
  /** Firewall action (accept, drop, reject) */
  action: Scalars['String']['output'];
  /** Rule description */
  description?: Maybe<Scalars['String']['output']>;
  /** Traffic direction (in, out, inout) */
  direction: Scalars['String']['output'];
  /** Unique rule identifier */
  id?: Maybe<Scalars['ID']['output']>;
  /** Port specification (e.g., "80", "80-90", "all") */
  port: Scalars['String']['output'];
  /** Network protocol (tcp, udp, icmp) */
  protocol: Scalars['String']['output'];
  /** Rule sources (templates or custom) */
  sources?: Maybe<Array<Scalars['String']['output']>>;
};

export type Snapshot = {
  __typename?: 'Snapshot';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  hasMetadata: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  isCurrent: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  parentId?: Maybe<Scalars['String']['output']>;
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
  snapshot?: Maybe<Snapshot>;
  success: Scalars['Boolean']['output'];
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

export type UpdateMaintenanceTaskInput = {
  cronSchedule?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
  runAt?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type UpdateUserInputType = {
  /** User avatar image path */
  avatar?: InputMaybe<Scalars['String']['input']>;
  /** Current password required when updating password */
  currentPassword?: InputMaybe<Scalars['String']['input']>;
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
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER'
}

/** User model */
export type UserType = {
  __typename?: 'UserType';
  /** User avatar image path */
  avatar?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  lastName: Scalars['String']['output'];
  /** User namespace for real-time events */
  namespace?: Maybe<Scalars['String']['output']>;
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
  lastSync?: Maybe<Scalars['DateTimeISO']['output']>;
};

export type VmHealthCheckQueueType = {
  __typename?: 'VMHealthCheckQueueType';
  attempts: Scalars['Int']['output'];
  checkType: Scalars['String']['output'];
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error?: Maybe<Scalars['String']['output']>;
  executedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  executionTimeMs?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  machineId: Scalars['ID']['output'];
  maxAttempts: Scalars['Int']['output'];
  payload?: Maybe<Scalars['JSONObject']['output']>;
  priority: Scalars['String']['output'];
  result?: Maybe<Scalars['JSONObject']['output']>;
  scheduledFor: Scalars['DateTimeISO']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type VmHealthSnapshotType = {
  __typename?: 'VMHealthSnapshotType';
  applicationInventory?: Maybe<Scalars['JSONObject']['output']>;
  checksCompleted: Scalars['Int']['output'];
  checksFailed: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  customCheckResults?: Maybe<Scalars['JSONObject']['output']>;
  defenderStatus?: Maybe<Scalars['JSONObject']['output']>;
  diskSpaceInfo?: Maybe<Scalars['JSONObject']['output']>;
  errorSummary?: Maybe<Scalars['String']['output']>;
  executionTimeMs?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  machineId: Scalars['ID']['output'];
  osType?: Maybe<Scalars['String']['output']>;
  overallStatus: Scalars['String']['output'];
  resourceOptInfo?: Maybe<Scalars['JSONObject']['output']>;
  snapshotDate: Scalars['DateTimeISO']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  windowsUpdateInfo?: Maybe<Scalars['JSONObject']['output']>;
};

export type VmHealthStatsType = {
  __typename?: 'VMHealthStatsType';
  errorSnapshots: Scalars['Int']['output'];
  healthySnapshots: Scalars['Int']['output'];
  lastHealthCheck?: Maybe<Scalars['DateTimeISO']['output']>;
  lastHealthStatus?: Maybe<Scalars['String']['output']>;
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
  data?: Maybe<Scalars['JSONObject']['output']>;
  /** Unique identifier for the recommendation */
  id: Scalars['ID']['output'];
  /** ID of the VM this recommendation applies to */
  machineId: Scalars['ID']['output'];
  /** ID of the health snapshot that generated this recommendation, if applicable */
  snapshotId?: Maybe<Scalars['ID']['output']>;
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

export type WindowsDefenderStatus = {
  __typename?: 'WindowsDefenderStatus';
  antispywareEnabled: Scalars['Boolean']['output'];
  antivirusEnabled: Scalars['Boolean']['output'];
  antivirusSignatureLastUpdated: Scalars['DateTimeISO']['output'];
  antivirusSignatureVersion: Scalars['String']['output'];
  error?: Maybe<Scalars['String']['output']>;
  lastFullScanTime?: Maybe<Scalars['DateTimeISO']['output']>;
  lastQuickScanTime?: Maybe<Scalars['DateTimeISO']['output']>;
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
  daysIncluded?: Maybe<Scalars['Float']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  totalCount: Scalars['Int']['output'];
  updates: Array<WindowsUpdateHistoryItem>;
  vmId: Scalars['ID']['output'];
};

export type WindowsUpdateHistoryItem = {
  __typename?: 'WindowsUpdateHistoryItem';
  description?: Maybe<Scalars['String']['output']>;
  installDate: Scalars['DateTimeISO']['output'];
  kbArticle?: Maybe<Scalars['String']['output']>;
  resultCode?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type WindowsUpdateInfo = {
  __typename?: 'WindowsUpdateInfo';
  criticalUpdatesCount: Scalars['Int']['output'];
  error?: Maybe<Scalars['String']['output']>;
  lastCheckTime?: Maybe<Scalars['DateTimeISO']['output']>;
  lastInstallTime?: Maybe<Scalars['DateTimeISO']['output']>;
  pendingUpdates: Array<WindowsUpdateItem>;
  pendingUpdatesCount: Scalars['Int']['output'];
  securityUpdatesCount: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type WindowsUpdateItem = {
  __typename?: 'WindowsUpdateItem';
  description?: Maybe<Scalars['String']['output']>;
  kbArticle?: Maybe<Scalars['String']['output']>;
  severity: Scalars['String']['output'];
  sizeInMB: Scalars['Float']['output'];
  title: Scalars['String']['output'];
};
