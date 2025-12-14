-- ============================================================
-- BLEND DATABASE SCHEMA (Luma-style Event Platform)
-- ============================================================
-- Run this in your Supabase SQL Editor (Database > SQL Editor)
-- This creates a full-featured event management system

-- ============================================================
-- 1. USER PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    timezone TEXT DEFAULT 'UTC',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. CALENDARS (Event Organizer Profiles)
-- ============================================================
CREATE TABLE IF NOT EXISTS calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    avatar_url TEXT,
    cover_image_url TEXT,
    color TEXT DEFAULT '#14b8a6',
    is_public BOOLEAN DEFAULT TRUE,
    subscriber_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    host_id UUID REFERENCES auth.users(id) NOT NULL,
    calendar_id UUID REFERENCES calendars(id) ON DELETE SET NULL,

    -- Basic Info
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,

    -- Date/Time
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    timezone TEXT DEFAULT 'UTC',

    -- Location
    location_type TEXT CHECK (location_type IN ('physical', 'virtual', 'hybrid', 'none')) DEFAULT 'none',
    location_name TEXT,
    location_address TEXT,
    location_url TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),

    -- Media
    cover_image_url TEXT,
    theme JSONB DEFAULT '{"gradient": "from-teal-400 to-blue-500"}',

    -- Settings
    capacity INTEGER,
    visibility TEXT CHECK (visibility IN ('public', 'private', 'unlisted')) DEFAULT 'public',
    require_approval BOOLEAN DEFAULT FALSE,
    allow_waitlist BOOLEAN DEFAULT TRUE,

    -- Ticketing
    is_paid BOOLEAN DEFAULT FALSE,
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'INR',

    -- Status
    status TEXT CHECK (status IN ('draft', 'published', 'cancelled', 'completed')) DEFAULT 'draft',

    -- Stats (denormalized for performance)
    registration_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    published_at TIMESTAMPTZ
);

-- ============================================================
-- 4. TICKET TYPES (Multiple ticket tiers per event)
-- ============================================================
CREATE TABLE IF NOT EXISTS ticket_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL DEFAULT 'General Admission',
    description TEXT,
    price_cents INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'INR',
    quantity_available INTEGER,
    quantity_sold INTEGER DEFAULT 0,
    max_per_order INTEGER DEFAULT 10,
    sales_start TIMESTAMPTZ,
    sales_end TIMESTAMPTZ,
    is_visible BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. REGISTRATIONS (Event Attendees)
-- ============================================================
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE SET NULL,

    -- Status
    status TEXT CHECK (status IN ('pending', 'approved', 'waitlist', 'cancelled', 'checked_in')) DEFAULT 'pending',

    -- Payment
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')) DEFAULT 'pending',
    payment_intent_id TEXT,
    amount_paid_cents INTEGER DEFAULT 0,

    -- Custom Form Responses
    form_responses JSONB,

    -- Check-in
    checked_in_at TIMESTAMPTZ,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    UNIQUE(event_id, user_id)
);

-- ============================================================
-- 6. CO-HOSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS event_cohosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT CHECK (role IN ('cohost', 'moderator')) DEFAULT 'cohost',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(event_id, user_id)
);

-- ============================================================
-- 7. CALENDAR SUBSCRIPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS calendar_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(calendar_id, user_id)
);

-- ============================================================
-- 8. EVENT INVITATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    invited_by UUID REFERENCES auth.users(id),
    status TEXT CHECK (status IN ('pending', 'sent', 'opened', 'accepted', 'declined')) DEFAULT 'pending',
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. COUPONS/DISCOUNTS
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    calendar_id UUID REFERENCES calendars(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value INTEGER NOT NULL,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT event_or_calendar CHECK (event_id IS NOT NULL OR calendar_id IS NOT NULL)
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_cohosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- CALENDARS POLICIES
CREATE POLICY "Public calendars are viewable by everyone" ON calendars
    FOR SELECT USING (is_public = TRUE OR owner_id = auth.uid());

CREATE POLICY "Users can create calendars" ON calendars
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update own calendars" ON calendars
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete own calendars" ON calendars
    FOR DELETE USING (auth.uid() = owner_id);

-- EVENTS POLICIES
CREATE POLICY "Public events are viewable by everyone" ON events
    FOR SELECT USING (visibility = 'public' OR host_id = auth.uid());

CREATE POLICY "Users can view their own private events" ON events
    FOR SELECT USING (host_id = auth.uid());

CREATE POLICY "Users can create events" ON events
    FOR INSERT WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their events" ON events
    FOR UPDATE USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their events" ON events
    FOR DELETE USING (auth.uid() = host_id);

-- TICKET TYPES POLICIES
CREATE POLICY "Ticket types viewable for visible events" ON ticket_types
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = ticket_types.event_id
            AND (events.visibility = 'public' OR events.host_id = auth.uid())
        )
    );

CREATE POLICY "Hosts can manage ticket types" ON ticket_types
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = ticket_types.event_id
            AND events.host_id = auth.uid()
        )
    );

-- REGISTRATIONS POLICIES
CREATE POLICY "Users can view their own registrations" ON registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hosts can view registrations for their events" ON registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM events
            WHERE events.id = registrations.event_id
            AND events.host_id = auth.uid()
        )
    );

CREATE POLICY "Users can register for events" ON registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own registrations" ON registrations
    FOR UPDATE USING (auth.uid() = user_id);

-- CALENDAR SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view their subscriptions" ON calendar_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can subscribe to calendars" ON calendar_subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsubscribe" ON calendar_subscriptions
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_events_host_id ON events(host_id);
CREATE INDEX IF NOT EXISTS idx_events_calendar_id ON events(calendar_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_visibility ON events(visibility);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user_id ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

CREATE INDEX IF NOT EXISTS idx_calendars_owner_id ON calendars(owner_id);
CREATE INDEX IF NOT EXISTS idx_calendars_slug ON calendars(slug);

CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON ticket_types(event_id);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Function to increment registration count
CREATE OR REPLACE FUNCTION increment_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE events
    SET registration_count = registration_count + 1
    WHERE id = NEW.event_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_created
    AFTER INSERT ON registrations
    FOR EACH ROW EXECUTE FUNCTION increment_registration_count();

-- Function to decrement registration count on cancellation
CREATE OR REPLACE FUNCTION decrement_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE events
        SET registration_count = registration_count - 1
        WHERE id = NEW.event_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_cancelled
    AFTER UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION decrement_registration_count();

-- ============================================================
-- SEED DATA (Optional - for testing)
-- ============================================================
-- Uncomment below to add sample data

-- INSERT INTO calendars (owner_id, name, slug, description) VALUES
-- (auth.uid(), 'My Events', 'my-events', 'Personal event calendar');
