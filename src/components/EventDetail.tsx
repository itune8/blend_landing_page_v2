import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Calendar, MapPin, Users, Share2,
    CheckCircle, Globe, Lock, Ticket, User
} from 'lucide-react'
import { eventService, type Event } from '@/services'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

// Theme gradients matching EventForm
const themeGradients: Record<string, string> = {
    'Minimal': 'from-gray-900 to-gray-800',
    'Sunrise': 'from-orange-500 to-pink-500',
    'Ocean': 'from-blue-500 to-teal-400',
    'Forest': 'from-green-600 to-emerald-400',
    'Sunset': 'from-purple-600 to-orange-400',
    'Midnight': 'from-indigo-900 to-purple-800',
    'Aurora': 'from-green-400 to-purple-500',
    'Candy': 'from-pink-400 to-purple-400',
}

export function EventDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAuth()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [registered, setRegistered] = useState(false)

    useEffect(() => {
        const loadEvent = async () => {
            if (!id) return
            setLoading(true)
            console.log('[EventDetail] Loading event:', id)
            const { event: eventData, error: eventError } = await eventService.getEventById(id)
            console.log('[EventDetail] Event loaded:', eventData, eventError)
            if (eventError) {
                setError(eventError)
            } else {
                setEvent(eventData)
            }
            setLoading(false)
        }
        loadEvent()
    }, [id])

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    const handleRegister = () => {
        if (!user) {
            alert('Please sign in to register')
            return
        }
        setRegistered(true)
        // In real app, would call registrationService.register(event.id)
    }

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: event?.title,
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-[#111] flex flex-col items-center justify-center text-white">
                <h1 className="text-2xl font-bold mb-4">Event not found</h1>
                <p className="text-gray-400 mb-6">{error || 'This event may have been removed'}</p>
                <Button onClick={() => navigate('/events')}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Events
                </Button>
            </div>
        )
    }

    // Use theme gradient from event or fallback to Minimal
    const themeName = event.theme?.name || 'Minimal'
    const gradient = event.theme?.gradient || themeGradients[themeName] || themeGradients['Minimal']
    const isHost = user?.id === event.host_id
    const isPaid = event.price && event.price !== 'Free' && event.price !== '0'

    return (
        <div className="min-h-screen bg-[#111] text-white">
            {/* Hero Section with Gradient */}
            <div className={`relative h-64 md:h-80 bg-gradient-to-br ${gradient}`}>
                {event.cover_image_url && (
                    <img
                        src={event.cover_image_url}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent" />

                {/* Back button */}
                <Link
                    to="/events"
                    className="absolute top-4 left-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors backdrop-blur-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>

                {/* Share button */}
                <button
                    onClick={handleShare}
                    className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors backdrop-blur-sm"
                >
                    <Share2 className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-10">
                {/* Event Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden"
                >
                    {/* Main Info */}
                    <div className="p-6 md:p-8">
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{event.title}</h1>

                        {/* Date & Time */}
                        <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 bg-white/5 rounded-xl">
                                <Calendar className="w-5 h-5 text-teal-400" />
                            </div>
                            <div>
                                <p className="font-medium">{formatDate(event.start_date)}</p>
                                <p className="text-gray-400 text-sm">
                                    {formatTime(event.start_date)} - {formatTime(event.end_date)}
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        {event.location_url && (
                            <div className="flex items-start gap-4 mb-4">
                                <div className="p-3 bg-white/5 rounded-xl">
                                    <MapPin className="w-5 h-5 text-teal-400" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {event.location_type === 'virtual' ? 'Online Event' : event.location_url}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {event.location_type === 'virtual' ? 'Link provided after registration' : 'In-person'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Visibility & Capacity */}
                        <div className="flex gap-3 mb-6">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-sm">
                                {event.visibility === 'public' ? (
                                    <Globe className="w-4 h-4 text-gray-400" />
                                ) : (
                                    <Lock className="w-4 h-4 text-gray-400" />
                                )}
                                <span className="text-gray-300 capitalize">{event.visibility}</span>
                            </div>
                            {event.capacity && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-sm">
                                    <Users className="w-4 h-4 text-gray-400" />
                                    <span className="text-gray-300">{event.capacity} spots</span>
                                </div>
                            )}
                            {isPaid && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-500/10 border border-teal-500/20 rounded-full text-sm">
                                    <Ticket className="w-4 h-4 text-teal-400" />
                                    <span className="text-teal-400">{event.price}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div className="border-t border-white/5 pt-6">
                                <h2 className="font-semibold mb-3">About this event</h2>
                                <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer with Actions */}
                    <div className="p-6 bg-[#151515] border-t border-white/5 flex items-center justify-between">
                        {/* Host Info */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Hosted by</p>
                                <p className="font-medium">{isHost ? 'You' : 'Event Host'}</p>
                            </div>
                        </div>

                        {/* Register Button */}
                        {!isHost && (
                            <Button
                                onClick={handleRegister}
                                disabled={registered}
                                className={`px-6 py-2.5 rounded-xl font-medium transition-all ${registered
                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                    : 'bg-teal-500 hover:bg-teal-600 text-black'
                                    }`}
                            >
                                {registered ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Registered
                                    </>
                                ) : isPaid ? (
                                    `Register • ${event.price}`
                                ) : (
                                    'Register'
                                )}
                            </Button>
                        )}

                        {isHost && (
                            <Button
                                onClick={() => navigate(`/edit/${event.id}`)}
                                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl font-medium"
                            >
                                Edit Event
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Spacer */}
            <div className="h-20" />
        </div>
    )
}
