
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowLeft, MapPin, AlignLeft,
    Globe, ChevronDown,
    Ticket, Users, Lock, Video, Upload, X, Plus, Shuffle,
    UserPlus, Bell, List, Settings, Link as LinkIcon,
    Check
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function EventForm() {
    // State for the Auth Modal - Set to true for mandatory sign-in
    const [showAuthModal, setShowAuthModal] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // State for the Event Form
    const [eventName, setEventName] = useState("")
    const [eventDescription, setEventDescription] = useState("")
    const [showDescription, setShowDescription] = useState(false)
    const [locationType, setLocationType] = useState<"none" | "physical" | "virtual">("none")
    const [location, setLocation] = useState("")
    const [showLocationInput, setShowLocationInput] = useState(false)

    // Date/Time States
    const [startDate, setStartDate] = useState("Sun, 14 Dec")
    const [startTime, setStartTime] = useState("03:00 AM")
    const [endDate, setEndDate] = useState("Sun, 14 Dec")
    const [endTime, setEndTime] = useState("04:00 AM")
    const [timezone, setTimezone] = useState("GMT+05:30 Calcutta")

    // UI Toggles for Pickers
    const [showStartDatePicker, setShowStartDatePicker] = useState(false)
    const [showStartTimePicker, setShowStartTimePicker] = useState(false)
    const [showEndDatePicker, setShowEndDatePicker] = useState(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState(false)
    const [showTimezonePicker, setShowTimezonePicker] = useState(false)
    const [showCalendarPicker, setShowCalendarPicker] = useState(false)
    // Navigation Tab State
    const [showVisibilityPicker, setShowVisibilityPicker] = useState(false)


    // Navigation
    const routerLocation = useLocation()
    const navigate = useNavigate()


    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])


    // Calendar Picker State
    const [pickerDate, setPickerDate] = useState(new Date())

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    }

    const prevMonth = () => {
        setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() - 1, 1))
    }

    const nextMonth = () => {
        setPickerDate(new Date(pickerDate.getFullYear(), pickerDate.getMonth() + 1, 1))
    }
    const [ticketPrice, setTicketPrice] = useState("Free")
    const [requireApproval, setRequireApproval] = useState(false)

    const [visibility, setVisibility] = useState("Public")
    const [calendar, setCalendar] = useState("Personal Calendar")

    // Capacity Modal State
    const [showCapacityModal, setShowCapacityModal] = useState(false)
    const [maxCapacity, setMaxCapacity] = useState(50)
    const [isCapacityLimited, setIsCapacityLimited] = useState(false)
    const [waitlistOverCapacity, setWaitlistOverCapacity] = useState(false)

    // Timezone Data
    const timezones = [
        "GMT-11:00 Niue Time", "GMT-11:00 American Samoa",
        "GMT-10:00 Hawaii-Aleutian", "GMT-10:00 Tahiti Time",
        "GMT-09:00 Alaska Standard", "GMT-08:00 Pacific Time",
        "GMT-07:00 Mountain Time", "GMT-06:00 Central Time",
        "GMT-05:00 Eastern Time", "GMT-04:00 Atlantic Time",
        "GMT-03:00 Brasilia Time", "GMT-01:00 Azores Time",
        "GMT+00:00 London", "GMT+00:00 UTC",
        "GMT+01:00 Central European", "GMT+01:00 West Africa",
        "GMT+02:00 Eastern European", "GMT+03:00 Moscow Standard",
        "GMT+03:30 Tehran Time", "GMT+04:00 Dubai Standard",
        "GMT+05:30 Calcutta", "GMT+07:00 Indochina Time",
        "GMT+08:00 Singapore", "GMT+08:00 China Standard",
        "GMT+09:00 Japan Standard", "GMT+10:00 Australian Eastern",
        "GMT+12:00 New Zealand"
    ]

    // Advanced Options
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [allowWaitlist, setAllowWaitlist] = useState(false)
    const [sendReminders, setSendReminders] = useState(true)

    // Image Upload and Theme
    const [coverImage, setCoverImage] = useState<string | null>(null)
    const [showThemeSelector, setShowThemeSelector] = useState(false)
    const [selectedTheme, setSelectedTheme] = useState({
        name: "Sunset",
        gradient: "from-[#ff4d4d] to-[#f9cb28]"
    })

    // Theme options
    const themes = [
        { name: "Sunset", gradient: "from-[#ff4d4d] to-[#f9cb28]" },
        { name: "Ocean", gradient: "from-[#2196F3] to-[#00BCD4]" },
        { name: "Forest", gradient: "from-[#4CAF50] to-[#8BC34A]" },
        { name: "Purple", gradient: "from-[#9C27B0] to-[#E91E63]" },
        { name: "Night", gradient: "from-[#1a1a1a] to-[#3a3a3a]" },
        { name: "Dawn", gradient: "from-[#FF6B6B] to-[#FFE66D]" },
    ]

    // Co-hosts State
    const [cohosts, setCohosts] = useState<string[]>([])
    const [cohostInput, setCohostInput] = useState("")
    const [showCohostInput, setShowCohostInput] = useState(false)

    // Registration Questions State
    type QuestionType = "text" | "number" | "select"
    interface RegistrationQuestion {
        id: string
        type: QuestionType
        label: string
        required: boolean
        options?: string[] // for select type
    }
    const [questions, setQuestions] = useState<RegistrationQuestion[]>([])
    const [showQuestionModal, setShowQuestionModal] = useState(false)
    const [newQuestionLabel, setNewQuestionLabel] = useState("")
    const [newQuestionType, setNewQuestionType] = useState<QuestionType>("text")
    const [newQuestionRequired, setNewQuestionRequired] = useState(false)

    // Handle authentication
    const handleAuth = () => {
        setIsAuthenticated(true)
        setShowAuthModal(false)
    }

    const addCohost = () => {
        if (cohostInput && !cohosts.includes(cohostInput)) {
            setCohosts([...cohosts, cohostInput])
            setCohostInput("")
        }
    }

    const removeCohost = (email: string) => {
        setCohosts(cohosts.filter(c => c !== email))
    }

    const addQuestion = () => {
        if (newQuestionLabel) {
            setQuestions([
                ...questions,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    type: newQuestionType,
                    label: newQuestionLabel,
                    required: newQuestionRequired
                }
            ])
            setNewQuestionLabel("")
            setNewQuestionType("text")
            setNewQuestionRequired(false)
            setShowQuestionModal(false)
        }
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
                            onClick={() => navigate('/create-event')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${routerLocation.pathname.includes('/events') || routerLocation.pathname === '/' ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                        >
                            Events
                        </button>
                        <button
                            onClick={() => navigate('/calendars')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${routerLocation.pathname.includes('/calendars') ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                        >
                            Calendars
                        </button>
                        <button
                            onClick={() => navigate('/discover')}
                            className={`px-3 py-1.5 rounded-lg transition-colors ${routerLocation.pathname.includes('/discover') ? 'text-white' : 'hover:text-white hover:bg-white/5'}`}
                        >
                            Discover
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-gray-500">2:52 am IST</div>
                    {isAuthenticated ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-xs font-bold text-black cursor-pointer ring-2 ring-white/10 hover:ring-white/20 transition-all">
                            JD
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

            {/* Event Creation Form Content */}
            <div className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 justify-center">

                {/* Left Column: Preview Card */}
                <div className="w-full lg:w-[400px] flex flex-col gap-4">
                    <div className="bg-[#1a1a1a] rounded-3xl aspect-square p-8 flex flex-col items-center justify-center relative overflow-hidden group border border-white/5">
                        {/* Cover Image or Gradient */}
                        {coverImage ? (
                            <img
                                src={coverImage}
                                alt="Event cover"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className={`absolute inset - 0 bg - gradient - to - br ${selectedTheme.gradient} opacity - 100 transition - opacity`} />
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

                        {/* Upload/Change Image Button */}
                        <label className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const reader = new FileReader()
                                        reader.onload = (e) => {
                                            setCoverImage(e.target?.result as string)
                                        }
                                        reader.readAsDataURL(file)
                                    }
                                }}
                            />
                            <Upload className="w-5 h-5" />
                        </label>

                        {/* Remove Image Button */}
                        {coverImage && (
                            <button
                                className="absolute bottom-4 left-4 p-3 bg-red-500/20 hover:bg-red-500/30 backdrop-blur-md rounded-full text-red-400 transition-colors"
                                onClick={() => setCoverImage(null)}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Theme Selector */}
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-2 flex items-center justify-between">
                        <div className="flex items-center gap-3 px-2">
                            <div className={`w - 10 h - 8 bg - gradient - to - br ${selectedTheme.gradient} rounded - md`} />
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Theme</span>
                                <span className="text-sm font-medium">{selectedTheme.name}</span>
                            </div>
                        </div>
                        <div className="flex">
                            <button
                                className="p-3 hover:bg-white/5 rounded-xl transition-colors"
                                onClick={() => {
                                    const randomTheme = themes[Math.floor(Math.random() * themes.length)]
                                    setSelectedTheme(randomTheme)
                                }}
                                title="Shuffle Theme"
                            >
                                <Shuffle className="w-4 h-4 text-gray-400" />
                            </button>
                            <button
                                className="p-3 hover:bg-white/5 rounded-xl transition-colors border-l border-white/5"
                                onClick={() => setShowThemeSelector(!showThemeSelector)}
                            >
                                <ChevronDown className={`w - 4 h - 4 text - gray - 400 transition - transform ${showThemeSelector ? 'rotate-180' : ''} `} />
                            </button>
                        </div>
                    </div>

                    {/* Theme Options */}
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
                                            className={`aspect - square rounded - lg bg - gradient - to - br ${theme.gradient} hover: scale - 105 transition - transform border relative group ${selectedTheme.name === theme.name
                                                ? 'border-white/50 ring-2 ring-white/30'
                                                : 'border-white/10 hover:border-white/30'
                                                } `}
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
                    {/* Event Name Input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Event Name"
                            className="bg-transparent text-5xl font-bold text-white placeholder:text-gray-700 w-full focus:outline-none"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                        />
                    </div>

                    {/* Date & Time Section */}
                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-visible divide-y divide-white/5 relative z-20">
                        <div className="flex items-center p-1 relative">
                            <div className="px-4 py-3 flex items-center gap-3 w-32 border-r border-white/5">
                                <div className="w-2 h-2 rounded-full bg-gray-500" />
                                <span className="text-sm font-medium text-gray-300">Start</span>
                            </div>

                            {/* Start Date Picker */}
                            <div className="flex-1 relative group">
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
                                                <button className="p-1 hover:bg-white/10 rounded"><ChevronDown className="w-4 h-4 rotate-90" /></button>
                                                <span className="font-semibold text-sm">December 2024</span>
                                                <button className="p-1 hover:bg-white/10 rounded"><ChevronDown className="w-4 h-4 -rotate-90" /></button>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-500">
                                                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                                                    <button
                                                        key={d}
                                                        className={`w - 8 h - 8 rounded - full hover: bg - white / 10 flex items - center justify - center transition - colors ${d === 14 ? 'bg-teal-500 text-black font-bold hover:bg-teal-400' : 'text-gray-300'} `}
                                                        onClick={() => {
                                                            setStartDate(`Sun, ${d} Dec`)
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

                            {/* Start Time Picker */}
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
                                            className="absolute top-full right-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl w-48 max-h-64 overflow-y-auto z-50 py-2 scrollbar-hide"
                                        >
                                            {Array.from({ length: 24 * 2 }, (_, i) => {
                                                const h = Math.floor(i / 2)
                                                const m = i % 2 === 0 ? "00" : "30"
                                                const ampm = h < 12 ? "AM" : "PM"
                                                const hour12 = h % 12 || 12
                                                const timeStr = `${hour12}:${m} ${ampm} `
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

                        <div className="flex items-center p-1 relative">
                            <div className="px-4 py-3 flex items-center gap-3 w-32 border-r border-white/5">
                                <div className="w-2 h-2 rounded-full border border-gray-500" />
                                <span className="text-sm font-medium text-gray-300">End</span>
                            </div>

                            {/* End Date Picker */}
                            <div className="flex-1 relative group">
                                <button
                                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                                    onClick={() => setShowEndDatePicker(!showEndDatePicker)}
                                >
                                    {endDate}
                                </button>
                                <AnimatePresence>
                                    {showEndDatePicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl p-4 w-72 z-50"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <button
                                                    className="p-1 hover:bg-white/10 rounded"
                                                    onClick={prevMonth}
                                                >
                                                    <ChevronDown className="w-4 h-4 rotate-90" />
                                                </button>
                                                <span className="font-semibold text-sm">
                                                    {pickerDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button
                                                    className="p-1 hover:bg-white/10 rounded"
                                                    onClick={nextMonth}
                                                >
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
                                                        className={`w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors ${endDate.includes(`${d} ${pickerDate.toLocaleString('default', { month: 'short' })}`)
                                                            ? 'bg-teal-500 text-black font-bold'
                                                            : 'text-gray-300'
                                                            }`}
                                                        onClick={() => {
                                                            const newDate = new Date(pickerDate.getFullYear(), pickerDate.getMonth(), d)
                                                            const dayName = newDate.toLocaleString('default', { weekday: 'short' })
                                                            const monthName = newDate.toLocaleString('default', { month: 'short' })
                                                            setEndDate(`${dayName}, ${d} ${monthName}`)
                                                            setShowEndDatePicker(false)
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

                            {/* End Time Picker */}
                            <div className="w-32 border-l border-white/5 relative">
                                <button
                                    className="w-full text-right px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
                                    onClick={() => setShowEndTimePicker(!showEndTimePicker)}
                                >
                                    {endTime}
                                </button>
                                <AnimatePresence>
                                    {showEndTimePicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl w-48 max-h-64 overflow-y-auto z-50 py-2 scrollbar-hide"
                                        >
                                            {Array.from({ length: 24 * 2 }, (_, i) => {
                                                const h = Math.floor(i / 2)
                                                const m = i % 2 === 0 ? "00" : "30"
                                                const ampm = h < 12 ? "AM" : "PM"
                                                const hour12 = h % 12 || 12
                                                const timeStr = `${hour12}:${m} ${ampm} `
                                                return (
                                                    <button
                                                        key={timeStr}
                                                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-teal-500/10 hover:text-teal-500 transition-colors"
                                                        onClick={() => {
                                                            setEndTime(timeStr)
                                                            setShowEndTimePicker(false)
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
                    </div>

                    {/* Meta Info (Timezone/Visibility) */}
                    <div className="flex items-center justify-between text-xs text-gray-500 px-1 relative z-10">
                        <div className="relative">
                            <button
                                className="flex items-center gap-2 hover:text-gray-300 cursor-pointer transition-colors"
                                onClick={() => setShowTimezonePicker(!showTimezonePicker)}
                            >
                                <Globe className="w-3 h-3" />
                                <span>{timezone}</span>
                            </button>
                            <AnimatePresence>
                                {showTimezonePicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl w-64 max-h-80 overflow-hidden z-50 flex flex-col"
                                    >
                                        <div className="p-2 border-b border-white/5">
                                            <input
                                                type="text"
                                                placeholder="Search timezone..."
                                                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none"
                                            />
                                        </div>
                                        <div className="overflow-y-auto flex-1 p-1 scrollbar-hide">
                                            {timezones.map(tz => (
                                                <button
                                                    key={tz}
                                                    className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                                                    onClick={() => {
                                                        setTimezone(tz)
                                                        setShowTimezonePicker(false)
                                                    }}
                                                >
                                                    {tz}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Calendar Picker */}
                            <div className="relative">
                                <button
                                    className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1.5 rounded-full border border-white/5 hover:border-white/20 cursor-pointer transition-all"
                                    onClick={() => setShowCalendarPicker(!showCalendarPicker)}
                                >
                                    <div className="w-2 h-2 rounded-full bg-pink-500" />
                                    <span className="text-gray-300">{calendar}</span>
                                    <ChevronDown className="w-3 h-3 text-gray-500 ml-1" />
                                </button>
                                <AnimatePresence>
                                    {showCalendarPicker && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full right-0 mt-2 bg-[#222] border border-white/10 rounded-xl shadow-2xl w-48 z-50 overflow-hidden"
                                        >
                                            {["Personal Calendar", "Work Calendar", "Social Calendar"].map(cal => (
                                                <button
                                                    key={cal}
                                                    className="w-full text-left px-4 py-2.5 text-xs text-gray-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
                                                    onClick={() => {
                                                        setCalendar(cal)
                                                        setShowCalendarPicker(false)
                                                    }}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${cal === 'Personal Calendar' ? 'bg-pink-500' : cal === 'Work Calendar' ? 'bg-blue-500' : 'bg-green-500'}`} />
                                                    {cal}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Visibility Picker */}
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
                    </div>

                    {/* Location & Description */}
                    <div className="space-y-3 relative z-0">
                        {/* Location Section */}
                        <div className="relative">
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

                                    {/* Location Suggestions Dropdown */}
                                    <div className="p-2">
                                        <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-2 py-1">Virtual Options</div>
                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left group"
                                            onClick={() => { setLocation("Zoom Meeting Link Generated"); setLocationType("virtual"); setShowLocationInput(false); }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#2D8CFF]/20 flex items-center justify-center">
                                                <Video className="w-4 h-4 text-[#2D8CFF]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-200 group-hover:text-white">Create Zoom meeting</span>
                                                <span className="text-xs text-gray-500">Connect your Zoom account</span>
                                            </div>
                                        </button>
                                        <button
                                            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/5 rounded-lg transition-colors text-left group"
                                            onClick={() => { setLocation("Google Meet Link Generated"); setLocationType("virtual"); setShowLocationInput(false); }}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-[#00AC47]/20 flex items-center justify-center">
                                                <Video className="w-4 h-4 text-[#00AC47]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-200 group-hover:text-white">Create Google Meet</span>
                                                <span className="text-xs text-gray-500">Connect your Google account</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
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
                                    placeholder="Tell people about your event. What activities will be happening? What should they bring?"
                                    className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20 text-sm min-h-[120px] resize-y"
                                    value={eventDescription}
                                    onChange={(e) => setEventDescription(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-gray-300 transition-all"
                                        onClick={() => setEventDescription(prev => prev + "**bold text**")}
                                    >
                                        <strong className="text-white">B</strong>old
                                    </button>
                                    <button
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-gray-300 transition-all"
                                        onClick={() => setEventDescription(prev => prev + "*italic text*")}
                                    >
                                        <em className="text-white">I</em>talic
                                    </button>
                                    <button
                                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-400 hover:text-gray-300 transition-all"
                                        onClick={() => setEventDescription(prev => prev + "[link text](url)")}
                                    >
                                        <LinkIcon className="w-3 h-3 inline" /> Link
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Event Options */}
                    <div className="pt-4">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Event Options</h3>
                        <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5">
                            <div
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                onClick={() => {
                                    const price = prompt("Enter ticket price (or type 'Free', 'Payment Optional'):", ticketPrice)
                                    if (price !== null) setTicketPrice(price)
                                }}
                            >
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <Ticket className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                        <span className="text-sm font-medium text-gray-300">Ticket Price</span>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-7">Free, Paid, or Flexible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">{ticketPrice}</span>
                                    <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                onClick={() => setRequireApproval(!requireApproval)}
                            >
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-300">Require Approval</span>
                                </div>
                                <div className={`w - 10 h - 5 rounded - full relative transition - colors ${requireApproval ? 'bg-teal-500' : 'bg-gray-700'} `}>
                                    <div className={`absolute top - 1 w - 3 h - 3 bg - white rounded - full transition - all ${requireApproval ? 'left-6' : 'left-1'} `} />
                                </div>
                            </div>
                            <div
                                className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                onClick={() => setShowCapacityModal(true)}
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                    <span className="text-sm font-medium text-gray-300">Capacity</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">
                                        {isCapacityLimited ? maxCapacity : "Unlimited"}
                                    </span>
                                    <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Advanced Options */}
                    <div className="pt-4">
                        <button
                            className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 hover:text-gray-400 transition-colors flex items-center gap-2"
                            onClick={() => setShowAdvanced(!showAdvanced)}
                        >
                            <ChevronDown className={`w - 3 h - 3 transition - transform ${showAdvanced ? 'rotate-180' : ''} `} />
                            Advanced Options
                        </button>

                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl overflow-hidden divide-y divide-white/5 mb-4">
                                        <div className="flex flex-col px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group">
                                            <div
                                                className="flex items-center justify-between"
                                                onClick={() => setShowCohostInput(!showCohostInput)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <UserPlus className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-300">Co-hosts</span>
                                                        <span className="text-xs text-gray-500">Add people to help manage</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {cohosts.length > 0 && <span className="text-xs text-teal-500">{cohosts.length} added</span>}
                                                    <Plus className={`w - 4 h - 4 text - gray - 500 transition - transform ${showCohostInput ? 'rotate-45' : ''} `} />
                                                </div>
                                            </div>

                                            {/* Co-host Input Area */}
                                            <AnimatePresence>
                                                {showCohostInput && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                                                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Enter email address"
                                                                className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-white/20"
                                                                value={cohostInput}
                                                                onChange={(e) => setCohostInput(e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && addCohost()}
                                                            />
                                                            <button
                                                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-white transition-colors"
                                                                onClick={addCohost}
                                                            >
                                                                Add
                                                            </button>
                                                        </div>
                                                        {cohosts.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {cohosts.map(email => (
                                                                    <div key={email} className="flex items-center gap-1 bg-[#222] border border-white/10 px-2 py-1 rounded-md">
                                                                        <span className="text-xs text-gray-300">{email}</span>
                                                                        <button
                                                                            onClick={() => removeCohost(email)}
                                                                            className="text-gray-500 hover:text-red-400"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div
                                            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                            onClick={() => setAllowWaitlist(!allowWaitlist)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <List className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                                <span className="text-sm font-medium text-gray-300">Enable Waitlist</span>
                                            </div>
                                            <div className={`w - 10 h - 5 rounded - full relative transition - colors ${allowWaitlist ? 'bg-teal-500' : 'bg-gray-700'} `}>
                                                <div className={`absolute top - 1 w - 3 h - 3 bg - white rounded - full transition - all ${allowWaitlist ? 'left-6' : 'left-1'} `} />
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                            onClick={() => setSendReminders(!sendReminders)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Bell className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-300">Email Reminders</span>
                                                    <span className="text-xs text-gray-500">Send automatic reminders</span>
                                                </div>
                                            </div>
                                            <div className={`w - 10 h - 5 rounded - full relative transition - colors ${sendReminders ? 'bg-teal-500' : 'bg-gray-700'} `}>
                                                <div className={`absolute top - 1 w - 3 h - 3 bg - white rounded - full transition - all ${sendReminders ? 'left-6' : 'left-1'} `} />
                                            </div>
                                        </div>

                                        <div
                                            className="flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors cursor-pointer group"
                                            onClick={() => setShowQuestionModal(true)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-400" />
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-300">Custom Registration Form</span>
                                                    <span className="text-xs text-gray-500">Collect info from guests</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {questions.length > 0 && <span className="text-xs text-teal-500">{questions.length} questions</span>}
                                                <Plus className="w-4 h-4 text-gray-500" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Create Button & Draft (Moved here) */}
                    <div className="pt-4 flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="h-12 px-6 bg-[#1a1a1a] hover:bg-white/5 text-gray-400 font-medium text-base rounded-xl border border-white/5 hover:text-white transition-colors"
                        >
                            Save Draft
                        </Button>
                        <Button
                            className="flex-1 h-12 bg-white text-black hover:bg-gray-200 font-bold text-base rounded-xl flex items-center justify-center gap-2 transition-colors"
                            onClick={() => {
                                // Validation
                                if (!eventName) {
                                    alert("Please add an event name")
                                    return
                                }
                                alert("Event created successfully! 🎉")
                            }}
                        >
                            <Check className="w-5 h-5" />
                            Create Event
                        </Button>
                    </div>

                    {/* Spacer */}
                    <div className="h-10" />
                </div>
            </div>


            {/* =====================================================================================
                REGISTRATION QUESTIONS MODAL
               ===================================================================================== */}
            <AnimatePresence>
                {showQuestionModal && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center">
                        <motion.div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowQuestionModal(false)}
                        />
                        <motion.div
                            className="relative w-full max-w-lg bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Registration Questions</h3>
                                <button onClick={() => setShowQuestionModal(false)} className="p-1 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto">
                                {questions.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 border border-dashed border-white/10 rounded-xl">
                                        No custom questions added yet.
                                    </div>
                                ) : (
                                    questions.map((q, idx) => (
                                        <div key={q.id} className="flex items-center justify-between bg-[#111] border border-white/10 p-3 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-mono text-gray-500">{idx + 1}</span>
                                                <div>
                                                    <p className="text-sm text-gray-200 font-medium">{q.label}</p>
                                                    <p className="text-[10px] text-gray-500 capitalize">{q.type} • {q.required ? 'Required' : 'Optional'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setQuestions(questions.filter(item => item.id !== q.id))}
                                                className="p-2 hover:text-red-400 text-gray-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="bg-[#222] p-4 rounded-xl border border-white/5 space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add New Question</h4>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Question Label</label>
                                        <input
                                            type="text"
                                            className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                            placeholder="e.g. What is your job title?"
                                            value={newQuestionLabel}
                                            onChange={(e) => setNewQuestionLabel(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 block mb-1">Type</label>
                                            <select
                                                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
                                                value={newQuestionType}
                                                onChange={(e) => setNewQuestionType(e.target.value as QuestionType)}
                                            >
                                                <option value="text">Short Text</option>
                                                <option value="number">Number</option>
                                                <option value="select">Dropdown</option>
                                            </select>
                                        </div>
                                        <div className="flex items-end pb-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={newQuestionRequired}
                                                    onChange={(e) => setNewQuestionRequired(e.target.checked)}
                                                    className="accent-teal-500"
                                                />
                                                <span className="text-sm text-gray-300">Required</span>
                                            </label>
                                        </div>
                                    </div>
                                    <Button
                                        className="w-full bg-white text-black hover:bg-gray-200 mt-2"
                                        onClick={addQuestion}
                                        disabled={!newQuestionLabel}
                                    >
                                        Add Question
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


            {/* =====================================================================================
                CAPACITY POPUP MODAL
               ===================================================================================== */}
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
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                    <svg className="w-5 h-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white">Max Capacity</h3>
                            </div>
                            <p className="text-gray-500 text-xs mb-6 pl-[52px]">
                                Close registration when reaching the capacity. Only approved guests count towards it.
                            </p>

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
                                        className="w-20 bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-right text-white disabled:text-gray-600 focus:outline-none focus:border-white/20"
                                    />
                                </div>

                                <div className="h-px bg-white/5 my-4" />

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-300">Over-Capacity Waiting List</span>
                                    <div
                                        className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${waitlistOverCapacity ? 'bg-teal-500' : 'bg-gray-700'}`}
                                        onClick={() => setWaitlistOverCapacity(!waitlistOverCapacity)}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${waitlistOverCapacity ? 'left-6' : 'left-1'}`} />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        className="w-full bg-white text-black hover:bg-gray-200 font-bold rounded-xl"
                                        onClick={() => setShowCapacityModal(false)}
                                    >
                                        Confirm
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>


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
                                            onClick={handleAuth}
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
