import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
    async function middleware(req) {
        try {
            // Get the token from the session
            const token = req.nextauth?.token;
            
            console.log('Middleware - Token check:', {
                hasToken: !!token,
                hasAccessToken: !!token?.accessToken,
                hasId: !!token?.id,
                hasEmail: !!token?.email,
                path: req.nextUrl.pathname
            });
            
            // Check if token exists and has non-empty values
            if (!token?.accessToken || !token.id || !token.email) {
                console.log('Middleware - Invalid token, redirecting to login');
                return NextResponse.redirect(new URL('/login', req.url));
            }

            // Validate the token with the backend
            console.log('Middleware - Validating token with backend');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/auth/validate`, {
                headers: {
                    'Authorization': `Bearer ${token.accessToken}`,
                },
            });

            if (!response.ok) {
                console.log('Middleware - Backend validation failed:', response.status);
                // If token is invalid, redirect to login
                return NextResponse.redirect(new URL('/login', req.url));
            }

            console.log('Middleware - Token validated successfully');
            return NextResponse.next();
        } catch (error) {
            // If there's any error, redirect to login
            console.error('Middleware error:', error);
            return NextResponse.redirect(new URL('/login', req.url));
        }
    },
    {
        pages: {
            signIn: '/login',
        },
        callbacks: {
            authorized: ({ token }) => {
                const isAuthorized = !!token?.accessToken && !!token.id && !!token.email;
                console.log('Middleware - Authorization check:', { isAuthorized });
                return isAuthorized;
            },
        },
    }
);

export const config = {
    matcher: [
        '/dashboard/:path*', 
        '/profile/:path*', 
        '/settings/:path*',
        // Add other protected routes here
    ],
};
