import CreateEditorAssetForm from '@/app/ui/create-editor-asset-form';

export default function Page() {
  return (
    <div className="h-full p-3">
      <h2 className="h-6 text-xl">Create Editor Asset</h2>
      <div className="mt-8 flex justify-center">
        <div className="flex w-[636px] flex-col items-center rounded-lg border-2 border-gray-100 p-4 shadow-2xl">
          <CreateEditorAssetForm redirectUrl="/company/assets" />
        </div>
      </div>
    </div>
  );
}
