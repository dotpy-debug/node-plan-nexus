import { create } from 'zustand';
import { Flow, FlowNode, FlowEdge, FlowRun } from '@/types';

interface FlowStore {
  flows: Flow[];
  selectedFlow: Flow | null;
  flowRuns: FlowRun[];
  isCanvasOpen: boolean;
  
  // Actions
  setFlows: (flows: Flow[]) => void;
  addFlow: (flow: Flow) => void;
  updateFlow: (id: string, updates: Partial<Flow>) => void;
  deleteFlow: (id: string) => void;
  setSelectedFlow: (flow: Flow | null) => void;
  updateFlowGraph: (flowId: string, nodes: FlowNode[], edges: FlowEdge[]) => void;
  toggleFlowEnabled: (id: string) => void;
  setCanvasOpen: (open: boolean) => void;
  
  // Flow runs
  setFlowRuns: (runs: FlowRun[]) => void;
  addFlowRun: (run: FlowRun) => void;
  updateFlowRun: (id: string, updates: Partial<FlowRun>) => void;
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  flows: [],
  selectedFlow: null,
  flowRuns: [],
  isCanvasOpen: false,

  setFlows: (flows) => set({ flows }),
  
  addFlow: (flow) => set((state) => ({ 
    flows: [...state.flows, flow] 
  })),
  
  updateFlow: (id, updates) => set((state) => ({
    flows: state.flows.map(flow => 
      flow.id === id ? { ...flow, ...updates, updatedAt: new Date() } : flow
    )
  })),
  
  deleteFlow: (id) => set((state) => ({
    flows: state.flows.filter(flow => flow.id !== id),
    selectedFlow: state.selectedFlow?.id === id ? null : state.selectedFlow
  })),
  
  setSelectedFlow: (flow) => set({ selectedFlow: flow }),
  
  updateFlowGraph: (flowId, nodes, edges) => set((state) => ({
    flows: state.flows.map(flow => 
      flow.id === flowId 
        ? { ...flow, graph: { nodes, edges }, updatedAt: new Date() } 
        : flow
    ),
    selectedFlow: state.selectedFlow?.id === flowId 
      ? { ...state.selectedFlow, graph: { nodes, edges }, updatedAt: new Date() }
      : state.selectedFlow
  })),
  
  toggleFlowEnabled: (id) => set((state) => ({
    flows: state.flows.map(flow => 
      flow.id === id ? { ...flow, enabled: !flow.enabled } : flow
    )
  })),
  
  setCanvasOpen: (open) => set({ isCanvasOpen: open }),
  
  setFlowRuns: (runs) => set({ flowRuns: runs }),
  
  addFlowRun: (run) => set((state) => ({ 
    flowRuns: [...state.flowRuns, run] 
  })),
  
  updateFlowRun: (id, updates) => set((state) => ({
    flowRuns: state.flowRuns.map(run => 
      run.id === id ? { ...run, ...updates } : run
    )
  }))
}));