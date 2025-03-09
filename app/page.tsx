import { createOrUpdateUser } from '@/db';
import { stackServerApp } from '@/stack';
import { SignUp } from '@stackframe/stack';

export default async function Home() {
  const stackUser = await stackServerApp.getUser();
  if (!stackUser) {
    // User not signed in, show sign up page
    return (
      <SignUp
        fullPage={true}
        automaticRedirect={true}
        firstTab='password'
        extraInfo={
          <>
            By signing up, you agree to our <a href='/terms'>Terms</a>
          </>
        }
      />
    );
  } else {
    await createOrUpdateUser(
      stackUser.id,
      stackUser.displayName ?? '',
      stackUser.primaryEmail ?? ''
    );
  }
  return <>{/** Dashboard page? */}</>;
}
