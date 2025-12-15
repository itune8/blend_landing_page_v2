"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Sparkles, Music, Users, Star } from "lucide-react"

// Sample event data
const events = [
    {
        id: 1,
        name: "Yoga Flow at Sunset",
        date: "Tomorrow, 6:30 PM",
        location: "Raouche Beach",
        attendees: ["https://i.pravatar.cc/100?img=1", "https://i.pravatar.cc/100?img=5", "https://i.pravatar.cc/100?img=8"],
        color: "#1EBFAF"
    },
    {
        id: 2,
        name: "Tech Meetup Beirut",
        date: "Fri Dec 15, 7:00 PM",
        location: "Beirut Digital District",
        attendees: ["https://i.pravatar.cc/100?img=3", "https://i.pravatar.cc/100?img=4"],
        color: "#6366f1"
    },
    {
        id: 3,
        name: "Art & Wine Night",
        date: "Sat Dec 16, 8:00 PM",
        location: "Mar Mikhael Gallery",
        attendees: ["https://i.pravatar.cc/100?img=9", "https://i.pravatar.cc/100?img=10", "https://i.pravatar.cc/100?img=11"],
        color: "#ec4899"
    },
]

// Avatar pile component
const AvatarPile = ({ images }: { images: string[] }) => (
    <div className="flex -space-x-2">
        {images.map((img, i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-[#1a1f2e] bg-gray-700 overflow-hidden">
                <Image src={img} alt="User" width={20} height={20} className="w-full h-full object-cover" />
            </div>
        ))}
        <div className="w-5 h-5 rounded-full border-2 border-[#1a1f2e] bg-gray-800 flex items-center justify-center text-[8px] text-gray-400 font-medium">
            +
        </div>
    </div>
)

export function PhoneMockup() {
    const [showVideo, setShowVideo] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowVideo(true)
        }, 4000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className="relative w-full h-[500px] md:h-[600px] lg:h-[800px] flex items-center justify-center overflow-visible scale-[0.6] sm:scale-[0.75] md:scale-[0.9] lg:scale-100 origin-center"
            style={{ perspective: "2000px" }}
        >
            {/* Dark circular background with spotlight glow */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <div className="relative w-[650px] h-[650px] flex items-center justify-center">
                    {/* Outer glow - purple/pink */}
                    <div className="absolute inset-0 rounded-full bg-purple-600 opacity-10 blur-3xl" />

                    {/* Main circular spotlight */}
                    <div className="relative w-[580px] h-[580px] rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl overflow-hidden flex items-center justify-center border border-purple-500/10">
                        {/* Radial gradient overlay for spotlight effect */}
                        <div className="absolute inset-0 bg-gradient-radial from-purple-500/5 via-transparent to-transparent" />

                        {/* Background image */}
                        <Image
                            src="/blend_day_crowd_flag_1765652216589.png"
                            alt="Background"
                            fill
                            className="object-cover opacity-30"
                        />

                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                </div>
            </motion.div>

            {/* Floating 3D Elements Container */}
            <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: "preserve-3d" }}>

                {/* Top Left - Star Icon */}
                <motion.div
                    className="absolute top-[15%] left-[15%] z-20"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, scale: 0, rotateZ: -45 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotateZ: 0,
                        rotateY: [0, 360],
                        y: [-10, 10, -10]
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.5 },
                        scale: { duration: 0.8, delay: 0.5 },
                        rotateZ: { duration: 0.8, delay: 0.5 },
                        rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl" />
                        <Star className="w-12 h-12 text-pink-400 fill-pink-400" />
                    </div>
                </motion.div>

                {/* Top Right - Calendar Card */}
                <motion.div
                    className="absolute top-[12%] right-[18%] z-20"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, x: 50, rotateY: 45 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        rotateY: [-15, 15, -15],
                        y: [0, -15, 0]
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.7 },
                        x: { duration: 0.8, delay: 0.7 },
                        rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <Card className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 border-2 border-purple-400/30 shadow-2xl shadow-purple-500/40">
                        <CardContent className="p-0 h-full flex flex-col items-center justify-center">
                            <div className="text-xs font-semibold text-white/80 uppercase tracking-wide">Dec</div>
                            <div className="text-3xl font-bold text-white">23</div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Left Side - Pink Card */}
                <motion.div
                    className="absolute left-[8%] top-[45%] z-20"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, x: -50, rotateY: -45 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        rotateY: [15, -15, 15],
                        rotateZ: [-5, 5, -5],
                        y: [10, -10, 10]
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: 0.9 },
                        x: { duration: 0.8, delay: 0.9 },
                        rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <Card className="w-32 h-24 bg-gradient-to-br from-pink-400 to-rose-500 border-2 border-pink-300/30 shadow-2xl shadow-pink-500/40">
                        <CardContent className="p-4 h-full flex flex-col justify-between">
                            <Music className="w-6 h-6 text-white/90" />
                            <div>
                                <div className="text-xs font-semibold text-white/80">DJ Event</div>
                                <div className="text-sm font-bold text-white">Tonight</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Right Side - Orange/Peach Card */}
                <motion.div
                    className="absolute right-[10%] top-[48%] z-20"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, x: 50, rotateY: 45 }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        rotateY: [-15, 15, -15],
                        rotateZ: [5, -5, 5],
                        y: [-10, 10, -10]
                    }}
                    transition={{
                        opacity: { duration: 0.8, delay: 1.1 },
                        x: { duration: 0.8, delay: 1.1 },
                        rotateY: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                        rotateZ: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <Card className="w-32 h-24 bg-gradient-to-br from-orange-400 to-amber-500 border-2 border-orange-300/30 shadow-2xl shadow-orange-500/40">
                        <CardContent className="p-4 h-full flex flex-col justify-between">
                            <Users className="w-6 h-6 text-white/90" />
                            <div>
                                <div className="text-xs font-semibold text-white/80">Community</div>
                                <div className="text-sm font-bold text-white">5K+ Users</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Bottom - Sparkle accent */}
                <motion.div
                    className="absolute bottom-[20%] left-[25%] z-20"
                    style={{ transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: [0.4, 1, 0.4],
                        scale: [0.8, 1.2, 0.8],
                        rotate: [0, 180, 360]
                    }}
                    transition={{
                        opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                        rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                    }}
                >
                    <Sparkles className="w-8 h-8 text-teal-400" />
                </motion.div>

            </div>

            {/* Phone Mockup - 3D Tilted with Final Values */}
            <motion.div
                className="relative will-change-transform z-30"
                style={{
                    width: 300,
                    height: 560,
                    transformStyle: "preserve-3d",
                    transform: `
                        translateX(-28px)
                        translateY(18px)
                        rotateX(17deg)
                        rotateY(-12deg)
                        rotateZ(11deg)
                        scale(1.22)
                    `,
                }}
                initial={{ opacity: 0 }}
                animate={{
                    opacity: 1,
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                {/* Phone Container - 3D Floating Animation */}
                <motion.div
                    className="w-full h-full bg-[#0f1115] rounded-[2.8rem] border-[7px] border-[#2a2f3a] overflow-hidden relative shadow-2xl"
                    style={{ transformStyle: "preserve-3d" }}
                    animate={{
                        y: [-8, 8, -8],
                    }}
                    transition={{
                        y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                    }}
                >
                    {/* Dynamic Island */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85px] h-[26px] bg-black rounded-b-[15px] z-50 flex justify-center items-center">
                        <div className="w-12 h-3 bg-black rounded-full" />
                    </div>

                    {/* Status Bar */}
                    <div className="absolute top-3 left-6 text-[9px] font-semibold text-white z-40">9:41</div>

                    {/* Content Container */}
                    <div className="w-full h-full bg-[#111318] relative overflow-hidden rounded-[2.3rem]">

                        {/* Video Layer */}
                        <div className="absolute inset-0 w-full h-full z-0">
                            <video
                                className="w-full h-full object-cover pointer-events-none"
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="auto"
                                aria-label="Blend app demonstration video"
                            >
                                <source src="/Blend_App_Hero_Edit.MP4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        {/* Static UI Layer */}
                        <AnimatePresence>
                            {!showVideo && (
                                <motion.div
                                    key="static-ui"
                                    className="absolute inset-0 w-full h-full text-white pt-11 px-4 pb-7 flex flex-col bg-[#111318] z-10"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg viewBox="0 0 40 40" className="w-5 h-5 text-teal-400" fill="none">
                                                <circle cx="12" cy="20" r="7" stroke="currentColor" strokeWidth="3.5" />
                                                <path d="M12 13 L12 7 Q12 2 17 2 Q22 2 22 7 Q22 13 17 13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                                            </svg>
                                            <span className="font-bold text-base tracking-tight">blend</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-white">Explore Events</h2>
                                        <p className="text-teal-500/80 text-[11px] font-medium mt-0.5">Happening Near You</p>
                                    </div>

                                    {/* Event List */}
                                    <div className="space-y-2.5 overflow-y-auto no-scrollbar flex-1">
                                        {events.map((event, i) => (
                                            <motion.div
                                                key={event.id}
                                                className="group relative bg-[#1a1d24] rounded-xl p-2.5 border border-gray-800 hover:border-teal-500/30 transition-colors"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 + i * 0.1 }}
                                            >
                                                <div className="flex gap-2.5">
                                                    <div className="flex-shrink-0 w-11 h-12 bg-gray-800 rounded-lg flex flex-col items-center justify-center border border-gray-700">
                                                        <span className="text-[8px] uppercase font-bold text-gray-400">DEC</span>
                                                        <span className="text-base font-bold text-white">1{5 + i}</span>
                                                    </div>
                                                    <div className="flex-1 min-w-0 py-0.5">
                                                        <h3 className="font-semibold text-xs truncate pr-2">{event.name}</h3>
                                                        <div className="flex justify-between items-center mt-1.5">
                                                            <AvatarPile images={event.attendees} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        {/* Featured Card */}
                                        <motion.div
                                            className="relative h-32 rounded-xl overflow-hidden mt-1 border border-gray-800"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Image
                                                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80"
                                                alt="Party"
                                                fill
                                                className="object-cover opacity-60"
                                            />
                                            <div className="absolute inset-0 bg-gray-900/70" />
                                            <div className="absolute bottom-2.5 left-2.5 right-2.5">
                                                <div className="text-[8px] font-bold text-teal-400 uppercase mb-0.5">Featured</div>
                                                <h3 className="font-bold text-white text-base leading-tight">Neon Nights</h3>
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Floating Nav */}
                                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] h-14 bg-[#1e232d]/95 backdrop-blur-xl border border-white/5 rounded-2xl flex items-center justify-between px-5 shadow-xl z-20">
                                        <div className="w-10 h-10 -mt-9 bg-teal-500 rounded-full flex items-center justify-center shadow-lg text-white border-4 border-[#111318]">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                            </svg>
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
