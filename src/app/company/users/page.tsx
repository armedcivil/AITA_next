import { fetchCompanyProfile } from '@/app/lib/actions';
import { fetchUsersPageCount } from '@/app/lib/data';
import { CreateButton } from '@/app/ui/buttons';
import Pagination from '@/app/ui/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/table';
import { cookies } from 'next/headers';

export default async function Page({
  searchParams,
}: {
  searchParams?: { page?: number; query?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  const query = searchParams?.query || '';
  let companyId: number | bigint = 0;
  let maxPage = 0;
  const accessToken = cookies().get('token')?.value;
  if (accessToken) {
    const profile = await fetchCompanyProfile(accessToken);
    if (profile.id) {
      companyId = profile.id;
    }

    maxPage = await fetchUsersPageCount(companyId, query);
  }

  return (
    <div className="h-full p-3">
      <div className="flex w-full justify-end">
        <Search placeholder="Search user" />
        <CreateButton className="ml-4" />
      </div>
      <div className="mt-4 flex flex-col items-center">
        <div className="flex flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <Pagination maxPage={maxPage} />
          <Table page={page} query={query} companyId={companyId} />
        </div>
      </div>
    </div>
  );
}
