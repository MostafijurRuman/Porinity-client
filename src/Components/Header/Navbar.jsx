import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion as Motion } from 'framer-motion'
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiGrid, FiEdit3, FiUsers, FiInfo, FiPhone } from 'react-icons/fi'
import { TfiCrown } from 'react-icons/tfi'
import useAuth from '../../Hooks/UseAuth'
import useUserAccount from '../../Hooks/useUserAccount'

// Contract
// - Shows logo + name, Home, Biodatas, About Us, Contact Us, Login
// - If user logged in (replace isLoggedIn detection later), show Dashboard
// - Sticky top with shadow on scroll
// - Mobile: offcanvas panel from right, body scroll locked while open
// - Uses Tailwind v4 and theme variables from index.css

export default function Navbar() {
  const { user, logout } = useAuth() || {}
  const { account } = useUserAccount(user?.uid)
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close drawer when navigating
  useEffect(() => {
    setIsOpen(false)
    setIsProfileDropdownOpen(false)
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
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ` +
    (isActive
      ? 'text-[var(--color-primary)] bg-[var(--color-bg-light)]'
      : 'text-[var(--color-dark-gray)] hover:text-[var(--color-primary)] hover:bg-[var(--color-bg-light)]')

  const primaryBtnClass = 'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-light-purple)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-2'

  const navLinks = [
    { to: '/', label: 'Home', icon: FiHome },
    { to: '/biodatas', label: 'Biodatas', icon: FiUsers },
    { to: '/about-us', label: 'About Us', icon: FiInfo },
    { to: '/contact', label: 'Contact Us', icon: FiPhone },
  ]

  const Name = user?.displayName?.split(' ').pop() || user?.displayName
  const isPremiumUser = account?.userType === 'premium' || account?.premiumUserStatus === 'approved'

  const handleLogout = async () => {
    try {
      await logout()
      setIsProfileDropdownOpen(false)
      navigate('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

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
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navItemClass}>
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            ))}
            {user && (
              <NavLink to="/dashboard" className={navItemClass}>
                <FiGrid className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center">
            {user ? (
              <div className="relative">
                <Motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileDropdownOpen((v) => !v)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[var(--color-bg-light)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)] focus:ring-offset-2"
                >
                  <Motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-[var(--color-bg-light)]"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
                    ) : (
                      <FiUser className="h-5 w-5 text-[var(--color-primary)]" />
                    )}
                  </Motion.div>
                  <span className="text-sm font-medium text-[var(--color-dark-gray)] max-w-32 truncate flex items-center gap-1">
                    <span className="truncate">{Name || 'User'}</span>
                    {isPremiumUser && (
                      <TfiCrown className="text-[var(--color-primary)] text-xs" />
                    )}
                  </span>
                  </Motion.button>
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                      <Motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-lg border border-[var(--color-bg-light)] py-1 z-50"
                    >
                      {isPremiumUser && (
                        <div className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--color-primary-accent)]">
                          <TfiCrown className="text-sm" /> Premium
                        </div>
                      )}
                      <Link to="/dashboard" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-dark-gray)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-primary)] transition-colors duration-200">
                        <FiGrid className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link to="/edit-profile" onClick={() => setIsProfileDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-[var(--color-dark-gray)] hover:bg-[var(--color-bg-light)] hover:text-[var(--color-primary)] transition-colors duration-200">
                        <FiEdit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </Link>
                      <hr className="my-1" />
                        <Motion.button
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Logout</span>
                        </Motion.button>
                      </Motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
                <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className={primaryBtnClass}>Login</Link>
                </Motion.div>
            )}
          </div>

          {/* Mobile: hamburger */}
            <Motion.button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--color-primary)] hover:bg-[var(--color-bg-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]"
            onClick={() => setIsOpen(true)}
            whileTap={{ scale: 0.95 }}
          >
            <FiMenu className="w-6 h-6" />
            </Motion.button>
        </div>
      </nav>

      {/* Offcanvas with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
            <Motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
              <Motion.div
              className="absolute inset-0 backdrop-blur-md bg-gradient-to-r from-[var(--color-primary)]/40 via-[var(--color-primary)]/20 to-transparent"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Panel */}
              <Motion.aside
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
                  <Motion.button
                  aria-label="Close menu"
                  className="p-2 rounded-md text-[var(--color-primary)] hover:bg-[var(--color-bg-light)]"
                  onClick={() => setIsOpen(false)}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiX className="w-6 h-6" />
                  </Motion.button>
              </div>

              <div className="px-4 py-4 flex flex-col gap-2">
                {user && (
                  <>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/90 backdrop-blur border border-[var(--color-bg-light)]">
                      <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--color-bg-light)]">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.displayName || 'User'} className="h-full w-full object-cover" />
                        ) : (
                          <FiUser className="h-5 w-5 text-[var(--color-primary)]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[var(--color-dark-gray)] truncate flex items-center gap-1">
                          <span className="truncate">{user.displayName || 'User'}</span>
                          {isPremiumUser && <TfiCrown className="text-[var(--color-primary)] text-xs" />}
                        </p>
                        <p className="text-xs text-[var(--color-medium-gray)] truncate">{user.email}</p>
                      </div>
                    </div>
                    <hr className="my-2 border-[var(--color-bg-light)]" />
                  </>
                )}
                  {navLinks.map((link, index) => (
                    <Motion.div key={link.to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * (index + 1), duration: 0.25 }}>
                    <NavLink to={link.to} className={navItemClass}>
                      <link.icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </NavLink>
                    </Motion.div>
                ))}
                {user && (
                  <NavLink to="/dashboard" className={navItemClass}>
                    <FiGrid className="w-5 h-5" />
                    <span>Dashboard</span>
                  </NavLink>
                )}
                {user && (
                  <NavLink to="/edit-profile" className={navItemClass}>
                    <FiEdit3 className="w-5 h-5" />
                    <span>Edit Profile</span>
                  </NavLink>
                )}

                <div className="pt-2">
                  {!user ? (
                    <Link to="/login" className={primaryBtnClass + ' w-full justify-center'}>Login</Link>
                  ) : (
                    <button onClick={handleLogout} className={primaryBtnClass + ' w-full justify-center'}>
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  )}
                </div>
                </div>
              </Motion.aside>
            </Motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
