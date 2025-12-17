"use client"

import { Navbar } from "@/components/Navbar"
import { Pricing } from "@/components/Pricing"
import { Footer } from "@/components/Footer"
import { useTheme } from "../layout"

export default function PricingPage() {
    const { isDark, setIsDark } = useTheme()

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <Navbar onThemeToggle={() => setIsDark(!isDark)} isDark={isDark} />
            <main>
                <Pricing />
                <Footer />
            </main>
        </div>
    )
}
