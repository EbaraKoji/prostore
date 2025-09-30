'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signUpUser } from '@/lib/actions/user.actions';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

export const SignUpForm = () => {
  const [signUpActionData, signUpAction] = useActionState(signUpUser, undefined);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button disabled={pending} className="w-full cursor-pointer">
        {pending ? 'Signing up...' : 'Sign up'}
      </Button>
    );
  };
  return (
    <form action={signUpAction}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpActionData?.formData?.get('name')?.toString()}
          />
          <ul className="ml-4">
            {signUpActionData?.error?.zod?.map(
              (err, i) =>
                err.type === 'name' && (
                  <li key={i} className="text-destructive text-xs list-disc">
                    {err.message}
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpActionData?.formData?.get('email')?.toString()}
          />
          <ul className="ml-4">
            {signUpActionData?.error?.zod?.map(
              (err, i) =>
                err.type === 'email' && (
                  <li key={i} className="text-destructive text-xs list-disc">
                    {err.message}
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpActionData?.formData?.get('password')?.toString()}
          />
          <ul className="ml-4">
            {signUpActionData?.error?.zod?.map(
              (err, i) =>
                err.type === 'password' && (
                  <li key={i} className="text-destructive text-xs list-disc">
                    {err.message}
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className="space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpActionData?.formData?.get('confirmPassword')?.toString()}
          />
          <ul className="ml-4">
            {signUpActionData?.error?.zod?.map(
              (err, i) =>
                err.type === 'confirmPassword' && (
                  <li key={i} className="text-destructive text-xs list-disc">
                    {err.message}
                  </li>
                ),
            )}
          </ul>
        </div>
        <div className="">
          <SignUpButton />
        </div>
        {signUpActionData?.success === false && (
          <div className="text-center text-destructive">{signUpActionData.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link href="/sign-in" target="_self" className="link">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};
