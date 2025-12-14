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
    // Joined data
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

    // Basic Info
    title: string;
    slug?: string;
    description?: string;

    // Date/Time
    start_date: string;
    end_date?: string;
    timezone?: string;

    // Location
    location_type: LocationType;
    location_name?: string;
    location_address?: string;
    location_url?: string;
    location_lat?: number;
    location_lng?: number;

    // Media
    cover_image_url?: string;
    theme?: EventTheme;

    // Settings
    capacity?: number;
    visibility: EventVisibility;
    require_approval?: boolean;
    allow_waitlist?: boolean;

    // Ticketing
    is_paid?: boolean;
    price_cents?: number;
    currency?: string;

    // Status
    status: EventStatus;

    // Stats
    registration_count?: number;
    view_count?: number;

    // Timestamps
    created_at: string;
    updated_at?: string;
    published_at?: string;

    // Joined data
    host?: Profile;
    calendar?: Calendar;
    ticket_types?: TicketType[];

    // Legacy compatibility
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

    // Status
    status: RegistrationStatus;

    // Payment
    payment_status: PaymentStatus;
    payment_intent_id?: string;
    amount_paid_cents: number;

    // Custom Form
    form_responses?: Record<string, any>;

    // Check-in
    checked_in_at?: string;

    // Timestamps
    created_at: string;
    updated_at?: string;

    // Joined data
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
// CO-HOST TYPES
// ============================================================
export type CoHostRole = 'cohost' | 'moderator';

export interface EventCoHost {
    id: string;
    event_id: string;
    user_id: string;
    role: CoHostRole;
    created_at: string;
    user?: Profile;
}

// ============================================================
// INVITATION TYPES
// ============================================================
export type InvitationStatus = 'pending' | 'sent' | 'opened' | 'accepted' | 'declined';

export interface Invitation {
    id: string;
    event_id: string;
    email: string;
    invited_by?: string;
    status: InvitationStatus;
    sent_at?: string;
    created_at: string;
}

// ============================================================
// COUPON TYPES
// ============================================================
export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
    id: string;
    event_id?: string;
    calendar_id?: string;
    code: string;
    discount_type: DiscountType;
    discount_value: number;
    max_uses?: number;
    uses_count: number;
    valid_from?: string;
    valid_until?: string;
    is_active: boolean;
    created_at: string;
}

// ============================================================
// DISCOVERY/EXPLORE TYPES
// ============================================================
export interface EventCategory {
    id: string;
    name: string;
    slug: string;
    icon?: string;
    event_count: number;
}

export interface City {
    id: string;
    name: string;
    country: string;
    region: string;
    lat: number;
    lng: number;
    event_count: number;
}

export interface DiscoverFilters {
    category?: string;
    city?: string;
    date_range?: 'today' | 'tomorrow' | 'this_week' | 'this_month';
    is_free?: boolean;
    is_online?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
}

export interface FeaturedCalendar {
    calendar: Calendar;
    reason?: string;
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
    // CRUD
    createEvent(event: Omit<Event, 'id' | 'created_at' | 'host_id'>): Promise<{ event: Event | null; error: string | null }>;
    getEvents(filters?: EventFilters): Promise<{ events: Event[]; error: string | null }>;
    getEventById(id: string): Promise<{ event: Event | null; error: string | null }>;
    getEventBySlug(slug: string): Promise<{ event: Event | null; error: string | null }>;
    updateEvent(id: string, updates: Partial<Event>): Promise<{ event: Event | null; error: string | null }>;
    deleteEvent(id: string): Promise<{ error: string | null }>;

    // Publishing
    publishEvent(id: string): Promise<{ event: Event | null; error: string | null }>;
    cancelEvent(id: string): Promise<{ event: Event | null; error: string | null }>;
}

