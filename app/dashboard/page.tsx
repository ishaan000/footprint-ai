import { stackServerApp } from '@/stack';

import Dashboard from '@/components/dashboard';

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  const userId = user?.id ?? '';
  if (!userId) {
    throw new Error('User not found');
  }
  return <Dashboard />;
}
