import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { NavigationClient } from '@/components/navigation-client';
import { NavigationLinks } from '@/components/navigation-links';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  bio?: string | null;
  avatar?: string | null;
}

export function NavigationServer({ initialUser }: { initialUser?: User | null }) {
  const user = initialUser;

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

        {/* Client-side navigation links with active state */}
        <NavigationLinks isAuthenticated={!!user} />

        {/* Client-side auth section with hydration */}
        <div className="mt-6 pt-4 border-t">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <NavigationClient isAuthenticated={true} />
            </div>
          ) : (
            <div className="flex flex-col gap-y-2">
              <Link href="/auth/login" className="cursor-pointer">
                <Button variant="default" size="sm" className="w-full cursor-pointer">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup" className="cursor-pointer">
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