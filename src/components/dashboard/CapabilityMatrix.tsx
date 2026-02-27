import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Capability } from '../../types/models';
import { getStatusColor } from '../../styles/theme';
import { Card } from '../shared/Card';

interface CapabilityMatrixProps {
  capabilities: Capability[];
}

export function CapabilityMatrix({ capabilities }: CapabilityMatrixProps) {
  const phaseGroups = capabilities.reduce((acc, cap) => {
    if (!acc[cap.phaseId]) {
      acc[cap.phaseId] = { planned: 0, in_progress: 0, completed: 0, deferred: 0 };
    }
    acc[cap.phaseId][cap.status as keyof typeof acc[string]]++;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  const data = Object.entries(phaseGroups).map(([phaseId, statuses]) => ({
    phase: phaseId.replace('phase-', 'Fase '),
    ...statuses,
  }));

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Capacidades por Fase</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="phase" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="completed" stackId="a" fill={getStatusColor('completed')} />
          <Bar dataKey="in_progress" stackId="a" fill={getStatusColor('in_progress')} />
          <Bar dataKey="planned" stackId="a" fill={getStatusColor('not_started')} />
          <Bar dataKey="deferred" stackId="a" fill="#94A3B8" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
