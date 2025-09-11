'use client'
'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { apiService, utils } from '../../../lib/api'
import { useRouter } from 'next/navigation'
import LoadingOverlay from '../../../components/LoadingOverlay'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busyMessage, setBusyMessage] = useState('')
  const [mounted, setMounted] = useState(false)
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Lightweight tilt interaction
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      const rx = (py - 0.5) * 6 // rotateX
      const ry = (0.5 - px) * 6 // rotateY
      setTilt({ x: rx, y: ry })
    }
    const onLeave = () => setTilt({ x: 0, y: 0 })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const withBusy = async (fn, message = 'Authenticating...') => {
    try {
      setError('')
      setBusyMessage(message)
      return await fn()
    } finally {
      setBusyMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await withBusy(async () => {
      try {
        // Try admin-specific login, fallback to auth login
        let res
        try {
          res = await apiService.adminLogin({ username, password })
        } catch (err) {
          res = await apiService.login({ username, password })
        }
        if (res?.token) {
          localStorage.setItem('adminToken', res.token)
          localStorage.setItem('adminAuth', 'true')
          router.replace('/admin/dashboard')
        } else {
          setError('Login gagal')
        }
      } catch (err) {
        setError(utils.formatApiError(err))
      }
    })
  }

  const cardStyle = useMemo(() => ({
    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
    transition: busyMessage ? 'transform 0.2s ease' : 'transform 120ms ease-out',
  }), [tilt, busyMessage])

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-cyan-600/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-fuchsia-600/10 blur-3xl animate-pulse" />
      </div>

      <LoadingOverlay show={!!busyMessage} message={busyMessage} />

      <div
        ref={cardRef}
        style={cardStyle}
        className={`relative z-10 w-full max-w-md mx-4 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'} transition-all duration-500`}
      >
        <div className="bg-slate-900/70 backdrop-blur rounded-2xl border border-slate-800 shadow-xl shadow-cyan-500/10">
          <div className="px-8 pt-8 pb-4 text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow shadow-cyan-500/30">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
            <p className="text-sm text-slate-400 mt-1">Masuk untuk mengelola SMOCCE 2025</p>
          </div>

          {error && (
            <div className="mx-8 mb-3 p-3 rounded-md text-sm bg-rose-500/10 border border-rose-700 text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                placeholder="Masukkan password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={!!busyMessage}
              className="group relative inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-600 px-4 py-2.5 font-medium text-white transition hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed shadow shadow-cyan-500/20"
            >
              <span className="absolute inset-0 -z-10 rounded-md bg-cyan-500/0 group-hover:bg-cyan-500/10 transition" />
              {busyMessage ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
