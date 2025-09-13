'use client'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

// Simple, embeddable countdown widget suitable for Notion's Embed block
// Default target: 2025-09-19 00:00:00 (local). Override via ?date=2025-09-19T00:00:00+07:00
// Optional params: title, bg, fg, accent, hideTitle=1

const DEFAULT_TITLE = 'SMOCCE 2025 Announcement Countdown'
const DEFAULT_DATE = '2025-09-19T00:00:00+07:00' // WIB by default

const palette = {
  bg: '#0D1B2A',
  fg: '#F8F1E5',
  accent: '#FFD700',
  accentSoft: '#ffdf80',
  blue2: '#102A43',
}

function useCountdown(targetISO) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO])
  const diff = Math.max(0, target - now)
  const ended = diff <= 0
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { ended, diff, days, hours, minutes, seconds }
}

function pad2(v) {
  return String(v).padStart(2, '0')
}

function CountdownWidgetInner() {
  const params = useSearchParams()
  const title = params.get('title') || DEFAULT_TITLE
  const targetISO = params.get('date') || DEFAULT_DATE
  const bg = params.get('bg') || palette.bg
  const fg = params.get('fg') || palette.fg
  const accent = params.get('accent') || palette.accent
  const hideTitle = params.get('hideTitle') === '1'

  const { ended, days, hours, minutes, seconds } = useCountdown(targetISO)

  // Progress bar from today to target (caps at 100%)
  const [startTs] = useState(() => Date.now())
  const targetTs = useMemo(() => new Date(targetISO).getTime(), [targetISO])
  const elapsed = Math.max(0, Math.min(targetTs - startTs, Math.max(0, Date.now() - startTs)))
  const total = Math.max(1, targetTs - startTs)
  const pct = Math.round((elapsed / total) * 100)

  // Smooth digit swap: key the boxes by value
  const blocks = [
    { label: 'Days', value: String(days) },
    { label: 'Hours', value: pad2(hours) },
    { label: 'Minutes', value: pad2(minutes) },
    { label: 'Seconds', value: pad2(seconds) },
  ]

  return (
    <div
      className="w-full h-full"
      style={{
        background: `linear-gradient(135deg, ${bg} 0%, ${palette.blue2} 60%, ${bg} 100%)`,
        color: fg,
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
      }}
    >
      {/* soft glows */}
      <div style={{ position: 'relative', minHeight: 240 }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle, ${accent}22, transparent 60%)` }} />
          <div style={{ position: 'absolute', bottom: -40, right: -40, width: 220, height: 220, borderRadius: '50%', background: `radial-gradient(circle, ${palette.accentSoft}1f, transparent 60%)` }} />
        </div>

        <div className="px-4 py-4">
          {!hideTitle && (
            <div className="text-center mb-2">
              <h2 className="text-lg md:text-xl font-semibold tracking-wide" style={{ color: fg }}>
                {title}
              </h2>
              <p className="text-xs opacity-80">Official reveal on {new Date(targetISO).toLocaleString()}</p>
            </div>
          )}

          {/* Progress bar */}
          <div className="mx-auto max-w-2xl mb-4">
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: accent }}
              />
            </div>
            <div className="text-[10px] mt-1 text-center opacity-70">Counting down…</div>
          </div>

          {/* Countdown cards */}
          <div className="mx-auto max-w-3xl grid grid-cols-4 gap-2 md:gap-3">
            {blocks.map((b) => (
              <div key={b.label} className="group">
                <div
                  className="relative rounded-xl border backdrop-blur-sm transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{
                    borderColor: `${accent}55`,
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
                  }}
                >
                  <div className="p-3 md:p-4 flex items-center justify-center">
                    <div className="text-2xl md:text-4xl font-bold tabular-nums tracking-tight" style={{ color: accent }}>
                      {b.value}
                    </div>
                  </div>
                  <div className="text-center text-[10px] md:text-xs pb-2 md:pb-3 opacity-80">{b.label}</div>

                  {/* subtle accent line */}
                  <div className="absolute inset-x-6 -bottom-px h-px" style={{ background: `${accent}66` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Status banner */}
          <div className="text-center mt-3">
            {ended ? (
              <span className="inline-block text-xs md:text-sm px-3 py-1.5 rounded-full" style={{ background: '#16a34a22', color: '#86efac' }}>
                The announcement window has arrived. Stay tuned for the reveal!
              </span>
            ) : (
              <span className="inline-block text-[11px] md:text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#dbeafe' }}>
                Anticipation builds… {days}d {hours}h {minutes}m {seconds}s
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CountdownWidget() {
  return (
    <Suspense fallback={<div style={{ padding: 16, color: '#fff' }}>Loading countdown…</div>}>
      <CountdownWidgetInner />
    </Suspense>
  )
}
