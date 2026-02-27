import { useEffect } from 'react';
import { useStore } from './state/store';
import { DashboardView } from './components/DashboardView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

function App() {
  const { loadSpecs, loading, error } = useStore();

  useEffect(() => {
    loadSpecs('/roadmap.md').catch(err => console.error('Load error:', err));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-xl text-slate-600">Cargando...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-red-600 text-center">
          <div className="text-xl font-bold mb-2">Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <DashboardView />
      <Toaster position="top-right" />
    </ErrorBoundary>
  );
}

export default App;
