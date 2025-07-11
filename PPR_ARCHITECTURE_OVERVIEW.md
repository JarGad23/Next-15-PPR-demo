# PPR + tRPC + React Query: Complete Architecture Overview

## What is Partial Pre-rendering (PPR)?

Partial Pre-rendering is a Next.js 15 feature that combines the benefits of Static Site Generation (SSG) and Server-Side Rendering (SSR). It allows you to pre-render the static parts of your pages while keeping dynamic content server-rendered and streamed to the client.

## How PPR Works in This Application

### 1. **Static Shell + Dynamic Content**
- **Static parts**: Navigation, headers, layouts, skeleton UI
- **Dynamic parts**: User-specific data, real-time content, database queries
- **Result**: Instant page loads with progressive enhancement

### 2. **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│ React Query Cache │ tRPC Client │ React Components │ UI State │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       NEXT.JS APP ROUTER                       │
├─────────────────────────────────────────────────────────────────┤
│ PPR Pages │ Server Components │ Client Components │ API Routes │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│ tRPC Router │ Server Context │ unstable_cache │ Auth Layer    │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE (Neon)                         │
├─────────────────────────────────────────────────────────────────┤
│ Drizzle ORM │ PostgreSQL │ Session Storage │ User Data       │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components Integration

### 1. **Server-Side Caching with `unstable_cache`**

```typescript
// lib/cache.ts
export const getCachedPosts = unstable_cache(
  async () => getAllPosts(),
  ['posts'],
  {
    revalidate: 300, // 5 minutes
    tags: ['posts'],
  }
);
```

**Benefits:**
- Reduces database queries during build and runtime
- Provides consistent data for static pre-rendering
- Enables selective cache invalidation with tags

### 2. **tRPC Router with PPR-Safe Procedures**

```typescript
// server/api/trpc.ts
export const appRouter = router({
  posts: publicProcedure
    .query(async () => {
      // No artificial delays - instant response
      return await getAllPosts();
    }),
});
```

**Benefits:**
- Type-safe API calls from client to server
- Optimized for both build-time and runtime
- Seamless integration with React Query

### 3. **React Query for Client-Side State**

```typescript
// providers.tsx
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
}));
```

**Benefits:**
- Intelligent caching and background updates
- Optimistic updates and error handling
- Deduplication of concurrent requests

## PPR Implementation Strategy

### 1. **Page-Level PPR**

```typescript
// app/dashboard/page.tsx
export default function DashboardPage() {
  return (
    <div>
      {/* Static shell - pre-rendered */}
      <header>
        <h1>Dashboard</h1>
      </header>
      
      {/* Dynamic content - server-streamed */}
      <Suspense fallback={<DashboardSkeleton />}>
        <PrefetchedDashboardData />
      </Suspense>
    </div>
  );
}
```

### 2. **Component-Level Caching**

```typescript
// Dashboard data fetching
async function PrefetchedDashboardData() {
  // Use cached data for build-time safety
  const [analytics, posts, users] = await Promise.all([
    getCachedAnalytics(),
    getCachedPosts(),
    getCachedUsers(),
  ]);

  // Hydrate React Query cache
  queryClient.setQueryData(['analytics'], analytics);
  queryClient.setQueryData(['posts'], posts);
  queryClient.setQueryData(['users'], users);
}
```

### 3. **Authentication Integration**

```typescript
// components/navigation-server.tsx
export async function NavigationServer() {
  // Server-side auth check
  const initialUser = await getCurrentUser();
  
  return (
    <nav>
      {/* Static navigation */}
      <NavLinks />
      
      {/* Auth-dependent UI */}
      {initialUser ? (
        <UserProfile user={initialUser} />
      ) : (
        <AuthButtons />
      )}
    </nav>
  );
}
```

## Performance Benefits

### 1. **Build-Time Optimization**
- ✅ Static generation of page shells
- ✅ Pre-computation of cacheable data
- ✅ Optimal bundle splitting

### 2. **Runtime Performance**
- ✅ Instant page loads (static shell)
- ✅ Progressive enhancement (dynamic content)
- ✅ Efficient caching strategies

### 3. **User Experience**
- ✅ No loading skeletons on navigation
- ✅ Immediate visual feedback
- ✅ Smooth transitions between states

## Why This Architecture?

### 1. **Best of Both Worlds**
- **Static**: SEO-friendly, fast loading, CDN-cacheable
- **Dynamic**: Real-time data, personalization, interactivity

### 2. **Developer Experience**
- **Type Safety**: End-to-end TypeScript with tRPC
- **Debugging**: React Query DevTools for client state
- **Caching**: Automatic cache management

### 3. **Performance**
- **First Paint**: Instant static shell
- **Time to Interactive**: Progressive enhancement
- **Bandwidth**: Efficient data fetching

## Build Output Analysis

```
Route (app)                      Size    First Load JS  Revalidate
├ ◐ /dashboard                   4.66 kB    151 kB          5m
├ ◐ /posts/[id]                  5.88 kB    153 kB          5m
├ ◐ /users                       3.25 kB    150 kB         10m
└ ◐ /users/[id]                  3.97 kB    151 kB          5m
```

**Legend:**
- ◐ (Partial Prerender) = PPR-enabled with static shell + dynamic content
- Revalidate = Cache invalidation interval

## Cache Strategy

### 1. **Layered Caching**
```
Browser Cache → React Query Cache → Next.js Cache → Database
```

### 2. **Cache Durations**
- **Posts**: 5 minutes (frequently updated)
- **Users**: 10 minutes (moderately stable)
- **Analytics**: 15 minutes (slowly changing)

### 3. **Cache Invalidation**
- **Tag-based**: Selective invalidation
- **Time-based**: Automatic revalidation
- **Manual**: On-demand cache clearing

## Best Practices Implemented

### 1. **Error Handling**
```typescript
export const getCachedPosts = unstable_cache(
  async () => {
    try {
      return await getAllPosts();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return []; // Graceful fallback
    }
  }
);
```

### 2. **Type Safety**
```typescript
// Full type safety from database to UI
type Post = InferSelectModel<typeof posts>;
type User = InferSelectModel<typeof users>;
```

### 3. **Performance Optimization**
```typescript
// Batched requests
const [analytics, posts, users] = await Promise.all([
  getCachedAnalytics(),
  getCachedPosts(),
  getCachedUsers(),
]);
```

## Deployment Considerations

### 1. **Vercel Optimizations**
- ✅ Edge caching for static content
- ✅ Serverless functions for dynamic content
- ✅ ISR (Incremental Static Regeneration)

### 2. **Environment Variables**
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
NODE_ENV=production
```

### 3. **Build Process**
```bash
npm run build      # Static generation + PPR
npm run start      # Production server
```

## Conclusion

This architecture provides:
- **Instant page loads** through static pre-rendering
- **Fresh data** through selective caching and revalidation
- **Type safety** with tRPC and TypeScript
- **Great UX** with progressive enhancement
- **Developer productivity** with modern tooling

The combination of PPR + tRPC + React Query creates a powerful, performant, and maintainable web application that delivers exceptional user experience while maintaining developer productivity.