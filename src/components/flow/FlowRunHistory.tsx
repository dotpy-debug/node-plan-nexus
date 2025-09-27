import React from 'react';
import { useFlowStore } from '@/store/flowStore';
import { FlowRun } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle,
  XCircle,
  Clock,
  Play,
  Pause,
  MoreHorizontal,
  Eye,
  RotateCcw,
  Trash2
} from 'lucide-react';

const statusIcons = {
  pending: <Clock className="h-3 w-3" />,
  running: <Play className="h-3 w-3 animate-pulse" />,
  success: <CheckCircle className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
  canceled: <Pause className="h-3 w-3" />,
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-800',
  running: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800', 
  failed: 'bg-red-100 text-red-800',
  canceled: 'bg-yellow-100 text-yellow-800',
};

interface FlowRunHistoryProps {
  flowId?: string;
}

export const FlowRunHistory: React.FC<FlowRunHistoryProps> = ({ flowId }) => {
  const { flowRuns, updateFlowRun } = useFlowStore();
  
  const filteredRuns = flowId 
    ? flowRuns.filter(run => run.flowId === flowId)
    : flowRuns;

  const sortedRuns = [...filteredRuns].sort((a, b) => {
    const aTime = a.startedAt ? a.startedAt.getTime() : 0;
    const bTime = b.startedAt ? b.startedAt.getTime() : 0;
    return bTime - aTime; // Most recent first
  });

  const handleRetryRun = (run: FlowRun) => {
    // Create a new run based on the failed one
    const retryRun: FlowRun = {
      ...run,
      id: `${run.id}-retry-${Date.now()}`,
      status: 'pending',
      startedAt: new Date(),
      finishedAt: undefined,
      error: undefined,
      attempts: run.attempts + 1
    };
    
    // In a real app, this would trigger the execution
    console.log('Retrying flow run:', retryRun);
  };

  const getDuration = (run: FlowRun) => {
    if (!run.startedAt) return '-';
    if (!run.finishedAt) return 'Running...';
    
    const duration = run.finishedAt.getTime() - run.startedAt.getTime();
    return `${duration}ms`;
  };

  return (
    <Card className="p-4 bg-terminal-bg/30 backdrop-blur-sm border-terminal-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">
          Execution History {flowId && '(Current Flow)'}
        </h3>
        <Badge variant="secondary">
          {sortedRuns.length} run{sortedRuns.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {sortedRuns.length > 0 ? (
        <div className="border border-terminal-border/20 rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="border-terminal-border/20">
                <TableHead>Status</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Attempts</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRuns.map((run) => (
                <TableRow 
                  key={run.id}
                  className="border-terminal-border/20"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {statusIcons[run.status]}
                      <Badge 
                        variant="secondary" 
                        className={statusColors[run.status]}
                      >
                        {run.status}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {run.startedAt ? (
                        <>
                          <div>{run.startedAt.toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {run.startedAt.toLocaleTimeString()}
                          </div>
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-mono text-sm">
                      {getDuration(run)}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {run.attempts}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {run.error ? (
                      <div className="max-w-xs">
                        <div className="text-sm text-red-600 dark:text-red-400 truncate">
                          Error: {run.error}
                        </div>
                      </div>
                    ) : run.output ? (
                      <div className="text-sm text-green-600 dark:text-green-400">
                        Completed successfully
                      </div>
                    ) : run.status === 'running' ? (
                      <div className="text-sm text-blue-600 dark:text-blue-400">
                        In progress...
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No output
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-3 w-3 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        
                        {run.status === 'failed' && (
                          <DropdownMenuItem onClick={() => handleRetryRun(run)}>
                            <RotateCcw className="h-3 w-3 mr-2" />
                            Retry
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-3 w-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Play className="h-8 w-8 mx-auto mb-3 opacity-50" />
          <p>No execution history</p>
          <p className="text-sm mt-1">
            Run your flow to see execution results here
          </p>
        </div>
      )}
    </Card>
  );
};