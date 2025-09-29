'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  const { user } = useAuth();

  return <Dashboard user={user} />;
}