
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft, MapPin,
    ChevronDown, Plus, Ticket, Calendar, LogOut
} from "lucide-react"
import type { Event } from "@/services"
import { eventService } from "@/services"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export function CreateEvent() {
    // State for the Auth Modal
    const [showAuthModal, setShowAuthModal] = useState(false)
    const [email, setEmail] = useState("")
    const { user, signIn, signInWithGoogle, signOut } = useAuth()
    const isAuthenticated = !!user
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Dashboard State
    const [eventsFilter, setEventsFilter] = useState<'upcoming' | 'past'>('upcoming')
    const [myEvents, setMyEvents] = useState<Event[]>([])

    // Navigation
    const routerLocation = useLocation()
    const navigate = useNavigate()

    // Derive active tab from URL path
    const getActiveTab = () => {
        const path = routerLocation.pathname
        if (path.includes('calendars')) return 'calendars'
        if (path.includes('discover')) return 'discover'
        return 'events'
    }

    const activeTab = getActiveTab()

    useEffect(() => {
        const loadEvents = async () => {
            if (user) {
                console.log('[Dashboard] Loading events for user:', user.id, user.email)
                // Don't pass user.id - let Supabase service use the authenticated user
                const { events, error } = await eventService.getEvents()
                console.log('[Dashboard] Events loaded:', events?.length, 'Error:', error)
                if (events) {
                    console.log('[Dashboard] Events:', events.map(e => ({ id: e.id, title: e.title })))
                }
                setMyEvents(events || [])
            } else {
                console.log('[Dashboard] No user, clearing events')
                setMyEvents([])
            }
        }
        loadEvents()
    }, [user, activeTab]) // Reload when user or tab changes

    const upcomingEvents = myEvents.filter(e => new Date(e.start_date) > new Date())
    const pastEvents = myEvents.filter(e => new Date(e.start_date) <= new Date())

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [routerLocation.pathname])

    // Handle authentication
    const handleAuth = async () => {
        await signIn(email || "user@demo.com")
        setShowAuthModal(false)
    }

    return (
        <div className="min-h-screen w-full bg-[#111] text-white font-sans selection:bg-teal-500/30">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#111] border-b border-white/5 flex items-center justify-between px-6 z-40">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-400">
                        <button
                            onClick={() => navigate('/events')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'events' ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                        >
                            Events
                        </button>
                        <button
                            onClick={() => navigate('/calendars')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'calendars' ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                        >
                            Calendars
                        </button>
                        <button
                            onClick={() => navigate('/discover')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'discover' ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                        >
                            Discover
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-500">2:52 am IST</div>
                    {isAuthenticated ? (
                        <div className="relative">
                            <div
                                className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-xs font-bold text-black cursor-pointer ring-2 ring-white/10 hover:ring-white/20 transition-all"
                                onClick={() => setShowUserMenu(!showUserMenu)}
                            >
                                {user?.avatar_url ? (
                                    <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <span className="text-black">{user?.name?.substring(0, 2).toUpperCase() || "JD"}</span>
                                )}
                            </div>

                            {/* User Dropdown Menu */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden shadow-xl z-50"
                                    >
                                        <div className="p-3 border-b border-white/5">
                                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                await signOut()
                                                setShowUserMenu(false)
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-white"
                            onClick={() => setShowAuthModal(true)}
                        >
                            Sign In
                        </Button>
                    )}
                </div>
            </div>

            {/* Content Switcher */}
            {activeTab === 'events' ? (
                /* =====================================================================================
                   EVENTS TAB CONTENT (DASHBOARD)
                   ===================================================================================== */
                <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-white">Events</h1>
                        <div className="bg-[#1a1a1a] p-1 rounded-lg border border-white/5 flex gap-1">
                            <button
                                onClick={() => setEventsFilter('upcoming')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${eventsFilter === 'upcoming' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Upcoming
                            </button>
                            <button
                                onClick={() => setEventsFilter('past')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${eventsFilter === 'past' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                Past
                            </button>
                        </div>
                    </div>

                    {eventsFilter === 'upcoming' ? (
                        upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
                                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${event.cover_image_url ? '' : 'bg-gradient-to-br ' + (event.theme?.gradient || 'from-gray-700 to-gray-600')}`}>
                                            {event.cover_image_url ? (
                                                <img src={event.cover_image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <span>📅</span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{event.title}</h4>
                                            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(event.start_date).toLocaleDateString()} • {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        <div className="ml-auto">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-400 border border-white/5 hover:text-white"
                                                onClick={() => navigate(`/event/${event.id}`)}
                                            >
                                                Manage
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-24 h-24 bg-[#1a1a1a] rounded-3xl flex items-center justify-center mb-6 border border-white/5">
                                    <span className="text-4xl font-bold text-gray-700">0</span>
                                </div>
                                <h2 className="text-xl font-medium text-white mb-2">No Upcoming Events</h2>
                                <p className="text-gray-500 mb-8 max-w-sm">You have no upcoming events. Why not host one?</p>
                                <Button
                                    onClick={() => navigate('/create')}
                                    className="bg-white text-black hover:bg-gray-200"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Event
                                </Button>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col gap-4">
                            {pastEvents.length > 0 ? pastEvents.map(event => (
                                <div key={event.id} className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 flex gap-4 items-center opacity-70 hover:opacity-100 transition-opacity">
                                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl ${event.cover_image_url ? '' : 'bg-gray-800'}`}>
                                        {event.cover_image_url ? (
                                            <img src={event.cover_image_url} alt="" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <span>🏁</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{event.title}</h4>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {event.location_type === 'physical' ? (event.location_url || 'Location') : 'Virtual'}
                                        </div>
                                    </div>
                                    <div className="ml-auto flex items-center gap-3">
                                        <span className="bg-gray-500/20 text-gray-400 text-[10px] px-2 py-0.5 rounded-full font-bold">Ended</span>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-10 text-gray-500">No past events found.</div>
                            )}
                        </div>
                    )}
                </div>
            ) : activeTab === 'calendars' ? (
                /* =====================================================================================
                   CALENDARS TAB CONTENT
                   ===================================================================================== */
                <div className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-white mb-8">Calendars</h1>

                    {/* My Calendars Section */}
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">My Calendars</h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white h-8 hover:bg-white/5"
                                onClick={() => navigate('/create')}
                            >
                                <Plus className="w-4 h-4 mr-1" />
                                Create
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors cursor-pointer group">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-teal-400 transition-colors">
                                            {isAuthenticated ? user?.name || "User Profile" : "Guest User"}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">No Subscribers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscribed Calendars Section */}
                    <div>
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Subscribed Calendars</h2>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-white mb-1">No Subscriptions</h3>
                            <p className="text-gray-500 text-sm">You have not subscribed to any calendars.</p>
                        </div>
                    </div>
                </div>

            ) : activeTab === 'discover' ? (
                /* =====================================================================================
                   DISCOVER TAB CONTENT
                   ===================================================================================== */
                <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
                    {/* Discover Hero */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-2 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span className="text-sm font-medium">Pune, IN</span>
                                <ChevronDown className="w-3 h-3" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Discover Events</h1>
                        </div>

                        {/* Tags Scroll */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide max-w-full md:max-w-xl">
                            {["All", "Tech", "Founders", "AI", "Design", "Product", "Social", "Crypto"].map((tag, i) => (
                                <button
                                    key={tag}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border border-white/10 ${i === 0 ? 'bg-white text-black' : 'bg-[#1a1a1a] text-gray-300 hover:bg-white/10'}`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Trending Section */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                Trending in Pune
                            </h2>
                            <button className="text-sm text-gray-400 hover:text-white transition-colors">View all</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Pune Tech Mixer: December Edition", date: "Dec 14", time: "6:00 PM", location: "Koregaon Park", color: "from-purple-500 to-indigo-500" },
                                { title: "AI Builders Meetup", date: "Dec 15", time: "10:00 AM", location: "Baner", color: "from-teal-400 to-emerald-500" },
                                { title: "Founders & VC Networking", date: "Dec 16", time: "5:30 PM", location: "Viman Nagar", color: "from-orange-500 to-red-500" },
                                { title: "Design Systems Workshop", date: "Dec 18", time: "2:00 PM", location: "Aundh", color: "from-blue-400 to-cyan-500" }
                            ].map((event, i) => (
                                <div key={i} className="group cursor-pointer" onClick={() => alert(`${event.title}\n${event.date} at ${event.time}\n${event.location}\n\nThis is a demo event.`)}>
                                    <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${event.color} relative overflow-hidden mb-4`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md rounded-lg px-2 py-1 flex flex-col items-center shadow-lg">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{event.date.split(" ")[0]}</span>
                                            <span className="text-lg font-bold text-black leading-none">{event.date.split(" ")[1]}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-white text-lg leading-tight mb-1 group-hover:text-gray-300 transition-colors">{event.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <span>{event.time}</span>
                                        <span>•</span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* This Week Section */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-6">This Week</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: "React Native Meetup", date: "Sat, Dec 14", time: "4:00 PM", location: "Tech Park, Kharadi", color: "bg-blue-600" },
                                { title: "Indie Hackers Pune", date: "Sun, Dec 15", time: "11:00 AM", location: "Starbucks, FC Road", color: "bg-yellow-600" },
                                { title: "Web3 Developer Sprint", date: "Mon, Dec 16", time: "9:00 AM", location: "Co-work, Balewadi", color: "bg-purple-600" }
                            ].map((event, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:border-white/10 transition-colors cursor-pointer group" onClick={() => alert(`${event.title}\n${event.date} at ${event.time}\n${event.location}\n\nThis is a demo event.`)}>
                                    <div className={`w-16 h-16 rounded-xl ${event.color} flex-shrink-0`} />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white text-base mb-1 group-hover:text-teal-400 transition-colors">{event.title}</h3>
                                        <div className="text-sm text-gray-500 flex items-center gap-3">
                                            <span>{event.date}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-600" />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="hidden md:flex bg-white/5 hover:bg-white/10 text-white border border-white/5"
                                        onClick={() => alert('Event details coming soon! This is a demo event.')}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : null}

            {/* =====================================================================================
                AUTH MODAL OVERLAY
               ===================================================================================== */}
            <AnimatePresence>
                {showAuthModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        {/* Backdrop with blur */}
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal Card */}
                        <motion.div
                            className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                        >
                            <div className="p-8">
                                <div className="size-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                                    <svg className="size-8 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                    </svg>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Blend</h2>
                                <p className="text-gray-400 text-sm mb-8">Please sign in or sign up below.</p>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <label className="font-medium text-gray-400">Email</label>
                                            <span className="text-gray-500 hover:text-gray-300 cursor-pointer flex items-center gap-1">
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /></svg>
                                                Use Mobile Number
                                            </span>
                                        </div>
                                        <div className="relative group">
                                            <input
                                                type="email"
                                                placeholder="you@email.com"
                                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-11 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm transition-all"
                                        onClick={handleAuth}
                                    >
                                        Continue with Email
                                    </Button>

                                    <div className="relative py-2">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-white/10" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <button
                                            className="flex items-center justify-center gap-3 h-11 bg-[#222] hover:bg-[#2a2a2a] rounded-xl transition-all group border border-white/5"
                                            onClick={async () => {
                                                const { error } = await signInWithGoogle()
                                                if (error) {
                                                    alert('Google sign-in error: ' + error)
                                                } else {
                                                    setShowAuthModal(false)
                                                }
                                            }}
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                                <path d="M12 4.66c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            <span className="text-sm font-medium text-white/80 group-hover:text-white">Sign in with Google</span>
                                        </button>
                                        <button
                                            className="flex items-center justify-center gap-3 h-11 bg-[#222] hover:bg-[#2a2a2a] rounded-xl transition-all group border border-white/5"
                                            onClick={handleAuth}
                                        >
                                            <svg className="w-5 h-5 text-white/70 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-sm font-medium text-white/80 group-hover:text-white">Sign in with Passkey</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    )
}
