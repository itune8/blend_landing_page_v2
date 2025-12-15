import type { AuthService, User } from "../types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const STORAGE_KEY = 'blend_auth_user';

export class SupabaseAuthService implements AuthService {
    async signIn(email: string): Promise<{ user: User | null; error: string | null }> {
        if (!supabase) {
            return { user: null, error: "Supabase not configured" };
        }

        const redirectUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/events`
            : '';

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl
            }
        });

        if (error) {
            return { user: null, error: error.message };
        }

        return { user: null, error: null };
    }

    async signInWithGoogle(): Promise<{ error: string | null }> {
        if (!supabase) {
            return { error: "Supabase not configured" };
        }

        const redirectUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/events`
            : '';

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });

        if (error) {
            return { error: error.message };
        }

        return { error: null };
    }

    async signUp(email: string, _name?: string): Promise<{ user: User | null; error: string | null }> {
        return this.signIn(email);
    }

    async signOut(): Promise<{ error: string | null }> {
        if (!supabase) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem(STORAGE_KEY);
            }
            return { error: null };
        }

        const { error } = await supabase.auth.signOut();
        return { error: error?.message || null };
    }

    async getCurrentUser(): Promise<{ user: User | null; error: string | null }> {
        if (!supabase) {
            if (typeof window === 'undefined') return { user: null, error: null };
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return { user: null, error: null };
            return { user: JSON.parse(stored), error: null };
        }

        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return { user: null, error: error?.message || null };
        }

        const mappedUser: User = {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
            created_at: user.created_at
        };

        return { user: mappedUser, error: null };
    }

    onAuthStateChange(callback: (user: User | null) => void) {
        if (!supabase) return () => { };

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const mappedUser: User = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                    avatar_url: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture,
                    created_at: session.user.created_at
                };
                callback(mappedUser);
            } else {
                callback(null);
            }
        });

        return () => subscription.unsubscribe();
    }
}

export const isSupabaseAuthAvailable = isSupabaseConfigured;
