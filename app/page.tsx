import { createOrUpdateUser } from '@/db';
import { stackServerApp } from '@/stack';

export default async function Home() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    // TODO: Redirect to login page
  } else {
    await createOrUpdateUser(
      stackUser.id,
      stackUser.displayName ?? '',
      stackUser.primaryEmail ?? ''
    );
  }
  return <>{/** Dashboard page? */}</>;
}
