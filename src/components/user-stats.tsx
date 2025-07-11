'use client';

import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Heart, Eye, Calendar } from 'lucide-react';

interface UserStatsProps {
  userId: number;
}

export function UserStats({ userId }: UserStatsProps) {
  const { data: posts, isLoading } = trpc.userPosts.useQuery({ userId });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalLikes = posts?.reduce((sum, post) => sum + post.likes, 0) || 0;
  const totalViews = posts?.reduce((sum, post) => sum + post.views, 0) || 0;
  const postsCount = posts?.length || 0;
  const avgLikes = postsCount > 0 ? Math.round(totalLikes / postsCount) : 0;

  const stats = [
    {
      title: 'Posts',
      value: postsCount,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Likes',
      value: totalLikes,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Avg Likes',
      value: avgLikes,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.title} className="text-center">
              <div className={`inline-flex p-3 rounded-full ${stat.bgColor} mb-2`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}