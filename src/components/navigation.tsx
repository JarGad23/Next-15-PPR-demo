'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import { useAuth } from '@/components/auth-provider';
import { Home, Users, BarChart3, LogIn, LogOut } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Profile', href: '/profile', icon: Users, protected: true },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user: currentUser, isLoading, clearAuth } = useAuth();
  const utils = trpc.useUtils();

  const handleLogout = async () => {
    try {
      // Immediately clear the auth state in the UI
      clearAuth();
      
      // Call logout API in background
      await fetch('/api/auth/logout', { method: 'POST' });
      
      // Clear the auth query cache completely
      await utils.me.reset();
      
      // Navigate to home
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, state is already cleared
      await utils.me.reset();
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Card className="sticky top-4">
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">PPR</span>
          </div>
          <div>
            <h2 className="font-semibold">Next.js PPR Demo</h2>
            <Badge variant="secondary" className="text-xs">
              v15.4.0-canary
            </Badge>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            // Hide protected routes if not authenticated
            if (item.protected && !currentUser) return null;
            
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Auth Section */}
        <div className="mt-6 pt-4 border-t">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
            </div>
          ) : currentUser ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {currentUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-y-2">
              <Link href="/auth/login" className='cursor-pointer'>
                <Button variant="default" size="sm" className="w-full cursor-pointer">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" className='cursor-pointer'>
                <Button variant="outline" size="sm" className="w-full cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="text-xs text-gray-500 space-y-1">
            <p>Features demonstrated:</p>
            <ul className="space-y-1 ml-2">
              <li>• Partial Pre-rendering</li>
              <li>• Database integration</li>
              <li>• Authentication</li>
              <li>• Protected routes</li>
              <li>• Server-side caching</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}