import Link from 'next/link'
import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx'

export function CreateButton ({className}: {className?: string | null}) {
  return (
    <Link 
      href="/company/users/create"
      className={clsx('flex h-10 items-center rounded-lg bg-red-400 px-4 text-sm font-medium text-white transition-colors hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:bg-red-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50',
      className)}
      >
      <span className="hidden md:block">Create User</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}