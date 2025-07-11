'use client';

import { trpc } from '@/utils/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye } from 'lucide-react';
import Link from 'next/link';

interface RelatedPostsProps {
  currentPostId: number;
}

export function RelatedPosts({ currentPostId }: RelatedPostsProps) {
  const { data: posts, isLoading, error } = trpc.posts.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border rounded">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Related Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error loading related posts: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const relatedPosts = posts?.filter(post => post.id !== currentPostId).slice(0, 4) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Posts</CardTitle>
      </CardHeader>
      <CardContent>
        {relatedPosts.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No related posts</div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {relatedPosts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className="p-3 border rounded hover:bg-gray-50 transition-colors cursor-pointer">
                  <h4 className="font-medium mb-1 hover:text-blue-600 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    by {post.author?.name}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{post.views}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Article
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}