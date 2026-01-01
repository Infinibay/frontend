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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
  /** The javascript `Date` as integer. Type represents date and time as number of milliseconds from start of UNIX epoch. */
  Timestamp: { input: any; output: any; }
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

export type AutomationDepartmentType = {
  __typename?: 'AutomationDepartmentType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type AutomationExecutionFiltersInput = {
  automationId?: InputMaybe<Scalars['ID']['input']>;
  dateFrom?: InputMaybe<Scalars['DateTimeISO']['input']>;
  dateTo?: InputMaybe<Scalars['DateTimeISO']['input']>;
  evaluationResult?: InputMaybe<Scalars['Boolean']['input']>;
  machineId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Array<AutomationExecutionStatus>>;
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
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  contextSnapshot?: Maybe<Scalars['JSONObject']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  evaluatedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  evaluationResult: Scalars['Boolean']['output'];
  evaluationTimeMs?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  machine: AutomationMachineType;
  scriptExecution?: Maybe<AutomationScriptExecutionType>;
  snapshot?: Maybe<AutomationSnapshotType>;
  status: AutomationExecutionStatus;
  triggerReason: Scalars['String']['output'];
  triggeredAt: Scalars['DateTimeISO']['output'];
};

export type AutomationFiltersInput = {
  createdById?: InputMaybe<Scalars['ID']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<AutomationStatus>>;
};

export type AutomationMachineType = {
  __typename?: 'AutomationMachineType';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  osType?: Maybe<Os>;
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
  actionTakenAt?: Maybe<Scalars['DateTimeISO']['output']>;
  actionTakenBy?: Maybe<AutomationUserType>;
  autoResolveReason?: Maybe<Scalars['String']['output']>;
  autoResolvedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  automationId: Scalars['String']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dismissReason?: Maybe<Scalars['String']['output']>;
  execution?: Maybe<AutomationExecutionType>;
  id: Scalars['ID']['output'];
  machine: AutomationMachineType;
  script?: Maybe<AutomationScriptRefType>;
  scriptExecution?: Maybe<AutomationScriptExecutionType>;
  severity: RecommendationSeverity;
  snoozeUntil?: Maybe<Scalars['DateTimeISO']['output']>;
  status: AutomationRecommendationStatus;
  systemScript?: Maybe<SystemScriptType>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  userAction?: Maybe<RecommendationUserAction>;
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
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  id: Scalars['ID']['output'];
  startedAt?: Maybe<Scalars['DateTimeISO']['output']>;
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
  script?: Maybe<AutomationScriptRefType>;
  systemScript?: Maybe<SystemScriptType>;
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
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  recommendationType?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
  usageCount: Scalars['Int']['output'];
};

export type AutomationType = {
  __typename?: 'AutomationType';
  approvedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  approvedBy?: Maybe<AutomationUserType>;
  automationScripts: Array<AutomationScriptType>;
  blocklyWorkspace: Scalars['JSONObject']['output'];
  compilationError?: Maybe<Scalars['String']['output']>;
  compiledCode?: Maybe<Scalars['String']['output']>;
  cooldownMinutes: Scalars['Int']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy?: Maybe<AutomationUserType>;
  department?: Maybe<AutomationDepartmentType>;
  description?: Maybe<Scalars['String']['output']>;
  executionCount: Scalars['Int']['output'];
  generatedCode: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isCompiled: Scalars['Boolean']['output'];
  isEnabled: Scalars['Boolean']['output'];
  lastTriggeredAt?: Maybe<Scalars['DateTimeISO']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  recentExecutions: Array<AutomationExecutionType>;
  recommendationActionText?: Maybe<Scalars['String']['output']>;
  recommendationText?: Maybe<Scalars['String']['output']>;
  recommendationType?: Maybe<Scalars['String']['output']>;
  status: AutomationStatus;
  targetScope: AutomationScope;
  targets: Array<AutomationTargetType>;
  triggerRate?: Maybe<Scalars['Float']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};


export type AutomationTypeRecentExecutionsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export type AutomationUserType = {
  __typename?: 'AutomationUserType';
  email?: Maybe<Scalars['String']['output']>;
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
  nextRun?: Maybe<Scalars['DateTimeISO']['output']>;
  pendingChecks: Scalars['Int']['output'];
  totalVMsMonitored: Scalars['Int']['output'];
};

export type BlockDefinitionOutputType = {
  __typename?: 'BlockDefinitionOutputType';
  args0?: Maybe<Scalars['JSONObject']['output']>;
  colour: Scalars['Int']['output'];
  helpUrl?: Maybe<Scalars['String']['output']>;
  message0: Scalars['String']['output'];
  nextStatement?: Maybe<Scalars['Boolean']['output']>;
  output?: Maybe<Scalars['String']['output']>;
  previousStatement?: Maybe<Scalars['Boolean']['output']>;
  tooltip?: Maybe<Scalars['String']['output']>;
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
  mtu?: Maybe<Scalars['Int']['output']>;
  state?: Maybe<Scalars['String']['output']>;
};

export type BridgeNameInput = {
  bridgeName?: Scalars['String']['input'];
  networkName?: Scalars['String']['input'];
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

/** Type of rule conflict */
export enum ConflictType {
  Contradictory = 'CONTRADICTORY',
  Duplicate = 'DUPLICATE',
  PortOverlap = 'PORT_OVERLAP',
  PriorityConflict = 'PRIORITY_CONFLICT'
}

export type CreateApplicationInputType = {
  description?: InputMaybe<Scalars['String']['input']>;
  installCommand: Scalars['JSONObject']['input'];
  name?: Scalars['String']['input'];
  os?: Array<Scalars['String']['input']>;
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
};

export type CreateAutomationInput = {
  blocklyWorkspace: Scalars['JSONObject']['input'];
  cooldownMinutes?: InputMaybe<Scalars['Int']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** VMs to exclude (for EXCLUDE_VMS scope) */
  excludeMachineIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
  recommendationActionText?: InputMaybe<Scalars['String']['input']>;
  recommendationText?: InputMaybe<Scalars['String']['input']>;
  recommendationType?: InputMaybe<Scalars['String']['input']>;
  /** VMs to include (for SPECIFIC_VMS scope) */
  targetMachineIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  targetScope?: InputMaybe<AutomationScope>;
};

export type CreateCustomBlockInput = {
  blockDefinition: Scalars['JSONObject']['input'];
  category: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  generatorCode: Scalars['String']['input'];
  inputs: Array<CustomBlockInputDef>;
  name: Scalars['String']['input'];
  outputType: BlockOutputType;
  supportedOS?: InputMaybe<Array<Os>>;
};

export type CreateDepartmentFirewallInput = {
  firewallCustomRules?: InputMaybe<Scalars['JSON']['input']>;
  firewallDefaultConfig?: InputMaybe<Scalars['String']['input']>;
  firewallPolicy?: FirewallPolicy;
};

export type CreateFirewallRuleInput = {
  action: RuleAction;
  connectionState?: InputMaybe<Scalars['JSONObject']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  direction: RuleDirection;
  dstIpAddr?: InputMaybe<Scalars['String']['input']>;
  dstIpMask?: InputMaybe<Scalars['String']['input']>;
  dstPortEnd?: InputMaybe<Scalars['Int']['input']>;
  dstPortStart?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  overridesDept?: InputMaybe<Scalars['Boolean']['input']>;
  priority: Scalars['Int']['input'];
  protocol?: InputMaybe<Scalars['String']['input']>;
  srcIpAddr?: InputMaybe<Scalars['String']['input']>;
  srcIpMask?: InputMaybe<Scalars['String']['input']>;
  srcPortEnd?: InputMaybe<Scalars['Int']['input']>;
  srcPortStart?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateMachineInputType = {
  applications?: Array<MachineApplicationInputType>;
  customCores?: InputMaybe<Scalars['Int']['input']>;
  customRam?: InputMaybe<Scalars['Int']['input']>;
  customStorage?: InputMaybe<Scalars['Int']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  firstBootScripts?: Array<FirstBootScriptInputType>;
  keyboard?: InputMaybe<Scalars['String']['input']>;
  locale?: InputMaybe<Scalars['String']['input']>;
  name?: Scalars['String']['input'];
  os?: MachineOs;
  password?: Scalars['String']['input'];
  pciBus?: InputMaybe<Scalars['String']['input']>;
  productKey?: InputMaybe<Scalars['String']['input']>;
  templateId?: InputMaybe<Scalars['String']['input']>;
  timezone?: InputMaybe<Scalars['String']['input']>;
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

export type CreateScriptInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  format: ScriptFormat;
  name: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateSnapshotInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  machineId: Scalars['String']['input'];
  name: Scalars['String']['input'];
};

export type CreateSystemScriptInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  codeLinux?: InputMaybe<Scalars['String']['input']>;
  codeWindows?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName: Scalars['String']['input'];
  name: Scalars['String']['input'];
  requiredHealthFields?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateUserInputType = {
  /** User avatar image path */
  avatar?: InputMaybe<Scalars['String']['input']>;
  email?: Scalars['String']['input'];
  firstName?: Scalars['String']['input'];
  lastName?: Scalars['String']['input'];
  password?: Scalars['String']['input'];
  passwordConfirmation?: Scalars['String']['input'];
  role?: UserRole;
};

export type CustomBlockInputDef = {
  defaultValue?: InputMaybe<Scalars['JSONObject']['input']>;
  label: Scalars['String']['input'];
  name: Scalars['String']['input'];
  required?: InputMaybe<Scalars['Boolean']['input']>;
  type: Scalars['String']['input'];
};

export type CustomBlockInputType = {
  __typename?: 'CustomBlockInputType';
  defaultValue?: Maybe<Scalars['JSONObject']['output']>;
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
  createdBy?: Maybe<AutomationUserType>;
  description?: Maybe<Scalars['String']['output']>;
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
  bridgeName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  dnsServers?: Maybe<Array<Scalars['String']['output']>>;
  firewallCustomRules?: Maybe<Scalars['JSON']['output']>;
  firewallDefaultConfig?: Maybe<Scalars['String']['output']>;
  firewallPolicy: FirewallPolicy;
  gatewayIP?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  internetSpeed?: Maybe<Scalars['Int']['output']>;
  ipSubnet?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  ntpServers?: Maybe<Array<Scalars['String']['output']>>;
  totalMachines?: Maybe<Scalars['Float']['output']>;
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
  pid?: Maybe<Scalars['Int']['output']>;
  pidMatches: Scalars['Boolean']['output'];
  recentLogLines?: Maybe<Array<Scalars['String']['output']>>;
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
  parameters?: InputMaybe<Scalars['JSONObject']['input']>;
  taskType: MaintenanceTaskType;
};

export type ExecuteScriptInput = {
  inputValues: Scalars['JSON']['input'];
  machineId: Scalars['ID']['input'];
  runAs?: InputMaybe<Scalars['String']['input']>;
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
  lastSyncedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  /** @deprecated Este campo es legacy de la arquitectura libvirt y ya no se utiliza con nftables */
  libvirtUuid?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  rules: Array<FirewallRuleType>;
  updatedAt: Scalars['DateTimeISO']['output'];
  /** @deprecated Este campo es legacy de la arquitectura libvirt y ya no se utiliza con nftables */
  xmlContent?: Maybe<Scalars['String']['output']>;
};

export type FirewallRuleType = {
  __typename?: 'FirewallRuleType';
  action: RuleAction;
  connectionState?: Maybe<Scalars['JSONObject']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  direction: RuleDirection;
  dstIpAddr?: Maybe<Scalars['String']['output']>;
  dstIpMask?: Maybe<Scalars['String']['output']>;
  dstPortEnd?: Maybe<Scalars['Int']['output']>;
  dstPortStart?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  overridesDept: Scalars['Boolean']['output'];
  priority: Scalars['Int']['output'];
  protocol: Scalars['String']['output'];
  ruleSetId: Scalars['String']['output'];
  srcIpAddr?: Maybe<Scalars['String']['output']>;
  srcIpMask?: Maybe<Scalars['String']['output']>;
  srcPortEnd?: Maybe<Scalars['Int']['output']>;
  srcPortStart?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type FirstBootScriptInputType = {
  inputValues: Scalars['JSONObject']['input'];
  scriptId?: Scalars['String']['input'];
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
  details?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
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

export type InputOptionType = {
  __typename?: 'InputOptionType';
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type IpRangeInput = {
  end?: Scalars['String']['input'];
  networkName?: Scalars['String']['input'];
  start?: Scalars['String']['input'];
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
  lastFailure?: Maybe<Scalars['String']['output']>;
  /** Timestamp of last keep-alive response received */
  lastReceived?: Maybe<Scalars['String']['output']>;
  /** Timestamp of last keep-alive request sent */
  lastSent?: Maybe<Scalars['String']['output']>;
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
  uuid?: Maybe<Scalars['String']['output']>;
  /** ID de la VM asociada al chain */
  vmId?: Maybe<Scalars['String']['output']>;
};

export type LinkScriptToAutomationInput = {
  automationId: Scalars['ID']['input'];
  executeOnTrigger?: InputMaybe<Scalars['Boolean']['input']>;
  executionOrder?: InputMaybe<Scalars['Int']['input']>;
  os: Os;
  /** ID of regular script (mutually exclusive with systemScriptId) */
  scriptId?: InputMaybe<Scalars['ID']['input']>;
  /** ID of system script (mutually exclusive with scriptId) */
  systemScriptId?: InputMaybe<Scalars['ID']['input']>;
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

export type MachineType = {
  __typename?: 'MachineType';
  department?: Maybe<DepartmentType>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  os: Scalars['String']['output'];
  status: Scalars['String']['output'];
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
  login?: Maybe<LoginResponse>;
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
  name?: InputMaybe<Scalars['String']['input']>;
  templateId: Scalars['ID']['input'];
};


export type MutationCreateCustomBlockArgs = {
  input: CreateCustomBlockInput;
};


export type MutationCreateDepartmentArgs = {
  firewallConfig?: InputMaybe<CreateDepartmentFirewallInput>;
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
  reason?: InputMaybe<Scalars['String']['input']>;
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
  targets?: InputMaybe<Array<Scalars['String']['input']>>;
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
  sampleContext?: InputMaybe<Scalars['JSONObject']['input']>;
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
  scriptId?: InputMaybe<Scalars['ID']['input']>;
  systemScriptId?: InputMaybe<Scalars['ID']['input']>;
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
  executeOnTrigger?: InputMaybe<Scalars['Boolean']['input']>;
  executionOrder?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
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
  ruleDetails?: Maybe<Scalars['String']['output']>;
  ruleExists: Scalars['Boolean']['output'];
  tableExists: Scalars['Boolean']['output'];
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
  automation?: Maybe<AutomationType>;
  automationExecution?: Maybe<AutomationExecutionType>;
  automationExecutions: Array<AutomationExecutionType>;
  automationTemplate?: Maybe<AutomationTemplateType>;
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
  currentSnapshot?: Maybe<Snapshot>;
  currentUser?: Maybe<UserType>;
  customBlock?: Maybe<CustomBlockType>;
  customBlocks: Array<CustomBlockType>;
  department?: Maybe<DepartmentType>;
  departmentNetworkDiagnostics: DepartmentNetworkDiagnosticsType;
  departmentScripts: Array<ScriptType>;
  departments: Array<DepartmentType>;
  dueMaintenanceTasks: Array<MaintenanceTask>;
  findDepartmentByName?: Maybe<DepartmentType>;
  getAppSettings: AppSettings;
  getDepartmentFirewallRules?: Maybe<FirewallRuleSetType>;
  getEffectiveFirewallRules: EffectiveRuleSetType;
  getGraphics: Array<Gpu>;
  getLatestVMHealth?: Maybe<VmHealthSnapshotType>;
  /** Get supported OS types */
  getSupportedOSTypes: Array<Scalars['String']['output']>;
  getSystemResources: SystemResources;
  /** Get installed applications inventory for a VM */
  getVMApplicationInventory: ApplicationInventory;
  getVMFirewallRules?: Maybe<FirewallRuleSetType>;
  /** Get comprehensive health check status for a VM */
  getVMHealthStatus: HealthCheckStatus;
  /** Get automated recommendations for VM optimization, security, and maintenance based on system analysis. Returns up to 20 recommendations by default to prevent over-fetch. Use pagination for more results. */
  getVMRecommendations: Array<VmRecommendationType>;
  /** Get Windows Update history for a VM */
  getWindowsUpdateHistory: WindowsUpdateHistory;
  graphicConnection?: Maybe<GraphicConfigurationType>;
  healthCheckQueueStats: QueueStatsType;
  healthQueueStatistics: QueueStatistics;
  latestVMHealthSnapshot?: Maybe<VmHealthSnapshotType>;
  listInfinibayFilters: Array<LibvirtFilterInfoType>;
  /** List all installed packages on a virtual machine */
  listInstalledPackages: Array<PackageInfo>;
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
  pendingRecommendationCount: Scalars['Int']['output'];
  pendingRecommendations: Array<AutomationRecommendationType>;
  previewGeneratedCode: Scalars['String']['output'];
  recommendation?: Maybe<AutomationRecommendationType>;
  recommendations: Array<AutomationRecommendationType>;
  /** Run a specific health check on a VM */
  runHealthCheck: GenericHealthCheckResponse;
  scheduledScript?: Maybe<ScheduledScriptType>;
  scheduledScripts: Array<ScheduledScriptType>;
  script?: Maybe<ScriptType>;
  scriptExecution?: Maybe<ScriptExecutionType>;
  scriptExecutions: Array<ScriptExecutionType>;
  scriptExecutionsFiltered: ScriptExecutionsResponseType;
  scripts: Array<ScriptType>;
  /** Search for available packages on a virtual machine */
  searchPackages: Array<PackageInfo>;
  /** Get current socket connection statistics for all VMs */
  socketConnectionStats?: Maybe<SocketConnectionStats>;
  systemScript?: Maybe<SystemScriptType>;
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
  filters?: InputMaybe<AutomationExecutionFiltersInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAutomationTemplateArgs = {
  id: Scalars['ID']['input'];
};


export type QueryAutomationTemplatesArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryAutomationsArgs = {
  filters?: InputMaybe<AutomationFiltersInput>;
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


export type QueryCustomBlockArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomBlocksArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
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
  filter?: InputMaybe<RecommendationFilterInput>;
  refresh?: InputMaybe<Scalars['Boolean']['input']>;
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


export type QueryPendingRecommendationCountArgs = {
  machineId?: InputMaybe<Scalars['ID']['input']>;
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
  filters?: InputMaybe<RecommendationFiltersInput>;
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
  filters?: InputMaybe<ScheduledScriptsFiltersInput>;
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
  status?: InputMaybe<ExecutionStatus>;
};


export type QueryScriptExecutionsFilteredArgs = {
  filters: ScriptExecutionsFiltersInput;
};


export type QueryScriptsArgs = {
  filters?: InputMaybe<ScriptFiltersInput>;
};


export type QuerySearchPackagesArgs = {
  machineId: Scalars['ID']['input'];
  query: Scalars['String']['input'];
};


export type QuerySystemScriptArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemScriptsArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  orderBy?: InputMaybe<UserOrderByInputType>;
  pagination?: InputMaybe<PaginationInputType>;
};


export type QueryValidateFirewallRuleArgs = {
  input: CreateFirewallRuleInput;
};


export type QueryValidateWorkspaceArgs = {
  blocklyWorkspace: Scalars['JSONObject']['input'];
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
  createdAfter?: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** Only return recommendations created before this date/time */
  createdBefore?: InputMaybe<Scalars['DateTimeISO']['input']>;
  /** Maximum number of recommendations to return (for pagination, defaults to 20, max 100) */
  limit?: InputMaybe<Scalars['Float']['input']>;
  /** Filter by specific recommendation types (e.g., only security or storage recommendations) */
  types?: InputMaybe<Array<RecommendationType>>;
};

export type RecommendationFiltersInput = {
  automationId?: InputMaybe<Scalars['ID']['input']>;
  machineId?: InputMaybe<Scalars['ID']['input']>;
  severity?: InputMaybe<Array<RecommendationSeverity>>;
  status?: InputMaybe<Array<AutomationRecommendationStatus>>;
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
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  inputValues: Scalars['JSON']['input'];
  machineIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  maxExecutions?: InputMaybe<Scalars['Int']['input']>;
  repeatIntervalMinutes?: InputMaybe<Scalars['Int']['input']>;
  runAs?: InputMaybe<Scalars['String']['input']>;
  scheduleType: ScheduleType;
  scheduledFor?: InputMaybe<Scalars['DateTimeISO']['input']>;
  scriptId: Scalars['ID']['input'];
};

export type ScheduleScriptResponseType = {
  __typename?: 'ScheduleScriptResponseType';
  error?: Maybe<Scalars['String']['output']>;
  executionIds?: Maybe<Array<Scalars['ID']['output']>>;
  executions?: Maybe<Array<ScheduledScriptType>>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  warnings?: Maybe<Array<Scalars['String']['output']>>;
};

/** Script schedule type */
export enum ScheduleType {
  Immediate = 'IMMEDIATE',
  OneTime = 'ONE_TIME',
  Periodic = 'PERIODIC'
}

export type ScheduledScriptType = {
  __typename?: 'ScheduledScriptType';
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error?: Maybe<Scalars['String']['output']>;
  executedAs?: Maybe<Scalars['String']['output']>;
  executionCount: Scalars['Int']['output'];
  executionType: ExecutionType;
  exitCode?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  inputValues: Scalars['JSON']['output'];
  isActive: Scalars['Boolean']['output'];
  lastExecutedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  machine: MachineType;
  maxExecutions?: Maybe<Scalars['Int']['output']>;
  nextExecutionAt?: Maybe<Scalars['DateTimeISO']['output']>;
  repeatIntervalMinutes?: Maybe<Scalars['Int']['output']>;
  scheduleType: ScheduleType;
  scheduledFor?: Maybe<Scalars['DateTimeISO']['output']>;
  script: ScriptType;
  startedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  status: ExecutionStatus;
  stderr?: Maybe<Scalars['String']['output']>;
  stdout?: Maybe<Scalars['String']['output']>;
  triggeredBy?: Maybe<UserType>;
};

export type ScheduledScriptsFiltersInput = {
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  machineId?: InputMaybe<Scalars['ID']['input']>;
  scheduleType?: InputMaybe<ScheduleType>;
  scriptId?: InputMaybe<Scalars['ID']['input']>;
  status?: InputMaybe<Array<ExecutionStatus>>;
};

export type ScriptExecutionResponseType = {
  __typename?: 'ScriptExecutionResponseType';
  error?: Maybe<Scalars['String']['output']>;
  execution?: Maybe<ScriptExecutionType>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ScriptExecutionType = {
  __typename?: 'ScriptExecutionType';
  completedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  error?: Maybe<Scalars['String']['output']>;
  executedAs?: Maybe<Scalars['String']['output']>;
  executionCount: Scalars['Int']['output'];
  executionType: ExecutionType;
  exitCode?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  inputValues: Scalars['JSON']['output'];
  lastExecutedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  machine: MachineType;
  maxExecutions?: Maybe<Scalars['Int']['output']>;
  repeatIntervalMinutes?: Maybe<Scalars['Int']['output']>;
  scheduledFor?: Maybe<Scalars['DateTimeISO']['output']>;
  script: ScriptType;
  startedAt?: Maybe<Scalars['DateTimeISO']['output']>;
  status: ExecutionStatus;
  stderr?: Maybe<Scalars['String']['output']>;
  stdout?: Maybe<Scalars['String']['output']>;
  triggeredBy?: Maybe<UserType>;
};

export type ScriptExecutionsFiltersInput = {
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  endDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  executionType?: InputMaybe<ExecutionType>;
  limit?: Scalars['Int']['input'];
  machineId?: InputMaybe<Scalars['ID']['input']>;
  offset?: Scalars['Int']['input'];
  scriptId?: InputMaybe<Scalars['ID']['input']>;
  startDate?: InputMaybe<Scalars['DateTimeISO']['input']>;
  status?: InputMaybe<ExecutionStatus>;
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
  category?: InputMaybe<Scalars['String']['input']>;
  os?: InputMaybe<Os>;
  search?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** Script file format */
export enum ScriptFormat {
  Json = 'JSON',
  Yaml = 'YAML'
}

export type ScriptInputType = {
  __typename?: 'ScriptInputType';
  default?: Maybe<Scalars['JSON']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  label: Scalars['String']['output'];
  name: Scalars['String']['output'];
  options?: Maybe<Array<InputOptionType>>;
  required: Scalars['Boolean']['output'];
  type: Scalars['String']['output'];
  validation?: Maybe<Scalars['JSON']['output']>;
};

export type ScriptResponseType = {
  __typename?: 'ScriptResponseType';
  error?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  script?: Maybe<ScriptType>;
  success: Scalars['Boolean']['output'];
};

export type ScriptType = {
  __typename?: 'ScriptType';
  category?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy?: Maybe<UserType>;
  departmentCount?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  executionCount?: Maybe<Scalars['Int']['output']>;
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

/** Duration for snoozing a recommendation (ISO 8601) */
export enum SnoozeDuration {
  P7D = 'P7D',
  Pt1H = 'PT1H',
  Pt4H = 'PT4H',
  Pt24H = 'PT24H'
}

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
  codeLinux?: Maybe<Scalars['String']['output']>;
  codeWindows?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  createdBy?: Maybe<AutomationUserType>;
  description?: Maybe<Scalars['String']['output']>;
  displayName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isEnabled: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  requiredHealthFields: Array<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type TestResultType = {
  __typename?: 'TestResultType';
  error?: Maybe<Scalars['String']['output']>;
  evaluationTimeMs: Scalars['Int']['output'];
  generatedCode: Scalars['String']['output'];
  logs: Array<Scalars['String']['output']>;
  result?: Maybe<Scalars['Boolean']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ToolboxCategoryType = {
  __typename?: 'ToolboxCategoryType';
  blocks: Array<BlockDefinitionOutputType>;
  colour: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type UpdateAutomationInput = {
  blocklyWorkspace?: InputMaybe<Scalars['JSONObject']['input']>;
  cooldownMinutes?: InputMaybe<Scalars['Int']['input']>;
  departmentId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  /** VMs to exclude (for EXCLUDE_VMS scope) */
  excludeMachineIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  recommendationActionText?: InputMaybe<Scalars['String']['input']>;
  recommendationText?: InputMaybe<Scalars['String']['input']>;
  recommendationType?: InputMaybe<Scalars['String']['input']>;
  /** VMs to include (for SPECIFIC_VMS scope) */
  targetMachineIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  targetScope?: InputMaybe<AutomationScope>;
};

export type UpdateCustomBlockInput = {
  blockDefinition?: InputMaybe<Scalars['JSONObject']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  generatorCode?: InputMaybe<Scalars['String']['input']>;
  inputs?: InputMaybe<Array<CustomBlockInputDef>>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  outputType?: InputMaybe<BlockOutputType>;
  supportedOS?: InputMaybe<Array<Os>>;
};

export type UpdateDepartmentFirewallPolicyInput = {
  firewallCustomRules?: InputMaybe<Scalars['JSON']['input']>;
  firewallDefaultConfig?: Scalars['String']['input'];
  firewallPolicy?: FirewallPolicy;
};

export type UpdateDepartmentNameInput = {
  id?: Scalars['ID']['input'];
  name?: Scalars['String']['input'];
};

export type UpdateDepartmentNetworkInput = {
  dnsServers?: InputMaybe<Array<Scalars['String']['input']>>;
  id?: Scalars['ID']['input'];
  ntpServers?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateFirewallRuleInput = {
  action?: InputMaybe<RuleAction>;
  connectionState?: InputMaybe<Scalars['JSONObject']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  direction?: InputMaybe<RuleDirection>;
  dstIpAddr?: InputMaybe<Scalars['String']['input']>;
  dstIpMask?: InputMaybe<Scalars['String']['input']>;
  dstPortEnd?: InputMaybe<Scalars['Int']['input']>;
  dstPortStart?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  overridesDept?: InputMaybe<Scalars['Boolean']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  protocol?: InputMaybe<Scalars['String']['input']>;
  srcIpAddr?: InputMaybe<Scalars['String']['input']>;
  srcIpMask?: InputMaybe<Scalars['String']['input']>;
  srcPortEnd?: InputMaybe<Scalars['Int']['input']>;
  srcPortStart?: InputMaybe<Scalars['Int']['input']>;
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

export type UpdateMachineNameInput = {
  id?: Scalars['ID']['input'];
  /** New name for the machine */
  name?: Scalars['String']['input'];
};

export type UpdateMachineUserInput = {
  id?: Scalars['ID']['input'];
  /** User ID to assign to the machine. Set to null to unassign. */
  userId?: InputMaybe<Scalars['String']['input']>;
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

export type UpdateScheduledScriptInput = {
  executionId: Scalars['ID']['input'];
  inputValues?: InputMaybe<Scalars['JSON']['input']>;
  maxExecutions?: InputMaybe<Scalars['Int']['input']>;
  repeatIntervalMinutes?: InputMaybe<Scalars['Int']['input']>;
  runAs?: InputMaybe<Scalars['String']['input']>;
  scheduledFor?: InputMaybe<Scalars['DateTimeISO']['input']>;
};

export type UpdateScriptInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  content?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateSystemScriptInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  codeLinux?: InputMaybe<Scalars['String']['input']>;
  codeWindows?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  isEnabled?: InputMaybe<Scalars['Boolean']['input']>;
  requiredHealthFields?: InputMaybe<Array<Scalars['String']['input']>>;
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

export type ValidationErrorType = {
  __typename?: 'ValidationErrorType';
  blockId?: Maybe<Scalars['String']['output']>;
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
  blockId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type VmConnectionInfo = {
  __typename?: 'VmConnectionInfo';
  isConnected: Scalars['Boolean']['output'];
  /** Keep-alive heartbeat metrics */
  keepAlive?: Maybe<KeepAliveMetrics>;
  lastMessageTime: Scalars['String']['output'];
  reconnectAttempts: Scalars['Float']['output'];
  vmId: Scalars['String']['output'];
};

export type VmDiagnostics = {
  __typename?: 'VmDiagnostics';
  connectionStats?: Maybe<VmConnectionInfo>;
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
