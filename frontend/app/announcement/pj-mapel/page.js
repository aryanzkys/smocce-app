'use client'
import NeonBackground from '../_shared/NeonBackground'
import Link from 'next/link'

export default function Page() {
  const items = Array.from({ length: 9 }).map((_, i) => ({ id: i + 1, nama: '—', kelas: '—' }))
  return (
    <div className="relative min-h-[100dvh] bg-[#030712] overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <NeonBackground />
      </div>
      <main className="relative mx-auto max-w-5xl px-4 py-16 md:py-20">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold" style={{ color: '#E6FFFB', textShadow: '0 0 12px rgba(0,229,255,0.35)' }}>
            Memperkenalkan Para 9 PJ Mapel Bidang Olimpiade
          </h1>
        </header>
        <section className="rounded-xl border border-cyan-300/20 bg-slate-900/40 p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-cyan-100/90">
            {items.map((it) => (
              <li key={it.id} className="rounded-lg border border-cyan-300/20 bg-slate-900/40 p-4">
                <div>Nama: {it.nama}</div>
                <div>Kelas: {it.kelas}</div>
              </li>
            ))}
          </ul>
        </section>
        <div className="mt-8 text-center">
          <Link href="/announcement" className="text-cyan-300 hover:text-cyan-200">← Kembali</Link>
        </div>
      </main>
    </div>
  )
}
