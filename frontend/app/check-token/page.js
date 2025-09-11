"use client"
import { useState } from "react"
import Link from "next/link"

// Modern, interactive, 3D robotic UI for Check Token page
export default function CheckToken() {
  const [nisn, setNisn] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, s: 1 })
  const [copied, setCopied] = useState(false)
  const [pasted, setPasted] = useState(false)
  const [confetti, setConfetti] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!nisn.trim()) {
      setError("NISN harus diisi")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const res = await fetch("/api/auth/check-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nisn: nisn.trim() }),
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
        // trigger subtle confetti burst
        setConfetti(true)
        setTimeout(() => setConfetti(false), 1200)
      } else {
        setError(data.message || "Terjadi kesalahan")
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Gagal terhubung ke server")
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setNisn("")
    setResult(null)
    setError("")
    setCopied(false)
  }

  const handlePaste = async () => {
    try {
      const txt = await navigator.clipboard.readText()
      if (txt) {
        setNisn(txt.trim())
        setPasted(true)
        setTimeout(() => setPasted(false), 800)
      }
    } catch (e) {
      setError("Gagal mengakses clipboard")
      setTimeout(() => setError(""), 1400)
    }
  }

  const onMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const midX = rect.width / 2
    const midY = rect.height / 2
    const ry = Math.max(-12, Math.min(12, -((x - midX) / midX) * 12))
    const rx = Math.max(-12, Math.min(12, ((y - midY) / midY) * 12))
    setTilt({ rx, ry, s: 1.01 })
  }

  const onMouseLeave = () => setTilt({ rx: 0, ry: 0, s: 1 })

  const copyToken = async () => {
    if (!result?.token) return
    try {
      await navigator.clipboard.writeText(result.token)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  const electionStatus = result?.electionStatus || { ketua: result?.hasVoted || false, pj: result?.hasVoted || false }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070b16] text-cyan-50">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 opacity-100">
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(18, 219, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 219, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px, 48px 48px",
            backgroundPosition: "-1px -1px",
          }}
        />
        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_20%,rgba(0,255,255,0.08),transparent_60%)]" />
        {/* Glows */}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
      </div>

      {/* Floating orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-16 top-24 h-3 w-3 rounded-full bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.6)] animate-float" />
        <div className="absolute right-24 top-40 h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_2px_rgba(232,121,249,0.6)] animate-float [animation-delay:400ms]" />
        <div className="absolute left-1/3 bottom-24 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_2px_rgba(52,211,153,0.6)] animate-float [animation-delay:800ms]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-12">
        {/* Title */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <h1 className="relative z-10 text-4xl font-extrabold tracking-tight">
              <span className="relative">
                <span className="absolute left-0 top-0 -z-10 translate-x-1 translate-y-1 select-none text-cyan-600/30 blur-[1px]">
                  Cek Token
                </span>
                <span className="absolute left-0 top-0 -z-10 -translate-x-1 -translate-y-1 select-none text-fuchsia-600/30 blur-[1px]">
                  Cek Token
                </span>
                <span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
                  Cek Token
                </span>
              </span>
            </h1>
            <p className="mt-2 text-sm text-cyan-200/70">Masukkan NISN untuk melihat token Anda</p>
          </div>
        </div>

        {/* Card */}
        <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="group relative w-full" style={{ perspective: "1200px" }}>
          {/* glow border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-[conic-gradient(from_180deg_at_50%_50%,#22d3ee_0%,#a78bfa_25%,#22d3ee_50%,#a78bfa_75%,#22d3ee_100%)] opacity-30 blur-md transition-opacity duration-500 group-hover:opacity-60" />
          <div
            className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-white/5 to-cyan-600/5 p-6 shadow-2xl backdrop-blur-xl"
            style={{ transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.s})`, transformStyle: "preserve-3d", transition: "transform 120ms ease" }}
          >
            {/* Robo top bar */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_8px_2px_rgba(16,185,129,0.8)]" />
                <span className="h-2 w-2 rounded-full bg-yellow-400/90 shadow-[0_0_8px_2px_rgba(250,204,21,0.8)]" />
                <span className="h-2 w-2 rounded-full bg-rose-400/90 shadow-[0_0_8px_2px_rgba(251,113,133,0.8)]" />
              </div>
              <div className="text-[10px] tracking-widest text-cyan-300/60">SMOCCE • SECURE CONSOLE</div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite">
              <div className="space-y-2">
                <label htmlFor="nisn" className="block text-xs font-medium tracking-wide text-cyan-200/80">
                  NISN (Nomor Induk Siswa Nasional)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-0 rounded-lg border border-cyan-400/20 [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />
                  <input
                    type="text"
                    id="nisn"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className={`w-full rounded-lg border ${pasted ? 'ring-2 ring-emerald-400/60' : ''} border-cyan-500/30 bg-black/30 px-4 py-3 text-cyan-100 placeholder-cyan-300/40 outline-none transition focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/40`}
                    placeholder="Masukkan NISN Anda"
                    disabled={loading}
                    aria-label="NISN"
                    autoComplete="off"
                    inputMode="numeric"
                  />
                  {/* Paste action */}
                  <button
                    type="button"
                    onClick={handlePaste}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md border border-cyan-500/30 bg-black/40 px-2 py-1 text-[11px] font-medium text-cyan-100 transition hover:bg-cyan-500/10"
                    aria-label="Tempel dari clipboard"
                    title="Tempel dari clipboard"
                  >
                    Tempel
                  </button>
                  <div className="pointer-events-none absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                </div>
                <p className="text-[10px] text-cyan-300/50">Tekan Enter untuk submit • Data aman terenkripsi</p>
              </div>

              <button type="submit" disabled={loading} className="relative w-full select-none overflow-hidden rounded-lg bg-gradient-to-r from-cyan-600 to-fuchsia-600 px-4 py-3 font-semibold shadow-lg transition hover:brightness-110 disabled:from-cyan-700 disabled:to-fuchsia-700">
                <span className="relative z-10">{loading ? "Memindai…" : "Cek Token"}</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[2px] transition group-hover:translate-x-0" />
              </button>
            </form>

            {/* Loading: robotic scanner */}
            {loading && (
              <div className="mt-6 overflow-hidden rounded-xl border border-cyan-500/20 bg-black/30 p-4">
                <div className="mx-auto flex max-w-sm items-center gap-4">
                  <div className="relative h-14 w-20 rounded-md border border-cyan-400/30 bg-gradient-to-b from-cyan-500/10 to-black/40">
                    <div className="absolute inset-x-2 top-1/2 h-6 -translate-y-1/2 rounded-sm bg-cyan-400/20 shadow-[0_0_12px_2px_rgba(34,211,238,0.35)] animate-scan" />
                    <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(103,232,249,0.9)] animate-ping [animation-duration:2.2s]" />
                    <div className="absolute right-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-fuchsia-300 shadow-[0_0_8px_2px_rgba(240,171,252,0.9)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-cyan-100">Memindai database…</p>
                    <p className="text-xs text-cyan-300/60">
                      Mengambil data token untuk NISN: <span className="font-mono text-cyan-200/90">{nisn || "—"}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-rose-200">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shadow-[0_0_10px_2px_rgba(251,113,133,0.6)]" />
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="mt-6 space-y-4">
                <div className="relative overflow-hidden rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(16,185,129,0.12),transparent_60%)]" />
                  <h3 className="mb-2 text-sm font-semibold text-emerald-300/90">Informasi Token Anda</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-0.5">
                      <div className="text-emerald-300/70">NISN</div>
                      <div className="font-mono text-emerald-100">{result.nisn}</div>
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-emerald-300/70">Bidang</div>
                      <div className="font-mono text-emerald-100">{result.bidang}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="mb-1 flex items-center justify-between text-emerald-300/70">
                        <span>Token</span>
                        <button
                          type="button"
                          onClick={copyToken}
                          className="text-xs font-medium text-emerald-200/90 underline decoration-dotted underline-offset-4 hover:text-emerald-100"
                        >
                          {copied ? "Disalin ✓" : "Salin"}
                        </button>
                      </div>
                      <div className="relative select-all rounded-lg border border-emerald-400/30 bg-black/40 p-3">
                        <div className="pointer-events-none absolute inset-x-0 -top-1 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
                        <div className="relative z-10 font-mono text-lg tracking-wider text-emerald-200">{result.token}</div>
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(16,185,129,0.08),transparent)]" />
                      </div>
                    </div>
                    {/* Per-election status */}
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-cyan-500/20 bg-black/30 p-3">
                        <div className="mb-1 text-[11px] text-cyan-300/70">Status Pemilihan</div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${electionStatus.ketua ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <div>
                            <div className="text-sm font-medium text-cyan-100">Ketua</div>
                            <div className="text-xs text-cyan-300/60">{electionStatus.ketua ? 'Sudah memilih' : 'Belum memilih'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-lg border border-cyan-500/20 bg-black/30 p-3">
                        <div className="mb-1 text-[11px] text-cyan-300/70">Status Pemilihan</div>
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${electionStatus.pj ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          <div>
                            <div className="text-sm font-medium text-cyan-100">PJ</div>
                            <div className="text-xs text-cyan-300/60">{electionStatus.pj ? 'Sudah memilih' : 'Belum memilih'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-md bg-emerald-400/10 p-3 text-xs text-emerald-200/90">
                    <strong>Catatan:</strong> Simpan token ini dengan baik. Anda memerlukan NISN dan Token untuk login ke sistem voting.
                  </div>
                </div>

                <button onClick={handleReset} className="w-full rounded-lg border border-cyan-500/30 bg-black/30 px-4 py-2.5 font-medium text-cyan-100 transition hover:bg-cyan-500/10">
                  Cek NISN Lain
                </button>
              </div>
            )}

            {/* Confetti Burst */}
            {confetti && (
              <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
                <div className="confetti">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span key={i} className={`piece piece-${i + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 text-center text-sm">
          <Link href="/login" className="block font-medium text-cyan-300 hover:text-cyan-200">
            Login untuk Vote
          </Link>
          <Link href="/" className="mt-1 block text-cyan-300/70 hover:text-cyan-200/90">
            Kembali ke Beranda
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-6 w-full rounded-xl border border-yellow-400/20 bg-yellow-500/10 p-4">
          <h4 className="mb-1 text-xs font-semibold text-yellow-200">ℹ️ Informasi Penting</h4>
          <ul className="list-inside list-disc text-[11px] text-yellow-100/90">
            <li>Token diperlukan untuk login ke sistem voting</li>
            <li>Jika lupa token, gunakan fitur ini untuk mengeceknya</li>
            <li>Setiap siswa hanya bisa vote sekali</li>
            <li>Hubungi admin jika ada masalah dengan token</li>
          </ul>
        </div>
      </div>

      {/* Local animations */}
      <style jsx>{`
        @keyframes float { 0% { transform: translateY(0) } 50% { transform: translateY(-6px) } 100% { transform: translateY(0) } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        @keyframes scan { 0% { transform: translateY(-140%); } 100% { transform: translateY(140%); } }
        .animate-scan { animation: scan 1.4s linear infinite; }
        /* Confetti */
        .confetti { position: absolute; left: 0; right: 0; top: 10%; height: 0; }
        .piece { position: absolute; top: 0; width: 6px; height: 10px; opacity: 0; border-radius: 2px; animation: drop var(--t, 900ms) ease-out forwards; }
        .piece::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(255,255,255,0.5), transparent); mix-blend-mode: overlay; border-radius: 2px; }
        @keyframes drop { 0% { transform: translate3d(0,0,0) rotate(0); opacity: 0.9; } 100% { transform: translate3d(var(--dx, 0), 140px, 0) rotate(var(--rot, 180deg)); opacity: 0; } }
        /* Pieces layout and colors */
        ${Array.from({ length: 18 })
          .map((_, i) => {
            const left = 30 + Math.round((i / 17) * 40) // 30%..70%
            const dx = (i % 2 === 0 ? -1 : 1) * (12 + (i % 5) * 6)
            const rot = (i % 2 === 0 ? 1 : -1) * (160 + (i % 7) * 15)
            const t = 800 + (i % 6) * 60
            const colors = ["#22d3ee", "#a78bfa", "#10b981", "#f59e0b", "#ef4444", "#e879f9"]
            const color = colors[i % colors.length]
            return `.piece-${i + 1}{ left:${left}%; background:${color}; --dx:${dx}px; --rot:${rot}deg; --t:${t}ms; }`
          })
          .join("\n")}
      `}</style>
    </div>
  )
}
