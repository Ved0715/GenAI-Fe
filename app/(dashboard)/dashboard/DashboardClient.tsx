'use client';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { User } from '@/lib/types';

interface DashboardClientProps {
  initialUser: User | null;
}

function DashboardContent() {
  const { user, logout, logoutAll, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAll();
    } catch (error) {
      console.error('Logout all failed:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={handleLogoutAll}
                disabled={isLoading}
              >
                Logout All Devices
              </Button>
              <Button
                variant="danger"
                onClick={handleLogout}
                disabled={isLoading}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Welcome, {user.name}!
                </h3>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Account created:</strong>{' '}
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email verified:</strong>{' '}
                    {user.is_email_verified ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Session Management
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Manage your active sessions across all devices.
                </p>
                <div className="mt-4 space-x-4">
                  <Button
                    variant="secondary"
                    onClick={handleLogoutAll}
                    disabled={isLoading}
                  >
                    Logout from All Devices
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    Logout from This Device
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function DashboardClient({ initialUser }: DashboardClientProps) {
  return (
    <AuthProvider initialUser={initialUser}>
      <DashboardContent />
    </AuthProvider>
  );
}