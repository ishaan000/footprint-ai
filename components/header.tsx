import Image from 'next/image';
import Link from 'next/link';

import { getUserDetails } from '@/app/actions';
import { stackServerApp } from '@/stack';

import ModeSwitch from '@/components/ModeSwitch';

export async function Header() {
  const user = await stackServerApp.getUser();
  const app = stackServerApp.urls;
  const userProfile = await getUserDetails(user?.id);

  return (
    <header className='z-10 flex w-full items-center justify-between px-6 py-4'>
      <div className='text-[15px] font-medium tracking-tight'>
        <Link href='/'>Footprint</Link>
      </div>
      {user ? (
        <div className='flex items-center gap-4'>
          <ModeSwitch />
          <span className='inline-flex h-8 flex-col items-end'>
            {userProfile?.name && (
              <span className='text-[14px] text-gray-600 dark:text-gray-300'>
                {`Hello, ${userProfile?.name.split(' ')[0]}`}
              </span>
            )}
            <Link
              href={app.signOut}
              className='bg-gray-50 px-1 text-[11px] underline hover:no-underline'
            >
              Sign Out
            </Link>
          </span>
          {userProfile?.raw_json.profile_image_url && (
            <Image
              src={userProfile?.raw_json.profile_image_url}
              alt='User avatar'
              width={32}
              height={32}
              className='rounded-full'
            />
          )}
        </div>
      ) : (
        <div className='flex items-center gap-3'>
          <ModeSwitch />
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
