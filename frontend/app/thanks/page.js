'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ThanksPage() {
  const [voteType, setVoteType] = useState('complete') // 'pj', 'ketua', or 'complete'

  useEffect(() => {
    // Cek dari localStorage atau URL parameter untuk menentukan jenis vote
    const urlParams = new URLSearchParams(window.location.search)
    const type = urlParams.get('type') || 'complete'
    setVoteType(type)
  }, [])

  if (voteType === 'pj') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl text-center">
          <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">🎯</span>
          </div>
          <h1 className="text-4xl font-extrabold text-indigo-600 mb-6">🎉 Vote PJ Berhasil!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Terima kasih! Suara Anda untuk <strong>PJ Bidang</strong> telah berhasil dicatat.
          </p>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-3">📅 Tahap Selanjutnya</h3>
            <p className="text-blue-800 mb-2">
              <strong>Pemilihan Ketua SOC</strong>
            </p>
            <p className="text-blue-700">
              12 Agustus 2025 (00:00 - 23:59 WIB)
            </p>
            <p className="text-sm text-blue-600 mt-3">
              Anda dapat login kembali pada tanggal tersebut untuk memilih Ketua Science Olympiad Club
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition w-full"
            >
              Kembali ke Halaman Utama
            </Link>
            <p className="text-sm text-gray-500">
              Simpan NISN dan Token Anda untuk pemilihan Ketua SOC
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-4xl">✅</span>
        </div>
        <h1 className="text-4xl font-extrabold text-green-600 mb-6">🎉 Pemilihan Selesai!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Terima kasih! Anda telah menyelesaikan <strong>seluruh proses pemilihan</strong> SMOCCE 2025.
        </p>
        
        <div className="bg-green-50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-green-900 mb-4">✅ Yang Telah Anda Pilih:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-indigo-900 mb-1">🎯 PJ Bidang</h4>
              <p className="text-sm text-gray-600">Sudah dipilih pada 5 Agustus 2025</p>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-1">👑 Ketua SOC</h4>
              <p className="text-sm text-gray-600">Sudah dipilih pada 12 Agustus 2025</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-bold text-yellow-900 mb-2">🏆 Proses Selanjutnya</h3>
          <p className="text-yellow-800 text-sm">
            Hasil pemilihan akan diumumkan setelah periode pemilihan berakhir. 
            Terima kasih atas partisipasi Anda dalam SMOCCE 2025!
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition w-full"
          >
            Kembali ke Halaman Utama
          </Link>
          <p className="text-sm text-gray-500">
            SMOCCE 2025 - Science Olympiad Club Election System
          </p>
        </div>
      </div>
    </div>
  )
}
