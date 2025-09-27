import { create } from 'zustand';
import { Task, ViewMode, Label } from '@/types';
import { mockTasks } from './mockData';

interface TaskFilter {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  labels?: string[];
  search?: string;
  dueDate?: string;
}

interface TaskStore {
  tasks: Task[];
  selectedTask: Task | null;
  viewMode: ViewMode;
  filter: TaskFilter;
  isLoading: boolean;
  
  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setSelectedTask: (task: Task | null) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilter: (filter: Partial<TaskFilter>) => void;
  clearFilter: () => void;
  setLoading: (loading: boolean) => void;
  
  // Getters
  getFilteredTasks: () => Task[];
  getTasksByStatus: (status: string) => Task[];
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: mockTasks,
  selectedTask: null,
  viewMode: 'board',
  filter: {},
  isLoading: false,

  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
  })),
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter }
  })),
  
  clearFilter: () => set({ filter: {} }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  getFilteredTasks: () => {
    const { tasks, filter } = get();
    
    return tasks.filter(task => {
      if (filter.status?.length && !filter.status.includes(task.status)) return false;
      if (filter.priority?.length && !filter.priority.includes(task.priority)) return false;
      if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  },
  
  getTasksByStatus: (status) => {
    const { getFilteredTasks } = get();
    return getFilteredTasks().filter(task => task.status === status);
  }
}));