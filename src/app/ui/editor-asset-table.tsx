import Image from 'next/image';
import { EditorAsset } from './editor-asset-list';
import { CheckIcon } from '@heroicons/react/24/outline';
import DeleteEditorAssetModalButton from './delete-editor-asset-modal-button';

export default function EditorAssetTable({
  page,
  editorAssets,
}: {
  page: string;
  editorAssets: EditorAsset[];
}) {
  return (
    <table className="w-[600px]">
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Chair</th>
          <th>Default</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {editorAssets.map((value, index) => {
          return (
            <tr key={`${page}-${index}`} className="border-2 border-gray-100">
              <td className="flex justify-center px-4 py-[4px]">
                <Image
                  src={`http://aita_nest_app:3001/${value.thumbnailPath}`}
                  alt="thumbnail"
                  width={30}
                  height={30}
                />
              </td>
              <td className="px-4 py-[4px]">
                <div className="flex items-center justify-center">
                  {value.isChair && <CheckIcon className="h-5" />}
                </div>
              </td>
              <td className="px-4 py-[4px]">
                <div className="flex items-center justify-center">
                  {value.isDefault && <CheckIcon className="h-5" />}
                </div>
              </td>
              <td className="px-4 py-[4px]">
                <div className="flex items-center justify-center">
                  {!value.isDefault && (
                    <DeleteEditorAssetModalButton editorAsset={value} />
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
