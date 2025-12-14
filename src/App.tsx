import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { Footer } from "@/components/Footer"
import { Pricing } from "@/components/Pricing"

import { CreateEvent } from "@/components/CreateEvent"
import { EventForm } from "@/components/EventForm"
import { EventDetail } from "@/components/EventDetail"
import { PaymentTest } from "@/components/PaymentTest"

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
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background overflow-x-hidden">
          {/* Navbar is rendered conditionally or globally. If globally, we might want to hide it on the standalone login page, or keep it. Luma usually hides main nav on login. I'll check route to condition it, or just let it be for now. But CreateEvent has its own styling. Let's keep Navbar for now but maybe wrap content. OR, simply move Navbar inside Routes layout if I wanted to hide it.
        Actually, the user CreateEvent page has a "Back to Home" button and full screen dark background. It likely shouldn't have the main Navbar overlaping it.
        I will conditionally render Navbar or better yet, move Navbar into the Page components or a Layout wrapper.
        For minimal change: I will leave Navbar global for now, but `CreateEvent` uses z-index and full screen so it might cover it.
        Wait, `CreateEvent` is `min-h-screen w-full fixed` or just normal flow? It's `min-h-screen`.
        If I put it in `main`, it will appear below navbar.
        Let's just add the route.
        */}
          <Routes>
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/events" element={<CreateEvent />} />
            <Route path="/create" element={<EventForm />} />
            <Route path="/calendars" element={<CreateEvent />} />
            <Route path="/discover" element={<CreateEvent />} />
            <Route path="/event/:id" element={<EventDetail />} />
            <Route path="/payment-test" element={<PaymentTest />} />
            <Route path="*" element={
              <>
                <Navbar onThemeToggle={toggleTheme} isDark={isDark} />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                  </Routes>
                </main>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
