import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Phase, Capability } from '../types/models';
import { Badge } from './shared/Badge';
import { ProgressBar } from './shared/ProgressBar';
import { CapabilityModal } from './shared/CapabilityModal';
import { getStatusColor } from '../styles/theme';
import { useStore } from '../state/store';

interface PhaseCardProps {
  phase: Phase;
  onClick?: () => void;
  expanded?: boolean;
}

export function PhaseCard({ phase, onClick, expanded: externalExpanded }: PhaseCardProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [selectedCapability, setSelectedCapability] = useState<Capability | null>(null);
  const { parsedSpec, setActivePhase } = useStore();
  
  const expanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;
  const capabilities = parsedSpec?.capabilities.filter(c => c.phaseId === phase.id) || [];
  const completedCaps = capabilities.filter(c => c.status === 'completed').length;
  const progress = capabilities.length > 0 ? (completedCaps / capabilities.length) * 100 : 0;

  const handleClick = () => {
    if (externalExpanded === undefined) {
      setInternalExpanded(!internalExpanded);
    } else {
      // If controlled externally, toggle via setActivePhase
      setActivePhase(expanded ? null : phase.id);
    }
    onClick?.();
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer"
        style={{
          background: `linear-gradient(135deg, ${getStatusColor(phase.status)}15 0%, ${getStatusColor(phase.status)}05 100%)`,
        }}
        whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
        transition={{ duration: 0.15 }}
      >
        <div className="p-6" onClick={handleClick}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-sm text-slate-500 font-semibold uppercase tracking-wide mb-1">
                Fase {phase.order}
              </div>
              <h3 className="text-xl font-bold text-slate-900">{phase.name}</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge label={phase.status.replace('_', ' ')} type="status" value={phase.status} />
              {expanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </div>
          </div>

          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{phase.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Progreso</span>
              <span className="font-semibold">{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} color={getStatusColor(phase.status)} />
            
            <div className="flex justify-between text-xs text-slate-500 mt-3">
              <span>{capabilities.length} capacidades</span>
              <span>{phase.estimatedDuration}</span>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-slate-200"
            >
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-2">Capacidades</h4>
                  <motion.div
                    className="space-y-2"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      visible: { transition: { staggerChildren: 0.05 } },
                    }}
                  >
                    {capabilities.map((cap) => (
                      <motion.div
                        key={cap.id}
                        variants={{
                          hidden: { opacity: 0, x: -10 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCapability(cap);
                        }}
                      >
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{cap.name}</div>
                          <div className="text-xs text-slate-500 mt-1 line-clamp-1">{cap.description}</div>
                        </div>
                        <div className="ml-4">
                          <Badge label={cap.priority} type="priority" value={cap.priority} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {phase.transitionCriteria.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-sm text-slate-700 mb-2">Criterios de Transición</h4>
                    <ul className="space-y-1">
                      {phase.transitionCriteria.map((criteria, i) => (
                        <li key={i} className="text-sm text-slate-600 flex items-start">
                          <span className="text-green-500 mr-2">✓</span>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CapabilityModal 
        capability={selectedCapability} 
        onClose={() => setSelectedCapability(null)} 
      />
    </>
  );
}
