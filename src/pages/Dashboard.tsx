import React from 'react';
import { CommunityStats } from '@/components/community/CommunityStats';
import { NewsFeed } from '@/components/community/NewsFeed';
import { useCommunityStore } from '@/store/communityStore';
import { Post, CommunityStats as StatsType } from '@/types/community';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development
const mockStats: StatsType = {
  totalMembers: 1247,
  totalPosts: 89,
  activeToday: 156,
  tasksCompleted: 342,
  flowsCreated: 23,
};

const mockPosts: Post[] = [
  {
    id: uuidv4(),
    authorId: 'user1',
    authorName: 'Sarah Chen',
    authorAvatar: undefined,
    content: "Just completed the new user onboarding flow! 🎉 The automation reduced manual work by 80%. Here's what we learned during implementation...",
    type: 'task_update',
    metadata: {
      taskId: 'task-123',
      taskTitle: 'Implement user onboarding automation',
    },
    likes: [
      { id: '1', postId: '', userId: 'user2', userName: 'Mike Johnson', createdAt: new Date() },
      { id: '2', postId: '', userId: 'user3', userName: 'Lisa Wang', createdAt: new Date() },
    ],
    comments: [
      {
        id: '1',
        postId: '',
        authorId: 'user2',
        authorName: 'Mike Johnson',
        content: 'This is amazing! Can you share the flow template?',
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000),
      },
    ],
    shares: 5,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    workspaceId: 'workspace-1',
  },
  {
    id: uuidv4(),
    authorId: 'user2',
    authorName: 'Mike Johnson',
    authorAvatar: undefined,
    content: "Quick tip: Use the new conditional nodes in your flows to handle edge cases more elegantly. No more messy if-else chains! 💡\n\nWho else is loving the improved flow builder?",
    type: 'text',
    likes: [
      { id: '3', postId: '', userId: 'user1', userName: 'Sarah Chen', createdAt: new Date() },
    ],
    comments: [],
    shares: 2,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    workspaceId: 'workspace-1',
  },
  {
    id: uuidv4(),
    authorId: 'user3',
    authorName: 'Lisa Wang',
    authorAvatar: undefined,
    content: "Check out this interesting article about workflow automation best practices. Lots of insights that apply to our daily work!",
    type: 'link',
    metadata: {
      linkUrl: 'https://example.com/workflow-best-practices',
      linkTitle: 'The Ultimate Guide to Workflow Automation',
      linkDescription: 'Learn the best practices for building efficient and maintainable workflow automations.',
    },
    likes: [
      { id: '4', postId: '', userId: 'user1', userName: 'Sarah Chen', createdAt: new Date() },
      { id: '5', postId: '', userId: 'user2', userName: 'Mike Johnson', createdAt: new Date() },
    ],
    comments: [
      {
        id: '2',
        postId: '',
        authorId: 'user1',
        authorName: 'Sarah Chen',
        content: 'Great find! The section on error handling is particularly useful.',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
    shares: 8,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    workspaceId: 'workspace-1',
  },
];

export const Dashboard: React.FC = () => {
  const { posts, stats, setPosts, setStats } = useCommunityStore();

  // Initialize mock data
  React.useEffect(() => {
    if (posts.length === 0) {
      setPosts(mockPosts);
    }
    if (stats.totalMembers === 0) {
      setStats(mockStats);
    }
  }, [posts.length, stats.totalMembers, setPosts, setStats]);

  return (
    <div className="p-6 space-y-6 bg-gradient-canvas min-h-screen">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-text bg-clip-text text-transparent">
          Community Dashboard
        </h1>
        <p className="text-muted-foreground">
          Stay connected with your team's progress and discussions
        </p>
      </div>
      
      <CommunityStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <NewsFeed />
        </div>
        
        <div className="lg:col-span-1">
          {/* Sidebar content - could add trending topics, active users, etc. */}
          <div className="space-y-6">
            {/* Placeholder for future sidebar content */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;