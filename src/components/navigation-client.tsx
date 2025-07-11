'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useAuth } from '@/components/auth-provider';
import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NavigationClientProps {
  isAuthenticated: boolean;
}

export function NavigationClient({ isAuthenticated }: NavigationClientProps) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const utils = trpc.useUtils();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleLogout = async () => {
    try {
      // Immediately clear the auth state in the UI
      clearAuth();
      
      // Call logout API in background
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear the auth query cache
      utils.me.reset();
      
      // Navigate to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, state is already cleared
      utils.me.reset();
      router.push('/');
      router.refresh();
    }
  };

  // Don't render until hydrated to prevent mismatch
  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <Button 
      onClick={handleLogout}
      variant="outline" 
      size="sm"
      className="w-full"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}