import clsx from 'clsx';
import { getStatusColor, getPriorityColor } from '../../styles/theme';

interface BadgeProps {
  label: string;
  type: 'status' | 'priority';
  value: string;
}

export function Badge({ label, type, value }: BadgeProps) {
  const color = type === 'status' ? getStatusColor(value) : getPriorityColor(value);
  
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide',
        'text-white'
      )}
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  );
}
