'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useFormState, createPortal } from 'react-dom';
import ModalContent from './modal-content';
import { DeleteUserButton } from './buttons-client';
import { deleteUser } from '../lib/actions';

export default function DeleteUserModalButton({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}) {
  const [showModal, setShowModal] = useState(false);

  const deleteUserWithParams = deleteUser.bind(null, accessToken, userId);
  const initialState = { error: { message: '' } };
  const [state, dispatch] = useFormState(deleteUserWithParams, initialState);

  useEffect(() => {
    setShowModal(false);
  }, [setShowModal]);
  return (
    <>
      <TrashIcon
        className="ml-2 h-5 cursor-pointer text-red-400"
        onClick={(e) => {
          e.preventDefault();
          setShowModal(true);
        }}
      />
      {showModal &&
        createPortal(
          <ModalContent
            onClose={() => {
              setShowModal(false);
            }}
            title="Delete User"
          >
            <div>Delete User id: {userId} ?</div>
            <div className="mt-2 flex w-full justify-end">
              <form action={dispatch}>
                <DeleteUserButton />
              </form>
            </div>
          </ModalContent>,
          document.body,
        )}
    </>
  );
}
