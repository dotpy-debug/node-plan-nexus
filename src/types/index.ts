export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  workspaceId: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueAt?: Date;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  labels: Label[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  taskId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: Date;
}

export interface Flow {
  id: string;
  projectId: string;
  name: string;
  enabled: boolean;
  graph: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'integration' | 'end';
  position: { x: number; y: number };
  data: {
    label: string;
    config: Record<string, any>;
    nodeType: string;
  };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface FlowRun {
  id: string;
  flowId: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'canceled';
  startedAt?: Date;
  finishedAt?: Date;
  input?: any;
  output?: any;
  error?: any;
  attempts: number;
}

export type ViewMode = 'list' | 'board' | 'calendar';
export type SidebarSection = 'tasks' | 'flows' | 'calendar' | 'reports' | 'settings';