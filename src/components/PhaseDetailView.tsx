import { useStore } from '../state/store';
import { CapabilityList } from '../components/CapabilityList';

export function PhaseDetailView() {
  const { parsedSpec, activePhase, setActivePhase, getActivePhase } = useStore();
  const phase = getActivePhase();

  if (!phase || !parsedSpec) {
    return <div className="p-8 text-center">No phase selected</div>;
  }

  const capabilities = parsedSpec.capabilities.filter(c => c.phaseId === phase.id);
  const phaseIndex = parsedSpec.phases.findIndex(p => p.id === phase.id);
  const hasPrev = phaseIndex > 0;
  const hasNext = phaseIndex < parsedSpec.phases.length - 1;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{phase.name}</h1>
            <p className="text-gray-600 mt-2">{phase.description}</p>
            <div className="mt-4 flex gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">
                {phase.status.replace('_', ' ').toUpperCase()}
              </span>
              {phase.estimatedDuration && (
                <span className="text-gray-600">Duration: {phase.estimatedDuration}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Capabilities</h2>
        <div className="bg-white rounded-lg shadow">
          <CapabilityList capabilities={capabilities} />
        </div>
      </section>

      {/* Dependencies */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Dependencies</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          {parsedSpec.dependencies.filter(d => 
            capabilities.some(c => c.id === d.sourceId || c.id === d.targetId)
          ).length > 0 ? (
            <ul className="space-y-2">
              {parsedSpec.dependencies
                .filter(d => capabilities.some(c => c.id === d.sourceId))
                .map((dep, i) => (
                  <li key={i} className="text-sm">
                    {dep.sourceId} → {dep.targetId} ({dep.type})
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">No dependencies</p>
          )}
        </div>
      </section>

      {/* Transition Criteria */}
      {phase.transitionCriteria.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Transition Criteria</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <ul className="list-disc list-inside space-y-2">
              {phase.transitionCriteria.map((criteria, i) => (
                <li key={i} className="text-sm">{criteria}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Architecture Notes */}
      {phase.architectureNotes && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Architecture Notes</h2>
          <div className="bg-white p-6 rounded-lg shadow prose max-w-none">
            <p className="whitespace-pre-wrap">{phase.architectureNotes}</p>
          </div>
        </section>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => hasPrev && setActivePhase(parsedSpec.phases[phaseIndex - 1].id)}
          disabled={!hasPrev}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          ← Previous Phase
        </button>
        <button
          onClick={() => hasNext && setActivePhase(parsedSpec.phases[phaseIndex + 1].id)}
          disabled={!hasNext}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next Phase →
        </button>
      </div>
    </div>
  );
}
