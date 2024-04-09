'use client';

import { useEffect, useState } from 'react';
import { createPortal, useFormState } from 'react-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import ModalContent from '@/app/ui/modal-content';
import { EditorAsset } from './editor-asset-list';
import Image from 'next/image';
import { DeleteEditorAssetButton } from '@/app/ui/buttons-client';
import { deleteEditorAsset } from '../lib/actions';

export default function DeleteEditorAssetModalButton({
  editorAsset,
}: {
  editorAsset: EditorAsset;
}) {
  const [showModal, setShowModal] = useState(false);
  const deleteEditorAssetWithParam = deleteEditorAsset.bind(
    null,
    editorAsset.id!.toString(),
  );
  const [formState, formDispatch] = useFormState(deleteEditorAssetWithParam, {
    error: { message: '' },
  });

  useEffect(() => {
    setShowModal(false)
  },[formState, setShowModal])

  return (
    <>
      <TrashIcon
        className="h-5 cursor-pointer text-red-400"
        onClick={(e) => {
          e.stopPropagation();
          setShowModal(true);
        }}
      />
      {showModal &&
        createPortal(
          <ModalContent
            onClose={() => {
              setShowModal(false);
            }}
            title="Delete Editor Asset"
          >
            <div className="w-96 p-3">
              <span className="w-full">Delete following asset?</span>
              <div className="flex w-full justify-center">
                <Image
                  src={`http://aita_nest_app:3001/${editorAsset.thumbnailPath}`}
                  width={80}
                  height={80}
                  alt="thumbnail"
                />
              </div>
            </div>

            <div className="mt-4 flex w-96 justify-end">
              <form action={formDispatch}>
                <DeleteEditorAssetButton />
              </form>
            </div>
          </ModalContent>,
          document.body,
        )}
    </>
  );
}
