'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CandidateCard from '../../components/CandidateCard'
import { apiService, utils } from '../../lib/api'

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

  const fetchElectionData = async (nisn) => {
    try {
      setLoading(true)
      setError(null)
      
      // Check if API is available
      const isApiAvailable = await utils.isApiAvailable()
      if (!isApiAvailable) {
        throw new Error('Server tidak dapat dijangkau. Silakan coba lagi nanti.')
      }

      // Fetch candidates
      const candidatesData = await apiService.getCandidates()
      setCandidates(candidatesData)

      // Fetch election status
      const statusData = await apiService.getVoteStatus()
      setElectionStatus(statusData)

      // Fetch user vote status (using direct API call since it's not in apiService yet)
      const userStatusResponse = await fetch(`${utils.getApiUrl()}/api/vote/user-status/${nisn}`)
      if (!userStatusResponse.ok) {
        throw new Error('Gagal mengambil status vote user')
      }
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
      // Using direct API call since PJ vote endpoint is not in apiService yet
      const res = await fetch(`${utils.getApiUrl()}/api/vote/pj`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nisn: user.nisn,
          pjId
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('Vote PJ berhasil disimpan!')
        // Refresh data
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
      // Using direct API call since Ketua vote endpoint is not in apiService yet
      const res = await fetch(`${utils.getApiUrl()}/api/vote/ketua`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nisn: user.nisn,
          ketuaId
        })
      })

      const data = await res.json()
      if (res.ok) {
        alert('Vote Ketua berhasil disimpan!')
        localStorage.removeItem('user') // logout otomatis
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

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Memuat data pemilihan...</p>
        </div>
      </div>
    )
  }

  const bidangCandidates = candidates.pj[user.bidang] || []

  // Render jika tidak ada periode aktif
  if (electionStatus && !electionStatus.active) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🗳️ SMOCCE 2025</h1>
                <p className="text-sm text-gray-600 mt-1">Sistem Pemilihan Ketua SOC & PJ Bidang</p>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">📅</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Periode Pemilihan Belum Dimulai</h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">📋 Jadwal Pemilihan SMOCCE 2025</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Pemilihan PJ Bidang</h4>
                      <p className="text-sm text-gray-600">Pilih Penanggung Jawab Bidang {user.bidang}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">5 Agustus 2025</p>
                      <p className="text-sm text-gray-500">00:00 - 23:59 WIB</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Pemilihan Ketua SOC</h4>
                      <p className="text-sm text-gray-600">Pilih Ketua Science Olympiad Club</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">12 Agustus 2025</p>
                      <p className="text-sm text-gray-500">00:00 - 23:59 WIB</p>
                    </div>
                  </div>
                </div>
              </div>

              {electionStatus.nextPeriod && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-yellow-900 mb-2">⏰ Periode Berikutnya</h3>
                  <p className="text-yellow-800">
                    <strong>{electionStatus.nextPeriod.config.name}</strong><br/>
                    {new Date(electionStatus.nextPeriod.config.startDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">👤 Informasi Pemilih</h3>
              <p className="text-gray-600">NISN: <span className="font-medium">{user.nisn}</span></p>
              <p className="text-gray-600">Bidang: <span className="font-medium text-indigo-600">{user.bidang}</span></p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render untuk periode PJ
  if (electionStatus && electionStatus.active && electionStatus.period === 'PJ') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🗳️ SMOCCE 2025</h1>
                <p className="text-sm text-gray-600 mt-1">Pemilihan PJ Bidang - 5 Agustus 2025</p>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{user.nisn.slice(-2)}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pemilihan PJ Bidang {user.bidang}</h2>
                <p className="text-gray-600">NISN: <span className="font-medium">{user.nisn}</span></p>
                <p className="text-gray-600">Bidang: <span className="font-medium text-indigo-600">{user.bidang}</span></p>
              </div>
            </div>
          </div>

          {/* Status Vote */}
          {userVoteStatus && userVoteStatus.vote.pjCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">Anda Sudah Memilih PJ Bidang</h3>
                  <p className="text-green-700">
                    Terima kasih! Vote Anda untuk PJ {user.bidang} telah tersimpan pada{' '}
                    {new Date(userVoteStatus.vote.pjVotedAt).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Pemilihan Ketua SOC akan dibuka pada 12 Agustus 2025
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PJ Selection */}
          {!userVoteStatus?.vote.pjCompleted && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🎯 Pilih PJ Bidang {user.bidang}</h2>
                <p className="text-gray-600">Pilih satu kandidat yang akan memimpin bidang {user.bidang}</p>
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

              {/* Submit PJ */}
              {pjId && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Konfirmasi Pilihan PJ Bidang</h3>
                    
                    <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-indigo-900 mb-2">PJ {user.bidang} Pilihan Anda:</h4>
                      <p className="text-indigo-800 font-medium">
                        {bidangCandidates.find(pj => pj.candidateId === pjId)?.name}
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ <strong>Perhatian:</strong> Setelah submit, pilihan PJ Anda tidak dapat diubah lagi.
                      </p>
                    </div>

                    <button
                      onClick={handlePJSubmit}
                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300"
                    >
                      🗳️ Submit Pilihan PJ
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  // Render untuk periode Ketua
  if (electionStatus && electionStatus.active && electionStatus.period === 'KETUA') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">🗳️ SMOCCE 2025</h1>
                <p className="text-sm text-gray-600 mt-1">Pemilihan Ketua SOC - 12 Agustus 2025</p>
              </div>
              <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* User Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{user.nisn.slice(-2)}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Pemilihan Ketua SOC</h2>
                <p className="text-gray-600">NISN: <span className="font-medium">{user.nisn}</span></p>
                <p className="text-gray-600">Bidang: <span className="font-medium text-indigo-600">{user.bidang}</span></p>
              </div>
            </div>
          </div>

          {/* PJ Vote Status */}
          {userVoteStatus && userVoteStatus.vote.pjCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <div className="flex items-center">
                <span className="text-green-500 text-xl mr-3">✓</span>
                <p className="text-green-700">
                  <strong>PJ {user.bidang}:</strong> Anda sudah memilih pada{' '}
                  {new Date(userVoteStatus.vote.pjVotedAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          )}

          {/* Status Vote Ketua */}
          {userVoteStatus && userVoteStatus.vote.ketuaCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-green-900">Anda Sudah Menyelesaikan Pemilihan</h3>
                  <p className="text-green-700">
                    Terima kasih! Vote Anda untuk Ketua SOC telah tersimpan pada{' '}
                    {new Date(userVoteStatus.vote.ketuaVotedAt).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ketua Selection */}
          {!userVoteStatus?.vote.ketuaCompleted && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">👑 Pilih Ketua SOC</h2>
                <p className="text-gray-600">Pilih satu kandidat yang akan memimpin Science Olympiad Club</p>
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

              {/* Submit Ketua */}
              {ketuaId && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">✅ Konfirmasi Pilihan Ketua SOC</h3>
                    
                    <div className="bg-blue-50 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold text-blue-900 mb-2">Ketua SOC Pilihan Anda:</h4>
                      <p className="text-blue-800 font-medium">
                        {candidates.ketua.find(k => k.candidateId === ketuaId)?.name}
                      </p>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                      <p className="text-yellow-800 text-sm">
                        ⚠️ <strong>Perhatian:</strong> Setelah submit, pilihan Ketua Anda tidak dapat diubah lagi.
                      </p>
                    </div>

                    <button
                      onClick={handleKetuaSubmit}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                    >
                      🗳️ Submit Pilihan Ketua
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return null
}
