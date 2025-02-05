import { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions = {
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
            async authorize(credentials, req) {
                const user = { id: "1", name: "J Smith", email: "jsmith@example.com" }
                if (user) {
                    return user
                } else {
                    return null
                }
            }
        }),
    ],
    session: { strategy: 'jwt' as SessionStrategy },
    callbacks: {
        async jwt({ token, user }: { token: any, user?: any }) {
            if (user) token.id = user.id;
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (session.user) session.user.id = token.id;
            return session;
        },
    },
    pages: {
        signIn: '/login',
    }
}