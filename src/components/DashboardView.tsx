import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useStore } from '../state/store';
import { MainLayout } from './layout/MainLayout';
import { PhaseCard } from './PhaseCard';
import { ProgressChart } from './dashboard/ProgressChart';
import { TimelineChart } from './dashboard/TimelineChart';
import { MetricCard } from './MetricCard';

export function DashboardView() {
  const { parsedSpec, activePhase } = useStore();
  const phaseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (activePhase && phaseRefs.current[activePhase]) {
      phaseRefs.current[activePhase]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [activePhase]);

  const handlePhaseSelect = (phaseId: string) => {
    if (phaseRefs.current[phaseId]) {
      phaseRefs.current[phaseId]?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  if (!parsedSpec) {
    return (
      <MainLayout>
        <div className="text-center text-slate-500">No data loaded</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onPhaseSelect={handlePhaseSelect}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-8"
      >
        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProgressChart phases={parsedSpec.phases} />
          <TimelineChart phases={parsedSpec.phases} />
        </section>

        {/* Phases Section */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Fases del Proyecto</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {parsedSpec.phases.map((phase) => (
              <motion.div
                key={phase.id}
                ref={(el) => (phaseRefs.current[phase.id] = el)}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <PhaseCard 
                  phase={phase} 
                  expanded={activePhase === phase.id}
                />
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Success Metrics */}
        {parsedSpec.successMetrics.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Métricas de Éxito</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parsedSpec.successMetrics.map((metric) => (
                <MetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>
        )}

        {/* Decision Framework */}
        {parsedSpec.decisionFramework && (
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Marco de Decisión</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-green-900 mb-4">Áreas Flexibles</h3>
                {parsedSpec.decisionFramework.flexible.map((area, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <h4 className="font-semibold text-green-800">{area.title}</h4>
                    <p className="text-sm text-green-700 mt-1">{area.description}</p>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-red-900 mb-4">No Negociable</h3>
                {parsedSpec.decisionFramework.nonNegotiable.map((area, i) => (
                  <div key={i} className="mb-4 last:mb-0">
                    <h4 className="font-semibold text-red-800">{area.title}</h4>
                    <p className="text-sm text-red-700 mt-1">{area.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </motion.div>
    </MainLayout>
  );
}
