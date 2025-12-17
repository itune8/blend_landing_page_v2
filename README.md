# 📁 Blend Landing Page - Project Structure

> A modern Next.js 15 event platform landing page with Supabase backend, Stripe/Razorpay payments, and stunning UI animations.

---

## 🏗️ Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **UI Components** | Radix UI + custom components |
| **Backend** | Supabase (Auth + Database) |
| **Payments** | Stripe + Razorpay |
| **Icons** | Lucide React |

---

## 📂 Directory Structure

```
Blend_Land_13Dec/
│
├── 📁 app/                          # Next.js App Router pages
│   ├── 📄 layout.tsx                # Root layout with theme & auth providers
│   ├── 📄 page.tsx                  # Homepage (Hero section)
│   ├── 📄 globals.css               # Global styles & CSS variables
│   │
│   ├── 📁 calendars/                # Calendar management page
│   ├── 📁 create/                   # Legacy create page
│   ├── 📁 create-event/             # Event creation page
│   ├── 📁 discover/                 # Event discovery/browse page
│   ├── 📁 event/                    # Individual event page
│   ├── 📁 events/                   # Events listing page
│   ├── 📁 payment-test/             # Payment testing page
│   ├── 📁 pricing/                  # Pricing page
│   └── 📁 whats-blend/              # About Blend page
│
├── 📁 components/                   # Reusable React components
│   ├── 📄 CreateEvent.tsx           # Event creation form component
│   ├── 📄 DeviceShowcase.tsx        # Device mockup showcase
│   ├── 📄 EventForm.tsx             # Comprehensive event form
│   ├── 📄 FloatingEventCards.tsx    # 3D floating event cards animation
│   ├── 📄 Footer.tsx                # Site footer with links & social
│   ├── 📄 Hero.tsx                  # Hero section with CTA
│   ├── 📄 Navbar.tsx                # Navigation bar with theme toggle
│   ├── 📄 PhoneMockup.tsx           # Phone mockup with app preview
│   ├── 📄 Pricing.tsx               # Pricing plans component
│   │
│   └── 📁 ui/                       # Base UI components (shadcn-style)
│       ├── 📄 button.tsx            # Button component with variants
│       └── 📄 card.tsx              # Card component
│
├── 📁 contexts/                     # React Context providers
│   └── 📄 AuthContext.tsx           # Authentication context & provider
│
├── 📁 hooks/                        # Custom React hooks
│   └── 📄 usePayment.ts             # Payment processing hook
│
├── 📁 lib/                          # Utility libraries
│   ├── 📄 supabase.ts               # Supabase client configuration
│   └── 📄 utils.ts                  # General utility functions (cn)
│
├── 📁 services/                     # Service layer (API abstraction)
│   ├── 📄 index.ts                  # Service exports
│   ├── 📄 types.ts                  # TypeScript interfaces & types
│   │
│   ├── 📁 mock/                     # Mock services for development
│   │   ├── 📄 auth.mock.ts          # Mock authentication service
│   │   └── 📄 event.mock.ts         # Mock event service
│   │
│   └── 📁 supabase/                 # Supabase service implementations
│       ├── 📄 auth.supabase.ts      # Supabase auth service
│       └── 📄 event.supabase.ts     # Supabase event service
│
├── 📁 supabase/                     # Supabase configuration
│   └── 📄 schema.sql                # Database schema definitions
│
├── 📁 public/                       # Static assets
│   ├── 📄 Blend_App_Hero_Edit.MP4   # Hero video for phone mockup
│   ├── 📄 logo_blend.png            # Blend logo (PNG)
│   ├── 📄 logo_blend.jpg            # Blend logo (JPG)
│   ├── 📄 blend_circle_bg.png       # Circle background asset
│   ├── 📄 blend_*.png               # Event background images
│   │
│   └── 📁 events/                   # Event-related images
│       └── 📄 car-meetup.jpg        # Sample event image
│
├── 📄 package.json                  # Dependencies & scripts
├── 📄 next.config.js                # Next.js configuration
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 tsconfig.json                 # TypeScript configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 vercel.json                   # Vercel deployment config
├── 📄 .env.local                    # Environment variables (local)
└── 📄 .env.example                  # Environment variables template
```

---

## 🧩 Component Architecture

### Core Layout Components

