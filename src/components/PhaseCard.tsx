import { Phase } from '../types/models';

interface PhaseCardProps {
  phase: Phase;
  onClick?: () => void;
}

export function PhaseCard({ phase, onClick }: PhaseCardProps) {
  const statusColors = {
    not_started: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-200 text-blue-700',
    completed: 'bg-green-200 text-green-700',
    blocked: 'bg-red-200 text-red-700'
  };

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-lg transition-shadow ${statusColors[phase.status]}`}
    >
      <h3 className="font-bold text-lg">{phase.name}</h3>
      <p className="text-sm mt-1">{phase.status.replace('_', ' ').toUpperCase()}</p>
      {phase.estimatedDuration && (
        <p className="text-xs mt-2">Duration: {phase.estimatedDuration}</p>
      )}
    </div>
  );
}
