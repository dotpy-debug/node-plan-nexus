import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useTaskStore } from '@/store/taskStore';
import { Task } from '@/types';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueAt: z.date().optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  defaultStatus?: string;
}

const priorityColors = {
  low: 'bg-terminal-neutral-600',
  medium: 'bg-terminal-blue',
  high: 'bg-terminal-yellow',
  urgent: 'bg-terminal-red',
};

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ 
  open, 
  onClose, 
  defaultStatus = 'todo' 
}) => {
  const { addTask } = useTaskStore();

  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus as any,
      priority: 'medium',
      dueAt: undefined,
    },
  });

  const onSubmit = (data: CreateTaskFormData) => {
    const newTask: Task = {
      id: uuidv4(),
      projectId: 'default-project',
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueAt: data.dueAt,
      assigneeId: undefined,
      createdById: 'current-user',
      createdAt: new Date(),
      updatedAt: new Date(),
      labels: [],
      comments: [],
    };

    addTask(newTask);
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-terminal-bg border-terminal-border">
        <DialogHeader className="border-b border-terminal-border/50 pb-4">
          <DialogTitle className="text-terminal-foreground font-mono text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-terminal-foreground font-mono">Task Title *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter task title..."
                      className="bg-terminal-bg/50 border-terminal-border/50 font-mono"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-terminal-foreground font-mono">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Describe the task..."
                      rows={4}
                      className="bg-terminal-bg/50 border-terminal-border/50 font-mono resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-terminal-foreground font-mono">Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-terminal-bg/50 border-terminal-border/50 font-mono">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-terminal-bg border-terminal-border">
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="font-mono">
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-terminal-foreground font-mono">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-terminal-bg/50 border-terminal-border/50 font-mono">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-terminal-bg border-terminal-border">
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="font-mono">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${priorityColors[option.value as keyof typeof priorityColors]}`} />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dueAt"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-terminal-foreground font-mono">Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-mono bg-terminal-bg/50 border-terminal-border/50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-terminal-bg border-terminal-border" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="flex-1 bg-terminal-green hover:bg-terminal-green/80 text-terminal-bg font-mono"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                className="border-terminal-border/50 font-mono"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};