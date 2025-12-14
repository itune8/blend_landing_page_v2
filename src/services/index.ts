
import { MockAuthService } from "./mock/auth.mock";
import { MockEventService } from "./mock/event.mock";
import { SupabaseAuthService, isSupabaseAuthAvailable } from "./supabase/auth.supabase";
import { SupabaseEventService, isSupabaseEventAvailable } from "./supabase/event.supabase";

export * from "./types";

// Auto-select Supabase services if configured, otherwise fall back to Mock
export const authService = isSupabaseAuthAvailable
    ? new SupabaseAuthService()
    : new MockAuthService();

export const eventService = isSupabaseEventAvailable
    ? new SupabaseEventService()
    : new MockEventService();

// Export which backend is active (useful for UI indicators)
export const isUsingSupabase = isSupabaseAuthAvailable && isSupabaseEventAvailable;
