import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStoryStore } from '@/store/storyStore';
import { useAuthorStore } from '@/store/authorStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ClapButton } from '@/components/stories/ClapButton';
import { BookmarkButton } from '@/components/stories/BookmarkButton';
import { TagPill } from '@/components/common/TagPill';
import { Share2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

export default function StoryReader() {
  const { id } = useParams<{ id: string }>();
  const { getStoryById, incrementViews } = useStoryStore();
  const { getAuthorById } = useAuthorStore();
  const [readProgress, setReadProgress] = useState(0);

  const story = id ? getStoryById(id) : null;
  const author = story ? getAuthorById(story.authorId) : null;

  useEffect(() => {
    if (story) {
      incrementViews(story.id);
    }
  }, [story, incrementViews]);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!story || !author) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Story not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150"
        style={{ width: `${readProgress}%` }}
      />

      {/* Story Header */}
      <article className="max-w-story mx-auto px-6 pt-12 pb-24">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
          {story.title}
        </h1>

        {/* Subtitle */}
        {story.subtitle && (
          <p className="text-xl text-muted-foreground mb-8 font-serif">
            {story.subtitle}
          </p>
        )}

        {/* Author Info */}
        <div className="flex items-center justify-between mb-8 pb-8 border-b">
          <div className="flex items-center gap-4">
            <Link to={`/@${author.username}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={author.avatar} alt={author.name} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/@${author.username}`}>
                <p className="font-medium hover:underline">{author.name}</p>
              </Link>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{format(new Date(story.publishedAt!), 'MMM d, yyyy')}</span>
                <span>·</span>
                <span>{story.readTime} min read</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Story Actions */}
        <div className="flex items-center justify-between mb-12 sticky top-4 bg-background/80 backdrop-blur-sm py-4 z-40">
          <div className="flex items-center gap-4">
            <ClapButton storyId={story.id} clapCount={story.clapCount} />
            <span className="text-sm text-muted-foreground">{story.clapCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookmarkButton storyId={story.id} />
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Cover Image */}
        {story.coverImage && (
          <div className="mb-12 -mx-6 md:mx-0">
            <img 
              src={story.coverImage} 
              alt={story.title}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}

        {/* Story Content */}
        <div 
          className="story-content"
          dangerouslySetInnerHTML={{ __html: story.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br />').replace(/^/, '<p>').replace(/$/, '</p>') }}
        />

        {/* Tags */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {story.tags.map(tag => (
              <TagPill key={tag.id} tag={tag} />
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{author.name}</h3>
                <Button size="sm">Follow</Button>
              </div>
              <p className="text-muted-foreground mb-3">{author.bio}</p>
              <div className="text-sm text-muted-foreground">
                {author.followers.length} Followers
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
