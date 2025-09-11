'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CandidateCard from '../../components/CandidateCard'
import { apiService, utils } from '../../lib/api'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [ketuaId, setKetuaId] = useState(null)
  const [pjId, setPjId] = useState(null)
  const [electionStatus, setElectionStatus] = useState(null)
  const [userVoteStatus, setUserVoteStatus] = useState(null)
  const [candidates, setCandidates] = useState({ ketua: [], pj: {} })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [now, setNow] = useState(new Date())
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 })
  const targetTiltRef = useRef({ rx: 0, ry: 0, s: 1 })
  const rafRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [finePointer, setFinePointer] = useState(true)
  const MAX_ANGLE = 3.5
  const SCALE_ACTIVE = 1.003
  const mountNowRef = useRef(new Date())

  useEffect(() => {
    const saved = localStorage.getItem('user')
    if (!saved) {
      router.push('/login')
    } else {
      const userData = JSON.parse(saved)
      setUser(userData)
      fetchElectionData(userData.nisn)
    }
  }, [router])

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      setFinePointer(window.matchMedia('(pointer: fine)').matches)
    } catch {}
  }, [])

  const formatFullDate = (d) =>
    d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  const formatTime = (d) =>
    d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  const toParts = (ms) => {
    const clamp = Math.max(0, ms)
    const d = Math.floor(clamp / (24 * 3600e3))
    const h = Math.floor((clamp % (24 * 3600e3)) / 3600e3)
    const m = Math.floor((clamp % 3600e3) / 60e3)
    const s = Math.floor((clamp % 60e3) / 1e3)
    return { d, h, m, s }
  }
  const pad = (n) => String(n).padStart(2, '0')

  const fetchElectionData = async (nisn) => {
    try {
      setLoading(true)
      setError(null)

      const isApiAvailable = await utils.isApiAvailable()
      if (!isApiAvailable) throw new Error('Server tidak dapat dijangkau. Silakan coba lagi nanti.')

      const candidatesData = await apiService.getCandidates()
      setCandidates(candidatesData)

      const statusData = await apiService.getVoteStatus()
      setElectionStatus(statusData)

      const userStatusResponse = await fetch(`${utils.getApiUrl()}/api/vote/user-status/${nisn}`)
      if (!userStatusResponse.ok) throw new Error('Gagal mengambil status vote user')
      const userStatusData = await userStatusResponse.json()
      setUserVoteStatus(userStatusData)

    } catch (error) {
      console.error('Error fetching election data:', error)
      setError(utils.formatApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handlePJSubmit = async () => {
    if (!pjId) return
    try {
      const res = await fetch(`${utils.getApiUrl()}/api/vote/pj`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn: user.nisn, pjId })
      })
      const data = await res.json()
      if (res.ok) {
        alert('Vote PJ berhasil disimpan!')
        fetchElectionData(user.nisn)
      } else {
        alert(data.message || 'Gagal menyimpan vote PJ')
      }
    } catch (error) {
      console.error('Error submitting PJ vote:', error)
      alert(utils.formatApiError(error))
    }
  }

  const handleKetuaSubmit = async () => {
    if (!ketuaId) return
    try {
      const res = await fetch(`${utils.getApiUrl()}/api/vote/ketua`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn: user.nisn, ketuaId })
      })
      const data = await res.json()
      if (res.ok) {
        alert('Vote Ketua berhasil disimpan!')
        localStorage.removeItem('user')
        router.push('/thanks')
      } else {
        alert(data.message || 'Gagal menyimpan vote Ketua')
      }
    } catch (error) {
      console.error('Error submitting Ketua vote:', error)
      alert(utils.formatApiError(error))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

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
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const midX = rect.width / 2
    const midY = rect.height / 2
    const dx = (x - midX) / midX
    const dy = (y - midY) / midY
    const dist = Math.min(1, Math.sqrt(dx*dx + dy*dy))
    const atten = 0.6 + 0.4 * dist
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

  const RoboticShell = ({ children }) => (
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] text-cyan-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 opacity-100">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(18,219,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(18,219,255,0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px, 48px 48px',
            backgroundPosition: '-1px -1px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,rgba(0,255,255,0.08),transparent_60%)]" />
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-16 top-24 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)] animate-float" />
        <div className="absolute right-24 top-40 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_2px_rgba(232,121,249,0.6)] animate-float [animation-delay:400ms]" />
        <div className="absolute left-1/3 bottom-24 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)] animate-float [animation-delay:800ms]" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-cyan-500/10 bg-black/20 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(16,185,129,0.6)]" />
            <div>
              <h1 className="text-xl font-bold tracking-wide"><span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">SMOCCE 2025</span></h1>
              <p className="text-[11px] text-cyan-300/60">Sistem Pemilihan Ketua SOC & PJ Bidang</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm text-cyan-100">{formatTime(now)} WIB</div>
            <div className="text-[11px] text-cyan-300/70">{formatFullDate(now)}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
        {children}
      </div>

      <style jsx>{`
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  )

  if (!user || loading) {
    return (
      <RoboticShell>
        <div className="flex items-center justify-center py-24">
          <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-black/30 p-8">
            <div className="mx-auto flex max-w-sm items-center gap-4">
              <div className="relative h-16 w-24 rounded-md border border-cyan-400/30 bg-gradient-to-b from-cyan-500/10 to-black/40">
                <div className="absolute inset-x-2 top-1/2 h-8 -translate-y-1/2 rounded-sm bg-cyan-400/20 shadow-[0_0_12px_2px_rgba(34,211,238,0.35)] animate-pulse" />
              </div>
              <div>
                <p className="text-base font-medium text-cyan-100">Memuat data pemilihan…</p>
                <p className="text-sm text-cyan-300/60">Menyambungkan ke server</p>
              </div>
            </div>
          </div>
        </div>
      </RoboticShell>
    )
  }

  const bidangCandidates = candidates.pj[user.bidang] || []
  const finished = !!(userVoteStatus?.vote?.pjCompleted && userVoteStatus?.vote?.ketuaCompleted)

  // Helper for ring
  const Ring = ({ percent = 0, color = '#22d3ee', size = 88, stroke = 8, children }) => {
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

  // Tidak ada periode aktif
  if (electionStatus && !electionStatus.active) {
    const next = electionStatus.nextPeriod?.config
    const start = next ? new Date(next.startDate) : null
    const untilStartMs = start ? start - now : 0
    const parts = toParts(untilStartMs)

    // Progress to start based on time since page open
    const mount = mountNowRef.current
    const totalStart = start && start > mount ? start - mount : 0
    const elapsedStart = start && start > mount ? now - mount : 0
    const percentStart = totalStart ? Math.min(1, Math.max(0, elapsedStart / totalStart)) : 0

    return (
      <RoboticShell>
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ perspective: '1200px' }} className="group">
          <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/5 to-cyan-600/5 p-6 shadow-2xl backdrop-blur-xl" style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`, transformStyle: 'preserve-3d', transition: 'transform 120ms ease' }}>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-cyan-200/80 text-sm">Status Sistem</div>
              <button onClick={handleLogout} className="rounded-md border border-cyan-500/30 bg-black/40 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-500/10">Logout</button>
            </div>

            {next ? (
              <div>
                <h2 className="text-xl font-bold text-cyan-100">Periode Pemilihan Belum Dimulai</h2>
                <p className="mt-1 text-cyan-300/70">Periode berikutnya: <span className="font-medium">{next.name}</span></p>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4 flex items-center gap-4">
                    <Ring percent={percentStart} color="#22d3ee">
                      <text x="50%" y="52%" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">{Math.round(percentStart*100)}%</text>
                    </Ring>
                    <div>
                      <div className="text-[11px] text-cyan-300/60">Mulai dalam</div>
                      <div className="font-mono text-cyan-100 text-sm">{parts.d}h {pad(parts.h)}j {pad(parts.m)}m {pad(parts.s)}d</div>
                      <div className="text-[11px] text-cyan-300/70">{formatFullDate(start)}</div>
                    </div>
                  </div>
                  <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                    <div className="text-[11px] text-cyan-300/60">Informasi Pemilih</div>
                    <div className="text-sm text-cyan-200/90">NISN: <span className="font-mono">{user.nisn}</span></div>
                    <div className="text-sm text-cyan-200/90">Bidang: <span className="text-fuchsia-300 font-medium">{user.bidang}</span></div>
                  </div>
                  <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                    <div className="text-[11px] text-cyan-300/60">Waktu Saat Ini</div>
                    <div className="text-cyan-100">{formatTime(now)} WIB</div>
                    <div className="text-[11px] text-cyan-300/70">{formatFullDate(now)}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-amber-200">Periode Pemilihan Telah Berakhir</h2>
                {finished ? (
                  <p className="mt-1 text-cyan-300/80">Anda telah menyelesaikan pemilihan. Terima kasih atas partisipasinya.</p>
                ) : (
                  <p className="mt-1 text-amber-300/90">Anda telah melewatkan pemilihan dan tidak dapat melakukan pemilihan lagi.</p>
                )}
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                    <div className="text-[11px] text-cyan-300/60">Informasi Pemilih</div>
                    <div className="text-sm text-cyan-200/90">NISN: <span className="font-mono">{user.nisn}</span></div>
                    <div className="text-sm text-cyan-200/90">Bidang: <span className="text-fuchsia-300 font-medium">{user.bidang}</span></div>
                  </div>
                  <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                    <div className="text-[11px] text-cyan-300/60">Waktu Saat Ini</div>
                    <div className="text-cyan-100">{formatTime(now)} WIB</div>
                    <div className="text-[11px] text-cyan-300/70">{formatFullDate(now)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-cyan-300 hover:text-cyan-200">Kembali ke Beranda</Link>
        </div>
      </RoboticShell>
    )
  }

  // Periode PJ aktif
  if (electionStatus && electionStatus.active && electionStatus.period === 'PJ') {
    const cfg = electionStatus.config || {}
    const start = cfg.startDate ? new Date(cfg.startDate) : null
    const end = cfg.endDate ? new Date(cfg.endDate) : null
    const remainingMs = end ? end - now : 0
    const parts = toParts(remainingMs)
    const total = start && end ? end - start : 0
    const elapsed = start ? now - start : 0
    const percent = total ? Math.min(1, Math.max(0, elapsed / total)) : 0

    return (
      <RoboticShell>
        {/* Info Card */}
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="group" style={{ perspective: '1200px' }}>
          <div className="relative mb-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/5 to-cyan-600/5 p-6 shadow-2xl backdrop-blur-xl" style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`, transformStyle: 'preserve-3d', transition: 'transform 120ms ease' }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-cyan-100">Pemilihan PJ Bidang {user.bidang}</h2>
                <p className="text-sm text-cyan-300/70">NISN: <span className="font-mono">{user.nisn}</span></p>
              </div>
              <button onClick={handleLogout} className="rounded-md border border-cyan-500/30 bg-black/40 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-500/10">Logout</button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4 flex items-center gap-4">
                <Ring percent={percent} color="#22d3ee">
                  <text x="50%" y="52%" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">{Math.round(percent*100)}%</text>
                </Ring>
                <div>
                  <div className="text-[11px] text-cyan-300/60">Berjalan</div>
                  <div className="text-sm text-cyan-100">Progress menuju selesai</div>
                  <div className="text-[11px] text-cyan-300/70">Selesai: {formatFullDate(end)}</div>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4 flex items-center gap-4">
                <Ring percent={Math.max(0, Math.min(1, 1 - (remainingMs / (total || 1))))} color="#a78bfa">
                  <text x="50%" y="52%" textAnchor="middle" fill="#ddd6fe" fontSize="10" fontFamily="monospace">{pad(parts.h)}:{pad(parts.m)}:{pad(parts.s)}</text>
                </Ring>
                <div>
                  <div className="text-[11px] text-cyan-300/60">Berakhir dalam</div>
                  <div className="font-mono text-cyan-100 text-sm">{parts.d}h {pad(parts.h)}j {pad(parts.m)}m {pad(parts.s)}d</div>
                  <div className="text-[11px] text-cyan-300/70">{formatTime(now)} WIB</div>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                <div className="text-[11px] text-cyan-300/60">Waktu Mulai</div>
                <div className="text-sm text-cyan-100">{formatFullDate(start)}</div>
                <div className="text-[11px] text-cyan-300/70">{start && new Date(start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
              </div>
            </div>

            {/* Status */}
            {userVoteStatus?.vote.pjCompleted && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-3 text-emerald-100">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-sm font-semibold">Anda Sudah Memilih PJ Bidang</div>
                    <div className="text-xs text-emerald-200/80">Waktu: {new Date(userVoteStatus.vote.pjVotedAt).toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selection */}
        {!userVoteStatus?.vote.pjCompleted && (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-cyan-100">🎯 Pilih PJ Bidang {user.bidang}</h3>
              <p className="text-cyan-300/70">Pilih satu kandidat untuk memimpin bidang {user.bidang}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {bidangCandidates.map((pj) => (
                <CandidateCard
                  key={pj.candidateId}
                  name={pj.name}
                  photo={pj.photo}
                  vision={pj.vision}
                  mission={pj.mission}
                  experience={pj.experience}
                  selected={pjId === pj.candidateId}
                  onSelect={() => setPjId(pj.candidateId)}
                />
              ))}
            </div>
            {pjId && (
              <div className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-cyan-100 mb-3">✅ Konfirmasi Pilihan PJ</h4>
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 mb-4 text-indigo-100">
                    <div className="text-sm">PJ {user.bidang} Pilihan Anda:</div>
                    <div className="font-medium">{bidangCandidates.find(p => p.candidateId === pjId)?.name}</div>
                  </div>
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-5 text-yellow-100">
                    <div className="text-sm">⚠️ Setelah submit, pilihan PJ Anda tidak dapat diubah.</div>
                  </div>
                  <button onClick={handlePJSubmit} className="rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">🗳️ Submit Pilihan PJ</button>
                </div>
              </div>
            )}
          </>
        )}
      </RoboticShell>
    )
  }

  // Periode Ketua aktif
  if (electionStatus && electionStatus.active && electionStatus.period === 'KETUA') {
    const cfg = electionStatus.config || {}
    const start = cfg.startDate ? new Date(cfg.startDate) : null
    const end = cfg.endDate ? new Date(cfg.endDate) : null
    const remainingMs = end ? end - now : 0
    const parts = toParts(remainingMs)
    const total = start && end ? end - start : 0
    const elapsed = start ? now - start : 0
    const percent = total ? Math.min(1, Math.max(0, elapsed / total)) : 0

    const needsPJFirst = !userVoteStatus?.vote?.pjCompleted

    return (
      <RoboticShell>
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="group" style={{ perspective: '1200px' }}>
          <div className="relative mb-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/5 to-cyan-600/5 p-6 shadow-2xl backdrop-blur-xl" style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`, transformStyle: 'preserve-3d', transition: 'transform 120ms ease' }}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-cyan-100">Pemilihan Ketua SOC</h2>
                <p className="text-sm text-cyan-300/70">NISN: <span className="font-mono">{user.nisn}</span> • Bidang: <span className="text-fuchsia-300 font-medium">{user.bidang}</span></p>
              </div>
              <button onClick={handleLogout} className="rounded-md border border-cyan-500/30 bg-black/40 px-3 py-1.5 text-xs font-medium text-cyan-100 transition hover:bg-cyan-500/10">Logout</button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4 flex items-center gap-4">
                <Ring percent={percent} color="#22d3ee">
                  <text x="50%" y="52%" textAnchor="middle" fill="#a5f3fc" fontSize="10" fontFamily="monospace">{Math.round(percent*100)}%</text>
                </Ring>
                <div>
                  <div className="text-[11px] text-cyan-300/60">Berjalan</div>
                  <div className="text-sm text-cyan-100">Progress menuju selesai</div>
                  <div className="text-[11px] text-cyan-300/70">Selesai: {formatFullDate(end)}</div>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4 flex items-center gap-4">
                <Ring percent={Math.max(0, Math.min(1, 1 - (remainingMs / (total || 1))))} color="#a78bfa">
                  <text x="50%" y="52%" textAnchor="middle" fill="#ddd6fe" fontSize="10" fontFamily="monospace">{pad(parts.h)}:{pad(parts.m)}:{pad(parts.s)}</text>
                </Ring>
                <div>
                  <div className="text-[11px] text-cyan-300/60">Berakhir dalam</div>
                  <div className="font-mono text-cyan-100 text-sm">{parts.d}h {pad(parts.h)}j {pad(parts.m)}m {pad(parts.s)}d</div>
                  <div className="text-[11px] text-cyan-300/70">{formatTime(now)} WIB</div>
                </div>
              </div>
              <div className="rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                <div className="text-[11px] text-cyan-300/60">Waktu Mulai</div>
                <div className="text-sm text-cyan-100">{formatFullDate(start)}</div>
                <div className="text-[11px] text-cyan-300/70">{start && new Date(start).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</div>
              </div>
            </div>

            {needsPJFirst && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-100">
                <div className="text-sm font-semibold">Lengkapi pemilihan PJ terlebih dahulu</div>
                <div className="text-xs text-amber-200/80">Anda belum memilih PJ Bidang. Silakan kembali saat periode PJ aktif untuk memilih PJ.</div>
              </div>
            )}

            {userVoteStatus?.vote.ketuaCompleted && (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
                <div className="text-sm font-semibold">Anda Sudah Menyelesaikan Pemilihan</div>
                <div className="text-xs text-emerald-200/80">Waktu: {new Date(userVoteStatus.vote.ketuaVotedAt).toLocaleString('id-ID')}</div>
              </div>
            )}
          </div>
        </div>

        {!needsPJFirst && !userVoteStatus?.vote.ketuaCompleted && (
          <>
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-cyan-100">👑 Pilih Ketua SOC</h3>
              <p className="text-cyan-300/70">Pilih satu kandidat untuk memimpin SMOCCE</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {candidates.ketua.map((k) => (
                <CandidateCard
                  key={k.candidateId}
                  name={k.name}
                  photo={k.photo}
                  vision={k.vision}
                  mission={k.mission}
                  experience={k.experience}
                  selected={ketuaId === k.candidateId}
                  onSelect={() => setKetuaId(k.candidateId)}
                />
              ))}
            </div>
            {ketuaId && (
              <div className="rounded-2xl border border-cyan-500/20 bg-black/30 p-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-cyan-100 mb-3">✅ Konfirmasi Pilihan Ketua</h4>
                  <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 mb-4 text-blue-100">
                    <div className="text-sm">Ketua SOC Pilihan Anda:</div>
                    <div className="font-medium">{candidates.ketua.find(k => k.candidateId === ketuaId)?.name}</div>
                  </div>
                  <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-5 text-yellow-100">
                    <div className="text-sm">⚠️ Setelah submit, pilihan Ketua Anda tidak dapat diubah.</div>
                  </div>
                  <button onClick={handleKetuaSubmit} className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:scale-105">🗳️ Submit Pilihan Ketua</button>
                </div>
              </div>
            )}
          </>
        )}
      </RoboticShell>
    )
  }

  return null
}
