import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Post, PostComment } from '@/types/community';
import { useCommunityStore } from '@/store/communityStore';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  User,
  Send,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const { likePost, unlikePost, addComment } = useCommunityStore();

  const currentUserId = 'current-user'; // TODO: Get from auth context
  const isLiked = post.likes.some(like => like.userId === currentUserId);

  const handleLike = () => {
    if (isLiked) {
      unlikePost(post.id, currentUserId);
    } else {
      likePost(post.id, currentUserId, 'Current User');
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsCommenting(true);

    const newComment: PostComment = {
      id: uuidv4(),
      postId: post.id,
      authorId: currentUserId,
      authorName: 'Current User',
      content: commentText.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    addComment(newComment);
    setCommentText('');
    setIsCommenting(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getPostTypeIcon = () => {
    switch (post.type) {
      case 'task_update':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'link':
        return <ExternalLink className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-card/40 backdrop-blur-sm border-border/50 hover:shadow-glow transition-all duration-300">
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.authorAvatar} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-sm">{post.authorName}</h4>
              {getPostTypeIcon()}
              {post.type === 'task_update' && (
                <Badge variant="secondary" className="text-xs">
                  Task Update
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatTimeAgo(post.createdAt)}
            </p>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Task/Flow Metadata */}
        {post.metadata?.taskId && (
          <Card className="mt-3 p-3 bg-background/50 border-border/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Task: {post.metadata.taskTitle}</span>
            </div>
          </Card>
        )}

        {/* Link Preview */}
        {post.metadata?.linkUrl && (
          <Card className="mt-3 p-3 bg-background/50 border-border/30">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-4 w-4 text-blue-500 mt-1" />
              <div>
                <h5 className="font-medium text-sm">{post.metadata.linkTitle}</h5>
                {post.metadata.linkDescription && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.metadata.linkDescription}
                  </p>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-border/30">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className={`h-8 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
          >
            <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes.length}
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="h-8 text-muted-foreground"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments.length}
          </Button>

          <Button variant="ghost" size="sm" className="h-8 text-muted-foreground">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-border/30">
          {/* Existing Comments */}
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.authorAvatar} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="bg-background/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{comment.authorName}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <form onSubmit={handleComment} className="flex gap-3 mt-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-avatar.png" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 flex gap-2">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[36px] max-h-24 resize-none bg-background/50 border-border/50"
                disabled={isCommenting}
              />
              <Button 
                type="submit" 
                size="sm"
                disabled={!commentText.trim() || isCommenting}
                className="self-end"
              >
                {isCommenting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
};
