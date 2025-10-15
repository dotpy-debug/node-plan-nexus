import { Link } from 'react-router-dom';
import { Tag } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TagPillProps {
  tag: Tag;
  variant?: 'default' | 'large';
  showFollowButton?: boolean;
}

export function TagPill({ tag, variant = 'default', showFollowButton = false }: TagPillProps) {
  if (variant === 'large') {
    return (
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <Link to={`/tag/${tag.slug}`}>
          <div>
            <h3 className="font-semibold mb-1 hover:underline">{tag.name}</h3>
            {tag.description && (
              <p className="text-sm text-muted-foreground">{tag.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {tag.storyCount.toLocaleString()} stories
            </p>
          </div>
        </Link>
        {showFollowButton && (
          <Button variant="outline" size="sm">
            Follow
          </Button>
        )}
      </div>
    );
  }

  return (
    <Link to={`/tag/${tag.slug}`}>
      <Button 
        variant="secondary" 
        size="sm"
        className="rounded-full hover:bg-muted-foreground/10"
      >
        {tag.name}
      </Button>
    </Link>
  );
}
