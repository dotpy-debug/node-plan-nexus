import { Story, Author, Tag } from '@/types/blog';
import { v4 as uuidv4 } from 'uuid';

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: 'author-1',
    username: 'sarah_chen',
    name: 'Sarah Chen',
    bio: 'Product designer & writer. Exploring the intersection of design, psychology, and technology.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200',
    followers: [],
    following: [],
    stories: [],
    joinedAt: new Date('2023-01-15'),
    website: 'https://sarahchen.design',
    twitter: '@sarahchen'
  },
  {
    id: 'author-2',
    username: 'james_wright',
    name: 'James Wright',
    bio: 'Software engineer passionate about building scalable systems and sharing knowledge.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    followers: [],
    following: [],
    stories: [],
    joinedAt: new Date('2022-08-20')
  },
  {
    id: 'author-3',
    username: 'maya_patel',
    name: 'Maya Patel',
    bio: 'Data scientist, author, and educator. Making AI accessible to everyone.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    followers: [],
    following: [],
    stories: [],
    joinedAt: new Date('2023-03-10'),
    linkedin: 'mayapatel'
  }
];

// Mock Tags
export const mockTags: Tag[] = [
  { id: 'tag-1', name: 'Technology', slug: 'technology', description: 'The latest in tech and innovation', followerCount: 12500, storyCount: 3450 },
  { id: 'tag-2', name: 'Design', slug: 'design', description: 'Design thinking and creativity', followerCount: 8900, storyCount: 2100 },
  { id: 'tag-3', name: 'Programming', slug: 'programming', description: 'Code, development, and best practices', followerCount: 15200, storyCount: 4800 },
  { id: 'tag-4', name: 'AI', slug: 'ai', description: 'Artificial Intelligence and Machine Learning', followerCount: 11000, storyCount: 2800 },
  { id: 'tag-5', name: 'Productivity', slug: 'productivity', description: 'Get more done, better', followerCount: 7600, storyCount: 1900 },
  { id: 'tag-6', name: 'Psychology', slug: 'psychology', description: 'Understanding the human mind', followerCount: 6200, storyCount: 1500 },
  { id: 'tag-7', name: 'Startup', slug: 'startup', description: 'Building and growing companies', followerCount: 9400, storyCount: 2300 },
  { id: 'tag-8', name: 'Writing', slug: 'writing', description: 'The craft of writing well', followerCount: 5800, storyCount: 1700 }
];

