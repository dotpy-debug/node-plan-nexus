import { create } from 'zustand';
import { Story, Draft } from '@/types/blog';

interface StoryState {
  stories: Story[];
  drafts: Draft[];
  currentStory: Story | null;
  
  // Actions
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
  deleteStory: (id: string) => void;
  getStoryById: (id: string) => Story | undefined;
  
  // Drafts
  setDrafts: (drafts: Draft[]) => void;
  addDraft: (draft: Draft) => void;
  updateDraft: (id: string, updates: Partial<Draft>) => void;
  deleteDraft: (id: string) => void;
  
  // Current story
  setCurrentStory: (story: Story | null) => void;
  
  // Claps
  addClap: (storyId: string, userId: string) => void;
  
  // Views
  incrementViews: (storyId: string) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  drafts: [],
  currentStory: null,
  
  setStories: (stories) => set({ stories }),
  
  addStory: (story) => set((state) => ({
    stories: [story, ...state.stories]
  })),
  
  updateStory: (id, updates) => set((state) => ({
    stories: state.stories.map(story =>
      story.id === id ? { ...story, ...updates } : story
    )
  })),
  
  deleteStory: (id) => set((state) => ({
    stories: state.stories.filter(story => story.id !== id)
  })),
  
  getStoryById: (id) => {
    return get().stories.find(story => story.id === id);
  },
  
  setDrafts: (drafts) => set({ drafts }),
  
  addDraft: (draft) => set((state) => ({
    drafts: [draft, ...state.drafts]
  })),
  
  updateDraft: (id, updates) => set((state) => ({
    drafts: state.drafts.map(draft =>
      draft.id === id ? { ...draft, ...updates } : draft
    )
  })),
  
  deleteDraft: (id) => set((state) => ({
    drafts: state.drafts.filter(draft => draft.id !== id)
  })),
  
  setCurrentStory: (story) => set({ currentStory: story }),
  
  addClap: (storyId, userId) => set((state) => ({
    stories: state.stories.map(story => {
      if (story.id !== storyId) return story;
      
      const existingClap = story.claps.find(c => c.userId === userId);
      if (existingClap) {
        return {
          ...story,
          claps: story.claps.map(c =>
            c.userId === userId ? { ...c, count: c.count + 1 } : c
          ),
          clapCount: story.clapCount + 1
        };
      } else {
        return {
          ...story,
          claps: [
            ...story.claps,
            {
              id: `clap-${Date.now()}`,
              storyId,
              userId,
              count: 1,
              createdAt: new Date()
            }
          ],
          clapCount: story.clapCount + 1
        };
      }
    })
  })),
  
  incrementViews: (storyId) => set((state) => ({
    stories: state.stories.map(story =>
      story.id === storyId ? { ...story, views: story.views + 1 } : story
    )
  }))
}));
