import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { Capability } from '../../types/models';
import { Badge } from '../shared/Badge';

interface CapabilityModalProps {
  capability: Capability | null;
  onClose: () => void;
}

export function CapabilityModal({ capability, onClose }: CapabilityModalProps) {
  if (!capability) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{capability.name}</h2>
              <div className="flex gap-2 mt-3">
                <Badge label={capability.priority} type="priority" value={capability.priority} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Descripción</h3>
              <p className="text-slate-700">{capability.description}</p>
            </div>

            {capability.deliverables.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Entregables</h3>
                <ul className="space-y-2">
                  {capability.deliverables.map((deliverable, i) => (
                    <li key={i} className="flex items-start text-slate-700">
                      <span className="text-blue-500 mr-2">•</span>
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {capability.dependencies.length > 0 && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Dependencias</h3>
                <div className="flex flex-wrap gap-2">
                  {capability.dependencies.map((dep) => (
                    <span
                      key={dep}
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                    >
                      {dep}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
