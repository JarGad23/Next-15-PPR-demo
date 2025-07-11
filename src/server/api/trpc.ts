import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '../context';
import {
  getAllPosts,
  getPostById,
  getUserById,
  getAllUsers,
  getPostsByUserId,
  getAnalytics,
  searchPosts,
} from '@/db/queries';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.auth.isAuthenticated || !ctx.auth.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      auth: {
        ...ctx.auth,
        user: ctx.auth.user,
      },
    },
  });
});

export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.auth.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN' });
  }
  return next({ ctx });
});

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name}!`,
      };
    }),

  posts: publicProcedure
    .query(async () => {
      return await getAllPosts();
    }),

  postById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getPostById(input.id);
    }),

  users: publicProcedure
    .query(async () => {
      const users = await getAllUsers();
      return users.map(user => ({
        ...user,
        postsCount: Math.floor(Math.random() * 20) + 1, // Mock value for now
      }));
    }),

  userById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const user = await getUserById(input.id);
      if (!user) return null;
      
      const posts = await getPostsByUserId(input.id);
      return {
        ...user,
        posts,
        postsCount: posts.length,
        followers: Math.floor(Math.random() * 500) + 100,
        following: Math.floor(Math.random() * 200) + 50,
      };
    }),

  userPosts: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await getPostsByUserId(input.userId);
    }),

  analytics: publicProcedure
    .query(async () => {
      return await getAnalytics();
    }),

  recentActivity: publicProcedure
    .query(async () => {
      return [
        { id: 1, type: 'post', message: 'New post created', timestamp: new Date().toISOString() },
        { id: 2, type: 'user', message: 'User joined the platform', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
        { id: 3, type: 'like', message: 'Post liked', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
      ];
    }),

  searchPosts: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      return await searchPosts(input.query);
    }),

  // Auth procedures
  me: protectedProcedure
    .query(({ ctx }) => {
      return ctx.auth.user;
    }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(2).optional(),
      bio: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      // In a real app, you'd update the user in the database
      return {
        ...ctx.auth.user,
        ...input,
        updatedAt: new Date().toISOString(),
      };
    }),

  // Admin procedures
  adminStats: adminProcedure
    .query(async () => {
      const analytics = await getAnalytics();
      return {
        totalUsers: analytics.totalUsers,
        totalPosts: analytics.totalPosts,
        systemHealth: 'excellent' as const,
        lastBackup: new Date().toISOString(),
      };
    }),

  deletePost: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      // In a real app, you'd delete the post from the database
      return { success: true, deletedId: input.id };
    }),
});

export type AppRouter = typeof appRouter;