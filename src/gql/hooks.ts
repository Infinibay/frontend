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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: { [key: string]: any }; output: { [key: string]: any }; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any; }
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

export type AutomationDepartmentType = {
  __typename?: 'AutomationDepartmentType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AutomationExecutionFiltersInput = {
  automationId: InputMaybe<Scalars['ID']['input']>;
  dateFrom: InputMaybe<Scalars['DateTimeISO']['input']>;
  dateTo: InputMaybe<Scalars['DateTimeISO']['input']>;
  evaluationResult: InputMaybe<Scalars['Boolean']['input']>;
  machineId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Array<AutomationExecutionStatus>>;
};

/** Status of an automation execution */
export enum AutomationExecutionStatus {
  Completed = 'COMPLETED',
  Evaluating = 'EVALUATING',
  ExecutingScript = 'EXECUTING_SCRIPT',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Skipped = 'SKIPPED',
  Triggered = 'TRIGGERED'
}

export type AutomationExecutionType = {
  __typename?: 'AutomationExecutionType';
  automationId: Scalars['String']['output'];
  completedAt: Maybe<Scalars['DateTimeISO']['output']>;
  contextSnapshot: Maybe<Scalars['JSONObject']['output']>;
  error: Maybe<Scalars['String']['output']>;
  evaluatedAt: Maybe<Scalars['DateTimeISO']['output']>;
  evaluationResult: Scalars['Boolean']['output'];
  evaluationTimeMs: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  machine: AutomationMachineType;
  scriptExecution: Maybe<AutomationScriptExecutionType>;
  snapshot: Maybe<AutomationSnapshotType>;
  status: AutomationExecutionStatus;
  triggerReason: Scalars['String']['output'];
  triggeredAt: Scalars['DateTimeISO']['output'];
};

export type AutomationFiltersInput = {
  createdById: InputMaybe<Scalars['ID']['input']>;
  departmentId: InputMaybe<Scalars['ID']['input']>;
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
  search: InputMaybe<Scalars['String']['input']>;
  status: InputMaybe<Array<AutomationStatus>>;
};

export type AutomationMachineType = {
  __typename?: 'AutomationMachineType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  osType: Maybe<Os>;
};

/** Status of an automation recommendation */
export enum AutomationRecommendationStatus {
  AutoResolved = 'AUTO_RESOLVED',
  Dismissed = 'DISMISSED',
  Executed = 'EXECUTED',
  Expired = 'EXPIRED',
  Pending = 'PENDING',
  Snoozed = 'SNOOZED'
}

export type AutomationRecommendationType = {
  __typename?: 'AutomationRecommendationType';
  actionTakenAt: Maybe<Scalars['DateTimeISO']['output']>;
  actionTakenBy: Maybe<AutomationUserType>;
  autoResolveReason: Maybe<Scalars['String']['output']>;
  autoResolvedAt: Maybe<Scalars['DateTimeISO']['output']>;
  automationId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  dismissReason: Maybe<Scalars['String']['output']>;
  execution: Maybe<AutomationExecutionType>;
  id: Scalars['ID']['output'];
  machine: AutomationMachineType;
  script: Maybe<AutomationScriptRefType>;
  scriptExecution: Maybe<AutomationScriptExecutionType>;
  severity: RecommendationSeverity;
  snoozeUntil: Maybe<Scalars['DateTimeISO']['output']>;
  status: AutomationRecommendationStatus;
  systemScript: Maybe<SystemScriptType>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  userAction: Maybe<RecommendationUserAction>;
};

/** Scope of automation targeting */
export enum AutomationScope {
  AllVms = 'ALL_VMS',
  Department = 'DEPARTMENT',
  ExcludeVms = 'EXCLUDE_VMS',
  SpecificVms = 'SPECIFIC_VMS'
}

export type AutomationScriptExecutionType = {
  __typename?: 'AutomationScriptExecutionType';
  completedAt: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  startedAt: Maybe<Scalars['DateTimeISO']['output']>;
  status: Scalars['String']['output'];
};

export type AutomationScriptRefType = {
  __typename?: 'AutomationScriptRefType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  os: Os;
};

export type AutomationScriptType = {
  __typename?: 'AutomationScriptType';
  executeOnTrigger: Scalars['Boolean']['output'];
  executionOrder: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  os: Os;
  script: Maybe<AutomationScriptRefType>;
  systemScript: Maybe<SystemScriptType>;
};

export type AutomationSnapshotType = {
  __typename?: 'AutomationSnapshotType';
  id: Scalars['ID']['output'];
  snapshotDate: Scalars['DateTimeISO']['output'];
};

/** Workflow status of an automation */
export enum AutomationStatus {
  Approved = 'APPROVED',
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  PendingApproval = 'PENDING_APPROVAL',
  Rejected = 'REJECTED'
}

export type AutomationTargetType = {
  __typename?: 'AutomationTargetType';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['ID']['output'];
  machine: AutomationMachineType;
};

export type AutomationTemplateType = {
  __typename?: 'AutomationTemplateType';
  blocklyWorkspace: Scalars['JSONObject']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  recommendationType: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  usageCount: Scalars['Int']['output'];
};

export type AutomationType = {
  __typename?: 'AutomationType';
  approvedAt: Maybe<Scalars['DateTimeISO']['output']>;
  approvedBy: Maybe<AutomationUserType>;
  automationScripts: Array<AutomationScriptType>;
  blocklyWorkspace: Scalars['JSONObject']['output'];
  compilationError: Maybe<Scalars['String']['output']>;
  compiledCode: Maybe<Scalars['String']['output']>;
  cooldownMinutes: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Maybe<AutomationUserType>;
  department: Maybe<AutomationDepartmentType>;
  description: Maybe<Scalars['String']['output']>;
  executionCount: Scalars['Int']['output'];
  generatedCode: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCompiled: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  lastTriggeredAt: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  recentExecutions: Array<AutomationExecutionType>;
  recommendationActionText: Maybe<Scalars['String']['output']>;
  recommendationText: Maybe<Scalars['String']['output']>;
  recommendationType: Maybe<Scalars['String']['output']>;
  status: AutomationStatus;
  targetScope: AutomationScope;
  targets: Array<AutomationTargetType>;
  triggerRate: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};


export type AutomationTypeRecentExecutionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type AutomationUserType = {
  __typename?: 'AutomationUserType';
  email: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AutomationValidationResultType = {
  __typename?: 'AutomationValidationResultType';
  errors: Array<ValidationErrorType>;
  isValid: Scalars['Boolean']['output'];
  warnings: Array<ValidationWarningType>;
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

export type BlockDefinitionOutputType = {
  __typename?: 'BlockDefinitionOutputType';
  args0: Maybe<Scalars['JSONObject']['output']>;
  colour: Scalars['Int']['output'];
  helpUrl: Maybe<Scalars['String']['output']>;
  message0: Scalars['String']['output'];
  nextStatement: Maybe<Scalars['Boolean']['output']>;
  output: Maybe<Scalars['String']['output']>;
  previousStatement: Maybe<Scalars['Boolean']['output']>;
  tooltip: Maybe<Scalars['String']['output']>;
  type: Scalars['String']['output'];
};

/** Output type of a custom block */
export enum BlockOutputType {
  Array = 'ARRAY',
  Boolean = 'BOOLEAN',
  Number = 'NUMBER',
  String = 'STRING',
  Void = 'VOID'
}

export type BlocklyToolboxType = {
  __typename?: 'BlocklyToolboxType';
  categories: Array<ToolboxCategoryType>;
};

export type BrNetfilterDiagnosticsType = {
  __typename?: 'BrNetfilterDiagnosticsType';
  callArptables: Scalars['Int']['output'];
  callIp6tables: Scalars['Int']['output'];
  callIptables: Scalars['Int']['output'];
  moduleLoaded: Scalars['Boolean']['output'];
  persistenceFileExists: Scalars['Boolean']['output'];
};

export type BridgeDiagnosticsType = {
  __typename?: 'BridgeDiagnosticsType';
  attachedInterfaces: Array<Scalars['String']['output']>;
  exists: Scalars['Boolean']['output'];
  ipAddresses: Array<Scalars['String']['output']>;
  isUp: Scalars['Boolean']['output'];
  mtu: Maybe<Scalars['Int']['output']>;
  state: Maybe<Scalars['String']['output']>;
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

export type CreateAutomationInput = {
  blocklyWorkspace: Scalars['JSONObject']['input'];
  cooldownMinutes: InputMaybe<Scalars['Int']['input']>;
  departmentId: InputMaybe<Scalars['ID']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  /** VMs to exclude (for EXCLUDE_VMS scope) */
  excludeMachineIds: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  priority: InputMaybe<Scalars['Int']['input']>;
  recommendationActionText: InputMaybe<Scalars['String']['input']>;
  recommendationText: InputMaybe<Scalars['String']['input']>;
  recommendationType: InputMaybe<Scalars['String']['input']>;
  /** VMs to include (for SPECIFIC_VMS scope) */
  targetMachineIds: InputMaybe<Array<Scalars['ID']['input']>>;
  targetScope: InputMaybe<AutomationScope>;
};

export type CreateCustomBlockInput = {
  blockDefinition: Scalars['JSONObject']['input'];
  category: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  generatorCode: Scalars['String']['input'];
  inputs: Array<CustomBlockInputDef>;
  name: Scalars['String']['input'];
  outputType: BlockOutputType;
  supportedOS: InputMaybe<Array<Os>>;
};

export type CreateDepartmentFirewallInput = {
  firewallCustomRules: InputMaybe<Scalars['JSON']['input']>;
  firewallDefaultConfig: InputMaybe<Scalars['String']['input']>;
  firewallPolicy: FirewallPolicy;
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
  firstBootScripts: Array<FirstBootScriptInputType>;
  keyboard: InputMaybe<Scalars['String']['input']>;
  locale: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  os: MachineOs;
  password: Scalars['String']['input'];
  pciBus: InputMaybe<Scalars['String']['input']>;
  productKey: InputMaybe<Scalars['String']['input']>;
  templateId: InputMaybe<Scalars['String']['input']>;
  timezone: InputMaybe<Scalars['String']['input']>;
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

export type CreateScriptInput = {
  category: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  description: InputMaybe<Scalars['String']['input']>;
  format: ScriptFormat;
  name: Scalars['String']['input'];
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateSnapshotInput = {
  description: InputMaybe<Scalars['String']['input']>;
  machineId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateSystemScriptInput = {
  category: InputMaybe<Scalars['String']['input']>;
  codeLinux: InputMaybe<Scalars['String']['input']>;
  codeWindows: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requiredHealthFields: InputMaybe<Array<Scalars['String']['input']>>;
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

export type CustomBlockInputDef = {
  defaultValue: InputMaybe<Scalars['JSONObject']['input']>;
  label: Scalars['String']['input'];
  name: Scalars['String']['input'];
  required: InputMaybe<Scalars['Boolean']['input']>;
  type: Scalars['String']['input'];
};

export type CustomBlockInputType = {
  __typename?: 'CustomBlockInputType';
  defaultValue: Maybe<Scalars['JSONObject']['output']>;
  label: Scalars['String']['output'];
  name: Scalars['String']['output'];
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
};

export type CustomBlockType = {
  __typename?: 'CustomBlockType';
  blockDefinition: Scalars['JSONObject']['output'];
  category: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Maybe<AutomationUserType>;
  description: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  generatorCode: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  inputs: Array<CustomBlockInputType>;
  isBuiltIn: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  outputType: BlockOutputType;
  supportedOS: Array<Os>;
  updatedAt: Scalars['DateTimeISO']['output'];
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

export type DepartmentNetworkDiagnosticsType = {
  __typename?: 'DepartmentNetworkDiagnosticsType';
  brNetfilter: BrNetfilterDiagnosticsType;
  bridge: BridgeDiagnosticsType;
  departmentId: Scalars['String']['output'];
  departmentName: Scalars['String']['output'];
  dnsmasq: DnsmasqDiagnosticsType;
  manualCommands: Array<Scalars['String']['output']>;
  nat: NatDiagnosticsType;
  recommendations: Array<Scalars['String']['output']>;
  timestamp: Scalars['Timestamp']['output'];
};

export type DepartmentType = {
  __typename?: 'DepartmentType';
  bridgeName: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  dnsServers: Maybe<Array<Scalars['String']['output']>>;
  firewallCustomRules: Maybe<Scalars['JSON']['output']>;
  firewallDefaultConfig: Maybe<Scalars['String']['output']>;
  firewallPolicy: FirewallPolicy;
  gatewayIP: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internetSpeed: Maybe<Scalars['Int']['output']>;
  ipSubnet: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ntpServers: Maybe<Array<Scalars['String']['output']>>;
  totalMachines: Maybe<Scalars['Float']['output']>;
};

export type DhcpPacketSummaryType = {
  __typename?: 'DhcpPacketSummaryType';
  ackPackets: Scalars['Int']['output'];
  discoverPackets: Scalars['Int']['output'];
  offerPackets: Scalars['Int']['output'];
  requestPackets: Scalars['Int']['output'];
  totalPackets: Scalars['Int']['output'];
};

export type DhcpTrafficCaptureType = {
  __typename?: 'DhcpTrafficCaptureType';
  bridgeName: Scalars['String']['output'];
  duration: Scalars['Int']['output'];
  packets: Array<Scalars['String']['output']>;
  summary: DhcpPacketSummaryType;
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

export type DnsmasqDiagnosticsType = {
  __typename?: 'DnsmasqDiagnosticsType';
  configExists: Scalars['Boolean']['output'];
  configPath: Scalars['String']['output'];
  isRunning: Scalars['Boolean']['output'];
  leaseFileExists: Scalars['Boolean']['output'];
  leasePath: Scalars['String']['output'];
  listeningPort: Scalars['Boolean']['output'];
  logExists: Scalars['Boolean']['output'];
  logPath: Scalars['String']['output'];
  pid: Maybe<Scalars['Int']['output']>;
  pidMatches: Scalars['Boolean']['output'];
  recentLogLines: Maybe<Array<Scalars['String']['output']>>;
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

export type ExecuteScriptInput = {
  inputValues: Scalars['JSON']['input'];
  machineId: Scalars['ID']['input'];
  runAs: InputMaybe<Scalars['String']['input']>;
  scriptId: Scalars['ID']['input'];
};

/** Script execution status */
export enum ExecutionStatus {
  Cancelled = 'CANCELLED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Success = 'SUCCESS',
  Timeout = 'TIMEOUT'
}

/** Script execution trigger type */
export enum ExecutionType {
  FirstBoot = 'FIRST_BOOT',
  OnDemand = 'ON_DEMAND',
  Scheduled = 'SCHEDULED'
}

/** Política de firewall del departamento: ALLOW_ALL (Permitir Todo) o BLOCK_ALL (Bloquear Todo) */
export enum FirewallPolicy {
  AllowAll = 'ALLOW_ALL',
  BlockAll = 'BLOCK_ALL'
}

export type FirewallRuleSetType = {
  __typename?: 'FirewallRuleSetType';
  createdAt: Scalars['DateTimeISO']['output'];
  entityId: Scalars['String']['output'];
  entityType: RuleSetType;
  id: Scalars['ID']['output'];
  internalName: Scalars['String']['output'];
  isActive: Scalars['Boolean']['output'];
  lastSyncedAt: Maybe<Scalars['DateTimeISO']['output']>;
  /** @deprecated Este campo es legacy de la arquitectura libvirt y ya no se utiliza con nftables */
  libvirtUuid: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  rules: Array<FirewallRuleType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  /** @deprecated Este campo es legacy de la arquitectura libvirt y ya no se utiliza con nftables */
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

export type FirstBootScriptInputType = {
  inputValues: Scalars['JSONObject']['input'];
  scriptId: Scalars['String']['input'];
};

export type FlushResultType = {
  __typename?: 'FlushResultType';
  /** Nombre del chain de nftables donde se aplicaron las reglas */
  chainName: Scalars['String']['output'];
  /** @deprecated Use chainName instead. This field is from the legacy libvirt architecture. */
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

export type InputOptionType = {
  __typename?: 'InputOptionType';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
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

/** Información de un chain de nftables asociado a una VM (anteriormente filtro libvirt) */
export type LibvirtFilterInfoType = {
  __typename?: 'LibvirtFilterInfoType';
  /** Nombre del chain de nftables */
  chainName: Scalars['String']['output'];
  /** @deprecated Use chainName instead. This field is from the legacy libvirt architecture. */
  name: Scalars['String']['output'];
  /** @deprecated Use vmId instead. This field is from the legacy libvirt architecture. */
  uuid: Maybe<Scalars['String']['output']>;
  /** ID de la VM asociada al chain */
  vmId: Maybe<Scalars['String']['output']>;
};

export type LinkScriptToAutomationInput = {
  automationId: Scalars['ID']['input'];
  executeOnTrigger: InputMaybe<Scalars['Boolean']['input']>;
  executionOrder: InputMaybe<Scalars['Int']['input']>;
  os: Os;
  /** ID of regular script (mutually exclusive with systemScriptId) */
  scriptId: InputMaybe<Scalars['ID']['input']>;
  /** ID of system script (mutually exclusive with scriptId) */
  systemScriptId: InputMaybe<Scalars['ID']['input']>;
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

export type MachineType = {
  __typename?: 'MachineType';
  department: Maybe<DepartmentType>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  os: Scalars['String']['output'];
  status: Scalars['String']['output'];
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
  approveAutomation: AutomationType;
  archiveAutomation: AutomationType;
  assignScriptToDepartment: Scalars['Boolean']['output'];
  /** Calculate ISO checksum */
  calculateISOChecksum: Scalars['String']['output'];
  cancelScheduledScript: ScheduleScriptResponseType;
  cancelScriptExecution: ScriptExecutionResponseType;
  cleanupInfinibayFirewall: CleanupResultType;
  compileAutomation: AutomationType;
  createApplication: ApplicationType;
  createAutomation: AutomationType;
  createAutomationFromTemplate: AutomationType;
  createCustomBlock: CustomBlockType;
  createDepartment: DepartmentType;
  createDepartmentFirewallRule: FirewallRuleType;
  createMachine: Machine;
  createMachineTemplate: MachineTemplateType;
  createMachineTemplateCategory: MachineTemplateCategoryType;
  createMaintenanceTask: MaintenanceTaskResponse;
  createNetwork: Scalars['Boolean']['output'];
  createScript: ScriptResponseType;
  /** Create a snapshot of a virtual machine */
  createSnapshot: SnapshotResult;
  createSystemScript: SystemScriptType;
  createUser: UserType;
  createVMFirewallRule: FirewallRuleType;
  deleteApplication: Scalars['Boolean']['output'];
  deleteAutomation: Scalars['Boolean']['output'];
  deleteCustomBlock: Scalars['Boolean']['output'];
  deleteFirewallRule: Scalars['Boolean']['output'];
  deleteMaintenanceTask: MaintenanceTaskResponse;
  deleteNetwork: Scalars['Boolean']['output'];
  deleteScript: ScriptResponseType;
  /** Delete a snapshot from a virtual machine */
  deleteSnapshot: SuccessType;
  deleteSystemScript: Scalars['Boolean']['output'];
  destroyDepartment: DepartmentType;
  destroyMachine: SuccessType;
  destroyMachineTemplate: Scalars['Boolean']['output'];
  destroyMachineTemplateCategory: Scalars['Boolean']['output'];
  disableAutomation: AutomationType;
  dismissAllRecommendations: Scalars['Int']['output'];
  dismissRecommendation: AutomationRecommendationType;
  duplicateAutomation: AutomationType;
  enableAutomation: AutomationType;
  executeCommand: CommandExecutionResponseType;
  executeImmediateMaintenance: MaintenanceExecutionResponse;
  executeMaintenanceTask: MaintenanceExecutionResponse;
  executeRecommendation: AutomationRecommendationType;
  executeScript: ScriptExecutionResponseType;
  flushFirewallRules: FlushResultType;
  forcePowerOff: SuccessType;
  /** Force power off and restore snapshot (emergency recovery) */
  forceRestoreSnapshot: SuccessType;
  /** Install a package on a virtual machine (legacy compatibility) */
  installPackage: CommandResult;
  killProcess: ProcessControlResult;
  killProcesses: Array<ProcessControlResult>;
  linkScriptToAutomation: AutomationScriptType;
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
  rejectAutomation: AutomationType;
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
  scheduleScript: ScheduleScriptResponseType;
  setNetworkBridgeName: Scalars['Boolean']['output'];
  setNetworkIp: Scalars['Boolean']['output'];
  setNetworkIpRange: Scalars['Boolean']['output'];
  setupNode: DyummyType;
  snoozeAllRecommendations: Scalars['Int']['output'];
  snoozeRecommendation: AutomationRecommendationType;
  submitAutomationForApproval: AutomationType;
  suspend: SuccessType;
  syncFirewallToLibvirt: SyncResultType;
  /** Sync ISOs with filesystem */
  syncISOs: Scalars['Boolean']['output'];
  testAutomation: AutomationExecutionType;
  testAutomationWithContext: TestResultType;
  testCustomBlock: Scalars['JSONObject']['output'];
  toggleMaintenanceTask: MaintenanceTaskResponse;
  triggerHealthCheckRound: HealthCheckRoundResult;
  unassignScriptFromDepartment: Scalars['Boolean']['output'];
  unlinkScriptFromAutomation: Scalars['Boolean']['output'];
  updateAppSettings: AppSettings;
  updateApplication: ApplicationType;
  updateAutomation: AutomationType;
  updateAutomationScript: AutomationScriptType;
  updateCustomBlock: CustomBlockType;
  updateDepartmentFirewallPolicy: DepartmentType;
  updateDepartmentName: DepartmentType;
  updateDepartmentNetwork: DepartmentType;
  updateFirewallRule: FirewallRuleType;
  updateMachineHardware: Machine;
  updateMachineName: Machine;
  updateMachineTemplate: MachineTemplateType;
  updateMachineTemplateCategory: MachineTemplateCategoryType;
  updateMachineUser: Machine;
  updateMaintenanceTask: MaintenanceTaskResponse;
  /** Update a package on a virtual machine (legacy compatibility) */
  updatePackage: CommandResult;
  updateScheduledScript: ScheduleScriptResponseType;
  updateScript: ScriptResponseType;
  updateSystemScript: SystemScriptType;
  updateUser: UserType;
  /** Validate ISO file integrity */
  validateISO: Scalars['Boolean']['output'];
};


export type MutationApproveAutomationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationArchiveAutomationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationAssignScriptToDepartmentArgs = {
  departmentId: Scalars['ID']['input'];
  scriptId: Scalars['ID']['input'];
};


export type MutationCalculateIsoChecksumArgs = {
  isoId: Scalars['String']['input'];
};


export type MutationCancelScheduledScriptArgs = {
  executionId: Scalars['ID']['input'];
};


export type MutationCancelScriptExecutionArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCompileAutomationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateApplicationArgs = {
  input: CreateApplicationInputType;
};


export type MutationCreateAutomationArgs = {
  input: CreateAutomationInput;
};


export type MutationCreateAutomationFromTemplateArgs = {
  name: InputMaybe<Scalars['String']['input']>;
  templateId: Scalars['ID']['input'];
};


export type MutationCreateCustomBlockArgs = {
  input: CreateCustomBlockInput;
};


export type MutationCreateDepartmentArgs = {
  firewallConfig: InputMaybe<CreateDepartmentFirewallInput>;
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


export type MutationCreateScriptArgs = {
  input: CreateScriptInput;
};


export type MutationCreateSnapshotArgs = {
  input: CreateSnapshotInput;
};


export type MutationCreateSystemScriptArgs = {
  input: CreateSystemScriptInput;
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


export type MutationDeleteAutomationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCustomBlockArgs = {
  id: Scalars['ID']['input'];
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


export type MutationDeleteScriptArgs = {
  force?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
};


export type MutationDeleteSnapshotArgs = {
  input: DeleteSnapshotInput;
};


export type MutationDeleteSystemScriptArgs = {
  id: Scalars['ID']['input'];
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


export type MutationDisableAutomationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDismissRecommendationArgs = {
  id: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
};


export type MutationDuplicateAutomationArgs = {
  id: Scalars['ID']['input'];
  newName: Scalars['String']['input'];
};


export type MutationEnableAutomationArgs = {
  id: Scalars['ID']['input'];
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


export type MutationExecuteRecommendationArgs = {
  id: Scalars['ID']['input'];
};


export type MutationExecuteScriptArgs = {
  input: ExecuteScriptInput;
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


export type MutationLinkScriptToAutomationArgs = {
  input: LinkScriptToAutomationInput;
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


export type MutationRejectAutomationArgs = {
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
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


export type MutationScheduleScriptArgs = {
  input: ScheduleScriptInput;
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


export type MutationSnoozeAllRecommendationsArgs = {
  duration: SnoozeDuration;
};


export type MutationSnoozeRecommendationArgs = {
  duration: SnoozeDuration;
  id: Scalars['ID']['input'];
};


export type MutationSubmitAutomationForApprovalArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSuspendArgs = {
  id: Scalars['String']['input'];
};


export type MutationTestAutomationArgs = {
  automationId: Scalars['ID']['input'];
  machineId: Scalars['ID']['input'];
};


export type MutationTestAutomationWithContextArgs = {
  automationId: Scalars['ID']['input'];
  context: Scalars['JSONObject']['input'];
};


export type MutationTestCustomBlockArgs = {
  id: Scalars['ID']['input'];
  sampleContext: InputMaybe<Scalars['JSONObject']['input']>;
  sampleInputs: Scalars['JSONObject']['input'];
};


export type MutationToggleMaintenanceTaskArgs = {
  enabled: Scalars['Boolean']['input'];
  id: Scalars['ID']['input'];
};


export type MutationUnassignScriptFromDepartmentArgs = {
  departmentId: Scalars['ID']['input'];
  scriptId: Scalars['ID']['input'];
};


export type MutationUnlinkScriptFromAutomationArgs = {
  automationId: Scalars['ID']['input'];
  os: Os;
  scriptId: InputMaybe<Scalars['ID']['input']>;
  systemScriptId: InputMaybe<Scalars['ID']['input']>;
};


export type MutationUpdateAppSettingsArgs = {
  input: AppSettingsInput;
};


export type MutationUpdateApplicationArgs = {
  id: Scalars['String']['input'];
  input: CreateApplicationInputType;
};


export type MutationUpdateAutomationArgs = {
  id: Scalars['ID']['input'];
  input: UpdateAutomationInput;
};


export type MutationUpdateAutomationScriptArgs = {
  executeOnTrigger: InputMaybe<Scalars['Boolean']['input']>;
  executionOrder: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
};


export type MutationUpdateCustomBlockArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCustomBlockInput;
};


export type MutationUpdateDepartmentFirewallPolicyArgs = {
  departmentId: Scalars['String']['input'];
  input: UpdateDepartmentFirewallPolicyInput;
};


export type MutationUpdateDepartmentNameArgs = {
  input: UpdateDepartmentNameInput;
};


export type MutationUpdateDepartmentNetworkArgs = {
  input: UpdateDepartmentNetworkInput;
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


export type MutationUpdateScheduledScriptArgs = {
  input: UpdateScheduledScriptInput;
};


export type MutationUpdateScriptArgs = {
  input: UpdateScriptInput;
};


export type MutationUpdateSystemScriptArgs = {
  id: Scalars['ID']['input'];
  input: UpdateSystemScriptInput;
};


export type MutationUpdateUserArgs = {
  id: Scalars['String']['input'];
  input: UpdateUserInputType;
};


export type MutationValidateIsoArgs = {
  isoId: Scalars['String']['input'];
};

export type NatDiagnosticsType = {
  __typename?: 'NatDiagnosticsType';
  chainExists: Scalars['Boolean']['output'];
  ipForwardingEnabled: Scalars['Boolean']['output'];
  ruleDetails: Maybe<Scalars['String']['output']>;
  ruleExists: Scalars['Boolean']['output'];
  tableExists: Scalars['Boolean']['output'];
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

/** Operating system */
export enum Os {
  Linux = 'LINUX',
  Windows = 'WINDOWS'
}

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
  automation: Maybe<AutomationType>;
  automationExecution: Maybe<AutomationExecutionType>;
  automationExecutions: Array<AutomationExecutionType>;
  automationTemplate: Maybe<AutomationTemplateType>;
  automationTemplateCategories: Array<Scalars['String']['output']>;
  automationTemplates: Array<AutomationTemplateType>;
  automations: Array<AutomationType>;
  /** Get all available ISOs */
  availableISOs: Array<Iso>;
  backgroundHealthServiceStatus: BackgroundHealthServiceStatus;
  blocklyToolbox: BlocklyToolboxType;
  captureDepartmentDhcpTraffic: DhcpTrafficCaptureType;
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
  customBlock: Maybe<CustomBlockType>;
  customBlocks: Array<CustomBlockType>;
  department: Maybe<DepartmentType>;
  departmentNetworkDiagnostics: DepartmentNetworkDiagnosticsType;
  departmentScripts: Array<ScriptType>;
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
  pendingRecommendationCount: Scalars['Int']['output'];
  pendingRecommendations: Array<AutomationRecommendationType>;
  previewGeneratedCode: Scalars['String']['output'];
  recommendation: Maybe<AutomationRecommendationType>;
  recommendations: Array<AutomationRecommendationType>;
  /** Run a specific health check on a VM */
  runHealthCheck: GenericHealthCheckResponse;
  scheduledScript: Maybe<ScheduledScriptType>;
  scheduledScripts: Array<ScheduledScriptType>;
  script: Maybe<ScriptType>;
  scriptExecution: Maybe<ScriptExecutionType>;
  scriptExecutions: Array<ScriptExecutionType>;
  scriptExecutionsFiltered: ScriptExecutionsResponseType;
  scripts: Array<ScriptType>;
  /** Search for available packages on a virtual machine */
  searchPackages: Array<PackageInfo>;
  /** Get current socket connection statistics for all VMs */
  socketConnectionStats: Maybe<SocketConnectionStats>;
  systemScript: Maybe<SystemScriptType>;
  systemScriptCategories: Array<Scalars['String']['output']>;
  systemScripts: Array<SystemScriptType>;
  user: UserType;
  users: Array<UserType>;
  validateFirewallRule: ValidationResultType;
  validateWorkspace: AutomationValidationResultType;
  vmHealthCheckQueue: Array<VmHealthCheckQueueType>;
  vmHealthHistory: Array<VmHealthSnapshotType>;
  vmHealthStats: VmHealthStatsType;
  /** Get comprehensive diagnostics for VM socket connection issues */
  vmSocketDiagnostics: VmDiagnostics;
  vmUsers: Array<Scalars['String']['output']>;
};


export type QueryApplicationArgs = {
  id: Scalars['String']['input'];
};


export type QueryAutomationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAutomationExecutionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAutomationExecutionsArgs = {
  filters: InputMaybe<AutomationExecutionFiltersInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAutomationTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAutomationTemplatesArgs = {
  category: InputMaybe<Scalars['String']['input']>;
};


export type QueryAutomationsArgs = {
  filters: InputMaybe<AutomationFiltersInput>;
};


export type QueryCaptureDepartmentDhcpTrafficArgs = {
  departmentId: Scalars['String']['input'];
  durationSeconds?: Scalars['Int']['input'];
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


export type QueryCustomBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomBlocksArgs = {
  category: InputMaybe<Scalars['String']['input']>;
  includeBuiltIn?: InputMaybe<Scalars['Boolean']['input']>;
};


export type QueryDepartmentArgs = {
  id: Scalars['String']['input'];
};


export type QueryDepartmentNetworkDiagnosticsArgs = {
  departmentId: Scalars['String']['input'];
};


export type QueryDepartmentScriptsArgs = {
  departmentId: Scalars['ID']['input'];
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


export type QueryPendingRecommendationCountArgs = {
  machineId: InputMaybe<Scalars['ID']['input']>;
};


export type QueryPendingRecommendationsArgs = {
  machineId: Scalars['ID']['input'];
};


export type QueryPreviewGeneratedCodeArgs = {
  blocklyWorkspace: Scalars['JSONObject']['input'];
};


export type QueryRecommendationArgs = {
  id: Scalars['ID']['input'];
};


export type QueryRecommendationsArgs = {
  filters: InputMaybe<RecommendationFiltersInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRunHealthCheckArgs = {
  checkName: HealthCheckName;
  vmId: Scalars['ID']['input'];
};


export type QueryScheduledScriptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScheduledScriptsArgs = {
  filters: InputMaybe<ScheduledScriptsFiltersInput>;
};


export type QueryScriptArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScriptExecutionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryScriptExecutionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineId: Scalars['ID']['input'];
  status: InputMaybe<ExecutionStatus>;
};


export type QueryScriptExecutionsFilteredArgs = {
  filters: ScriptExecutionsFiltersInput;
};


export type QueryScriptsArgs = {
  filters: InputMaybe<ScriptFiltersInput>;
};


export type QuerySearchPackagesArgs = {
  machineId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
};


export type QuerySystemScriptArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemScriptsArgs = {
  category: InputMaybe<Scalars['String']['input']>;
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


export type QueryValidateWorkspaceArgs = {
  blocklyWorkspace: Scalars['JSONObject']['input'];
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


export type QueryVmUsersArgs = {
  machineId: Scalars['ID']['input'];
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

export type RecommendationFiltersInput = {
  automationId: InputMaybe<Scalars['ID']['input']>;
  machineId: InputMaybe<Scalars['ID']['input']>;
  severity: InputMaybe<Array<RecommendationSeverity>>;
  status: InputMaybe<Array<AutomationRecommendationStatus>>;
};

/** Severity level of a recommendation */
export enum RecommendationSeverity {
  Critical = 'CRITICAL',
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM'
}

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

/** User action taken on a recommendation */
export enum RecommendationUserAction {
  Dismiss = 'DISMISS',
  Execute = 'EXECUTE',
  Snooze = 'SNOOZE'
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

export type ScheduleScriptInput = {
  departmentId: InputMaybe<Scalars['ID']['input']>;
  inputValues: Scalars['JSON']['input'];
  machineIds: InputMaybe<Array<Scalars['ID']['input']>>;
  maxExecutions: InputMaybe<Scalars['Int']['input']>;
  repeatIntervalMinutes: InputMaybe<Scalars['Int']['input']>;
  runAs: InputMaybe<Scalars['String']['input']>;
  scheduleType: ScheduleType;
  scheduledFor: InputMaybe<Scalars['DateTimeISO']['input']>;
  scriptId: Scalars['ID']['input'];
};

export type ScheduleScriptResponseType = {
  __typename?: 'ScheduleScriptResponseType';
  error: Maybe<Scalars['String']['output']>;
  executionIds: Maybe<Array<Scalars['ID']['output']>>;
  executions: Maybe<Array<ScheduledScriptType>>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  warnings: Maybe<Array<Scalars['String']['output']>>;
};

/** Script schedule type */
export enum ScheduleType {
  Immediate = 'IMMEDIATE',
  OneTime = 'ONE_TIME',
  Periodic = 'PERIODIC'
}

export type ScheduledScriptType = {
  __typename?: 'ScheduledScriptType';
  completedAt: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error: Maybe<Scalars['String']['output']>;
  executedAs: Maybe<Scalars['String']['output']>;
  executionCount: Scalars['Int']['output'];
  executionType: ExecutionType;
  exitCode: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  inputValues: Scalars['JSON']['output'];
  isActive: Scalars['Boolean']['output'];
  lastExecutedAt: Maybe<Scalars['DateTimeISO']['output']>;
  machine: MachineType;
  maxExecutions: Maybe<Scalars['Int']['output']>;
  nextExecutionAt: Maybe<Scalars['DateTimeISO']['output']>;
  repeatIntervalMinutes: Maybe<Scalars['Int']['output']>;
  scheduleType: ScheduleType;
  scheduledFor: Maybe<Scalars['DateTimeISO']['output']>;
  script: ScriptType;
  startedAt: Maybe<Scalars['DateTimeISO']['output']>;
  status: ExecutionStatus;
  stderr: Maybe<Scalars['String']['output']>;
  stdout: Maybe<Scalars['String']['output']>;
  triggeredBy: Maybe<UserType>;
};

export type ScheduledScriptsFiltersInput = {
  departmentId: InputMaybe<Scalars['ID']['input']>;
  limit: InputMaybe<Scalars['Int']['input']>;
  machineId: InputMaybe<Scalars['ID']['input']>;
  scheduleType: InputMaybe<ScheduleType>;
  scriptId: InputMaybe<Scalars['ID']['input']>;
  status: InputMaybe<Array<ExecutionStatus>>;
};

export type ScriptExecutionResponseType = {
  __typename?: 'ScriptExecutionResponseType';
  error: Maybe<Scalars['String']['output']>;
  execution: Maybe<ScriptExecutionType>;
  message: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ScriptExecutionType = {
  __typename?: 'ScriptExecutionType';
  completedAt: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error: Maybe<Scalars['String']['output']>;
  executedAs: Maybe<Scalars['String']['output']>;
  executionCount: Scalars['Int']['output'];
  executionType: ExecutionType;
  exitCode: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  inputValues: Scalars['JSON']['output'];
  lastExecutedAt: Maybe<Scalars['DateTimeISO']['output']>;
  machine: MachineType;
  maxExecutions: Maybe<Scalars['Int']['output']>;
  repeatIntervalMinutes: Maybe<Scalars['Int']['output']>;
  scheduledFor: Maybe<Scalars['DateTimeISO']['output']>;
  script: ScriptType;
  startedAt: Maybe<Scalars['DateTimeISO']['output']>;
  status: ExecutionStatus;
  stderr: Maybe<Scalars['String']['output']>;
  stdout: Maybe<Scalars['String']['output']>;
  triggeredBy: Maybe<UserType>;
};

export type ScriptExecutionsFiltersInput = {
  departmentId: InputMaybe<Scalars['ID']['input']>;
  endDate: InputMaybe<Scalars['DateTimeISO']['input']>;
  executionType: InputMaybe<ExecutionType>;
  limit: Scalars['Int']['input'];
  machineId: InputMaybe<Scalars['ID']['input']>;
  offset: Scalars['Int']['input'];
  scriptId: InputMaybe<Scalars['ID']['input']>;
  startDate: InputMaybe<Scalars['DateTimeISO']['input']>;
  status: InputMaybe<ExecutionStatus>;
};

export type ScriptExecutionsResponseType = {
  __typename?: 'ScriptExecutionsResponseType';
  executions: Array<ScriptExecutionType>;
  hasMore: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type ScriptFiltersInput = {
  category: InputMaybe<Scalars['String']['input']>;
  os: InputMaybe<Os>;
  search: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Script file format */
export enum ScriptFormat {
  Json = 'JSON',
  Yaml = 'YAML'
}

export type ScriptInputType = {
  __typename?: 'ScriptInputType';
  default: Maybe<Scalars['JSON']['output']>;
  description: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  name: Scalars['String']['output'];
  options: Maybe<Array<InputOptionType>>;
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
  validation: Maybe<Scalars['JSON']['output']>;
};

export type ScriptResponseType = {
  __typename?: 'ScriptResponseType';
  error: Maybe<Scalars['String']['output']>;
  message: Maybe<Scalars['String']['output']>;
  script: Maybe<ScriptType>;
  success: Scalars['Boolean']['output'];
};

export type ScriptType = {
  __typename?: 'ScriptType';
  category: Maybe<Scalars['String']['output']>;
  content: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Maybe<UserType>;
  departmentCount: Maybe<Scalars['Int']['output']>;
  description: Maybe<Scalars['String']['output']>;
  executionCount: Maybe<Scalars['Int']['output']>;
  fileName: Scalars['String']['output'];
  hasInputs: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  inputCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  os: Array<Os>;
  parsedInputs: Array<ScriptInputType>;
  shell: ShellType;
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

/** Shell type for script execution */
export enum ShellType {
  Bash = 'BASH',
  Cmd = 'CMD',
  Powershell = 'POWERSHELL',
  Sh = 'SH'
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

/** Duration for snoozing a recommendation (ISO 8601) */
export enum SnoozeDuration {
  P7D = 'P7D',
  Pt1H = 'PT1H',
  Pt4H = 'PT4H',
  Pt24H = 'PT24H'
}

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

export type SystemScriptType = {
  __typename?: 'SystemScriptType';
  category: Scalars['String']['output'];
  codeLinux: Maybe<Scalars['String']['output']>;
  codeWindows: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy: Maybe<AutomationUserType>;
  description: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  requiredHealthFields: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TestResultType = {
  __typename?: 'TestResultType';
  error: Maybe<Scalars['String']['output']>;
  evaluationTimeMs: Scalars['Int']['output'];
  generatedCode: Scalars['String']['output'];
  logs: Array<Scalars['String']['output']>;
  result: Maybe<Scalars['Boolean']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ToolboxCategoryType = {
  __typename?: 'ToolboxCategoryType';
  blocks: Array<BlockDefinitionOutputType>;
  colour: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type UpdateAutomationInput = {
  blocklyWorkspace: InputMaybe<Scalars['JSONObject']['input']>;
  cooldownMinutes: InputMaybe<Scalars['Int']['input']>;
  departmentId: InputMaybe<Scalars['ID']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  /** VMs to exclude (for EXCLUDE_VMS scope) */
  excludeMachineIds: InputMaybe<Array<Scalars['ID']['input']>>;
  name: InputMaybe<Scalars['String']['input']>;
  priority: InputMaybe<Scalars['Int']['input']>;
  recommendationActionText: InputMaybe<Scalars['String']['input']>;
  recommendationText: InputMaybe<Scalars['String']['input']>;
  recommendationType: InputMaybe<Scalars['String']['input']>;
  /** VMs to include (for SPECIFIC_VMS scope) */
  targetMachineIds: InputMaybe<Array<Scalars['ID']['input']>>;
  targetScope: InputMaybe<AutomationScope>;
};

export type UpdateCustomBlockInput = {
  blockDefinition: InputMaybe<Scalars['JSONObject']['input']>;
  category: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayName: InputMaybe<Scalars['String']['input']>;
  generatorCode: InputMaybe<Scalars['String']['input']>;
  inputs: InputMaybe<Array<CustomBlockInputDef>>;
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
  outputType: InputMaybe<BlockOutputType>;
  supportedOS: InputMaybe<Array<Os>>;
};

export type UpdateDepartmentFirewallPolicyInput = {
  firewallCustomRules: InputMaybe<Scalars['JSON']['input']>;
  firewallDefaultConfig: Scalars['String']['input'];
  firewallPolicy: FirewallPolicy;
};

export type UpdateDepartmentNameInput = {
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};

export type UpdateDepartmentNetworkInput = {
  dnsServers: InputMaybe<Array<Scalars['String']['input']>>;
  id: Scalars['ID']['input'];
  ntpServers: InputMaybe<Array<Scalars['String']['input']>>;
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

export type UpdateScheduledScriptInput = {
  executionId: Scalars['ID']['input'];
  inputValues: InputMaybe<Scalars['JSON']['input']>;
  maxExecutions: InputMaybe<Scalars['Int']['input']>;
  repeatIntervalMinutes: InputMaybe<Scalars['Int']['input']>;
  runAs: InputMaybe<Scalars['String']['input']>;
  scheduledFor: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type UpdateScriptInput = {
  category: InputMaybe<Scalars['String']['input']>;
  content: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name: InputMaybe<Scalars['String']['input']>;
  tags: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateSystemScriptInput = {
  category: InputMaybe<Scalars['String']['input']>;
  codeLinux: InputMaybe<Scalars['String']['input']>;
  codeWindows: InputMaybe<Scalars['String']['input']>;
  description: InputMaybe<Scalars['String']['input']>;
  displayName: InputMaybe<Scalars['String']['input']>;
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
  requiredHealthFields: InputMaybe<Array<Scalars['String']['input']>>;
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

export type ValidationErrorType = {
  __typename?: 'ValidationErrorType';
  blockId: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type ValidationResultType = {
  __typename?: 'ValidationResultType';
  conflicts: Array<RuleConflictType>;
  isValid: Scalars['Boolean']['output'];
  warnings: Array<Scalars['String']['output']>;
};

export type ValidationWarningType = {
  __typename?: 'ValidationWarningType';
  blockId: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
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

export type GetAutomationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAutomationQuery = { __typename?: 'Query', automation: { __typename?: 'AutomationType', id: string, name: string, description: string | null, blocklyWorkspace: { [key: string]: any }, generatedCode: string, isCompiled: boolean, compiledCode: string | null, compilationError: string | null, targetScope: AutomationScope, status: AutomationStatus, isEnabled: boolean, priority: number, cooldownMinutes: number, recommendationType: string | null, recommendationText: string | null, recommendationActionText: string | null, executionCount: number, lastTriggeredAt: string | null, triggerRate: number | null, approvedAt: string | null, createdAt: string, updatedAt: string, department: { __typename?: 'AutomationDepartmentType', id: string, name: string } | null, targets: Array<{ __typename?: 'AutomationTargetType', id: string, machine: { __typename?: 'AutomationMachineType', id: string, name: string } }>, automationScripts: Array<{ __typename?: 'AutomationScriptType', id: string, os: Os, executionOrder: number, isEnabled: boolean, executeOnTrigger: boolean, script: { __typename?: 'AutomationScriptRefType', id: string, name: string, os: Os } | null, systemScript: { __typename?: 'SystemScriptType', id: string, displayName: string } | null }>, createdBy: { __typename?: 'AutomationUserType', id: string, name: string } | null, approvedBy: { __typename?: 'AutomationUserType', id: string, name: string } | null } | null };

export type GetAutomationsQueryVariables = Exact<{
  filters: InputMaybe<AutomationFiltersInput>;
}>;


export type GetAutomationsQuery = { __typename?: 'Query', automations: Array<{ __typename?: 'AutomationType', id: string, name: string, description: string | null, status: AutomationStatus, isEnabled: boolean, targetScope: AutomationScope, executionCount: number, lastTriggeredAt: string | null, triggerRate: number | null, createdAt: string, updatedAt: string, department: { __typename?: 'AutomationDepartmentType', id: string, name: string } | null }> };

export type GetAutomationExecutionsQueryVariables = Exact<{
  filters: InputMaybe<AutomationExecutionFiltersInput>;
  limit: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetAutomationExecutionsQuery = { __typename?: 'Query', automationExecutions: Array<{ __typename?: 'AutomationExecutionType', id: string, automationId: string, triggerReason: string, evaluationResult: boolean, status: AutomationExecutionStatus, evaluationTimeMs: number | null, error: string | null, triggeredAt: string, completedAt: string | null, machine: { __typename?: 'AutomationMachineType', id: string, name: string } }> };

export type GetAutomationExecutionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAutomationExecutionQuery = { __typename?: 'Query', automationExecution: { __typename?: 'AutomationExecutionType', id: string, automationId: string, triggerReason: string, evaluationResult: boolean, status: AutomationExecutionStatus, contextSnapshot: { [key: string]: any } | null, evaluationTimeMs: number | null, error: string | null, triggeredAt: string, evaluatedAt: string | null, completedAt: string | null, machine: { __typename?: 'AutomationMachineType', id: string, name: string }, snapshot: { __typename?: 'AutomationSnapshotType', id: string, snapshotDate: string } | null, scriptExecution: { __typename?: 'AutomationScriptExecutionType', id: string, status: string } | null } | null };

export type GetCustomBlockQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCustomBlockQuery = { __typename?: 'Query', customBlock: { __typename?: 'CustomBlockType', id: string, name: string, displayName: string, description: string | null, category: string, blockDefinition: { [key: string]: any }, generatorCode: string, outputType: BlockOutputType, supportedOS: Array<Os>, isBuiltIn: boolean, isEnabled: boolean, createdAt: string, updatedAt: string, inputs: Array<{ __typename?: 'CustomBlockInputType', name: string, type: string, label: string, required: boolean, defaultValue: { [key: string]: any } | null }>, createdBy: { __typename?: 'AutomationUserType', id: string, name: string } | null } | null };

export type GetCustomBlocksQueryVariables = Exact<{
  category: InputMaybe<Scalars['String']['input']>;
  includeBuiltIn: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type GetCustomBlocksQuery = { __typename?: 'Query', customBlocks: Array<{ __typename?: 'CustomBlockType', id: string, name: string, displayName: string, description: string | null, category: string, blockDefinition: { [key: string]: any }, outputType: BlockOutputType, supportedOS: Array<Os>, isBuiltIn: boolean, isEnabled: boolean, inputs: Array<{ __typename?: 'CustomBlockInputType', name: string, type: string, label: string, required: boolean, defaultValue: { [key: string]: any } | null }> }> };

export type GetBlocklyToolboxQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBlocklyToolboxQuery = { __typename?: 'Query', blocklyToolbox: { __typename?: 'BlocklyToolboxType', categories: Array<{ __typename?: 'ToolboxCategoryType', name: string, colour: string, blocks: Array<{ __typename?: 'BlockDefinitionOutputType', type: string, message0: string, args0: { [key: string]: any } | null, output: string | null, previousStatement: boolean | null, nextStatement: boolean | null, colour: number, tooltip: string | null, helpUrl: string | null }> }> } };

export type PreviewGeneratedCodeQueryVariables = Exact<{
  blocklyWorkspace: Scalars['JSONObject']['input'];
}>;


export type PreviewGeneratedCodeQuery = { __typename?: 'Query', previewGeneratedCode: string };

export type ValidateWorkspaceQueryVariables = Exact<{
  blocklyWorkspace: Scalars['JSONObject']['input'];
}>;


export type ValidateWorkspaceQuery = { __typename?: 'Query', validateWorkspace: { __typename?: 'AutomationValidationResultType', isValid: boolean, errors: Array<{ __typename?: 'ValidationErrorType', blockId: string | null, message: string }>, warnings: Array<{ __typename?: 'ValidationWarningType', blockId: string | null, message: string }> } };

export type GetRecommendationQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetRecommendationQuery = { __typename?: 'Query', recommendation: { __typename?: 'AutomationRecommendationType', id: string, automationId: string, title: string, description: string | null, severity: RecommendationSeverity, status: AutomationRecommendationStatus, userAction: RecommendationUserAction | null, actionTakenAt: string | null, snoozeUntil: string | null, dismissReason: string | null, autoResolvedAt: string | null, autoResolveReason: string | null, createdAt: string, updatedAt: string, machine: { __typename?: 'AutomationMachineType', id: string, name: string }, execution: { __typename?: 'AutomationExecutionType', id: string, status: AutomationExecutionStatus } | null, actionTakenBy: { __typename?: 'AutomationUserType', id: string, name: string } | null, script: { __typename?: 'AutomationScriptRefType', id: string, name: string, os: Os } | null, systemScript: { __typename?: 'SystemScriptType', id: string, displayName: string } | null, scriptExecution: { __typename?: 'AutomationScriptExecutionType', id: string, status: string } | null } | null };

export type GetRecommendationsQueryVariables = Exact<{
  filters: InputMaybe<RecommendationFiltersInput>;
  limit: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetRecommendationsQuery = { __typename?: 'Query', recommendations: Array<{ __typename?: 'AutomationRecommendationType', id: string, automationId: string, title: string, description: string | null, severity: RecommendationSeverity, status: AutomationRecommendationStatus, userAction: RecommendationUserAction | null, actionTakenAt: string | null, snoozeUntil: string | null, autoResolvedAt: string | null, autoResolveReason: string | null, createdAt: string, machine: { __typename?: 'AutomationMachineType', id: string, name: string }, actionTakenBy: { __typename?: 'AutomationUserType', id: string, name: string } | null }> };

export type GetPendingRecommendationsQueryVariables = Exact<{
  machineId: Scalars['ID']['input'];
}>;


export type GetPendingRecommendationsQuery = { __typename?: 'Query', pendingRecommendations: Array<{ __typename?: 'AutomationRecommendationType', id: string, title: string, description: string | null, severity: RecommendationSeverity, status: AutomationRecommendationStatus, createdAt: string, machine: { __typename?: 'AutomationMachineType', id: string, name: string }, script: { __typename?: 'AutomationScriptRefType', id: string, name: string } | null, systemScript: { __typename?: 'SystemScriptType', id: string, displayName: string } | null }> };

export type GlobalPendingRecommendationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GlobalPendingRecommendationsQuery = { __typename?: 'Query', recommendations: Array<{ __typename?: 'AutomationRecommendationType', id: string, title: string, description: string | null, severity: RecommendationSeverity, status: AutomationRecommendationStatus, createdAt: string, machine: { __typename?: 'AutomationMachineType', id: string, name: string }, script: { __typename?: 'AutomationScriptRefType', id: string, name: string } | null, systemScript: { __typename?: 'SystemScriptType', id: string, displayName: string } | null }> };

export type GetPendingRecommendationCountQueryVariables = Exact<{
  machineId: InputMaybe<Scalars['ID']['input']>;
}>;


export type GetPendingRecommendationCountQuery = { __typename?: 'Query', pendingRecommendationCount: number };

export type GetSystemScriptQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSystemScriptQuery = { __typename?: 'Query', systemScript: { __typename?: 'SystemScriptType', id: string, name: string, displayName: string, description: string | null, codeWindows: string | null, codeLinux: string | null, category: string, requiredHealthFields: Array<string>, isEnabled: boolean, createdAt: string, updatedAt: string, createdBy: { __typename?: 'AutomationUserType', id: string, name: string } | null } | null };

export type GetSystemScriptsQueryVariables = Exact<{
  category: InputMaybe<Scalars['String']['input']>;
}>;


export type GetSystemScriptsQuery = { __typename?: 'Query', systemScripts: Array<{ __typename?: 'SystemScriptType', id: string, name: string, displayName: string, description: string | null, category: string, requiredHealthFields: Array<string>, isEnabled: boolean }> };

export type GetSystemScriptCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSystemScriptCategoriesQuery = { __typename?: 'Query', systemScriptCategories: Array<string> };

export type CreateAutomationMutationVariables = Exact<{
  input: CreateAutomationInput;
}>;


export type CreateAutomationMutation = { __typename?: 'Mutation', createAutomation: { __typename?: 'AutomationType', id: string, name: string, status: AutomationStatus, createdAt: string } };

export type UpdateAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateAutomationInput;
}>;


export type UpdateAutomationMutation = { __typename?: 'Mutation', updateAutomation: { __typename?: 'AutomationType', id: string, name: string, blocklyWorkspace: { [key: string]: any }, generatedCode: string, isCompiled: boolean, updatedAt: string } };

export type DeleteAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteAutomationMutation = { __typename?: 'Mutation', deleteAutomation: boolean };

export type DuplicateAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  newName: Scalars['String']['input'];
}>;


export type DuplicateAutomationMutation = { __typename?: 'Mutation', duplicateAutomation: { __typename?: 'AutomationType', id: string, name: string } };

export type SubmitAutomationForApprovalMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SubmitAutomationForApprovalMutation = { __typename?: 'Mutation', submitAutomationForApproval: { __typename?: 'AutomationType', id: string, status: AutomationStatus, isCompiled: boolean, compilationError: string | null } };

export type ApproveAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ApproveAutomationMutation = { __typename?: 'Mutation', approveAutomation: { __typename?: 'AutomationType', id: string, status: AutomationStatus, approvedAt: string | null, approvedBy: { __typename?: 'AutomationUserType', id: string, name: string } | null } };

export type RejectAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
}>;


export type RejectAutomationMutation = { __typename?: 'Mutation', rejectAutomation: { __typename?: 'AutomationType', id: string, status: AutomationStatus, compilationError: string | null } };

export type EnableAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type EnableAutomationMutation = { __typename?: 'Mutation', enableAutomation: { __typename?: 'AutomationType', id: string, isEnabled: boolean } };

export type DisableAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DisableAutomationMutation = { __typename?: 'Mutation', disableAutomation: { __typename?: 'AutomationType', id: string, isEnabled: boolean } };

export type ArchiveAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ArchiveAutomationMutation = { __typename?: 'Mutation', archiveAutomation: { __typename?: 'AutomationType', id: string, status: AutomationStatus, isEnabled: boolean } };

export type CompileAutomationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CompileAutomationMutation = { __typename?: 'Mutation', compileAutomation: { __typename?: 'AutomationType', id: string, isCompiled: boolean, compiledCode: string | null, compilationError: string | null } };

export type LinkScriptToAutomationMutationVariables = Exact<{
  input: LinkScriptToAutomationInput;
}>;


export type LinkScriptToAutomationMutation = { __typename?: 'Mutation', linkScriptToAutomation: { __typename?: 'AutomationScriptType', id: string, os: Os, executionOrder: number, script: { __typename?: 'AutomationScriptRefType', id: string, name: string } | null, systemScript: { __typename?: 'SystemScriptType', id: string, displayName: string } | null } };

export type UnlinkScriptFromAutomationMutationVariables = Exact<{
  automationId: Scalars['ID']['input'];
  scriptId: InputMaybe<Scalars['ID']['input']>;
  systemScriptId: InputMaybe<Scalars['ID']['input']>;
  os: Os;
}>;


export type UnlinkScriptFromAutomationMutation = { __typename?: 'Mutation', unlinkScriptFromAutomation: boolean };

export type UpdateAutomationScriptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  executionOrder: InputMaybe<Scalars['Int']['input']>;
  executeOnTrigger: InputMaybe<Scalars['Boolean']['input']>;
  isEnabled: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateAutomationScriptMutation = { __typename?: 'Mutation', updateAutomationScript: { __typename?: 'AutomationScriptType', id: string, executionOrder: number, executeOnTrigger: boolean, isEnabled: boolean } };

export type TestAutomationMutationVariables = Exact<{
  automationId: Scalars['ID']['input'];
  machineId: Scalars['ID']['input'];
}>;


export type TestAutomationMutation = { __typename?: 'Mutation', testAutomation: { __typename?: 'AutomationExecutionType', id: string, evaluationResult: boolean, status: AutomationExecutionStatus, evaluationTimeMs: number | null, error: string | null, triggeredAt: string } };

export type TestAutomationWithContextMutationVariables = Exact<{
  automationId: Scalars['ID']['input'];
  context: Scalars['JSONObject']['input'];
}>;


export type TestAutomationWithContextMutation = { __typename?: 'Mutation', testAutomationWithContext: { __typename?: 'TestResultType', success: boolean, result: boolean | null, generatedCode: string, evaluationTimeMs: number, error: string | null, logs: Array<string> } };

export type CreateCustomBlockMutationVariables = Exact<{
  input: CreateCustomBlockInput;
}>;


export type CreateCustomBlockMutation = { __typename?: 'Mutation', createCustomBlock: { __typename?: 'CustomBlockType', id: string, name: string, displayName: string, category: string } };

export type UpdateCustomBlockMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateCustomBlockInput;
}>;


export type UpdateCustomBlockMutation = { __typename?: 'Mutation', updateCustomBlock: { __typename?: 'CustomBlockType', id: string, displayName: string, isEnabled: boolean } };

export type DeleteCustomBlockMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCustomBlockMutation = { __typename?: 'Mutation', deleteCustomBlock: boolean };

export type TestCustomBlockMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  sampleInputs: Scalars['JSONObject']['input'];
  sampleContext: InputMaybe<Scalars['JSONObject']['input']>;
}>;


export type TestCustomBlockMutation = { __typename?: 'Mutation', testCustomBlock: { [key: string]: any } };

export type ExecuteRecommendationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ExecuteRecommendationMutation = { __typename?: 'Mutation', executeRecommendation: { __typename?: 'AutomationRecommendationType', id: string, status: AutomationRecommendationStatus, scriptExecution: { __typename?: 'AutomationScriptExecutionType', id: string, status: string } | null } };

export type DismissRecommendationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  reason: InputMaybe<Scalars['String']['input']>;
}>;


export type DismissRecommendationMutation = { __typename?: 'Mutation', dismissRecommendation: { __typename?: 'AutomationRecommendationType', id: string, status: AutomationRecommendationStatus, dismissReason: string | null } };

export type SnoozeRecommendationMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  duration: SnoozeDuration;
}>;


export type SnoozeRecommendationMutation = { __typename?: 'Mutation', snoozeRecommendation: { __typename?: 'AutomationRecommendationType', id: string, status: AutomationRecommendationStatus, snoozeUntil: string | null } };

export type DismissAllRecommendationsMutationVariables = Exact<{ [key: string]: never; }>;


export type DismissAllRecommendationsMutation = { __typename?: 'Mutation', dismissAllRecommendations: number };

export type SnoozeAllRecommendationsMutationVariables = Exact<{
  duration: SnoozeDuration;
}>;


export type SnoozeAllRecommendationsMutation = { __typename?: 'Mutation', snoozeAllRecommendations: number };

export type CreateSystemScriptMutationVariables = Exact<{
  input: CreateSystemScriptInput;
}>;


export type CreateSystemScriptMutation = { __typename?: 'Mutation', createSystemScript: { __typename?: 'SystemScriptType', id: string, name: string, displayName: string } };

export type UpdateSystemScriptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: UpdateSystemScriptInput;
}>;


export type UpdateSystemScriptMutation = { __typename?: 'Mutation', updateSystemScript: { __typename?: 'SystemScriptType', id: string, displayName: string, isEnabled: boolean } };

export type DeleteSystemScriptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSystemScriptMutation = { __typename?: 'Mutation', deleteSystemScript: boolean };

export type BlocklyToolboxQueryVariables = Exact<{ [key: string]: never; }>;


export type BlocklyToolboxQuery = { __typename?: 'Query', blocklyToolbox: { __typename?: 'BlocklyToolboxType', categories: Array<{ __typename?: 'ToolboxCategoryType', name: string, colour: string, blocks: Array<{ __typename?: 'BlockDefinitionOutputType', type: string, message0: string, args0: { [key: string]: any } | null, output: string | null, previousStatement: boolean | null, nextStatement: boolean | null, colour: number, tooltip: string | null, helpUrl: string | null }> }> } };

export type SystemScriptsQueryVariables = Exact<{
  category: InputMaybe<Scalars['String']['input']>;
}>;


export type SystemScriptsQuery = { __typename?: 'Query', systemScripts: Array<{ __typename?: 'SystemScriptType', id: string, name: string, displayName: string, description: string | null, category: string, requiredHealthFields: Array<string>, isEnabled: boolean }> };

export type GetAutomationTemplatesQueryVariables = Exact<{
  category: InputMaybe<Scalars['String']['input']>;
}>;


export type GetAutomationTemplatesQuery = { __typename?: 'Query', automationTemplates: Array<{ __typename?: 'AutomationTemplateType', id: string, name: string, description: string | null, category: string, recommendationType: string | null, blocklyWorkspace: { [key: string]: any }, isEnabled: boolean, usageCount: number, createdAt: string }> };

export type GetAutomationTemplateQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetAutomationTemplateQuery = { __typename?: 'Query', automationTemplate: { __typename?: 'AutomationTemplateType', id: string, name: string, description: string | null, category: string, recommendationType: string | null, blocklyWorkspace: { [key: string]: any }, isEnabled: boolean, usageCount: number, createdAt: string, updatedAt: string } | null };

export type GetAutomationTemplateCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAutomationTemplateCategoriesQuery = { __typename?: 'Query', automationTemplateCategories: Array<string> };

export type CreateAutomationFromTemplateMutationVariables = Exact<{
  templateId: Scalars['ID']['input'];
  name: InputMaybe<Scalars['String']['input']>;
}>;


export type CreateAutomationFromTemplateMutation = { __typename?: 'Mutation', createAutomationFromTemplate: { __typename?: 'AutomationType', id: string, name: string, description: string | null, blocklyWorkspace: { [key: string]: any }, status: AutomationStatus, createdAt: string } };

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
  firewallConfig: InputMaybe<CreateDepartmentFirewallInput>;
}>;


export type CreateDepartmentMutation = { __typename?: 'Mutation', createDepartment: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null, firewallPolicy: FirewallPolicy, firewallDefaultConfig: string | null, firewallCustomRules: any | null } };

export type DestroyDepartmentMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DestroyDepartmentMutation = { __typename?: 'Mutation', destroyDepartment: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } };

export type UpdateDepartmentNameMutationVariables = Exact<{
  input: UpdateDepartmentNameInput;
}>;


export type UpdateDepartmentNameMutation = { __typename?: 'Mutation', updateDepartmentName: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } };

export type UpdateDepartmentFirewallPolicyMutationVariables = Exact<{
  departmentId: Scalars['String']['input'];
  input: UpdateDepartmentFirewallPolicyInput;
}>;


export type UpdateDepartmentFirewallPolicyMutation = { __typename?: 'Mutation', updateDepartmentFirewallPolicy: { __typename?: 'DepartmentType', id: string, name: string, firewallPolicy: FirewallPolicy, firewallDefaultConfig: string | null, firewallCustomRules: any | null, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, totalMachines: number | null } };

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

export type CreateScriptMutationVariables = Exact<{
  input: CreateScriptInput;
}>;


export type CreateScriptMutation = { __typename?: 'Mutation', createScript: { __typename?: 'ScriptResponseType', success: boolean, message: string | null, error: string | null, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null, fileName: string, category: string | null, tags: Array<string>, os: Array<Os>, shell: ShellType, hasInputs: boolean, inputCount: number, createdAt: string, updatedAt: string, createdBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null } | null } };

export type UpdateScriptMutationVariables = Exact<{
  input: UpdateScriptInput;
}>;


export type UpdateScriptMutation = { __typename?: 'Mutation', updateScript: { __typename?: 'ScriptResponseType', success: boolean, message: string | null, error: string | null, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null, fileName: string, category: string | null, tags: Array<string>, os: Array<Os>, shell: ShellType, hasInputs: boolean, inputCount: number, content: string | null, createdAt: string, updatedAt: string, parsedInputs: Array<{ __typename?: 'ScriptInputType', name: string, type: string, label: string, description: string | null, required: boolean, default: any | null, options: Array<{ __typename?: 'InputOptionType', label: string, value: string }> | null }> } | null } };

export type DeleteScriptMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  force: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type DeleteScriptMutation = { __typename?: 'Mutation', deleteScript: { __typename?: 'ScriptResponseType', success: boolean, message: string | null, error: string | null } };

export type AssignScriptToDepartmentMutationVariables = Exact<{
  scriptId: Scalars['ID']['input'];
  departmentId: Scalars['ID']['input'];
}>;


export type AssignScriptToDepartmentMutation = { __typename?: 'Mutation', assignScriptToDepartment: boolean };

export type UnassignScriptFromDepartmentMutationVariables = Exact<{
  scriptId: Scalars['ID']['input'];
  departmentId: Scalars['ID']['input'];
}>;


export type UnassignScriptFromDepartmentMutation = { __typename?: 'Mutation', unassignScriptFromDepartment: boolean };

export type ExecuteScriptMutationVariables = Exact<{
  input: ExecuteScriptInput;
}>;


export type ExecuteScriptMutation = { __typename?: 'Mutation', executeScript: { __typename?: 'ScriptExecutionResponseType', success: boolean, message: string | null, error: string | null, execution: { __typename?: 'ScriptExecutionType', id: string, executionType: ExecutionType, status: ExecutionStatus, inputValues: any, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string }, machine: { __typename?: 'MachineType', id: string, name: string } } | null } };

export type CancelScriptExecutionMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type CancelScriptExecutionMutation = { __typename?: 'Mutation', cancelScriptExecution: { __typename?: 'ScriptExecutionResponseType', success: boolean, message: string | null, error: string | null, execution: { __typename?: 'ScriptExecutionType', id: string, status: ExecutionStatus, completedAt: string | null, error: string | null } | null } };

export type ScheduleScriptMutationVariables = Exact<{
  input: ScheduleScriptInput;
}>;


export type ScheduleScriptMutation = { __typename?: 'Mutation', scheduleScript: { __typename?: 'ScheduleScriptResponseType', success: boolean, message: string | null, error: string | null, executionIds: Array<string> | null, executions: Array<{ __typename?: 'ScheduledScriptType', id: string, status: ExecutionStatus, executionType: ExecutionType, scheduledFor: string | null, repeatIntervalMinutes: number | null, maxExecutions: number | null, executionCount: number, scheduleType: ScheduleType, nextExecutionAt: string | null, isActive: boolean, inputValues: any, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string }, machine: { __typename?: 'MachineType', id: string, name: string, status: string }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null }> | null } };

export type UpdateScheduledScriptMutationVariables = Exact<{
  input: UpdateScheduledScriptInput;
}>;


export type UpdateScheduledScriptMutation = { __typename?: 'Mutation', updateScheduledScript: { __typename?: 'ScheduleScriptResponseType', success: boolean, message: string | null, error: string | null, executionIds: Array<string> | null, executions: Array<{ __typename?: 'ScheduledScriptType', id: string, status: ExecutionStatus, executionType: ExecutionType, scheduledFor: string | null, repeatIntervalMinutes: number | null, maxExecutions: number | null, executionCount: number, scheduleType: ScheduleType, nextExecutionAt: string | null, isActive: boolean, inputValues: any, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string }, machine: { __typename?: 'MachineType', id: string, name: string, status: string }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null }> | null } };

export type CancelScheduledScriptMutationVariables = Exact<{
  executionId: Scalars['ID']['input'];
}>;


export type CancelScheduledScriptMutation = { __typename?: 'Mutation', cancelScheduledScript: { __typename?: 'ScheduleScriptResponseType', success: boolean, message: string | null, error: string | null } };

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


export type DepartmentsQuery = { __typename?: 'Query', departments: Array<{ __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, firewallPolicy: FirewallPolicy, firewallDefaultConfig: string | null, totalMachines: number | null }> };

export type DepartmentQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DepartmentQuery = { __typename?: 'Query', department: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, firewallPolicy: FirewallPolicy, firewallDefaultConfig: string | null, totalMachines: number | null } | null };

export type FindDepartmentByNameQueryVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type FindDepartmentByNameQuery = { __typename?: 'Query', findDepartmentByName: { __typename?: 'DepartmentType', id: string, name: string, createdAt: string, internetSpeed: number | null, ipSubnet: string | null, firewallPolicy: FirewallPolicy, firewallDefaultConfig: string | null, totalMachines: number | null } | null };

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

export type ScriptsQueryVariables = Exact<{
  filters: InputMaybe<ScriptFiltersInput>;
}>;


export type ScriptsQuery = { __typename?: 'Query', scripts: Array<{ __typename?: 'ScriptType', id: string, name: string, description: string | null, fileName: string, category: string | null, tags: Array<string>, os: Array<Os>, shell: ShellType, hasInputs: boolean, inputCount: number, createdAt: string, updatedAt: string, createdBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string, email: string } | null }> };

export type ScriptQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ScriptQuery = { __typename?: 'Query', script: { __typename?: 'ScriptType', id: string, name: string, description: string | null, fileName: string, category: string | null, tags: Array<string>, os: Array<Os>, shell: ShellType, hasInputs: boolean, inputCount: number, content: string | null, createdAt: string, updatedAt: string, parsedInputs: Array<{ __typename?: 'ScriptInputType', name: string, type: string, label: string, description: string | null, default: any | null, required: boolean, validation: any | null, options: Array<{ __typename?: 'InputOptionType', label: string, value: string }> | null }>, createdBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string, email: string } | null } | null };

export type DepartmentScriptsQueryVariables = Exact<{
  departmentId: Scalars['ID']['input'];
}>;


export type DepartmentScriptsQuery = { __typename?: 'Query', departmentScripts: Array<{ __typename?: 'ScriptType', id: string, name: string, description: string | null, fileName: string, category: string | null, tags: Array<string>, os: Array<Os>, shell: ShellType, hasInputs: boolean, inputCount: number, createdAt: string, updatedAt: string, parsedInputs: Array<{ __typename?: 'ScriptInputType', name: string, label: string, type: string, required: boolean, description: string | null, default: any | null, validation: any | null, options: Array<{ __typename?: 'InputOptionType', label: string, value: string }> | null }>, createdBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string, email: string } | null }> };

export type ScriptExecutionsQueryVariables = Exact<{
  machineId: Scalars['ID']['input'];
  status: InputMaybe<ExecutionStatus>;
  limit: InputMaybe<Scalars['Int']['input']>;
}>;


export type ScriptExecutionsQuery = { __typename?: 'Query', scriptExecutions: Array<{ __typename?: 'ScriptExecutionType', id: string, executionType: ExecutionType, inputValues: any, status: ExecutionStatus, startedAt: string | null, completedAt: string | null, exitCode: number | null, stdout: string | null, stderr: string | null, error: string | null, executedAs: string | null, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null }, machine: { __typename?: 'MachineType', id: string, name: string }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null }> };

export type ScriptExecutionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ScriptExecutionQuery = { __typename?: 'Query', scriptExecution: { __typename?: 'ScriptExecutionType', id: string, executionType: ExecutionType, inputValues: any, status: ExecutionStatus, startedAt: string | null, completedAt: string | null, exitCode: number | null, stdout: string | null, stderr: string | null, error: string | null, executedAs: string | null, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null }, machine: { __typename?: 'MachineType', id: string, name: string }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null } | null };

export type ScriptExecutionsFilteredQueryVariables = Exact<{
  filters: ScriptExecutionsFiltersInput;
}>;


export type ScriptExecutionsFilteredQuery = { __typename?: 'Query', scriptExecutionsFiltered: { __typename?: 'ScriptExecutionsResponseType', total: number, hasMore: boolean, offset: number, limit: number, executions: Array<{ __typename?: 'ScriptExecutionType', id: string, executionType: ExecutionType, inputValues: any, status: ExecutionStatus, startedAt: string | null, completedAt: string | null, exitCode: number | null, stdout: string | null, stderr: string | null, error: string | null, executedAs: string | null, createdAt: string, scheduledFor: string | null, repeatIntervalMinutes: number | null, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null }, machine: { __typename?: 'MachineType', id: string, name: string, status: string, department: { __typename?: 'DepartmentType', id: string, name: string } | null }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null }> } };

export type VmUsersQueryVariables = Exact<{
  machineId: Scalars['ID']['input'];
}>;


export type VmUsersQuery = { __typename?: 'Query', vmUsers: Array<string> };

export type ScheduledScriptsQueryVariables = Exact<{
  filters: InputMaybe<ScheduledScriptsFiltersInput>;
}>;


export type ScheduledScriptsQuery = { __typename?: 'Query', scheduledScripts: Array<{ __typename?: 'ScheduledScriptType', id: string, status: ExecutionStatus, executionType: ExecutionType, scheduledFor: string | null, repeatIntervalMinutes: number | null, maxExecutions: number | null, executionCount: number, lastExecutedAt: string | null, scheduleType: ScheduleType, nextExecutionAt: string | null, isActive: boolean, inputValues: any, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null }, machine: { __typename?: 'MachineType', id: string, name: string, status: string }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null }> };

export type ScheduledScriptQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ScheduledScriptQuery = { __typename?: 'Query', scheduledScript: { __typename?: 'ScheduledScriptType', id: string, status: ExecutionStatus, executionType: ExecutionType, scheduledFor: string | null, repeatIntervalMinutes: number | null, maxExecutions: number | null, executionCount: number, lastExecutedAt: string | null, scheduleType: ScheduleType, nextExecutionAt: string | null, isActive: boolean, inputValues: any, createdAt: string, script: { __typename?: 'ScriptType', id: string, name: string, description: string | null }, machine: { __typename?: 'MachineType', id: string, name: string, status: string }, triggeredBy: { __typename?: 'UserType', id: string, firstName: string, lastName: string } | null } | null };

export type DepartmentNetworkDiagnosticsQueryVariables = Exact<{
  departmentId: Scalars['String']['input'];
}>;


export type DepartmentNetworkDiagnosticsQuery = { __typename?: 'Query', departmentNetworkDiagnostics: { __typename?: 'DepartmentNetworkDiagnosticsType', departmentId: string, departmentName: string, timestamp: any, recommendations: Array<string>, manualCommands: Array<string>, bridge: { __typename?: 'BridgeDiagnosticsType', exists: boolean, isUp: boolean, ipAddresses: Array<string>, attachedInterfaces: Array<string>, mtu: number | null, state: string | null }, dnsmasq: { __typename?: 'DnsmasqDiagnosticsType', isRunning: boolean, pid: number | null, pidMatches: boolean, configPath: string, configExists: boolean, leasePath: string, leaseFileExists: boolean, logPath: string, logExists: boolean, listeningPort: boolean, recentLogLines: Array<string> | null }, brNetfilter: { __typename?: 'BrNetfilterDiagnosticsType', moduleLoaded: boolean, callIptables: number, callIp6tables: number, callArptables: number, persistenceFileExists: boolean }, nat: { __typename?: 'NatDiagnosticsType', ruleExists: boolean, tableExists: boolean, chainExists: boolean, ipForwardingEnabled: boolean, ruleDetails: string | null } } };

export type CaptureDepartmentDhcpTrafficQueryVariables = Exact<{
  departmentId: Scalars['String']['input'];
  durationSeconds: Scalars['Int']['input'];
}>;


export type CaptureDepartmentDhcpTrafficQuery = { __typename?: 'Query', captureDepartmentDhcpTraffic: { __typename?: 'DhcpTrafficCaptureType', bridgeName: string, duration: number, packets: Array<string>, summary: { __typename?: 'DhcpPacketSummaryType', totalPackets: number, discoverPackets: number, offerPackets: number, requestPackets: number, ackPackets: number } } };

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


export const GetAutomationDocument = gql`
    query GetAutomation($id: ID!) {
  automation(id: $id) {
    id
    name
    description
    blocklyWorkspace
    generatedCode
    isCompiled
    compiledCode
    compilationError
    targetScope
    department {
      id
      name
    }
    targets {
      id
      machine {
        id
        name
      }
    }
    status
    isEnabled
    priority
    cooldownMinutes
    recommendationType
    recommendationText
    recommendationActionText
    automationScripts {
      id
      script {
        id
        name
        os
      }
      systemScript {
        id
        displayName
      }
      os
      executionOrder
      isEnabled
      executeOnTrigger
    }
    executionCount
    lastTriggeredAt
    triggerRate
    createdBy {
      id
      name
    }
    approvedBy {
      id
      name
    }
    approvedAt
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAutomationQuery__
 *
 * To run a query within a React component, call `useGetAutomationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAutomationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAutomationQuery, GetAutomationQueryVariables> & ({ variables: GetAutomationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationQuery, GetAutomationQueryVariables>(GetAutomationDocument, options);
      }
export function useGetAutomationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationQuery, GetAutomationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationQuery, GetAutomationQueryVariables>(GetAutomationDocument, options);
        }
export function useGetAutomationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationQuery, GetAutomationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationQuery, GetAutomationQueryVariables>(GetAutomationDocument, options);
        }
export type GetAutomationQueryHookResult = ReturnType<typeof useGetAutomationQuery>;
export type GetAutomationLazyQueryHookResult = ReturnType<typeof useGetAutomationLazyQuery>;
export type GetAutomationSuspenseQueryHookResult = ReturnType<typeof useGetAutomationSuspenseQuery>;
export type GetAutomationQueryResult = ApolloReactCommon.QueryResult<GetAutomationQuery, GetAutomationQueryVariables>;
export function refetchGetAutomationQuery(variables: GetAutomationQueryVariables) {
      return { query: GetAutomationDocument, variables: variables }
    }
export const GetAutomationsDocument = gql`
    query GetAutomations($filters: AutomationFiltersInput) {
  automations(filters: $filters) {
    id
    name
    description
    status
    isEnabled
    targetScope
    department {
      id
      name
    }
    executionCount
    lastTriggeredAt
    triggerRate
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAutomationsQuery__
 *
 * To run a query within a React component, call `useGetAutomationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetAutomationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAutomationsQuery, GetAutomationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationsQuery, GetAutomationsQueryVariables>(GetAutomationsDocument, options);
      }
export function useGetAutomationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationsQuery, GetAutomationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationsQuery, GetAutomationsQueryVariables>(GetAutomationsDocument, options);
        }
export function useGetAutomationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationsQuery, GetAutomationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationsQuery, GetAutomationsQueryVariables>(GetAutomationsDocument, options);
        }
export type GetAutomationsQueryHookResult = ReturnType<typeof useGetAutomationsQuery>;
export type GetAutomationsLazyQueryHookResult = ReturnType<typeof useGetAutomationsLazyQuery>;
export type GetAutomationsSuspenseQueryHookResult = ReturnType<typeof useGetAutomationsSuspenseQuery>;
export type GetAutomationsQueryResult = ApolloReactCommon.QueryResult<GetAutomationsQuery, GetAutomationsQueryVariables>;
export function refetchGetAutomationsQuery(variables?: GetAutomationsQueryVariables) {
      return { query: GetAutomationsDocument, variables: variables }
    }
export const GetAutomationExecutionsDocument = gql`
    query GetAutomationExecutions($filters: AutomationExecutionFiltersInput, $limit: Int, $offset: Int) {
  automationExecutions(filters: $filters, limit: $limit, offset: $offset) {
    id
    automationId
    machine {
      id
      name
    }
    triggerReason
    evaluationResult
    status
    evaluationTimeMs
    error
    triggeredAt
    completedAt
  }
}
    `;

/**
 * __useGetAutomationExecutionsQuery__
 *
 * To run a query within a React component, call `useGetAutomationExecutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationExecutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationExecutionsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useGetAutomationExecutionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>(GetAutomationExecutionsDocument, options);
      }
export function useGetAutomationExecutionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>(GetAutomationExecutionsDocument, options);
        }
export function useGetAutomationExecutionsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>(GetAutomationExecutionsDocument, options);
        }
export type GetAutomationExecutionsQueryHookResult = ReturnType<typeof useGetAutomationExecutionsQuery>;
export type GetAutomationExecutionsLazyQueryHookResult = ReturnType<typeof useGetAutomationExecutionsLazyQuery>;
export type GetAutomationExecutionsSuspenseQueryHookResult = ReturnType<typeof useGetAutomationExecutionsSuspenseQuery>;
export type GetAutomationExecutionsQueryResult = ApolloReactCommon.QueryResult<GetAutomationExecutionsQuery, GetAutomationExecutionsQueryVariables>;
export function refetchGetAutomationExecutionsQuery(variables?: GetAutomationExecutionsQueryVariables) {
      return { query: GetAutomationExecutionsDocument, variables: variables }
    }
export const GetAutomationExecutionDocument = gql`
    query GetAutomationExecution($id: ID!) {
  automationExecution(id: $id) {
    id
    automationId
    machine {
      id
      name
    }
    snapshot {
      id
      snapshotDate
    }
    triggerReason
    evaluationResult
    status
    contextSnapshot
    evaluationTimeMs
    scriptExecution {
      id
      status
    }
    error
    triggeredAt
    evaluatedAt
    completedAt
  }
}
    `;

/**
 * __useGetAutomationExecutionQuery__
 *
 * To run a query within a React component, call `useGetAutomationExecutionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationExecutionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationExecutionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAutomationExecutionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables> & ({ variables: GetAutomationExecutionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables>(GetAutomationExecutionDocument, options);
      }
export function useGetAutomationExecutionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables>(GetAutomationExecutionDocument, options);
        }
export function useGetAutomationExecutionSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables>(GetAutomationExecutionDocument, options);
        }
export type GetAutomationExecutionQueryHookResult = ReturnType<typeof useGetAutomationExecutionQuery>;
export type GetAutomationExecutionLazyQueryHookResult = ReturnType<typeof useGetAutomationExecutionLazyQuery>;
export type GetAutomationExecutionSuspenseQueryHookResult = ReturnType<typeof useGetAutomationExecutionSuspenseQuery>;
export type GetAutomationExecutionQueryResult = ApolloReactCommon.QueryResult<GetAutomationExecutionQuery, GetAutomationExecutionQueryVariables>;
export function refetchGetAutomationExecutionQuery(variables: GetAutomationExecutionQueryVariables) {
      return { query: GetAutomationExecutionDocument, variables: variables }
    }
export const GetCustomBlockDocument = gql`
    query GetCustomBlock($id: ID!) {
  customBlock(id: $id) {
    id
    name
    displayName
    description
    category
    blockDefinition
    generatorCode
    inputs {
      name
      type
      label
      required
      defaultValue
    }
    outputType
    supportedOS
    isBuiltIn
    isEnabled
    createdBy {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetCustomBlockQuery__
 *
 * To run a query within a React component, call `useGetCustomBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomBlockQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCustomBlockQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetCustomBlockQuery, GetCustomBlockQueryVariables> & ({ variables: GetCustomBlockQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCustomBlockQuery, GetCustomBlockQueryVariables>(GetCustomBlockDocument, options);
      }
export function useGetCustomBlockLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCustomBlockQuery, GetCustomBlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCustomBlockQuery, GetCustomBlockQueryVariables>(GetCustomBlockDocument, options);
        }
export function useGetCustomBlockSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCustomBlockQuery, GetCustomBlockQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCustomBlockQuery, GetCustomBlockQueryVariables>(GetCustomBlockDocument, options);
        }
export type GetCustomBlockQueryHookResult = ReturnType<typeof useGetCustomBlockQuery>;
export type GetCustomBlockLazyQueryHookResult = ReturnType<typeof useGetCustomBlockLazyQuery>;
export type GetCustomBlockSuspenseQueryHookResult = ReturnType<typeof useGetCustomBlockSuspenseQuery>;
export type GetCustomBlockQueryResult = ApolloReactCommon.QueryResult<GetCustomBlockQuery, GetCustomBlockQueryVariables>;
export function refetchGetCustomBlockQuery(variables: GetCustomBlockQueryVariables) {
      return { query: GetCustomBlockDocument, variables: variables }
    }
export const GetCustomBlocksDocument = gql`
    query GetCustomBlocks($category: String, $includeBuiltIn: Boolean) {
  customBlocks(category: $category, includeBuiltIn: $includeBuiltIn) {
    id
    name
    displayName
    description
    category
    blockDefinition
    inputs {
      name
      type
      label
      required
      defaultValue
    }
    outputType
    supportedOS
    isBuiltIn
    isEnabled
  }
}
    `;

/**
 * __useGetCustomBlocksQuery__
 *
 * To run a query within a React component, call `useGetCustomBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCustomBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCustomBlocksQuery({
 *   variables: {
 *      category: // value for 'category'
 *      includeBuiltIn: // value for 'includeBuiltIn'
 *   },
 * });
 */
export function useGetCustomBlocksQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>(GetCustomBlocksDocument, options);
      }
export function useGetCustomBlocksLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>(GetCustomBlocksDocument, options);
        }
export function useGetCustomBlocksSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>(GetCustomBlocksDocument, options);
        }
export type GetCustomBlocksQueryHookResult = ReturnType<typeof useGetCustomBlocksQuery>;
export type GetCustomBlocksLazyQueryHookResult = ReturnType<typeof useGetCustomBlocksLazyQuery>;
export type GetCustomBlocksSuspenseQueryHookResult = ReturnType<typeof useGetCustomBlocksSuspenseQuery>;
export type GetCustomBlocksQueryResult = ApolloReactCommon.QueryResult<GetCustomBlocksQuery, GetCustomBlocksQueryVariables>;
export function refetchGetCustomBlocksQuery(variables?: GetCustomBlocksQueryVariables) {
      return { query: GetCustomBlocksDocument, variables: variables }
    }
export const GetBlocklyToolboxDocument = gql`
    query GetBlocklyToolbox {
  blocklyToolbox {
    categories {
      name
      colour
      blocks {
        type
        message0
        args0
        output
        previousStatement
        nextStatement
        colour
        tooltip
        helpUrl
      }
    }
  }
}
    `;

/**
 * __useGetBlocklyToolboxQuery__
 *
 * To run a query within a React component, call `useGetBlocklyToolboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBlocklyToolboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBlocklyToolboxQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBlocklyToolboxQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>(GetBlocklyToolboxDocument, options);
      }
export function useGetBlocklyToolboxLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>(GetBlocklyToolboxDocument, options);
        }
export function useGetBlocklyToolboxSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>(GetBlocklyToolboxDocument, options);
        }
export type GetBlocklyToolboxQueryHookResult = ReturnType<typeof useGetBlocklyToolboxQuery>;
export type GetBlocklyToolboxLazyQueryHookResult = ReturnType<typeof useGetBlocklyToolboxLazyQuery>;
export type GetBlocklyToolboxSuspenseQueryHookResult = ReturnType<typeof useGetBlocklyToolboxSuspenseQuery>;
export type GetBlocklyToolboxQueryResult = ApolloReactCommon.QueryResult<GetBlocklyToolboxQuery, GetBlocklyToolboxQueryVariables>;
export function refetchGetBlocklyToolboxQuery(variables?: GetBlocklyToolboxQueryVariables) {
      return { query: GetBlocklyToolboxDocument, variables: variables }
    }
export const PreviewGeneratedCodeDocument = gql`
    query PreviewGeneratedCode($blocklyWorkspace: JSONObject!) {
  previewGeneratedCode(blocklyWorkspace: $blocklyWorkspace)
}
    `;

/**
 * __usePreviewGeneratedCodeQuery__
 *
 * To run a query within a React component, call `usePreviewGeneratedCodeQuery` and pass it any options that fit your needs.
 * When your component renders, `usePreviewGeneratedCodeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePreviewGeneratedCodeQuery({
 *   variables: {
 *      blocklyWorkspace: // value for 'blocklyWorkspace'
 *   },
 * });
 */
export function usePreviewGeneratedCodeQuery(baseOptions: ApolloReactHooks.QueryHookOptions<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables> & ({ variables: PreviewGeneratedCodeQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables>(PreviewGeneratedCodeDocument, options);
      }
export function usePreviewGeneratedCodeLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables>(PreviewGeneratedCodeDocument, options);
        }
export function usePreviewGeneratedCodeSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables>(PreviewGeneratedCodeDocument, options);
        }
export type PreviewGeneratedCodeQueryHookResult = ReturnType<typeof usePreviewGeneratedCodeQuery>;
export type PreviewGeneratedCodeLazyQueryHookResult = ReturnType<typeof usePreviewGeneratedCodeLazyQuery>;
export type PreviewGeneratedCodeSuspenseQueryHookResult = ReturnType<typeof usePreviewGeneratedCodeSuspenseQuery>;
export type PreviewGeneratedCodeQueryResult = ApolloReactCommon.QueryResult<PreviewGeneratedCodeQuery, PreviewGeneratedCodeQueryVariables>;
export function refetchPreviewGeneratedCodeQuery(variables: PreviewGeneratedCodeQueryVariables) {
      return { query: PreviewGeneratedCodeDocument, variables: variables }
    }
export const ValidateWorkspaceDocument = gql`
    query ValidateWorkspace($blocklyWorkspace: JSONObject!) {
  validateWorkspace(blocklyWorkspace: $blocklyWorkspace) {
    isValid
    errors {
      blockId
      message
    }
    warnings {
      blockId
      message
    }
  }
}
    `;

/**
 * __useValidateWorkspaceQuery__
 *
 * To run a query within a React component, call `useValidateWorkspaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useValidateWorkspaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useValidateWorkspaceQuery({
 *   variables: {
 *      blocklyWorkspace: // value for 'blocklyWorkspace'
 *   },
 * });
 */
export function useValidateWorkspaceQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables> & ({ variables: ValidateWorkspaceQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables>(ValidateWorkspaceDocument, options);
      }
export function useValidateWorkspaceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables>(ValidateWorkspaceDocument, options);
        }
export function useValidateWorkspaceSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables>(ValidateWorkspaceDocument, options);
        }
export type ValidateWorkspaceQueryHookResult = ReturnType<typeof useValidateWorkspaceQuery>;
export type ValidateWorkspaceLazyQueryHookResult = ReturnType<typeof useValidateWorkspaceLazyQuery>;
export type ValidateWorkspaceSuspenseQueryHookResult = ReturnType<typeof useValidateWorkspaceSuspenseQuery>;
export type ValidateWorkspaceQueryResult = ApolloReactCommon.QueryResult<ValidateWorkspaceQuery, ValidateWorkspaceQueryVariables>;
export function refetchValidateWorkspaceQuery(variables: ValidateWorkspaceQueryVariables) {
      return { query: ValidateWorkspaceDocument, variables: variables }
    }
export const GetRecommendationDocument = gql`
    query GetRecommendation($id: ID!) {
  recommendation(id: $id) {
    id
    automationId
    machine {
      id
      name
    }
    execution {
      id
      status
    }
    title
    description
    severity
    status
    userAction
    actionTakenBy {
      id
      name
    }
    actionTakenAt
    snoozeUntil
    dismissReason
    script {
      id
      name
      os
    }
    systemScript {
      id
      displayName
    }
    scriptExecution {
      id
      status
    }
    autoResolvedAt
    autoResolveReason
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetRecommendationQuery__
 *
 * To run a query within a React component, call `useGetRecommendationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetRecommendationQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetRecommendationQuery, GetRecommendationQueryVariables> & ({ variables: GetRecommendationQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRecommendationQuery, GetRecommendationQueryVariables>(GetRecommendationDocument, options);
      }
export function useGetRecommendationLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecommendationQuery, GetRecommendationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRecommendationQuery, GetRecommendationQueryVariables>(GetRecommendationDocument, options);
        }
export function useGetRecommendationSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRecommendationQuery, GetRecommendationQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRecommendationQuery, GetRecommendationQueryVariables>(GetRecommendationDocument, options);
        }
export type GetRecommendationQueryHookResult = ReturnType<typeof useGetRecommendationQuery>;
export type GetRecommendationLazyQueryHookResult = ReturnType<typeof useGetRecommendationLazyQuery>;
export type GetRecommendationSuspenseQueryHookResult = ReturnType<typeof useGetRecommendationSuspenseQuery>;
export type GetRecommendationQueryResult = ApolloReactCommon.QueryResult<GetRecommendationQuery, GetRecommendationQueryVariables>;
export function refetchGetRecommendationQuery(variables: GetRecommendationQueryVariables) {
      return { query: GetRecommendationDocument, variables: variables }
    }
export const GetRecommendationsDocument = gql`
    query GetRecommendations($filters: RecommendationFiltersInput, $limit: Int) {
  recommendations(filters: $filters, limit: $limit) {
    id
    automationId
    machine {
      id
      name
    }
    title
    description
    severity
    status
    userAction
    actionTakenBy {
      id
      name
    }
    actionTakenAt
    snoozeUntil
    autoResolvedAt
    autoResolveReason
    createdAt
  }
}
    `;

/**
 * __useGetRecommendationsQuery__
 *
 * To run a query within a React component, call `useGetRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRecommendationsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetRecommendationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRecommendationsQuery, GetRecommendationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetRecommendationsQuery, GetRecommendationsQueryVariables>(GetRecommendationsDocument, options);
      }
export function useGetRecommendationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRecommendationsQuery, GetRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetRecommendationsQuery, GetRecommendationsQueryVariables>(GetRecommendationsDocument, options);
        }
export function useGetRecommendationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetRecommendationsQuery, GetRecommendationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetRecommendationsQuery, GetRecommendationsQueryVariables>(GetRecommendationsDocument, options);
        }
export type GetRecommendationsQueryHookResult = ReturnType<typeof useGetRecommendationsQuery>;
export type GetRecommendationsLazyQueryHookResult = ReturnType<typeof useGetRecommendationsLazyQuery>;
export type GetRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGetRecommendationsSuspenseQuery>;
export type GetRecommendationsQueryResult = ApolloReactCommon.QueryResult<GetRecommendationsQuery, GetRecommendationsQueryVariables>;
export function refetchGetRecommendationsQuery(variables?: GetRecommendationsQueryVariables) {
      return { query: GetRecommendationsDocument, variables: variables }
    }
export const GetPendingRecommendationsDocument = gql`
    query GetPendingRecommendations($machineId: ID!) {
  pendingRecommendations(machineId: $machineId) {
    id
    title
    description
    severity
    status
    machine {
      id
      name
    }
    script {
      id
      name
    }
    systemScript {
      id
      displayName
    }
    createdAt
  }
}
    `;

/**
 * __useGetPendingRecommendationsQuery__
 *
 * To run a query within a React component, call `useGetPendingRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingRecommendationsQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useGetPendingRecommendationsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables> & ({ variables: GetPendingRecommendationsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables>(GetPendingRecommendationsDocument, options);
      }
export function useGetPendingRecommendationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables>(GetPendingRecommendationsDocument, options);
        }
export function useGetPendingRecommendationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables>(GetPendingRecommendationsDocument, options);
        }
export type GetPendingRecommendationsQueryHookResult = ReturnType<typeof useGetPendingRecommendationsQuery>;
export type GetPendingRecommendationsLazyQueryHookResult = ReturnType<typeof useGetPendingRecommendationsLazyQuery>;
export type GetPendingRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGetPendingRecommendationsSuspenseQuery>;
export type GetPendingRecommendationsQueryResult = ApolloReactCommon.QueryResult<GetPendingRecommendationsQuery, GetPendingRecommendationsQueryVariables>;
export function refetchGetPendingRecommendationsQuery(variables: GetPendingRecommendationsQueryVariables) {
      return { query: GetPendingRecommendationsDocument, variables: variables }
    }
export const GlobalPendingRecommendationsDocument = gql`
    query GlobalPendingRecommendations {
  recommendations(filters: {status: PENDING}) {
    id
    title
    description
    severity
    status
    machine {
      id
      name
    }
    script {
      id
      name
    }
    systemScript {
      id
      displayName
    }
    createdAt
  }
}
    `;

/**
 * __useGlobalPendingRecommendationsQuery__
 *
 * To run a query within a React component, call `useGlobalPendingRecommendationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGlobalPendingRecommendationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGlobalPendingRecommendationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGlobalPendingRecommendationsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>(GlobalPendingRecommendationsDocument, options);
      }
export function useGlobalPendingRecommendationsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>(GlobalPendingRecommendationsDocument, options);
        }
export function useGlobalPendingRecommendationsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>(GlobalPendingRecommendationsDocument, options);
        }
export type GlobalPendingRecommendationsQueryHookResult = ReturnType<typeof useGlobalPendingRecommendationsQuery>;
export type GlobalPendingRecommendationsLazyQueryHookResult = ReturnType<typeof useGlobalPendingRecommendationsLazyQuery>;
export type GlobalPendingRecommendationsSuspenseQueryHookResult = ReturnType<typeof useGlobalPendingRecommendationsSuspenseQuery>;
export type GlobalPendingRecommendationsQueryResult = ApolloReactCommon.QueryResult<GlobalPendingRecommendationsQuery, GlobalPendingRecommendationsQueryVariables>;
export function refetchGlobalPendingRecommendationsQuery(variables?: GlobalPendingRecommendationsQueryVariables) {
      return { query: GlobalPendingRecommendationsDocument, variables: variables }
    }
export const GetPendingRecommendationCountDocument = gql`
    query GetPendingRecommendationCount($machineId: ID) {
  pendingRecommendationCount(machineId: $machineId)
}
    `;

/**
 * __useGetPendingRecommendationCountQuery__
 *
 * To run a query within a React component, call `useGetPendingRecommendationCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingRecommendationCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingRecommendationCountQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useGetPendingRecommendationCountQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>(GetPendingRecommendationCountDocument, options);
      }
export function useGetPendingRecommendationCountLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>(GetPendingRecommendationCountDocument, options);
        }
export function useGetPendingRecommendationCountSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>(GetPendingRecommendationCountDocument, options);
        }
export type GetPendingRecommendationCountQueryHookResult = ReturnType<typeof useGetPendingRecommendationCountQuery>;
export type GetPendingRecommendationCountLazyQueryHookResult = ReturnType<typeof useGetPendingRecommendationCountLazyQuery>;
export type GetPendingRecommendationCountSuspenseQueryHookResult = ReturnType<typeof useGetPendingRecommendationCountSuspenseQuery>;
export type GetPendingRecommendationCountQueryResult = ApolloReactCommon.QueryResult<GetPendingRecommendationCountQuery, GetPendingRecommendationCountQueryVariables>;
export function refetchGetPendingRecommendationCountQuery(variables?: GetPendingRecommendationCountQueryVariables) {
      return { query: GetPendingRecommendationCountDocument, variables: variables }
    }
export const GetSystemScriptDocument = gql`
    query GetSystemScript($id: ID!) {
  systemScript(id: $id) {
    id
    name
    displayName
    description
    codeWindows
    codeLinux
    category
    requiredHealthFields
    isEnabled
    createdBy {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetSystemScriptQuery__
 *
 * To run a query within a React component, call `useGetSystemScriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemScriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemScriptQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetSystemScriptQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetSystemScriptQuery, GetSystemScriptQueryVariables> & ({ variables: GetSystemScriptQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSystemScriptQuery, GetSystemScriptQueryVariables>(GetSystemScriptDocument, options);
      }
export function useGetSystemScriptLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSystemScriptQuery, GetSystemScriptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSystemScriptQuery, GetSystemScriptQueryVariables>(GetSystemScriptDocument, options);
        }
export function useGetSystemScriptSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetSystemScriptQuery, GetSystemScriptQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetSystemScriptQuery, GetSystemScriptQueryVariables>(GetSystemScriptDocument, options);
        }
export type GetSystemScriptQueryHookResult = ReturnType<typeof useGetSystemScriptQuery>;
export type GetSystemScriptLazyQueryHookResult = ReturnType<typeof useGetSystemScriptLazyQuery>;
export type GetSystemScriptSuspenseQueryHookResult = ReturnType<typeof useGetSystemScriptSuspenseQuery>;
export type GetSystemScriptQueryResult = ApolloReactCommon.QueryResult<GetSystemScriptQuery, GetSystemScriptQueryVariables>;
export function refetchGetSystemScriptQuery(variables: GetSystemScriptQueryVariables) {
      return { query: GetSystemScriptDocument, variables: variables }
    }
export const GetSystemScriptsDocument = gql`
    query GetSystemScripts($category: String) {
  systemScripts(category: $category) {
    id
    name
    displayName
    description
    category
    requiredHealthFields
    isEnabled
  }
}
    `;

/**
 * __useGetSystemScriptsQuery__
 *
 * To run a query within a React component, call `useGetSystemScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemScriptsQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useGetSystemScriptsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>(GetSystemScriptsDocument, options);
      }
export function useGetSystemScriptsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>(GetSystemScriptsDocument, options);
        }
export function useGetSystemScriptsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>(GetSystemScriptsDocument, options);
        }
export type GetSystemScriptsQueryHookResult = ReturnType<typeof useGetSystemScriptsQuery>;
export type GetSystemScriptsLazyQueryHookResult = ReturnType<typeof useGetSystemScriptsLazyQuery>;
export type GetSystemScriptsSuspenseQueryHookResult = ReturnType<typeof useGetSystemScriptsSuspenseQuery>;
export type GetSystemScriptsQueryResult = ApolloReactCommon.QueryResult<GetSystemScriptsQuery, GetSystemScriptsQueryVariables>;
export function refetchGetSystemScriptsQuery(variables?: GetSystemScriptsQueryVariables) {
      return { query: GetSystemScriptsDocument, variables: variables }
    }
export const GetSystemScriptCategoriesDocument = gql`
    query GetSystemScriptCategories {
  systemScriptCategories
}
    `;

/**
 * __useGetSystemScriptCategoriesQuery__
 *
 * To run a query within a React component, call `useGetSystemScriptCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSystemScriptCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSystemScriptCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSystemScriptCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>(GetSystemScriptCategoriesDocument, options);
      }
export function useGetSystemScriptCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>(GetSystemScriptCategoriesDocument, options);
        }
export function useGetSystemScriptCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>(GetSystemScriptCategoriesDocument, options);
        }
export type GetSystemScriptCategoriesQueryHookResult = ReturnType<typeof useGetSystemScriptCategoriesQuery>;
export type GetSystemScriptCategoriesLazyQueryHookResult = ReturnType<typeof useGetSystemScriptCategoriesLazyQuery>;
export type GetSystemScriptCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetSystemScriptCategoriesSuspenseQuery>;
export type GetSystemScriptCategoriesQueryResult = ApolloReactCommon.QueryResult<GetSystemScriptCategoriesQuery, GetSystemScriptCategoriesQueryVariables>;
export function refetchGetSystemScriptCategoriesQuery(variables?: GetSystemScriptCategoriesQueryVariables) {
      return { query: GetSystemScriptCategoriesDocument, variables: variables }
    }
export const CreateAutomationDocument = gql`
    mutation CreateAutomation($input: CreateAutomationInput!) {
  createAutomation(input: $input) {
    id
    name
    status
    createdAt
  }
}
    `;
export type CreateAutomationMutationFn = ApolloReactCommon.MutationFunction<CreateAutomationMutation, CreateAutomationMutationVariables>;

/**
 * __useCreateAutomationMutation__
 *
 * To run a mutation, you first call `useCreateAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAutomationMutation, { data, loading, error }] = useCreateAutomationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAutomationMutation, CreateAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateAutomationMutation, CreateAutomationMutationVariables>(CreateAutomationDocument, options);
      }
export type CreateAutomationMutationHookResult = ReturnType<typeof useCreateAutomationMutation>;
export type CreateAutomationMutationResult = ApolloReactCommon.MutationResult<CreateAutomationMutation>;
export type CreateAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateAutomationMutation, CreateAutomationMutationVariables>;
export const UpdateAutomationDocument = gql`
    mutation UpdateAutomation($id: ID!, $input: UpdateAutomationInput!) {
  updateAutomation(id: $id, input: $input) {
    id
    name
    blocklyWorkspace
    generatedCode
    isCompiled
    updatedAt
  }
}
    `;
export type UpdateAutomationMutationFn = ApolloReactCommon.MutationFunction<UpdateAutomationMutation, UpdateAutomationMutationVariables>;

/**
 * __useUpdateAutomationMutation__
 *
 * To run a mutation, you first call `useUpdateAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAutomationMutation, { data, loading, error }] = useUpdateAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAutomationMutation, UpdateAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateAutomationMutation, UpdateAutomationMutationVariables>(UpdateAutomationDocument, options);
      }
export type UpdateAutomationMutationHookResult = ReturnType<typeof useUpdateAutomationMutation>;
export type UpdateAutomationMutationResult = ApolloReactCommon.MutationResult<UpdateAutomationMutation>;
export type UpdateAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAutomationMutation, UpdateAutomationMutationVariables>;
export const DeleteAutomationDocument = gql`
    mutation DeleteAutomation($id: ID!) {
  deleteAutomation(id: $id)
}
    `;
export type DeleteAutomationMutationFn = ApolloReactCommon.MutationFunction<DeleteAutomationMutation, DeleteAutomationMutationVariables>;

/**
 * __useDeleteAutomationMutation__
 *
 * To run a mutation, you first call `useDeleteAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAutomationMutation, { data, loading, error }] = useDeleteAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteAutomationMutation, DeleteAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteAutomationMutation, DeleteAutomationMutationVariables>(DeleteAutomationDocument, options);
      }
export type DeleteAutomationMutationHookResult = ReturnType<typeof useDeleteAutomationMutation>;
export type DeleteAutomationMutationResult = ApolloReactCommon.MutationResult<DeleteAutomationMutation>;
export type DeleteAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteAutomationMutation, DeleteAutomationMutationVariables>;
export const DuplicateAutomationDocument = gql`
    mutation DuplicateAutomation($id: ID!, $newName: String!) {
  duplicateAutomation(id: $id, newName: $newName) {
    id
    name
  }
}
    `;
export type DuplicateAutomationMutationFn = ApolloReactCommon.MutationFunction<DuplicateAutomationMutation, DuplicateAutomationMutationVariables>;

/**
 * __useDuplicateAutomationMutation__
 *
 * To run a mutation, you first call `useDuplicateAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDuplicateAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [duplicateAutomationMutation, { data, loading, error }] = useDuplicateAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      newName: // value for 'newName'
 *   },
 * });
 */
export function useDuplicateAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DuplicateAutomationMutation, DuplicateAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DuplicateAutomationMutation, DuplicateAutomationMutationVariables>(DuplicateAutomationDocument, options);
      }
export type DuplicateAutomationMutationHookResult = ReturnType<typeof useDuplicateAutomationMutation>;
export type DuplicateAutomationMutationResult = ApolloReactCommon.MutationResult<DuplicateAutomationMutation>;
export type DuplicateAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<DuplicateAutomationMutation, DuplicateAutomationMutationVariables>;
export const SubmitAutomationForApprovalDocument = gql`
    mutation SubmitAutomationForApproval($id: ID!) {
  submitAutomationForApproval(id: $id) {
    id
    status
    isCompiled
    compilationError
  }
}
    `;
export type SubmitAutomationForApprovalMutationFn = ApolloReactCommon.MutationFunction<SubmitAutomationForApprovalMutation, SubmitAutomationForApprovalMutationVariables>;

/**
 * __useSubmitAutomationForApprovalMutation__
 *
 * To run a mutation, you first call `useSubmitAutomationForApprovalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitAutomationForApprovalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitAutomationForApprovalMutation, { data, loading, error }] = useSubmitAutomationForApprovalMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSubmitAutomationForApprovalMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SubmitAutomationForApprovalMutation, SubmitAutomationForApprovalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SubmitAutomationForApprovalMutation, SubmitAutomationForApprovalMutationVariables>(SubmitAutomationForApprovalDocument, options);
      }
export type SubmitAutomationForApprovalMutationHookResult = ReturnType<typeof useSubmitAutomationForApprovalMutation>;
export type SubmitAutomationForApprovalMutationResult = ApolloReactCommon.MutationResult<SubmitAutomationForApprovalMutation>;
export type SubmitAutomationForApprovalMutationOptions = ApolloReactCommon.BaseMutationOptions<SubmitAutomationForApprovalMutation, SubmitAutomationForApprovalMutationVariables>;
export const ApproveAutomationDocument = gql`
    mutation ApproveAutomation($id: ID!) {
  approveAutomation(id: $id) {
    id
    status
    approvedAt
    approvedBy {
      id
      name
    }
  }
}
    `;
export type ApproveAutomationMutationFn = ApolloReactCommon.MutationFunction<ApproveAutomationMutation, ApproveAutomationMutationVariables>;

/**
 * __useApproveAutomationMutation__
 *
 * To run a mutation, you first call `useApproveAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useApproveAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [approveAutomationMutation, { data, loading, error }] = useApproveAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useApproveAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ApproveAutomationMutation, ApproveAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ApproveAutomationMutation, ApproveAutomationMutationVariables>(ApproveAutomationDocument, options);
      }
export type ApproveAutomationMutationHookResult = ReturnType<typeof useApproveAutomationMutation>;
export type ApproveAutomationMutationResult = ApolloReactCommon.MutationResult<ApproveAutomationMutation>;
export type ApproveAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<ApproveAutomationMutation, ApproveAutomationMutationVariables>;
export const RejectAutomationDocument = gql`
    mutation RejectAutomation($id: ID!, $reason: String!) {
  rejectAutomation(id: $id, reason: $reason) {
    id
    status
    compilationError
  }
}
    `;
export type RejectAutomationMutationFn = ApolloReactCommon.MutationFunction<RejectAutomationMutation, RejectAutomationMutationVariables>;

/**
 * __useRejectAutomationMutation__
 *
 * To run a mutation, you first call `useRejectAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectAutomationMutation, { data, loading, error }] = useRejectAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useRejectAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<RejectAutomationMutation, RejectAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<RejectAutomationMutation, RejectAutomationMutationVariables>(RejectAutomationDocument, options);
      }
export type RejectAutomationMutationHookResult = ReturnType<typeof useRejectAutomationMutation>;
export type RejectAutomationMutationResult = ApolloReactCommon.MutationResult<RejectAutomationMutation>;
export type RejectAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<RejectAutomationMutation, RejectAutomationMutationVariables>;
export const EnableAutomationDocument = gql`
    mutation EnableAutomation($id: ID!) {
  enableAutomation(id: $id) {
    id
    isEnabled
  }
}
    `;
export type EnableAutomationMutationFn = ApolloReactCommon.MutationFunction<EnableAutomationMutation, EnableAutomationMutationVariables>;

/**
 * __useEnableAutomationMutation__
 *
 * To run a mutation, you first call `useEnableAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnableAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enableAutomationMutation, { data, loading, error }] = useEnableAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useEnableAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<EnableAutomationMutation, EnableAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<EnableAutomationMutation, EnableAutomationMutationVariables>(EnableAutomationDocument, options);
      }
export type EnableAutomationMutationHookResult = ReturnType<typeof useEnableAutomationMutation>;
export type EnableAutomationMutationResult = ApolloReactCommon.MutationResult<EnableAutomationMutation>;
export type EnableAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<EnableAutomationMutation, EnableAutomationMutationVariables>;
export const DisableAutomationDocument = gql`
    mutation DisableAutomation($id: ID!) {
  disableAutomation(id: $id) {
    id
    isEnabled
  }
}
    `;
export type DisableAutomationMutationFn = ApolloReactCommon.MutationFunction<DisableAutomationMutation, DisableAutomationMutationVariables>;

/**
 * __useDisableAutomationMutation__
 *
 * To run a mutation, you first call `useDisableAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableAutomationMutation, { data, loading, error }] = useDisableAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDisableAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DisableAutomationMutation, DisableAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DisableAutomationMutation, DisableAutomationMutationVariables>(DisableAutomationDocument, options);
      }
export type DisableAutomationMutationHookResult = ReturnType<typeof useDisableAutomationMutation>;
export type DisableAutomationMutationResult = ApolloReactCommon.MutationResult<DisableAutomationMutation>;
export type DisableAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<DisableAutomationMutation, DisableAutomationMutationVariables>;
export const ArchiveAutomationDocument = gql`
    mutation ArchiveAutomation($id: ID!) {
  archiveAutomation(id: $id) {
    id
    status
    isEnabled
  }
}
    `;
export type ArchiveAutomationMutationFn = ApolloReactCommon.MutationFunction<ArchiveAutomationMutation, ArchiveAutomationMutationVariables>;

/**
 * __useArchiveAutomationMutation__
 *
 * To run a mutation, you first call `useArchiveAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useArchiveAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [archiveAutomationMutation, { data, loading, error }] = useArchiveAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useArchiveAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ArchiveAutomationMutation, ArchiveAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ArchiveAutomationMutation, ArchiveAutomationMutationVariables>(ArchiveAutomationDocument, options);
      }
export type ArchiveAutomationMutationHookResult = ReturnType<typeof useArchiveAutomationMutation>;
export type ArchiveAutomationMutationResult = ApolloReactCommon.MutationResult<ArchiveAutomationMutation>;
export type ArchiveAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<ArchiveAutomationMutation, ArchiveAutomationMutationVariables>;
export const CompileAutomationDocument = gql`
    mutation CompileAutomation($id: ID!) {
  compileAutomation(id: $id) {
    id
    isCompiled
    compiledCode
    compilationError
  }
}
    `;
export type CompileAutomationMutationFn = ApolloReactCommon.MutationFunction<CompileAutomationMutation, CompileAutomationMutationVariables>;

/**
 * __useCompileAutomationMutation__
 *
 * To run a mutation, you first call `useCompileAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCompileAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [compileAutomationMutation, { data, loading, error }] = useCompileAutomationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCompileAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CompileAutomationMutation, CompileAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CompileAutomationMutation, CompileAutomationMutationVariables>(CompileAutomationDocument, options);
      }
export type CompileAutomationMutationHookResult = ReturnType<typeof useCompileAutomationMutation>;
export type CompileAutomationMutationResult = ApolloReactCommon.MutationResult<CompileAutomationMutation>;
export type CompileAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<CompileAutomationMutation, CompileAutomationMutationVariables>;
export const LinkScriptToAutomationDocument = gql`
    mutation LinkScriptToAutomation($input: LinkScriptToAutomationInput!) {
  linkScriptToAutomation(input: $input) {
    id
    script {
      id
      name
    }
    systemScript {
      id
      displayName
    }
    os
    executionOrder
  }
}
    `;
export type LinkScriptToAutomationMutationFn = ApolloReactCommon.MutationFunction<LinkScriptToAutomationMutation, LinkScriptToAutomationMutationVariables>;

/**
 * __useLinkScriptToAutomationMutation__
 *
 * To run a mutation, you first call `useLinkScriptToAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkScriptToAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkScriptToAutomationMutation, { data, loading, error }] = useLinkScriptToAutomationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLinkScriptToAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<LinkScriptToAutomationMutation, LinkScriptToAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<LinkScriptToAutomationMutation, LinkScriptToAutomationMutationVariables>(LinkScriptToAutomationDocument, options);
      }
export type LinkScriptToAutomationMutationHookResult = ReturnType<typeof useLinkScriptToAutomationMutation>;
export type LinkScriptToAutomationMutationResult = ApolloReactCommon.MutationResult<LinkScriptToAutomationMutation>;
export type LinkScriptToAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<LinkScriptToAutomationMutation, LinkScriptToAutomationMutationVariables>;
export const UnlinkScriptFromAutomationDocument = gql`
    mutation UnlinkScriptFromAutomation($automationId: ID!, $scriptId: ID, $systemScriptId: ID, $os: OS!) {
  unlinkScriptFromAutomation(
    automationId: $automationId
    scriptId: $scriptId
    systemScriptId: $systemScriptId
    os: $os
  )
}
    `;
export type UnlinkScriptFromAutomationMutationFn = ApolloReactCommon.MutationFunction<UnlinkScriptFromAutomationMutation, UnlinkScriptFromAutomationMutationVariables>;

/**
 * __useUnlinkScriptFromAutomationMutation__
 *
 * To run a mutation, you first call `useUnlinkScriptFromAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkScriptFromAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkScriptFromAutomationMutation, { data, loading, error }] = useUnlinkScriptFromAutomationMutation({
 *   variables: {
 *      automationId: // value for 'automationId'
 *      scriptId: // value for 'scriptId'
 *      systemScriptId: // value for 'systemScriptId'
 *      os: // value for 'os'
 *   },
 * });
 */
export function useUnlinkScriptFromAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnlinkScriptFromAutomationMutation, UnlinkScriptFromAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UnlinkScriptFromAutomationMutation, UnlinkScriptFromAutomationMutationVariables>(UnlinkScriptFromAutomationDocument, options);
      }
export type UnlinkScriptFromAutomationMutationHookResult = ReturnType<typeof useUnlinkScriptFromAutomationMutation>;
export type UnlinkScriptFromAutomationMutationResult = ApolloReactCommon.MutationResult<UnlinkScriptFromAutomationMutation>;
export type UnlinkScriptFromAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<UnlinkScriptFromAutomationMutation, UnlinkScriptFromAutomationMutationVariables>;
export const UpdateAutomationScriptDocument = gql`
    mutation UpdateAutomationScript($id: ID!, $executionOrder: Int, $executeOnTrigger: Boolean, $isEnabled: Boolean) {
  updateAutomationScript(
    id: $id
    executionOrder: $executionOrder
    executeOnTrigger: $executeOnTrigger
    isEnabled: $isEnabled
  ) {
    id
    executionOrder
    executeOnTrigger
    isEnabled
  }
}
    `;
export type UpdateAutomationScriptMutationFn = ApolloReactCommon.MutationFunction<UpdateAutomationScriptMutation, UpdateAutomationScriptMutationVariables>;

/**
 * __useUpdateAutomationScriptMutation__
 *
 * To run a mutation, you first call `useUpdateAutomationScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAutomationScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAutomationScriptMutation, { data, loading, error }] = useUpdateAutomationScriptMutation({
 *   variables: {
 *      id: // value for 'id'
 *      executionOrder: // value for 'executionOrder'
 *      executeOnTrigger: // value for 'executeOnTrigger'
 *      isEnabled: // value for 'isEnabled'
 *   },
 * });
 */
export function useUpdateAutomationScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateAutomationScriptMutation, UpdateAutomationScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateAutomationScriptMutation, UpdateAutomationScriptMutationVariables>(UpdateAutomationScriptDocument, options);
      }
export type UpdateAutomationScriptMutationHookResult = ReturnType<typeof useUpdateAutomationScriptMutation>;
export type UpdateAutomationScriptMutationResult = ApolloReactCommon.MutationResult<UpdateAutomationScriptMutation>;
export type UpdateAutomationScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateAutomationScriptMutation, UpdateAutomationScriptMutationVariables>;
export const TestAutomationDocument = gql`
    mutation TestAutomation($automationId: ID!, $machineId: ID!) {
  testAutomation(automationId: $automationId, machineId: $machineId) {
    id
    evaluationResult
    status
    evaluationTimeMs
    error
    triggeredAt
  }
}
    `;
export type TestAutomationMutationFn = ApolloReactCommon.MutationFunction<TestAutomationMutation, TestAutomationMutationVariables>;

/**
 * __useTestAutomationMutation__
 *
 * To run a mutation, you first call `useTestAutomationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTestAutomationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [testAutomationMutation, { data, loading, error }] = useTestAutomationMutation({
 *   variables: {
 *      automationId: // value for 'automationId'
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useTestAutomationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TestAutomationMutation, TestAutomationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TestAutomationMutation, TestAutomationMutationVariables>(TestAutomationDocument, options);
      }
export type TestAutomationMutationHookResult = ReturnType<typeof useTestAutomationMutation>;
export type TestAutomationMutationResult = ApolloReactCommon.MutationResult<TestAutomationMutation>;
export type TestAutomationMutationOptions = ApolloReactCommon.BaseMutationOptions<TestAutomationMutation, TestAutomationMutationVariables>;
export const TestAutomationWithContextDocument = gql`
    mutation TestAutomationWithContext($automationId: ID!, $context: JSONObject!) {
  testAutomationWithContext(automationId: $automationId, context: $context) {
    success
    result
    generatedCode
    evaluationTimeMs
    error
    logs
  }
}
    `;
export type TestAutomationWithContextMutationFn = ApolloReactCommon.MutationFunction<TestAutomationWithContextMutation, TestAutomationWithContextMutationVariables>;

/**
 * __useTestAutomationWithContextMutation__
 *
 * To run a mutation, you first call `useTestAutomationWithContextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTestAutomationWithContextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [testAutomationWithContextMutation, { data, loading, error }] = useTestAutomationWithContextMutation({
 *   variables: {
 *      automationId: // value for 'automationId'
 *      context: // value for 'context'
 *   },
 * });
 */
export function useTestAutomationWithContextMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TestAutomationWithContextMutation, TestAutomationWithContextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TestAutomationWithContextMutation, TestAutomationWithContextMutationVariables>(TestAutomationWithContextDocument, options);
      }
export type TestAutomationWithContextMutationHookResult = ReturnType<typeof useTestAutomationWithContextMutation>;
export type TestAutomationWithContextMutationResult = ApolloReactCommon.MutationResult<TestAutomationWithContextMutation>;
export type TestAutomationWithContextMutationOptions = ApolloReactCommon.BaseMutationOptions<TestAutomationWithContextMutation, TestAutomationWithContextMutationVariables>;
export const CreateCustomBlockDocument = gql`
    mutation CreateCustomBlock($input: CreateCustomBlockInput!) {
  createCustomBlock(input: $input) {
    id
    name
    displayName
    category
  }
}
    `;
export type CreateCustomBlockMutationFn = ApolloReactCommon.MutationFunction<CreateCustomBlockMutation, CreateCustomBlockMutationVariables>;

/**
 * __useCreateCustomBlockMutation__
 *
 * To run a mutation, you first call `useCreateCustomBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomBlockMutation, { data, loading, error }] = useCreateCustomBlockMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateCustomBlockMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateCustomBlockMutation, CreateCustomBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateCustomBlockMutation, CreateCustomBlockMutationVariables>(CreateCustomBlockDocument, options);
      }
export type CreateCustomBlockMutationHookResult = ReturnType<typeof useCreateCustomBlockMutation>;
export type CreateCustomBlockMutationResult = ApolloReactCommon.MutationResult<CreateCustomBlockMutation>;
export type CreateCustomBlockMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateCustomBlockMutation, CreateCustomBlockMutationVariables>;
export const UpdateCustomBlockDocument = gql`
    mutation UpdateCustomBlock($id: ID!, $input: UpdateCustomBlockInput!) {
  updateCustomBlock(id: $id, input: $input) {
    id
    displayName
    isEnabled
  }
}
    `;
export type UpdateCustomBlockMutationFn = ApolloReactCommon.MutationFunction<UpdateCustomBlockMutation, UpdateCustomBlockMutationVariables>;

/**
 * __useUpdateCustomBlockMutation__
 *
 * To run a mutation, you first call `useUpdateCustomBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCustomBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCustomBlockMutation, { data, loading, error }] = useUpdateCustomBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateCustomBlockMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateCustomBlockMutation, UpdateCustomBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateCustomBlockMutation, UpdateCustomBlockMutationVariables>(UpdateCustomBlockDocument, options);
      }
export type UpdateCustomBlockMutationHookResult = ReturnType<typeof useUpdateCustomBlockMutation>;
export type UpdateCustomBlockMutationResult = ApolloReactCommon.MutationResult<UpdateCustomBlockMutation>;
export type UpdateCustomBlockMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateCustomBlockMutation, UpdateCustomBlockMutationVariables>;
export const DeleteCustomBlockDocument = gql`
    mutation DeleteCustomBlock($id: ID!) {
  deleteCustomBlock(id: $id)
}
    `;
export type DeleteCustomBlockMutationFn = ApolloReactCommon.MutationFunction<DeleteCustomBlockMutation, DeleteCustomBlockMutationVariables>;

/**
 * __useDeleteCustomBlockMutation__
 *
 * To run a mutation, you first call `useDeleteCustomBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCustomBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCustomBlockMutation, { data, loading, error }] = useDeleteCustomBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteCustomBlockMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteCustomBlockMutation, DeleteCustomBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteCustomBlockMutation, DeleteCustomBlockMutationVariables>(DeleteCustomBlockDocument, options);
      }
export type DeleteCustomBlockMutationHookResult = ReturnType<typeof useDeleteCustomBlockMutation>;
export type DeleteCustomBlockMutationResult = ApolloReactCommon.MutationResult<DeleteCustomBlockMutation>;
export type DeleteCustomBlockMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteCustomBlockMutation, DeleteCustomBlockMutationVariables>;
export const TestCustomBlockDocument = gql`
    mutation TestCustomBlock($id: ID!, $sampleInputs: JSONObject!, $sampleContext: JSONObject) {
  testCustomBlock(
    id: $id
    sampleInputs: $sampleInputs
    sampleContext: $sampleContext
  )
}
    `;
export type TestCustomBlockMutationFn = ApolloReactCommon.MutationFunction<TestCustomBlockMutation, TestCustomBlockMutationVariables>;

/**
 * __useTestCustomBlockMutation__
 *
 * To run a mutation, you first call `useTestCustomBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTestCustomBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [testCustomBlockMutation, { data, loading, error }] = useTestCustomBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *      sampleInputs: // value for 'sampleInputs'
 *      sampleContext: // value for 'sampleContext'
 *   },
 * });
 */
export function useTestCustomBlockMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<TestCustomBlockMutation, TestCustomBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<TestCustomBlockMutation, TestCustomBlockMutationVariables>(TestCustomBlockDocument, options);
      }
export type TestCustomBlockMutationHookResult = ReturnType<typeof useTestCustomBlockMutation>;
export type TestCustomBlockMutationResult = ApolloReactCommon.MutationResult<TestCustomBlockMutation>;
export type TestCustomBlockMutationOptions = ApolloReactCommon.BaseMutationOptions<TestCustomBlockMutation, TestCustomBlockMutationVariables>;
export const ExecuteRecommendationDocument = gql`
    mutation ExecuteRecommendation($id: ID!) {
  executeRecommendation(id: $id) {
    id
    status
    scriptExecution {
      id
      status
    }
  }
}
    `;
export type ExecuteRecommendationMutationFn = ApolloReactCommon.MutationFunction<ExecuteRecommendationMutation, ExecuteRecommendationMutationVariables>;

/**
 * __useExecuteRecommendationMutation__
 *
 * To run a mutation, you first call `useExecuteRecommendationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteRecommendationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeRecommendationMutation, { data, loading, error }] = useExecuteRecommendationMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useExecuteRecommendationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ExecuteRecommendationMutation, ExecuteRecommendationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ExecuteRecommendationMutation, ExecuteRecommendationMutationVariables>(ExecuteRecommendationDocument, options);
      }
export type ExecuteRecommendationMutationHookResult = ReturnType<typeof useExecuteRecommendationMutation>;
export type ExecuteRecommendationMutationResult = ApolloReactCommon.MutationResult<ExecuteRecommendationMutation>;
export type ExecuteRecommendationMutationOptions = ApolloReactCommon.BaseMutationOptions<ExecuteRecommendationMutation, ExecuteRecommendationMutationVariables>;
export const DismissRecommendationDocument = gql`
    mutation DismissRecommendation($id: ID!, $reason: String) {
  dismissRecommendation(id: $id, reason: $reason) {
    id
    status
    dismissReason
  }
}
    `;
export type DismissRecommendationMutationFn = ApolloReactCommon.MutationFunction<DismissRecommendationMutation, DismissRecommendationMutationVariables>;

/**
 * __useDismissRecommendationMutation__
 *
 * To run a mutation, you first call `useDismissRecommendationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissRecommendationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissRecommendationMutation, { data, loading, error }] = useDismissRecommendationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      reason: // value for 'reason'
 *   },
 * });
 */
export function useDismissRecommendationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DismissRecommendationMutation, DismissRecommendationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DismissRecommendationMutation, DismissRecommendationMutationVariables>(DismissRecommendationDocument, options);
      }
export type DismissRecommendationMutationHookResult = ReturnType<typeof useDismissRecommendationMutation>;
export type DismissRecommendationMutationResult = ApolloReactCommon.MutationResult<DismissRecommendationMutation>;
export type DismissRecommendationMutationOptions = ApolloReactCommon.BaseMutationOptions<DismissRecommendationMutation, DismissRecommendationMutationVariables>;
export const SnoozeRecommendationDocument = gql`
    mutation SnoozeRecommendation($id: ID!, $duration: SnoozeDuration!) {
  snoozeRecommendation(id: $id, duration: $duration) {
    id
    status
    snoozeUntil
  }
}
    `;
export type SnoozeRecommendationMutationFn = ApolloReactCommon.MutationFunction<SnoozeRecommendationMutation, SnoozeRecommendationMutationVariables>;

/**
 * __useSnoozeRecommendationMutation__
 *
 * To run a mutation, you first call `useSnoozeRecommendationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSnoozeRecommendationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [snoozeRecommendationMutation, { data, loading, error }] = useSnoozeRecommendationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useSnoozeRecommendationMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SnoozeRecommendationMutation, SnoozeRecommendationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SnoozeRecommendationMutation, SnoozeRecommendationMutationVariables>(SnoozeRecommendationDocument, options);
      }
export type SnoozeRecommendationMutationHookResult = ReturnType<typeof useSnoozeRecommendationMutation>;
export type SnoozeRecommendationMutationResult = ApolloReactCommon.MutationResult<SnoozeRecommendationMutation>;
export type SnoozeRecommendationMutationOptions = ApolloReactCommon.BaseMutationOptions<SnoozeRecommendationMutation, SnoozeRecommendationMutationVariables>;
export const DismissAllRecommendationsDocument = gql`
    mutation DismissAllRecommendations {
  dismissAllRecommendations
}
    `;
export type DismissAllRecommendationsMutationFn = ApolloReactCommon.MutationFunction<DismissAllRecommendationsMutation, DismissAllRecommendationsMutationVariables>;

/**
 * __useDismissAllRecommendationsMutation__
 *
 * To run a mutation, you first call `useDismissAllRecommendationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissAllRecommendationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissAllRecommendationsMutation, { data, loading, error }] = useDismissAllRecommendationsMutation({
 *   variables: {
 *   },
 * });
 */
export function useDismissAllRecommendationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DismissAllRecommendationsMutation, DismissAllRecommendationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DismissAllRecommendationsMutation, DismissAllRecommendationsMutationVariables>(DismissAllRecommendationsDocument, options);
      }
export type DismissAllRecommendationsMutationHookResult = ReturnType<typeof useDismissAllRecommendationsMutation>;
export type DismissAllRecommendationsMutationResult = ApolloReactCommon.MutationResult<DismissAllRecommendationsMutation>;
export type DismissAllRecommendationsMutationOptions = ApolloReactCommon.BaseMutationOptions<DismissAllRecommendationsMutation, DismissAllRecommendationsMutationVariables>;
export const SnoozeAllRecommendationsDocument = gql`
    mutation SnoozeAllRecommendations($duration: SnoozeDuration!) {
  snoozeAllRecommendations(duration: $duration)
}
    `;
export type SnoozeAllRecommendationsMutationFn = ApolloReactCommon.MutationFunction<SnoozeAllRecommendationsMutation, SnoozeAllRecommendationsMutationVariables>;

/**
 * __useSnoozeAllRecommendationsMutation__
 *
 * To run a mutation, you first call `useSnoozeAllRecommendationsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSnoozeAllRecommendationsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [snoozeAllRecommendationsMutation, { data, loading, error }] = useSnoozeAllRecommendationsMutation({
 *   variables: {
 *      duration: // value for 'duration'
 *   },
 * });
 */
export function useSnoozeAllRecommendationsMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<SnoozeAllRecommendationsMutation, SnoozeAllRecommendationsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<SnoozeAllRecommendationsMutation, SnoozeAllRecommendationsMutationVariables>(SnoozeAllRecommendationsDocument, options);
      }
export type SnoozeAllRecommendationsMutationHookResult = ReturnType<typeof useSnoozeAllRecommendationsMutation>;
export type SnoozeAllRecommendationsMutationResult = ApolloReactCommon.MutationResult<SnoozeAllRecommendationsMutation>;
export type SnoozeAllRecommendationsMutationOptions = ApolloReactCommon.BaseMutationOptions<SnoozeAllRecommendationsMutation, SnoozeAllRecommendationsMutationVariables>;
export const CreateSystemScriptDocument = gql`
    mutation CreateSystemScript($input: CreateSystemScriptInput!) {
  createSystemScript(input: $input) {
    id
    name
    displayName
  }
}
    `;
export type CreateSystemScriptMutationFn = ApolloReactCommon.MutationFunction<CreateSystemScriptMutation, CreateSystemScriptMutationVariables>;

/**
 * __useCreateSystemScriptMutation__
 *
 * To run a mutation, you first call `useCreateSystemScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSystemScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSystemScriptMutation, { data, loading, error }] = useCreateSystemScriptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSystemScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateSystemScriptMutation, CreateSystemScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateSystemScriptMutation, CreateSystemScriptMutationVariables>(CreateSystemScriptDocument, options);
      }
export type CreateSystemScriptMutationHookResult = ReturnType<typeof useCreateSystemScriptMutation>;
export type CreateSystemScriptMutationResult = ApolloReactCommon.MutationResult<CreateSystemScriptMutation>;
export type CreateSystemScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateSystemScriptMutation, CreateSystemScriptMutationVariables>;
export const UpdateSystemScriptDocument = gql`
    mutation UpdateSystemScript($id: ID!, $input: UpdateSystemScriptInput!) {
  updateSystemScript(id: $id, input: $input) {
    id
    displayName
    isEnabled
  }
}
    `;
export type UpdateSystemScriptMutationFn = ApolloReactCommon.MutationFunction<UpdateSystemScriptMutation, UpdateSystemScriptMutationVariables>;

/**
 * __useUpdateSystemScriptMutation__
 *
 * To run a mutation, you first call `useUpdateSystemScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSystemScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSystemScriptMutation, { data, loading, error }] = useUpdateSystemScriptMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSystemScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateSystemScriptMutation, UpdateSystemScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateSystemScriptMutation, UpdateSystemScriptMutationVariables>(UpdateSystemScriptDocument, options);
      }
export type UpdateSystemScriptMutationHookResult = ReturnType<typeof useUpdateSystemScriptMutation>;
export type UpdateSystemScriptMutationResult = ApolloReactCommon.MutationResult<UpdateSystemScriptMutation>;
export type UpdateSystemScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateSystemScriptMutation, UpdateSystemScriptMutationVariables>;
export const DeleteSystemScriptDocument = gql`
    mutation DeleteSystemScript($id: ID!) {
  deleteSystemScript(id: $id)
}
    `;
export type DeleteSystemScriptMutationFn = ApolloReactCommon.MutationFunction<DeleteSystemScriptMutation, DeleteSystemScriptMutationVariables>;

/**
 * __useDeleteSystemScriptMutation__
 *
 * To run a mutation, you first call `useDeleteSystemScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSystemScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSystemScriptMutation, { data, loading, error }] = useDeleteSystemScriptMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSystemScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteSystemScriptMutation, DeleteSystemScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteSystemScriptMutation, DeleteSystemScriptMutationVariables>(DeleteSystemScriptDocument, options);
      }
export type DeleteSystemScriptMutationHookResult = ReturnType<typeof useDeleteSystemScriptMutation>;
export type DeleteSystemScriptMutationResult = ApolloReactCommon.MutationResult<DeleteSystemScriptMutation>;
export type DeleteSystemScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteSystemScriptMutation, DeleteSystemScriptMutationVariables>;
export const BlocklyToolboxDocument = gql`
    query BlocklyToolbox {
  blocklyToolbox {
    categories {
      name
      colour
      blocks {
        type
        message0
        args0
        output
        previousStatement
        nextStatement
        colour
        tooltip
        helpUrl
      }
    }
  }
}
    `;

/**
 * __useBlocklyToolboxQuery__
 *
 * To run a query within a React component, call `useBlocklyToolboxQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlocklyToolboxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlocklyToolboxQuery({
 *   variables: {
 *   },
 * });
 */
export function useBlocklyToolboxQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>(BlocklyToolboxDocument, options);
      }
export function useBlocklyToolboxLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>(BlocklyToolboxDocument, options);
        }
export function useBlocklyToolboxSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>(BlocklyToolboxDocument, options);
        }
export type BlocklyToolboxQueryHookResult = ReturnType<typeof useBlocklyToolboxQuery>;
export type BlocklyToolboxLazyQueryHookResult = ReturnType<typeof useBlocklyToolboxLazyQuery>;
export type BlocklyToolboxSuspenseQueryHookResult = ReturnType<typeof useBlocklyToolboxSuspenseQuery>;
export type BlocklyToolboxQueryResult = ApolloReactCommon.QueryResult<BlocklyToolboxQuery, BlocklyToolboxQueryVariables>;
export function refetchBlocklyToolboxQuery(variables?: BlocklyToolboxQueryVariables) {
      return { query: BlocklyToolboxDocument, variables: variables }
    }
export const SystemScriptsDocument = gql`
    query SystemScripts($category: String) {
  systemScripts(category: $category) {
    id
    name
    displayName
    description
    category
    requiredHealthFields
    isEnabled
  }
}
    `;

/**
 * __useSystemScriptsQuery__
 *
 * To run a query within a React component, call `useSystemScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSystemScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSystemScriptsQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useSystemScriptsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SystemScriptsQuery, SystemScriptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<SystemScriptsQuery, SystemScriptsQueryVariables>(SystemScriptsDocument, options);
      }
export function useSystemScriptsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SystemScriptsQuery, SystemScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<SystemScriptsQuery, SystemScriptsQueryVariables>(SystemScriptsDocument, options);
        }
export function useSystemScriptsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<SystemScriptsQuery, SystemScriptsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<SystemScriptsQuery, SystemScriptsQueryVariables>(SystemScriptsDocument, options);
        }
export type SystemScriptsQueryHookResult = ReturnType<typeof useSystemScriptsQuery>;
export type SystemScriptsLazyQueryHookResult = ReturnType<typeof useSystemScriptsLazyQuery>;
export type SystemScriptsSuspenseQueryHookResult = ReturnType<typeof useSystemScriptsSuspenseQuery>;
export type SystemScriptsQueryResult = ApolloReactCommon.QueryResult<SystemScriptsQuery, SystemScriptsQueryVariables>;
export function refetchSystemScriptsQuery(variables?: SystemScriptsQueryVariables) {
      return { query: SystemScriptsDocument, variables: variables }
    }
export const GetAutomationTemplatesDocument = gql`
    query GetAutomationTemplates($category: String) {
  automationTemplates(category: $category) {
    id
    name
    description
    category
    recommendationType
    blocklyWorkspace
    isEnabled
    usageCount
    createdAt
  }
}
    `;

/**
 * __useGetAutomationTemplatesQuery__
 *
 * To run a query within a React component, call `useGetAutomationTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationTemplatesQuery({
 *   variables: {
 *      category: // value for 'category'
 *   },
 * });
 */
export function useGetAutomationTemplatesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>(GetAutomationTemplatesDocument, options);
      }
export function useGetAutomationTemplatesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>(GetAutomationTemplatesDocument, options);
        }
