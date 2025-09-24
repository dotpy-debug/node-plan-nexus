import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const ActionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[180px] p-3 border-2 transition-all ${
      selected ? 'border-primary shadow-lg' : 'border-border/50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-md bg-gradient-accent flex items-center justify-center">
          <Settings className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <div className="font-medium text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">Action</div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {data.config?.action || 'Not configured'}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
    </Card>
  );
};