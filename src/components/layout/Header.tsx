import { useStore } from '../../state/store';
import { FiRefreshCw } from 'react-icons/fi';

export function Header() {
  const { parsedSpec, loadSpecs } = useStore();

  const totalPhases = parsedSpec?.phases.length || 0;
  const completedPhases = parsedSpec?.phases.filter(p => p.status === 'completed').length || 0;
  const completionPercentage = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;
  const totalCapabilities = parsedSpec?.capabilities.length || 0;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <div className="text-2xl font-bold text-slate-900">{parsedSpec?.metadata.title}</div>
            <div className="text-sm text-slate-500">v{parsedSpec?.metadata.version}</div>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalPhases}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Fases</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completionPercentage}%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Completado</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalCapabilities}</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">Capacidades</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => loadSpecs('/roadmap.md')}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          title="Refresh"
        >
          <FiRefreshCw size={20} />
        </button>
      </div>
    </header>
  );
}