export function useGetAutomationTemplatesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>(GetAutomationTemplatesDocument, options);
        }
export type GetAutomationTemplatesQueryHookResult = ReturnType<typeof useGetAutomationTemplatesQuery>;
export type GetAutomationTemplatesLazyQueryHookResult = ReturnType<typeof useGetAutomationTemplatesLazyQuery>;
export type GetAutomationTemplatesSuspenseQueryHookResult = ReturnType<typeof useGetAutomationTemplatesSuspenseQuery>;
export type GetAutomationTemplatesQueryResult = ApolloReactCommon.QueryResult<GetAutomationTemplatesQuery, GetAutomationTemplatesQueryVariables>;
export function refetchGetAutomationTemplatesQuery(variables?: GetAutomationTemplatesQueryVariables) {
      return { query: GetAutomationTemplatesDocument, variables: variables }
    }
export const GetAutomationTemplateDocument = gql`
    query GetAutomationTemplate($id: ID!) {
  automationTemplate(id: $id) {
    id
    name
    description
    category
    recommendationType
    blocklyWorkspace
    isEnabled
    usageCount
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAutomationTemplateQuery__
 *
 * To run a query within a React component, call `useGetAutomationTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationTemplateQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAutomationTemplateQuery(baseOptions: ApolloReactHooks.QueryHookOptions<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables> & ({ variables: GetAutomationTemplateQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables>(GetAutomationTemplateDocument, options);
      }
export function useGetAutomationTemplateLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables>(GetAutomationTemplateDocument, options);
        }
export function useGetAutomationTemplateSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables>(GetAutomationTemplateDocument, options);
        }
