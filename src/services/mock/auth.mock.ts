
import type { AuthService, User } from "../types";

const STORAGE_KEY = 'blend_auth_user';

export class MockAuthService implements AuthService {
    async signIn(email: string): Promise<{ user: User | null; error: string | null }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // For mock, we just find any existing user or create a session for this email
        // In a real mock, we might check a 'users' array, but let's keep it simple:
        // "Sign in" just sets the current session if user exists effectively.
        // Actually, let's look for a user in 'blend_users' storage to be slightly realistic
        // But for "Luma access", often just email is enough.

        const storedUsers = JSON.parse(localStorage.getItem('blend_users') || '[]');
        const existingUser = storedUsers.find((u: User) => u.email === email);

        if (existingUser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existingUser));
            return { user: existingUser, error: null };
        } else {
            // Implicit signup for mock convenience if not found?
            // Or error? Let's error to force "Sign Up" flow or just treat as magic link login that creates user.
            // Luma does magic link. Let's create if not exists for "Magic Link" feel.
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
        localStorage.removeItem(STORAGE_KEY);
        return { error: null };
    }

    async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return { user: null, error: null };
        return { user: JSON.parse(stored), error: null };
    }
}
