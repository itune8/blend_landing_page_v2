"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft, MapPin, AlignLeft, Globe, ChevronDown,
    Ticket, Users, Lock, Video, Upload, X, Plus, Shuffle,
    Check
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { eventService } from "@/services"
import { Button } from "@/components/ui/button"

export function EventForm() {
    const [showAuthModal, setShowAuthModal] = useState(true)
    const { user, signIn, signInWithGoogle } = useAuth()
    const isAuthenticated = !!user
    const [authEmail, setAuthEmail] = useState("")

    useEffect(() => {
        if (isAuthenticated) setShowAuthModal(false)
    }, [isAuthenticated])

    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")
    const [showDescription, setShowDescription] = useState(false)
    const [locationType, setLocationType] = useState<"none" | "physical" | "virtual">("none")
    const [location, setLocation] = useState("")
    const [showLocationInput, setShowLocationInput] = useState(false)

    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

    const [startDate, setStartDate] = useState(formatDate(today))
    const [startDateObj, setStartDateObj] = useState(today)
    const [startTime, setStartTime] = useState("09:00 AM")
    const [endDate, setEndDate] = useState(formatDate(tomorrow))
    const [endDateObj, setEndDateObj] = useState(tomorrow)
    const [endTime, setEndTime] = useState("10:00 AM")

    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [showStartTimePicker, setShowStartTimePicker] = useState(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState(false)
    const [showVisibilityPicker, setShowVisibilityPicker] = useState(false)

    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [pickerDate, setPickerDate] = useState(new Date())

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    const prevMonth = () => setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1, 1))
    const nextMonth = () => setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 1))

    const [ticketPrice, setTicketPrice] = useState("Free")
    const [requireApproval, setRequireApproval] = useState(false)
    const [visibility, setVisibility] = useState("Public")
    const [maxCapacity, setMaxCapacity] = useState(50)
    const [isCapacityLimited, setIsCapacityLimited] = useState(false)
    const [showCapacityModal, setShowCapacityModal] = useState(false)
    const [coverImage, setCoverImage] = useState<string | null>(null)

    // Theme options - using solid colors instead of gradients
    const themes = [
        { name: "Sunset", color: "#ff6b6b" },
        { name: "Ocean", color: "#2196F3" },
        { name: "Forest", color: "#4CAF50" },
        { name: "Purple", color: "#9C27B0" },
        { name: "Night", color: "#1a1a1a" },
        { name: "Teal", color: "#1EBFAF" },
    ]

    const [selectedTheme, setSelectedTheme] = useState(themes[0])
    const [showThemeSelector, setShowThemeSelector] = useState(false)

    const handleAuth = async () => {
        await signIn(authEmail || "user@demo.com")
        setShowAuthModal(false)
    }

    const combineDateTime = (date: Date, timeStr: string) => {
        const d = new Date(date)
        const [time, period] = timeStr.split(' ')
        let [hours, minutes] = time.split(':').map(Number)
        if (period === 'PM' && hours !== 12) hours += 12
        if (period === 'AM' && hours === 12) hours = 0
        d.setHours(hours, minutes)
        return d.toISOString()
    }

    const handleCreateEvent = async () => {
        if (!eventName) {
            alert("Please add an event name")
            return
        }

        const { event, error } = await eventService.createEvent({
            title: eventName,
            description: eventDescription,
            start_date: combineDateTime(startDateObj, startTime),
            end_date: combineDateTime(endDateObj, endTime),
            location_type: locationType,
            location_url: locationType === 'physical' ? location : undefined,
            visibility: visibility.toLowerCase() as 'public' | 'private',
            status: 'published',
            price: ticketPrice,
            theme: { color: selectedTheme.color },
            capacity: isCapacityLimited ? maxCapacity : undefined
        })

        if (error) {
            alert("Error creating event: " + error)
        } else if (event) {
            router.push(`/event/${event.id}`)
        } else {
            router.push('/events')
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#111] text-white font-sans">
            {/* Top Navigation Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-[#111] border-b border-white/5 flex items-center justify-between px-6 z-40">
                <div className="flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-400" />
                    </Link>
                    <span className="text-sm font-medium text-gray-400">New Event</span>
                </div>
                <div className="flex items-center gap-4">
                    {isAuthenticated && (
                        <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-xs font-bold text-black">
                            {user?.name?.substring(0, 2).toUpperCase() || "JD"}
                        </div>
                    )}
                </div>
            </div>

            {/* Event Creation Form Content */}
            <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 justify-center">
                {/* Left Column: Preview Card */}
                <div className="w-full lg:w-[400px] flex flex-col gap-4">
                    <div
                        className="rounded-3xl aspect-square p-8 flex flex-col items-center justify-center relative overflow-hidden border border-white/5"
                        style={{ backgroundColor: coverImage ? undefined : selectedTheme.color }}
                    >
                        {coverImage && (
                            <img src={coverImage} alt="Event cover" className="absolute inset-0 w-full h-full object-cover" />
                        )}

                        <div className="absolute inset-4 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center text-center p-6">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {eventName || "Hello"}
                            </h2>
                            <p className="text-gray-500 font-medium">You're Invited</p>
                            <div className="mt-4 text-xs text-gray-400">
                                {startDate} • {startTime}
                            </div>
                        </div>

                        <label className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onload = (e) => setCoverImage(e.target?.result as string)
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                            <Upload className="w-5 h-5" />
                        </label>

                        {coverImage && (
                            <button
                                className="absolute bottom-4 left-4 p-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-full text-red-400 transition-colors"
                                onClick={() => setCoverImage(null)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Theme Selector - Solid colors */}
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-8 rounded-md" style={{ backgroundColor: selectedTheme.color }} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Theme</span>
                                <span className="text-sm font-medium">{selectedTheme.name}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                className="p-3 hover:bg-white/5 rounded-xl transition-colors"
                                onClick={() => setSelectedTheme(themes[Math.floor(Math.random() * themes.length)])}
                            >
                                <Shuffle className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                                className="p-3 hover:bg-white/5 rounded-xl transition-colors border-l border-white/5"
                                onClick={() => setShowThemeSelector(!showThemeSelector)}
                            >
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showThemeSelector ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showThemeSelector && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-3 grid grid-cols-3 gap-2">
                                    {themes.map((theme) => (
                                        <button
                                            key={theme.name}
                                            onClick={() => {
                                                setSelectedTheme(theme)
                                                setShowThemeSelector(false)
                                            }}
                                            className={`aspect-square rounded-lg hover:scale-105 transition-transform border relative group ${selectedTheme.name === theme.name ? 'border-white/50 ring-2 ring-white/30' : 'border-white/10 hover:border-white/30'}`}
                                            style={{ backgroundColor: theme.color }}
                                        >
                                            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-lg">
                                                {theme.name}
                                            </span>
                                            {selectedTheme.name === theme.name && (
                                                <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-black" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Column: Event Details Form */}
                <div className="w-full max-w-xl space-y-8">
                    {/* Event Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Event Name"
                            className="bg-transparent text-5xl font-bold text-white placeholder:text-gray-700 w-full focus:outline-none"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-visible divide-y divide-white/5 relative z-20">
                        {/* Start */}
                        <div className="flex items-center p-1 relative">
                            <div className="px-4 py-3 flex items-center gap-3 w-32 border-r border-white/5">
                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                <span className="text-sm font-medium text-gray-300">Start</span>
                            </div>
                            <div className="flex-1 relative">
                                <button
                                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                                    onClick={() => setShowStartDatePicker(!showStartDatePicker)}
                                >
                                    {startDate}
                                </button>
                                <AnimatePresence>
                                    {showStartDatePicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl p-4 w-72 z-50"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <button className="p-1 hover:bg-white/10 rounded" onClick={prevMonth}>
                                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                                </button>
                                                <span className="font-semibold text-sm">{pickerDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                                <button className="p-1 hover:bg-white/10 rounded" onClick={nextMonth}>
                                                    <ChevronDown className="w-4 h-4 -rotate-90" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500">
                                                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                                {Array.from({ length: getFirstDayOfMonth(pickerDate) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {Array.from({ length: getDaysInMonth(pickerDate) }, (_, i) => i + 1).map(d => (
                                                    <button
                                                        key={d}
                                                        className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-gray-300"
                                                        onClick={() => {
                                                            const newDate = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), d)
                                                            setStartDate(formatDate(newDate))
                                                            setStartDateObj(newDate)
                                                            setShowStartDatePicker(false)
                                                        }}
                                                    >
                                                        {d}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <div className="w-32 border-l border-white/5 relative">
                                <button
                                    className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                                    onClick={() => setShowStartTimePicker(!showStartTimePicker)}
                                >
                                    {startTime}
                                </button>
                                <AnimatePresence>
                                    {showStartTimePicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl w-48 max-h-64 overflow-y-auto z-50 py-2"
                                        >
                                            {Array.from({ length: 24 * 2 }, (_, i) => {
                                                const h = Math.floor(i / 2)
                                                const m = i % 2 === 0 ? "00" : "30"
                                                const ampm = h < 12 ? "AM" : "PM"
                                                const hour12 = h % 12 || 12
                                                const timeStr = `${hour12}:${m} ${ampm}`
                                                return (
                                                    <button
                                                        key={timeStr}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-teal-500/10 hover:text-teal-500 transition-colors"
                                                        onClick={() => {
                                                            setStartTime(timeStr)
                                                            setShowStartTimePicker(false)
                                                        }}
                                                    >
                                                        {timeStr}
                                                    </button>
                                                )
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* End */}
                        <div className="flex items-center p-1 relative">
                            <div className="px-4 py-3 flex items-center gap-3 w-32 border-r border-white/5">
                                <div className="w-2 h-2 rounded-full border border-gray-500" />
                                <span className="text-sm font-medium text-gray-300">End</span>
                            </div>
                            <div className="flex-1 relative">
                                <button
                                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                                    onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                                >
                                    {endDate}
                                </button>
                            </div>
                            <div className="w-32 border-l border-white/5">
                                <button
                                    className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                                    onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                                >
                                    {endTime}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Visibility */}
                    <div className="flex items-center justify-end text-xs text-gray-500 px-1 relative">
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20 cursor-pointer transition-all"
                                onClick={() => setShowVisibilityPicker(!showVisibilityPicker)}
                            >
                                <Globe className="w-3 h-3 text-gray-400" />
                                <span className="text-gray-300">{visibility}</span>
                                <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
                            </button>
                            <AnimatePresence>
                                {showVisibilityPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full right-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl w-32 z-50 overflow-hidden"
                                    >
                                        {["Public", "Private"].map(vis => (
                                            <button
                                                key={vis}
                                                className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                                                onClick={() => {
                                                    setVisibility(vis)
                                                    setShowVisibilityPicker(false)
                                                }}
                                            >
                                                {vis}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Location & Description */}
                    <div className="space-y-3">
                        {!showLocationInput && locationType === "none" ? (
                            <div
                                className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-4 hover:border-white/10 transition-colors cursor-pointer group"
                                onClick={() => setShowLocationInput(true)}
                            >
                                <div className="flex items-center gap-4">
                                    <MapPin className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-200">Add Event Location</span>
                                        <span className="text-xs text-gray-500">Offline location or virtual link</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-0 overflow-visible relative">
                                <div className="flex items-center justify-between p-4 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            autoFocus
                                            placeholder="Search for a place or paste a link..."
                                            className="bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none w-full"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                        onClick={() => {
                                            setShowLocationInput(false)
                                            setLocationType("none")
                                            setLocation("")
                                        }}
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>

                                <div className="p-2">
                                    <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-2 py-1">Virtual Options</div>
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left group"
                                        onClick={() => { setLocation("Virtual Meeting"); setLocationType("virtual"); setShowLocationInput(false); }}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                            <Video className="w-4 h-4 text-teal-500" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm text-gray-200 group-hover:text-white">Virtual Event</span>
                                            <span className="text-xs text-gray-500">Online meeting</span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {!showDescription ? (
                            <div
                                className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-4 flex items-center gap-4 hover:border-white/10 transition-colors cursor-pointer group"
                                onClick={() => setShowDescription(true)}
                            >
                                <AlignLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-400 transition-colors" />
                                <span className="text-sm font-medium text-gray-400 group-hover:text-gray-300">Add Description</span>
                            </div>
                        ) : (
                            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <AlignLeft className="w-5 h-5 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-200">Description</span>
                                    </div>
                                    <button
                                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                        onClick={() => {
                                            setShowDescription(false)
                                            setEventDescription("")
                                        }}
                                    >
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                                <textarea
                                    placeholder="Tell people about your event..."
                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 text-sm min-h-[120px] resize-y"
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Event Options */}
                    <div className="pt-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Event Options</h3>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            {/* Ticket Price */}
                            <div className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Ticket className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-300">Ticket Price</span>
                                </div>
                                <span className={`text-sm font-medium ${ticketPrice === 'Free' ? 'text-green-400' : 'text-teal-400'}`}>{ticketPrice}</span>
                            </div>

                            {/* Require Approval */}
                            <div
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => setRequireApproval(!requireApproval)}
                            >
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-300">Require Approval</span>
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors ${requireApproval ? 'bg-teal-500' : 'bg-gray-700'}`}>
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${requireApproval ? 'left-6' : 'left-1'}`} />
                                </div>
                            </div>

                            {/* Capacity */}
                            <div
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer"
                                onClick={() => setShowCapacityModal(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-300">Capacity</span>
                                </div>
                                <span className="text-sm text-gray-400">
                                    {isCapacityLimited ? maxCapacity : "Unlimited"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Create Button */}
                    <div className="pt-4 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="h-12 px-6 bg-[#1a1a1a] hover:bg-white/5 text-gray-400 font-medium text-base rounded-xl border border-white/5 hover:text-white transition-colors"
                        >
                            Save Draft
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-white text-black hover:bg-gray-200 font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-colors"
                            onClick={handleCreateEvent}
                        >
                            <Check className="w-5 h-5" />
                            Create Event
                        </Button>
                    </div>

                    <div className="h-10" />
                </div>
            </div>

            {/* Capacity Modal */}
            <AnimatePresence>
                {showCapacityModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCapacityModal(false)}
                        />
                        <motion.div
                            className="relative w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <h3 className="text-xl font-bold text-white mb-4">Max Capacity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-300">Limit Event Capacity</span>
                                    <div
                                        className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${isCapacityLimited ? 'bg-teal-500' : 'bg-gray-700'}`}
                                        onClick={() => setIsCapacityLimited(!isCapacityLimited)}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isCapacityLimited ? 'left-6' : 'left-1'}`} />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-medium ${isCapacityLimited ? 'text-gray-300' : 'text-gray-600'}`}>Max Capacity</span>
                                    <input
                                        type="number"
                                        value={maxCapacity}
                                        onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
                                        disabled={!isCapacityLimited}
                                        className="w-20 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-right text-white disabled:text-gray-600 focus:outline-none"
                                    />
                                </div>

                                <Button
                                    className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-xl mt-4"
                                    onClick={() => setShowCapacityModal(false)}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Auth Modal */}
            <AnimatePresence>
                {showAuthModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />
                        <motion.div
                            className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-[28px] overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Blend</h2>
                                <p className="text-gray-400 text-sm mb-8">Please sign in to create an event.</p>

                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-gray-400">Email</label>
                                        <input
                                            type="email"
                                            placeholder="you@email.com"
                                            className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20"
                                            value={authEmail}
                                            onChange={(e) => setAuthEmail(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        className="w-full h-11 bg-white text-black hover:bg-gray-200 rounded-xl font-bold text-sm"
                                        onClick={handleAuth}
                                    >
                                        Continue with Email
                                    </Button>

                                    <div className="flex flex-col gap-2 pt-2">
                                        <button
                                            className="flex items-center justify-center gap-3 h-11 bg-[#222] hover:bg-[#2a2a2a] rounded-xl transition-all border border-white/5"
                                            onClick={async () => {
                                                const { error } = await signInWithGoogle()
                                                if (!error) setShowAuthModal(false)
                                            }}
                                        >
                                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
                                                <path d="M12 4.66c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.14 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            <span className="text-sm font-medium text-white/80">Sign in with Google</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