export type GetAutomationTemplateQueryHookResult = ReturnType<typeof useGetAutomationTemplateQuery>;
export type GetAutomationTemplateLazyQueryHookResult = ReturnType<typeof useGetAutomationTemplateLazyQuery>;
export type GetAutomationTemplateSuspenseQueryHookResult = ReturnType<typeof useGetAutomationTemplateSuspenseQuery>;
export type GetAutomationTemplateQueryResult = ApolloReactCommon.QueryResult<GetAutomationTemplateQuery, GetAutomationTemplateQueryVariables>;
export function refetchGetAutomationTemplateQuery(variables: GetAutomationTemplateQueryVariables) {
      return { query: GetAutomationTemplateDocument, variables: variables }
    }
export const GetAutomationTemplateCategoriesDocument = gql`
    query GetAutomationTemplateCategories {
  automationTemplateCategories
}
    `;

/**
 * __useGetAutomationTemplateCategoriesQuery__
 *
 * To run a query within a React component, call `useGetAutomationTemplateCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAutomationTemplateCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAutomationTemplateCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAutomationTemplateCategoriesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>(GetAutomationTemplateCategoriesDocument, options);
      }
export function useGetAutomationTemplateCategoriesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>(GetAutomationTemplateCategoriesDocument, options);
        }
export function useGetAutomationTemplateCategoriesSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>(GetAutomationTemplateCategoriesDocument, options);
        }
export type GetAutomationTemplateCategoriesQueryHookResult = ReturnType<typeof useGetAutomationTemplateCategoriesQuery>;
export type GetAutomationTemplateCategoriesLazyQueryHookResult = ReturnType<typeof useGetAutomationTemplateCategoriesLazyQuery>;
export type GetAutomationTemplateCategoriesSuspenseQueryHookResult = ReturnType<typeof useGetAutomationTemplateCategoriesSuspenseQuery>;
export type GetAutomationTemplateCategoriesQueryResult = ApolloReactCommon.QueryResult<GetAutomationTemplateCategoriesQuery, GetAutomationTemplateCategoriesQueryVariables>;
export function refetchGetAutomationTemplateCategoriesQuery(variables?: GetAutomationTemplateCategoriesQueryVariables) {
      return { query: GetAutomationTemplateCategoriesDocument, variables: variables }
    }
export const CreateAutomationFromTemplateDocument = gql`
    mutation CreateAutomationFromTemplate($templateId: ID!, $name: String) {
  createAutomationFromTemplate(templateId: $templateId, name: $name) {
    id
    name
    description
    blocklyWorkspace
    status
    createdAt
  }
}
    `;
export type CreateAutomationFromTemplateMutationFn = ApolloReactCommon.MutationFunction<CreateAutomationFromTemplateMutation, CreateAutomationFromTemplateMutationVariables>;

/**
 * __useCreateAutomationFromTemplateMutation__
 *
 * To run a mutation, you first call `useCreateAutomationFromTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAutomationFromTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAutomationFromTemplateMutation, { data, loading, error }] = useCreateAutomationFromTemplateMutation({
 *   variables: {
 *      templateId: // value for 'templateId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateAutomationFromTemplateMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateAutomationFromTemplateMutation, CreateAutomationFromTemplateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateAutomationFromTemplateMutation, CreateAutomationFromTemplateMutationVariables>(CreateAutomationFromTemplateDocument, options);
      }
export type CreateAutomationFromTemplateMutationHookResult = ReturnType<typeof useCreateAutomationFromTemplateMutation>;
export type CreateAutomationFromTemplateMutationResult = ApolloReactCommon.MutationResult<CreateAutomationFromTemplateMutation>;
export type CreateAutomationFromTemplateMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateAutomationFromTemplateMutation, CreateAutomationFromTemplateMutationVariables>;
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
    mutation createDepartment($name: String!, $firewallConfig: CreateDepartmentFirewallInput) {
  createDepartment(name: $name, firewallConfig: $firewallConfig) {
    id
    name
    createdAt
    internetSpeed
    ipSubnet
    totalMachines
    firewallPolicy
    firewallDefaultConfig
    firewallCustomRules
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
 *      firewallConfig: // value for 'firewallConfig'
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
export const UpdateDepartmentFirewallPolicyDocument = gql`
    mutation UpdateDepartmentFirewallPolicy($departmentId: String!, $input: UpdateDepartmentFirewallPolicyInput!) {
  updateDepartmentFirewallPolicy(departmentId: $departmentId, input: $input) {
    id
    name
    firewallPolicy
    firewallDefaultConfig
    firewallCustomRules
    createdAt
    internetSpeed
    ipSubnet
    totalMachines
  }
}
    `;
export type UpdateDepartmentFirewallPolicyMutationFn = ApolloReactCommon.MutationFunction<UpdateDepartmentFirewallPolicyMutation, UpdateDepartmentFirewallPolicyMutationVariables>;

/**
 * __useUpdateDepartmentFirewallPolicyMutation__
 *
 * To run a mutation, you first call `useUpdateDepartmentFirewallPolicyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDepartmentFirewallPolicyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDepartmentFirewallPolicyMutation, { data, loading, error }] = useUpdateDepartmentFirewallPolicyMutation({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateDepartmentFirewallPolicyMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateDepartmentFirewallPolicyMutation, UpdateDepartmentFirewallPolicyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateDepartmentFirewallPolicyMutation, UpdateDepartmentFirewallPolicyMutationVariables>(UpdateDepartmentFirewallPolicyDocument, options);
      }
export type UpdateDepartmentFirewallPolicyMutationHookResult = ReturnType<typeof useUpdateDepartmentFirewallPolicyMutation>;
export type UpdateDepartmentFirewallPolicyMutationResult = ApolloReactCommon.MutationResult<UpdateDepartmentFirewallPolicyMutation>;
export type UpdateDepartmentFirewallPolicyMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateDepartmentFirewallPolicyMutation, UpdateDepartmentFirewallPolicyMutationVariables>;
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
export const CreateScriptDocument = gql`
    mutation CreateScript($input: CreateScriptInput!) {
  createScript(input: $input) {
    success
    message
    error
    script {
      id
      name
      description
      fileName
      category
      tags
      os
      shell
      hasInputs
      inputCount
      createdAt
      updatedAt
      createdBy {
        id
        firstName
        lastName
      }
    }
  }
}
    `;
export type CreateScriptMutationFn = ApolloReactCommon.MutationFunction<CreateScriptMutation, CreateScriptMutationVariables>;

/**
 * __useCreateScriptMutation__
 *
 * To run a mutation, you first call `useCreateScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScriptMutation, { data, loading, error }] = useCreateScriptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateScriptMutation, CreateScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CreateScriptMutation, CreateScriptMutationVariables>(CreateScriptDocument, options);
      }
export type CreateScriptMutationHookResult = ReturnType<typeof useCreateScriptMutation>;
export type CreateScriptMutationResult = ApolloReactCommon.MutationResult<CreateScriptMutation>;
export type CreateScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateScriptMutation, CreateScriptMutationVariables>;
export const UpdateScriptDocument = gql`
    mutation UpdateScript($input: UpdateScriptInput!) {
  updateScript(input: $input) {
    success
    message
    error
    script {
      id
      name
      description
      fileName
      category
      tags
      os
      shell
      hasInputs
      inputCount
      content
      parsedInputs {
        name
        type
        label
        description
        required
        default
        options {
          label
          value
        }
      }
      createdAt
      updatedAt
    }
  }
}
    `;
export type UpdateScriptMutationFn = ApolloReactCommon.MutationFunction<UpdateScriptMutation, UpdateScriptMutationVariables>;

/**
 * __useUpdateScriptMutation__
 *
 * To run a mutation, you first call `useUpdateScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScriptMutation, { data, loading, error }] = useUpdateScriptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateScriptMutation, UpdateScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateScriptMutation, UpdateScriptMutationVariables>(UpdateScriptDocument, options);
      }
export type UpdateScriptMutationHookResult = ReturnType<typeof useUpdateScriptMutation>;
export type UpdateScriptMutationResult = ApolloReactCommon.MutationResult<UpdateScriptMutation>;
export type UpdateScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateScriptMutation, UpdateScriptMutationVariables>;
export const DeleteScriptDocument = gql`
    mutation DeleteScript($id: ID!, $force: Boolean) {
  deleteScript(id: $id, force: $force) {
    success
    message
    error
  }
}
    `;
export type DeleteScriptMutationFn = ApolloReactCommon.MutationFunction<DeleteScriptMutation, DeleteScriptMutationVariables>;

/**
 * __useDeleteScriptMutation__
 *
 * To run a mutation, you first call `useDeleteScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScriptMutation, { data, loading, error }] = useDeleteScriptMutation({
 *   variables: {
 *      id: // value for 'id'
 *      force: // value for 'force'
 *   },
 * });
 */
