import { getSession } from 'next-auth/react';

export interface InviteUserData {
    email: string;
    role: 'admin' | 'user';
}

export class APIError extends Error {
    status: number;
    statusText: string;
    data?: any;

    constructor(status: number, statusText: string, data?: any) {
        super(`${status} ${statusText}`);
        this.name = 'APIError';
        this.status = status;
        this.statusText = statusText;
        this.data = data;
    }

    get message(): string {
        switch (this.status) {
            case 401:
                return 'You need to sign in to access this resource.';
            case 403:
                return 'You do not have permission to access this resource.';
            case 404:
                return 'The requested resource was not found.';
            case 422:
                return 'The provided data is invalid.';
            case 500:
                return 'An unexpected error occurred. Please try again later.';
            default:
                return this.statusText || 'An error occurred while processing your request.';
        }
    }

    get isAuthError(): boolean {
        return this.status === 401 || this.status === 403;
    }
}

export async function apiCall<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    const session = await getSession();

    if (!session || !session.user) {
        throw new APIError(401, 'Unauthorized', { message: 'User not logged in' });
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session.user.token}`,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!res.ok) {
            let errorData;
            try {
                errorData = await res.json();
            } catch {
                errorData = { message: res.statusText };
            }
            throw new APIError(res.status, res.statusText, errorData);
        }

        return res.json();
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }
        // Handle network errors or other unexpected errors
        throw new APIError(
            500,
            'Network Error',
            { message: error instanceof Error ? error.message : 'Failed to connect to the server' }
        );
    }
}
