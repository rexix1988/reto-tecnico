import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { ParsedSpec, Phase } from '../types/models';
import { SpecParser } from '../parsers/SpecParser';

interface Filters {
  phaseId?: string;
  status?: string;
  priority?: string;
}

interface AppState {
  parsedSpec: ParsedSpec | null;
  activePhase: string | null;
  filters: Filters;
  loading: boolean;
  error: string | null;
  originalSpec: ParsedSpec | null;
}

interface AppActions {
  loadSpecs: (filePath: string) => Promise<void>;
  setActivePhase: (phaseId: string | null) => void;
  applyFilters: (filters: Filters) => void;
  clearFilters: () => void;
  getPhases: () => Phase[];
  getPhaseById: (id: string) => Phase | undefined;
  getActivePhase: () => Phase | undefined;
}

type StoreState = AppState & AppActions;

export const useStore = create<StoreState>()(
  subscribeWithSelector((set, get) => ({
    // State
    parsedSpec: null,
    activePhase: null,
    filters: {},
    loading: false,
    error: null,
    originalSpec: null,

    // Actions
    loadSpecs: async (filePath: string) => {
      set({ loading: true, error: null });
      try {
        const parser = new SpecParser();
        const spec = await parser.parseSpecFile(filePath);
        set({ 
          parsedSpec: spec, 
          originalSpec: spec,
          loading: false,
          activePhase: spec.phases[0]?.id || null
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Unknown error',
          loading: false 
        });
      }
    },

    setActivePhase: (phaseId: string | null) => {
      set({ activePhase: phaseId });
    },

    applyFilters: (filters: Filters) => {
      const { originalSpec } = get();
      if (!originalSpec) return;

      let filteredSpec = { ...originalSpec };

      if (filters.phaseId) {
        filteredSpec.capabilities = originalSpec.capabilities.filter(
          c => c.phaseId === filters.phaseId
        );
      }

      if (filters.status) {
        filteredSpec.capabilities = filteredSpec.capabilities.filter(
          c => c.status === filters.status
        );
      }

      if (filters.priority) {
        filteredSpec.capabilities = filteredSpec.capabilities.filter(
          c => c.priority === filters.priority
        );
      }

      set({ parsedSpec: filteredSpec, filters });
    },

    clearFilters: () => {
      const { originalSpec } = get();
      set({ parsedSpec: originalSpec, filters: {} });
    },

    getPhases: () => {
      return get().parsedSpec?.phases || [];
    },

    getPhaseById: (id: string) => {
      return get().parsedSpec?.phases.find(p => p.id === id);
    },

    getActivePhase: () => {
      const { activePhase, parsedSpec } = get();
      if (!activePhase || !parsedSpec) return undefined;
      return parsedSpec.phases.find(p => p.id === activePhase);
    }
  }))
);

// Subscription helper
export function subscribeToState<T>(
  selector: (state: StoreState) => T,
  callback: (value: T) => void
): () => void {
  return useStore.subscribe(selector, callback, { fireImmediately: false });
}
