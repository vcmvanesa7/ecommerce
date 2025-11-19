
import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;
      
      if (pathname.startsWith('/dashboard')) {
        return isLoggedIn; // si no está logueado → bloquea
      }

      if (pathname === '/login' && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', request.nextUrl));
      }

      return true;
    },
  },
};
