"use client"

import { Navbar } from "@/components/Navbar"
import { DeviceShowcase } from "@/components/DeviceShowcase"
import { useTheme } from "../layout"

export default function WhatsBlendPage() {
    const { isDark, setIsDark } = useTheme()

    return (
        <div className="min-h-screen bg-background overflow-x-hidden">
            <Navbar onThemeToggle={() => setIsDark(!isDark)} isDark={isDark} />
            <main className="relative pt-32">
                <DeviceShowcase />
            </main>
        </div>
    )
}
