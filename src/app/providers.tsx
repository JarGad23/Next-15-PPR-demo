'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';
import { useState } from 'react';
import { AppErrorBoundary } from '@/components/error-boundary';
import { AuthProvider } from '@/components/auth-provider';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  bio?: string | null;
  avatar?: string | null;
}

export function Providers({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1, // Reduced retries for faster failure handling
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: false, // Prevent unnecessary refetches
        refetchOnMount: false, // Use cached data on mount
        refetchOnReconnect: false, // Prevent refetch on reconnect
      },
    },
  }));
  
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    })
  );

  return (
    <AppErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider initialUser={initialUser}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </AppErrorBoundary>
  );
}