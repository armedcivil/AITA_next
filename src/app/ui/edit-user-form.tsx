'use client';

import { Button } from './button';
import ImageInput from './image-input';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { updateUser } from '@/app/lib/actions';
import { redirect } from 'next/navigation';
import { showDangerAlert, showSuccessAlert } from '../ui/alert';

export default function EditUserForm({
  userId,
  user,
}: {
  userId: string;
  user: { name?: string; email?: string };
}) {
  const initialState = {
    error: { message: '', email: undefined, password: undefined },
  };
  const updateUserWithId = updateUser.bind(null, userId);
  const [state, dispatch] = useFormState(updateUserWithId, initialState);

  useEffect(() => {
    if (!state) {
      showSuccessAlert('Update user successfully');
      redirect('/company/users');
    } else if (
      state.error?.message != '' ||
      state.error?.email ||
      state.error?.password
    ) {
      showDangerAlert('Update user failed');
    }
    return () => {};
  }, [state]);

  return (
    <form action={dispatch} className="grid-rows-max grid w-full grid-cols-6">
      <input type="hidden" name="id" value={userId} />
      <label className="col-end-3 row-start-1 row-end-3 mr-4 self-center justify-self-end">
        Icon
      </label>
      <ImageInput />
      <label className="col-end-3 mr-4 self-center justify-self-end">
        Name
      </label>
      <input
        type="text"
        name="name"
        className="col-start-3 col-end-7 my-2 h-10 self-center rounded-lg border-2 border-red-400 p-2"
        defaultValue={user.name}
      ></input>
      <label className="col-end-3 mr-4 self-center justify-self-end">
        Email
      </label>
      <span className="col-start-3 col-end-7 my-2">
        <input
          type="text"
          name="email"
          className="h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
          defaultValue={user.email}
        ></input>
        {state?.error?.email && (
          <ul className="text-right text-xs text-red-600">
            {state?.error?.email.map((error, index) => {
              return <li key={index}>*{error}</li>;
            })}
          </ul>
        )}
      </span>

      <label className="col-end-3 mr-4 self-center justify-self-end">
        Password
      </label>
      <span className="col-start-3 col-end-7 my-2">
        <input
          type="password"
          name="password"
          className="h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
        ></input>
        {state?.error?.password && (
          <ul className="text-right text-xs text-red-600">
            {state?.error?.password.map((error, index) => {
              return <li key={index}>*{error}</li>;
            })}
          </ul>
        )}
      </span>

      <label className="col-end-3 mr-4 self-center justify-self-end">
        Confirm
      </label>
      <input
        type="password"
        name="passwordConfirmation"
        className="col-start-3 col-end-7 my-2 h-10 self-center rounded-lg border-2 border-red-400 p-2"
      ></input>
      <Button
        className="col-start-6 col-end-7 mt-2 justify-end justify-self-end"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
}
