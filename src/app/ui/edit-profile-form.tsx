'use client';

import { updateCompanyProfile } from '../lib/actions';
import { Button } from './button';
import { useFormState } from 'react-dom';

export default function EditProfileForm({
  companyProfile,
}: {
  companyProfile: { id?: bigint; name?: string; email?: string };
}) {
  const initialState = { error: { message: '' } };
  const [state, dispatch] = useFormState(updateCompanyProfile, initialState);

  return (
    <>
      {state.result && state.result === 'success' && <div>success</div>}
      {state.result && state.result === 'failed' && <div>failed</div>}
      {state.error !== undefined && <div>{state.error.message}</div>}
      <form action={dispatch} className="grid w-full grid-cols-6 grid-rows-7">
        <input type="hidden" name="id" value={companyProfile.id?.toString()} />
        <label className="col-end-3 mr-4 self-center justify-self-end">
          Name
        </label>
        <input
          type="text"
          name="name"
          className="col-start-3 col-end-7 my-2 h-10 self-center rounded-lg border-2 border-red-400 p-2"
          defaultValue={companyProfile.name}
        ></input>
        <label className="col-end-3 mr-4 self-center justify-self-end">
          Email
        </label>
        <input
          type="text"
          name="email"
          className="col-start-3 col-end-7 my-2 h-10 self-center rounded-lg border-2 border-red-400 p-2"
          defaultValue={companyProfile.email}
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
          Save
        </Button>
      </form>
    </>
  );
}
