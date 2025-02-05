import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
    function middleware(req) {
        // If user is not authenticated, redirect to login
        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/login', // Redirect to this page if not authenticated
        },
    }
);

export const config = {
    matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'], // Protect these routes
};
