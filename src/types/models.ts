export enum PhaseStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export enum Priority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum CapabilityStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  BLOCKED = 'blocked'
}

export enum DependencyType {
  REQUIRES = 'requires',
  BLOCKS = 'blocks',
  RELATES_TO = 'relates_to'
}

export enum MetricCategory {
  TECHNICAL = 'technical',
  BUSINESS = 'business',
  OPERATIONAL = 'operational',
  QUALITY = 'quality'
}

export enum MeasurementFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly'
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  order: number;
  status: PhaseStatus;
  estimatedDuration: string;
  transitionCriteria: string[];
  externalDependencies: string[];
  architectureNotes?: string;
}

export interface Capability {
  id: string;
  phaseId: string;
  name: string;
  description: string;
  priority: Priority;
  status: CapabilityStatus;
  dependencies: string[];
  deliverables: string[];
}

export interface Dependency {
  sourceId: string;
  targetId: string;
  type: DependencyType;
  description?: string;
}

export interface DecisionArea {
  title: string;
  description: string;
  rationale?: string;
}

export interface DecisionFramework {
  flexible: DecisionArea[];
  nonNegotiable: DecisionArea[];
  escalationCriteria: string[];
  decisionMakers: Stakeholder[];
}

export interface Stakeholder {
  name: string;
  role: string;
  responsibilities: string[];
}

export interface SuccessMetric {
  id: string;
  name: string;
  description: string;
  category: MetricCategory;
  target: string;
  current?: string;
  measurementMethod: string;
  frequency: MeasurementFrequency;
}

export interface PeopleAction {
  stakeholder: string;
  action: string;
  timing: string;
  expectedOutcome: string;
}

export interface SpecMetadata {
  title: string;
  version: string;
  lastUpdated: string;
  author?: string;
  description?: string;
}

export interface ParsedSpec {
  metadata: SpecMetadata;
  phases: Phase[];
  capabilities: Capability[];
  dependencies: Dependency[];
  decisionFramework?: DecisionFramework;
  successMetrics: SuccessMetric[];
  peopleActions: PeopleAction[];
}
