import { create } from 'zustand';
import { Tag } from '@/types/blog';

interface TagState {
  tags: Tag[];
  followedTags: string[]; // tag IDs followed by current user
  
  // Actions
  setTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  getTagBySlug: (slug: string) => Tag | undefined;
  getPopularTags: (limit?: number) => Tag[];
  
  // Follow system
  followTag: (tagId: string) => void;
  unfollowTag: (tagId: string) => void;
  isFollowingTag: (tagId: string) => boolean;
}

export const useTagStore = create<TagState>((set, get) => ({
  tags: [],
  followedTags: [],
  
  setTags: (tags) => set({ tags }),
  
  addTag: (tag) => set((state) => ({
    tags: [...state.tags, tag]
  })),
  
  getTagBySlug: (slug) => {
    return get().tags.find(tag => tag.slug === slug);
  },
  
  getPopularTags: (limit = 10) => {
    return [...get().tags]
      .sort((a, b) => b.followerCount - a.followerCount)
      .slice(0, limit);
  },
  
  followTag: (tagId) => set((state) => ({
    followedTags: [...state.followedTags, tagId],
    tags: state.tags.map(tag =>
      tag.id === tagId
        ? { ...tag, followerCount: tag.followerCount + 1 }
        : tag
    )
  })),
  
  unfollowTag: (tagId) => set((state) => ({
    followedTags: state.followedTags.filter(id => id !== tagId),
    tags: state.tags.map(tag =>
      tag.id === tagId
        ? { ...tag, followerCount: Math.max(0, tag.followerCount - 1) }
        : tag
    )
  })),
  
  isFollowingTag: (tagId) => {
    return get().followedTags.includes(tagId);
  }
}));
