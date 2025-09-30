'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { hashSync } from 'bcrypt-ts-edge';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signInFormSchema, signUpFormSchema } from '../validators';

export type SignInActionData = {
  success: boolean;
  message: string;
};

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
): Promise<SignInActionData | undefined> {
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
    return { success: false, message: 'Invalid email or password.' };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(
  prevState: unknown,
  formData: FormData,
): Promise<SignInActionData | undefined> {
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
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: 'Failed to register.' };
  }
}