export interface CalendarService {
    // CRUD
    createCalendar(calendar: Omit<Calendar, 'id' | 'created_at' | 'owner_id' | 'subscriber_count'>): Promise<{ calendar: Calendar | null; error: string | null }>;
    getCalendars(owner_id?: string): Promise<{ calendars: Calendar[]; error: string | null }>;
    getCalendarById(id: string): Promise<{ calendar: Calendar | null; error: string | null }>;
    getCalendarBySlug(slug: string): Promise<{ calendar: Calendar | null; error: string | null }>;
    updateCalendar(id: string, updates: Partial<Calendar>): Promise<{ calendar: Calendar | null; error: string | null }>;
    deleteCalendar(id: string): Promise<{ error: string | null }>;

    // Subscriptions
    subscribe(calendar_id: string): Promise<{ subscription: CalendarSubscription | null; error: string | null }>;
    unsubscribe(calendar_id: string): Promise<{ error: string | null }>;
    getSubscriptions(): Promise<{ subscriptions: CalendarSubscription[]; error: string | null }>;

    // Events
    getCalendarEvents(calendar_id: string, filters?: EventFilters): Promise<{ events: Event[]; error: string | null }>;
}

export interface RegistrationService {
    // Register
    register(input: RegisterForEventInput): Promise<{ registration: Registration | null; error: string | null }>;
    cancelRegistration(event_id: string): Promise<{ error: string | null }>;

    // User's registrations
    getMyRegistrations(): Promise<{ registrations: Registration[]; error: string | null }>;
    getRegistration(event_id: string): Promise<{ registration: Registration | null; error: string | null }>;

    // Host operations
    getEventGuests(event_id: string): Promise<{ guests: Registration[]; error: string | null }>;
    updateGuestStatus(registration_id: string, status: RegistrationStatus): Promise<{ registration: Registration | null; error: string | null }>;
    checkInGuest(registration_id: string): Promise<{ registration: Registration | null; error: string | null }>;

    // Invitations
    sendInvitations(event_id: string, emails: string[]): Promise<{ invitations: Invitation[]; error: string | null }>;
}

export interface TicketService {
    // CRUD
    createTicketType(input: CreateTicketTypeInput): Promise<{ ticket_type: TicketType | null; error: string | null }>;
    getTicketTypes(event_id: string): Promise<{ ticket_types: TicketType[]; error: string | null }>;
    updateTicketType(id: string, updates: Partial<TicketType>): Promise<{ ticket_type: TicketType | null; error: string | null }>;
    deleteTicketType(id: string): Promise<{ error: string | null }>;

    // Coupons
    createCoupon(coupon: Omit<Coupon, 'id' | 'created_at' | 'uses_count'>): Promise<{ coupon: Coupon | null; error: string | null }>;
    validateCoupon(code: string, event_id: string): Promise<{ coupon: Coupon | null; discount_amount: number; error: string | null }>;
}

export interface DiscoverService {
    // Explore
    getPopularEvents(filters?: DiscoverFilters): Promise<{ events: Event[]; error: string | null }>;
    getTrendingEvents(city?: string): Promise<{ events: Event[]; error: string | null }>;
    getUpcomingEvents(filters?: DiscoverFilters): Promise<{ events: Event[]; error: string | null }>;

    // Categories & Cities
    getCategories(): Promise<{ categories: EventCategory[]; error: string | null }>;
    getCities(): Promise<{ cities: City[]; error: string | null }>;

    // Featured
    getFeaturedCalendars(): Promise<{ calendars: FeaturedCalendar[]; error: string | null }>;

    // Search
    searchEvents(query: string, filters?: DiscoverFilters): Promise<{ events: Event[]; error: string | null }>;
}

export interface ProfileService {
    // Profile
    getProfile(user_id: string): Promise<{ profile: Profile | null; error: string | null }>;
    updateProfile(updates: Partial<Profile>): Promise<{ profile: Profile | null; error: string | null }>;

    // User's events & calendars
    getUserEvents(user_id: string): Promise<{ events: Event[]; error: string | null }>;
    getUserCalendars(user_id: string): Promise<{ calendars: Calendar[]; error: string | null }>;
}
