"use client";

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/utils/trpc';
import { useAuth } from '@/components/auth-provider';

export function LogoutButton() {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const utils = trpc.useUtils();
  
  const handleLogout = async () => {
    try {
      clearAuth();
      await fetch('/api/auth/logout', { method: 'POST' });
      utils.me.reset();
      router.push('/');
      router.refresh();
    } catch {
      utils.me.reset();
      router.push('/');
      router.refresh();
    }
  };

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
