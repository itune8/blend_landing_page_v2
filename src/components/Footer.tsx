import { motion } from "framer-motion"

// Blend wordmark logo
const BlendWordmark = () => (
    <div className="flex items-center gap-1.5">
        <svg viewBox="0 0 32 32" className="w-4 h-4" fill="none">
            <circle cx="11" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <circle cx="21" cy="16" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
        </svg>
        <span className="font-semibold text-sm tracking-tight">blend</span>
    </div>
)

// Social icons
const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-4 h-4">
        <path fill="currentColor" fillRule="evenodd" d="M7 2.5h2c1.436 0 2.4.002 3.134.077.71.072 1.038.2 1.255.344a2.5 2.5 0 0 1 .69.69c.145.217.272.545.344 1.255.075.734.077 1.698.077 3.134s-.002 2.4-.077 3.134c-.072.71-.2 1.038-.344 1.255a2.5 2.5 0 0 1-.69.69c-.217.145-.545.272-1.255.344-.735.075-1.698.077-3.134.077H7c-1.436 0-2.4-.002-3.134-.077-.71-.072-1.038-.2-1.255-.344a2.5 2.5 0 0 1-.69-.69c-.145-.217-.272-.545-.344-1.255C1.502 10.4 1.5 9.436 1.5 8s.002-2.4.077-3.134c.072-.71.2-1.038.344-1.255a2.5 2.5 0 0 1 .69-.69c.217-.145.545-.272 1.255-.344C4.6 2.502 5.564 2.5 7 2.5M0 8c0-2.809 0-4.213.674-5.222a4 4 0 0 1 1.104-1.104C2.787 1 4.19 1 7 1h2c2.809 0 4.213 0 5.222.674.437.292.812.667 1.104 1.104C16 3.787 16 5.19 16 8s0 4.213-.674 5.222a4 4 0 0 1-1.104 1.104C13.213 15 11.81 15 9 15H7c-2.809 0-4.213 0-5.222-.674a4 4 0 0 1-1.104-1.104C0 12.213 0 10.81 0 8m5.458-2.594a.75.75 0 0 0-.916 1.188l2.282 1.757.004.004a1.96 1.96 0 0 0 2.363 0l.007-.006 2.262-1.757a.75.75 0 1 0-.92-1.184L8.282 7.16a.46.46 0 0 1-.546 0z" />
    </svg>
)

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330" className="w-4 h-4">
        <path fill="currentColor" d="M68 290.485c-5.5 9.6-17.8 12.8-27.3 7.3-9.6-5.5-12.8-17.8-7.3-27.3l14.3-24.7q24.15-7.35 39.6 11.4zm138.9-53.9H25c-11 0-20-9-20-20s9-20 20-20h51l65.4-113.2-20.5-35.4c-5.5-9.6-2.2-21.8 7.3-27.3 9.6-5.5 21.8-2.2 27.3 7.3l8.9 15.4 8.9-15.4c5.5-9.6 17.8-12.8 27.3-7.3 9.6 5.5 12.8 17.8 7.3 27.3l-85.8 148.6h62.1c20.2 0 31.5 23.7 22.7 40m98.1 0h-29l19.6 33.9c5.5 9.6 2.2 21.8-7.3 27.3-9.6 5.5-21.8 2.2-27.3-7.3-32.9-56.9-57.5-99.7-74-128.1-16.7-29-4.8-58 7.1-67.8 13.1 22.7 32.7 56.7 58.9 102h52c11 0 20 9 20 20 0 11.1-9 20-20 20" />
    </svg>
)

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-4 h-4">
        <path fill="currentColor" d="m108.783 107.652-38.24-55.748.066.053L105.087 12H93.565L65.478 44.522 43.174 12H12.957l35.7 52.048-.005-.005L11 107.653h11.522L53.748 71.47l24.817 36.182zM38.609 20.696l53.652 78.26h-9.13l-53.696-78.26z" />
    </svg>
)

