'use client';

import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Mail, Users, FileText } from 'lucide-react';

interface UserProfileProps {
  userId: number;
}

export function UserProfile({ userId }: UserProfileProps) {
  const { data: user, isLoading, error } = trpc.userById.useQuery({ id: userId });

  if (isLoading) {
    return (
      <Card>
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
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-500">Error loading user: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-gray-500">User not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-gray-600">{user.bio}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarDays className="w-4 h-4" />
          <span>Joined {new Date(user.joinedAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{user.postsCount} posts</span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm">
              <strong>{user.followers}</strong> followers
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm">
              <strong>{user.following}</strong> following
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Active User</Badge>
          <Badge variant="outline">Verified</Badge>
        </div>
      </CardContent>
    </Card>
  );
}