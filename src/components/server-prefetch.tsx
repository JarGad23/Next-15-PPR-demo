import { Suspense } from 'react';
import { serverClient } from '@/utils/trpc';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { ClientPosts } from './client-posts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

async function PrefetchedPosts() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => serverClient.posts.query(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Server-Prefetched Posts</CardTitle>
          <CardDescription>
            These posts are prefetched on the server and hydrated on the client
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          <ClientPosts />
        </CardContent>
      </Card>
    </HydrationBoundary>
  );
}

export function ServerPrefetchDemo() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Server Prefetch Demo</h2>
      <p className="text-gray-600">
        This demonstrates server-side prefetching with client-side hydration
      </p>
      <Suspense fallback={
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Server-Prefetched Posts</CardTitle>
            <CardDescription>Loading prefetched data...</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px]">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
              <div className="p-4 border rounded-lg space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      }>
        <PrefetchedPosts />
      </Suspense>
    </div>
  );
}