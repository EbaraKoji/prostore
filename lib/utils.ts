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

// shorten UUID
export const formatId = (id: string) => {
  return `..${id.substring(id.length - 6)}`;
};

export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString('en-US', dateTimeOptions);
  const formattedDate: string = new Date(dateString).toLocaleString('en-US', dateOptions);
  const formattedTime: string = new Date(dateString).toLocaleString('en-US', timeOptions);
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
