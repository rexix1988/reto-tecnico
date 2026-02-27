import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Phase } from '../../types/models';
import { getStatusColor } from '../../styles/theme';
import { Card } from '../shared/Card';
import { format, addMonths } from 'date-fns';

interface TimelineChartProps {
  phases: Phase[];
}

export function TimelineChart({ phases }: TimelineChartProps) {
  const timelineData = useMemo(() => {
    let currentDate = new Date();
    
    return phases.map((phase) => {
      const durationMatch = phase.estimatedDuration.match(/(\d+)/);
      const months = durationMatch ? parseInt(durationMatch[0]) : 3;
      
      const startDate = new Date(currentDate);
      const endDate = addMonths(currentDate, months);
      
      currentDate = endDate;
      
      return {
        name: `Fase ${phase.order}`,
        start: startDate.getTime(),
        end: endDate.getTime(),
        duration: months,
        color: getStatusColor(phase.status),
        phaseName: phase.name,
      };
    });
  }, [phases]);

  const minDate = timelineData[0]?.start || Date.now();
  const maxDate = timelineData[timelineData.length - 1]?.end || Date.now();

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Timeline de Implementación</h3>
      <div className="text-sm text-slate-600 mb-4">
        Inicio: {format(minDate, 'MMM yyyy')} - Fin estimado: {format(maxDate, 'MMM yyyy')}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={timelineData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            domain={[minDate, maxDate]}
            tickFormatter={(value) => format(value, 'MMM yy')}
          />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip 
            content={({ payload }) => {
              if (!payload?.[0]) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                  <div className="font-semibold">{data.phaseName}</div>
                  <div className="text-sm text-slate-600">
                    {format(data.start, 'dd MMM yyyy')} - {format(data.end, 'dd MMM yyyy')}
                  </div>
                  <div className="text-sm font-semibold mt-1">{data.duration} meses</div>
                </div>
              );
            }}
          />
          <Bar dataKey="duration" fill="#3B82F6">
            {timelineData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
