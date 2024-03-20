'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteUser } from '../lib/actions';
import { useFormState } from 'react-dom';

export function DeleteUserButton({
  accessToken,
  userId,
}: {
  accessToken: string;
  userId: string;
}) {
  const deleteUserWithParams = deleteUser.bind(null, accessToken, userId);
  const initialState = { error: { message: '' } };
  const [state, dispatch] = useFormState(deleteUserWithParams, initialState);

  return (
    <div>
      <form action={dispatch}>
        <button className="ml-4 block h-4 w-4">
          <TrashIcon className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