// Mock Stories
export const mockStories: Story[] = [
  {
    id: uuidv4(),
    authorId: 'author-1',
    author: mockAuthors[0],
    title: 'The Psychology of Good Design: Why Some Interfaces Just Feel Right',
    subtitle: 'Understanding the invisible forces that make products intuitive and delightful to use',
    content: `Have you ever wondered why some apps feel instantly familiar while others require a manual? The answer lies not in the code, but in centuries of human psychology.

## The Power of Mental Models

When we interact with digital products, we're not starting from scratch. Our brains bring years of real-world experience to every tap, swipe, and click. A well-designed interface leverages these existing mental models.

Consider the "folder" metaphor in file systems. We've never touched a digital folder, yet the concept is immediately clear because it maps to something tangible. This is the power of skeuomorphic design thinking.

## The Invisible UI

The best interfaces are nearly invisible. They get out of the way and let users focus on their goals. This requires understanding not just what users want to do, but why they want to do it.

Key principles:
- **Consistency breeds familiarity**: Use established patterns unless you have a compelling reason not to
- **Progressive disclosure**: Show only what's needed, when it's needed
- **Feedback loops**: Every action should have a clear reaction

## Designing for the Subconscious

Much of our interaction with interfaces happens below conscious awareness. We don't think about tapping a button—we just do it. This is where microinteractions shine.

That subtle animation when you pull to refresh? It's not decoration. It's giving your brain feedback that something is happening, reducing anxiety during loading states.

## The Future: Anticipatory Design

The next frontier is interfaces that anticipate our needs. Not through creepy data mining, but through elegant pattern recognition and contextual awareness.

Imagine an email app that knows you always archive messages from certain senders. It doesn't do it automatically (that would be presumptuous), but it offers a one-tap shortcut exactly when you need it.

## Conclusion

Good design is invisible, intuitive, and deeply human. It respects our cognitive limitations while leveraging our natural capabilities. As designers, our job isn't to make interfaces that look good in screenshots—it's to create experiences that feel effortless in real use.`,
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200',
    tags: [mockTags[1], mockTags[5]],
    publishedAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    createdAt: new Date('2025-01-10'),
    readTime: 8,
    claps: [],
    clapCount: 234,
    comments: [],
    bookmarks: [],
    views: 3421,
    status: 'published'
  },
  {
    id: uuidv4(),
    authorId: 'author-2',
    author: mockAuthors[1],
    title: 'Building Scalable APIs: Lessons from 10 Years in Production',
    subtitle: 'Real-world strategies for APIs that handle millions of requests without breaking',
    content: `After a decade of building and maintaining production APIs, I've learned that scalability isn't about choosing the right database or caching strategy. It's about making thousands of small decisions correctly.

## Start with the Data Model

Your API is only as good as your data model. I've seen teams spend months optimizing queries when the real problem was fundamental schema design.

**Key lessons:**
1. Denormalize strategically, not reflexively
2. Plan for data growth from day one
3. Index thoughtfully—every index has a cost

## The Caching Hierarchy

Caching isn't binary. There's a spectrum from "cache everything" to "cache nothing," and the sweet spot is somewhere in between.

### Layer 1: CDN
Static assets and rarely-changing API responses. Easy wins with huge impact.

### Layer 2: Application Cache
Hot data that changes occasionally. Redis is your friend here.

### Layer 3: Query Results
Database-level caching for complex aggregations.

## Rate Limiting is Love

If you care about your API's reliability, you implement rate limiting. It's not about being restrictive—it's about protecting your system and your users.

We use a token bucket algorithm with different tiers based on authentication level. Anonymous users get 60 req/min, authenticated users get 600, and premium accounts get 6000.

## Versioning: Do It Early

The second-system trap is real. You'll want to change things. When you do, versioning lets you evolve without breaking existing clients.

Our approach: URL versioning (\`/v1/users\`, \`/v2/users\`) with a sunset policy. Each version is supported for 18 months after the next version launches.

## Monitoring: Metrics That Matter

Don't drown in metrics. Focus on what tells you if users are having a good experience:

- **P95 response time**: Not averages—outliers matter
- **Error rate by endpoint**: Some errors are worse than others
- **Request volume trends**: Spot anomalies early

## The Human Factor

Technical excellence matters, but clear documentation and helpful error messages matter more. Your API is a product. Treat it like one.

Every 500 error should have a tracking ID. Every 400 error should explain what went wrong and how to fix it. Every endpoint should have working examples.

## Conclusion

Scalability is a journey, not a destination. Build for today's needs with tomorrow's growth in mind. Document decisions. Monitor relentlessly. And remember: the best API is one that developers actually enjoy using.`,
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200',
    tags: [mockTags[2], mockTags[0]],
    publishedAt: new Date('2025-01-12'),
    updatedAt: new Date('2025-01-12'),
    createdAt: new Date('2025-01-12'),
    readTime: 12,
    claps: [],
    clapCount: 567,
    comments: [],
    bookmarks: [],
    views: 5234,
    status: 'published'
  },
  {
    id: uuidv4(),
    authorId: 'author-3',
    author: mockAuthors[2],
    title: 'AI Isn\'t Magic: A Data Scientist\'s Guide to Understanding Machine Learning',
    subtitle: 'Demystifying the algorithms that are transforming our world',
    content: `The AI hype cycle is real, and it's exhausting. As someone who's worked in machine learning for years, I want to set the record straight: AI isn't magic. It's math, statistics, and a lot of data.

## What AI Actually Is

At its core, machine learning is pattern recognition. Show a model enough examples, and it learns to spot patterns. That's it. No consciousness, no understanding, just really sophisticated pattern matching.

### The Three Types of Learning

**Supervised Learning**: You show the model input-output pairs, and it learns the mapping. Think: predicting house prices based on features.

**Unsupervised Learning**: You give the model data without labels, and it finds structure. Think: customer segmentation.

**Reinforcement Learning**: The model learns by trial and error, receiving rewards for good actions. Think: game-playing AI.

## The Data Problem

Here's the dirty secret of AI: it's not about the algorithm. It's about the data. A simple model with great data beats a complex model with poor data every time.

**Data quality matters more than quantity:**
- Biased data creates biased models
- Noisy data creates unreliable predictions
- Outdated data creates irrelevant models

## Real-World Applications

Let's talk about where AI actually shines:

### Natural Language Processing
Not just chatbots. Sentiment analysis, document summarization, and translation are all getting impressively good.

### Computer Vision
Object detection, facial recognition, and medical imaging analysis are transforming industries.

### Recommendation Systems
Netflix knows what you'll watch. Amazon knows what you'll buy. Spotify knows what you'll listen to. This is where AI makes money.

## The Limitations

AI can't:
- Understand context like humans do
- Explain its reasoning clearly (often)
- Generalize beyond its training data
- Make ethical decisions

## The Ethics Question

Every AI system encodes the biases of its training data and creators. We have a responsibility to:
1. Audit models for bias
2. Make AI decisions explainable
3. Consider the societal impact
4. Give humans final say on important decisions

## Getting Started

Want to learn AI? Here's my advice:
1. Start with Python and basic statistics
2. Take Andrew Ng's Machine Learning course
3. Work on real problems with real data
4. Read papers, but focus on implementation
5. Join the community (Kaggle, GitHub, local meetups)

## The Future

AI will continue to improve, but it won't replace humans. Instead, it will augment our capabilities. The future belongs to people who can work effectively with AI, not to AI alone.

## Conclusion

AI is a powerful tool, but it's just that—a tool. Understanding its capabilities and limitations helps us use it responsibly and effectively. The magic isn't in the technology; it's in how we apply it to solve real problems.`,
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    tags: [mockTags[3], mockTags[0]],
    publishedAt: new Date('2025-01-14'),
    updatedAt: new Date('2025-01-14'),
    createdAt: new Date('2025-01-14'),
    readTime: 10,
    claps: [],
    clapCount: 892,
    comments: [],
    bookmarks: [],
    views: 8765,
    status: 'published'
  }
];

// Initialize mock data
export const initializeBlogMockData = () => {
  return {
    stories: mockStories,
    authors: mockAuthors,
    tags: mockTags
  };
};
