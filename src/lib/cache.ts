import { unstable_cache } from 'next/cache';
import { 
  getAllPosts, 
  getAllUsers, 
  getUserById, 
  getPostById, 
  getPostsByUserId, 
  getAnalytics 
} from '@/db/queries';

// Cache tags for revalidation
export const CACHE_TAGS = {
  POSTS: 'posts',
  USERS: 'users',
  ANALYTICS: 'analytics',
  USER_POSTS: 'user-posts',
} as const;

// Build-time safe cached data fetchers using direct database queries
export const getCachedPosts = unstable_cache(
  async () => {
    try {
      return await getAllPosts();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  },
  ['posts'],
  {
    revalidate: 300, // 5 minutes
    tags: [CACHE_TAGS.POSTS],
  }
);

export const getCachedUsers = unstable_cache(
  async () => {
    try {
      const users = await getAllUsers();
      return users.map(user => ({
        ...user,
        postsCount: Math.floor(Math.random() * 20) + 1, // Mock value for now
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },
  ['users'],
  {
    revalidate: 600, // 10 minutes
    tags: [CACHE_TAGS.USERS],
  }
);

export const getCachedAnalytics = unstable_cache(
  async () => {
    try {
      return await getAnalytics();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalViews: 0,
      };
    }
  },
  ['analytics'],
  {
    revalidate: 900, // 15 minutes
    tags: [CACHE_TAGS.ANALYTICS],
  }
);

export const getCachedUserById = unstable_cache(
  async (id: number) => {
    try {
      const user = await getUserById(id);
      if (!user) return null;
      
      const posts = await getPostsByUserId(id);
      return {
        ...user,
        posts,
        postsCount: posts.length,
        followers: Math.floor(Math.random() * 500) + 100,
        following: Math.floor(Math.random() * 200) + 50,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },
  ['user-by-id'],
  {
    revalidate: 300, // 5 minutes
    tags: [CACHE_TAGS.USERS],
  }
);

export const getCachedUserPosts = unstable_cache(
  async (userId: number) => {
    try {
      return await getPostsByUserId(userId);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  },
  ['user-posts'],
  {
    revalidate: 300, // 5 minutes
    tags: [CACHE_TAGS.USER_POSTS, CACHE_TAGS.POSTS],
  }
);

export const getCachedPostById = unstable_cache(
  async (id: number) => {
    try {
      return await getPostById(id);
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  },
  ['post-by-id'],
  {
    revalidate: 300, // 5 minutes
    tags: [CACHE_TAGS.POSTS],
  }
);