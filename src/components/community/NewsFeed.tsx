import React from 'react';
import { PostCard } from './PostCard';
import { CreatePost } from './CreatePost';
import { useCommunityStore } from '@/store/communityStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Filter } from 'lucide-react';

export const NewsFeed: React.FC = () => {
  const { posts, isLoading } = useCommunityStore();
  const [filter, setFilter] = React.useState<'all' | 'following' | 'trending'>('all');

  const handleRefresh = () => {
    // TODO: Implement refresh functionality
    console.log('Refreshing feed...');
  };

  const filterButtons = [
    { id: 'all', label: 'All Posts' },
    { id: 'following', label: 'Following' },
    { id: 'trending', label: 'Trending' },
  ] as const;

  const filteredPosts = React.useMemo(() => {
    switch (filter) {
      case 'trending':
        return [...posts].sort((a, b) => 
          (b.likes.length + b.comments.length) - (a.likes.length + a.comments.length)
        );
      case 'following':
        // TODO: Filter by followed users
        return posts;
      default:
        return posts;
    }
  }, [posts, filter]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 bg-card/40 backdrop-blur-sm border-border/50">
            <div className="animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-16 h-3 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-muted rounded" />
                <div className="w-3/4 h-4 bg-muted rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {filterButtons.map((button) => (
            <Button
              key={button.id}
              variant={filter === button.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(button.id)}
              className={filter === button.id ? "bg-gradient-primary" : "bg-card/50 border-border/50"}
            >
              {button.label}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-card/50 border-border/50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="bg-card/50 border-border/50">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Create Post */}
      <CreatePost />

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <Card className="p-12 text-center bg-card/30 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary/10 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No posts yet</h3>
                <p className="text-muted-foreground">
                  Be the first to share something with your team!
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Load More Button */}
      {filteredPosts.length > 0 && (
        <div className="text-center pt-6">
          <Button variant="outline" className="bg-card/50 border-border/50">
            Load More Posts
          </Button>
        </div>
      )}
    </div>
  );
};