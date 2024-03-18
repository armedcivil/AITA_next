'use client';

import { useSearchParams, usePathname } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { PaginationButton } from './buttons';
import clsx from 'clsx';

export default function Pagination({ maxPage }: { maxPage: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get('page')) || 1;
  const query = searchParams.get('query')?.toString();

  const { previousPageUrl, nextPageUrl } = getPaginationUrl(
    currentPage,
    maxPage,
    pathname,
    query,
  );

  return (
    <div className="flex flex-row items-center">
      <div className="mr-2 w-12">
        <PaginationButton
          href={previousPageUrl}
          className={clsx('w-12', { hidden: currentPage === 1 })}
        >
          <ArrowLeftIcon className="h-5" />
        </PaginationButton>
      </div>
      <div className="w-14 text-center">{`${currentPage} / ${maxPage}`}</div>
      <div className="ml-2 w-12">
        <PaginationButton
          href={nextPageUrl}
          className={clsx('w-12', { hidden: currentPage === maxPage })}
        >
          <ArrowRightIcon className="h-5" />
        </PaginationButton>
      </div>
    </div>
  );
}

function getPaginationUrl(
  currentPage: number,
  maxPage: number,
  pathname: string,
  query?: string,
): { previousPageUrl: string; nextPageUrl: string } {
  const params = new URLSearchParams();

  if (query) {
    params.set('query', query);
  } else {
    params.delete('query');
  }
  params.set('page', Math.max(1, currentPage - 1).toString());
  const previousPageUrl = `${pathname}?${params.toString()}`;

  params.set('page', Math.min(maxPage, currentPage + 1).toString());
  const nextPageUrl = `${pathname}?${params.toString()}`;
  return { previousPageUrl, nextPageUrl };
}
