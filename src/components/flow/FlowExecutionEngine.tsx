import React, { useState } from 'react';
import { useFlowStore } from '@/store/flowStore';
import { FlowRun, FlowNode, FlowEdge } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ExecutionStep {
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  input?: any;
  output?: any;
  error?: string;
}

interface FlowExecutionEngineProps {
  flowId: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export const FlowExecutionEngine: React.FC<FlowExecutionEngineProps> = ({
  flowId,
  nodes,
  edges
}) => {
  const { addFlowRun, updateFlowRun } = useFlowStore();
  const [currentRun, setCurrentRun] = useState<FlowRun | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Mock execution logic
  const executeFlow = async (testMode = false) => {
    if (!nodes.length) return;

    const runId = uuidv4();
    const startTime = new Date();
    
    const newRun: FlowRun = {
      id: runId,
      flowId,
      status: 'running',
      startedAt: startTime,
      input: { testMode },
      attempts: 1
    };

    setCurrentRun(newRun);
    addFlowRun(newRun);
    setIsRunning(true);

    // Initialize execution steps
    const steps: ExecutionStep[] = nodes.map(node => ({
      nodeId: node.id,
      nodeName: node.data.label,
      status: 'pending'
    }));
    setExecutionSteps(steps);

    // Find trigger nodes to start execution
    const triggerNodes = nodes.filter(node => node.type === 'trigger');
    const executionOrder = buildExecutionOrder(nodes, edges);

    try {
      let currentOutput: any = { testMode, trigger: 'manual' };

      for (const nodeId of executionOrder) {
        const node = nodes.find(n => n.id === nodeId);
        if (!node) continue;

        // Update step status to running
        setExecutionSteps(prev => prev.map(step => 
          step.nodeId === nodeId 
            ? { ...step, status: 'running', startTime: new Date(), input: currentOutput }
            : step
        ));

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

        // Mock node execution based on type
        const result = await mockNodeExecution(node, currentOutput);
        
        if (result.success) {
          setExecutionSteps(prev => prev.map(step => 
            step.nodeId === nodeId 
              ? { 
                  ...step, 
                  status: 'success', 
                  endTime: new Date(), 
                  output: result.output 
                }
              : step
          ));
          currentOutput = { ...currentOutput, ...result.output };
        } else {
          setExecutionSteps(prev => prev.map(step => 
            step.nodeId === nodeId 
              ? { 
                  ...step, 
                  status: 'failed', 
                  endTime: new Date(), 
                  error: result.error 
                }
              : step
          ));
          throw new Error(result.error);
        }
      }

      // Successful completion
      const finalRun = {
        ...newRun,
        status: 'success' as const,
        finishedAt: new Date(),
        output: currentOutput
      };
      
      setCurrentRun(finalRun);
      updateFlowRun(runId, finalRun);

    } catch (error) {
      // Failed execution
      const failedRun = {
        ...newRun,
        status: 'failed' as const,
        finishedAt: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      setCurrentRun(failedRun);
      updateFlowRun(runId, failedRun);
    } finally {
      setIsRunning(false);
    }
  };

  // Build execution order based on node connections
  const buildExecutionOrder = (nodes: FlowNode[], edges: FlowEdge[]): string[] => {
    const order: string[] = [];
    const visited = new Set<string>();
    const triggerNodes = nodes.filter(node => node.type === 'trigger');

    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      order.push(nodeId);

      // Find connected nodes
      const outgoingEdges = edges.filter(edge => edge.source === nodeId);
      outgoingEdges.forEach(edge => {
        if (!visited.has(edge.target)) {
          traverse(edge.target);
        }
      });
    };

    // Start from trigger nodes
    triggerNodes.forEach(node => traverse(node.id));

    // Add any remaining nodes
    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        traverse(node.id);
      }
    });

    return order;
  };

  // Mock node execution
  const mockNodeExecution = async (node: FlowNode, input: any): Promise<{
    success: boolean;
    output?: any;
    error?: string;
  }> => {
    // Simulate random failures for testing
    const shouldFail = Math.random() < 0.1; // 10% failure rate

    if (shouldFail) {
      return {
        success: false,
        error: `Mock execution failed for node: ${node.data.label}`
      };
    }

    switch (node.type) {
      case 'trigger':
        return {
          success: true,
          output: {
            triggerId: node.id,
            triggerType: node.data.nodeType,
            timestamp: new Date().toISOString()
          }
        };

      case 'condition':
        const conditionResult = Math.random() > 0.5;
        return {
          success: true,
          output: {
            conditionMet: conditionResult,
            branch: conditionResult ? 'true' : 'false'
          }
        };

      case 'action':
        return {
          success: true,
          output: {
            actionType: node.data.nodeType,
            result: `Action ${node.data.label} executed successfully`,
            processedAt: new Date().toISOString()
          }
        };

      default:
        return {
          success: true,
          output: {
            nodeType: node.type,
            processed: true
          }
        };
    }
  };

  const stopExecution = () => {
    if (currentRun && isRunning) {
      const stoppedRun = {
        ...currentRun,
        status: 'canceled' as const,
        finishedAt: new Date()
      };
      
      setCurrentRun(stoppedRun);
      updateFlowRun(currentRun.id, stoppedRun);
      setIsRunning(false);
    }
  };

  const resetExecution = () => {
    setCurrentRun(null);
    setExecutionSteps([]);
    setIsRunning(false);
  };

  const getProgressPercentage = () => {
    if (!executionSteps.length) return 0;
    const completed = executionSteps.filter(step => 
      step.status === 'success' || step.status === 'failed'
    ).length;
    return (completed / executionSteps.length) * 100;
  };

  const getStatusIcon = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'running': return <Zap className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'skipped': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="p-4 space-y-4 bg-terminal-bg/30 backdrop-blur-sm border-terminal-border/50">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Flow Execution</h3>
        
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => executeFlow(true)}
            disabled={isRunning || nodes.length === 0}
          >
            <Play className="h-3 w-3 mr-2" />
            Test Run
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => executeFlow(false)}
            disabled={isRunning || nodes.length === 0}
          >
            <Play className="h-3 w-3 mr-2" />
            Execute
          </Button>
          
          {isRunning && (
            <Button
              size="sm"
              variant="destructive"
              onClick={stopExecution}
            >
              <Square className="h-3 w-3 mr-2" />
              Stop
            </Button>
          )}
          
          <Button
            size="sm"
            variant="ghost"
            onClick={resetExecution}
            disabled={isRunning}
          >
            <RotateCcw className="h-3 w-3 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Execution Progress */}
      {(isRunning || currentRun) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <div className="flex items-center gap-2">
              {currentRun && (
                <Badge variant={
                  currentRun.status === 'success' ? 'default' :
                  currentRun.status === 'failed' ? 'destructive' :
                  currentRun.status === 'canceled' ? 'secondary' : 'default'
                }>
                  {currentRun.status}
                </Badge>
              )}
              <span className="text-xs text-muted-foreground">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
          </div>
          
          <Progress value={getProgressPercentage()} className="h-2" />
        </div>
      )}

      {/* Execution Steps */}
      {executionSteps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Execution Steps</h4>
          
          <div className="space-y-1">
            {executionSteps.map((step, index) => (
              <div
                key={step.nodeId}
                className="flex items-center gap-3 p-2 rounded bg-card/20 border border-border/20"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getStatusIcon(step.status)}
                  <span className="text-sm font-medium truncate">
                    {index + 1}. {step.nodeName}
                  </span>
                </div>
                
                {step.startTime && (
                  <div className="text-xs text-muted-foreground">
                    {step.endTime ? (
                      `${step.endTime.getTime() - step.startTime.getTime()}ms`
                    ) : (
                      'Running...'
                    )}
                  </div>
                )}
                
                {step.error && (
                  <div className="text-xs text-red-500 max-w-xs truncate">
                    {step.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Execution Results */}
      {currentRun && currentRun.status !== 'running' && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Results</h4>
          
          <div className="p-3 rounded bg-card/20 border border-border/20">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">Started:</span>
                <div className="font-mono">
                  {currentRun.startedAt?.toLocaleTimeString()}
                </div>
              </div>
              
              {currentRun.finishedAt && (
                <div>
                  <span className="text-muted-foreground">Finished:</span>
                  <div className="font-mono">
                    {currentRun.finishedAt.toLocaleTimeString()}
                  </div>
                </div>
              )}
              
              {currentRun.startedAt && currentRun.finishedAt && (
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <div className="font-mono">
                    {currentRun.finishedAt.getTime() - currentRun.startedAt.getTime()}ms
                  </div>
                </div>
              )}
              
              <div>
                <span className="text-muted-foreground">Attempts:</span>
                <div className="font-mono">{currentRun.attempts}</div>
              </div>
            </div>
            
            {currentRun.error && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded">
                <div className="text-xs font-medium text-red-600 dark:text-red-400">
                  Error:
                </div>
                <div className="text-xs text-red-700 dark:text-red-300 mt-1">
                  {currentRun.error}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {nodes.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Play className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Add nodes to your flow to start execution</p>
        </div>
      )}
    </Card>
  );
};