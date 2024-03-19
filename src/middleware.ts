import { checkAuth } from '@/app/lib/actions';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('token')?.value;

  if (accessToken) {
    const isAuthenticated = await checkAuth(accessToken);

    if (isAuthenticated) {
      if (request.nextUrl.pathname === '/') {
        return Response.redirect(
          new URL('/company/users', process.env.APP_HOST),
        );
      }
    }
  } else {
    if (request.nextUrl.pathname !== '/') {
      return Response.redirect(new URL('/', process.env.APP_HOST));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
