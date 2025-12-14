import type { Event, EventService, EventFilters } from "../types";
import { supabase } from "@/lib/supabase";

export class SupabaseEventService implements EventService {
    async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'host_id'>): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) return { event: null, error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { event: null, error: "Not authenticated" };

        // Generate slug from title
        const slug = eventData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);

        const { data, error } = await supabase
            .from('events')
            .insert({
                ...eventData,
                host_id: user.id,
                slug,
                status: eventData.status || 'draft',
                theme: eventData.theme || { gradient: 'from-teal-400 to-blue-500' }
            })
            .select()
            .single();

        if (error) return { event: null, error: error.message };
        return { event: data, error: null };
    }

    async getEvents(filters?: EventFilters): Promise<{ events: Event[]; error: string | null }> {
        if (!supabase) return { events: [], error: "Supabase not configured" };

        let query = supabase
            .from('events')
            .select(`
                *,
                host:profiles!events_host_id_fkey(id, name, email, avatar_url),
                calendar:calendars(id, name, slug, color)
            `)
            .order('start_date', { ascending: true });

        // Apply filters
        if (filters?.host_id) {
            query = query.eq('host_id', filters.host_id);
        }
        if (filters?.calendar_id) {
            query = query.eq('calendar_id', filters.calendar_id);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.visibility) {
            query = query.eq('visibility', filters.visibility);
        }
        if (filters?.location_type) {
            query = query.eq('location_type', filters.location_type);
        }
        if (filters?.start_after) {
            query = query.gte('start_date', filters.start_after);
        }
        if (filters?.start_before) {
            query = query.lte('start_date', filters.start_before);
        }
        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        if (filters?.limit) {
            query = query.limit(filters.limit);
        }
        if (filters?.offset) {
            query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) return { events: [], error: error.message };
        return { events: data || [], error: null };
    }

    async getEventById(id: string): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) return { event: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                host:profiles!events_host_id_fkey(id, name, email, avatar_url, bio),
                calendar:calendars(id, name, slug, color, description),
                ticket_types(*)
            `)
            .eq('id', id)
            .single();

        if (error) return { event: null, error: error.message };

        // Increment view count
        await supabase
            .from('events')
            .update({ view_count: (data.view_count || 0) + 1 })
            .eq('id', id);

        return { event: data, error: null };
    }

    async getEventBySlug(slug: string): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) return { event: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('events')
            .select(`
                *,
                host:profiles!events_host_id_fkey(id, name, email, avatar_url, bio),
                calendar:calendars(id, name, slug, color, description),
                ticket_types(*)
            `)
            .eq('slug', slug)
            .single();

        if (error) return { event: null, error: error.message };
        return { event: data, error: null };
    }

    async updateEvent(id: string, updates: Partial<Event>): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) return { event: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('events')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return { event: null, error: error.message };
        return { event: data, error: null };
    }

    async deleteEvent(id: string): Promise<{ error: string | null }> {
        if (!supabase) return { error: "Supabase not configured" };

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        return { error: error?.message || null };
    }

    async publishEvent(id: string): Promise<{ event: Event | null; error: string | null }> {
        return this.updateEvent(id, {
            status: 'published',
            published_at: new Date().toISOString()
        });
    }

    async cancelEvent(id: string): Promise<{ event: Event | null; error: string | null }> {
        return this.updateEvent(id, { status: 'cancelled' });
    }
}

export const eventService = new SupabaseEventService();
