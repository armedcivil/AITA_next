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

export async function fetchCompanyProfile(accessToken: string): Promise<{
  id?: bigint;
  name?: string;
  email?: string;
  error?: { message: string };
}> {
  try {
    const response = await fetcha(`${apiHost}/company/profile`)
      .header('Authorization', `Bearer ${accessToken}`)
      .get();

    const data = await response.toJson<{
      id: bigint;
      name: string;
      email: string;
    }>();
    return data;
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}

export type CreateUserState =
  | {
      error?: {
        message?: string;
      };
    }
  | undefined;

class UnauthorizedError extends Error {}

export async function createUser(
  prevState: CreateUserState,
  formData: FormData,
) {
  try {
    const tokenCookie = cookies().get('token');
    if (tokenCookie) {
      await fetcha(`${apiHost}/user`)
        .body(formData)
        .header('Content-Type', 'multipart/form-data')
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .post();
    } else {
      throw new UnauthorizedError('Unauthorized');
    }
  } catch (e: any) {
    if (e instanceof UnauthorizedError) {
      redirect('/');
    }

    let message = e.message.toString();
    if (e instanceof FetchaError) {
      if (e.response && e.response.body) {
        message = JSON.parse(
          await new Response(e.response.body).text(),
        ).message;
      }
    }
    return {
      error: {
        message: message,
      },
    };
  }

  redirect('/company/users');
}
