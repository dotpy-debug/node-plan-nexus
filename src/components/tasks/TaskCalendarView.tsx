import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Flag
} from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500', 
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

const statusColors = {
  'todo': 'border-l-gray-400',
  'in-progress': 'border-l-blue-400',
  'review': 'border-l-yellow-400',
  'done': 'border-l-green-400',
};

export const TaskCalendarView: React.FC = () => {
  const { getFilteredTasks, setSelectedTask } = useTaskStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const tasks = getFilteredTasks();

  // Get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    return tasks.filter(task => {
      if (!task.dueAt) return false;
      return (
        task.dueAt.toDateString() === date.toDateString()
      );
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isOverdue = (date: Date) => {
    const today = new Date();
    return date < today && !isToday(date);
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="p-6 space-y-4 h-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="font-mono"
          >
            Today
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4 bg-terminal-bg/30 backdrop-blur-sm border-terminal-border/50">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isCurrentMonthDay = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={index}
                className={`
                  min-h-[120px] p-2 border border-terminal-border/20 rounded-md
                  ${isCurrentMonthDay ? 'bg-card/20' : 'bg-muted/10'}
                  ${isTodayDate ? 'ring-2 ring-primary ring-opacity-50 bg-primary/5' : ''}
                  hover:bg-card/30 transition-colors
                `}
              >
                {/* Day Number */}
                <div className={`
                  text-sm font-medium mb-2
                  ${isCurrentMonthDay ? 'text-foreground' : 'text-muted-foreground'}
                  ${isTodayDate ? 'text-primary font-bold' : ''}
                `}>
                  {date.getDate()}
                </div>

                {/* Tasks */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`
                        text-xs p-1.5 rounded border-l-2 cursor-pointer
                        bg-card/50 hover:bg-card/80 transition-colors
                        ${statusColors[task.status]}
                        ${isOverdue(date) && task.status !== 'done' ? 'bg-red-50 dark:bg-red-950/20' : ''}
                      `}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${priorityColors[task.priority]}`} />
                        <span className="font-medium truncate flex-1">
                          {task.title}
                        </span>
                      </div>
                      
                      {task.labels.length > 0 && (
                        <div className="flex gap-1">
                          {task.labels.slice(0, 2).map((label) => (
                            <Badge
                              key={label.id}
                              variant="secondary"
                              className="text-xs px-1 py-0"
                              style={{ backgroundColor: label.color + '20', color: label.color }}
                            >
                              {label.name.slice(0, 3)}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Calendar Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary/20 border-2 border-primary rounded" />
          <span>Today</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-100 border-l-2 border-red-400" />
          <span>Overdue</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span>Priority:</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-500 rounded-full" />
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>High</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Urgent</span>
          </div>
        </div>
      </div>

      {/* Tasks without due dates */}
      <Card className="p-4 bg-terminal-bg/30 backdrop-blur-sm border-terminal-border/50">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <CalendarIcon className="h-4 w-4" />
          Tasks without due dates
        </h3>
        
        <div className="space-y-2">
          {tasks
            .filter(task => !task.dueAt)
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`
                  p-2 rounded border-l-2 cursor-pointer
                  bg-card/30 hover:bg-card/50 transition-colors
                  ${statusColors[task.status]}
                `}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
                  <span className="text-sm font-medium text-foreground">
                    {task.title}
                  </span>
                  
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
                </div>
              </div>
            ))}
            
          {tasks.filter(task => !task.dueAt).length === 0 && (
            <p className="text-sm text-muted-foreground">
              All tasks have due dates assigned
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};