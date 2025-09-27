import React, { useState } from 'react';
import { TaskBoardDragDrop } from '@/components/tasks/TaskBoardDragDrop';
import { TaskListView } from '@/components/tasks/TaskListView';
import { TaskCalendarView } from '@/components/tasks/TaskCalendarView';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { useTaskStore } from '@/store/taskStore';

export const Tasks: React.FC = () => {
  const { viewMode, selectedTask, setSelectedTask } = useTaskStore();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);

  const renderContent = () => {
    switch (viewMode) {
      case 'board':
        return <TaskBoardDragDrop />;
      case 'list':
        return <TaskListView />;
      case 'calendar':
        return <TaskCalendarView />;
      default:
        return <TaskBoardDragDrop />;
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

      <TaskDialog 
        task={selectedTask} 
        open={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  );
};