```
┌─────────────────────────────────────────────────────────────┐
│                        RootLayout                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   AuthProvider                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │               ThemeContext.Provider              │  │  │
│  │  │                                                  │  │  │
│  │  │   ┌────────────────────────────────────────┐    │  │  │
│  │  │   │              Page Content               │    │  │  │
│  │  │   └────────────────────────────────────────┘    │  │  │
│  │  │                                                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Homepage Structure

```
HomePage
├── Navbar                  # Fixed navigation with theme toggle
│   ├── BlendLogo          # Brand logo
│   ├── ThemeToggle        # Dark/Light mode switch
│   └── NavLinks           # What's Blend, Discover, Create Event
│
├── Hero                    # Main hero section
│   ├── BackgroundGradient # Animated teal gradient blobs
│   ├── FloatingEventCards # 3D event cards around edges
│   └── CTA Button         # "Create Your First Event"
│
└── Footer                  # Site footer
    ├── BlendWordmark      # Logo
    ├── FooterLinks        # Discover, Community, Help
    ├── SocialLinks        # Email, App Store, X, Instagram
    └── SecondaryLinks     # Terms, Privacy
```

---

## 📋 Key Components Reference

### `Hero.tsx`
> Main landing section with animated background and CTA

- **BackgroundGradient** - Three animated teal gradient blobs
- **FloatingEventCards** - Dynamically loaded 3D cards
- **Framer Motion** animations for staggered reveal

### `FloatingEventCards.tsx`
> 3D interactive event cards with mouse tracking

- **FloatingCard** - Individual 3D card with parallax effect
- Desktop-only with full 3D transforms
- Mouse-based rotation and depth effects

### `Navbar.tsx`
> Fixed navigation with responsive design

- **BlendLogo** - Brand logo component
- Theme toggle (sun/moon icons)
- Navigation links with hover effects

### `Footer.tsx`
> Comprehensive footer with social links

- Wordmark logo
- Navigation links grid
- Social media icons (Email, App Store, X, Instagram)
- Secondary links (Terms, Privacy)

### `PhoneMockup.tsx`
> Phone mockup with video and event cards

- iPhone-style frame with video playback
- Animated event cards inside mockup
- Avatar pile component for attendees

---

## 🔌 Services Layer

### Type Definitions (`services/types.ts`)

```typescript
// Core Types
├── User                    // User account data
├── Profile                 // Extended user profile
├── Calendar                // Calendar/organization
├── CalendarSubscription    // User calendar subscriptions
├── Event                   // Event details
├── EventFilters            // Event query filters
├── TicketType              // Ticket tiers for events
├── Registration            // User event registrations

// Service Interfaces
├── AuthService             // Authentication methods
└── EventService            // Event CRUD operations
```

### Service Implementations

| Service | Mock | Supabase |
|---------|------|----------|
| **Auth** | `auth.mock.ts` | `auth.supabase.ts` |
| **Events** | `event.mock.ts` | `event.supabase.ts` |

---

## 🎨 Styling System

### CSS Variables (globals.css)

```css
:root {
  --background: ...
  --foreground: ...
  --primary: ...        /* Teal accent color */
  --secondary: ...
  --accent: ...
  --muted: ...
}

.dark {
  /* Dark theme overrides */
}
```

### Tailwind Theme Extensions

- Custom teal color palette
- Extended animations (float, bounce, shimmer)
- Custom gradients for buttons and backgrounds

---

## 🚀 Scripts

```bash
# Development server
npm run dev              # Start on default port (3000)
npm run dev -- -p 2009   # Start on port 2009

# Production
npm run build            # Create production build
npm run start            # Start production server

# Linting
npm run lint             # Run ESLint
```

---

## 🔐 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Payment Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
```

---

## 📱 Page Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with Hero section |
| `/discover` | Browse and discover events |
| `/create-event` | Create a new event |
| `/event/[id]` | Individual event details |
| `/events` | List of all events |
| `/calendars` | User calendars management |
| `/pricing` | Pricing plans |
| `/whats-blend` | About Blend |
| `/payment-test` | Payment testing (dev) |

---

## 🔄 Data Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Component  │◄───│   Context    │◄───│   Service    │
│              │    │  (Auth/Theme)│    │  (API Layer) │
└──────┬───────┘    └──────────────┘    └──────┬───────┘
       │                                        │
       │                                        ▼
       │                               ┌──────────────┐
       │                               │   Supabase   │
       │                               │   (Backend)  │
       └───────────────────────────────►──────────────┘
```

---

## 📝 Notes

- **Theme System**: Uses CSS variables with `dark` class toggle
- **Dynamic Imports**: FloatingEventCards lazily loaded for performance
- **Responsive**: Mobile-first with desktop enhancements
- **Animations**: Framer Motion throughout with reduced motion on mobile
- **Type Safety**: Full TypeScript coverage with strict mode

---

*Last updated: December 17, 2025*
