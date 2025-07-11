
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { LogoutButton } from './logout-button';

interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  bio?: string | null;
  avatar?: string | null;
}



interface NavigationAuthSectionProps {
  initialUser?: User | null;
}

export function NavigationAuthSection({ initialUser }: NavigationAuthSectionProps) {
  const user = initialUser;

  return (
    <div className="mt-6 pt-4 border-t min-h-[120px]">
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
          <LogoutButton />
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
  );
}