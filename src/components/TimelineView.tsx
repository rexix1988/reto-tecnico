import { Phase } from '../types/models';
import { PhaseCard } from './PhaseCard';

interface TimelineViewProps {
  phases: Phase[];
  onPhaseClick?: (phaseId: string) => void;
}

export function TimelineView({ phases, onPhaseClick }: TimelineViewProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {phases.map(phase => (
        <div key={phase.id} className="min-w-[250px]">
          <PhaseCard 
            phase={phase} 
            onClick={() => onPhaseClick?.(phase.id)}
          />
        </div>
      ))}
    </div>
  );
}
