import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavigationLinks } from '@/components/navigation-links';
import { NavigationAuthSection } from '@/components/navigation-auth-section';

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
        <NavigationAuthSection initialUser={user} />
        
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