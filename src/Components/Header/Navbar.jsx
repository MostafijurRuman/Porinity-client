import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import * as FM from 'framer-motion'

// Contract
// - Shows logo + name, Home, Biodatas, About Us, Contact Us, Login
// - If user logged in (replace isLoggedIn detection later), show Dashboard
// - Sticky top with shadow on scroll
// - Mobile: offcanvas panel from right, body scroll locked while open
// - Uses Tailwind v4 and theme variables from index.css

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // TODO: Replace with real auth state
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  useEffect(() => {
    // Placeholder: check localStorage/token or context here
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
    setIsLoggedIn(Boolean(token))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer when navigating
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Lock body scroll when menu is open (mobile)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navItemClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ` +
    (isActive
      ? 'text-white bg-[var(--color-primary-accent)]'
      : 'text-[var(--color-dark-gray)] hover:text-white hover:bg-[var(--color-light-purple)]')

  const primaryBtnClass = 'inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-light-purple)] transition-colors duration-200'

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md bg-[var(--color-card-light)]/95 backdrop-blur' : 'bg-[var(--color-card-light)]'}`}>
      <nav className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo + Name */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <img src="/PorinityLogoTrans.png" alt="Porinity" className="h-16 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={navItemClass}>Home</NavLink>
            <NavLink to="/biodatas" className={navItemClass}>Biodatas</NavLink>
            <NavLink to="/about-us" className={navItemClass}>About Us</NavLink>
            <NavLink to="/contact" className={navItemClass}>Contact Us</NavLink>
            {isLoggedIn && (
              <NavLink to="/dashboard" className={navItemClass}>Dashboard</NavLink>
            )}
          </div>

          {/* Desktop CTA (optional) */}
          <div className="hidden md:flex items-center">
            {!isLoggedIn ? (
              <Link to="/login" className={primaryBtnClass}>Login</Link>
            ) : (
              <button onClick={() => { localStorage.removeItem('authToken'); setIsLoggedIn(false) }} className={primaryBtnClass}>Logout</button>
            )}
          </div>

          {/* Mobile: hamburger */}
          <FM.motion.button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--color-primary)] hover:bg-[var(--color-bg-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]"
            onClick={() => setIsOpen(true)}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </FM.motion.button>
        </div>
      </nav>

      {/* Offcanvas with Framer Motion */}
      <FM.AnimatePresence>
        {isOpen && (
          <FM.motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <FM.motion.div
              className="absolute inset-0 backdrop-blur-sm bg-gradient-to-r from-[var(--color-primary)]/40 via-[var(--color-primary)]/20 to-transparent"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Panel */}
            <FM.motion.aside
              role="dialog"
              aria-modal="true"
              className="absolute right-0 top-0 h-full w-80 max-w-[85%] bg-[var(--color-card-light)] shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-bg-light)]">
                <Link to="/" className="flex items-center gap-2">
                  <img src="/PorinityLogoTrans.png" alt="Porinity" className="h-16 w-auto object-contain" />
                </Link>
                <FM.motion.button
                  aria-label="Close menu"
                  className="p-2 rounded-md text-[var(--color-primary)] hover:bg-[var(--color-bg-light)]"
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </FM.motion.button>
              </div>

              <div className="px-4 py-4 flex flex-col gap-2">
                <NavLink to="/" className={navItemClass}>Home</NavLink>
                <NavLink to="/biodatas" className={navItemClass}>Biodatas</NavLink>
                <NavLink to="/about-us" className={navItemClass}>About Us</NavLink>
                <NavLink to="/contact" className={navItemClass}>Contact Us</NavLink>
                {isLoggedIn && (
                  <NavLink to="/dashboard" className={navItemClass}>Dashboard</NavLink>
                )}

                <div className="pt-2">
                  {!isLoggedIn ? (
                    <Link to="/login" className={primaryBtnClass + ' w-full justify-center'}>Login</Link>
                  ) : (
                    <button onClick={() => { localStorage.removeItem('authToken'); setIsLoggedIn(false) }} className={primaryBtnClass + ' w-full justify-center'}>Logout</button>
                  )}
                </div>
              </div>
            </FM.motion.aside>
          </FM.motion.div>
        )}
      </FM.AnimatePresence>
    </header>
  )
}
