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
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.This scalar is serialized to a string in ISO 8601 format and parsed from a string in ISO 8601 format. */
  DateTimeISO: { input: string; output: string; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: { [key: string]: any }; output: { [key: string]: any }; }
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

export type CleanupResultType = {
  __typename?: 'CleanupResultType';
  filterNames: Array<Scalars['String']['output']>;
  filtersRemoved: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
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

/** Type of rule conflict */
export enum ConflictType {
  Contradictory = 'CONTRADICTORY',
  Duplicate = 'DUPLICATE',
  PortOverlap = 'PORT_OVERLAP',
  PriorityConflict = 'PRIORITY_CONFLICT'
}

export type CreateApplicationInputType = {
  description: InputMaybe<Scalars['String']['input']>;
  installCommand: Scalars['JSONObject']['input'];
  name: Scalars['String']['input'];
  os: Array<Scalars['String']['input']>;
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CreateFirewallRuleInput = {
  action: RuleAction;
  connectionState: InputMaybe<Scalars['JSONObject']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  direction: RuleDirection;
  dstIpAddr: InputMaybe<Scalars['String']['input']>;
  dstIpMask: InputMaybe<Scalars['String']['input']>;
  dstPortEnd: InputMaybe<Scalars['Int']['input']>;
  dstPortStart: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  overridesDept: InputMaybe<Scalars['Boolean']['input']>;
  priority: Scalars['Int']['input'];
  protocol: InputMaybe<Scalars['String']['input']>;
  srcIpAddr: InputMaybe<Scalars['String']['input']>;
  srcIpMask: InputMaybe<Scalars['String']['input']>;
  srcPortEnd: InputMaybe<Scalars['Int']['input']>;
  srcPortStart: InputMaybe<Scalars['Int']['input']>;
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

export type EffectiveRuleSetType = {
  __typename?: 'EffectiveRuleSetType';
  conflicts: Array<RuleConflictType>;
  departmentRules: Array<FirewallRuleType>;
  effectiveRules: Array<FirewallRuleType>;
  vmId: Scalars['ID']['output'];
  vmRules: Array<FirewallRuleType>;
};

export type ExecuteMaintenanceInput = {
  machineId: Scalars['ID']['input'];
  parameters: InputMaybe<Scalars['JSONObject']['input']>;
  taskType: MaintenanceTaskType;
};

export type FirewallRuleSetType = {
  __typename?: 'FirewallRuleSetType';
  createdAt: Scalars['DateTimeISO']['output'];
  entityId: Scalars['String']['output'];
  entityType: RuleSetType;
  id: Scalars['ID']['output'];
  internalName: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastSyncedAt: Maybe<Scalars['DateTimeISO']['output']>;
  libvirtUuid: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  rules: Array<FirewallRuleType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  xmlContent: Maybe<Scalars['String']['output']>;
};

export type FirewallRuleType = {
  __typename?: 'FirewallRuleType';
  action: RuleAction;
  connectionState: Maybe<Scalars['JSONObject']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  direction: RuleDirection;
  dstIpAddr: Maybe<Scalars['String']['output']>;
  dstIpMask: Maybe<Scalars['String']['output']>;
  dstPortEnd: Maybe<Scalars['Int']['output']>;
  dstPortStart: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overridesDept: Scalars['Boolean']['output'];
  priority: Scalars['Int']['output'];
  protocol: Scalars['String']['output'];
  ruleSetId: Scalars['String']['output'];
  srcIpAddr: Maybe<Scalars['String']['output']>;
  srcIpMask: Maybe<Scalars['String']['output']>;
  srcPortEnd: Maybe<Scalars['Int']['output']>;
  srcPortStart: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type FlushResultType = {
  __typename?: 'FlushResultType';
  libvirtFilterName: Scalars['String']['output'];
  rulesApplied: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  timestamp: Scalars['DateTimeISO']['output'];
  vmId: Scalars['ID']['output'];
};

export type Gpu = {
  __typename?: 'GPU';
  memory: Scalars['Float']['output'];
  model: Scalars['String']['output'];
  pciBus: Scalars['String']['output'];
  vendor: Scalars['String']['output'];
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

/** Keep-alive heartbeat metrics for a VM connection */
export type KeepAliveMetrics = {
  __typename?: 'KeepAliveMetrics';
  /** Average round-trip time in milliseconds */
  averageRtt: Scalars['Float']['output'];
  /** Consecutive failures (resets on success) */
  consecutiveFailures: Scalars['Int']['output'];
  /** Total keep-alive failures (cumulative) */
  failureCount: Scalars['Int']['output'];
  /** Timestamp of last keep-alive failure */
  lastFailure: Maybe<Scalars['String']['output']>;
  /** Timestamp of last keep-alive response received */
  lastReceived: Maybe<Scalars['String']['output']>;
  /** Timestamp of last keep-alive request sent */
  lastSent: Maybe<Scalars['String']['output']>;
  /** Total keep-alive responses received */
  receivedCount: Scalars['Int']['output'];
  /** Total keep-alive requests sent */
  sentCount: Scalars['Int']['output'];
  /** Keep-alive success rate as percentage (e.g., "95.5%" or "N/A") */
  successRate: Scalars['String']['output'];
};

export type LibvirtFilterInfoType = {
  __typename?: 'LibvirtFilterInfoType';
  name: Scalars['String']['output'];
  uuid: Maybe<Scalars['String']['output']>;
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
  /** Calculate ISO checksum */
  calculateISOChecksum: Scalars['String']['output'];
  cleanupInfinibayFirewall: CleanupResultType;
  createApplication: ApplicationType;
  createDepartment: DepartmentType;
  createDepartmentFirewallRule: FirewallRuleType;
  createMachine: Machine;
  createMachineTemplate: MachineTemplateType;
  createMachineTemplateCategory: MachineTemplateCategoryType;
  createMaintenanceTask: MaintenanceTaskResponse;
  createNetwork: Scalars['Boolean']['output'];
  /** Create a snapshot of a virtual machine */
  createSnapshot: SnapshotResult;
  createUser: UserType;
  createVMFirewallRule: FirewallRuleType;
  deleteApplication: Scalars['Boolean']['output'];
  deleteFirewallRule: Scalars['Boolean']['output'];
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
  flushFirewallRules: FlushResultType;
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
  /** Register uploaded ISO */
  registerISO: Iso;
  /** Remove ISO file */
  removeISO: Scalars['Boolean']['output'];
  /** Remove a package from a virtual machine (legacy compatibility) */
  removePackage: CommandResult;
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
  syncFirewallToLibvirt: SyncResultType;
  /** Sync ISOs with filesystem */
  syncISOs: Scalars['Boolean']['output'];
  toggleMaintenanceTask: MaintenanceTaskResponse;
  triggerHealthCheckRound: HealthCheckRoundResult;
  updateAppSettings: AppSettings;
  updateApplication: ApplicationType;
  updateDepartmentName: DepartmentType;
  updateFirewallRule: FirewallRuleType;
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


export type MutationCalculateIsoChecksumArgs = {
  isoId: Scalars['String']['input'];
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInputType;
};


export type MutationCreateDepartmentArgs = {
  name: Scalars['String']['input'];
};


export type MutationCreateDepartmentFirewallRuleArgs = {
  departmentId: Scalars['ID']['input'];
  input: CreateFirewallRuleInput;
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


export type MutationCreateSnapshotArgs = {
  input: CreateSnapshotInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInputType;
};


export type MutationCreateVmFirewallRuleArgs = {
  input: CreateFirewallRuleInput;
  vmId: Scalars['ID']['input'];
};


export type MutationDeleteApplicationArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteFirewallRuleArgs = {
  ruleId: Scalars['ID']['input'];
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


export type MutationFlushFirewallRulesArgs = {
  vmId: Scalars['ID']['input'];
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


export type MutationRegisterIsoArgs = {
  filename: Scalars['String']['input'];
  os: Scalars['String']['input'];
  path: Scalars['String']['input'];
  size: Scalars['Float']['input'];
};


export type MutationRemoveIsoArgs = {
  isoId: Scalars['String']['input'];
};


export type MutationRemovePackageArgs = {
  machineId: Scalars['ID']['input'];
  packageName: Scalars['String']['input'];
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


export type MutationToggleMaintenanceTaskArgs = {
  enabled: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUpdateAppSettingsArgs = {
  input: AppSettingsInput;
};


export type MutationUpdateApplicationArgs = {
  id: Scalars['String']['input'];
  input: CreateApplicationInputType;
};


export type MutationUpdateDepartmentNameArgs = {
  input: UpdateDepartmentNameInput;
};


export type MutationUpdateFirewallRuleArgs = {
  input: UpdateFirewallRuleInput;
  ruleId: Scalars['ID']['input'];
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
  getDepartmentFirewallRules: Maybe<FirewallRuleSetType>;
  getEffectiveFirewallRules: EffectiveRuleSetType;
  getGraphics: Array<Gpu>;
  getLatestVMHealth: Maybe<VmHealthSnapshotType>;
  /** Get supported OS types */
  getSupportedOSTypes: Array<Scalars['String']['output']>;
  getSystemResources: SystemResources;
  /** Get installed applications inventory for a VM */
  getVMApplicationInventory: ApplicationInventory;
  getVMFirewallRules: Maybe<FirewallRuleSetType>;
  /** Get comprehensive health check status for a VM */
  getVMHealthStatus: HealthCheckStatus;
  /** Get automated recommendations for VM optimization, security, and maintenance based on system analysis. Returns up to 20 recommendations by default to prevent over-fetch. Use pagination for more results. */
  getVMRecommendations: Array<VmRecommendationType>;
  /** Get Windows Update history for a VM */
  getWindowsUpdateHistory: WindowsUpdateHistory;
  graphicConnection: Maybe<GraphicConfigurationType>;
  healthCheckQueueStats: QueueStatsType;
  healthQueueStatistics: QueueStatistics;
  latestVMHealthSnapshot: Maybe<VmHealthSnapshotType>;
  listInfinibayFilters: Array<LibvirtFilterInfoType>;
  /** List all installed packages on a virtual machine */
  listInstalledPackages: Array<PackageInfo>;
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
  validateFirewallRule: ValidationResultType;
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


export type QueryGetDepartmentFirewallRulesArgs = {
  departmentId: Scalars['ID']['input'];
};


export type QueryGetEffectiveFirewallRulesArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryGetLatestVmHealthArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryGetVmApplicationInventoryArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmFirewallRulesArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmHealthStatusArgs = {
  vmId: Scalars['ID']['input'];
};


export type QueryGetVmRecommendationsArgs = {
  filter: InputMaybe<RecommendationFilterInput>;
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
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


export type QueryListInstalledPackagesArgs = {
  machineId: Scalars['ID']['input'];
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


export type QueryValidateFirewallRuleArgs = {
  input: CreateFirewallRuleInput;
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

/** Action to take on matched traffic */
export enum RuleAction {
  Accept = 'ACCEPT',
  Drop = 'DROP',
  Reject = 'REJECT'
}

export type RuleConflictType = {
  __typename?: 'RuleConflictType';
  affectedRules: Array<FirewallRuleType>;
  message: Scalars['String']['output'];
  type: ConflictType;
};

/** Direction of network traffic */
export enum RuleDirection {
  In = 'IN',
  Inout = 'INOUT',
  Out = 'OUT'
}

/** Type of firewall rule set (Department or VM) */
export enum RuleSetType {
  Department = 'DEPARTMENT',
  Vm = 'VM'
}

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

export type SyncResultType = {
  __typename?: 'SyncResultType';
  errors: Array<Scalars['String']['output']>;
  filtersCreated: Scalars['Int']['output'];
  filtersUpdated: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
  vmsUpdated: Scalars['Int']['output'];
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

export type UpdateDepartmentNameInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateFirewallRuleInput = {
  action: InputMaybe<RuleAction>;
  connectionState: InputMaybe<Scalars['JSONObject']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  direction: InputMaybe<RuleDirection>;
  dstIpAddr: InputMaybe<Scalars['String']['input']>;
  dstIpMask: InputMaybe<Scalars['String']['input']>;
  dstPortEnd: InputMaybe<Scalars['Int']['input']>;
  dstPortStart: InputMaybe<Scalars['Int']['input']>;
  name: InputMaybe<Scalars['String']['input']>;
  overridesDept: InputMaybe<Scalars['Boolean']['input']>;
  priority: InputMaybe<Scalars['Int']['input']>;
  protocol: InputMaybe<Scalars['String']['input']>;
  srcIpAddr: InputMaybe<Scalars['String']['input']>;
  srcIpMask: InputMaybe<Scalars['String']['input']>;
  srcPortEnd: InputMaybe<Scalars['Int']['input']>;
  srcPortStart: InputMaybe<Scalars['Int']['input']>;
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

export type ValidationResultType = {
  __typename?: 'ValidationResultType';
  conflicts: Array<RuleConflictType>;
  isValid: Scalars['Boolean']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type VmConnectionInfo = {
  __typename?: 'VmConnectionInfo';
  isConnected: Scalars['Boolean']['output'];
  /** Keep-alive heartbeat metrics */
  keepAlive: Maybe<KeepAliveMetrics>;
  lastMessageTime: Scalars['String']['output'];
  reconnectAttempts: Scalars['Float']['output'];
  vmId: Scalars['String']['output'];
};

export type VmDiagnostics = {
  __typename?: 'VmDiagnostics';
  connectionStats: Maybe<VmConnectionInfo>;
  diagnostics: Array<Scalars['String']['output']>;
  infiniService: InfiniServiceStatus;
  manualCommands: Array<Scalars['String']['output']>;
  recommendations: Array<Scalars['String']['output']>;
  timestamp: Scalars['String']['output'];
  vmId: Scalars['String']['output'];
  vmName: Scalars['String']['output'];
  vmStatus: Scalars['String']['output'];
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

export type CreateDepartmentFirewallRuleMutationVariables = Exact<{
  departmentId: Scalars['ID']['input'];
  input: CreateFirewallRuleInput;
}>;


export type CreateDepartmentFirewallRuleMutation = { __typename?: 'Mutation', createDepartmentFirewallRule: { __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string } };

export type CreateVmFirewallRuleMutationVariables = Exact<{
  vmId: Scalars['ID']['input'];
  input: CreateFirewallRuleInput;
}>;


export type CreateVmFirewallRuleMutation = { __typename?: 'Mutation', createVMFirewallRule: { __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string } };

export type UpdateFirewallRuleMutationVariables = Exact<{
  ruleId: Scalars['ID']['input'];
  input: UpdateFirewallRuleInput;
}>;


export type UpdateFirewallRuleMutation = { __typename?: 'Mutation', updateFirewallRule: { __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string } };

export type DeleteFirewallRuleMutationVariables = Exact<{
  ruleId: Scalars['ID']['input'];
}>;


export type DeleteFirewallRuleMutation = { __typename?: 'Mutation', deleteFirewallRule: boolean };

export type FlushFirewallRulesMutationVariables = Exact<{
  vmId: Scalars['ID']['input'];
}>;


export type FlushFirewallRulesMutation = { __typename?: 'Mutation', flushFirewallRules: { __typename?: 'FlushResultType', success: boolean, vmId: string, rulesApplied: number, libvirtFilterName: string, timestamp: string } };

export type SyncFirewallToLibvirtMutationVariables = Exact<{ [key: string]: never; }>;


export type SyncFirewallToLibvirtMutation = { __typename?: 'Mutation', syncFirewallToLibvirt: { __typename?: 'SyncResultType', success: boolean, filtersCreated: number, filtersUpdated: number, vmsUpdated: number, errors: Array<string> } };

export type CleanupInfinibayFirewallMutationVariables = Exact<{ [key: string]: never; }>;


export type CleanupInfinibayFirewallMutation = { __typename?: 'Mutation', cleanupInfinibayFirewall: { __typename?: 'CleanupResultType', success: boolean, filtersRemoved: number, filterNames: Array<string> } };

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

export type GetDepartmentFirewallRulesQueryVariables = Exact<{
  departmentId: Scalars['ID']['input'];
}>;


export type GetDepartmentFirewallRulesQuery = { __typename?: 'Query', getDepartmentFirewallRules: { __typename?: 'FirewallRuleSetType', id: string, name: string, internalName: string, entityType: RuleSetType, entityId: string, priority: number, isActive: boolean, libvirtUuid: string | null, lastSyncedAt: string | null, createdAt: string, updatedAt: string, rules: Array<{ __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string }> } | null };

export type GetVmFirewallRulesQueryVariables = Exact<{
  vmId: Scalars['ID']['input'];
}>;


export type GetVmFirewallRulesQuery = { __typename?: 'Query', getVMFirewallRules: { __typename?: 'FirewallRuleSetType', id: string, name: string, internalName: string, entityType: RuleSetType, entityId: string, priority: number, isActive: boolean, libvirtUuid: string | null, lastSyncedAt: string | null, createdAt: string, updatedAt: string, rules: Array<{ __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string }> } | null };

export type GetEffectiveFirewallRulesQueryVariables = Exact<{
  vmId: Scalars['ID']['input'];
}>;


export type GetEffectiveFirewallRulesQuery = { __typename?: 'Query', getEffectiveFirewallRules: { __typename?: 'EffectiveRuleSetType', vmId: string, departmentRules: Array<{ __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string }>, vmRules: Array<{ __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string }>, effectiveRules: Array<{ __typename?: 'FirewallRuleType', id: string, ruleSetId: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, srcPortStart: number | null, srcPortEnd: number | null, dstPortStart: number | null, dstPortEnd: number | null, srcIpAddr: string | null, srcIpMask: string | null, dstIpAddr: string | null, dstIpMask: string | null, connectionState: { [key: string]: any } | null, overridesDept: boolean, createdAt: string, updatedAt: string }>, conflicts: Array<{ __typename?: 'RuleConflictType', type: ConflictType, message: string, affectedRules: Array<{ __typename?: 'FirewallRuleType', id: string, name: string, description: string | null, action: RuleAction, direction: RuleDirection, priority: number, protocol: string, dstPortStart: number | null, dstPortEnd: number | null }> }> } };

export type ListInfinibayFiltersQueryVariables = Exact<{ [key: string]: never; }>;


export type ListInfinibayFiltersQuery = { __typename?: 'Query', listInfinibayFilters: Array<{ __typename?: 'LibvirtFilterInfoType', name: string, uuid: string | null }> };

export type VmDetailedInfoQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type VmDetailedInfoQuery = { __typename?: 'Query', machine: { __typename?: 'Machine', id: string, name: string, status: string, userId: string | null, templateId: string | null, createdAt: string | null, configuration: { [key: string]: any } | null, localIP: string | null, publicIP: string | null, department: { __typename?: 'DepartmentType', id: string, name: string } | null, template: { __typename?: 'MachineTemplateType', id: string, name: string | null, description: string | null, cores: number, ram: number, storage: number } | null, user: { __typename?: 'UserType', id: string, email: string, firstName: string, lastName: string, role: string } | null } | null };

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
export const CreateDepartmentFirewallRuleDocument = gql`
    mutation CreateDepartmentFirewallRule($departmentId: ID!, $input: CreateFirewallRuleInput!) {
  createDepartmentFirewallRule(departmentId: $departmentId, input: $input) {
    id
    ruleSetId
    name
    description
    action
    direction
    priority
    protocol
    srcPortStart
    srcPortEnd
    dstPortStart
    dstPortEnd
    srcIpAddr
    srcIpMask
    dstIpAddr
    dstIpMask
    connectionState
    overridesDept
    createdAt
    updatedAt
  }
}
    `;
export type CreateDepartmentFirewallRuleMutationFn = ApolloReactCommon.MutationFunction<CreateDepartmentFirewallRuleMutation, CreateDepartmentFirewallRuleMutationVariables>;

/**
 * __useCreateDepartmentFirewallRuleMutation__
 *
 * To run a mutation, you first call `useCreateDepartmentFirewallRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDepartmentFirewallRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDepartmentFirewallRuleMutation, { data, loading, error }] = useCreateDepartmentFirewallRuleMutation({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateDepartmentFirewallRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateDepartmentFirewallRuleMutation, CreateDepartmentFirewallRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateDepartmentFirewallRuleMutation, CreateDepartmentFirewallRuleMutationVariables>(CreateDepartmentFirewallRuleDocument, options);
      }
export type CreateDepartmentFirewallRuleMutationHookResult = ReturnType<typeof useCreateDepartmentFirewallRuleMutation>;
export type CreateDepartmentFirewallRuleMutationResult = ApolloReactCommon.MutationResult<CreateDepartmentFirewallRuleMutation>;
export type CreateDepartmentFirewallRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateDepartmentFirewallRuleMutation, CreateDepartmentFirewallRuleMutationVariables>;
export const CreateVmFirewallRuleDocument = gql`
    mutation CreateVMFirewallRule($vmId: ID!, $input: CreateFirewallRuleInput!) {
  createVMFirewallRule(vmId: $vmId, input: $input) {
    id
    ruleSetId
    name
    description
    action
    direction
    priority
    protocol
    srcPortStart
    srcPortEnd
    dstPortStart
    dstPortEnd
    srcIpAddr
    srcIpMask
    dstIpAddr
    dstIpMask
    connectionState
    overridesDept
    createdAt
    updatedAt
  }
}
    `;
export type CreateVmFirewallRuleMutationFn = ApolloReactCommon.MutationFunction<CreateVmFirewallRuleMutation, CreateVmFirewallRuleMutationVariables>;

/**
 * __useCreateVmFirewallRuleMutation__
 *
 * To run a mutation, you first call `useCreateVmFirewallRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVmFirewallRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVmFirewallRuleMutation, { data, loading, error }] = useCreateVmFirewallRuleMutation({
 *   variables: {
 *      vmId: // value for 'vmId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateVmFirewallRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateVmFirewallRuleMutation, CreateVmFirewallRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateVmFirewallRuleMutation, CreateVmFirewallRuleMutationVariables>(CreateVmFirewallRuleDocument, options);
      }
export type CreateVmFirewallRuleMutationHookResult = ReturnType<typeof useCreateVmFirewallRuleMutation>;
export type CreateVmFirewallRuleMutationResult = ApolloReactCommon.MutationResult<CreateVmFirewallRuleMutation>;
export type CreateVmFirewallRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateVmFirewallRuleMutation, CreateVmFirewallRuleMutationVariables>;
export const UpdateFirewallRuleDocument = gql`
    mutation UpdateFirewallRule($ruleId: ID!, $input: UpdateFirewallRuleInput!) {
  updateFirewallRule(ruleId: $ruleId, input: $input) {
    id
    ruleSetId
    name
    description
    action
    direction
    priority
    protocol
    srcPortStart
    srcPortEnd
    dstPortStart
    dstPortEnd
    srcIpAddr
    srcIpMask
    dstIpAddr
    dstIpMask
    connectionState
    overridesDept
    createdAt
    updatedAt
  }
}
    `;
export type UpdateFirewallRuleMutationFn = ApolloReactCommon.MutationFunction<UpdateFirewallRuleMutation, UpdateFirewallRuleMutationVariables>;

/**
 * __useUpdateFirewallRuleMutation__
 *
 * To run a mutation, you first call `useUpdateFirewallRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFirewallRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFirewallRuleMutation, { data, loading, error }] = useUpdateFirewallRuleMutation({
 *   variables: {
 *      ruleId: // value for 'ruleId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFirewallRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateFirewallRuleMutation, UpdateFirewallRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateFirewallRuleMutation, UpdateFirewallRuleMutationVariables>(UpdateFirewallRuleDocument, options);
      }
export type UpdateFirewallRuleMutationHookResult = ReturnType<typeof useUpdateFirewallRuleMutation>;
export type UpdateFirewallRuleMutationResult = ApolloReactCommon.MutationResult<UpdateFirewallRuleMutation>;
export type UpdateFirewallRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateFirewallRuleMutation, UpdateFirewallRuleMutationVariables>;
export const DeleteFirewallRuleDocument = gql`
    mutation DeleteFirewallRule($ruleId: ID!) {
  deleteFirewallRule(ruleId: $ruleId)
}
    `;
export type DeleteFirewallRuleMutationFn = ApolloReactCommon.MutationFunction<DeleteFirewallRuleMutation, DeleteFirewallRuleMutationVariables>;

/**
 * __useDeleteFirewallRuleMutation__
 *
 * To run a mutation, you first call `useDeleteFirewallRuleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFirewallRuleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFirewallRuleMutation, { data, loading, error }] = useDeleteFirewallRuleMutation({
 *   variables: {
 *      ruleId: // value for 'ruleId'
 *   },
 * });
 */
export function useDeleteFirewallRuleMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteFirewallRuleMutation, DeleteFirewallRuleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteFirewallRuleMutation, DeleteFirewallRuleMutationVariables>(DeleteFirewallRuleDocument, options);
      }
export type DeleteFirewallRuleMutationHookResult = ReturnType<typeof useDeleteFirewallRuleMutation>;
export type DeleteFirewallRuleMutationResult = ApolloReactCommon.MutationResult<DeleteFirewallRuleMutation>;
export type DeleteFirewallRuleMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteFirewallRuleMutation, DeleteFirewallRuleMutationVariables>;
export const FlushFirewallRulesDocument = gql`
    mutation FlushFirewallRules($vmId: ID!) {
  flushFirewallRules(vmId: $vmId) {
    success
    vmId
    rulesApplied
    libvirtFilterName
    timestamp
  }
}
    `;
export type FlushFirewallRulesMutationFn = ApolloReactCommon.MutationFunction<FlushFirewallRulesMutation, FlushFirewallRulesMutationVariables>;

/**
 * __useFlushFirewallRulesMutation__
 *
 * To run a mutation, you first call `useFlushFirewallRulesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useFlushFirewallRulesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [flushFirewallRulesMutation, { data, loading, error }] = useFlushFirewallRulesMutation({
 *   variables: {
 *      vmId: // value for 'vmId'
 *   },
 * });
 */
export function useFlushFirewallRulesMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<FlushFirewallRulesMutation, FlushFirewallRulesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<FlushFirewallRulesMutation, FlushFirewallRulesMutationVariables>(FlushFirewallRulesDocument, options);
      }
export type FlushFirewallRulesMutationHookResult = ReturnType<typeof useFlushFirewallRulesMutation>;
export type FlushFirewallRulesMutationResult = ApolloReactCommon.MutationResult<FlushFirewallRulesMutation>;
export type FlushFirewallRulesMutationOptions = ApolloReactCommon.BaseMutationOptions<FlushFirewallRulesMutation, FlushFirewallRulesMutationVariables>;
export const SyncFirewallToLibvirtDocument = gql`
    mutation SyncFirewallToLibvirt {
  syncFirewallToLibvirt {
    success
    filtersCreated
    filtersUpdated
    vmsUpdated
    errors
  }
}
    `;
export type SyncFirewallToLibvirtMutationFn = ApolloReactCommon.MutationFunction<SyncFirewallToLibvirtMutation, SyncFirewallToLibvirtMutationVariables>;

/**
 * __useSyncFirewallToLibvirtMutation__
 *
 * To run a mutation, you first call `useSyncFirewallToLibvirtMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncFirewallToLibvirtMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncFirewallToLibvirtMutation, { data, loading, error }] = useSyncFirewallToLibvirtMutation({
 *   variables: {
 *   },
 * });
 */
export function useSyncFirewallToLibvirtMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SyncFirewallToLibvirtMutation, SyncFirewallToLibvirtMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SyncFirewallToLibvirtMutation, SyncFirewallToLibvirtMutationVariables>(SyncFirewallToLibvirtDocument, options);
      }
export type SyncFirewallToLibvirtMutationHookResult = ReturnType<typeof useSyncFirewallToLibvirtMutation>;
export type SyncFirewallToLibvirtMutationResult = ApolloReactCommon.MutationResult<SyncFirewallToLibvirtMutation>;
export type SyncFirewallToLibvirtMutationOptions = ApolloReactCommon.BaseMutationOptions<SyncFirewallToLibvirtMutation, SyncFirewallToLibvirtMutationVariables>;
export const CleanupInfinibayFirewallDocument = gql`
    mutation CleanupInfinibayFirewall {
  cleanupInfinibayFirewall {
    success
    filtersRemoved
    filterNames
  }
}
    `;
export type CleanupInfinibayFirewallMutationFn = ApolloReactCommon.MutationFunction<CleanupInfinibayFirewallMutation, CleanupInfinibayFirewallMutationVariables>;

/**
 * __useCleanupInfinibayFirewallMutation__
 *
 * To run a mutation, you first call `useCleanupInfinibayFirewallMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCleanupInfinibayFirewallMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cleanupInfinibayFirewallMutation, { data, loading, error }] = useCleanupInfinibayFirewallMutation({
 *   variables: {
 *   },
 * });
 */
export function useCleanupInfinibayFirewallMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CleanupInfinibayFirewallMutation, CleanupInfinibayFirewallMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CleanupInfinibayFirewallMutation, CleanupInfinibayFirewallMutationVariables>(CleanupInfinibayFirewallDocument, options);
      }
export type CleanupInfinibayFirewallMutationHookResult = ReturnType<typeof useCleanupInfinibayFirewallMutation>;
export type CleanupInfinibayFirewallMutationResult = ApolloReactCommon.MutationResult<CleanupInfinibayFirewallMutation>;
export type CleanupInfinibayFirewallMutationOptions = ApolloReactCommon.BaseMutationOptions<CleanupInfinibayFirewallMutation, CleanupInfinibayFirewallMutationVariables>;
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
export const GetDepartmentFirewallRulesDocument = gql`
    query GetDepartmentFirewallRules($departmentId: ID!) {
  getDepartmentFirewallRules(departmentId: $departmentId) {
    id
    name
    internalName
    entityType
    entityId
    priority
    isActive
    libvirtUuid
    lastSyncedAt
    createdAt
    updatedAt
    rules {
      id
      ruleSetId
      name
      description
      action
      direction
      priority
      protocol
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      connectionState
      overridesDept
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetDepartmentFirewallRulesQuery__
 *
 * To run a query within a React component, call `useGetDepartmentFirewallRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDepartmentFirewallRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDepartmentFirewallRulesQuery({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useGetDepartmentFirewallRulesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables> & ({ variables: GetDepartmentFirewallRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables>(GetDepartmentFirewallRulesDocument, options);
      }
export function useGetDepartmentFirewallRulesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables>(GetDepartmentFirewallRulesDocument, options);
        }
export function useGetDepartmentFirewallRulesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables>(GetDepartmentFirewallRulesDocument, options);
        }
export type GetDepartmentFirewallRulesQueryHookResult = ReturnType<typeof useGetDepartmentFirewallRulesQuery>;
export type GetDepartmentFirewallRulesLazyQueryHookResult = ReturnType<typeof useGetDepartmentFirewallRulesLazyQuery>;
export type GetDepartmentFirewallRulesSuspenseQueryHookResult = ReturnType<typeof useGetDepartmentFirewallRulesSuspenseQuery>;
export type GetDepartmentFirewallRulesQueryResult = ApolloReactCommon.QueryResult<GetDepartmentFirewallRulesQuery, GetDepartmentFirewallRulesQueryVariables>;
export function refetchGetDepartmentFirewallRulesQuery(variables: GetDepartmentFirewallRulesQueryVariables) {
      return { query: GetDepartmentFirewallRulesDocument, variables: variables }
    }
export const GetVmFirewallRulesDocument = gql`
    query GetVMFirewallRules($vmId: ID!) {
  getVMFirewallRules(vmId: $vmId) {
    id
    name
    internalName
    entityType
    entityId
    priority
    isActive
    libvirtUuid
    lastSyncedAt
    createdAt
    updatedAt
    rules {
      id
      ruleSetId
      name
      description
      action
      direction
      priority
      protocol
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      connectionState
      overridesDept
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetVmFirewallRulesQuery__
 *
 * To run a query within a React component, call `useGetVmFirewallRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVmFirewallRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVmFirewallRulesQuery({
 *   variables: {
 *      vmId: // value for 'vmId'
 *   },
 * });
 */
export function useGetVmFirewallRulesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables> & ({ variables: GetVmFirewallRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables>(GetVmFirewallRulesDocument, options);
      }
export function useGetVmFirewallRulesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables>(GetVmFirewallRulesDocument, options);
        }
export function useGetVmFirewallRulesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables>(GetVmFirewallRulesDocument, options);
        }
export type GetVmFirewallRulesQueryHookResult = ReturnType<typeof useGetVmFirewallRulesQuery>;
export type GetVmFirewallRulesLazyQueryHookResult = ReturnType<typeof useGetVmFirewallRulesLazyQuery>;
export type GetVmFirewallRulesSuspenseQueryHookResult = ReturnType<typeof useGetVmFirewallRulesSuspenseQuery>;
export type GetVmFirewallRulesQueryResult = ApolloReactCommon.QueryResult<GetVmFirewallRulesQuery, GetVmFirewallRulesQueryVariables>;
export function refetchGetVmFirewallRulesQuery(variables: GetVmFirewallRulesQueryVariables) {
      return { query: GetVmFirewallRulesDocument, variables: variables }
    }
export const GetEffectiveFirewallRulesDocument = gql`
    query GetEffectiveFirewallRules($vmId: ID!) {
  getEffectiveFirewallRules(vmId: $vmId) {
    vmId
    departmentRules {
      id
      ruleSetId
      name
      description
      action
      direction
      priority
      protocol
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      connectionState
      overridesDept
      createdAt
      updatedAt
    }
    vmRules {
      id
      ruleSetId
      name
      description
      action
      direction
      priority
      protocol
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      connectionState
      overridesDept
      createdAt
      updatedAt
    }
    effectiveRules {
      id
      ruleSetId
      name
      description
      action
      direction
      priority
      protocol
      srcPortStart
      srcPortEnd
      dstPortStart
      dstPortEnd
      srcIpAddr
      srcIpMask
      dstIpAddr
      dstIpMask
      connectionState
      overridesDept
      createdAt
      updatedAt
    }
    conflicts {
      type
      message
      affectedRules {
        id
        name
        description
        action
        direction
        priority
        protocol
        dstPortStart
        dstPortEnd
      }
    }
  }
}
    `;

/**
 * __useGetEffectiveFirewallRulesQuery__
 *
 * To run a query within a React component, call `useGetEffectiveFirewallRulesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEffectiveFirewallRulesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEffectiveFirewallRulesQuery({
 *   variables: {
 *      vmId: // value for 'vmId'
 *   },
 * });
 */
export function useGetEffectiveFirewallRulesQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables> & ({ variables: GetEffectiveFirewallRulesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables>(GetEffectiveFirewallRulesDocument, options);
      }
export function useGetEffectiveFirewallRulesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables>(GetEffectiveFirewallRulesDocument, options);
        }
export function useGetEffectiveFirewallRulesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables>(GetEffectiveFirewallRulesDocument, options);
        }
export type GetEffectiveFirewallRulesQueryHookResult = ReturnType<typeof useGetEffectiveFirewallRulesQuery>;
export type GetEffectiveFirewallRulesLazyQueryHookResult = ReturnType<typeof useGetEffectiveFirewallRulesLazyQuery>;
export type GetEffectiveFirewallRulesSuspenseQueryHookResult = ReturnType<typeof useGetEffectiveFirewallRulesSuspenseQuery>;
export type GetEffectiveFirewallRulesQueryResult = ApolloReactCommon.QueryResult<GetEffectiveFirewallRulesQuery, GetEffectiveFirewallRulesQueryVariables>;
export function refetchGetEffectiveFirewallRulesQuery(variables: GetEffectiveFirewallRulesQueryVariables) {
      return { query: GetEffectiveFirewallRulesDocument, variables: variables }
    }
export const ListInfinibayFiltersDocument = gql`
    query ListInfinibayFilters {
  listInfinibayFilters {
    name
    uuid
  }
}
    `;

/**
 * __useListInfinibayFiltersQuery__
 *
 * To run a query within a React component, call `useListInfinibayFiltersQuery` and pass it any options that fit your needs.
 * When your component renders, `useListInfinibayFiltersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useListInfinibayFiltersQuery({
 *   variables: {
 *   },
 * });
 */
export function useListInfinibayFiltersQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>(ListInfinibayFiltersDocument, options);
      }
export function useListInfinibayFiltersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>(ListInfinibayFiltersDocument, options);
        }
export function useListInfinibayFiltersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>(ListInfinibayFiltersDocument, options);
        }
export type ListInfinibayFiltersQueryHookResult = ReturnType<typeof useListInfinibayFiltersQuery>;
export type ListInfinibayFiltersLazyQueryHookResult = ReturnType<typeof useListInfinibayFiltersLazyQuery>;
export type ListInfinibayFiltersSuspenseQueryHookResult = ReturnType<typeof useListInfinibayFiltersSuspenseQuery>;
export type ListInfinibayFiltersQueryResult = ApolloReactCommon.QueryResult<ListInfinibayFiltersQuery, ListInfinibayFiltersQueryVariables>;
export function refetchListInfinibayFiltersQuery(variables?: ListInfinibayFiltersQueryVariables) {
      return { query: ListInfinibayFiltersDocument, variables: variables }
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