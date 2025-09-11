"use client"
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { apiService } from '../lib/api'

export default function Home() {
  const [status, setStatus] = useState(null)
  const [now, setNow] = useState(new Date())
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 })
  const targetTiltRef = useRef({ rx: 0, ry: 0, s: 1 })
  const rafRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [finePointer, setFinePointer] = useState(true)
  const MAX_ANGLE = 4
  const SCALE_ACTIVE = 1.004

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
        setFinePointer(window.matchMedia('(pointer: fine)').matches)
      } catch {}
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const s = await apiService.getVoteStatus()
        if (mounted) setStatus(s)
      } catch (e) {
        // non-fatal, keep null
      }
    }
    load()
    const id = setInterval(load, 15000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  const toParts = (ms) => {
    const clamp = Math.max(0, ms)
    const d = Math.floor(clamp / (24 * 3600e3))
    const h = Math.floor((clamp % (24 * 3600e3)) / 3600e3)
    const m = Math.floor((clamp % 3600e3) / 60e3)
    const s = Math.floor((clamp % 60e3) / 1e3)
    return { d, h, m, s }
  }
  const pad = (n) => String(n).padStart(2, '0')
  const fDate = (d) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', year:'numeric', month:'long', day:'numeric' }) : '-'
  const fTimeHM = (d) => d ? new Date(d).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' }) : '-'

  const startRaf = () => {
    if (rafRef.current) return
    const loop = () => {
      setTilt((prev) => {
        const t = targetTiltRef.current
        const rx = prev.rx + (t.rx - prev.rx) * 0.12
        const ry = prev.ry + (t.ry - prev.ry) * 0.12
        const s = prev.s + (t.s - prev.s) * 0.08
        const done = Math.abs(rx - t.rx) < 0.01 && Math.abs(ry - t.ry) < 0.01 && Math.abs(s - t.s) < 0.002
        if (done && t.rx === 0 && t.ry === 0 && Math.abs(t.s - 1) < 0.001) {
          if (rafRef.current) cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }
        return { rx, ry, s }
      })
      if (rafRef.current !== null) rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }
  const onMouseMove = (e) => {
    if (reducedMotion || !finePointer) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left, y = e.clientY - rect.top
    const midX = rect.width/2, midY = rect.height/2
    const dx = (x - midX)/midX, dy = (y - midY)/midY
    const dist = Math.min(1, Math.sqrt(dx*dx + dy*dy))
    const atten = 0.55 + 0.45 * dist
    const ry = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, -(dx) * MAX_ANGLE * atten))
    const rx = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, (dy) * MAX_ANGLE * atten))
    targetTiltRef.current = { rx, ry, s: SCALE_ACTIVE }
    startRaf()
  }
  const onMouseLeave = () => {
    if (reducedMotion) return
    targetTiltRef.current = { rx: 0, ry: 0, s: 1 }
    startRaf()
  }

  // Ring component
  const Ring = ({ percent = 0, color = '#22d3ee', size = 96, stroke = 8, children }) => {
    const r = (size - stroke) / 2
    const c = 2 * Math.PI * r
    const p = Math.max(0, Math.min(1, percent))
    const dash = c * p
    const gap = c - dash
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size/2} cy={size/2} r={r} stroke="#0b1224" strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} strokeLinecap="round" fill="none" strokeDasharray={`${dash} ${gap}`} transform={`rotate(-90 ${size/2} ${size/2})`} />
        {children}
      </svg>
    )
  }

  // Derive schedule cards
  const active = status?.active
  const period = status?.period
  const pj = status?.allPeriods?.PJ || (status?.period === 'PJ' ? status?.config : (status?.nextPeriod?.period === 'PJ' ? status?.nextPeriod?.config : null))
  const ketua = status?.allPeriods?.KETUA || (status?.period === 'KETUA' ? status?.config : (status?.nextPeriod?.period === 'KETUA' ? status?.nextPeriod?.config : null))

  const nextTarget = active
    ? (status?.config?.endDate ? new Date(status.config.endDate) : null)
    : (status?.nextPeriod?.config?.startDate ? new Date(status.nextPeriod.config.startDate) : null)
  const untilMs = nextTarget ? nextTarget - now : 0
  const parts = toParts(untilMs)
  const totalMs = active && status?.config?.startDate && status?.config?.endDate
    ? new Date(status.config.endDate) - new Date(status.config.startDate)
    : 0
  const elapsedMs = active && status?.config?.startDate
    ? now - new Date(status.config.startDate)
    : 0
  const progress = totalMs ? Math.max(0, Math.min(1, elapsedMs / totalMs)) : 0

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] text-cyan-50">
      {/* Background grid + glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(18,219,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(18,219,255,0.05) 1px, transparent 1px)',
          backgroundSize: '48px 48px, 48px 48px', backgroundPosition: '-1px -1px'
        }} />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,rgba(0,255,255,0.08),transparent_60%)]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-cyan-500/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)]" />
            <div>
              <h1 className="text-xl font-bold tracking-wide"><span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">SMOCCE 2025</span></h1>
              <p className="text-[11px] text-cyan-300/60">Sistem Pemilihan Ketua SOC & PJ Bidang</p>
            </div>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/login" className="rounded-md border border-cyan-500/30 bg-black/40 px-3 py-1.5 text-cyan-100 hover:bg-cyan-500/10">Login Pemilih</Link>
            <Link href="/check-token" className="rounded-md border border-emerald-500/30 bg-black/40 px-3 py-1.5 text-emerald-100 hover:bg-emerald-500/10">Cek Token</Link>
            <Link href="/admin/login" className="rounded-md border border-slate-500/30 bg-black/40 px-3 py-1.5 text-slate-100 hover:bg-slate-500/10">Admin</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-10">
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="group" style={{ perspective: '1200px' }}>
          <div className="relative overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/5 to-cyan-600/5 p-8 shadow-2xl backdrop-blur-xl" style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`, transformStyle: 'preserve-3d', transition: 'transform 120ms ease' }}>
            <div className="grid gap-6 md:grid-cols-[1.2fr,1fr]">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-cyan-50">Selamat Datang di Pemilihan SMOCCE 2025</h2>
                <p className="mt-2 text-cyan-200/80">Pilih PJ Bidang lebih dulu, lalu Ketua SOC. Sistem dibuat aman, adil, dan real-time.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/login" className="rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02]">🗳️ Mulai Memilih</Link>
                  <Link href="/check-token" className="rounded-xl border border-cyan-500/40 bg-black/30 px-5 py-3 font-semibold text-cyan-100 transition hover:bg-cyan-500/10">🔍 Cek Token</Link>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="flex items-center gap-4 rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                  <Ring percent={active ? progress : 0} color={active ? '#22d3ee' : '#a78bfa'}>
                    <text x="50%" y="52%" textAnchor="middle" fill="#a5f3fc" fontSize="12" fontFamily="monospace">{active ? `${Math.round(progress*100)}%` : 'Ready'}</text>
                  </Ring>
                  <div>
                    <div className="text-[11px] text-cyan-300/60">{active ? 'Berakhir dalam' : 'Mulai dalam'}</div>
                    <div className="font-mono text-cyan-100 text-lg">{parts.d}h {pad(parts.h)}j {pad(parts.m)}m {pad(parts.s)}d</div>
                    <div className="text-[11px] text-cyan-300/70">
                      {active ? `Periode aktif: ${period === 'PJ' ? 'Pemilihan PJ Bidang' : period === 'KETUA' ? 'Pemilihan Ketua SOC' : ''}` :
                        (status?.nextPeriod?.period ? `Periode berikutnya: ${status.nextPeriod.period === 'PJ' ? 'Pemilihan PJ Bidang' : 'Pemilihan Ketua SOC'}` : 'Tidak ada periode berikutnya')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* floating accents */}
            <div className="pointer-events-none">
              <div className="absolute right-6 top-6 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_2px_rgba(34,211,238,0.6)] animate-float" />
              <div className="absolute left-10 bottom-8 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_2px_rgba(232,121,249,0.6)] animate-float [animation-delay:600ms]" />
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-10">
        <h3 className="text-2xl font-bold text-cyan-50 mb-6">📅 Jadwal Pemilihan (Sinkron Admin)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-10 w-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">🎯</div>
              <div>
                <div className="text-lg font-semibold text-indigo-100">Pemilihan PJ Bidang</div>
                <div className="text-indigo-300/80 text-sm">Tahap Pertama</div>
              </div>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-indigo-100/90">
              <div className="text-indigo-300/80 text-sm">Mulai</div>
              <div className="font-mono">{fDate(pj?.startDate)} • {fTimeHM(pj?.startDate)} WIB</div>
              <div className="text-indigo-300/80 text-sm">Selesai</div>
              <div className="font-mono">{fDate(pj?.endDate)} • {fTimeHM(pj?.endDate)} WIB</div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-6">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center">👑</div>
              <div>
                <div className="text-lg font-semibold text-blue-100">Pemilihan Ketua SOC</div>
                <div className="text-blue-300/80 text-sm">Tahap Kedua</div>
              </div>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-blue-100/90">
              <div className="text-blue-300/80 text-sm">Mulai</div>
              <div className="font-mono">{fDate(ketua?.startDate)} • {fTimeHM(ketua?.startDate)} WIB</div>
              <div className="text-blue-300/80 text-sm">Selesai</div>
              <div className="font-mono">{fDate(ketua?.endDate)} • {fTimeHM(ketua?.endDate)} WIB</div>
            </div>
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-10">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-lg font-semibold text-amber-100 mb-2">📋 Alur Pemilihan</div>
              <ul className="text-amber-100/90 text-sm space-y-1">
                <li>• Login menggunakan NISN dan Token</li>
                <li>• Pilih PJ Bidang terlebih dahulu</li>
                <li>• Setelah PJ selesai, lanjutkan pilih Ketua SOC</li>
                <li>• Pilihan terkunci setelah submit</li>
              </ul>
            </div>
            <div>
              <div className="text-lg font-semibold text-amber-100 mb-2">🔐 Keamanan</div>
              <ul className="text-amber-100/90 text-sm space-y-1">
                <li>• Token unik untuk setiap pemilih</li>
                <li>• Sistem logout otomatis setelah vote</li>
                <li>• Data vote tersimpan aman</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-7xl px-4 pb-10 text-cyan-300/70 text-xs">
        SMOCCE 2025 • SMANESI Olympiad Club Election System
      </footer>

      <style jsx>{`
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
