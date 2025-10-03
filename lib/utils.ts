import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PrismaClientKnownRequestError } from './generated/prisma/runtime/library';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberWithDecimal = (num: number) => {
  const [int, decimal] = num.toString().split('.');
  return decimal ? `${int}.${decimal.padEnd(2, '0')}` : `${int}.00`;
};

type ZodErrorMessage = {
  origin: 'string';
  code: string;
  minimum: number;
  inclusive: boolean;
  path: string[];
  message: string;
};

export type AuthFormError = {
  zod?: { type: string; message: string }[];
  prisma?: string;
  other?: string;
};

export const formatFormError = (error: Error): AuthFormError => {
  const formError: AuthFormError = {
    zod: [],
  };
  if (error.name === 'ZodError') {
    formError['zod'] = (JSON.parse(error.message) as ZodErrorMessage[]).map((err) => ({
      type: err.path[0],
      message: err.message,
    }));
  } else if (error.name === 'PrismaClientKnownRequestError') {
    formError['prisma'] = (error as PrismaClientKnownRequestError).message;
  } else {
    formError['other'] = 'Failed to register.';
  }

  return formError;
};

export const round = (value: number | string, precision = 2) => {
  if (typeof value !== 'number' && typeof value !== 'string') {
    throw new Error('Value must be number or string.');
  }
  const p = 10 ** precision;
  return Math.round((Number(value) + Number.EPSILON) * p) / p;
};
