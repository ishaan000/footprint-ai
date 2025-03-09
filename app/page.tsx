import { stackServerApp } from '@/stack';

export default async function Home() {
  const stackUser = await stackServerApp.getUser();
  console.log('Stack User:', stackUser);

  return <>{/** This page should not really exist */}</>;
}
