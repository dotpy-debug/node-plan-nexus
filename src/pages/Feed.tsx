import { useEffect } from 'react';
import { useStoryStore } from '@/store/storyStore';
import { useAuthorStore } from '@/store/authorStore';
import { useTagStore } from '@/store/tagStore';
import { initializeBlogMockData } from '@/store/blogMockData';
import { StoryCard } from '@/components/stories/StoryCard';
import { TagPill } from '@/components/common/TagPill';
import { AuthorSuggestion } from '@/components/common/AuthorSuggestion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function Feed() {
  const { stories, setStories } = useStoryStore();
  const { setAuthors } = useAuthorStore();
  const { tags, setTags, getPopularTags } = useTagStore();

  useEffect(() => {
    const mockData = initializeBlogMockData();
    setStories(mockData.stories);
    setAuthors(mockData.authors);
    setTags(mockData.tags);
  }, [setStories, setAuthors, setTags]);

  const popularTags = getPopularTags(6);
  const publishedStories = stories.filter(s => s.status === 'published');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="foryou" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                <TabsTrigger 
                  value="foryou"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  For you
                </TabsTrigger>
                <TabsTrigger 
                  value="following"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent"
                >
                  Following
                </TabsTrigger>
              </TabsList>

              <TabsContent value="foryou" className="mt-8 space-y-8">
                {publishedStories.map(story => (
                  <StoryCard key={story.id} story={story} variant="list" />
                ))}
              </TabsContent>

              <TabsContent value="following" className="mt-8">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Follow authors and tags to see their stories here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recommended Topics */}
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                Recommended Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
                  <TagPill key={tag.id} tag={tag} />
                ))}
              </div>
            </div>

            {/* Who to Follow */}
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                Who to Follow
              </h3>
              <div className="space-y-4">
                {/* Will be populated with author suggestions */}
                <p className="text-sm text-muted-foreground">Coming soon</p>
              </div>
            </div>

            {/* Reading List */}
            <div>
              <h3 className="text-sm font-semibold mb-4 uppercase tracking-wide">
                Reading List
              </h3>
              <p className="text-sm text-muted-foreground">
                Click the bookmark icon to save stories for later
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
