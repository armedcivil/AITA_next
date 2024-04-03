'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-16 items-center shadow-lg">
      <Image
        src="/img/AITA.png"
        width={56}
        height={56}
        alt="AITA logo"
        className="justify-self-start"
        priority={true}
      />
      <div className="ml-6 flex h-full items-center px-6">
        <Link
          href={'/company'}
          className={clsx('', {
            'text-red-400': pathname === '/company',
          })}
        >
          Profile
        </Link>
      </div>
      <div className="flex h-full items-center justify-self-start px-6">
        <Link
          href={'/company/users'}
          className={clsx('', {
            'text-red-400': pathname.startsWith('/company/users'),
          })}
        >
          Users
        </Link>
      </div>
      <div className="flex h-full items-center  justify-self-start px-6">
        <Link
          href={'/company/editor'}
          className={clsx('', {
            'text-red-400': pathname.startsWith('/company/editor'),
          })}
        >
          Editor
        </Link>
      </div>
      <div className="ml-auto flex h-full items-center justify-self-end px-6">
        <Link
          href={'/logout'}
          className={clsx('', {
            'text-red-400': pathname === '/logout',
          })}
        >
          Logout
        </Link>
      </div>
    </div>
  );
}
