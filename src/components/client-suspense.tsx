'use client';

import { Suspense } from 'react';
import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function UsersList() {
  const { data: users, isLoading, error } = trpc.users.useQuery();

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
    return <div className="text-red-500">Error loading users: {error.message}</div>;
  }

  return (
    <div className="space-y-3">
      {users?.map((user) => (
        <div key={user.id} className="p-3 border rounded-lg">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      ))}
    </div>
  );
}

function UserDetail({ userId }: { userId: number }) {
  const { data: user, isLoading, error } = trpc.userById.useQuery({ id: userId });

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading user: {error.message}</div>;
  }

  if (!user) {
    return <div className="text-gray-500">User not found</div>;
  }

  return (
    <div className="p-3 border rounded-lg bg-blue-50">
      <h3 className="font-semibold">{user.name}</h3>
      <p className="text-sm text-gray-600">{user.email}</p>
      <p className="text-sm text-gray-700 mt-2">{user.bio}</p>
    </div>
  );
}

export function ClientSuspenseDemo() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Client Suspense Demo</h2>
      <p className="text-gray-600">
        This demonstrates client-side suspense queries with different loading states
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Client-side query with loading state</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            }>
              <UsersList />
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Detail</CardTitle>
            <CardDescription>Dynamic user detail with separate query</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            }>
              <UserDetail userId={1} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}