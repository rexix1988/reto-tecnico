import { SuccessMetric } from '../types/models';

interface MetricCardProps {
  metric: SuccessMetric;
}

export function MetricCard({ metric }: MetricCardProps) {
  const progress = metric.current && metric.target 
    ? (parseFloat(metric.current) / parseFloat(metric.target)) * 100 
    : 0;

  return (
    <div className="p-4 bg-white rounded-lg shadow border">
      <h4 className="font-semibold text-lg">{metric.name}</h4>
      <p className="text-sm text-gray-600 mt-1">{metric.description}</p>
      <div className="mt-3">
        <div className="flex justify-between text-sm mb-1">
          <span>Current: {metric.current || 'N/A'}</span>
          <span>Target: {metric.target}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {metric.category} • {metric.frequency}
      </p>
    </div>
  );
}
