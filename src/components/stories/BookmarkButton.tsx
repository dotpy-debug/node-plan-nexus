import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useReadingListStore } from '@/store/readingListStore';
import { useAuthorStore } from '@/store/authorStore';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  storyId: string;
}

export function BookmarkButton({ storyId }: BookmarkButtonProps) {
  const { currentUser } = useAuthorStore();
  const { isBookmarked, addBookmark, removeBookmark } = useReadingListStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const bookmarked = currentUser ? isBookmarked(storyId, currentUser.id) : false;

  const handleToggle = () => {
    if (!currentUser) {
      // In a real app, this would prompt login
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (bookmarked) {
      removeBookmark(storyId, currentUser.id);
    } else {
      addBookmark({
        id: `bookmark-${Date.now()}`,
        userId: currentUser.id,
        storyId,
        createdAt: new Date()
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={cn(isAnimating && "animate-clap")}
    >
      <Bookmark 
        className={cn(
          "h-5 w-5 transition-colors",
          bookmarked && "fill-current"
        )} 
      />
    </Button>
  );
}
