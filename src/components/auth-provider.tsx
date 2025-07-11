'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  bio?: string | null;
  avatar?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refetchUser: () => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ 
  children, 
  initialUser 
}: { 
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [isClient, setIsClient] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  
  const { 
    data: user, 
    isLoading, 
    refetch
  } = trpc.me.useQuery(undefined, {
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - longer for auth stability
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: false, // Use initialUser instead of refetching
    refetchOnReconnect: false, // Don't refetch on reconnect
    // Don't suspend on error, just treat as not authenticated
    throwOnError: false,
    enabled: !isLoggedOut && isClient && !initialUser, // Query on client-side unless logged out or initial user exists
  });

  useEffect(() => {
    setIsClient(true);
    // Small delay to prevent flash during hydration
    const timer = setTimeout(() => setHasHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const clearAuth = () => {
    setIsLoggedOut(true);
  };

  const handleRefetch = () => {
    setIsLoggedOut(false);
    refetch();
  };

  // Determine the current user - prevent hydration flash
  const currentUser: User | null = isLoggedOut ? null : 
    (hasHydrated ? (user || initialUser || null) : (initialUser || null));
  
  const value = {
    user: currentUser,
    isLoading: isClient && hasHydrated ? (isLoading && !isLoggedOut) : false, // Never loading on server or during hydration
    isAuthenticated: !isLoggedOut && !!currentUser,
    refetchUser: handleRefetch,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}