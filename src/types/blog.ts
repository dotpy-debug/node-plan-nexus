export interface Story {
  id: string;
  authorId: string;
  author: Author;
  title: string;
  subtitle?: string;
  content: string; // Rich text/Markdown
  coverImage?: string;
  tags: Tag[];
  publishedAt?: Date;
  updatedAt: Date;
  createdAt: Date;
  readTime: number; // minutes
  claps: Clap[];
  clapCount: number;
  comments: StoryComment[];
  bookmarks: Bookmark[];
  views: number;
  status: 'draft' | 'published' | 'unlisted';
}

export interface Author {
  id: string;
  username: string;
  name: string;
  bio?: string;
  avatar?: string;
  coverImage?: string;
  followers: string[];
  following: string[];
  stories: string[];
  joinedAt: Date;
  website?: string;
  twitter?: string;
  linkedin?: string;
}

export interface Clap {
  id: string;
  storyId: string;
  userId: string;
  count: number; // Users can clap multiple times
  createdAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  followerCount: number;
  storyCount: number;
}

export interface StoryComment {
  id: string;
  storyId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  claps: number;
  replies: StoryComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Bookmark {
  id: string;
  userId: string;
  storyId: string;
  readingListId?: string;
  createdAt: Date;
}

export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description?: string;
  stories: string[];
  privacy: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
}

export interface Draft {
  id: string;
  authorId: string;
  title: string;
  subtitle?: string;
  content: string;
  coverImage?: string;
  tags: Tag[];
  lastSaved: Date;
  createdAt: Date;
}
