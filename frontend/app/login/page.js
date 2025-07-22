'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [nisn, setNisn] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch('https://smocce-app-production.up.railway.app/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nisn, token })
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
    } else {
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/dashboard') // menuju halaman selanjutnya
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-8 rounded w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Login SMOCCE</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <input
          type="text"
          placeholder="Masukkan NISN"
          value={nisn}
          onChange={(e) => setNisn(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          placeholder="Masukkan Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Masuk
        </button>
        
        <div className="text-center mt-4 space-y-2">
          <Link href="/check-token" className="block text-green-600 hover:text-green-800 font-medium text-sm">
            Lupa Token? Cek Token Anda
          </Link>
          <Link href="/" className="block text-blue-600 hover:text-blue-800 text-sm">
            Kembali ke Beranda
          </Link>
        </div>
      </form>
    </div>
  )
}
