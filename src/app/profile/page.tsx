import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/auth';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { UserProfileEdit } from '@/components/user-profile-edit';
import { UserStats } from '@/components/user-stats';
import { RecentUserActivity } from '@/components/recent-user-activity';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCachedUserPosts, getCachedAnalytics } from '@/lib/cache';

async function PrefetchedProfileData({ userId }: { userId: number }) {
  const queryClient = new QueryClient();

  // Use cached data directly
  const [userPosts, analytics] = await Promise.all([
    getCachedUserPosts(userId),
    getCachedAnalytics(),
  ]);

  // Set the cached data in the query client
  queryClient.setQueryData(['userPosts', userId], userPosts);
  queryClient.setQueryData(['analytics'], analytics);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UserProfileEdit user={{ id: userId }} />
          <div className="mt-8">
            <UserStats userId={userId} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <RecentUserActivity userId={userId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your account settings and view your activity
        </p>
      </div>

      <Suspense fallback={
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Profile Settings Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                  <span>Profile Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  {/* Email Field */}
                  <div className="space-y-2">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  {/* Bio Field */}
                  <div className="space-y-2">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-20 w-full bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  {/* Save Button */}
                  <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
            {/* User Stats Skeleton */}
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="text-center">
                        <div className="h-8 w-12 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="lg:col-span-1">
            {/* Recent Activity Skeleton */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
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
        <PrefetchedProfileData userId={user.id} />
      </Suspense>
    </div>
  );
}

// Force dynamic rendering for authentication-dependent page
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Profile - PPR Demo',
  description: 'User profile page demonstrating protected routes with PPR',
};