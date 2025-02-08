import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter both email and password');
                }
                
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/auth/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || 'Authentication failed');
                    }

                    // Ensure all required fields are present
                    if (!data.user?.id || !data.user?.email || !data.access_token) {
                        throw new Error('Invalid response from server');
                    }

                    return {
                        id: data.user.id.toString(),
                        email: data.user.email,
                        name: data.user.email, // Using email as name
                        accessToken: data.access_token,
                    };
                } catch (error: any) {
                    throw new Error(error.message || 'Authentication failed');
                }
            }
        }),
    ],
    session: { 
        strategy: 'jwt' as SessionStrategy,
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Update token when signing in
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.accessToken = user.accessToken;
                return token;
            }

            // Check if token is still valid
            if (token?.accessToken) {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/auth/validate`, {
                        headers: {
                            'Authorization': `Bearer ${token.accessToken}`,
                        },
                    });

                    if (!response.ok) {
                        console.log('Token validation failed in JWT callback:', response.status);
                        // Return a minimal valid JWT to force re-authentication
                        return {
                            ...token,
                            accessToken: undefined,
                        };
                    }

                    // Token is valid, update with latest user data
                    const data = await response.json();
                    return {
                        ...token,
                        name: data.user.name,
                        email: data.user.email,
                    };
                } catch (error) {
                    console.error('Token validation error in JWT callback:', error);
                    // Return a minimal valid JWT to force re-authentication
                    return {
                        ...token,
                        accessToken: undefined,
                    };
                }
            }

            return token;
        },
        async session({ session, token }) {
            // If no access token, return a session without the token
            if (!token?.accessToken) {
                console.log('Session callback - Invalid token, returning default session');
                return session;
            }

            // Return valid session with user data
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    token: token.accessToken,
                },
            };
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    events: {
        async signIn({ user }) {
            if (user) {
                console.log('Successful sign-in', {
                    userId: user.id,
                    email: user.email,
                });
            }
        },
        async signOut() {
            try {
                // Attempt to notify backend about logout
                await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}/auth/logout`, {
                    method: 'POST',
                    credentials: 'include',
                }).catch(() => {
                    // Ignore errors during logout
                    console.log('Backend logout notification failed - ignoring');
                });
            } catch (error) {
                console.error('Error during sign out:', error);
            }
        },
        async session({ session }) {
            if (session?.user) {
                console.log('Session update', {
                    userId: session.user.id,
                    email: session.user.email
                });
            }
        }
    },
}