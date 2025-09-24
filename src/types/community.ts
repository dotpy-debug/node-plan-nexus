export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'link' | 'task_update';
  attachments?: Attachment[];
  metadata?: PostMetadata;
  likes: Like[];
  comments: PostComment[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
  workspaceId: string;
}

export interface PostMetadata {
  taskId?: string;
  taskTitle?: string;
  flowId?: string;
  flowName?: string;
  linkUrl?: string;
  linkTitle?: string;
  linkDescription?: string;
  linkImage?: string;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file';
  url: string;
  name: string;
  size: number;
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface PostComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityActivity {
  id: string;
  type: 'post_created' | 'post_liked' | 'post_commented' | 'task_completed' | 'flow_created';
  actorId: string;
  actorName: string;
  targetId: string;
  targetType: 'post' | 'task' | 'flow';
  metadata?: Record<string, any>;
  createdAt: Date;
  workspaceId: string;
}

export interface CommunityStats {
  totalPosts: number;
  totalMembers: number;
  activeToday: number;
  tasksCompleted: number;
  flowsCreated: number;
}