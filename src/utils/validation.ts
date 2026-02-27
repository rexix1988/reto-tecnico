import { ParsedSpec, Phase, Capability, PhaseStatus, CapabilityStatus } from '../types/models';

export interface ValidationError {
  type: string;
  message: string;
  entities?: string[];
}

export function validateReferentialIntegrity(spec: ParsedSpec): ValidationError[] {
  const errors: ValidationError[] = [];
  const phaseIds = new Set(spec.phases.map(p => p.id));
  const capabilityIds = new Set(spec.capabilities.map(c => c.id));

  // Validate capability phaseId references
  spec.capabilities.forEach(cap => {
    if (!phaseIds.has(cap.phaseId)) {
      errors.push({
        type: 'invalid_phase_reference',
        message: `Capability ${cap.id} references non-existent phase ${cap.phaseId}`,
        entities: [cap.id, cap.phaseId]
      });
    }
  });

  // Validate dependency references
  spec.dependencies.forEach(dep => {
    if (!capabilityIds.has(dep.sourceId)) {
      errors.push({
        type: 'invalid_dependency_source',
        message: `Dependency references non-existent source ${dep.sourceId}`,
        entities: [dep.sourceId]
      });
    }
    if (!capabilityIds.has(dep.targetId)) {
      errors.push({
        type: 'invalid_dependency_target',
        message: `Dependency references non-existent target ${dep.targetId}`,
        entities: [dep.targetId]
      });
    }
  });

  return errors;
}

export function detectCircularDependencies(spec: ParsedSpec): ValidationError[] {
  const errors: ValidationError[] = [];
  const graph = new Map<string, string[]>();

  // Build adjacency list
  spec.dependencies.forEach(dep => {
    if (!graph.has(dep.sourceId)) {
      graph.set(dep.sourceId, []);
    }
    graph.get(dep.sourceId)!.push(dep.targetId);
  });

  // DFS to detect cycles
  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(node: string, path: string[]): boolean {
    visited.add(node);
    recStack.add(node);
    path.push(node);

    const neighbors = graph.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor, [...path])) return true;
      } else if (recStack.has(neighbor)) {
        errors.push({
          type: 'circular_dependency',
          message: `Circular dependency detected: ${[...path, neighbor].join(' -> ')}`,
          entities: [...path, neighbor]
        });
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      hasCycle(node, []);
    }
  }

  return errors;
}

export function validatePhaseSequence(phases: Phase[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const orders = phases.map(p => p.order).sort((a, b) => a - b);

  for (let i = 0; i < orders.length; i++) {
    if (orders[i] !== i + 1) {
      errors.push({
        type: 'invalid_phase_sequence',
        message: `Phase sequence has gaps or duplicates. Expected ${i + 1}, found ${orders[i]}`,
        entities: phases.filter(p => p.order === orders[i]).map(p => p.id)
      });
      break;
    }
  }

  return errors;
}

export function validateTransitionCriteria(phases: Phase[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const maxOrder = Math.max(...phases.map(p => p.order));

  phases.forEach(phase => {
    if (phase.order < maxOrder && phase.transitionCriteria.length === 0) {
      errors.push({
        type: 'missing_transition_criteria',
        message: `Phase ${phase.id} is not final but has no transition criteria`,
        entities: [phase.id]
      });
    }
  });

  return errors;
}

export function validatePhaseCompletion(spec: ParsedSpec): ValidationError[] {
  const errors: ValidationError[] = [];

  spec.phases.forEach(phase => {
    if (phase.status === PhaseStatus.COMPLETED) {
      const criticalCaps = spec.capabilities.filter(
        c => c.phaseId === phase.id && c.priority === 'critical'
      );

      const incompleteCritical = criticalCaps.filter(
        c => c.status !== CapabilityStatus.COMPLETED
      );

      if (incompleteCritical.length > 0) {
        errors.push({
          type: 'incomplete_critical_capabilities',
          message: `Phase ${phase.id} is marked complete but has incomplete critical capabilities`,
          entities: [phase.id, ...incompleteCritical.map(c => c.id)]
        });
      }
    }
  });

  return errors;
}

export function validateSpec(spec: ParsedSpec): ValidationError[] {
  const errors: ValidationError[] = [];

  errors.push(...validateReferentialIntegrity(spec));
  errors.push(...detectCircularDependencies(spec));
  errors.push(...validatePhaseSequence(spec.phases));
  errors.push(...validateTransitionCriteria(spec.phases));
  errors.push(...validatePhaseCompletion(spec));

  return errors;
}
