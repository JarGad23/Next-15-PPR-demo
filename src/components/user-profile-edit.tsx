'use client';

import React, { useState } from 'react';
import { trpc } from '@/utils/trpc';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, User } from 'lucide-react';

interface UserProfileEditProps {
  user: { id: number };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UserProfileEdit({ user: _userProp }: UserProfileEditProps) {
  const { user: authUser, isAuthenticated } = useAuth();
  const { data: currentUser, isLoading } = trpc.me.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const updateProfileMutation = trpc.updateProfile.useMutation();
  
  // Use the authenticated user from context or the current user from query
  const currentUserData = currentUser || authUser;
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Update form when user data loads
  React.useEffect(() => {
    if (currentUserData) {
      setFormData({
        name: currentUserData.name || '',
        bio: currentUserData.bio || '',
      });
    }
  }, [currentUserData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfileMutation.mutateAsync(formData);
      setHasChanges(false);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  if (isLoading && !currentUserData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Profile Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={currentUserData?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          {updateProfileMutation.error && (
            <Alert variant="destructive">
              <AlertDescription>
                {updateProfileMutation.error.message}
              </AlertDescription>
            </Alert>
          )}

          {updateProfileMutation.isSuccess && (
            <Alert>
              <AlertDescription>
                Profile updated successfully!
              </AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={!hasChanges || updateProfileMutation.isPending}
            className="w-full"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}