import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useStoryStore } from '@/store/storyStore';
import { useAuthorStore } from '@/store/authorStore';
import { cn } from '@/lib/utils';

interface ClapButtonProps {
  storyId: string;
  clapCount: number;
}

export function ClapButton({ storyId, clapCount }: ClapButtonProps) {
  const [isClapping, setIsClapping] = useState(false);
  const [localClaps, setLocalClaps] = useState(0);
  const { addClap } = useStoryStore();
  const { currentUser } = useAuthorStore();

  const handleClap = () => {
    if (!currentUser) {
      // In a real app, this would prompt login
      return;
    }

    setIsClapping(true);
    setLocalClaps(prev => prev + 1);
    addClap(storyId, currentUser.id);

    setTimeout(() => setIsClapping(false), 300);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClap}
      className={cn(
        "relative",
        isClapping && "animate-clap"
      )}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        className={cn(
          "transition-colors",
          localClaps > 0 ? "fill-primary" : "fill-none"
        )}
      >
        <path
          d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.45l1.52 2.1-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l-2.12 2.11c-.41.41-.8.46-1.13.14l-.35-.35a.3.3 0 0 1 0-.43l2.23-2.23a.3.3 0 0 1 .43 0l.94.94c.13.13.13.34 0 .47z"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
      {localClaps > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {localClaps}
        </span>
      )}
    </Button>
  );
}
