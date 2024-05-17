'use client';

import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Button } from './button';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import { signIn } from '../lib/actions';
import { showDangerAlert, showSuccessAlert } from '../ui/alert';

export default function LoginForm() {
  const initialState = {
    error: { message: '', email: undefined, password: undefined },
  };
  const [state, dispatch] = useFormState(signIn, initialState);

  useEffect(() => {
    if (
      state.error &&
      (state.error.message ||
        state.error.message !== '' ||
        state.error.email ||
        state.error.password)
    ) {
      showDangerAlert('Logged in failed');
    } else if (state.accessToken) {
      showSuccessAlert('Logged in successfully');
      redirect('/company/users');
    }
    return () => {};
  }, [state]);

  return (
    <div className={`h-4/5 w-1/2 bg-white`}>
      <form
        action={dispatch}
        className="flex h-full w-full flex-col items-center"
      >
        <Image
          src={'/img/AITA.png'}
          alt="AITA service logo"
          width={120}
          height={120}
          priority={true}
        />
        <p className="mt-8 text-xl">Wellcome to AITA CMS for companies</p>
        <p className="text-xl">Please Login</p>
        <div className="mt-8 w-3/4 rounded-lg border-2 border-gray-100 p-8 shadow-2xl">
          <label
            className="mb-2 block self-start text-xs font-medium text-gray-900"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="text"
            name="email"
            placeholder="user@example.com"
            className="h-8 w-full rounded-lg border-2 border-red-400 p-2"
          />
          {state?.error?.email && (
            <ul className="text-right text-xs text-red-600">
              {state?.error?.email.map((error, index) => {
                return <li key={index}>*{error}</li>;
              })}
            </ul>
          )}
          <label
            className="mb-2 mt-4 block self-start text-xs font-medium text-gray-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="12345678"
            className="h-8 w-full rounded-lg border-2 border-red-400 p-2"
          />
          {state?.error?.password && (
            <ul className="text-right text-xs text-red-600">
              {state?.error?.password.map((error, index) => {
                return <li key={index}>*{error}</li>;
              })}
            </ul>
          )}
          <LoginButton />
        </div>
      </form>
    </div>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="mt-8 w-full" aria-disabled={pending}>
      Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}