const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="w-4 h-4">
        <g fill="currentColor" fillRule="evenodd">
            <path fillRule="nonzero" d="M13.38 3.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0" />
            <path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0-1.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8" />
            <path d="M0 7.68c0-2.688 0-4.032.523-5.06A4.8 4.8 0 0 1 2.621.524C3.648 0 4.99 0 7.68 0h.64c2.688 0 4.032 0 5.06.523a4.8 4.8 0 0 1 2.097 2.098C16 3.648 16 4.99 16 7.68v.64c0 2.688 0 4.032-.523 5.06a4.8 4.8 0 0 1-2.098 2.097C12.352 16 11.01 16 8.32 16h-.64c-2.688 0-4.032 0-5.06-.523a4.8 4.8 0 0 1-2.097-2.098C0 12.352 0 11.01 0 8.32zM7.68 1.6h.64c1.37 0 2.302.001 3.022.06.702.057 1.06.161 1.31.289a3.2 3.2 0 0 1 1.4 1.398c.127.25.23.61.288 1.31.059.72.06 1.652.06 3.023v.64c0 1.37-.001 2.302-.06 3.022-.057.702-.161 1.06-.289 1.31a3.2 3.2 0 0 1-1.398 1.4c-.25.127-.61.23-1.31.288-.72.059-1.652.06-3.023.06h-.64c-1.37 0-2.302-.001-3.022-.06-.702-.057-1.06-.161-1.31-.289a3.2 3.2 0 0 1-1.4-1.398c-.127-.25-.23-.61-.288-1.31-.059-.72-.06-1.652-.06-3.023v-.64c0-1.37.001-2.302.06-3.022.057-.702.161-1.06.289-1.31a3.2 3.2 0 0 1 1.398-1.4c.25-.127.61-.23 1.31-.288.72-.059 1.652-.06 3.023-.06" />
        </g>
    </svg>
)

const footerLinks = [
    { label: "Discover", href: "/discover" },
    { label: "Community", href: "/community" },
    { label: "Help", href: "/help" },
]

const socialLinks = [
    { icon: EmailIcon, label: "Contact Us", href: "mailto:hello@blend.lb" },
    { icon: AppleIcon, label: "Blend for iOS", href: "/download" },
    { icon: XIcon, label: "X (formerly Twitter)", href: "https://x.com/BlendLB" },
    { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/blend.lb/" },
]

const secondaryLinks = [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy-policy" },
]

export function Footer() {
    return (
        <motion.footer
            className="relative z-10 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
        >
            <div className="max-w-4xl mx-auto px-4 text-sm text-muted-foreground">
                {/* Main footer content */}
                <div className="border-t border-border pt-4 flex flex-wrap justify-between items-center gap-4">
                    {/* Left side - Logo and links */}
                    <div className="flex items-center flex-wrap gap-2">
                        <motion.a
                            href="/"
                            className="py-2 -ml-2 hover:text-foreground transition-colors"
                            whileHover={{ scale: 1.02 }}
                            aria-label="Blend Home"
                        >
                            <BlendWordmark />
                        </motion.a>

                        <div className="flex items-center">
                            {footerLinks.map((link) => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    className="px-2 py-2 hover:text-foreground transition-colors"
                                    whileHover={{ y: -1 }}
                                >
                                    {link.label}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Social icons */}
                    <div className="flex items-center -mx-2.5">
                        {socialLinks.map((link) => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                target={link.href.startsWith("http") ? "_blank" : undefined}
                                rel={link.href.startsWith("http") ? "nofollow noopener" : undefined}
                                aria-label={link.label}
                                className="p-2.5 hover:text-foreground transition-colors"
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <link.icon />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Secondary links */}
                <div className="py-2 pl-1 text-xs flex flex-wrap gap-1">
                    {secondaryLinks.map((link) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            className="px-2 py-1 text-muted-foreground/70 hover:text-muted-foreground transition-colors"
                            whileHover={{ y: -1 }}
                        >
                            {link.label}
                        </motion.a>
                    ))}
                </div>
            </div>
        </motion.footer>
    )
}
