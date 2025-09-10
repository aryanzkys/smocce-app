'use client'
import { useState } from 'react'
import { apiService, utils } from '../../../lib/api'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await apiService.adminLogin({ username, password })
      if (res?.token) {
        localStorage.setItem('adminToken', res.token)
        localStorage.setItem('adminAuth', 'true') // fallback flag
        router.push('/admin/dashboard')
      } else {
        setError('Login gagal')
      }
    } catch (e) {
      setError(utils.formatApiError(e))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        
        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
        >
          Login
        </button>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>Username: admin | Password: smocce2025</p>
        </div>
      </form>
    </div>
  )
}
