import Image from 'next/image';
import { EditorAsset } from '.';
import ChairIcon from '../icons/chair-icon';
import { PencilIcon } from '@heroicons/react/24/outline';

export default function EditorAssetCell({
  editorAsset,
  onClick,
}: {
  editorAsset: EditorAsset;
  onClick: (e: any) => void;
}) {
  return (
    <div className="relative m-2 flex aspect-square h-14 cursor-pointer select-none items-center justify-center rounded-lg bg-red-400">
      <Image
        src={`http://aita_nest_app:3001/${editorAsset.thumbnailPath}`}
        width={80}
        height={80}
        alt="asset thumbnail"
        onClick={(e) => {
          onClick(e);
        }}
      />
      {editorAsset.isChair && (
        <ChairIcon className="absolute right-0 top-0 h-5" fill="white" />
      )}
    </div>
  );
}
