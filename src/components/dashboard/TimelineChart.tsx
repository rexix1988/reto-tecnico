import { useMemo } from 'react';
import { format, addMonths } from 'date-fns';
import { Phase } from '../../types/models';
import { getStatusColor } from '../../styles/theme';
import { Card } from '../shared/Card';

interface TimelineChartProps {
  phases: Phase[];
}

export function TimelineChart({ phases }: TimelineChartProps) {
  const timelineData = useMemo(() => {
    const startDate = new Date();
    let currentDate = new Date(startDate);
    
    return phases.map((phase, index) => {
      const durationMatch = phase.estimatedDuration.match(/(\d+)/);
      const months = durationMatch ? parseInt(durationMatch[0]) : 3;
      
      const phaseStart = new Date(currentDate);
      const phaseEnd = addMonths(currentDate, months);
      
      currentDate = phaseEnd;
      
      return {
        name: phase.name,
        order: phase.order,
        start: phaseStart,
        end: phaseEnd,
        duration: months,
        color: getStatusColor(phase.status),
        isLast: index === phases.length - 1,
      };
    });
  }, [phases]);

  const totalMonths = timelineData.reduce((sum, phase) => sum + phase.duration, 0);

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Timeline de Implementación</h3>
      <div className="text-sm text-slate-600 mb-6">
        Inicio: {format(timelineData[0]?.start || new Date(), 'dd MMM yyyy')} - 
        Fin estimado: {format(timelineData[timelineData.length - 1]?.end || new Date(), 'dd MMM yyyy')}
        <span className="ml-2 font-semibold">({totalMonths} meses total)</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-8 left-0 right-0 h-1 bg-slate-200" />

        {/* Phase markers */}
        <div className="relative flex justify-between items-start pt-4">
          {timelineData.map((phase, index) => {
            const widthPercent = (phase.duration / totalMonths) * 100;
            
            return (
              <div 
                key={phase.order}
                className="relative flex flex-col items-center"
                style={{ width: `${widthPercent}%` }}
              >
                {/* Marker dot */}
                <div 
                  className="w-4 h-4 rounded-full border-4 border-white shadow-lg z-10"
                  style={{ backgroundColor: phase.color }}
                />
                
                {/* Phase info */}
                <div className="mt-4 text-center px-2">
                  <div className="text-xs font-semibold text-slate-900 mb-1">
                    Fase {phase.order}
                  </div>
                  <div className="text-xs text-slate-600 mb-2 line-clamp-2">
                    {phase.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(phase.start, 'MMM yyyy')}
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    {phase.duration} {phase.duration === 1 ? 'mes' : 'meses'}
                  </div>
                </div>

                {/* Connecting line segment */}
                {!phase.isLast && (
                  <div 
                    className="absolute top-2 left-1/2 h-1"
                    style={{ 
                      width: '100%',
                      backgroundColor: phase.color,
                      opacity: 0.6
                    }}
                  />
                )}
              </div>
            );
          })}
          
          {/* End marker */}
          <div className="relative flex flex-col items-center" style={{ width: '0' }}>
            <div className="w-4 h-4 rounded-full bg-slate-400 border-4 border-white shadow-lg z-10" />
            <div className="mt-4 text-center">
              <div className="text-xs text-slate-500 whitespace-nowrap">
                {format(timelineData[timelineData.length - 1]?.end || new Date(), 'MMM yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
