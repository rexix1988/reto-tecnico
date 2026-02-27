import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useStore } from './state/store';
import { DashboardView } from './components/DashboardView';
import { PhaseDetailView } from './components/PhaseDetailView';

function App() {
  const { loadSpecs, loading, error } = useStore();
  const [view, setView] = useState<'dashboard' | 'phase'>('dashboard');

  useEffect(() => {
    console.log('Loading specs...');
    loadSpecs('/roadmap.md').catch(err => console.error('Load error:', err));
  }, [loadSpecs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex gap-4">
            <button
              onClick={() => setView('dashboard')}
              className={`px-4 py-2 rounded ${view === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setView('phase')}
              className={`px-4 py-2 rounded ${view === 'phase' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              Phase Details
            </button>
          </div>
        </div>
      </nav>
      
      {view === 'dashboard' ? <DashboardView /> : <PhaseDetailView />}
    </div>
  );
}

export default App;
