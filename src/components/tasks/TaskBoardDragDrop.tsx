import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { TaskDialog } from './TaskDialog';
import { CreateTaskDialog } from './CreateTaskDialog';
import { 
  MoreHorizontal, 
  Calendar,
  User,
  MessageCircle,
  Flag,
  Plus
} from 'lucide-react';

const columns = [
  { id: 'todo', title: 'To Do', color: 'bg-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'review', title: 'Review', color: 'bg-yellow-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
];

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500', 
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

export const TaskBoardDragDrop: React.FC = () => {
  const { getTasksByStatus, selectedTask, setSelectedTask, updateTask } = useTaskStore();
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState<string>('todo');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const targetColumnId = over.id as string;
    
    // Check if it's a valid column
    const isValidColumn = columns.some(col => col.id === targetColumnId);
    
    if (isValidColumn) {
      updateTask(taskId, { status: targetColumnId as any });
    }
    
    setActiveTask(null);
  };

  const findTaskById = (id: string): Task | null => {
    for (const column of columns) {
      const tasks = getTasksByStatus(column.id);
      const task = tasks.find(t => t.id === id);
      if (task) return task;
    }
    return null;
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="p-6 h-full overflow-auto">
        <div className="flex gap-6 h-full">
          {columns.map((column) => (
            <TaskColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onCreateTask={() => {
                setCreateTaskStatus(column.id);
                setCreateTaskOpen(true);
              }}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <TaskCardDragging task={activeTask} />
          ) : null}
        </DragOverlay>

        {/* Dialogs */}
        <TaskDialog 
          task={selectedTask} 
          open={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
        <CreateTaskDialog 
          open={createTaskOpen} 
          onClose={() => setCreateTaskOpen(false)}
          defaultStatus={createTaskStatus}
        />
      </div>
    </DndContext>
  );
};

interface TaskColumnProps {
  column: typeof columns[0];
  tasks: Task[];
  onCreateTask: () => void;
  onTaskClick: (task: Task) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onCreateTask,
  onTaskClick
}) => {
  const taskIds = tasks.map(t => t.id);

  return (
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <div 
        id={column.id}
        className="flex-1 min-w-[300px]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-3 h-3 rounded-full ${column.color}`} />
          <h3 className="font-semibold text-foreground">{column.title}</h3>
          <Badge variant="secondary" className="ml-auto">
            {tasks.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {tasks.map((task) => (
            <SortableTaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))}
          
          <Button 
            variant="ghost" 
            onClick={onCreateTask}
            className="w-full h-20 border-2 border-dashed border-terminal-border/50 hover:border-terminal-green/50 hover:bg-terminal-bg/30 font-mono"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>
    </SortableContext>
  );
};

interface SortableTaskCardProps {
  task: Task;
  onClick: () => void;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCardContent task={task} onClick={onClick} isDragging={isDragging} />
    </div>
  );
};

interface TaskCardContentProps {
  task: Task;
  onClick: () => void;
  isDragging?: boolean;
}

const TaskCardContent: React.FC<TaskCardContentProps> = ({ 
  task, 
  onClick, 
  isDragging = false 
}) => {
  return (
    <Card 
      className={`
        p-4 cursor-pointer hover:shadow-glow transition-all duration-200 
        bg-terminal-bg/30 backdrop-blur-sm border-terminal-border/50 hover:border-terminal-green/50
        ${isDragging ? 'rotate-3 shadow-xl' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm text-foreground leading-5">
          {task.title}
        </h4>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreHorizontal className="h-3 w-3" />
        </Button>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
        <span className="text-xs text-muted-foreground capitalize">
          {task.priority}
        </span>
        
        {task.labels.slice(0, 2).map((label) => (
          <Badge 
            key={label.id} 
            variant="secondary" 
            className="text-xs px-1.5 py-0.5"
            style={{ backgroundColor: label.color + '20', color: label.color }}
          >
            {label.name}
          </Badge>
        ))}
        
        {task.labels.length > 2 && (
          <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
            +{task.labels.length - 2}
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {task.dueAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{task.dueAt.toLocaleDateString()}</span>
            </div>
          )}
          
          {task.assigneeId && (
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>Assigned</span>
            </div>
          )}
        </div>

        {task.comments.length > 0 && (
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>{task.comments.length}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

const TaskCardDragging: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <TaskCardContent 
      task={task} 
      onClick={() => {}} 
      isDragging={true}
    />
  );
};