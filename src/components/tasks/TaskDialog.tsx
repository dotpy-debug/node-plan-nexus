import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Badge } from '@/components/ui/badge';
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
import { Separator } from '@/components/ui/separator';
import { useTaskStore } from '@/store/taskStore';
import { Task, Comment } from '@/types';
import { CalendarIcon, MessageCircle, Clock, User2, Flag, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueAt: z.date().optional(),
  assigneeId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
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

export const TaskDialog: React.FC<TaskDialogProps> = ({ task, open, onClose }) => {
  const { updateTask, deleteTask } = useTaskStore();
  const [newComment, setNewComment] = useState('');

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      dueAt: task?.dueAt,
      assigneeId: task?.assigneeId,
    },
  });

  const onSubmit = (data: TaskFormData) => {
    if (task) {
      updateTask(task.id, {
        ...data,
        updatedAt: new Date(),
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (task && confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      onClose();
    }
  };

  const handleAddComment = () => {
    if (!task || !newComment.trim()) return;

    const comment: Comment = {
      id: uuidv4(),
      taskId: task.id,
      authorId: 'current-user',
      authorName: 'You',
      body: newComment.trim(),
      createdAt: new Date(),
    };

    updateTask(task.id, {
      comments: [...task.comments, comment],
    });

    setNewComment('');
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-terminal-bg border-terminal-border">
        <DialogHeader className="border-b border-terminal-border/50 pb-4">
          <DialogTitle className="text-terminal-foreground font-mono text-lg">
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 space-y-6 overflow-y-auto pr-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-terminal-foreground font-mono">Title</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-terminal-bg/50 border-terminal-border/50 font-mono"
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
                      <FormLabel className="text-terminal-foreground font-mono">Due Date</FormLabel>
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

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="bg-terminal-green hover:bg-terminal-green/80 text-terminal-bg font-mono">
                    Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="border-terminal-border/50 font-mono"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDelete}
                    className="ml-auto bg-terminal-red hover:bg-terminal-red/80 font-mono"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </form>
            </Form>

            {/* Labels */}
            {task.labels.length > 0 && (
              <div>
                <h4 className="text-sm font-mono text-terminal-foreground mb-2">Labels</h4>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <Badge 
                      key={label.id} 
                      variant="secondary"
                      className="font-mono"
                      style={{ backgroundColor: label.color + '20', color: label.color }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comments Sidebar */}
          <div className="w-80 border-l border-terminal-border/50 pl-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MessageCircle className="h-4 w-4 text-terminal-foreground" />
              <h4 className="font-mono text-terminal-foreground">Comments ({task.comments.length})</h4>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto mb-4">
              {task.comments.map((comment) => (
                <div key={comment.id} className="bg-terminal-bg/30 p-3 rounded border border-terminal-border/30">
                  <div className="flex items-center gap-2 mb-2">
                    <User2 className="h-3 w-3 text-terminal-foreground" />
                    <span className="text-xs font-mono text-terminal-foreground">{comment.authorName}</span>
                    <span className="text-xs text-terminal-neutral-400 ml-auto">
                      {format(comment.createdAt, 'MMM d, HH:mm')}
                    </span>
                  </div>
                  <p className="text-sm text-terminal-foreground/80 font-mono">{comment.body}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="bg-terminal-bg/50 border-terminal-border/50 font-mono resize-none"
              />
              <Button 
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                size="sm"
                className="w-full bg-terminal-blue hover:bg-terminal-blue/80 text-terminal-bg font-mono"
              >
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};