import Link from 'next/link';

import { stackServerApp } from '@/stack';
import { UserButton } from '@stackframe/stack';

export async function Header() {
  const user = await stackServerApp.getUser();
  const app = stackServerApp.urls;

  return (
    <header className='z-10 flex w-full items-center justify-between px-6 py-4'>
      <div className='text-[15px] font-medium tracking-tight'>
        <Link href='/'>Footprint</Link>
      </div>
      {user ? (
        <div className='flex items-center gap-4'>
          <Link
            href={'/chat'}
            className='inline-flex h-8 items-center justify-center rounded-md bg-[#00e5bf] px-4 text-[13px] font-medium text-black transition-all hover:bg-[#00d1ae] hover:shadow-md'
          >
            Chat
          </Link>
          <UserButton showUserInfo={true} />
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <Link
            href={app.signIn}
            className='inline-flex h-8 items-center justify-center rounded-md px-4 text-[13px] font-medium text-gray-700 transition-all hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
          >
            Log In
          </Link>
          <Link
            href={app.signUp}
            className='bg-primary-1 inline-flex h-8 items-center justify-center rounded-full px-6 text-center text-[13px] font-medium whitespace-nowrap transition-colors duration-200 outline-none hover:bg-[#00e5bf] dark:text-black'
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
}
