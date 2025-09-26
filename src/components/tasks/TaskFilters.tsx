import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTaskStore } from '@/store/taskStore';
import { AdvancedTaskFilters } from './AdvancedTaskFilters';
import { 
  Search, 
  X,
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  Plus
} from 'lucide-react';

interface TaskFiltersProps {
  onCreateTask?: () => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ onCreateTask }) => {
  const { filter, setFilter, clearFilter, viewMode, setViewMode } = useTaskStore();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ search: e.target.value });
  };

  const clearSearch = () => {
    setFilter({ search: '' });
  };

  const hasActiveFilters = Object.keys(filter).some(key => {
    const value = filter[key as keyof typeof filter];
    return Array.isArray(value) ? value.length > 0 : Boolean(value);
  });

  const viewModes = [
    { id: 'board', label: 'Board', icon: LayoutGrid },
    { id: 'list', label: 'List', icon: List },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  ] as const;

  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 flex-1">
        {/* Create Task Button */}
        {onCreateTask && (
          <Button 
            onClick={onCreateTask}
            className="bg-terminal-green hover:bg-terminal-green/80 text-terminal-bg font-mono"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filter.search || ''}
            onChange={handleSearchChange}
            className="pl-10 pr-10 bg-terminal-bg/50 border-terminal-border/50 font-mono"
          />
          {filter.search && (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        <AdvancedTaskFilters />

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilter} className="font-mono">
            <X className="h-4 w-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center bg-terminal-bg/50 rounded-lg border border-terminal-border/50 p-1">
        {viewModes.map((mode) => (
          <Button
            key={mode.id}
            size="sm"
            variant={viewMode === mode.id ? "default" : "ghost"}
            onClick={() => setViewMode(mode.id)}
            className={`h-8 px-3 font-mono ${
              viewMode === mode.id 
                ? 'bg-terminal-blue text-terminal-bg' 
                : 'hover:bg-terminal-bg/70 text-terminal-foreground'
            }`}
          >
            <mode.icon className="h-4 w-4 mr-2" />
            {mode.label}
          </Button>
        ))}
      </div>
    </div>
  );
};