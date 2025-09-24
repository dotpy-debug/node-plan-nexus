import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { 
  MoreHorizontal, 
  Calendar,
  User,
  MessageCircle,
  Flag
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

export const TaskBoard: React.FC = () => {
  const { getTasksByStatus, setSelectedTask } = useTaskStore();

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex gap-6 h-full">
        {columns.map((column) => (
          <div key={column.id} className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-foreground">{column.title}</h3>
              <Badge variant="secondary" className="ml-auto">
                {getTasksByStatus(column.id).length}
              </Badge>
            </div>

            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTask(task)}
                />
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full h-20 border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-card/50"
              >
                + Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card 
      className="p-4 cursor-pointer hover:shadow-glow transition-all duration-200 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-sm text-foreground leading-5">
          {task.title}
        </h4>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
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