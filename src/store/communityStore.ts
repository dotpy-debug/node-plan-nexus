import { create } from 'zustand';
import { Post, PostComment, CommunityActivity, CommunityStats } from '@/types/community';

interface CommunityStore {
  posts: Post[];
  activities: CommunityActivity[];
  stats: CommunityStats;
  isLoading: boolean;
  selectedPost: Post | null;
  
  // Actions
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  likePost: (postId: string, userId: string, userName: string) => void;
  unlikePost: (postId: string, userId: string) => void;
  addComment: (comment: PostComment) => void;
  setActivities: (activities: CommunityActivity[]) => void;
  setStats: (stats: CommunityStats) => void;
  setSelectedPost: (post: Post | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Getters
  getPostById: (id: string) => Post | undefined;
  getUserPosts: (userId: string) => Post[];
  getRecentPosts: (limit?: number) => Post[];
}

export const useCommunityStore = create<CommunityStore>((set, get) => ({
  posts: [],
  activities: [],
  stats: {
    totalPosts: 0,
    totalMembers: 0,
    activeToday: 0,
    tasksCompleted: 0,
    flowsCreated: 0,
  },
  isLoading: false,
  selectedPost: null,

  setPosts: (posts) => set({ posts }),
  
  addPost: (post) => set((state) => ({ 
    posts: [post, ...state.posts],
    stats: { ...state.stats, totalPosts: state.stats.totalPosts + 1 }
  })),
  
  updatePost: (id, updates) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === id ? { ...post, ...updates, updatedAt: new Date() } : post
    )
  })),
  
  deletePost: (id) => set((state) => ({
    posts: state.posts.filter(post => post.id !== id),
    selectedPost: state.selectedPost?.id === id ? null : state.selectedPost,
    stats: { ...state.stats, totalPosts: Math.max(0, state.stats.totalPosts - 1) }
  })),
  
  likePost: (postId, userId, userName) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: [...post.likes, { 
              id: `${postId}-${userId}`, 
              postId, 
              userId, 
              userName, 
              createdAt: new Date() 
            }] 
          }
        : post
    )
  })),
  
  unlikePost: (postId, userId) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes.filter(like => like.userId !== userId) }
        : post
    )
  })),
  
  addComment: (comment) => set((state) => ({
    posts: state.posts.map(post => 
      post.id === comment.postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    )
  })),
  
  setActivities: (activities) => set({ activities }),
  
  setStats: (stats) => set({ stats }),
  
  setSelectedPost: (post) => set({ selectedPost: post }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  getPostById: (id) => get().posts.find(post => post.id === id),
  
  getUserPosts: (userId) => get().posts.filter(post => post.authorId === userId),
  
  getRecentPosts: (limit = 10) => get().posts.slice(0, limit),
}));