import { fetchEditorAssets } from '@/app/lib/data';
import { EditorAssetCreateButton } from '@/app/ui/buttons';
import { EditorAsset } from '@/app/ui/editor-asset-list';
import EditorAssetTable from '@/app/ui/editor-asset-table';
import Pagination from '@/app/ui/pagination';
import { cookies } from 'next/headers';

export default async function Page({
  searchParams,
}: {
  searchParams?: { page: string };
}) {
  const accessToken = cookies().get('token')?.value;

  let maxPage = 0;
  let data: EditorAsset[] = [];
  if (accessToken) {
    let page = '1';
    if (searchParams?.page) {
      page = searchParams.page;
    }
    const response = await fetchEditorAssets(accessToken, page, 'desc');
    maxPage = response.pager?.maxPage ?? 0;
    data = response.editorAssets!;
  }

  return (
    <div className="h-full p-3">
      <div className="flex w-full justify-end">
        <EditorAssetCreateButton />
      </div>
      <div className="mt-4 flex w-full flex-col items-center">
        <div className="flex flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <Pagination maxPage={maxPage} />
          <EditorAssetTable editorAssets={data} page={searchParams!.page} />
        </div>
      </div>
    </div>
  );
}
