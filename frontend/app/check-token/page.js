'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function CheckToken() {
  const [nisn, setNisn] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!nisn.trim()) {
      setError('NISN harus diisi')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('http://localhost:5000/api/auth/check-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nisn: nisn.trim() })
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
      } else {
        setError(data.message || 'Terjadi kesalahan')
      }
    } catch (error) {
      console.error('Error:', error)
      setError('Gagal terhubung ke server')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setNisn('')
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cek Token</h1>
          <p className="text-gray-600">Masukkan NISN untuk melihat token Anda</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nisn" className="block text-sm font-medium text-gray-700 mb-2">
                NISN (Nomor Induk Siswa Nasional)
              </label>
              <input
                type="text"
                id="nisn"
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan NISN Anda"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              {loading ? 'Mencari...' : 'Cek Token'}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Informasi Token Anda</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">NISN:</span>
                  <span className="text-sm text-gray-900">{result.nisn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Bidang:</span>
                  <span className="text-sm text-gray-900">{result.bidang}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Token:</span>
                  <span className="text-lg font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    {result.token}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span className={`text-sm font-medium ${
                    result.hasVoted ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {result.hasVoted ? 'Sudah Vote' : 'Belum Vote'}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Catatan:</strong> Simpan token ini dengan baik. Anda memerlukan NISN dan Token untuk login ke sistem voting.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
              >
                Cek NISN Lain
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="text-center space-y-2">
          <Link 
            href="/login" 
            className="block text-blue-600 hover:text-blue-800 font-medium"
          >
            Login untuk Vote
          </Link>
          <Link 
            href="/" 
            className="block text-gray-600 hover:text-gray-800"
          >
            Kembali ke Beranda
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">ℹ️ Informasi Penting</h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Token diperlukan untuk login ke sistem voting</li>
            <li>• Jika lupa token, gunakan fitur ini untuk mengeceknya</li>
            <li>• Setiap siswa hanya bisa vote sekali</li>
            <li>• Hubungi admin jika ada masalah dengan token</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
