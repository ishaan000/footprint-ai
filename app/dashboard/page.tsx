import { fetchUserCarbonEvents } from '@/db';
import { stackServerApp } from '@/stack';

import Dashboard from '@/components/dashboard';

import {
  CARBON_EVENT_TYPES,
  CarbonEvent,
  CarbonEventCategory,
} from '@/types/CarbonEvents';

export default async function DashboardPage() {
  const user = await stackServerApp.getUser();
  const userId = user?.id ?? '';
  if (!userId) {
    throw new Error('User not found');
  }

  const userCarbonEvents = await fetchUserCarbonEvents(userId);

  // Format user carbon events
  const initialCarbonEvents: CarbonEvent[] = userCarbonEvents.map((event) => ({
    id: event.id,
    date: event.date.toISOString(),
    description: event.description,
    carbonScore: event.carbon_score,
    category: event.category as CarbonEventCategory,
    type:
      CARBON_EVENT_TYPES.find((a) => a.name === event.type) ??
      CARBON_EVENT_TYPES[0],
  }));

  return (
    <Dashboard userStackAuthId={userId} initialEvents={initialCarbonEvents} />
  );
}
