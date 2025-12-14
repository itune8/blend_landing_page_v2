import type { Registration, RegistrationService, RegistrationStatus, RegisterForEventInput, Invitation } from "../types";
import { supabase } from "@/lib/supabase";

export class SupabaseRegistrationService implements RegistrationService {
    async register(input: RegisterForEventInput): Promise<{ registration: Registration | null; error: string | null }> {
        if (!supabase) return { registration: null, error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { registration: null, error: "Not authenticated" };

        // Check if event exists and has capacity
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('id, capacity, registration_count, require_approval, allow_waitlist, is_paid, price_cents')
            .eq('id', input.event_id)
            .single();

        if (eventError || !event) {
            return { registration: null, error: "Event not found" };
        }

        // Determine initial status
        let status: RegistrationStatus = 'approved';
        if (event.require_approval) {
            status = 'pending';
        } else if (event.capacity && event.registration_count >= event.capacity) {
            if (event.allow_waitlist) {
                status = 'waitlist';
            } else {
                return { registration: null, error: "Event is at full capacity" };
            }
        }

        // Determine payment status
        const payment_status = event.is_paid ? 'pending' : 'paid';

        const { data, error } = await supabase
            .from('registrations')
            .insert({
                event_id: input.event_id,
                user_id: user.id,
                ticket_type_id: input.ticket_type_id,
                status,
                payment_status,
                form_responses: input.form_responses
            })
            .select(`
                *,
                event:events(id, title, start_date, location_type, location_name),
                user:profiles!registrations_user_id_fkey(id, name, email, avatar_url)
            `)
            .single();

        if (error) {
            if (error.code === '23505') {
                return { registration: null, error: "Already registered for this event" };
            }
            return { registration: null, error: error.message };
        }

        return { registration: data, error: null };
    }

    async cancelRegistration(event_id: string): Promise<{ error: string | null }> {
        if (!supabase) return { error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: "Not authenticated" };

        const { error } = await supabase
            .from('registrations')
            .update({
                status: 'cancelled',
                updated_at: new Date().toISOString()
            })
            .eq('event_id', event_id)
            .eq('user_id', user.id);

        return { error: error?.message || null };
    }

    async getMyRegistrations(): Promise<{ registrations: Registration[]; error: string | null }> {
        if (!supabase) return { registrations: [], error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { registrations: [], error: "Not authenticated" };

        const { data, error } = await supabase
            .from('registrations')
            .select(`
                *,
                event:events(
                    id, title, slug, start_date, end_date,
                    location_type, location_name, location_address,
                    cover_image_url, theme, status,
                    host:profiles!events_host_id_fkey(id, name, avatar_url)
                ),
                ticket_type:ticket_types(id, name, price_cents)
            `)
            .eq('user_id', user.id)
            .neq('status', 'cancelled')
            .order('created_at', { ascending: false });

        if (error) return { registrations: [], error: error.message };
        return { registrations: data || [], error: null };
    }

    async getRegistration(event_id: string): Promise<{ registration: Registration | null; error: string | null }> {
        if (!supabase) return { registration: null, error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { registration: null, error: "Not authenticated" };

        const { data, error } = await supabase
            .from('registrations')
            .select(`
                *,
                event:events(id, title, start_date),
                ticket_type:ticket_types(id, name, price_cents)
            `)
            .eq('event_id', event_id)
            .eq('user_id', user.id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return { registration: null, error: null }; // Not registered
            }
            return { registration: null, error: error.message };
        }
        return { registration: data, error: null };
    }

    async getEventGuests(event_id: string): Promise<{ guests: Registration[]; error: string | null }> {
        if (!supabase) return { guests: [], error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('registrations')
            .select(`
                *,
                user:profiles!registrations_user_id_fkey(id, name, email, avatar_url),
                ticket_type:ticket_types(id, name, price_cents)
            `)
            .eq('event_id', event_id)
            .order('created_at', { ascending: true });

        if (error) return { guests: [], error: error.message };
        return { guests: data || [], error: null };
    }

    async updateGuestStatus(registration_id: string, status: RegistrationStatus): Promise<{ registration: Registration | null; error: string | null }> {
        if (!supabase) return { registration: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('registrations')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', registration_id)
            .select(`
                *,
                user:profiles!registrations_user_id_fkey(id, name, email, avatar_url)
            `)
            .single();

        if (error) return { registration: null, error: error.message };
        return { registration: data, error: null };
    }

    async checkInGuest(registration_id: string): Promise<{ registration: Registration | null; error: string | null }> {
        if (!supabase) return { registration: null, error: "Supabase not configured" };

        const { data, error } = await supabase
            .from('registrations')
            .update({
                status: 'checked_in',
                checked_in_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', registration_id)
            .select(`
                *,
                user:profiles!registrations_user_id_fkey(id, name, email, avatar_url)
            `)
            .single();

        if (error) return { registration: null, error: error.message };
        return { registration: data, error: null };
    }

    async sendInvitations(event_id: string, emails: string[]): Promise<{ invitations: Invitation[]; error: string | null }> {
        if (!supabase) return { invitations: [], error: "Supabase not configured" };

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { invitations: [], error: "Not authenticated" };

        const invitationsToInsert = emails.map(email => ({
            event_id,
            email: email.toLowerCase().trim(),
            invited_by: user.id,
            status: 'pending' as const
        }));

        const { data, error } = await supabase
            .from('invitations')
            .insert(invitationsToInsert)
            .select();

        if (error) return { invitations: [], error: error.message };
        return { invitations: data || [], error: null };
    }
}

export const registrationService = new SupabaseRegistrationService();
