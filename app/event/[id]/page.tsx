"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Calendar, MapPin, Users, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { eventService, type Event } from "@/services"
import { Button } from "@/components/ui/button"

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadEvent = async () => {
            if (params?.id) {
                const { event: fetchedEvent, error } = await eventService.getEventById(params.id as string)
                if (error) {
                    console.error('Error loading event:', error)
                } else {
                    setEvent(fetchedEvent)
                }
                setLoading(false)
            }
        }
        loadEvent()
    }, [params?.id])

    if (loading) {
        return (
            <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
                <div className="animate-pulse text-gray-500">Loading event...</div>
            </div>
        )
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4">Event not found</h1>
                <Button onClick={() => router.push('/events')}>Back to Events</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#111] text-white">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#111]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/events" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <span className="font-medium text-white truncate max-w-xs">{event.title}</span>
                </div>
                <div className="flex items-center gap-2">
                    <motion.button
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Share2 className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <motion.button
                        className="p-2 hover:bg-white/5 rounded-full transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <ExternalLink className="w-5 h-5 text-gray-400" />
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-24 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Event Cover */}
                    <div className="aspect-video rounded-2xl bg-teal-600 mb-8 overflow-hidden relative">
                        {event.cover_image_url ? (
                            <img src={event.cover_image_url} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-6xl">📅</span>
                            </div>
                        )}
                    </div>

                    {/* Event Info */}
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-4">{event.title}</h1>

                            {event.description && (
                                <p className="text-gray-400 mb-6">{event.description}</p>
                            )}

                            {/* Date/Time */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-teal-400" />
                                    <div>
                                        <p className="text-white font-medium">
                                            {new Date(event.start_date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {event.end_date && ` - ${new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-teal-400" />
                                    <div>
                                        <p className="text-white font-medium">
                                            {event.location_type === 'virtual' ? 'Virtual Event' : event.location_url || 'Location TBD'}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {event.location_type === 'virtual' ? 'Online' : event.location_type}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Capacity */}
                            {event.capacity && (
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5 text-teal-400" />
                                        <div>
                                            <p className="text-white font-medium">{event.capacity} spots</p>
                                            <p className="text-gray-500 text-sm">Event capacity</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="w-full md:w-80">
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-6 sticky top-24">
                                <div className="text-center mb-6">
                                    <p className="text-3xl font-bold text-white mb-1">
                                        {event.price ? event.price : 'Free'}
                                    </p>
                                    <p className="text-gray-500 text-sm">
                                        {event.visibility === 'public' ? 'Public Event' : 'Private Event'}
                                    </p>
                                </div>

                                <Button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl h-12 mb-3">
                                    Register
                                </Button>

                                <Button
                                    variant="ghost"
                                    className="w-full border border-white/10 text-gray-400 hover:text-white rounded-xl h-12"
                                    onClick={() => router.push('/events')}
                                >
                                    Back to Events
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
