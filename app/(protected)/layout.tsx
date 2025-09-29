import { redirect } from 'next/navigation';
import { getServerSideUser } from '@/lib/auth-server';
import { AuthProvider } from '@/contexts/AuthContext';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check - no loading states needed!
  const user = await getServerSideUser();

  // If not authenticated, redirect immediately on server
  if (!user) {
    redirect('/login');
  }

  // User is authenticated, render with user data
  return (
    <AuthProvider initialUser={user}>
      <DashboardShell>
        {children}
      </DashboardShell>
    </AuthProvider>
  );
}