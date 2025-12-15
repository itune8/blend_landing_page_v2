import type { EventService, Event, EventFilters } from "../types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export class SupabaseEventService implements EventService {
    async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'host_id'>): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) {
            return { event: null, error: "Supabase not configured" };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { event: null, error: "Not authenticated" };
        }

        const { data, error } = await supabase
            .from('events')
            .insert({
                host_id: user.id,
                title: eventData.title,
                description: eventData.description,
                start_date: eventData.start_date,
                end_date: eventData.end_date,
                location_type: eventData.location_type,
                location_url: eventData.location_url,
                cover_image_url: eventData.cover_image_url,
                theme: eventData.theme,
                capacity: eventData.capacity,
                price_cents: eventData.price ? parseInt(String(eventData.price).replace(/[^0-9]/g, '')) * 100 : 0,
                visibility: eventData.visibility || 'public'
            })
            .select()
            .single();

        if (error) {
            return { event: null, error: error.message };
        }

        return { event: data as Event, error: null };
    }

    async getEvents(filters?: EventFilters): Promise<{ events: Event[]; error: string | null }> {
        if (!supabase) {
            return { events: [], error: "Supabase not configured" };
        }

        let query = supabase.from('events').select('*');

        const userId = filters?.host_id;
        if (userId) {
            query = query.eq('host_id', userId);
        } else {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                query = query.eq('host_id', user.id);
            } else {
                query = query.eq('visibility', 'public');
            }
        }

        if (filters?.status) query = query.eq('status', filters.status);
        if (filters?.visibility) query = query.eq('visibility', filters.visibility);
        if (filters?.calendar_id) query = query.eq('calendar_id', filters.calendar_id);

        const { data, error } = await query.order('start_date', { ascending: true });

        if (error) {
            return { events: [], error: error.message };
        }

        return { events: (data as Event[]) || [], error: null };
    }

    async getEventById(id: string): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) {
            return { event: null, error: "Supabase not configured" };
        }

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return { event: null, error: error.message };
        }

        return { event: data as Event, error: null };
    }

    async updateEvent(id: string, updates: Partial<Event>): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) {
            return { event: null, error: "Supabase not configured" };
        }

        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { event: null, error: error.message };
        }

        return { event: data as Event, error: null };
    }

    async getEventBySlug(slug: string): Promise<{ event: Event | null; error: string | null }> {
        if (!supabase) {
            return { event: null, error: "Supabase not configured" };
        }

        const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            return { event: null, error: error.message };
        }

        return { event: data as Event, error: null };
    }

    async deleteEvent(id: string): Promise<{ error: string | null }> {
        if (!supabase) {
            return { error: "Supabase not configured" };
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { error: "Not authenticated" };
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id)
            .eq('host_id', user.id);

        if (error) {
            return { error: error.message };
        }

        return { error: null };
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

export const isSupabaseEventAvailable = isSupabaseConfigured;
