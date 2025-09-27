import { Task, Flow, FlowRun, Label } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock labels
export const mockLabels: Label[] = [
  { id: '1', name: 'Bug', color: '#ef4444', projectId: 'proj-1' },
  { id: '2', name: 'Feature', color: '#3b82f6', projectId: 'proj-1' },
  { id: '3', name: 'Enhancement', color: '#10b981', projectId: 'proj-1' },
  { id: '4', name: 'Documentation', color: '#f59e0b', projectId: 'proj-1' },
];

// Mock tasks
export const mockTasks: Task[] = [
  {
    id: uuidv4(),
    projectId: 'proj-1',
    title: 'Fix user authentication bug',
    description: 'Users are unable to log in with social media accounts',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-1',
    dueAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    labels: [mockLabels[0]],
    comments: []
  },
  {
    id: uuidv4(),
    projectId: 'proj-1',
    title: 'Implement dark mode toggle',
    description: 'Add a theme switcher to the application header',
    status: 'in-progress',
    priority: 'medium',
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    labels: [mockLabels[1]],
    comments: []
  },
  {
    id: uuidv4(),
    projectId: 'proj-1',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints',
    status: 'review',
    priority: 'low',
    dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    labels: [mockLabels[3]],
    comments: []
  },
  {
    id: uuidv4(),
    projectId: 'proj-1',
    title: 'Optimize database queries',
    description: 'Improve performance of user dashboard queries',
    status: 'done',
    priority: 'urgent',
    createdById: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    labels: [mockLabels[2]],
    comments: []
  }
];

// Mock flows
export const mockFlows: Flow[] = [
  {
    id: uuidv4(),
    projectId: 'proj-1',
    name: 'Task Assignment Automation',
    enabled: true,
    graph: {
      nodes: [
        {
          id: 'trigger-1',
          type: 'trigger',
          position: { x: 100, y: 100 },
          data: {
            label: 'Task Created',
            config: { type: 'task_created' },
            nodeType: 'task_created'
          }
        },
        {
          id: 'action-1',
          type: 'action',
          position: { x: 300, y: 100 },
          data: {
            label: 'Send Notification',
            config: { type: 'send_email' },
            nodeType: 'send_email'
          }
        }
      ],
      edges: [
        {
          id: 'edge-1',
          source: 'trigger-1',
          target: 'action-1'
        }
      ]
    },
    version: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Initialize mock data
export const initializeMockData = () => {
  // This would typically load from localStorage or API
  return {
    tasks: mockTasks,
    flows: mockFlows
  };
};