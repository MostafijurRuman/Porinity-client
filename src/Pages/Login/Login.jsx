import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi'
import { FcGoogle } from "react-icons/fc";
import useAuth from '../../Hooks/UseAuth'
import { toast } from 'react-toastify'

export default function Login() {
  const { loginWithEmailPassword, handelLoginWithGoogle } = useAuth() || {}
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const mapFirebaseError = (err) => {
    const code = err?.code || ''
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
      case 'auth/user-not-found':
        return 'No account found with that email.'
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.'
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network error. Check your connection.'
      default:
        return err?.message || 'Failed to login. Please try again.'
    }
  }

  const onSubmit = async (data) => {
    setAuthError('')
    try {
      await loginWithEmailPassword(data.email, data.password)
      toast.success('Logged in successfully')
       navigate(location?.state ? location.state : "/" );
    } catch (err) {
      const msg = mapFirebaseError(err)
      setAuthError(msg)
      toast.error(msg)
    }
  }

  const onGoogle = async () => {
    setAuthError('')
    try {
      await handelLoginWithGoogle()
      toast.success('Logged in with Google')
       navigate(location?.state ? location.state : "/" );
    } catch (err) {
      const msg = mapFirebaseError(err)
      setAuthError(msg)
      toast.error(msg)
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px-280px)] bg-[var(--color-bg-light)] flex items-center py-12">
      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Left: brand / hero */}
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--color-bg-light)]">
            <div className="flex items-center gap-3">
              <img src="/PorinityLogoTrans.png" alt="Porinity" className="h-16 w-auto object-contain" />
              <div>
                <h2 className="heading text-2xl font-bold text-[var(--color-primary)]">Welcome back</h2>
                <p className="text-[var(--color-medium-gray)] text-sm">Continue your journey to meaningful connections.</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-[var(--color-bg-light)] px-3 py-2 text-xs">Privacy-first</div>
              <div className="rounded-lg border border-[var(--color-bg-light)] px-3 py-2 text-xs">Verified Profiles</div>
              <div className="rounded-lg border border-[var(--color-bg-light)] px-3 py-2 text-xs">Secure Matchmaking</div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--color-bg-light)]">
          <h1 className="heading text-2xl font-bold text-[var(--color-primary)]">Login</h1>
          <p className="text-sm text-[var(--color-medium-gray)] mt-1">Access your Porinity account</p>

          {authError && (
            <div className="mt-4 rounded-md bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm px-3 py-2">
              {authError}
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-sm font-medium text-[var(--color-dark-gray)] mb-1">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-medium-gray)]"><FiMail className="w-4 h-4" /></span>
                <input
                  type="email"
                  className="w-full rounded-md border border-[var(--color-bg-light)] bg-white/95 pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-dark-gray)] mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-medium-gray)]"><FiLock className="w-4 h-4" /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full rounded-md border border-[var(--color-bg-light)] bg-white/95 pl-9 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]"
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-medium-gray)] hover:text-[var(--color-dark-gray)]">
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-light-purple)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-accent)]">
              <FiLogIn className="w-4 h-4" /> {isSubmitting ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <div className="mt-4">
            <button onClick={onGoogle} className="w-full inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-[var(--color-dark-gray)] bg-[var(--color-bg-light)] hover:bg-white border border-[var(--color-bg-light)]">
              <FcGoogle className="w-4 h-4 text-[var(--color-primary)]" /> Continue with Google
            </button>
          </div>

          <p className="mt-4 text-sm text-[var(--color-medium-gray)]">
            Don’t have an account? <Link to="/register" className="text-[var(--color-primary)] hover:text-[var(--color-light-purple)]">Register</Link>
          </p>
        </div>
      </div>
    </main>
  )
}
