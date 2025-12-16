"use client"

import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { useTheme } from "./layout"

export default function HomePage() {
    const { isDark, setIsDark } = useTheme()

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <Navbar onThemeToggle={() => setIsDark(!isDark)} isDark={isDark} />
            <main className="border-0">
                <Hero />
            </main>
        </div>
    )
}
