'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>Something went wrong</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-gray-600">
          <p className="mb-2">We encountered an unexpected error:</p>
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <code className="text-sm text-red-800">{error.message}</code>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={resetErrorBoundary}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try again</span>
          </Button>
          
          <Link href="/">
            <Button variant="default" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Go home</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

interface AppErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
}

export function AppErrorBoundary({ children, fallback }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error caught by boundary:', error, errorInfo);
        // Here you would typically send to an error reporting service
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-800 font-medium">Query Error</span>
          </div>
          <p className="text-red-700 text-sm mb-3">{error.message}</p>
          <Button 
            onClick={resetErrorBoundary}
            size="sm"
            variant="outline"
            className="text-red-700 border-red-300 hover:bg-red-100"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </Button>
        </div>
      )}
      onError={(error) => {
        console.error('Query error:', error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}