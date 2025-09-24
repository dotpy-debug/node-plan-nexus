import React from 'react';
import { Card } from '@/components/ui/card';
import { useCommunityStore } from '@/store/communityStore';
import { Users, MessageSquare, CheckCircle, Workflow, TrendingUp } from 'lucide-react';

export const CommunityStats: React.FC = () => {
  const { stats } = useCommunityStore();

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      trend: '+12%',
    },
    {
      title: 'Posts Today',
      value: stats.totalPosts,
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      trend: '+8%',
    },
    {
      title: 'Active Users',
      value: stats.activeToday,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      trend: '+15%',
    },
    {
      title: 'Tasks Completed',
      value: stats.tasksCompleted,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      trend: '+24%',
    },
    {
      title: 'Flows Created',
      value: stats.flowsCreated,
      icon: Workflow,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      trend: '+6%',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-4 bg-card/40 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <span className="text-xs text-green-500 font-medium">{stat.trend}</span>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{stat.title}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};