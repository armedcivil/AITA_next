'use server';

import { fetcha, FetchaError } from '@co-labo-hub/fetcha';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const apiHost = process.env.API_HOST;

export type SignInState = {
  error?: {
    message: string;
  };
  accessToken?: string;
};

export async function signIn(prevState: SignInState, formData: FormData) {
  try {
    const response = await fetcha(`${apiHost}/auth/company/login`)
      .contentType('application/json')
      .body({
        email: formData.get('email')!.toString(),
        password: formData.get('password')!.toString(),
      })
      .post();

    const { accessToken } = await response.toJson<{ accessToken: string }>();

    cookies().set('token', accessToken);
  } catch (e: any) {
    return {
      error: {
        message: e.message,
      },
    };
  }
  redirect('/company/users');
}

export async function checkAuth(
  accessToken: string,
): Promise<boolean | { error: { message: string } }> {
  try {
    const response = await fetcha(`${apiHost}/auth/check`)
      .header('Authorization', `Bearer ${accessToken}`)
      .get();

    const { check } = await response.toJson<{ check: boolean }>();
    return check;
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}

export async function signOut() {
  cookies().delete('token');
  redirect('/');
}
