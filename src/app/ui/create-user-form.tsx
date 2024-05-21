'use client';

import { Button } from './button';
import ImageInput from './image-input';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { createUser } from '@/app/lib/actions';
import { showDangerAlert, showSuccessAlert } from '../ui/alert';
import { redirect } from 'next/navigation';

export default function CreateUserForm() {
  const initialState = {
    error: {
      message: '',
      name: undefined,
      email: undefined,
      password: undefined,
      passwordConfirmation: undefined,
    },
  };
  const [state, dispatch] = useFormState(createUser, initialState);

  useEffect(() => {
    if (!state) {
      showSuccessAlert('Create user successfully');
      redirect('/company/users');
    } else if (
      state.error?.message != '' ||
      state.error?.name ||
      state.error?.email ||
      state.error?.password ||
      state.error?.passwordConfirmation
    ) {
      showDangerAlert('Create user failed');
    }
    return () => {};
  }, [state]);

  return (
    <form action={dispatch} className="grid-rows-max grid w-full grid-cols-6">
      <label className="col-end-3 row-start-1 row-end-3 mr-4 self-center justify-self-end">
        Icon
      </label>
      <ImageInput />
      <label className="col-end-3 mr-4 self-center justify-self-end">
        Name
      </label>
      <span className="col-start-3 col-end-7 my-2">
        <input
          type="text"
          name="name"
          className="h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
        ></input>
        {state?.error?.name && (
          <ul className="text-right text-xs text-red-600">
            {state?.error?.name.map((error, index) => {
              return <li key={index}>*{error}</li>;
            })}
          </ul>
        )}
      </span>

      <label className="col-end-3 mr-4 self-center justify-self-end">
        Email
      </label>
      <span className="col-start-3 col-end-7 my-2">
        <input
          type="text"
          name="email"
          className="h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
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
      <span className="col-start-3 col-end-7 my-2">
        <input
          type="password"
          name="passwordConfirmation"
          className="h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
        ></input>
        {state?.error?.passwordConfirmation && (
          <ul className="text-right text-xs text-red-600">
            {state?.error?.passwordConfirmation.map((error, index) => {
              return <li key={index}>*{error}</li>;
            })}
          </ul>
        )}
      </span>

      <Button
        className="col-start-6 col-end-7 mt-2 justify-end justify-self-end"
        type="submit"
      >
        Create
      </Button>
    </form>
  );
}
