import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

// Sample event data
const events = [
    {
        id: 1,
        name: "Yoga Flow at Sunset",
        date: "Tomorrow, 6:30 PM",
        location: "Raouché Beach",
        attendees: ["https://i.pravatar.cc/100?img=1", "https://i.pravatar.cc/100?img=5", "https://i.pravatar.cc/100?img=8"],
        image: "linear-gradient(135deg, #1EBFAF 0%, #22d3ee 100%)"
    },
    {
        id: 2,
        name: "Tech Meetup Beirut",
        date: "Fri Dec 15, 7:00 PM",
        location: "Beirut Digital District",
        attendees: ["https://i.pravatar.cc/100?img=3", "https://i.pravatar.cc/100?img=4"],
        image: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
    },
    {
        id: 3,
        name: "Art & Wine Night",
        date: "Sat Dec 16, 8:00 PM",
        location: "Mar Mikhael Gallery",
        attendees: ["https://i.pravatar.cc/100?img=9", "https://i.pravatar.cc/100?img=10", "https://i.pravatar.cc/100?img=11"],
        image: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
    },
]

// Avatar pile component
const AvatarPile = ({ images }: { images: string[] }) => (
    <div className="flex -space-x-2">
        {images.map((img, i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-[#1a1f2e] bg-gray-700 overflow-hidden">
                <img src={img} alt="User" className="w-full h-full object-cover" />
            </div>
        ))}
        <div className="w-5 h-5 rounded-full border-2 border-[#1a1f2e] bg-gray-800 flex items-center justify-center text-[8px] text-gray-400 font-medium">
            +
        </div>
    </div>
)

// Background element with Blend branding
const BackgroundCircle = () => (
    <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full -z-20 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
    >
        {/* Standard Gradient Ring - Static to save GPU on mobile */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#1EBFAF] via-[#22d3ee] to-[#10b981] opacity-20 blur-xl" />

        {/* Main Circle - Image Background */}
        <div className="relative w-[480px] h-[480px] rounded-full border border-white/5 shadow-xl overflow-hidden flex items-center justify-center bg-black">
            <img
                src="/blend_circle_bg.png"
                alt="Background"
                className="w-full h-full object-cover opacity-90 transition-transform duration-100 will-change-transform"
                style={{ transform: "scale(1.1) translate(28px, 40px) rotate(2deg)" }}
            />
            {/* Overlay to ensure phone pop */}
            <div className="absolute inset-0 bg-black/20" />
        </div >
    </motion.div>
)

export function PhoneMockup() {
    const [showVideo, setShowVideo] = useState(false)

    useEffect(() => {
        // Start showing video after delay
        const timer = setTimeout(() => {
            setShowVideo(true)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="relative w-full h-[800px] flex items-center justify-center overflow-visible" style={{ perspective: "1637px" }}>

            <BackgroundCircle />

            <motion.div
                className="relative w-[300px] h-[600px] will-change-transform"
                initial={{ opacity: 0, rotateZ: 14, rotateY: -22, rotateX: 14, x: 0, y: 0 }}
                animate={{
                    opacity: 1,
                    rotateZ: 14,
                    rotateY: -22,
                    rotateX: 14,
                    x: 0,
                    y: 0
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Phone Container - Floating Animation */}
                <motion.div
                    className="w-full h-full bg-[#0f1115] rounded-[3rem] border-[8px] border-[#2a2f3a] overflow-hidden relative"
                    animate={{
                        y: [-10, 10, -10], // Reduced movement range for smoother feel
                        rotateZ: [-0.5, 0.5, -0.5], // Reduced rotation
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        // Optimized shadow: Reduced blur from 80px to 40px, opacity from 0.4 to 0.3
                        boxShadow: "20px 20px 50px rgba(0,0,0,0.3)",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        willChange: "transform"
                    }}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-b-[16px] z-50 flex justify-center items-center">
                        <div className="w-14 h-3.5 bg-black rounded-full" />
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-3.5 left-7 text-[10px] font-semibold text-white z-40">9:41</div>

                    {/* Content Container */}
                    <div className="w-full h-full bg-[#111318] relative overflow-hidden rounded-[2.5rem]">

                        {/* Video Layer - Always rendered to prevent loading lag */}
                        <div className="absolute inset-0 w-full h-full z-0">
                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                            >
                                <source src="/Blend_App_Hero_Edit.mp4" type="video/mp4" />
                            </video>
                        </div>

                        {/* Static UI Layer - AnimatePresence ensures proper enter/exit transitions */}
                        <AnimatePresence>
                            {!showVideo && (
                                <motion.div
                                    key="static-ui"
                                    className="absolute inset-0 w-full h-full text-white pt-12 px-5 pb-8 flex flex-col bg-[#111318] z-10"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-5">
                                        <div className="flex items-center gap-2">
                                            <svg viewBox="0 0 40 40" className="w-6 h-6 text-teal-400" fill="none">
                                                <circle cx="12" cy="20" r="7" stroke="currentColor" strokeWidth="3.5" />
                                                <path d="M12 13 L12 7 Q12 2 17 2 Q22 2 22 7 Q22 13 17 13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                            </svg>
                                            <span className="font-bold text-lg tracking-tight">blend</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="mb-5">
                                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Explore Events</h2>
                                        <p className="text-teal-500/80 text-xs font-medium mt-1">Happening Near You</p>
                                    </div>

                                    {/* Event List */}
                                    <div className="space-y-3 overflow-y-auto no-scrollbar flex-1">
                                        {events.map((event, i) => (
                                            <motion.div
                                                key={event.id}
                                                className="group relative bg-[#1a1d24] rounded-xl p-3 border border-gray-800 hover:border-teal-500/30 transition-colors"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0 w-12 h-14 bg-gray-800 rounded-lg flex flex-col items-center justify-center border border-gray-700">
                                                        <span className="text-[9px] uppercase font-bold text-gray-400">DEC</span>
                                                        <span className="text-lg font-bold text-white">1{5 + i}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0 py-0.5">
                                                        <h3 className="font-semibold text-sm truncate pr-2">{event.name}</h3>
                                                        <div className="flex justify-between items-center mt-2">
                                                            <AvatarPile images={event.attendees} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Featured Card */}
                                        <motion.div
                                            className="relative h-36 rounded-xl overflow-hidden mt-1 border border-gray-800"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80" alt="Party" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                                            <div className="absolute bottom-3 left-3 right-3">
                                                <div className="text-[9px] font-bold text-teal-400 uppercase mb-0.5">Featured</div>
                                                <h3 className="font-bold text-white text-lg leading-tight">Neon Nights</h3>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Floating Nav */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-[#1e232d]/90 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-between px-6 shadow-2xl z-20">
                                        <div className="w-11 h-11 -mt-10 bg-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/40 text-white border-4 border-[#111318]">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    )
}
