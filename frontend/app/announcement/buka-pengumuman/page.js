'use client'
import NeonBackground from '../_shared/NeonBackground'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="relative min-h-[100dvh] bg-[#030712] overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <NeonBackground />
      </div>
      <main className="relative mx-auto max-w-4xl px-4 py-16 md:py-20">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#E6FFFB', textShadow: '0 0 12px rgba(0,229,255,0.35)' }}>
            Buka Pengumuman
          </h1>
          <p className="mt-2 text-cyan-100/85">Pengumuman utama SMOCCE 2025</p>
        </header>
        <section className="rounded-xl border border-cyan-300/20 bg-slate-900/40 p-6">
          <p className="text-cyan-100/90">Konten utama akan hadir di sini.</p>
        </section>
        <div className="mt-8 text-center">
          <Link href="/announcement" className="text-cyan-300 hover:text-cyan-200">← Kembali</Link>
        </div>
      </main>
    </div>
  )
}
