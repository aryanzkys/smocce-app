'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
// Using native <img> to guarantee compatibility on Netlify for local assets
import gsap from 'gsap'
import GalaxyBackground from './_shared/GalaxyBackground'

// Target time: 19 September 2025 00:00:00 WIB (UTC+7)
const TARGET_ISO = '2025-09-19T00:00:00+07:00'

function useCountdown(targetIso) {
  const target = useMemo(() => new Date(targetIso).getTime(), [targetIso])
  const [state, setState] = useState(() => calcDiff(target))

  useEffect(() => {
    const id = setInterval(() => setState(calcDiff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return state
}

function calcDiff(targetMs) {
  const now = Date.now()
  let diff = Math.max(0, targetMs - now)
  const completed = diff === 0
  const days = Math.floor(diff / (24 * 60 * 60 * 1000))
  diff -= days * 24 * 60 * 60 * 1000
  const hours = Math.floor(diff / (60 * 60 * 1000))
  diff -= hours * 60 * 60 * 1000
  const minutes = Math.floor(diff / (60 * 1000))
  diff -= minutes * 60 * 1000
  const seconds = Math.floor(diff / 1000)
  return { days, hours, minutes, seconds, completed }
}

// Tech background replaced by GalaxyBackground component

function FlipCard({ value, label }) {
  const [display, setDisplay] = useState(value)
  const ref = useRef(null)
  const prev = useRef(value)

  useEffect(() => {
    if (value === prev.current) return
    const el = ref.current
    if (!el) { prev.current = value; setDisplay(value); return }
    const tl = gsap.timeline({ defaults: { duration: 0.22, ease: 'power2.inOut' } })
    tl.set(el, { transformPerspective: 600 })
      .to(el, { rotateX: -88, opacity: 0.8, filter: 'brightness(1.2)' })
      .add(() => setDisplay(value))
      .to(el, { rotateX: 0, opacity: 1, filter: 'brightness(1)' })
    prev.current = value
    return () => tl.kill()
  }, [value])

  const two = (n) => String(n).padStart(2, '0')

  return (
    <div className="flex flex-col items-center">
      <div
        ref={ref}
        className="relative w-24 h-28 md:w-28 md:h-32 rounded-xl overflow-hidden bg-slate-900/60 border border-cyan-400/40 shadow-[0_0_30px_rgba(0,229,255,0.25)] backdrop-blur-md"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-bold tracking-wider select-none"
             style={{ color: '#E6FFFB', textShadow: '0 0 8px rgba(0,229,255,0.65)' }}>
          {two(display)}
        </div>
        <div className="absolute inset-x-0 top-1 h-1/2 bg-gradient-to-b from-cyan-300/15 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-1 h-1/2 bg-gradient-to-t from-fuchsia-400/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 ring-1 ring-cyan-300/20 rounded-xl" />
      </div>
      <span className="mt-2 text-cyan-200/90 text-xs md:text-sm uppercase tracking-[0.25em]">{label}</span>
    </div>
  )
}

function Countdown({ days, hours, minutes, seconds }) {
  return (
    <div className="flex items-center gap-3 md:gap-4">
      <FlipCard value={days} label="HARI" />
      <span className="text-cyan-300/70 text-3xl md:text-4xl -mt-6">:</span>
      <FlipCard value={hours} label="JAM" />
      <span className="text-cyan-300/70 text-3xl md:text-4xl -mt-6">:</span>
      <FlipCard value={minutes} label="MENIT" />
      <span className="text-cyan-300/70 text-3xl md:text-4xl -mt-6">:</span>
      <FlipCard value={seconds} label="DETIK" />
    </div>
  )
}

export default function AnnouncementPage() {
  const { days, hours, minutes, seconds, completed } = useCountdown(TARGET_ISO)
  // Multi-source logo fallback chain (local -> SVG/PNG -> Google Drive direct links -> default avatar)
  const DRIVE_ID = '1RXSDDt84hnJVaOxh-EiLSB6kIe5lw5P-'
  const logoSources = useMemo(() => [
    // Prefer Google Drive direct link first (as provided)
    `https://drive.google.com/uc?export=download&id=${DRIVE_ID}`,
    `https://drive.google.com/uc?id=${DRIVE_ID}&export=download`,
    `https://drive.usercontent.google.com/download?id=${DRIVE_ID}&export=download`,
    // Then local public assets
    '/smocce-logo.jpg?v=3',
    '/smocce-logo.png?v=3',
    '/smocce-logo.svg?v=3',
    // Fallback
    '/default-avatar.jpg?v=3'
  ], [])
  const [logoIdx, setLogoIdx] = useState(0)
  const logoSrc = logoSources[Math.min(logoIdx, logoSources.length - 1)]

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-[#030712]">
  {/* 3D galaxy background */}
  <div className="absolute inset-0 z-0 pointer-events-none">
        <GalaxyBackground />
      </div>

  {/* Subtle vignette (lightened to reveal galaxy) */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(12,30,60,0.10),transparent_65%),linear-gradient(to_bottom,rgba(10,25,47,0.35),rgba(3,7,18,0.6))]" />

      {/* Content */}
  <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 py-10 md:py-16">
        <header className="mb-10 md:mb-14 text-center">
          {/* Neon circular logo */}
          <div className="group relative mx-auto mb-5 h-24 w-24 md:h-28 md:w-28 rounded-full transition-transform duration-300 hover:scale-105">
            {/* outer glow */}
            <div className="pointer-events-none absolute -inset-2 rounded-full opacity-50 group-hover:opacity-70 transition -z-10" aria-hidden
                 style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.25), transparent 60%)' }} />
            {/* inner frame */}
            <div className="absolute inset-0 rounded-full border border-cyan-300/40 bg-slate-900/50 backdrop-blur-md shadow-[0_0_35px_rgba(0,229,255,0.35)] -z-10" aria-hidden />
            {/* ring accent */}
            <div className="absolute inset-0 rounded-full ring-2 ring-cyan-300/30 group-hover:ring-cyan-200/60 transition -z-10" aria-hidden />
            <img
              src={logoSrc}
              alt="Logo SMANESI Olympiad Club"
              width={128}
              height={128}
              className="relative z-10 h-full w-full rounded-full object-contain bg-slate-900/40 select-none"
              draggable={false}
              crossOrigin="anonymous"
              onError={() => setLogoIdx((i) => i + 1)}
            />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight" style={{ color: '#E6FFFB', textShadow: '0 0 15px rgba(0,229,255,0.35)' }}>
            Pengumuman SMOCCE 2025
          </h1>
          <p className="mt-2 text-sm md:text-base text-cyan-100/80">
            Hitung mundur menuju pengumuman SMOCCE 2025 pada 19 September 2025
          </p>
        </header>

        <section aria-label="Countdown" className="mb-8 md:mb-12">
          <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
        </section>

        <div className="mb-14 flex items-center gap-3">
          <Link href={completed ? '/announcement/buka-pengumuman' : '#'}
                className={`group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm md:text-base font-semibold transition ${completed ? 'bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 shadow-[0_0_35px_rgba(0,229,255,0.35)]' : 'bg-slate-800/60 text-cyan-200/60 cursor-not-allowed border border-cyan-300/20'}`}
                aria-disabled={!completed}>
            {completed ? (
              <>
                <span className="i-mdi-rocket-launch" />
                Buka Pengumuman
              </>
            ) : (
              <>
                <span className="i-mdi-lock-outline" />
                Tungguinn yakk gaiss!
              </>
            )}
          </Link>
        </div>

        {/* Neon footer */}
        <footer className="mt-8 w-full">
          <div className="relative overflow-hidden rounded-xl border border-cyan-400/20 bg-slate-900/40 p-4 text-center">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(0,229,255,0.15),transparent_55%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
            <p className="relative text-cyan-100/90 text-xs md:text-sm tracking-wide select-none">
              © 2025 SMANESI Olympiad Club
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}
