"use client"

import { useState, useEffect } from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setIsDark(prefersDark)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add("dark")
      root.classList.remove("light")
    } else {
      root.classList.add("light")
      root.classList.remove("dark")
    }
  }, [isDark])

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
          </ThemeContext.Provider>
        </AuthProvider>
      </body>
    </html>
  )
}

// Theme context for sharing theme state
import { createContext, useContext } from "react"

interface ThemeContextType {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  setIsDark: () => {},
})

export const useTheme = () => useContext(ThemeContext)
