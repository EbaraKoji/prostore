import { prisma } from '@/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import CredentailsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in', // Error code passed in query string as ?error=
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentailsProvider({
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (credentials === null) return null;
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        if (user && user.password) {
          const isMatch = compareSync(credentials.password as string, user.password);
          if (!isMatch) return null;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }) {
      // Seet the user ID from the token
      if (token.sub) {
        session.user.id = token.sub;
        // @ts-expect-error('Adding role attr to session.user is OK')
        session.user.role = token.role;
      }
      // If there is an update, set the username
      if (trigger === 'update') {
        session.user.name = user.name;
      }
      return session;
    },
    async jwt({ user, token, trigger }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error('user contains role attr')
        token.role = user.role;
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0];
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          });
        }
      }
      if (trigger === 'signIn' || trigger === 'signUp') {
        const cookiesObject = await cookies();
        const sessionCartId = cookiesObject.get('sessionCartId')?.value;
        if (sessionCartId === null) return token;

        const sessionCart = await prisma.cart.findFirst({
          where: { sessionCartId },
        });
        if (sessionCart === null) return token;

        if (sessionCart.userId !== user.id) {
          await prisma.cart.deleteMany({
            where: { userId: user.id },
          });
        }

        await prisma.cart.update({
          where: { id: sessionCart.id },
          data: { userId: user.id },
        });
      }
      return token;
    },

    authorized({ request }) {
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();

        const newRequestHeaders = new Headers(request.headers);
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });
        response.cookies.set('sessionCartId', sessionCartId);
        return response;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
