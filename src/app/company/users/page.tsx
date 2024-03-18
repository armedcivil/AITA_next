import { fetchUsersPageCount } from '@/app/lib/data';
import { CreateButton } from '@/app/ui/buttons';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/table';

export default async function Page({
  searchParams,
}: {
  searchParams?: { page?: number; query?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.query || '';
  const companyId = 1;
  const maxPage = await fetchUsersPageCount(companyId, query);

  return (
    <div className="h-full p-3">
      <div className="flex w-full justify-end">
        <Search placeholder="Search user" />
        <CreateButton className="ml-4" />
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="flex flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <Pagination maxPage={maxPage} />
          {/* TODO: get company id from auth info */}
          <Table page={page} query={query} companyId={companyId} />
        </div>
      </div>
    </div>
  );
}
