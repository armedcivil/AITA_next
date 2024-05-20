'use client';

import { updateCompanyProfile } from '../lib/actions';
import { Button } from './button';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { showSuccessAlert, showDangerAlert } from './alert';

export default function EditProfileForm({
  companyProfile,
}: {
  companyProfile: { id?: bigint; name?: string; email?: string };
}) {
  const initialState = { error: { message: '' } };
  const [state, dispatch] = useFormState(updateCompanyProfile, initialState);

  useEffect(() => {
    if (state.result && state.result === 'success') {
      showSuccessAlert('Update company profile successfully');
    } else {
      showDangerAlert('Update company profile failed');
    }

    return () => {};
  }, [state]);

  return (
    <>
      <form action={dispatch} className="grid-rows-max grid w-full grid-cols-6">
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
        <span className="col-start-3 col-end-7 my-2">
          <input
            type="text"
            name="email"
            className="h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
            defaultValue={companyProfile.email}
          ></input>
          {state.error?.email && (
            <ul className="text-right text-xs text-red-600">
              {state.error?.email?.map((error, index) => {
                return <li key={index}>{error}</li>;
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
            className=" h-10 w-full self-center rounded-lg border-2 border-red-400 p-2"
          ></input>
          {state.error?.password && (
            <ul className="text-right text-xs text-red-600">
              {state.error?.password?.map((error, index) => {
                return <li key={index}>{error}</li>;
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
    </>
  );
}
