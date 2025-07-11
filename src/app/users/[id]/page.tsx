import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { UserProfile } from '@/components/user-profile';
import { UserPosts } from '@/components/user-posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCachedUserById, getCachedUserPosts } from '@/lib/cache';

interface UserPageProps {
  params: Promise<{ id: string }>;
}

async function PrefetchedUserData({ userId }: { userId: number }) {
  const queryClient = new QueryClient();

  // Use cached data directly
  const [user, userPosts] = await Promise.all([
    getCachedUserById(userId),
    getCachedUserPosts(userId),
  ]);

  // Set the cached data in the query client
  queryClient.setQueryData(['user', userId], user);
  queryClient.setQueryData(['userPosts', userId], userPosts);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <UserProfile userId={userId} />
        </div>
        <div className="md:col-span-2">
          <UserPosts userId={userId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = await params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    notFound();
  }

  const user = await getCachedUserById(userId);
  
  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
        <p className="text-gray-600">User Profile & Posts</p>
      </div>

      <Suspense fallback={
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="w-20 h-20 bg-gray-200 rounded-full animate-pulse mb-4"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      }>
        <PrefetchedUserData userId={userId} />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];
}

export async function generateMetadata({ params }: UserPageProps) {
  const { id } = await params;
  const userId = parseInt(id);
  
  if (isNaN(userId)) {
    return { title: 'User Not Found' };
  }

  try {
    const user = await getCachedUserById(userId);
    return {
      title: `${user?.name || 'User'} - Profile`,
      description: user?.bio || 'User profile page',
    };
  } catch {
    return { title: 'User Profile' };
  }
}