export function useDeleteScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteScriptMutation, DeleteScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<DeleteScriptMutation, DeleteScriptMutationVariables>(DeleteScriptDocument, options);
      }
export type DeleteScriptMutationHookResult = ReturnType<typeof useDeleteScriptMutation>;
export type DeleteScriptMutationResult = ApolloReactCommon.MutationResult<DeleteScriptMutation>;
export type DeleteScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteScriptMutation, DeleteScriptMutationVariables>;
export const AssignScriptToDepartmentDocument = gql`
    mutation AssignScriptToDepartment($scriptId: ID!, $departmentId: ID!) {
  assignScriptToDepartment(scriptId: $scriptId, departmentId: $departmentId)
}
    `;
export type AssignScriptToDepartmentMutationFn = ApolloReactCommon.MutationFunction<AssignScriptToDepartmentMutation, AssignScriptToDepartmentMutationVariables>;

/**
 * __useAssignScriptToDepartmentMutation__
 *
 * To run a mutation, you first call `useAssignScriptToDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignScriptToDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignScriptToDepartmentMutation, { data, loading, error }] = useAssignScriptToDepartmentMutation({
 *   variables: {
 *      scriptId: // value for 'scriptId'
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useAssignScriptToDepartmentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<AssignScriptToDepartmentMutation, AssignScriptToDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<AssignScriptToDepartmentMutation, AssignScriptToDepartmentMutationVariables>(AssignScriptToDepartmentDocument, options);
      }
export type AssignScriptToDepartmentMutationHookResult = ReturnType<typeof useAssignScriptToDepartmentMutation>;
export type AssignScriptToDepartmentMutationResult = ApolloReactCommon.MutationResult<AssignScriptToDepartmentMutation>;
export type AssignScriptToDepartmentMutationOptions = ApolloReactCommon.BaseMutationOptions<AssignScriptToDepartmentMutation, AssignScriptToDepartmentMutationVariables>;
export const UnassignScriptFromDepartmentDocument = gql`
    mutation UnassignScriptFromDepartment($scriptId: ID!, $departmentId: ID!) {
  unassignScriptFromDepartment(scriptId: $scriptId, departmentId: $departmentId)
}
    `;
export type UnassignScriptFromDepartmentMutationFn = ApolloReactCommon.MutationFunction<UnassignScriptFromDepartmentMutation, UnassignScriptFromDepartmentMutationVariables>;

/**
 * __useUnassignScriptFromDepartmentMutation__
 *
 * To run a mutation, you first call `useUnassignScriptFromDepartmentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnassignScriptFromDepartmentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unassignScriptFromDepartmentMutation, { data, loading, error }] = useUnassignScriptFromDepartmentMutation({
 *   variables: {
 *      scriptId: // value for 'scriptId'
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useUnassignScriptFromDepartmentMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UnassignScriptFromDepartmentMutation, UnassignScriptFromDepartmentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UnassignScriptFromDepartmentMutation, UnassignScriptFromDepartmentMutationVariables>(UnassignScriptFromDepartmentDocument, options);
      }
export type UnassignScriptFromDepartmentMutationHookResult = ReturnType<typeof useUnassignScriptFromDepartmentMutation>;
export type UnassignScriptFromDepartmentMutationResult = ApolloReactCommon.MutationResult<UnassignScriptFromDepartmentMutation>;
export type UnassignScriptFromDepartmentMutationOptions = ApolloReactCommon.BaseMutationOptions<UnassignScriptFromDepartmentMutation, UnassignScriptFromDepartmentMutationVariables>;
export const ExecuteScriptDocument = gql`
    mutation ExecuteScript($input: ExecuteScriptInput!) {
  executeScript(input: $input) {
    success
    message
    error
    execution {
      id
      script {
        id
        name
      }
      machine {
        id
        name
      }
      executionType
      status
      inputValues
      createdAt
    }
  }
}
    `;
export type ExecuteScriptMutationFn = ApolloReactCommon.MutationFunction<ExecuteScriptMutation, ExecuteScriptMutationVariables>;

/**
 * __useExecuteScriptMutation__
 *
 * To run a mutation, you first call `useExecuteScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExecuteScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [executeScriptMutation, { data, loading, error }] = useExecuteScriptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExecuteScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ExecuteScriptMutation, ExecuteScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ExecuteScriptMutation, ExecuteScriptMutationVariables>(ExecuteScriptDocument, options);
      }
export type ExecuteScriptMutationHookResult = ReturnType<typeof useExecuteScriptMutation>;
export type ExecuteScriptMutationResult = ApolloReactCommon.MutationResult<ExecuteScriptMutation>;
export type ExecuteScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<ExecuteScriptMutation, ExecuteScriptMutationVariables>;
export const CancelScriptExecutionDocument = gql`
    mutation CancelScriptExecution($id: ID!) {
  cancelScriptExecution(id: $id) {
    success
    message
    error
    execution {
      id
      status
      completedAt
      error
    }
  }
}
    `;
export type CancelScriptExecutionMutationFn = ApolloReactCommon.MutationFunction<CancelScriptExecutionMutation, CancelScriptExecutionMutationVariables>;

/**
 * __useCancelScriptExecutionMutation__
 *
 * To run a mutation, you first call `useCancelScriptExecutionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelScriptExecutionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelScriptExecutionMutation, { data, loading, error }] = useCancelScriptExecutionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useCancelScriptExecutionMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelScriptExecutionMutation, CancelScriptExecutionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelScriptExecutionMutation, CancelScriptExecutionMutationVariables>(CancelScriptExecutionDocument, options);
      }
export type CancelScriptExecutionMutationHookResult = ReturnType<typeof useCancelScriptExecutionMutation>;
export type CancelScriptExecutionMutationResult = ApolloReactCommon.MutationResult<CancelScriptExecutionMutation>;
export type CancelScriptExecutionMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelScriptExecutionMutation, CancelScriptExecutionMutationVariables>;
export const ScheduleScriptDocument = gql`
    mutation ScheduleScript($input: ScheduleScriptInput!) {
  scheduleScript(input: $input) {
    success
    message
    error
    executionIds
    executions {
      id
      status
      executionType
      scheduledFor
      repeatIntervalMinutes
      maxExecutions
      executionCount
      scheduleType
      nextExecutionAt
      isActive
      inputValues
      script {
        id
        name
      }
      machine {
        id
        name
        status
      }
      triggeredBy {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `;
export type ScheduleScriptMutationFn = ApolloReactCommon.MutationFunction<ScheduleScriptMutation, ScheduleScriptMutationVariables>;

/**
 * __useScheduleScriptMutation__
 *
 * To run a mutation, you first call `useScheduleScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useScheduleScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [scheduleScriptMutation, { data, loading, error }] = useScheduleScriptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useScheduleScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<ScheduleScriptMutation, ScheduleScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<ScheduleScriptMutation, ScheduleScriptMutationVariables>(ScheduleScriptDocument, options);
      }
export type ScheduleScriptMutationHookResult = ReturnType<typeof useScheduleScriptMutation>;
export type ScheduleScriptMutationResult = ApolloReactCommon.MutationResult<ScheduleScriptMutation>;
export type ScheduleScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<ScheduleScriptMutation, ScheduleScriptMutationVariables>;
export const UpdateScheduledScriptDocument = gql`
    mutation UpdateScheduledScript($input: UpdateScheduledScriptInput!) {
  updateScheduledScript(input: $input) {
    success
    message
    error
    executionIds
    executions {
      id
      status
      executionType
      scheduledFor
      repeatIntervalMinutes
      maxExecutions
      executionCount
      scheduleType
      nextExecutionAt
      isActive
      inputValues
      script {
        id
        name
      }
      machine {
        id
        name
        status
      }
      triggeredBy {
        id
        firstName
        lastName
      }
      createdAt
    }
  }
}
    `;
export type UpdateScheduledScriptMutationFn = ApolloReactCommon.MutationFunction<UpdateScheduledScriptMutation, UpdateScheduledScriptMutationVariables>;

/**
 * __useUpdateScheduledScriptMutation__
 *
 * To run a mutation, you first call `useUpdateScheduledScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateScheduledScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateScheduledScriptMutation, { data, loading, error }] = useUpdateScheduledScriptMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateScheduledScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateScheduledScriptMutation, UpdateScheduledScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<UpdateScheduledScriptMutation, UpdateScheduledScriptMutationVariables>(UpdateScheduledScriptDocument, options);
      }
export type UpdateScheduledScriptMutationHookResult = ReturnType<typeof useUpdateScheduledScriptMutation>;
export type UpdateScheduledScriptMutationResult = ApolloReactCommon.MutationResult<UpdateScheduledScriptMutation>;
export type UpdateScheduledScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateScheduledScriptMutation, UpdateScheduledScriptMutationVariables>;
export const CancelScheduledScriptDocument = gql`
    mutation CancelScheduledScript($executionId: ID!) {
  cancelScheduledScript(executionId: $executionId) {
    success
    message
    error
  }
}
    `;
export type CancelScheduledScriptMutationFn = ApolloReactCommon.MutationFunction<CancelScheduledScriptMutation, CancelScheduledScriptMutationVariables>;

/**
 * __useCancelScheduledScriptMutation__
 *
 * To run a mutation, you first call `useCancelScheduledScriptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelScheduledScriptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelScheduledScriptMutation, { data, loading, error }] = useCancelScheduledScriptMutation({
 *   variables: {
 *      executionId: // value for 'executionId'
 *   },
 * });
 */
