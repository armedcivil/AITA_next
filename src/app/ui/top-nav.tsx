'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

export default function TopNav() {
  const pathname = usePathname();

  return (
    <div className="shadow-lg flex items-center">
      <Image src="/img/AITA.png" width={56} height={56} alt="AITA logo" className="justify-self-start"/>
      <div className="h-full px-6 ml-6">
        <Link href={'/company'} className={clsx('', {
          'text-red-400': pathname === '/company'
        })}>Profile</Link>
      </div>
      <div className="h-full px-6 justify-self-start">
        <Link href={'/company/users'} className={clsx('', {
          'text-red-400': pathname.startsWith('/company/users')
        })}>Users</Link>
      </div>
      <div className="h-full px-6 justify-self-end ml-auto">
        <Link href={'/logout'} className={clsx('', {
          'text-red-400': pathname === '/logout'
        })}>Logout</Link>
      </div>
    </div>
  );
}
