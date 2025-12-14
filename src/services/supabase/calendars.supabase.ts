import type { Calendar, CalendarService, CalendarSubscription, EventFilters, Event } from "../types";
import { supabase } from "@/lib/supabase";

export class SupabaseCalendarService implements CalendarService {
    async createCalendar(calendarData: Omit<Calendar, 'id' | 'created_at' | 'owner_id' | 'subscriber_count'>): Promise<{ calendar: Calendar | null; error: string | null }> {
        if (!supabase) return { calendar: null, error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { calendar: null, error: "Not authenticated" };

        // Generate slug from name
        const slug = calendarData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { data, error } = await supabase
            .from('calendars')
            .insert({
                ...calendarData,
                owner_id: user.id,
                slug,
                subscriber_count: 0,
                color: calendarData.color || '#14b8a6'
            })
            .select()
            .single();

        if (error) return { calendar: null, error: error.message };
        return { calendar: data, error: null };
    }

    async getCalendars(owner_id?: string): Promise<{ calendars: Calendar[]; error: string | null }> {
        if (!supabase) return { calendars: [], error: "Supabase not configured" };

        let query = supabase
            .from('calendars')
            .select(`
                *,
                owner:profiles!calendars_owner_id_fkey(id, name, email, avatar_url)
            `)
            .order('created_at', { ascending: false });

        if (owner_id) {
            query = query.eq('owner_id', owner_id);
        } else {
            query = query.eq('is_public', true);
        }

        const { data, error } = await query;

        if (error) return { calendars: [], error: error.message };
        return { calendars: data || [], error: null };
    }

    async getCalendarById(id: string): Promise<{ calendar: Calendar | null; error: string | null }> {
        if (!supabase) return { calendar: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('calendars')
            .select(`
                *,
                owner:profiles!calendars_owner_id_fkey(id, name, email, avatar_url, bio)
            `)
            .eq('id', id)
            .single();

        if (error) return { calendar: null, error: error.message };
        return { calendar: data, error: null };
    }

    async getCalendarBySlug(slug: string): Promise<{ calendar: Calendar | null; error: string | null }> {
        if (!supabase) return { calendar: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('calendars')
            .select(`
                *,
                owner:profiles!calendars_owner_id_fkey(id, name, email, avatar_url, bio)
            `)
            .eq('slug', slug)
            .single();

        if (error) return { calendar: null, error: error.message };
        return { calendar: data, error: null };
    }

    async updateCalendar(id: string, updates: Partial<Calendar>): Promise<{ calendar: Calendar | null; error: string | null }> {
        if (!supabase) return { calendar: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('calendars')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return { calendar: null, error: error.message };
        return { calendar: data, error: null };
    }

    async deleteCalendar(id: string): Promise<{ error: string | null }> {
        if (!supabase) return { error: "Supabase not configured" };

        const { error } = await supabase
            .from('calendars')
            .delete()
            .eq('id', id);

        return { error: error?.message || null };
    }

    async subscribe(calendar_id: string): Promise<{ subscription: CalendarSubscription | null; error: string | null }> {
        if (!supabase) return { subscription: null, error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { subscription: null, error: "Not authenticated" };

        const { data, error } = await supabase
            .from('calendar_subscriptions')
            .insert({
                calendar_id,
                user_id: user.id
            })
            .select(`
                *,
                calendar:calendars(*)
            `)
            .single();

        if (error) {
            if (error.code === '23505') {
                return { subscription: null, error: "Already subscribed" };
            }
            return { subscription: null, error: error.message };
        }

        // Increment subscriber count
        await supabase.rpc('increment_subscriber_count', { cal_id: calendar_id });

        return { subscription: data, error: null };
    }

    async unsubscribe(calendar_id: string): Promise<{ error: string | null }> {
        if (!supabase) return { error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Not authenticated" };

        const { error } = await supabase
            .from('calendar_subscriptions')
            .delete()
            .eq('calendar_id', calendar_id)
            .eq('user_id', user.id);

        if (!error) {
            // Decrement subscriber count
            await supabase.rpc('decrement_subscriber_count', { cal_id: calendar_id });
        }

        return { error: error?.message || null };
    }

    async getSubscriptions(): Promise<{ subscriptions: CalendarSubscription[]; error: string | null }> {
        if (!supabase) return { subscriptions: [], error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { subscriptions: [], error: "Not authenticated" };

        const { data, error } = await supabase
            .from('calendar_subscriptions')
            .select(`
                *,
                calendar:calendars(
                    *,
                    owner:profiles!calendars_owner_id_fkey(id, name, avatar_url)
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) return { subscriptions: [], error: error.message };
        return { subscriptions: data || [], error: null };
    }

    async getCalendarEvents(calendar_id: string, filters?: EventFilters): Promise<{ events: Event[]; error: string | null }> {
        if (!supabase) return { events: [], error: "Supabase not configured" };

        let query = supabase
            .from('events')
            .select(`
                *,
                host:profiles!events_host_id_fkey(id, name, email, avatar_url)
            `)
            .eq('calendar_id', calendar_id)
            .eq('status', 'published')
            .order('start_date', { ascending: true });

        if (filters?.start_after) {
            query = query.gte('start_date', filters.start_after);
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) return { events: [], error: error.message };
        return { events: data || [], error: null };
    }
}

export const calendarService = new SupabaseCalendarService();
