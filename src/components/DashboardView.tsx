import { useStore } from '../state/store';
import { TimelineView } from '../components/TimelineView';
import { MetricCard } from '../components/MetricCard';

export function DashboardView() {
  const { parsedSpec, setActivePhase } = useStore();

  if (!parsedSpec) {
    return <div className="p-8 text-center">No data loaded</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Executive Summary */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold">{parsedSpec.metadata.title}</h3>
          <p className="text-gray-600 mt-2">{parsedSpec.metadata.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>Version: {parsedSpec.metadata.version}</span>
            <span>Last Updated: {new Date(parsedSpec.metadata.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>
      </section>

      {/* Phase Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Phases</h2>
        <TimelineView 
          phases={parsedSpec.phases} 
          onPhaseClick={setActivePhase}
        />
      </section>

      {/* Success Metrics */}
      {parsedSpec.successMetrics.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Success Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parsedSpec.successMetrics.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </section>
      )}

      {/* Decision Framework */}
      {parsedSpec.decisionFramework && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Decision Framework</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Flexible Areas</h3>
              {parsedSpec.decisionFramework.flexible.map((area, i) => (
                <div key={i} className="mb-3">
                  <h4 className="font-medium">{area.title}</h4>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
              ))}
            </div>
            <div className="bg-red-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Non-Negotiable</h3>
              {parsedSpec.decisionFramework.nonNegotiable.map((area, i) => (
                <div key={i} className="mb-3">
                  <h4 className="font-medium">{area.title}</h4>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Key Actions */}
      {parsedSpec.peopleActions.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Key Actions</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Stakeholder</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Action</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Timing</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Expected Outcome</th>
                </tr>
              </thead>
              <tbody>
                {parsedSpec.peopleActions.map((action, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-3 text-sm">{action.stakeholder}</td>
                    <td className="px-4 py-3 text-sm">{action.action}</td>
                    <td className="px-4 py-3 text-sm">{action.timing}</td>
                    <td className="px-4 py-3 text-sm">{action.expectedOutcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
