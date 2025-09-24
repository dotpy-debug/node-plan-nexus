import React from 'react';
import { FlowCanvas } from '@/components/flow/FlowCanvas';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useFlowStore } from '@/store/flowStore';
import { Plus, Play, Pause, Settings, MoreHorizontal } from 'lucide-react';
import { Flow } from '@/types';

export const Flows: React.FC = () => {
  const { flows, selectedFlow, setSelectedFlow, isCanvasOpen, setCanvasOpen } = useFlowStore();

  const handleFlowSelect = (flow: Flow) => {
    setSelectedFlow(flow);
    setCanvasOpen(true);
  };

  const handleNewFlow = () => {
    // TODO: Create new flow
    setCanvasOpen(true);
  };

  if (isCanvasOpen) {
    return <FlowCanvas />;
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-canvas min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Flows
          </h1>
          <p className="text-muted-foreground">
            Automate your workflows with visual node-based flows
          </p>
        </div>
        
        <Button onClick={handleNewFlow} className="bg-gradient-primary hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          New Flow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flows.map((flow) => (
          <FlowCard 
            key={flow.id} 
            flow={flow} 
            onSelect={() => handleFlowSelect(flow)} 
          />
        ))}
        
        {flows.length === 0 && (
          <Card className="col-span-full p-12 text-center bg-card/30 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No flows yet</h3>
                <p className="text-muted-foreground">
                  Create your first automation flow to get started
                </p>
              </div>
              <Button onClick={handleNewFlow} className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Create First Flow
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

interface FlowCardProps {
  flow: Flow;
  onSelect: () => void;
}

const FlowCard: React.FC<FlowCardProps> = ({ flow, onSelect }) => {
  return (
    <Card 
      className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300 bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">{flow.name}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={flow.enabled ? "default" : "secondary"}>
              {flow.enabled ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Nodes</span>
          <span className="font-medium">{flow.graph.nodes.length}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Last updated</span>
          <span className="font-medium">
            {flow.updatedAt.toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button size="sm" variant="outline" className="flex-1">
          <Settings className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button size="sm" variant="outline">
          {flow.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default Flows;