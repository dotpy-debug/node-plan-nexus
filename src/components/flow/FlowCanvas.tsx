import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlowNode as FlowNodeType } from '@/types';
import { Play, Save, Plus, Settings } from 'lucide-react';
import { useFlowStore } from '@/store/flowStore';
import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { ConditionNode } from './nodes/ConditionNode';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Trigger', 
      config: { type: 'task_created' },
      nodeType: 'task_created'
    },
  },
];

const initialEdges: Edge[] = [];

export const FlowCanvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { selectedFlow, updateFlowGraph } = useFlowStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 25,
      };

      const newNode: Node = {
        id: `${Date.now()}`,
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          config: {},
          nodeType: type
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const handleSave = () => {
    if (selectedFlow) {
      const flowNodes: FlowNodeType[] = nodes.map(node => ({
        id: node.id,
        type: node.type as any,
        position: node.position,
        data: node.data
      }));
      
      const flowEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      }));

      updateFlowGraph(selectedFlow.id, flowNodes, flowEdges);
    }
  };

  const handleTest = () => {
    console.log('Testing flow...', { nodes, edges });
    // TODO: Implement flow testing
  };

  return (
    <div className="h-full w-full flex flex-col bg-canvas">
      {/* Toolbar */}
      <Card className="border-b border-border/40 rounded-none bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleTest}>
              <Play className="h-4 w-4 mr-2" />
              Test Flow
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex-1 flex">
        {/* Node Panel */}
        <Card className="w-64 border-r border-border/40 rounded-none bg-card/30 backdrop-blur-sm">
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-4 text-foreground">Nodes</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Triggers</h4>
                <div className="space-y-1">
                  <NodeItem type="trigger" label="Task Created" />
                  <NodeItem type="trigger" label="Time Schedule" />
                  <NodeItem type="trigger" label="Webhook" />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Logic</h4>
                <div className="space-y-1">
                  <NodeItem type="condition" label="If/Else" />
                  <NodeItem type="condition" label="Switch" />
                </div>
              </div>
              
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Actions</h4>
                <div className="space-y-1">
                  <NodeItem type="action" label="Create Task" />
                  <NodeItem type="action" label="Update Task" />
                  <NodeItem type="action" label="Send Email" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Canvas */}
        <div className="flex-1" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            className="bg-canvas"
            fitView
          >
            <Controls className="bg-card border-border" />
            <MiniMap 
              className="bg-card border-border" 
              nodeColor="hsl(var(--primary))"
            />
            <Background 
              variant={BackgroundVariant.Dots} 
              gap={20} 
              size={1}
              color="hsl(var(--border))"
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

interface NodeItemProps {
  type: string;
  label: string;
}

const NodeItem: React.FC<NodeItemProps> = ({ type, label }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="p-2 bg-card/50 border border-border/50 rounded-md cursor-grab text-xs hover:bg-card/80 transition-colors"
      onDragStart={(event) => onDragStart(event, type)}
      draggable
    >
      {label}
    </div>
  );
};