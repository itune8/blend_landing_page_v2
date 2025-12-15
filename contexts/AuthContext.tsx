"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@/services';
import { authService, isUsingSupabase } from '@/services';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string) => Promise<{ error: string | null; magicLinkSent?: boolean }>;
    signInWithGoogle: () => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    isSupabase: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session on mount
        const loadUser = async () => {
            const { user } = await authService.getCurrentUser();
            setUser(user);
            setLoading(false);
        };
        loadUser();

        // Subscribe to Supabase auth state changes (for Magic Link flow)
        if (supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
                if (session?.user) {
                    const mappedUser: User = {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                        avatar_url: session.user.user_metadata?.avatar_url,
                        created_at: session.user.created_at
                    };
                    setUser(mappedUser);
                } else {
                    setUser(null);
                }
                setLoading(false);
            });

            return () => subscription.unsubscribe();
        }
    }, []);

    const signIn = async (email: string) => {
        const { user: signedInUser, error } = await authService.signIn(email);

        // For Supabase, signIn sends a magic link - user won't be set immediately
        if (signedInUser) {
            setUser(signedInUser);
            return { error, magicLinkSent: false };
        }

        // If using Supabase and no error, magic link was sent
        if (isUsingSupabase && !error) {
            return { error: null, magicLinkSent: true };
        }

        return { error, magicLinkSent: false };
    };

    const signInWithGoogle = async () => {
        if ('signInWithGoogle' in authService) {
            const { error } = await (authService as any).signInWithGoogle();
            return { error };
        }
        // Mock fallback - simulate Google sign in
        const mockUser: User = {
            id: 'google-user-' + Date.now(),
            email: 'google.user@gmail.com',
            name: 'Google User',
            avatar_url: 'https://lh3.googleusercontent.com/a/default-user',
            created_at: new Date().toISOString()
        };
        setUser(mockUser);
        return { error: null };
    };

    const signOut = async () => {
        await authService.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signInWithGoogle, signOut, isSupabase: isUsingSupabase }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