export function useCancelScheduledScriptMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CancelScheduledScriptMutation, CancelScheduledScriptMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useMutation<CancelScheduledScriptMutation, CancelScheduledScriptMutationVariables>(CancelScheduledScriptDocument, options);
      }
export type CancelScheduledScriptMutationHookResult = ReturnType<typeof useCancelScheduledScriptMutation>;
export type CancelScheduledScriptMutationResult = ApolloReactCommon.MutationResult<CancelScheduledScriptMutation>;
export type CancelScheduledScriptMutationOptions = ApolloReactCommon.BaseMutationOptions<CancelScheduledScriptMutation, CancelScheduledScriptMutationVariables>;
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
    firewallPolicy
    firewallDefaultConfig
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
    firewallPolicy
    firewallDefaultConfig
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
    firewallPolicy
    firewallDefaultConfig
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
export const ScriptsDocument = gql`
    query Scripts($filters: ScriptFiltersInput) {
  scripts(filters: $filters) {
    id
    name
    description
    fileName
    category
    tags
    os
    shell
    hasInputs
    inputCount
    createdAt
    updatedAt
    createdBy {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

/**
 * __useScriptsQuery__
 *
 * To run a query within a React component, call `useScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScriptsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useScriptsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScriptsQuery, ScriptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScriptsQuery, ScriptsQueryVariables>(ScriptsDocument, options);
      }
