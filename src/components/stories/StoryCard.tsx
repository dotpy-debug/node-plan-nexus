import { Link } from 'react-router-dom';
import { Story } from '@/types/blog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TagPill } from '@/components/common/TagPill';
import { Bookmark, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface StoryCardProps {
  story: Story;
  variant?: 'list' | 'grid' | 'featured';
}

export function StoryCard({ story, variant = 'list' }: StoryCardProps) {
  const excerpt = story.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';

  if (variant === 'featured') {
    return (
      <article className="group relative">
        <Link to={`/story/${story.id}`}>
          {story.coverImage && (
            <div className="aspect-[2/1] mb-4 overflow-hidden rounded-lg">
              <img 
                src={story.coverImage} 
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <h2 className="text-2xl font-bold mb-2 group-hover:underline">
            {story.title}
          </h2>
          {story.subtitle && (
            <p className="text-muted-foreground mb-4">{story.subtitle}</p>
          )}
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={`/@${story.author.username}`}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={story.author.avatar} alt={story.author.name} />
                <AvatarFallback>{story.author.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <Link to={`/@${story.author.username}`} className="text-sm hover:underline">
              {story.author.name}
            </Link>
          </div>
          <span className="text-sm text-muted-foreground">{story.readTime} min read</span>
        </div>
      </article>
    );
  }

  if (variant === 'grid') {
    return (
      <article className="group">
        <Link to={`/story/${story.id}`}>
          {story.coverImage && (
            <div className="aspect-[3/2] mb-3 overflow-hidden rounded-lg">
              <img 
                src={story.coverImage} 
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <h3 className="font-bold mb-2 line-clamp-2 group-hover:underline">
            {story.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to={`/@${story.author.username}`} className="hover:underline">
            {story.author.name}
          </Link>
          <span>·</span>
          <span>{story.readTime} min read</span>
        </div>
      </article>
    );
  }

  // List variant (default)
  return (
    <article className="group py-8 border-b last:border-0">
      <div className="flex gap-8">
        <div className="flex-1 min-w-0">
          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            <Link to={`/@${story.author.username}`}>
              <Avatar className="h-6 w-6">
                <AvatarImage src={story.author.avatar} alt={story.author.name} />
                <AvatarFallback>{story.author.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <Link to={`/@${story.author.username}`} className="text-sm font-medium hover:underline">
              {story.author.name}
            </Link>
          </div>

          {/* Title & Subtitle */}
          <Link to={`/story/${story.id}`}>
            <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2">
              {story.title}
            </h2>
            {story.subtitle && (
              <p className="text-muted-foreground mb-3 line-clamp-2">
                {story.subtitle}
              </p>
            )}
          </Link>

          {/* Metadata */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{format(new Date(story.publishedAt!), 'MMM d')}</span>
              <span>·</span>
              <span>{story.readTime} min read</span>
              {story.tags[0] && (
                <>
                  <span>·</span>
                  <Link 
                    to={`/tag/${story.tags[0].slug}`}
                    className="hover:underline"
                  >
                    {story.tags[0].name}
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        {story.coverImage && (
          <Link to={`/story/${story.id}`} className="flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded">
              <img 
                src={story.coverImage} 
                alt={story.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </Link>
        )}
      </div>
    </article>
  );
}
