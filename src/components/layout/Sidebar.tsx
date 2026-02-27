import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { useStore } from '../../state/store';
import clsx from 'clsx';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onPhaseSelect?: (phaseId: string) => void;
}

export function Sidebar({ collapsed, onToggle, onPhaseSelect }: SidebarProps) {
  const { parsedSpec, activePhase, setActivePhase } = useStore();

  const handlePhaseClick = (phaseId: string) => {
    setActivePhase(phaseId);
    onPhaseSelect?.(phaseId);
  };

  return (
    <motion.aside
      className={clsx(
        'bg-white border-r border-slate-200 flex flex-col',
        'transition-all duration-250'
      )}
      initial={false}
      animate={{ width: collapsed ? 64 : 256 }}
    >
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        {!collapsed && <h2 className="font-bold text-lg">Roadmap</h2>}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {parsedSpec?.phases.map((phase) => (
          <button
            key={phase.id}
            onClick={() => handlePhaseClick(phase.id)}
            className={clsx(
              'w-full text-left p-3 rounded-lg mb-1 transition-colors',
              activePhase === phase.id
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'hover:bg-slate-100 text-slate-700'
            )}
            title={collapsed ? phase.name : undefined}
          >
            {collapsed ? (
              <span className="text-sm font-bold">{phase.order}</span>
            ) : (
              <div>
                <div className="text-sm font-semibold">{phase.name}</div>
                <div className="text-xs text-slate-500 mt-1">Fase {phase.order}</div>
              </div>
            )}
          </button>
        ))}
      </nav>
    </motion.aside>
  );
}
