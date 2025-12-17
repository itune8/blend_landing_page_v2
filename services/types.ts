// ============================================================
// BLEND API TYPES (Luma-style Event Platform)
// ============================================================

// ============================================================
// USER & PROFILE TYPES
// ============================================================
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at: string;
}

export interface Profile {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    bio?: string;
    website?: string;
    location?: string;
    timezone?: string;
    is_verified?: boolean;
    created_at: string;
    updated_at?: string;
}

// ============================================================
// CALENDAR TYPES
// ============================================================
export interface Calendar {
    id: string;
    owner_id: string;
    name: string;
    slug?: string;
    description?: string;
    avatar_url?: string;
    cover_image_url?: string;
    color?: string;
    is_public: boolean;
    subscriber_count: number;
    created_at: string;
    updated_at?: string;
    owner?: Profile;
}

export interface CalendarSubscription {
    id: string;
    calendar_id: string;
    user_id: string;
    created_at: string;
    calendar?: Calendar;
}

// ============================================================
// EVENT TYPES
// ============================================================
export type LocationType = 'physical' | 'virtual' | 'hybrid' | 'none';
export type EventVisibility = 'public' | 'private' | 'unlisted';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface EventTheme {
    gradient?: string;
    color?: string;
}

export interface Event {
    id: string;
    host_id: string;
    calendar_id?: string;
    title: string;
    slug?: string;
    description?: string;
    start_date: string;
    end_date?: string;
    timezone?: string;
    location_type: LocationType;
    location_name?: string;
    location_address?: string;
    location_url?: string;
    location_lat?: number;
    location_lng?: number;
    cover_image_url?: string;
    theme?: EventTheme;
    capacity?: number;
    visibility: EventVisibility;
    require_approval?: boolean;
    allow_waitlist?: boolean;
    is_paid?: boolean;
    price_cents?: number;
    currency?: string;
    status: EventStatus;
    registration_count?: number;
    view_count?: number;
    created_at: string;
    updated_at?: string;
    published_at?: string;
    host?: Profile;
    calendar?: Calendar;
    ticket_types?: TicketType[];
    price?: string;
}

export interface EventFilters {
    host_id?: string;
    calendar_id?: string;
    status?: EventStatus;
    visibility?: EventVisibility;
    location_type?: LocationType;
    start_after?: string;
    start_before?: string;
    category?: string;
    city?: string;
    search?: string;
    limit?: number;
    offset?: number;
}

// ============================================================
// TICKET TYPES
// ============================================================
export interface TicketType {
    id: string;
    event_id: string;
    name: string;
    description?: string;
    price_cents: number;
    currency: string;
    quantity_available?: number;
    quantity_sold: number;
    max_per_order: number;
    sales_start?: string;
    sales_end?: string;
    is_visible: boolean;
    sort_order: number;
    created_at: string;
}

export interface CreateTicketTypeInput {
    event_id: string;
    name: string;
    description?: string;
    price_cents?: number;
    currency?: string;
    quantity_available?: number;
    max_per_order?: number;
    sales_start?: string;
    sales_end?: string;
}

// ============================================================
// REGISTRATION/GUEST TYPES
// ============================================================
export type RegistrationStatus = 'pending' | 'approved' | 'waitlist' | 'cancelled' | 'checked_in';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export interface Registration {
    id: string;
    event_id: string;
    user_id: string;
    ticket_type_id?: string;
    status: RegistrationStatus;
    payment_status: PaymentStatus;
    payment_intent_id?: string;
    amount_paid_cents: number;
    form_responses?: Record<string, any>;
    checked_in_at?: string;
    created_at: string;
    updated_at?: string;
    user?: Profile;
    event?: Event;
    ticket_type?: TicketType;
}

export interface RegisterForEventInput {
    event_id: string;
    ticket_type_id?: string;
    form_responses?: Record<string, any>;
}

// ============================================================
// SERVICE INTERFACES
// ============================================================

export interface AuthService {
    signIn(email: string): Promise<{ user: User | null; error: string | null }>;
    signUp(email: string, name?: string): Promise<{ user: User | null; error: string | null }>;
    signOut(): Promise<{ error: string | null }>;
    getCurrentUser(): Promise<{ user: User | null; error: string | null }>;
}

export interface EventService {
    createEvent(event: Omit<Event, 'id' | 'created_at' | 'host_id'>): Promise<{ event: Event | null; error: string | null }>;
    getEvents(filters?: EventFilters): Promise<{ events: Event[]; error: string | null }>;
    getEventById(id: string): Promise<{ event: Event | null; error: string | null }>;
    getEventBySlug(slug: string): Promise<{ event: Event | null; error: string | null }>;
    updateEvent(id: string, updates: Partial<Event>): Promise<{ event: Event | null; error: string | null }>;
    deleteEvent(id: string): Promise<{ error: string | null }>;
    publishEvent(id: string): Promise<{ event: Event | null; error: string | null }>;
    cancelEvent(id: string): Promise<{ event: Event | null; error: string | null }>;
}
