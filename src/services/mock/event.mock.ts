
import type { EventService, Event } from "../types";

const EVENTS_STORAGE_KEY = 'blend_events';
const USER_STORAGE_KEY = 'blend_auth_user';

export class MockEventService implements EventService {
    private getStoredEvents(): Event[] {
        return JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY) || '[]');
    }

    private getCurrentUserId(): string | null {
        const userStr = localStorage.getItem(USER_STORAGE_KEY);
        if (!userStr) return null;
        return JSON.parse(userStr).id;
    }

    async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'host_id'>): Promise<{ event: Event | null; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network

        const userId = this.getCurrentUserId();
        if (!userId) return { event: null, error: "Unauthorized" };

        const newEvent: Event = {
            id: crypto.randomUUID(),
            host_id: userId,
            created_at: new Date().toISOString(),
            ...eventData
        };

        const events = this.getStoredEvents();
        events.push(newEvent);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

        return { event: newEvent, error: null };
    }

    async getEvents(userId?: string): Promise<{ events: Event[]; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 400));

        const events = this.getStoredEvents();
        // If userId is provided, filter by it. If not, maybe return all public events? 
        // For dashboard "Your Events", we usually filter by host_id = current_user

        const targetUserId = userId || this.getCurrentUserId();

        if (!targetUserId) {
            // If no user context, return public events maybe? 
            // For now, let's return [] to be safe or all for "Discover" mock
            return { events: events.filter(e => e.visibility === 'public'), error: null };
        }

        const userEvents = events.filter(e => e.host_id === targetUserId);
        // Sort by date descending (newest created? or start_date?)
        // Luma dashboard likely sorts by start_date
        return {
            events: userEvents.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()),
            error: null
        };
    }

    async getEventById(id: string): Promise<{ event: Event | null; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const events = this.getStoredEvents();
        const event = events.find(e => e.id === id);
        return { event: event || null, error: event ? null : "Event not found" };
    }

    async updateEvent(id: string, updates: Partial<Event>): Promise<{ event: Event | null; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const events = this.getStoredEvents();
        const index = events.findIndex(e => e.id === id);

        if (index === -1) return { event: null, error: "Event not found" };

        // Verify ownership
        const userId = this.getCurrentUserId();
        if (events[index].host_id !== userId) return { event: null, error: "Unauthorized" };

        const updatedEvent = { ...events[index], ...updates };
        events[index] = updatedEvent;
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

        return { event: updatedEvent, error: null };
    }

    async getEventBySlug(slug: string): Promise<{ event: Event | null; error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const events = this.getStoredEvents();
        const event = events.find(e => e.slug === slug);
        return { event: event || null, error: event ? null : "Event not found" };
    }

    async deleteEvent(id: string): Promise<{ error: string | null }> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const events = this.getStoredEvents();
        const index = events.findIndex(e => e.id === id);

        if (index === -1) return { error: "Event not found" };

        // Verify ownership
        const userId = this.getCurrentUserId();
        if (events[index].host_id !== userId) return { error: "Unauthorized" };

        events.splice(index, 1);
        localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));

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
