'use client';

import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const CustomFallback = this.props.fallback;

      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            reset={() => this.setState({ hasError: false, error: undefined })}
          />
        );
      }

      return <DefaultErrorFallback error={this.state.error} reset={() => this.setState({ hasError: false, error: undefined })} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong!</h1>
          <p className="text-gray-400">
            We're sorry, but something unexpected happened. Please try again.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
            <h3 className="text-red-400 font-medium mb-2">Error Details:</h3>
            <pre className="text-red-300 text-sm overflow-x-auto">
              {error.message}
            </pre>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
export { DefaultErrorFallback };