import { Suspense } from 'react';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { UsersList } from '@/components/users-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCachedUsers } from '@/lib/cache';

async function PrefetchedUsersData() {
  const queryClient = new QueryClient();

  // Use cached data directly
  const users = await getCachedUsers();

  // Set the cached data in the query client
  queryClient.setQueryData(['users'], users);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersList />
    </HydrationBoundary>
  );
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600">Browse all users on the platform</p>
      </div>

      <Suspense fallback={
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      }>
        <PrefetchedUsersData />
      </Suspense>
    </div>
  );
}

export const metadata = {
  title: 'Users - PPR Demo',
  description: 'Browse all users on the platform',
};