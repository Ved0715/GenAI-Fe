import { getServerSideUser } from '@/lib/auth';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage() {
  const user = await getServerSideUser();

  return <DashboardClient initialUser={user} />;
}