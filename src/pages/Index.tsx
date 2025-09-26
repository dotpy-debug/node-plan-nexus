import React from 'react';
import { useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Tasks } from './Tasks';
import { Flows } from './Flows';
import Dashboard from './Dashboard';

// Mock data for development
import { useTaskStore } from '@/store/taskStore';
import { useFlowStore } from '@/store/flowStore';
import { Task, Flow, Label } from '@/types';

const mockLabels: Label[] = [
  { id: '1', name: 'Bug', color: '#ef4444', projectId: '1' },
  { id: '2', name: 'Feature', color: '#3b82f6', projectId: '1' },
  { id: '3', name: 'Design', color: '#8b5cf6', projectId: '1' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Fix login authentication bug',
    description: 'Users are unable to log in with their credentials. Need to investigate the authentication flow.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user1',
    dueAt: new Date('2024-01-15'),
    createdById: 'user1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    labels: [mockLabels[0]],
    comments: [],
  },
  {
    id: '2',
    projectId: '1',
    title: 'Implement dark mode toggle',
    description: 'Add a toggle switch in the settings to switch between light and dark themes.',
    status: 'in-progress',
    priority: 'medium',
    assigneeId: 'user2',
    createdById: 'user1',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-12'),
    labels: [mockLabels[1]],
    comments: [],
  },
  {
    id: '3',
    projectId: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and mockups for the new landing page design.',
    status: 'review',
    priority: 'low',
    createdById: 'user1',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-13'),
    labels: [mockLabels[2]],
    comments: [],
  },
  {
    id: '4',
    projectId: '1',
    title: 'Update documentation',
    description: 'Update the API documentation with the latest changes.',
    status: 'done',
    priority: 'low',
    createdById: 'user2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-14'),
    labels: [],
    comments: [],
  },
];

const mockFlows: Flow[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Auto-assign Bug Reports',
    enabled: true,
    graph: { nodes: [], edges: [] },
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    projectId: '1',
    name: 'Daily Standup Reminder',
    enabled: false,
    graph: { nodes: [], edges: [] },
    version: 1,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  }
];

const Index = () => {
  const location = useLocation();
  const { tasks, setTasks } = useTaskStore();
  const { flows, setFlows } = useFlowStore();

  // Initialize mock data
  React.useEffect(() => {
    if (tasks.length === 0) {
      setTasks(mockTasks);
    }
    if (flows.length === 0) {
      setFlows(mockFlows);
    }
  }, [tasks.length, flows.length, setTasks, setFlows]);

  const renderContent = () => {
    switch (location.pathname) {
      case '/tasks':
        return <Tasks />;
      case '/flows':
        return <Flows />;
      case '/calendar':
        return (
          <div className="p-6 bg-terminal-bg min-h-screen">
            <h1 className="text-2xl font-mono text-terminal-foreground mb-4">
              Calendar View
            </h1>
            <p className="text-terminal-foreground/60 font-mono">Calendar view coming soon...</p>
          </div>
        );
      case '/reports':
        return (
          <div className="p-6 bg-terminal-bg min-h-screen">
            <h1 className="text-2xl font-mono text-terminal-foreground mb-4">
              Reports & Analytics
            </h1>
            <p className="text-terminal-foreground/60 font-mono">Reports and analytics coming soon...</p>
          </div>
        );
      case '/settings':
        return (
          <div className="p-6 bg-terminal-bg min-h-screen">
            <h1 className="text-2xl font-mono text-terminal-foreground mb-4">
              Settings
            </h1>
            <p className="text-terminal-foreground/60 font-mono">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <SidebarProvider>
      <div className="h-full flex w-full bg-terminal-bg">
        <AppSidebar />
        <main className="flex-1 bg-terminal-bg">
          <header className="flex h-10 shrink-0 items-center gap-2 border-b border-terminal-border px-4 bg-terminal-title-bar/30">
            <SidebarTrigger className="-ml-1 text-terminal-text hover:text-primary" />
            <div className="flex-1 text-center">
              <span className="text-xs text-terminal-text font-mono">
                ~/pythoughts/{location.pathname === '/' ? 'dashboard' : location.pathname.slice(1)}
              </span>
            </div>
          </header>
          <div className="flex flex-1 flex-col bg-terminal-bg overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
