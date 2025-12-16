"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

// Background gradient matching main page
const BackgroundGradient = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 - Top Right - Teal/Cyan */}
        <motion.div
            className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[#14B8A6] via-[#0D9488] to-[#06B6D4] opacity-20 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Blob 2 - Middle Left - Emerald/Teal */}
        <motion.div
            className="absolute top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-[#10B981] via-[#14B8A6] to-[#06B6D4] opacity-15 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        />

        {/* Blob 3 - Bottom Center - Deep Teal/Cyan */}
        <motion.div
            className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-t from-[#0891B2] via-[#14B8A6] to-[#2DD4BF] opacity-15 blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
        />
    </div>
)

// Blend Logo watermark
const BlendLogoWatermark = () => (
    <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-3/4 h-3/4">
            <circle cx="35" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="65" cy="50" r="25" stroke="currentColor" strokeWidth="3" fill="none" />
        </svg>
    </div>
)

export function DeviceShowcase() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const deviceVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
            <BackgroundGradient />

            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Heading */}
                <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    Experience Blend on{" "}
                    <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                        Every Device
                    </span>
                </motion.h2>

                {/* 3-Device Layout */}
                <div className="relative flex items-center justify-center gap-8 md:gap-12">
                    {/* iPad - Left */}
                    <motion.div
                        variants={deviceVariants}
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.05, z: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Link href="/discover" className="block">
                            {/* iPad Frame */}
                            <div className="relative w-[140px] md:w-[200px] lg:w-[240px] aspect-[3/4] bg-gray-900 rounded-[24px] md:rounded-[32px] p-3 md:p-4 shadow-2xl border-4 md:border-8 border-gray-800">
                                {/* iPad Screen with Blend logo */}
                                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[16px] md:rounded-[24px] overflow-hidden">
                                    <BlendLogoWatermark />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-white/80 text-xs md:text-sm font-semibold">Discover Page</p>
                                    </div>
                                </div>
                                {/* iPad Camera */}
                                <div className="absolute top-2 md:top-3 left-1/2 transform -translate-x-1/2 w-2 md:w-3 h-2 md:h-3 bg-gray-700 rounded-full" />
                            </div>
                        </Link>
                    </motion.div>

                    {/* MacBook - Center (larger, behind) */}
                    <motion.div
                        variants={deviceVariants}
                        className="relative group cursor-pointer z-10"
                        whileHover={{ scale: 1.05, z: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Link href="/calendars" className="block">
                            {/* MacBook */}
                            <div className="relative">
                                {/* Screen */}
                                <div className="relative w-[240px] md:w-[400px] lg:w-[500px] aspect-[16/10] bg-gray-900 rounded-t-[16px] md:rounded-t-[24px] p-2 md:p-3 shadow-2xl border-4 md:border-8 border-gray-800 border-b-0">
                                    <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[12px] md:rounded-[18px] overflow-hidden">
                                        <BlendLogoWatermark />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-white/80 text-sm md:text-base font-semibold">Organizer Dashboard</p>
                                        </div>
                                    </div>
                                    {/* Camera notch */}
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 md:w-24 h-1 md:h-1.5 bg-gray-700 rounded-b-lg" />
                                </div>
                                {/* MacBook Base */}
                                <div className="w-[260px] md:w-[430px] lg:w-[540px] h-2 md:h-3 bg-gradient-to-b from-gray-700 to-gray-800 rounded-b-lg mx-auto shadow-lg" />
                            </div>
                        </Link>
                    </motion.div>

                    {/* iPhone - Right */}
                    <motion.div
                        variants={deviceVariants}
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.05, z: 50 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        <Link href="/events" className="block">
                            {/* iPhone Frame */}
                            <div className="relative w-[100px] md:w-[140px] lg:w-[160px] aspect-[9/19.5] bg-gray-900 rounded-[28px] md:rounded-[40px] p-2 md:p-3 shadow-2xl border-4 md:border-8 border-gray-800">
                                {/* iPhone Screen with Blend logo */}
                                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-[20px] md:rounded-[32px] overflow-hidden">
                                    <BlendLogoWatermark />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <p className="text-white/80 text-[10px] md:text-xs font-semibold text-center px-2">Event Details</p>
                                    </div>
                                </div>
                                {/* iPhone Dynamic Island */}
                                <div className="absolute top-2 md:top-3 left-1/2 transform -translate-x-1/2 w-16 md:w-20 h-5 md:h-6 bg-black rounded-full" />
                            </div>
                        </Link>
                    </motion.div>
                </div>

                {/* Description */}
                <motion.p
                    className="text-center text-muted-foreground mt-16 max-w-2xl mx-auto text-sm md:text-base"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    Discover events, connect with your community, and create memorable experiences —
                    seamlessly across all your devices.
                </motion.p>
            </motion.div>
        </section>
    )
}
