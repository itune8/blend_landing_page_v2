import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

// Blend Logo - using uploaded asset
const BlendLogo = ({ className }: { className?: string }) => (
    <img src="/logo_blend.png" alt="Blend Logo" className={`w-auto object-contain drop-shadow-[0_0_12px_rgba(20,184,166,0.5)] ${className}`} />
)

interface NavbarProps {
    onThemeToggle?: () => void
    isDark?: boolean
}

export function Navbar({ onThemeToggle, isDark }: NavbarProps) {
    return (
        <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full py-3 relative z-50"
        >
            <div
                className="w-full mx-auto flex justify-between items-center px-4 md:px-0"
            >
                {/* Logo Group */}
                <div className="transition-all duration-300 md:ml-[7%]">
                    <Link to="/" aria-label="Blend Home">
                        <motion.div
                            className="hover:opacity-80 transition-opacity duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <BlendLogo className="h-12 md:h-24" />
                        </motion.div>
                    </Link>
                </div>

                {/* Right side navigation */}
                <div className="flex items-center gap-4 transition-all duration-300 md:mr-[5%]">
                    {/* Theme toggle */}
                    <motion.button
                        onClick={onThemeToggle}
                        className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                        )}
                    </motion.button>

                    {/* Discover Events link */}
                    <motion.a
                        href="/discover"
                        className="hidden md:flex items-center gap-1 text-sm font-medium text-foreground/40 hover:text-foreground transition-colors group"
                        whileHover={{ x: 2 }}
                    >
                        <span>Discover Events</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </motion.a>

                    {/* Mobile Discover Icon (Optional, or just hide text) */}

                    {/* Sign In button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="light" size="sm" rounded="full" asChild>
                            <Link to="/signin">Sign In</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </motion.nav>
    )
}
