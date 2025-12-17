import type { AuthService, User } from "../types";

const STORAGE_KEY = 'blend_auth_user';

export class MockAuthService implements AuthService {
    async signIn(email: string): Promise<{ user: User | null; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (typeof window === 'undefined') {
            return { user: null, error: 'Not available on server' };
        }

        const storedUsers = JSON.parse(localStorage.getItem('blend_users') || '[]');
        const existingUser = storedUsers.find((u: User) => u.email === email);

        if (existingUser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
            return { user: existingUser, error: null };
        } else {
            const newUser: User = {
                id: crypto.randomUUID(),
                email,
                name: email.split('@')[0],
                created_at: new Date().toISOString(),
                avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };
            storedUsers.push(newUser);
            localStorage.setItem('blend_users', JSON.stringify(storedUsers));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            return { user: newUser, error: null };
        }
    }

    async signUp(email: string, name?: string): Promise<{ user: User | null; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 500));

        if (typeof window === 'undefined') {
            return { user: null, error: 'Not available on server' };
        }

        const storedUsers = JSON.parse(localStorage.getItem('blend_users') || '[]');
        if (storedUsers.find((u: User) => u.email === email)) {
            return { user: null, error: 'User already exists' };
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            name: name || email.split('@')[0],
            created_at: new Date().toISOString(),
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        };

        storedUsers.push(newUser);
        localStorage.setItem('blend_users', JSON.stringify(storedUsers));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

        return { user: newUser, error: null };
    }

    async signOut(): Promise<{ error: string | null }> {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(STORAGE_KEY);
        }
        return { error: null };
    }

    async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
        if (typeof window === 'undefined') {
            return { user: null, error: null };
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return { user: null, error: null };
        return { user: JSON.parse(stored), error: null };
    }
}
