import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PhoneMockup } from "@/components/PhoneMockup"

// Animated background blobs (same as original Luma)
// Animated background blobs (CSS version for performance)
const BackgroundGradient = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Blob 1 - Top Right - Pink/Rose */}
        <motion.div
            className="absolute -top-[10%] -right-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[#F8B8BC] via-[#FA9898] to-[#BEE4BE] opacity-20 md:opacity-30 blur-xl md:blur-3xl will-change-transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{ transform: "translate3d(0,0,0)" }} // Force hardware acceleration
        />

        {/* Blob 2 - Middle Left - Orange/Yellow */}
        <motion.div
            className="absolute top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-tr from-[#FEF1C3] via-[#FBAF59] to-[#F86A1A] opacity-15 md:opacity-20 blur-xl md:blur-3xl will-change-transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
            style={{ transform: "translate3d(0,0,0)" }}
        />

        {/* Blob 3 - Bottom Center - Teal/Purple */}
        <motion.div
            className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-t from-[#00CAE5] to-[#D068BB] opacity-15 md:opacity-20 blur-xl md:blur-3xl will-change-transform"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
            style={{ transform: "translate3d(0,0,0)" }}
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
        <section className="relative min-h-[80vh] flex items-center px-4 py-12 md:py-24">
            <BackgroundGradient />

            <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-4">
                {/* Content */}
                <motion.div
                    className="flex-shrink-1 mt-0 lg:-mt-8 text-center lg:text-left"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Heading */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.03] tracking-tight"
                    >
                        <span className="block">Real People.</span>
                        <span className="gradient-text">Real Experiences.</span>
                        <span className="block">Real Blends.</span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="mt-6 text-lg md:text-xl text-muted-foreground max-w-[420px] mx-auto lg:mx-0"
                    >
                        Lebanon's most vibrant events in one place. From movement to meaning.
                    </motion.p>

                    {/* Single CTA Button with teal glow */}
                    <motion.div variants={itemVariants} className="mt-8">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button size="lg" className="btn-teal-glow" asChild>
                                <Link to="/create-event">Create Events</Link>
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Phone mockup */}
                <div className="flex-shrink-0 w-full lg:w-[620px] h-auto lg:h-[663px] flex items-center justify-center lg:-mr-10 perspective-1000">
                    <PhoneMockup />
                </div>
            </div>
        </section>
    )
}
