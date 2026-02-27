import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Phase } from '../../types/models';
import { getStatusColor } from '../../styles/theme';
import { Card } from '../shared/Card';

interface ProgressChartProps {
  phases: Phase[];
}

export function ProgressChart({ phases }: ProgressChartProps) {
  const statusCounts = phases.reduce((acc, phase) => {
    acc[phase.status] = (acc[phase.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: count,
    color: getStatusColor(status),
  }));

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Progreso por Estado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
