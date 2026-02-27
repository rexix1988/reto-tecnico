import * as ReactWindow from 'react-window';
import { Capability } from '../types/models';

interface CapabilityListProps {
  capabilities: Capability[];
}

export function CapabilityList({ capabilities }: CapabilityListProps) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const cap = capabilities[index];
    const priorityColors = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-gray-600'
    };

    return (
      <div style={style} className="px-4 py-2 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold">{cap.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{cap.description}</p>
          </div>
          <div className="ml-4 text-right">
            <span className={`text-xs font-bold ${priorityColors[cap.priority]}`}>
              {cap.priority.toUpperCase()}
            </span>
            <p className="text-xs text-gray-500 mt-1">{cap.status.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    );
  };

  // Simple list without virtualization for now
  return (
    <div>
      {capabilities.map((cap, index) => (
        <Row key={cap.id} index={index} style={{}} />
      ))}
    </div>
  );
}
