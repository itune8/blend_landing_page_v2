"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

// Lazy load FloatingEventCards for better initial page performance
const FloatingEventCards = dynamic(
    () => import("@/components/FloatingEventCards").then(mod => ({ default: mod.FloatingEventCards })),
    {
        ssr: false,
        loading: () => null
    }
)

// Optimized background blobs - Teal themed with mobile-optimized blur
const BackgroundGradient = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 - Top Right - Teal/Cyan - Reduced blur on mobile */}
        <motion.div
            className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[#14B8A6] via-[#0D9488] to-[#06B6D4] opacity-20 blur-xl md:blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ willChange: 'opacity' }}
        />

        {/* Blob 2 - Middle Left - Emerald/Teal - Reduced blur on mobile */}
        <motion.div
            className="absolute top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-[#10B981] via-[#14B8A6] to-[#06B6D4] opacity-15 blur-xl md:blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            style={{ willChange: 'opacity' }}
        />

        {/* Blob 3 - Bottom Center - Deep Teal/Cyan - Reduced blur on mobile */}
        <motion.div
            className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-t from-[#0891B2] via-[#14B8A6] to-[#2DD4BF] opacity-15 blur-xl md:blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
            style={{ willChange: 'opacity' }}
        />

        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/80" />
    </div>
)

export function Hero() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const,
            },
        },
    }

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 py-12 md:py-24 pt-24 md:pt-32">
            <BackgroundGradient />
            <FloatingEventCards />

            <div className="relative z-10 w-full max-w-4xl mx-auto">
                {/* Centered Content */}
                <motion.div
                    className="text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] tracking-tight"
                    >
                        <span className="block">
                            Build Your{" "}
                            <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                                Community
                            </span>
                        </span>
                        <span className="block">
                            One{" "}
                            <span className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 bg-clip-text text-transparent">
                                Event
                            </span>
                            {" "}at a Time
                        </span>
                    </motion.h1>

                    {/* Single CTA Button with teal glow */}
                    <motion.div variants={itemVariants} className="mt-12">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button
                                size="lg"
                                className="btn-teal-glow text-lg px-8 py-6 rounded-full font-semibold shadow-2xl"
                                asChild
                            >
                                <Link href="/create-event">Create Your First Event</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
