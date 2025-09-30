'use server';

import { signInFormSchema } from '../validators';
import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export type signInActionData = {
  success: boolean;
  message: string;
};

// Sign in user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
): Promise<signInActionData | undefined> {
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

export async function sinOutUser() {
  await signOut();
}
