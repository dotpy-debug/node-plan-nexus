import React from 'react';
import { Card } from '@/components/ui/card';
import { useTaskStore } from '@/store/taskStore';
import { CheckSquare, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export const TaskStats: React.FC = () => {
  const { tasks } = useTaskStore();

  const stats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = tasks.filter(t => 
      t.dueAt && new Date(t.dueAt) < new Date() && t.status !== 'done'
    ).length;

    return { total, completed, inProgress, overdue };
  }, [tasks]);

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: CheckSquare,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6 bg-card/40 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};