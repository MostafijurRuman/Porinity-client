import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-16 bg-[var(--color-bg-light)] text-[var(--color-dark-gray)] border-t border-[var(--color-bg-light)]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top: brand + about */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="">
            <img src="/PorinityLogoTrans.png" alt="Porinity" className="h-16 w-auto object-contain" />
            <div>
              <p className="text-sm text-[var(--color-medium-gray)] mt-1">A modern matrimony platform helping you find meaningful connections with privacy, trust and care.</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-6 md:col-span-2 md:grid-cols-4">
            <div>
              <h4 className="text-sm font-semibold text-[var(--color-dark-gray)] uppercase tracking-wide mb-3">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link></li>
                <li><Link to="/biodatas" className="hover:text-[var(--color-primary)] transition-colors">Biodatas</Link></li>
                <li><Link to="/about-us" className="hover:text-[var(--color-primary)] transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[var(--color-primary)] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--color-dark-gray)] uppercase tracking-wide mb-3">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-[var(--color-primary)] transition-colors">Login</Link></li>
                <li><Link to="/register" className="hover:text-[var(--color-primary)] transition-colors">Register</Link></li>
                <li><Link to="/dashboard" className="hover:text-[var(--color-primary)] transition-colors">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--color-dark-gray)] uppercase tracking-wide mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[var(--color-primary)] transition-colors">Cookies</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-[var(--color-dark-gray)] uppercase tracking-wide mb-3">Connect</h4>
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M13.5 9H15V7h-1.5c-1.1 0-2 .9-2 2v1.5H10V12h1.5v5h2v-5H15l.5-1.5h-2V9c0-.3.2-.5.5-.5z"/></svg>
                </a>
                <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M19.6 7.6c.01.14.01.28.01.42 0 4.28-3.25 9.22-9.22 9.22-1.83 0-3.54-.54-4.97-1.48.25.03.5.04.76.04 1.51 0 2.9-.51 4.01-1.37-1.41-.03-2.6-.96-3.01-2.23.2.04.41.06.62.06.3 0 .6-.04.87-.12-1.48-.3-2.6-1.61-2.6-3.19v-.04c.44.24.94.39 1.47.41-.87-.58-1.44-1.57-1.44-2.7 0-.59.16-1.14.45-1.62 1.62 1.99 4.05 3.3 6.79 3.44-.06-.24-.09-.49-.09-.75 0-1.8 1.46-3.26 3.26-3.26.94 0 1.78.39 2.37 1.02.74-.14 1.43-.41 2.06-.79-.24.76-.76 1.39-1.42 1.79.66-.08 1.3-.25 1.89-.51-.44.65-1 1.22-1.64 1.67z"/></svg>
                </a>
                <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3zm0 2a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V7a1 1 0 00-1-1H7zm5 2.5A4.5 4.5 0 1112 17a4.5 4.5 0 010-9zm0 2a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm5.25-2.75a.75.75 0 110 1.5.75.75 0 010-1.5z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--color-bg-light)]/70 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-medium-gray)]">© {year} Porinity. All rights reserved.</p>
          <div className="text-xs text-[var(--color-medium-gray)]">Made with <span className="text-[var(--color-primary-accent)]">❤</span> for meaningful connections.</div>
        </div>
      </div>
    </footer>
  )
}
