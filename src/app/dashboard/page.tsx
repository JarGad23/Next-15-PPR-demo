import { Suspense } from 'react';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { AnalyticsDashboard } from '@/components/analytics-dashboard';
import { RecentActivity } from '@/components/recent-activity';
import { PostsList } from '@/components/posts-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCachedAnalytics, getCachedPosts, getCachedUsers } from '@/lib/cache';

async function PrefetchedDashboardData() {
  const queryClient = new QueryClient();

  // Use cached data directly instead of prefetching
  const [analytics, posts, users] = await Promise.all([
    getCachedAnalytics(),
    getCachedPosts(),
    getCachedUsers(),
  ]);

  // Prefetch with cached data
  queryClient.setQueryData(['analytics'], analytics);
  queryClient.setQueryData(['posts'], posts);
  queryClient.setQueryData(['users'], users);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-8">
        <AnalyticsDashboard />
        
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <PostsList />
          </div>
          <div className="lg:col-span-1">
            <Suspense fallback={
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            }>
              <RecentActivity />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-xl text-gray-600">
          Real-time analytics and activity feed demonstrating PPR with multiple data sources
        </p>
      </div>

      <Suspense fallback={
        <div className="space-y-8">
          {/* Analytics Cards Skeleton */}
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
                    {i === 4 && (
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <div className="h-6 w-36 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Posts List Skeleton */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="space-y-2 mb-3">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse mt-2"></div>
                      <div className="flex-1">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }>
        <PrefetchedDashboardData />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: 'Dashboard - PPR Demo',
  description: 'Real-time dashboard demonstrating Next.js PPR with multiple data sources',
};