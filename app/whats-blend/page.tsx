"use client"

import dynamic from "next/dynamic"
import { Navbar } from "@/components/Navbar"
import { useTheme } from "../layout"

// Lazy load DeviceShowcase for better performance
const DeviceShowcase = dynamic(
    () => import("@/components/DeviceShowcase").then(mod => ({ default: mod.DeviceShowcase })),
    {
        ssr: false,
        loading: () => null
    }
)

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
