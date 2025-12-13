import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { PhoneMockup } from "@/components/PhoneMockup"

// Animated background blobs (same as original Luma)
const BackgroundGradient = () => (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1440 1045"
            className="w-full h-full opacity-15"
        >
            <defs>
                <linearGradient id="grad1" x1="1405.21" x2="1340.51" y1="-27.156" y2="959.445" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#F8B8BC" />
                    <stop offset="0.338" stopColor="#FA9898" />
                    <stop offset="1" stopColor="#BEE4BE" />
                </linearGradient>
                <linearGradient id="grad2" x1="657.092" x2="533.655" y1="-62.023" y2="1379.74" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FEF1C3" />
                    <stop offset="0.338" stopColor="#FBAF59" />
                    <stop offset="1" stopColor="#F86A1A" />
                </linearGradient>
                <linearGradient id="grad3" x1="-693.781" x2="194.39" y1="497.468" y2="1081.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00CAE5" />
                    <stop offset="1" stopColor="#D068BB" />
                </linearGradient>
                <filter id="blur1" width="2677" height="1641" x="-667" y="-221" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="100" />
                </filter>
                <filter id="blur2" width="2830" height="2219" x="-1645" y="-253" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="100" />
                </filter>
                <filter id="blur3" width="1458" height="2148" x="-892" y="-274" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
                    <feGaussianBlur stdDeviation="100" />
                </filter>
            </defs>
            <g filter="url(#blur1)">
                <motion.path
                    fill="url(#grad1)"
                    d="M574.024-14.844 1554.4-21c49.73 49.656-256.96 249.617 134.98 448.139 255.21 129.271 95.36 450.601-384.16 606.961-515.216 167.99-1728.23 153.95-1771.055 183.45l-.898 2.45c-.553-.85-.242-1.67.898-2.45L-12.068-21z"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </g>
            <g filter="url(#blur2)">
                <motion.path
                    fill="url(#grad2)"
                    d="M-276.018-43.977 824.573-53c55.828 72.784 331.237 414.417 0 733.555-370.851 357.305-490.48 60.453-1232.183 731.755-345.632 312.82-989.25 307.15-1034.83 346.71l-1.96 6.98c-1.24-2.5-.54-4.81 1.96-6.98L-933.98-53z"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                />
            </g>
            <g filter="url(#blur3)">
                <motion.path
                    fill="url(#grad3)"
                    d="M259.126 545.017C515.61 303.398 250.814 55.145 86.356-38.779L-613.63-74-692 1526.81c265.983 120.93 748.077 280.72 548.59-47.54-249.359-410.33 81.932-632.229 402.536-934.253"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                />
            </g>
        </svg>
        {/* Fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
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
                                <a href="/create">Create Events</a>
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
