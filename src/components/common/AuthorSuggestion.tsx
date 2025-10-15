import { Link } from 'react-router-dom';
import { Author } from '@/types/blog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AuthorSuggestionProps {
  author: Author;
}

export function AuthorSuggestion({ author }: AuthorSuggestionProps) {
  return (
    <div className="flex items-start gap-3">
      <Link to={`/@${author.username}`}>
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/@${author.username}`}>
          <p className="font-medium text-sm hover:underline truncate">{author.name}</p>
        </Link>
        <p className="text-xs text-muted-foreground line-clamp-2">{author.bio}</p>
      </div>
      <Button variant="outline" size="sm" className="flex-shrink-0">
        Follow
      </Button>
    </div>
  );
}
