'use client';

import { Button } from './button';
import ImageInput from './image-input';
import { useFormState } from 'react-dom';
import { createUser } from '@/app/lib/actions';

export default function CreateUserForm() {
  const initialState = { error: { message: '' } };
  const [state, dispatch] = useFormState(createUser, initialState);

  return (
    <form action={dispatch} className="grid w-full grid-cols-6 grid-rows-7">
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
      ></input>
      <label className="col-end-3 mr-4 self-center justify-self-end">
        Email
      </label>
      <input
        type="text"
        name="email"
        className="col-start-3 col-end-7 my-2 h-10 self-center rounded-lg border-2 border-red-400 p-2"
      ></input>
      <label className="col-end-3 mr-4 self-center justify-self-end">
        Password
      </label>
      <input
        type="password"
        name="password"
        className="col-start-3 col-end-7 my-2 h-10 self-center rounded-lg border-2 border-red-400 p-2"
      ></input>
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
        Create
      </Button>
    </form>
  );
}
