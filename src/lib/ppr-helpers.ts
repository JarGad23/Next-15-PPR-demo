import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from './cache';

// Helper functions for PPR optimization

export function createStaticShell(content: React.ReactNode, fallback: React.ReactNode) {
  return {
    staticContent: content,
    dynamicFallback: fallback,
  };
}

// Cache invalidation helpers for different content types
export async function invalidatePostsCache() {
  revalidateTag(CACHE_TAGS.POSTS);
}

export async function invalidateUsersCache() {
  revalidateTag(CACHE_TAGS.USERS);
}

export async function invalidateAnalyticsCache() {
  revalidateTag(CACHE_TAGS.ANALYTICS);
}

export async function invalidateUserPostsCache() {
  revalidateTag(CACHE_TAGS.USER_POSTS);
}

// Helper to ensure proper PPR boundaries
export function createPPRBoundary(
  staticContent: React.ReactNode,
  dynamicContent: React.ReactNode,
  fallback: React.ReactNode
) {
  return {
    static: staticContent,
    dynamic: dynamicContent,
    fallback: fallback,
  };
}

// Type definitions for PPR optimization
export interface PPRPageProps {
  staticData?: unknown;
  dynamicData?: unknown;
  fallbackData?: unknown;
}

export interface PPRComponentProps {
  initialData?: unknown;
  fallback?: React.ReactNode;
  enablePPR?: boolean;
}