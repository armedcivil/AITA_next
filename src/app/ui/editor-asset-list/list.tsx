'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal, useFormState } from 'react-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { EditorAsset } from '.';
import EditorAssetCell from './cell';
import ModalContent from '../modal-content';
import CreateEditorAssetForm from '../create-editor-asset-form';

export default function List({
  editorAssets,
  onSelect,
}: {
  editorAssets: EditorAsset[];
  onSelect: (asset: EditorAsset) => void;
}) {
  const [showDialog, setShowDialog] = useState<boolean>(false);

  return (
    <div
      id="list"
      className="align-center flex flex-row overflow-hidden overflow-x-auto"
    >
      {editorAssets.map((asset, index) => {
        return (
          <EditorAssetCell
            key={index}
            editorAsset={asset}
            onClick={(e) => {
              onSelect(asset);
            }}
          />
        );
      })}
      <div
        className="relative m-2 flex aspect-square h-14 cursor-pointer select-none items-center justify-center rounded-lg bg-red-400"
        onClick={(e) => {
          setShowDialog(true);
        }}
      >
        <PlusIcon className="h-7 text-white" />
      </div>
      {showDialog &&
        createPortal(
          <ModalContent
            onClose={() => {
              setShowDialog(false);
            }}
            title='Create Eidtor Asset'
          >
            <CreateEditorAssetForm
              onCreate={(editorAsset) => {
                editorAssets.push(editorAsset);
                setShowDialog(false);
              }}
            />
          </ModalContent>,
          document.body,
        )}
    </div>
  );
}
