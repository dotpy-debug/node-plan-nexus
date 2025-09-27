import React, { useState } from 'react';
import { FlowNode } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Clock,
  Zap,
  GitBranch,
  Mail,
  Webhook,
  Database,
  X,
  Save,
  Trash2
} from 'lucide-react';

interface NodeConfigurationPanelProps {
  node: FlowNode | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, config: any) => void;
  onDelete?: (nodeId: string) => void;
}

const nodeTypeConfigs = {
  trigger: {
    icon: <Zap className="h-4 w-4" />,
    title: 'Trigger Configuration',
    types: [
      { value: 'task_created', label: 'Task Created', description: 'Triggers when a new task is created' },
      { value: 'task_updated', label: 'Task Updated', description: 'Triggers when a task is updated' },
      { value: 'schedule', label: 'Schedule', description: 'Triggers on a time-based schedule' },
      { value: 'webhook', label: 'Webhook', description: 'Triggers when a webhook is received' },
      { value: 'manual', label: 'Manual', description: 'Triggers manually by user' }
    ]
  },
  condition: {
    icon: <GitBranch className="h-4 w-4" />,
    title: 'Condition Configuration',
    types: [
      { value: 'if_else', label: 'If/Else', description: 'Simple conditional logic' },
      { value: 'switch', label: 'Switch', description: 'Multiple condition branches' },
      { value: 'filter', label: 'Filter', description: 'Filter data based on criteria' },
      { value: 'compare', label: 'Compare', description: 'Compare values' }
    ]
  },
  action: {
    icon: <Settings className="h-4 w-4" />,
    title: 'Action Configuration',
    types: [
      { value: 'create_task', label: 'Create Task', description: 'Create a new task' },
      { value: 'update_task', label: 'Update Task', description: 'Update an existing task' },
      { value: 'send_email', label: 'Send Email', description: 'Send an email notification' },
      { value: 'slack_message', label: 'Slack Message', description: 'Send a Slack message' },
      { value: 'http_request', label: 'HTTP Request', description: 'Make an HTTP API call' },
      { value: 'delay', label: 'Delay', description: 'Wait for a specified time' }
    ]
  }
};

export const NodeConfigurationPanel: React.FC<NodeConfigurationPanelProps> = ({
  node,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [config, setConfig] = useState(node?.data?.config || {});
  const [nodeType, setNodeType] = useState(node?.data?.nodeType || '');

  if (!isOpen || !node) return null;

  const typeConfig = nodeTypeConfigs[node.type as keyof typeof nodeTypeConfigs];

  const handleSave = () => {
    onSave(node.id, { 
      ...config, 
      nodeType,
      label: config.label || node.data.label 
    });
    onClose();
  };

  const handleConfigChange = (key: string, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderSpecificConfig = () => {
    if (!nodeType) return null;

    switch (nodeType) {
      case 'schedule':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cron">Cron Expression</Label>
              <Input
                id="cron"
                placeholder="0 9 * * 1-5 (Every weekday at 9 AM)"
                value={config.cron || ''}
                onChange={(e) => handleConfigChange('cron', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use cron syntax for scheduling
              </p>
            </div>
            
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={config.timezone || 'UTC'}
                onValueChange={(value) => handleConfigChange('timezone', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC">UTC</SelectItem>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="Europe/London">London</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'webhook':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://example.com/webhook"
                value={config.webhookUrl || ''}
                onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="http-method">HTTP Method</Label>
              <Select
                value={config.method || 'POST'}
                onValueChange={(value) => handleConfigChange('method', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'if_else':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition">Condition</Label>
              <Textarea
                id="condition"
                placeholder="task.priority === 'urgent'"
                value={config.condition || ''}
                onChange={(e) => handleConfigChange('condition', e.target.value)}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="operator">Operator</Label>
              <Select
                value={config.operator || 'equals'}
                onValueChange={(value) => handleConfigChange('operator', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="not_equals">Not Equals</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                  <SelectItem value="greater_than">Greater Than</SelectItem>
                  <SelectItem value="less_than">Less Than</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'send_email':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                placeholder="recipient@example.com"
                value={config.to || ''}
                onChange={(e) => handleConfigChange('to', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                placeholder="Task notification"
                value={config.subject || ''}
                onChange={(e) => handleConfigChange('subject', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                placeholder="Your task has been updated..."
                value={config.body || ''}
                onChange={(e) => handleConfigChange('body', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );

      case 'create_task':
      case 'update_task':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="New task title"
                value={config.taskTitle || ''}
                onChange={(e) => handleConfigChange('taskTitle', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="task-status">Status</Label>
              <Select
                value={config.status || 'todo'}
                onValueChange={(value) => handleConfigChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="task-priority">Priority</Label>
              <Select
                value={config.priority || 'medium'}
                onValueChange={(value) => handleConfigChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'delay':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="delay-duration">Duration</Label>
              <div className="flex gap-2">
                <Input
                  id="delay-duration"
                  type="number"
                  placeholder="5"
                  value={config.duration || ''}
                  onChange={(e) => handleConfigChange('duration', e.target.value)}
                />
                <Select
                  value={config.unit || 'minutes'}
                  onValueChange={(value) => handleConfigChange('unit', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seconds">Seconds</SelectItem>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-muted-foreground">
            No specific configuration available for this node type.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto bg-card">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {typeConfig.icon}
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {typeConfig.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Configure node behavior and parameters
                </p>
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Basic Configuration */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-label">Node Label</Label>
              <Input
                id="node-label"
                placeholder="Enter node label"
                value={config.label || node.data.label}
                onChange={(e) => handleConfigChange('label', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="node-type">Node Type</Label>
              <Select
                value={nodeType}
                onValueChange={setNodeType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  {typeConfig.types.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                placeholder="Describe what this node does..."
                value={config.description || ''}
                onChange={(e) => handleConfigChange('description', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <Separator />

          {/* Type-specific Configuration */}
          <div>
            <h3 className="font-medium text-foreground mb-3">
              Configuration
            </h3>
            {renderSpecificConfig()}
          </div>

          <Separator />

          {/* Advanced Settings */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Advanced Settings</h3>
            
            <div className="flex items-center gap-4">
              <Label htmlFor="node-enabled">Enabled</Label>
              <input
                id="node-enabled" 
                type="checkbox"
                checked={config.enabled !== false}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                className="h-4 w-4"
              />
            </div>

            <div>
              <Label htmlFor="retry-count">Retry Count</Label>
              <Input
                id="retry-count"
                type="number"
                min="0"
                max="10"
                placeholder="3"
                value={config.retryCount || ''}
                onChange={(e) => handleConfigChange('retryCount', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input
                id="timeout"
                type="number"
                min="1"
                placeholder="30"
                value={config.timeout || ''}
                onChange={(e) => handleConfigChange('timeout', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Configuration
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
            
            {onDelete && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(node.id);
                  onClose();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Node
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};