import { create } from 'zustand';
import { Author } from '@/types/blog';

interface AuthorState {
  authors: Author[];
  currentUser: Author | null;
  
  // Actions
  setAuthors: (authors: Author[]) => void;
  addAuthor: (author: Author) => void;
  updateAuthor: (id: string, updates: Partial<Author>) => void;
  getAuthorById: (id: string) => Author | undefined;
  getAuthorByUsername: (username: string) => Author | undefined;
  
  // Current user
  setCurrentUser: (author: Author | null) => void;
  
  // Follow system
  followAuthor: (userId: string, authorId: string) => void;
  unfollowAuthor: (userId: string, authorId: string) => void;
  isFollowing: (userId: string, authorId: string) => boolean;
}

export const useAuthorStore = create<AuthorState>((set, get) => ({
  authors: [],
  currentUser: null,
  
  setAuthors: (authors) => set({ authors }),
  
  addAuthor: (author) => set((state) => ({
    authors: [...state.authors, author]
  })),
  
  updateAuthor: (id, updates) => set((state) => ({
    authors: state.authors.map(author =>
      author.id === id ? { ...author, ...updates } : author
    )
  })),
  
  getAuthorById: (id) => {
    return get().authors.find(author => author.id === id);
  },
  
  getAuthorByUsername: (username) => {
    return get().authors.find(author => author.username === username);
  },
  
  setCurrentUser: (author) => set({ currentUser: author }),
  
  followAuthor: (userId, authorId) => set((state) => ({
    authors: state.authors.map(author => {
      if (author.id === userId) {
        return {
          ...author,
          following: [...author.following, authorId]
        };
      }
      if (author.id === authorId) {
        return {
          ...author,
          followers: [...author.followers, userId]
        };
      }
      return author;
    })
  })),
  
  unfollowAuthor: (userId, authorId) => set((state) => ({
    authors: state.authors.map(author => {
      if (author.id === userId) {
        return {
          ...author,
          following: author.following.filter(id => id !== authorId)
        };
      }
      if (author.id === authorId) {
        return {
          ...author,
          followers: author.followers.filter(id => id !== userId)
        };
      }
      return author;
    })
  })),
  
  isFollowing: (userId, authorId) => {
    const user = get().authors.find(a => a.id === userId);
    return user ? user.following.includes(authorId) : false;
  }
}));
