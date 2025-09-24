import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

export const ConditionNode: React.FC<NodeProps> = ({ data, selected }) => {
  return (
    <Card className={`min-w-[180px] p-3 border-2 transition-all ${
      selected ? 'border-primary shadow-lg' : 'border-border/50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-md bg-gradient-secondary flex items-center justify-center">
          <GitBranch className="h-4 w-4 text-secondary-foreground" />
        </div>
        <div>
          <div className="font-medium text-sm">{data.label}</div>
          <div className="text-xs text-muted-foreground">Condition</div>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground">
        {data.config?.condition || 'Not configured'}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-primary border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '60%' }}
        className="w-3 h-3 bg-emerald-500 border-2 border-background"
        id="true"
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '40%' }}
        className="w-3 h-3 bg-red-500 border-2 border-background"
        id="false"
      />
      
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-emerald-600">True</span>
        <span className="text-red-600">False</span>
      </div>
    </Card>
  );
};