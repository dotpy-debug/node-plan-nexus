import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useCommunityStore } from '@/store/communityStore';
import { Post } from '@/types/community';
import { 
  Send, 
  Image, 
  Link, 
  Smile,
  User,
  Hash
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const CreatePost: React.FC = () => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { addPost } = useCommunityStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsPosting(true);
    
    // Simulate API call
    const newPost: Post = {
      id: uuidv4(),
      authorId: 'current-user',
      authorName: 'John Doe',
      authorAvatar: undefined,
      content: content.trim(),
      type: 'text',
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      workspaceId: 'current-workspace',
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addPost(newPost);
    setContent('');
    setIsPosting(false);
  };

  return (
    <Card className="p-4 bg-card/40 backdrop-blur-sm border-border/50 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.png" />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind? Share updates, ask questions, or celebrate wins..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
              disabled={isPosting}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" disabled={isPosting}>
              <Image className="h-4 w-4 mr-2" />
              Photo
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={isPosting}>
              <Link className="h-4 w-4 mr-2" />
              Link
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={isPosting}>
              <Hash className="h-4 w-4 mr-2" />
              Tag
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={isPosting}>
              <Smile className="h-4 w-4 mr-2" />
              Emoji
            </Button>
          </div>

          <Button 
            type="submit" 
            disabled={!content.trim() || isPosting}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isPosting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};