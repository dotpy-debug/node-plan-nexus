import { create } from 'zustand';
import { ReadingList, Bookmark } from '@/types/blog';

interface ReadingListState {
  readingLists: ReadingList[];
  bookmarks: Bookmark[];
  
  // Actions
  setReadingLists: (lists: ReadingList[]) => void;
  addReadingList: (list: ReadingList) => void;
  updateReadingList: (id: string, updates: Partial<ReadingList>) => void;
  deleteReadingList: (id: string) => void;
  
  // Bookmarks
  setBookmarks: (bookmarks: Bookmark[]) => void;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (storyId: string, userId: string) => void;
  isBookmarked: (storyId: string, userId: string) => boolean;
  
  // List operations
  addStoryToList: (listId: string, storyId: string) => void;
  removeStoryFromList: (listId: string, storyId: string) => void;
}

export const useReadingListStore = create<ReadingListState>((set, get) => ({
  readingLists: [],
  bookmarks: [],
  
  setReadingLists: (lists) => set({ readingLists: lists }),
  
  addReadingList: (list) => set((state) => ({
    readingLists: [...state.readingLists, list]
  })),
  
  updateReadingList: (id, updates) => set((state) => ({
    readingLists: state.readingLists.map(list =>
      list.id === id ? { ...list, ...updates } : list
    )
  })),
  
  deleteReadingList: (id) => set((state) => ({
    readingLists: state.readingLists.filter(list => list.id !== id)
  })),
  
  setBookmarks: (bookmarks) => set({ bookmarks }),
  
  addBookmark: (bookmark) => set((state) => ({
    bookmarks: [...state.bookmarks, bookmark]
  })),
  
  removeBookmark: (storyId, userId) => set((state) => ({
    bookmarks: state.bookmarks.filter(
      b => !(b.storyId === storyId && b.userId === userId)
    )
  })),
  
  isBookmarked: (storyId, userId) => {
    return get().bookmarks.some(
      b => b.storyId === storyId && b.userId === userId
    );
  },
  
  addStoryToList: (listId, storyId) => set((state) => ({
    readingLists: state.readingLists.map(list =>
      list.id === listId && !list.stories.includes(storyId)
        ? { ...list, stories: [...list.stories, storyId] }
        : list
    )
  })),
  
  removeStoryFromList: (listId, storyId) => set((state) => ({
    readingLists: state.readingLists.map(list =>
      list.id === listId
        ? { ...list, stories: list.stories.filter(id => id !== storyId) }
        : list
    )
  }))
}));
