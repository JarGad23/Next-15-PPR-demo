'use client';

import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye, Calendar, User } from 'lucide-react';
import Link from 'next/link';

interface PostDetailProps {
  postId: number;
}

export function PostDetail({ postId }: PostDetailProps) {
  const { data: post, isLoading, error } = trpc.postById.useQuery({ id: postId });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-red-500">Error loading post: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (!post) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-gray-500">Post not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">{post.title}</CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <Link href={`/users/${post.author?.id}`} className="hover:text-blue-600">
              {post.author?.name}
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="prose max-w-none">
          <p className="text-lg leading-relaxed text-gray-700">{post.content}</p>
        </div>
        
        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium">{post.likes}</span>
              <span className="text-gray-500">likes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-gray-500" />
              <span className="font-medium">{post.views}</span>
              <span className="text-gray-500">views</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">Article</Badge>
            <Badge variant="outline">Published</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}