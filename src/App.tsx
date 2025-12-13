import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Footer } from "@/components/Footer"
import { Pricing } from "@/components/Pricing"

function HomePage() {
  return (
    <>
      <Hero />
      <Footer />
    </>
  )
}

function PricingPage() {
  return (
    <>
      <Pricing />
      <Footer />
    </>
  )
}

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })

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

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <Navbar onThemeToggle={toggleTheme} isDark={isDark} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pricing" element={<PricingPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