export function useScriptsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScriptsQuery, ScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScriptsQuery, ScriptsQueryVariables>(ScriptsDocument, options);
        }
export function useScriptsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScriptsQuery, ScriptsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScriptsQuery, ScriptsQueryVariables>(ScriptsDocument, options);
        }
export type ScriptsQueryHookResult = ReturnType<typeof useScriptsQuery>;
export type ScriptsLazyQueryHookResult = ReturnType<typeof useScriptsLazyQuery>;
export type ScriptsSuspenseQueryHookResult = ReturnType<typeof useScriptsSuspenseQuery>;
export type ScriptsQueryResult = ApolloReactCommon.QueryResult<ScriptsQuery, ScriptsQueryVariables>;
export function refetchScriptsQuery(variables?: ScriptsQueryVariables) {
      return { query: ScriptsDocument, variables: variables }
    }
export const ScriptDocument = gql`
    query Script($id: ID!) {
  script(id: $id) {
    id
    name
    description
    fileName
    category
    tags
    os
    shell
    hasInputs
    inputCount
    content
    parsedInputs {
      name
      type
      label
      description
      default
      required
      validation
      options {
        label
        value
      }
    }
    createdAt
    updatedAt
    createdBy {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

/**
 * __useScriptQuery__
 *
 * To run a query within a React component, call `useScriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useScriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScriptQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useScriptQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ScriptQuery, ScriptQueryVariables> & ({ variables: ScriptQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScriptQuery, ScriptQueryVariables>(ScriptDocument, options);
      }
export function useScriptLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScriptQuery, ScriptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScriptQuery, ScriptQueryVariables>(ScriptDocument, options);
        }
