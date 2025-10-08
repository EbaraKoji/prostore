'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { AuthFormError, formatFormError } from '../utils';
import { signInFormSchema, signUpFormSchema } from '../validators';

export type AuthActionData = {
  success: boolean;
  message: string;
  error?: AuthFormError;
  formData?: FormData;
};

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
): Promise<AuthActionData | undefined> {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    await signIn('credentials', user);

    return { success: true, message: 'Successfully signed in.' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: 'Failed to sign in.',
      error: { other: 'Invalid email or password.' },
      formData,
    };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(
  prevState: unknown,
  formData: FormData,
): Promise<AuthActionData | undefined> {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });
    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'Succeessfully registered user.' };
  } catch (error: unknown) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: 'Failed to register user',
      error: formatFormError(error as Error),
      formData,
    };
  }
}

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  return user;
}
