import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useTaskStore } from '@/store/taskStore';
import { Filter, X, Calendar, Flag, User, Tag } from 'lucide-react';

const statusOptions = [
  { value: 'todo', label: 'To Do', color: 'bg-terminal-neutral-600' },
  { value: 'in-progress', label: 'In Progress', color: 'bg-terminal-blue' },
  { value: 'review', label: 'Review', color: 'bg-terminal-yellow' },
  { value: 'done', label: 'Done', color: 'bg-terminal-green' },
];

const priorityOptions = [
  { value: 'low', label: 'Low', color: 'bg-terminal-neutral-600' },
  { value: 'medium', label: 'Medium', color: 'bg-terminal-blue' },
  { value: 'high', label: 'High', color: 'bg-terminal-yellow' },
  { value: 'urgent', label: 'Urgent', color: 'bg-terminal-red' },
];

const dueDateOptions = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'week', label: 'Due This Week' },
  { value: 'month', label: 'Due This Month' },
  { value: 'no-due-date', label: 'No Due Date' },
];

interface AdvancedTaskFiltersProps {
  trigger?: React.ReactNode;
}

export const AdvancedTaskFilters: React.FC<AdvancedTaskFiltersProps> = ({ trigger }) => {
  const { filter, setFilter, clearFilter } = useTaskStore();

  const hasActiveFilters = Object.keys(filter).some(key => {
    const value = filter[key as keyof typeof filter];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.status?.length) count += filter.status.length;
    if (filter.priority?.length) count += filter.priority.length;
    if (filter.assignee?.length) count += filter.assignee.length;
    if (filter.labels?.length) count += filter.labels.length;
    return count;
  };

  const handleStatusChange = (status: string, checked: boolean) => {
    const currentStatus = filter.status || [];
    if (checked) {
      setFilter({ status: [...currentStatus, status] });
    } else {
      setFilter({ status: currentStatus.filter(s => s !== status) });
    }
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    const currentPriority = filter.priority || [];
    if (checked) {
      setFilter({ priority: [...currentPriority, priority] });
    } else {
      setFilter({ priority: currentPriority.filter(p => p !== priority) });
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="bg-card/50 border-border/50 font-mono">
      <Filter className="h-4 w-4 mr-2" />
      Filters
      {hasActiveFilters && (
        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
          {getActiveFilterCount()}
        </Badge>
      )}
    </Button>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-terminal-bg border-terminal-border p-0" align="start">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-mono text-terminal-foreground font-medium">Filters</h4>
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilter}
                className="h-8 px-2 text-terminal-neutral-400 hover:text-terminal-foreground font-mono"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {/* Status Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-3 w-3 text-terminal-foreground" />
                <label className="text-sm font-mono text-terminal-foreground">Status</label>
              </div>
              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${option.value}`}
                      checked={filter.status?.includes(option.value) || false}
                      onCheckedChange={(checked) => 
                        handleStatusChange(option.value, checked as boolean)
                      }
                      className="border-terminal-border data-[state=checked]:bg-terminal-blue"
                    />
                    <label 
                      htmlFor={`status-${option.value}`}
                      className="text-sm font-mono text-terminal-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-terminal-border/50" />

            {/* Priority Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag className="h-3 w-3 text-terminal-foreground" />
                <label className="text-sm font-mono text-terminal-foreground">Priority</label>
              </div>
              <div className="space-y-2">
                {priorityOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`priority-${option.value}`}
                      checked={filter.priority?.includes(option.value) || false}
                      onCheckedChange={(checked) => 
                        handlePriorityChange(option.value, checked as boolean)
                      }
                      className="border-terminal-border data-[state=checked]:bg-terminal-blue"
                    />
                    <label 
                      htmlFor={`priority-${option.value}`}
                      className="text-sm font-mono text-terminal-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <div className={`w-2 h-2 rounded-full ${option.color}`} />
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-terminal-border/50" />

            {/* Due Date Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-3 w-3 text-terminal-foreground" />
                <label className="text-sm font-mono text-terminal-foreground">Due Date</label>
              </div>
              <Select onValueChange={(value) => setFilter({ dueDate: value })}>
                <SelectTrigger className="bg-terminal-bg/50 border-terminal-border/50 font-mono">
                  <SelectValue placeholder="Select due date filter" />
                </SelectTrigger>
                <SelectContent className="bg-terminal-bg border-terminal-border">
                  {dueDateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="font-mono">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-terminal-border/50" />

            {/* Assignee Filter */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="h-3 w-3 text-terminal-foreground" />
                <label className="text-sm font-mono text-terminal-foreground">Assignee</label>
              </div>
              <Select onValueChange={(value) => setFilter({ assignee: [value] })}>
                <SelectTrigger className="bg-terminal-bg/50 border-terminal-border/50 font-mono">
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent className="bg-terminal-bg border-terminal-border">
                  <SelectItem value="me" className="font-mono">Assigned to me</SelectItem>
                  <SelectItem value="unassigned" className="font-mono">Unassigned</SelectItem>
                  <SelectItem value="others" className="font-mono">Assigned to others</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};