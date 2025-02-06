import { getSession } from 'next-auth/react';

export interface InviteUserData {
    email: string;
    role: 'admin' | 'user';
}

export async function apiCall<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const session = await getSession(); // Get NextAuth session

    if (!session || !session.user) {
        throw new Error('Unauthorized: User not logged in');
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.token}`, // Attach token from NextAuth session
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return res.json();
}
