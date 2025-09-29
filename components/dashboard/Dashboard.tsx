'use client';

interface User {
  id?: string;
  name?: string;
  email?: string;
}

interface DashboardProps {
  user: User | null;
}

export function Dashboard({ user }: DashboardProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
            FLOX
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Welcome back, {user?.name || 'User'}
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Your modern dashboard experience starts here
          </p>
        </div>

        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce delay-75"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
}