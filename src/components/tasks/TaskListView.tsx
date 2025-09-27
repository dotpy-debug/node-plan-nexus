import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  ArrowUpDown,
  Calendar,
  Flag,
  MoreHorizontal,
  User,
  Trash2,
  Edit,
  Play,
  Pause
} from 'lucide-react';

type SortField = 'title' | 'status' | 'priority' | 'dueAt' | 'createdAt';
type SortDirection = 'asc' | 'desc';

const priorityColors = {
  low: 'text-gray-500',
  medium: 'text-blue-500', 
  high: 'text-orange-500',
  urgent: 'text-red-500',
};

const statusColors = {
  'todo': 'bg-gray-100 text-gray-800',
  'in-progress': 'bg-blue-100 text-blue-800',
  'review': 'bg-yellow-100 text-yellow-800',
  'done': 'bg-green-100 text-green-800',
};

export const TaskListView: React.FC = () => {
  const { getFilteredTasks, updateTask, deleteTask, setSelectedTask } = useTaskStore();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const tasks = getFilteredTasks();
  
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (aValue instanceof Date) aValue = aValue.getTime();
    if (bValue instanceof Date) bValue = bValue.getTime();
    
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    if (aValue < bValue) return -1 * direction;
    if (aValue > bValue) return 1 * direction;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => 
      checked 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedTasks(checked ? tasks.map(t => t.id) : []);
  };

  const handleBulkStatusUpdate = (newStatus: string) => {
    selectedTasks.forEach(taskId => {
      updateTask(taskId, { status: newStatus as any });
    });
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    selectedTasks.forEach(taskId => deleteTask(taskId));
    setSelectedTasks([]);
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-8 p-0 font-medium hover:bg-transparent"
    >
      {children}
      <ArrowUpDown className="ml-2 h-3 w-3" />
    </Button>
  );

  return (
    <div className="p-6 space-y-4">
      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-terminal-bg/30 backdrop-blur-sm border border-terminal-border/50 rounded-lg">
          <span className="text-sm font-medium text-foreground">
            {selectedTasks.length} task{selectedTasks.length > 1 ? 's' : ''} selected
          </span>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <Play className="h-3 w-3 mr-2" />
                  Change Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('todo')}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('in-progress')}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('review')}>
                  Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkStatusUpdate('done')}>
                  Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              size="sm" 
              variant="destructive"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-terminal-border/50 rounded-lg bg-terminal-bg/30 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-terminal-border/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedTasks.length === tasks.length && tasks.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <SortButton field="title">Title</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="status">Status</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="priority">Priority</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="dueAt">Due Date</SortButton>
              </TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Labels</TableHead>
              <TableHead>
                <SortButton field="createdAt">Created</SortButton>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.map((task) => (
              <TableRow 
                key={task.id}
                className="border-terminal-border/50 hover:bg-terminal-bg/50 cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onCheckedChange={(checked) => handleSelectTask(task.id, !!checked)}
                  />
                </TableCell>
                
                <TableCell className="font-medium">
                  <div>
                    <div className="text-foreground">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-1">
                        {task.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant="secondary" className={statusColors[task.status]}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Flag className={`h-3 w-3 ${priorityColors[task.priority]}`} />
                    <span className="capitalize text-sm">{task.priority}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  {task.dueAt ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      {task.dueAt.toLocaleDateString()}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {task.assigneeId ? (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>Assigned</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    {task.labels.slice(0, 2).map((label) => (
                      <Badge 
                        key={label.id}
                        variant="secondary" 
                        className="text-xs"
                        style={{ backgroundColor: label.color + '20', color: label.color }}
                      >
                        {label.name}
                      </Badge>
                    ))}
                    {task.labels.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{task.labels.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {task.createdAt.toLocaleDateString()}
                  </span>
                </TableCell>
                
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteTask(task.id)}
                        className="text-destructive"
                      >
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
      
      {tasks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
};