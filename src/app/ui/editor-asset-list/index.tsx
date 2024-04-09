'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import List from './list';

export type EditorAsset = {
  id?: number;
  assetPath: string;
  thumbnailPath: string;
  isChair: boolean;
  isDefault: boolean;
};

export default function EditorAssetList({
  editorAssets,
  onSelect,
}: {
  editorAssets: EditorAsset[];
  onSelect: (asset: EditorAsset) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={clsx('absolute bottom-0 left-0 right-0', {
        'h-24': isOpen,
        'h-8': !isOpen,
      })}
    >
      <div className="m-0 flex h-8 w-full justify-center p-0">
        <div
          className="flex h-8 w-9 items-center justify-center rounded-t-lg bg-red-400"
          onClick={(e) => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ChevronDownIcon className="h-5 text-white" />
          ) : (
            <ChevronUpIcon className="h-5 text-white" />
          )}
        </div>
      </div>
      <div
        className={clsx('overflow-hidden rounded-t-lg bg-white', {
          'h-16': isOpen,
          'h-0': !isOpen,
        })}
      >
        <List onSelect={onSelect} editorAssets={editorAssets} />
      </div>
    </div>
  );
}
