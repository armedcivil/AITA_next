'use server';

import { fetcha, FetchaError } from '@co-labo-hub/fetcha';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { EditorAsset } from '../ui/editor-asset-list';
const apiHost = process.env.API_HOST;

export type SignInState = {
  error?: {
    message?: string;
    email?: string[];
    password?: string[];
  };
  accessToken?: string;
};

export async function signIn(
  prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
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
    return { accessToken };
  } catch (e: any) {
    let errors: { email?: string[]; password?: string[] } = {};
    if (e.response && e.response.body) {
      errors = JSON.parse(await new Response(e.response.body).text()).errors;
    }
    return {
      error: {
        message: e.message,
        email: errors.email,
        password: errors.password,
      },
    };
  }
}

export async function checkAuth(
  accessToken: string,
): Promise<{ check?: boolean; error?: { message: string } }> {
  try {
    const response = await fetcha(`${apiHost}/auth/check`)
      .header('Authorization', `Bearer ${accessToken}`)
      .get();

    const check = await response.toJson<{ check: boolean }>();
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

export type CreateUserState =
  | {
      error?: {
        message?: string;
        name?: string[];
        email?: string[];
        password?: string[];
        passwordConfirmation?: string[];
      };
    }
  | undefined;

class UnauthorizedError extends Error {}

export async function createUser(
  prevState: CreateUserState,
  formData: FormData,
): Promise<CreateUserState> {
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
    let name,
      email,
      password,
      passwordConfirmation = undefined;
    if (e instanceof FetchaError) {
      if (e.response && e.response.body) {
        const responseBody = JSON.parse(
          await new Response(e.response.body).text(),
        );
        message = responseBody.message;
        name = responseBody.errors.name;
        email = responseBody.errors.email;
        password = responseBody.errors.password;
        passwordConfirmation = responseBody.errors.passwordConfirmation;
      }
    }
    return {
      error: {
        message: message,
        name,
        email,
        password,
        passwordConfirmation,
      },
    };
  }
}

export type UpdateUserState =
  | {
      error?: {
        message?: string;
      };
    }
  | undefined;

export async function updateUser(
  id: string,
  prevState: UpdateUserState,
  formData: FormData,
) {
  const deleteKeys: string[] = [];
  formData.forEach((value, key, parent) => {
    if (
      ![
        'id',
        'name',
        'email',
        'password',
        'icon',
        'passwordConfirmation',
      ].includes(key)
    ) {
      deleteKeys.push(key);
    }
  });
  for (const key in deleteKeys) {
    formData.delete(deleteKeys[key]);
  }

  try {
    const tokenCookie = cookies().get('token');
    if (tokenCookie) {
      const password = formData.get('password');
      if (!password) {
        formData.delete('password');
        formData.delete('passwordConfirmation');
      }

      await fetcha(`${apiHost}/user/${id}`)
        .body(formData)
        .header('Content-Type', 'multipart/form-data')
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .patch();
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

export type DeleteUserState = {
  error?: {
    message: string;
  };
  result?: string;
};

export async function deleteUser(
  accessToken: string,
  userId: string,
  prevState: DeleteUserState,
  formData: FormData,
) {
  try {
    const response = await fetcha(`${apiHost}/user/${userId}`)
      .header('Authorization', `Bearer ${accessToken}`)
      .delete();

    revalidatePath('/company/users');

    return await response.toJson<{ result: string }>();
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}

export async function fetchCompanyProfile(): Promise<{
  id?: bigint;
  name?: string;
  email?: string;
  error?: { message: string };
}> {
  try {
    const tokenCookie = cookies().get('token');
    if (tokenCookie) {
      const response = await fetcha(`${apiHost}/company/profile`)
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .get();

      const data = await response.toJson<{
        id: bigint;
        name: string;
        email: string;
      }>();
      return data;
    } else {
      return {
        error: {
          message: 'Unauthorized',
        },
      };
    }
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}

export type UpdateCompanyState = {
  error?: {
    message?: string;
    email?: string[];
    password?: string[];
  };
  result?: string;
};

export async function updateCompanyProfile(
  prevState: UpdateCompanyState,
  formData: FormData,
): Promise<UpdateCompanyState> {
  try {
    const requestBody: {
      id: number;
      name: string;
      email: string;
      password?: string;
      passwordConfirmation?: string;
    } = {
      id: parseInt(formData.get('id')!.toString()),
      name: formData.get('name')!.toString(),
      email: formData.get('email')!.toString(),
    };

    if (formData.get('password')) {
      requestBody.password = formData.get('password')!.toString();
      requestBody.passwordConfirmation = formData
        .get('passwordConfirmation')!
        .toString();
    }

    const tokenCookie = cookies().get('token');
    if (tokenCookie) {
      const response = await fetcha(`${apiHost}/company/profile`)
        .body(requestBody)
        .header('Content-Type', 'application/json')
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .patch();

      const data = await response.toJson<{ result: string }>();
      return data;
    }
    return {
      error: {
        message: 'Unauthorized',
      },
    };
  } catch (e: any) {
    let errors: { email?: string[]; password?: string[] } = {};
    if (e.response && e.response.body) {
      errors = JSON.parse(await new Response(e.response.body).text()).errors;
    }
    return {
      error: {
        message: e.message.toString(),
        email: errors.email,
        password: errors.password,
      },
    };
  }
}

export type UpsertFloorState = {
  result?: string;
  viewerKey?: string;
  error?: { message: string };
};

export async function upsertFloors(
  prevState: UpsertFloorState,
  formData: FormData,
): Promise<UpsertFloorState> {
  try {
    const formFloors = formData.get('floors');
    const tokenCookie = cookies().get('token');
    if (tokenCookie && formFloors) {
      const response = await fetcha(`${apiHost}/company/floor`)
        .body({ floors: JSON.parse(formFloors.toString()) })
        .header('Content-Type', 'application/json')
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .post();
      const data = await response.toJson<{ viewerKey: string }>();
      return { result: 'success', viewerKey: data.viewerKey };
    }
    return { error: { message: 'Unauthorized' } };
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}

export type CreateEditorAssetState = {
  result?: EditorAsset;
  error?: { message: string };
};

export async function createEditorAsset(
  prevState: CreateEditorAssetState,
  formData: FormData,
): Promise<CreateEditorAssetState> {
  try {
    const tokenCookie = cookies().get('token');
    if (tokenCookie) {
      const response = await fetcha(`${apiHost}/company/editor-asset`)
        .body(formData)
        .header('Content-Type', 'multipart/form-data')
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .post();
      const data = await response.toJson<EditorAsset>();

      return { result: data };
    }
    return { error: { message: 'Unauthorized' } };
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}

export type DeleteEditorAssetState = {
  error?: {
    message: string;
  };
  result?: string;
};

export async function deleteEditorAsset(
  id: string,
  prevState: DeleteEditorAssetState,
  formData: FormData,
): Promise<DeleteEditorAssetState> {
  try {
    const tokenCookie = cookies().get('token');
    if (tokenCookie) {
      const response = await fetcha(`${apiHost}/company/editor-asset/${id}`)
        .header('Authorization', `Bearer ${tokenCookie.value}`)
        .delete();

      revalidatePath('/company/assets');

      return await response.toJson<{ result: string }>();
    }
    return { result: 'failure' };
  } catch (e: any) {
    return {
      error: {
        message: e.message.toString(),
      },
    };
  }
}
