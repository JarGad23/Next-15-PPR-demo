'use client';

import { trpc } from '@/utils/trpc';

export function ClientPosts() {
  const { data: posts, isLoading, error } = trpc.posts.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading posts: {error.message}</div>;
  }

  return (
    <div className="space-y-3">
      {posts?.map((post) => (
        <div key={post.id} className="p-3 border rounded-lg">
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-600">{post.content}</p>
        </div>
      ))}
    </div>
  );
}