import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import { PostDetail } from '@/components/post-detail';
import { PostComments } from '@/components/post-comments';
import { RelatedPosts } from '@/components/related-posts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCachedPostById, getCachedPosts } from '@/lib/cache';

interface PostPageProps {
  params: Promise<{ id: string }>;
}

async function PrefetchedPostData({ postId }: { postId: number }) {
  const queryClient = new QueryClient();

  // Use cached data directly
  const [post, posts] = await Promise.all([
    getCachedPostById(postId),
    getCachedPosts(),
  ]);

  // Set the cached data in the query client
  queryClient.setQueryData(['post', postId], post);
  queryClient.setQueryData(['posts'], posts);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PostDetail postId={postId} />
          <div className="mt-8">
            <PostComments postId={postId} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <RelatedPosts currentPostId={postId} />
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params;
  const postId = parseInt(id);

  if (isNaN(postId)) {
    notFound();
  }

  const post = await getCachedPostById(postId);
  
  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-600">
          by {post.author?.name} • {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>

      <Suspense fallback={
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
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
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Related Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      }>
        <PrefetchedPostData postId={postId} />
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
    { id: '5' },
  ];
}

export async function generateMetadata({ params }: PostPageProps) {
  const { id } = await params;
  const postId = parseInt(id);
  
  if (isNaN(postId)) {
    return { title: 'Post Not Found' };
  }

  try {
    const post = await getCachedPostById(postId);
    return {
      title: `${post?.title || 'Post'} - PPR Demo`,
      description: post?.content.substring(0, 160) || 'Post content',
    };
  } catch {
    return { title: 'Post Detail' };
  }
}