export function useScriptSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScriptQuery, ScriptQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScriptQuery, ScriptQueryVariables>(ScriptDocument, options);
        }
export type ScriptQueryHookResult = ReturnType<typeof useScriptQuery>;
export type ScriptLazyQueryHookResult = ReturnType<typeof useScriptLazyQuery>;
export type ScriptSuspenseQueryHookResult = ReturnType<typeof useScriptSuspenseQuery>;
export type ScriptQueryResult = ApolloReactCommon.QueryResult<ScriptQuery, ScriptQueryVariables>;
export function refetchScriptQuery(variables: ScriptQueryVariables) {
      return { query: ScriptDocument, variables: variables }
    }
export const DepartmentScriptsDocument = gql`
    query DepartmentScripts($departmentId: ID!) {
  departmentScripts(departmentId: $departmentId) {
    id
    name
    description
    fileName
    category
    tags
    os
    shell
    hasInputs
    inputCount
    parsedInputs {
      name
      label
      type
      required
      description
      default
      validation
      options {
        label
        value
      }
    }
    createdAt
    updatedAt
    createdBy {
      id
      firstName
      lastName
      email
    }
  }
}
    `;

/**
 * __useDepartmentScriptsQuery__
 *
 * To run a query within a React component, call `useDepartmentScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentScriptsQuery({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useDepartmentScriptsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DepartmentScriptsQuery, DepartmentScriptsQueryVariables> & ({ variables: DepartmentScriptsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DepartmentScriptsQuery, DepartmentScriptsQueryVariables>(DepartmentScriptsDocument, options);
      }
export function useDepartmentScriptsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DepartmentScriptsQuery, DepartmentScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DepartmentScriptsQuery, DepartmentScriptsQueryVariables>(DepartmentScriptsDocument, options);
        }
export function useDepartmentScriptsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<DepartmentScriptsQuery, DepartmentScriptsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<DepartmentScriptsQuery, DepartmentScriptsQueryVariables>(DepartmentScriptsDocument, options);
        }
export type DepartmentScriptsQueryHookResult = ReturnType<typeof useDepartmentScriptsQuery>;
export type DepartmentScriptsLazyQueryHookResult = ReturnType<typeof useDepartmentScriptsLazyQuery>;
export type DepartmentScriptsSuspenseQueryHookResult = ReturnType<typeof useDepartmentScriptsSuspenseQuery>;
export type DepartmentScriptsQueryResult = ApolloReactCommon.QueryResult<DepartmentScriptsQuery, DepartmentScriptsQueryVariables>;
export function refetchDepartmentScriptsQuery(variables: DepartmentScriptsQueryVariables) {
      return { query: DepartmentScriptsDocument, variables: variables }
    }
export const ScriptExecutionsDocument = gql`
    query ScriptExecutions($machineId: ID!, $status: ExecutionStatus, $limit: Int) {
  scriptExecutions(machineId: $machineId, status: $status, limit: $limit) {
    id
    script {
      id
      name
      description
    }
    machine {
      id
      name
    }
    executionType
    triggeredBy {
      id
      firstName
      lastName
    }
    inputValues
    status
    startedAt
    completedAt
    exitCode
    stdout
    stderr
    error
    executedAs
    createdAt
  }
}
    `;

/**
 * __useScriptExecutionsQuery__
 *
 * To run a query within a React component, call `useScriptExecutionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useScriptExecutionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScriptExecutionsQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *      status: // value for 'status'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useScriptExecutionsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ScriptExecutionsQuery, ScriptExecutionsQueryVariables> & ({ variables: ScriptExecutionsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScriptExecutionsQuery, ScriptExecutionsQueryVariables>(ScriptExecutionsDocument, options);
      }
export function useScriptExecutionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScriptExecutionsQuery, ScriptExecutionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScriptExecutionsQuery, ScriptExecutionsQueryVariables>(ScriptExecutionsDocument, options);
        }
export function useScriptExecutionsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScriptExecutionsQuery, ScriptExecutionsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScriptExecutionsQuery, ScriptExecutionsQueryVariables>(ScriptExecutionsDocument, options);
        }
export type ScriptExecutionsQueryHookResult = ReturnType<typeof useScriptExecutionsQuery>;
export type ScriptExecutionsLazyQueryHookResult = ReturnType<typeof useScriptExecutionsLazyQuery>;
export type ScriptExecutionsSuspenseQueryHookResult = ReturnType<typeof useScriptExecutionsSuspenseQuery>;
export type ScriptExecutionsQueryResult = ApolloReactCommon.QueryResult<ScriptExecutionsQuery, ScriptExecutionsQueryVariables>;
export function refetchScriptExecutionsQuery(variables: ScriptExecutionsQueryVariables) {
      return { query: ScriptExecutionsDocument, variables: variables }
    }
export const ScriptExecutionDocument = gql`
    query ScriptExecution($id: ID!) {
  scriptExecution(id: $id) {
    id
    script {
      id
      name
      description
    }
    machine {
      id
      name
    }
    executionType
    triggeredBy {
      id
      firstName
      lastName
    }
    inputValues
    status
    startedAt
    completedAt
    exitCode
    stdout
    stderr
    error
    executedAs
    createdAt
  }
}
    `;

/**
 * __useScriptExecutionQuery__
 *
 * To run a query within a React component, call `useScriptExecutionQuery` and pass it any options that fit your needs.
 * When your component renders, `useScriptExecutionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScriptExecutionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useScriptExecutionQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ScriptExecutionQuery, ScriptExecutionQueryVariables> & ({ variables: ScriptExecutionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScriptExecutionQuery, ScriptExecutionQueryVariables>(ScriptExecutionDocument, options);
      }
export function useScriptExecutionLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScriptExecutionQuery, ScriptExecutionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScriptExecutionQuery, ScriptExecutionQueryVariables>(ScriptExecutionDocument, options);
        }
export function useScriptExecutionSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScriptExecutionQuery, ScriptExecutionQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScriptExecutionQuery, ScriptExecutionQueryVariables>(ScriptExecutionDocument, options);
        }
export type ScriptExecutionQueryHookResult = ReturnType<typeof useScriptExecutionQuery>;
export type ScriptExecutionLazyQueryHookResult = ReturnType<typeof useScriptExecutionLazyQuery>;
export type ScriptExecutionSuspenseQueryHookResult = ReturnType<typeof useScriptExecutionSuspenseQuery>;
export type ScriptExecutionQueryResult = ApolloReactCommon.QueryResult<ScriptExecutionQuery, ScriptExecutionQueryVariables>;
export function refetchScriptExecutionQuery(variables: ScriptExecutionQueryVariables) {
      return { query: ScriptExecutionDocument, variables: variables }
    }
export const ScriptExecutionsFilteredDocument = gql`
    query ScriptExecutionsFiltered($filters: ScriptExecutionsFiltersInput!) {
  scriptExecutionsFiltered(filters: $filters) {
    total
    hasMore
    offset
    limit
    executions {
      id
      script {
        id
        name
        description
      }
      machine {
        id
        name
        status
        department {
          id
          name
        }
      }
      executionType
      triggeredBy {
        id
        firstName
        lastName
      }
      inputValues
      status
      startedAt
      completedAt
      exitCode
      stdout
      stderr
      error
      executedAs
      createdAt
      scheduledFor
      repeatIntervalMinutes
    }
  }
}
    `;

/**
 * __useScriptExecutionsFilteredQuery__
 *
 * To run a query within a React component, call `useScriptExecutionsFilteredQuery` and pass it any options that fit your needs.
 * When your component renders, `useScriptExecutionsFilteredQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScriptExecutionsFilteredQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useScriptExecutionsFilteredQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables> & ({ variables: ScriptExecutionsFilteredQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables>(ScriptExecutionsFilteredDocument, options);
      }
export function useScriptExecutionsFilteredLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables>(ScriptExecutionsFilteredDocument, options);
        }
export function useScriptExecutionsFilteredSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables>(ScriptExecutionsFilteredDocument, options);
        }
export type ScriptExecutionsFilteredQueryHookResult = ReturnType<typeof useScriptExecutionsFilteredQuery>;
export type ScriptExecutionsFilteredLazyQueryHookResult = ReturnType<typeof useScriptExecutionsFilteredLazyQuery>;
export type ScriptExecutionsFilteredSuspenseQueryHookResult = ReturnType<typeof useScriptExecutionsFilteredSuspenseQuery>;
export type ScriptExecutionsFilteredQueryResult = ApolloReactCommon.QueryResult<ScriptExecutionsFilteredQuery, ScriptExecutionsFilteredQueryVariables>;
export function refetchScriptExecutionsFilteredQuery(variables: ScriptExecutionsFilteredQueryVariables) {
      return { query: ScriptExecutionsFilteredDocument, variables: variables }
    }
export const VmUsersDocument = gql`
    query VmUsers($machineId: ID!) {
  vmUsers(machineId: $machineId)
}
    `;

/**
 * __useVmUsersQuery__
 *
 * To run a query within a React component, call `useVmUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useVmUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVmUsersQuery({
 *   variables: {
 *      machineId: // value for 'machineId'
 *   },
 * });
 */
export function useVmUsersQuery(baseOptions: ApolloReactHooks.QueryHookOptions<VmUsersQuery, VmUsersQueryVariables> & ({ variables: VmUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<VmUsersQuery, VmUsersQueryVariables>(VmUsersDocument, options);
      }
export function useVmUsersLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<VmUsersQuery, VmUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<VmUsersQuery, VmUsersQueryVariables>(VmUsersDocument, options);
        }
export function useVmUsersSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<VmUsersQuery, VmUsersQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<VmUsersQuery, VmUsersQueryVariables>(VmUsersDocument, options);
        }
export type VmUsersQueryHookResult = ReturnType<typeof useVmUsersQuery>;
export type VmUsersLazyQueryHookResult = ReturnType<typeof useVmUsersLazyQuery>;
export type VmUsersSuspenseQueryHookResult = ReturnType<typeof useVmUsersSuspenseQuery>;
export type VmUsersQueryResult = ApolloReactCommon.QueryResult<VmUsersQuery, VmUsersQueryVariables>;
export function refetchVmUsersQuery(variables: VmUsersQueryVariables) {
      return { query: VmUsersDocument, variables: variables }
    }
export const ScheduledScriptsDocument = gql`
    query ScheduledScripts($filters: ScheduledScriptsFiltersInput) {
  scheduledScripts(filters: $filters) {
    id
    status
    executionType
    scheduledFor
    repeatIntervalMinutes
    maxExecutions
    executionCount
    lastExecutedAt
    scheduleType
    nextExecutionAt
    isActive
    inputValues
    script {
      id
      name
      description
    }
    machine {
      id
      name
      status
    }
    triggeredBy {
      id
      firstName
      lastName
    }
    createdAt
  }
}
    `;

/**
 * __useScheduledScriptsQuery__
 *
 * To run a query within a React component, call `useScheduledScriptsQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduledScriptsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduledScriptsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useScheduledScriptsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>(ScheduledScriptsDocument, options);
      }
export function useScheduledScriptsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>(ScheduledScriptsDocument, options);
        }
export function useScheduledScriptsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>(ScheduledScriptsDocument, options);
        }
export type ScheduledScriptsQueryHookResult = ReturnType<typeof useScheduledScriptsQuery>;
export type ScheduledScriptsLazyQueryHookResult = ReturnType<typeof useScheduledScriptsLazyQuery>;
export type ScheduledScriptsSuspenseQueryHookResult = ReturnType<typeof useScheduledScriptsSuspenseQuery>;
export type ScheduledScriptsQueryResult = ApolloReactCommon.QueryResult<ScheduledScriptsQuery, ScheduledScriptsQueryVariables>;
export function refetchScheduledScriptsQuery(variables?: ScheduledScriptsQueryVariables) {
      return { query: ScheduledScriptsDocument, variables: variables }
    }
export const ScheduledScriptDocument = gql`
    query ScheduledScript($id: ID!) {
  scheduledScript(id: $id) {
    id
    status
    executionType
    scheduledFor
    repeatIntervalMinutes
    maxExecutions
    executionCount
    lastExecutedAt
    scheduleType
    nextExecutionAt
    isActive
    inputValues
    script {
      id
      name
      description
    }
    machine {
      id
      name
      status
    }
    triggeredBy {
      id
      firstName
      lastName
    }
    createdAt
  }
}
    `;

/**
 * __useScheduledScriptQuery__
 *
 * To run a query within a React component, call `useScheduledScriptQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduledScriptQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduledScriptQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useScheduledScriptQuery(baseOptions: ApolloReactHooks.QueryHookOptions<ScheduledScriptQuery, ScheduledScriptQueryVariables> & ({ variables: ScheduledScriptQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<ScheduledScriptQuery, ScheduledScriptQueryVariables>(ScheduledScriptDocument, options);
      }
export function useScheduledScriptLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScheduledScriptQuery, ScheduledScriptQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<ScheduledScriptQuery, ScheduledScriptQueryVariables>(ScheduledScriptDocument, options);
        }
export function useScheduledScriptSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<ScheduledScriptQuery, ScheduledScriptQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<ScheduledScriptQuery, ScheduledScriptQueryVariables>(ScheduledScriptDocument, options);
        }
export type ScheduledScriptQueryHookResult = ReturnType<typeof useScheduledScriptQuery>;
export type ScheduledScriptLazyQueryHookResult = ReturnType<typeof useScheduledScriptLazyQuery>;
export type ScheduledScriptSuspenseQueryHookResult = ReturnType<typeof useScheduledScriptSuspenseQuery>;
export type ScheduledScriptQueryResult = ApolloReactCommon.QueryResult<ScheduledScriptQuery, ScheduledScriptQueryVariables>;
export function refetchScheduledScriptQuery(variables: ScheduledScriptQueryVariables) {
      return { query: ScheduledScriptDocument, variables: variables }
    }
export const DepartmentNetworkDiagnosticsDocument = gql`
    query DepartmentNetworkDiagnostics($departmentId: String!) {
  departmentNetworkDiagnostics(departmentId: $departmentId) {
    departmentId
    departmentName
    timestamp
    bridge {
      exists
      isUp
      ipAddresses
      attachedInterfaces
      mtu
      state
    }
    dnsmasq {
      isRunning
      pid
      pidMatches
      configPath
      configExists
      leasePath
      leaseFileExists
      logPath
      logExists
      listeningPort
      recentLogLines
    }
    brNetfilter {
      moduleLoaded
      callIptables
      callIp6tables
      callArptables
      persistenceFileExists
    }
    nat {
      ruleExists
      tableExists
      chainExists
      ipForwardingEnabled
      ruleDetails
    }
    recommendations
    manualCommands
  }
}
    `;

/**
 * __useDepartmentNetworkDiagnosticsQuery__
 *
 * To run a query within a React component, call `useDepartmentNetworkDiagnosticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useDepartmentNetworkDiagnosticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDepartmentNetworkDiagnosticsQuery({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *   },
 * });
 */
export function useDepartmentNetworkDiagnosticsQuery(baseOptions: ApolloReactHooks.QueryHookOptions<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables> & ({ variables: DepartmentNetworkDiagnosticsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables>(DepartmentNetworkDiagnosticsDocument, options);
      }
export function useDepartmentNetworkDiagnosticsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables>(DepartmentNetworkDiagnosticsDocument, options);
        }
export function useDepartmentNetworkDiagnosticsSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables>(DepartmentNetworkDiagnosticsDocument, options);
        }
export type DepartmentNetworkDiagnosticsQueryHookResult = ReturnType<typeof useDepartmentNetworkDiagnosticsQuery>;
export type DepartmentNetworkDiagnosticsLazyQueryHookResult = ReturnType<typeof useDepartmentNetworkDiagnosticsLazyQuery>;
export type DepartmentNetworkDiagnosticsSuspenseQueryHookResult = ReturnType<typeof useDepartmentNetworkDiagnosticsSuspenseQuery>;
export type DepartmentNetworkDiagnosticsQueryResult = ApolloReactCommon.QueryResult<DepartmentNetworkDiagnosticsQuery, DepartmentNetworkDiagnosticsQueryVariables>;
export function refetchDepartmentNetworkDiagnosticsQuery(variables: DepartmentNetworkDiagnosticsQueryVariables) {
      return { query: DepartmentNetworkDiagnosticsDocument, variables: variables }
    }
export const CaptureDepartmentDhcpTrafficDocument = gql`
    query CaptureDepartmentDhcpTraffic($departmentId: String!, $durationSeconds: Int!) {
  captureDepartmentDhcpTraffic(
    departmentId: $departmentId
    durationSeconds: $durationSeconds
  ) {
    bridgeName
    duration
    packets
    summary {
      totalPackets
      discoverPackets
      offerPackets
      requestPackets
      ackPackets
    }
  }
}
    `;

/**
 * __useCaptureDepartmentDhcpTrafficQuery__
 *
 * To run a query within a React component, call `useCaptureDepartmentDhcpTrafficQuery` and pass it any options that fit your needs.
 * When your component renders, `useCaptureDepartmentDhcpTrafficQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCaptureDepartmentDhcpTrafficQuery({
 *   variables: {
 *      departmentId: // value for 'departmentId'
 *      durationSeconds: // value for 'durationSeconds'
 *   },
 * });
 */
export function useCaptureDepartmentDhcpTrafficQuery(baseOptions: ApolloReactHooks.QueryHookOptions<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables> & ({ variables: CaptureDepartmentDhcpTrafficQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return ApolloReactHooks.useQuery<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables>(CaptureDepartmentDhcpTrafficDocument, options);
      }
export function useCaptureDepartmentDhcpTrafficLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useLazyQuery<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables>(CaptureDepartmentDhcpTrafficDocument, options);
        }
export function useCaptureDepartmentDhcpTrafficSuspenseQuery(baseOptions?: ApolloReactHooks.SkipToken | ApolloReactHooks.SuspenseQueryHookOptions<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables>) {
          const options = baseOptions === ApolloReactHooks.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return ApolloReactHooks.useSuspenseQuery<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables>(CaptureDepartmentDhcpTrafficDocument, options);
        }
export type CaptureDepartmentDhcpTrafficQueryHookResult = ReturnType<typeof useCaptureDepartmentDhcpTrafficQuery>;
export type CaptureDepartmentDhcpTrafficLazyQueryHookResult = ReturnType<typeof useCaptureDepartmentDhcpTrafficLazyQuery>;
export type CaptureDepartmentDhcpTrafficSuspenseQueryHookResult = ReturnType<typeof useCaptureDepartmentDhcpTrafficSuspenseQuery>;
export type CaptureDepartmentDhcpTrafficQueryResult = ApolloReactCommon.QueryResult<CaptureDepartmentDhcpTrafficQuery, CaptureDepartmentDhcpTrafficQueryVariables>;
export function refetchCaptureDepartmentDhcpTrafficQuery(variables: CaptureDepartmentDhcpTrafficQueryVariables) {
      return { query: CaptureDepartmentDhcpTrafficDocument, variables: variables }
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