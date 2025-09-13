/**
 * TypeScript types for the problem-focused VM health system
 */

export enum PriorityLevel {
  CRITICAL = 'CRITICAL',
  IMPORTANT = 'IMPORTANT',
  INFORMATIONAL = 'INFORMATIONAL'
}

export enum ProblemCategory {
  STORAGE = 'STORAGE',
  SECURITY = 'SECURITY',
  PERFORMANCE = 'PERFORMANCE',
  UPDATES = 'UPDATES',
  APPLICATIONS = 'APPLICATIONS',
  FIREWALL = 'FIREWALL',
  NETWORK = 'NETWORK',
  SYSTEM = 'SYSTEM'
}

export enum ProblemStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
  SCHEDULED = 'SCHEDULED'
}

export enum SolutionStepType {
  MANUAL = 'MANUAL',
  AUTOMATED = 'AUTOMATED',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  VERIFICATION = 'VERIFICATION'
}

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT'
}

export interface BusinessImpact {
  description: string;
  affectedUsers?: number;
  productivityImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  securityRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  systemStabilityRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  estimatedDowntime?: string;
}

export interface SolutionStep {
  id: string;
  title: string;
  description: string;
  type: SolutionStepType;
  estimatedTime: number; // in minutes
  isCompleted: boolean;
  isOptional: boolean;
  warningMessage?: string;
  externalUrl?: string;
  automatedAction?: string;
  prerequisites?: string[];
  expectedResult?: string;
}

export interface Solution {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  totalEstimatedTime: number; // in minutes
  steps: SolutionStep[];
  prerequisites: string[];
  warnings: string[];
  successCriteria: string[];
  rollbackSteps?: SolutionStep[];
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  priority: PriorityLevel;
  category: ProblemCategory;
  status: ProblemStatus;
  businessImpact: BusinessImpact;
  solutions: Solution[];
  detectedAt: Date;
  lastUpdated: Date;
  vmId: string;
  vmName: string;
  affectedServices?: string[];
  relatedProblems?: string[];
  autoResolvable: boolean;
  requiresRestart: boolean;
  estimatedFixTime: number; // in minutes
  technicalDetails?: {
    sourceHealthCheck: string;
    rawData: any;
    metrics?: Record<string, any>;
  };
}

export interface ProblemSummary {
  totalProblems: number;
  criticalCount: number;
  importantCount: number;
  informationalCount: number;
  resolvedToday: number;
  avgResolutionTime: number; // in minutes
  mostCommonCategory: ProblemCategory;
}

export interface ProblemFilter {
  priority?: PriorityLevel[];
  category?: ProblemCategory[];
  status?: ProblemStatus[];
  vmId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ScoredProblem extends Problem {
  priorityScore: number;
}

export interface ProblemTransformationConfig {
  language: 'es' | 'en';
  technicalLevel: 'basic' | 'intermediate' | 'advanced';
  includeAutomatedSolutions: boolean;
  prioritizeBusinessImpact: boolean;
}
