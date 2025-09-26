import React, { useState } from 'react';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { useTaskStore } from '@/store/taskStore';

export const Tasks: React.FC = () => {
  const { viewMode } = useTaskStore();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const renderContent = () => {
    switch (viewMode) {
      case 'board':
        return <TaskBoard />;
      case 'list':
        return (
          <div className="p-6">
            <div className="text-center text-terminal-foreground/60 font-mono">
              List view coming soon...
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="p-6">
            <div className="text-center text-terminal-foreground/60 font-mono">
              Calendar view coming soon...
            </div>
          </div>
        );
      default:
        return <TaskBoard />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-0">
        <TaskFilters onCreateTask={() => setCreateTaskOpen(true)} />
      </div>
      
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <CreateTaskDialog 
        open={createTaskOpen} 
        onClose={() => setCreateTaskOpen(false)} 
      />
    </div>
  );
};