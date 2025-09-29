'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Dashboard user={user} />
    </DashboardLayout>
  );
}