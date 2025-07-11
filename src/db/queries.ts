import { eq, desc, and, count } from 'drizzle-orm';
import { db } from './index';
import { users, posts, comments, sessions, type User } from './schema';

// User queries
export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function createUser(userData: {
  name: string;
  email: string;
  passwordHash: string;
  bio?: string;
}) {
  const result = await db.insert(users).values(userData).returning();
  return result[0];
}

export async function updateUser(id: number, updates: Partial<User>) {
  const result = await db.update(users)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(users.id, id))
    .returning();
  return result[0];
}

export async function getAllUsers() {
  return await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    bio: users.bio,
    avatar: users.avatar,
    joinedAt: users.joinedAt,
    role: users.role,
  }).from(users).where(eq(users.isActive, true));
}

// Post queries
export async function getAllPosts() {
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    authorId: posts.authorId,
    createdAt: posts.createdAt,
    likes: posts.likes,
    views: posts.views,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.isPublished, true))
  .orderBy(desc(posts.createdAt));
}

export async function getPostById(id: number) {
  const result = await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    authorId: posts.authorId,
    createdAt: posts.createdAt,
    likes: posts.likes,
    views: posts.views,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(and(eq(posts.id, id), eq(posts.isPublished, true)))
  .limit(1);

  if (result.length === 0) return null;

  // Get comments for this post
  const postComments = await db.select({
    id: comments.id,
    content: comments.content,
    createdAt: comments.createdAt,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
    }
  })
  .from(comments)
  .leftJoin(users, eq(comments.authorId, users.id))
  .where(eq(comments.postId, id))
  .orderBy(desc(comments.createdAt));

  return {
    ...result[0],
    comments: postComments,
  };
}

export async function getPostsByUserId(userId: number) {
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    authorId: posts.authorId,
    createdAt: posts.createdAt,
    likes: posts.likes,
    views: posts.views,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(and(eq(posts.authorId, userId), eq(posts.isPublished, true)))
  .orderBy(desc(posts.createdAt));
}

export async function createPost(postData: {
  title: string;
  content: string;
  authorId: number;
}) {
  const result = await db.insert(posts).values(postData).returning();
  return result[0];
}

export async function incrementPostViews(id: number) {
  await db.update(posts)
    .set({ views: posts.views })
    .where(eq(posts.id, id));
}

// Session queries
export async function createSession(sessionData: {
  id: string;
  userId: number;
  expiresAt: Date;
}) {
  const result = await db.insert(sessions).values(sessionData).returning();
  return result[0];
}

export async function getSessionById(id: string) {
  const result = await db.select({
    id: sessions.id,
    userId: sessions.userId,
    expiresAt: sessions.expiresAt,
    user: {
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      bio: users.bio,
      avatar: users.avatar,
      joinedAt: users.joinedAt,
    }
  })
  .from(sessions)
  .leftJoin(users, eq(sessions.userId, users.id))
  .where(eq(sessions.id, id))
  .limit(1);

  return result[0] || null;
}

export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id));
}

export async function deleteExpiredSessions() {
  await db.delete(sessions).where(eq(sessions.expiresAt, new Date()));
}

// Analytics queries
export async function getAnalytics() {
  const [userCount] = await db.select({ count: count() }).from(users).where(eq(users.isActive, true));
  const [postCount] = await db.select({ count: count() }).from(posts).where(eq(posts.isPublished, true));
  
  return {
    totalUsers: userCount.count,
    totalPosts: postCount.count,
    dailyActiveUsers: Math.floor(userCount.count * 0.6), // Mock value
    weeklyGrowth: 12.5, // Mock value
    topCategories: ['React', 'Next.js', 'TypeScript', 'Node.js'],
  };
}

// Search queries
export async function searchPosts(query: string) {
  // For now, return all posts since we don't have full-text search setup
  // In production, you'd implement proper text search with the query parameter
  
  return await db.select({
    id: posts.id,
    title: posts.title,
    content: posts.content,
    authorId: posts.authorId,
    createdAt: posts.createdAt,
    likes: posts.likes,
    views: posts.views,
    author: {
      id: users.id,
      name: users.name,
      email: users.email,
      avatar: users.avatar,
    }
  })
  .from(posts)
  .leftJoin(users, eq(posts.authorId, users.id))
  .where(eq(posts.isPublished, true))
  .orderBy(desc(posts.createdAt));
}