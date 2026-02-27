export const theme = {
  colors: {
    status: {
      notStarted: '#94A3B8',
      inProgress: '#3B82F6',
      completed: '#10B981',
      blocked: '#EF4444',
      atRisk: '#F59E0B',
    },
    priority: {
      critical: '#DC2626',
      high: '#EA580C',
      medium: '#CA8A04',
      low: '#65A30D',
    },
    ui: {
      background: '#F8FAFC',
      card: '#FFFFFF',
      border: '#E2E8F0',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
    },
  },
  animation: {
    micro: '150ms',
    transition: '250ms',
    page: '400ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const getStatusColor = (status: string) => {
  const map: Record<string, string> = {
    not_started: theme.colors.status.notStarted,
    in_progress: theme.colors.status.inProgress,
    completed: theme.colors.status.completed,
    blocked: theme.colors.status.blocked,
    at_risk: theme.colors.status.atRisk,
  };
  return map[status] || theme.colors.status.notStarted;
};

export const getPriorityColor = (priority: string) => {
  const map: Record<string, string> = {
    critical: theme.colors.priority.critical,
    high: theme.colors.priority.high,
    medium: theme.colors.priority.medium,
    low: theme.colors.priority.low,
  };
  return map[priority] || theme.colors.priority.low;
};
