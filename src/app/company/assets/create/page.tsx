import CreateEditorAssetForm from '@/app/ui/create-editor-asset-form';
import { revalidatePath } from 'next/cache';

export default function Page() {
  const handleRevalidate = async () => {
    'use server';
    revalidatePath('/company/assets');
  };
  return (
    <div className="h-full p-3">
      <h2 className="h-6 text-xl">Create Editor Asset</h2>
      <div className="mt-8 flex justify-center">
        <div className="flex w-[636px] flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <CreateEditorAssetForm
            redirectUrl="/company/assets"
            handleRevalidate={handleRevalidate}
          />
        </div>
      </div>
    </div>
  );
}
