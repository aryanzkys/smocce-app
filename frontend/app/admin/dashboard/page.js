'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import CropModal from './CropModal'
import LoadingOverlay from '../../../components/LoadingOverlay'
import RoboHeader from '../../../components/RoboHeader'

export default function AdminDashboard() {
  // ...state dan handler cropping di atas...

  // --- Render CropModal universal untuk tambah/edit kandidat ---
  // (Letakkan di bawah return utama, sebelum penutup komponen)


  // ...state dan handler cropping di atas...

  // Render CropModal (universal untuk tambah/edit)
  // Diletakkan di luar return utama agar selalu tersedia
  // (bisa juga diletakkan di bagian bawah return utama, sebelum </div> penutup)

  // State untuk cropping foto kandidat
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null); // base64
  const [cropTarget, setCropTarget] = useState(null); // 'add' | 'edit'

  // Handler setelah crop selesai
  const handleCropDone = async (croppedBlob) => {
    setShowCropModal(false);
    setCropImageSrc(null);
    if (!croppedBlob) return;
    // Upload hasil crop ke backend
    const formData = new FormData();
    formData.append('photo', croppedBlob, 'cropped.jpg');
    try {
      const res = await withBusy(() => fetch('/api/upload/photo', {
        method: 'POST',
        headers: authHeaders(),
        body: formData
      }), 'Uploading photo...');
      const data = await res.json();
      if (res.ok && data.url) {
        setCandidateForm((prev) => ({ ...prev, photo: data.url }));
      } else {
        alert('Gagal upload foto hasil crop');
      }
    } catch (err) {
      alert('Error upload foto hasil crop');
    }
  };

  // Fungsi untuk menyimpan kandidat baru
  const handleSaveNewCandidate = async () => {
    try {
      const res = await withBusy(() => fetch('/api/admin/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(candidateForm)
      }), 'Saving candidate...');
      if (res.ok) {
        alert('Kandidat berhasil ditambahkan!');
        setShowAddModal(false);
        setCandidateForm({
          candidateId: '',
          name: '',
          type: 'ketua',
          bidang: '',
          photo: '',
          vision: '',
          mission: '',
          experience: ''
        });
        fetchData && fetchData();
      } else {
        const data = await res.json();
        alert('Gagal menambah kandidat: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      alert('Terjadi error saat menambah kandidat');
    }
  };
  // Fungsi untuk menutup modal tambah kandidat
  const handleCancelAdd = () => {
    setShowAddModal(false);
  };
  const [showAddModal, setShowAddModal] = useState(false);
  // Fungsi untuk membuka modal tambah kandidat
  const handleAddCandidate = () => {
    setCandidateForm({
      candidateId: '',
      name: '',
      type: 'ketua',
      bidang: '',
      photo: '',
      vision: '',
      mission: '',
      experience: ''
    });
    setShowAddModal(true);
  }
  const router = useRouter()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [votes, setVotes] = useState([])
  const [results, setResults] = useState(null)
  const [candidates, setCandidates] = useState({ ketua: [], pj: {} })
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [importing, setImporting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState(null)
  const [candidateForm, setCandidateForm] = useState({
    name: '',
    photo: '',
    vision: '',
    mission: '',
    experience: ''
  })

  // Entrance animation flag
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Global loading overlay for interactive actions
  const [busyMessage, setBusyMessage] = useState('')
  const withBusy = async (fn, message = 'Processing...') => {
    try {
      setBusyMessage(message)
      return await fn()
    } finally {
      setBusyMessage('')
    }
  }

  const authHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      router.push('/admin/login')
      return
    }

    fetchData()
  }, [])

  // Close export dropdown on outside click
  const exportPanelRef = useRef(null)
  useEffect(() => {
    if (!showExportMenu) return
    const handleClickOutside = (e) => {
      if (exportPanelRef.current && !exportPanelRef.current.contains(e.target)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showExportMenu])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats
  const statsRes = await fetch('/api/admin/stats', { headers: authHeaders() })
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch users
  const usersRes = await fetch('/api/admin/users', { headers: authHeaders() })
      const usersData = await usersRes.json()
      setUsers(usersData.users)

      // Fetch votes
  const votesRes = await fetch('/api/admin/votes', { headers: authHeaders() })
      const votesData = await votesRes.json()
      setVotes(votesData.votes)

      // Fetch results
  const resultsRes = await fetch('/api/admin/results', { headers: authHeaders() })
      const resultsData = await resultsRes.json()
      setResults(resultsData)

      // Fetch candidates
  const candidatesRes = await fetch('/api/admin/candidates', { headers: authHeaders() })
      const candidatesData = await candidatesRes.json()
      setCandidates(candidatesData)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
  localStorage.removeItem('adminAuth')
  localStorage.removeItem('adminToken')
    router.push('/admin/login')
  }

  const resetUserVote = async (nisn) => {
    if (!confirm(`Reset vote untuk NISN ${nisn}?`)) return

    try {
      const res = await withBusy(() => fetch(`/api/admin/users/${nisn}/vote`, {
        method: 'DELETE',
        headers: authHeaders(),
      }), 'Resetting vote...')
      
      if (res.ok) {
        alert('Vote berhasil direset')
        fetchData() // Refresh data
      } else {
        alert('Gagal reset vote')
      }
    } catch (error) {
      console.error('Error resetting vote:', error)
      alert('Error resetting vote')
    }
  }

  const regenerateToken = async (nisn) => {
    if (!confirm(`Regenerate token untuk NISN ${nisn}?`)) return

    try {
      const res = await withBusy(() => fetch(`/api/admin/users/${nisn}/token`, {
        method: 'PUT',
        headers: authHeaders(),
      }), 'Regenerating token...')
      
      if (res.ok) {
        const data = await res.json()
        alert(`Token baru untuk NISN ${nisn}: ${data.newToken}`)
        fetchData() // Refresh data
      } else {
        alert('Gagal regenerate token')
      }
    } catch (error) {
      console.error('Error regenerating token:', error)
      alert('Error regenerating token')
    }
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const fileType = file.name.split('.').pop().toLowerCase()
      if (!['xlsx', 'xls', 'csv'].includes(fileType)) {
        alert('File harus berformat Excel (.xlsx, .xls) atau CSV (.csv)')
        return
      }
      setImportFile(file)
    }
  }

  const processImportFile = async () => {
    if (!importFile) {
      alert('Pilih file terlebih dahulu')
      return
    }

    setImporting(true)
    
    try {
      // Read file content
      const fileContent = await readFileContent(importFile)
      let users = []

      if (importFile.name.endsWith('.csv')) {
        users = parseCSV(fileContent)
      } else {
        // For Excel files, we'll need to parse them
        users = parseExcel(fileContent)
      }

      // Send to backend
      const res = await withBusy(() => fetch('/api/admin/import/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ users })
      }), 'Importing users...')

      const result = await res.json()
      
      if (res.ok) {
        alert(`Import selesai!\nBerhasil: ${result.results.success}\nGagal: ${result.results.failed}\nDiupdate: ${result.results.updated}`)
        setShowImportModal(false)
        setImportFile(null)
        fetchData() // Refresh data
      } else {
        alert('Error importing data: ' + result.message)
      }
    } catch (error) {
      console.error('Error importing file:', error)
      alert('Error importing file')
    } finally {
      setImporting(false)
    }
  }

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const parseCSV = (content) => {
    const lines = content.split('\n')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    const users = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      const values = line.split(',').map(v => v.trim())
      const user = {}

      headers.forEach((header, index) => {
        if (header === 'nisn') user.nisn = values[index]
        else if (header === 'bidang') user.bidang = values[index]
        else if (header === 'token') user.token = values[index]
      })

      if (user.nisn && user.bidang) {
        users.push(user)
      }
    }

    return users
  }

  const parseExcel = (content) => {
    // For now, we'll assume Excel files are converted to CSV format
    // In a real implementation, you'd use a library like xlsx
    return parseCSV(content)
  }

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate)
    setCandidateForm({
      name: candidate.name || '',
      photo: candidate.photo || '',
      vision: candidate.vision || '',
      mission: candidate.mission || '',
      experience: candidate.experience || ''
    })
    setShowEditModal(true)
  }

  const handleSaveCandidate = async () => {
    if (!editingCandidate) return

    try {
      const res = await withBusy(() => fetch(`/api/admin/candidates/${editingCandidate.candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(candidateForm)
      }), 'Saving candidate...')

      if (res.ok) {
        alert('Kandidat berhasil diupdate!')
        setShowEditModal(false)
        setEditingCandidate(null)
        setCandidateForm({
          name: '',
          photo: '',
          vision: '',
          mission: '',
          experience: ''
        })
        fetchData() // Refresh data
      } else {
        alert('Gagal update kandidat')
      }
    } catch (error) {
      console.error('Error updating candidate:', error)
      alert('Error updating candidate')
    }
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingCandidate(null)
    setCandidateForm({
      name: '',
      photo: '',
      vision: '',
      mission: '',
      experience: ''
    })
  }

  const exportData = async (type = 'json') => {
    try {
  let url = '/api/admin/export'
      let filename = `smocce-data-${new Date().toISOString().split('T')[0]}`
      
      switch (type) {
        case 'users-csv':
          url = '/api/admin/export/users-csv'
          filename = `data-pemilih-${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'results-csv':
          url = '/api/admin/export/results-csv'
          filename = `hasil-voting-${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'comprehensive':
          url = '/api/admin/export/comprehensive'
          filename = `laporan-lengkap-${new Date().toISOString().split('T')[0]}.json`
          break
        default:
          filename += '.json'
      }

  const res = await withBusy(() => fetch(url, { headers: authHeaders() }), 'Preparing export...')
      
      if (type.includes('csv')) {
        // Handle CSV download
        const csvData = await res.text()
        const blob = new Blob([csvData], { type: 'text/csv' })
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = filename
        a.click()
        URL.revokeObjectURL(downloadUrl)
      } else {
        // Handle JSON download
        const data = await res.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const downloadUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = filename
        a.click()
        URL.revokeObjectURL(downloadUrl)
      }
      
      alert('Data berhasil diexport!')
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error exporting data')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <LoadingOverlay show={!!busyMessage} message={busyMessage} />
      <RoboHeader
        onLogout={handleLogout}
        onImportClick={() => setShowImportModal(true)}
        onExportClick={() => setShowExportMenu(!showExportMenu)}
      />
      {showExportMenu && (
        <div ref={exportPanelRef} className="absolute right-6 top-20 w-64 bg-slate-900/95 backdrop-blur rounded-lg shadow-xl z-20 border border-slate-800">
          <div className="py-1">
            <button
              onClick={() => { exportData('users-csv'); setShowExportMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
            >
              📊 Data Pemilih (CSV)
            </button>
            <button
              onClick={() => { exportData('results-csv'); setShowExportMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
            >
              🗳️ Hasil Voting (CSV)
            </button>
            <button
              onClick={() => { exportData('comprehensive'); setShowExportMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
            >
              📋 Laporan Lengkap (JSON)
            </button>
            <button
              onClick={() => { exportData('json'); setShowExportMenu(false) }}
              className="block w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-800/60"
            >
              💾 Data Mentah (JSON)
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="bg-slate-900/60 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'users', label: 'Users' },
              { id: 'votes', label: 'Votes' },
              { id: 'candidates', label: 'Candidates' },
              { id: 'manage-candidates', label: 'Manage Candidates' },
              { id: 'results', label: 'Results' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className={`max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-out ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/60 backdrop-blur border border-slate-800 overflow-hidden rounded-xl shadow-lg shadow-cyan-500/10">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-400 truncate">Total Users</dt>
                        <dd className="text-lg font-semibold text-slate-100">{stats?.totalUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur border border-slate-800 overflow-hidden rounded-xl shadow-lg shadow-cyan-500/10">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-lime-600 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-400 truncate">Voted</dt>
                        <dd className="text-lg font-semibold text-slate-100">{stats?.votedUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur border border-slate-800 overflow-hidden rounded-xl shadow-lg shadow-cyan-500/10">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-400 truncate">Pending</dt>
                        <dd className="text-lg font-semibold text-slate-100">{stats?.pendingUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur border border-slate-800 overflow-hidden rounded-xl shadow-lg shadow-cyan-500/10">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-slate-400 truncate">Turnout</dt>
                        <dd className="text-lg font-semibold text-slate-100">{stats?.turnoutPercentage || 0}%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Votes by Bidang */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Votes by Bidang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats?.votesByBidang?.map((item) => (
                    <div key={item._id} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700">
                      <div className="text-sm font-medium text-slate-400">{item._id}</div>
                      <div className="text-2xl font-bold text-slate-100">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-800/60">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">NISN</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Bidang</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-slate-800">
                    {users.map((user) => (
                      <tr key={user.nisn} className="hover:bg-slate-800/40">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{user.nisn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.bidang}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.hasVoted 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-700' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-700'
                          }`}>
                            {user.hasVoted ? 'Voted' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                          <div className="flex space-x-3">
                            {user.hasVoted && (
                              <button
                                onClick={() => resetUserVote(user.nisn)}
                                className="text-rose-400 hover:text-rose-300"
                              >
                                Reset Vote
                              </button>
                            )}
                            <button
                              onClick={() => regenerateToken(user.nisn)}
                              className="text-cyan-400 hover:text-cyan-300"
                            >
                              Regenerate Token
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'votes' && (
          <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Vote Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-800">
                  <thead className="bg-slate-800/60">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">NISN</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Bidang</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Ketua ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">PJ ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-transparent divide-y divide-slate-800">
                    {votes.map((vote, index) => (
                      <tr key={index} className="hover:bg-slate-800/40">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-100">{vote.nisn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{vote.bidang}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{vote.ketuaId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{vote.pjId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                          {new Date(vote.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={handleAddCandidate}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium mb-4 shadow shadow-cyan-500/20"
              >
                + Tambah Kandidat
              </button>
            </div>
            {/* Ketua Candidates */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Kandidat Ketua SOC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.ketua.map((candidate) => (
                    <div key={candidate.candidateId} className="border border-slate-800 rounded-lg p-4 bg-slate-800/40">
                      <div className="text-center mb-3">
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                          onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                        />
                        <h4 className="font-medium text-slate-100">{candidate.name}</h4>
                        <p className="text-sm text-slate-400">ID: {candidate.candidateId}</p>
                      </div>
                      <div className="text-xs text-slate-300">
                        <p className="mb-2"><strong>Visi:</strong> {candidate.vision}</p>
                        {candidate.mission && <p className="mb-2"><strong>Misi:</strong> {candidate.mission}</p>}
                        {candidate.experience && <p><strong>Pengalaman:</strong> {candidate.experience}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PJ Candidates by Bidang */}
            {Object.entries(candidates.pj).map(([bidang, pjCandidates]) => (
              <div key={bidang} className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Kandidat PJ {bidang}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pjCandidates.map((candidate) => (
                      <div key={candidate.candidateId} className="border border-slate-800 rounded-lg p-4 bg-slate-800/40">
                        <div className="text-center mb-3">
                          <img 
                            src={candidate.photo} 
                            alt={candidate.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                            onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                          />
                          <h4 className="font-medium text-slate-100">{candidate.name}</h4>
                          <p className="text-sm text-slate-400">ID: {candidate.candidateId}</p>
                        </div>
                        <div className="text-xs text-slate-300">
                          <p className="mb-2"><strong>Visi:</strong> {candidate.vision}</p>
                          {candidate.mission && <p className="mb-2"><strong>Misi:</strong> {candidate.mission}</p>}
                          {candidate.experience && <p><strong>Pengalaman:</strong> {candidate.experience}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'manage-candidates' && (
          <div className="space-y-6">
            {/* Ketua Candidates Management */}
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Kelola Kandidat Ketua SOC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.ketua.map((candidate) => (
                    <div key={candidate.candidateId} className="border border-slate-800 rounded-lg p-4 bg-slate-800/40">
                      <div className="text-center mb-3">
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                          onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                        />
                        <h4 className="font-medium text-slate-100">{candidate.name}</h4>
                        <p className="text-sm text-slate-400">ID: {candidate.candidateId}</p>
                      </div>
                      <div className="text-xs text-slate-300 mb-3">
                        <p className="mb-1"><strong>Visi:</strong> {candidate.vision?.substring(0, 50)}...</p>
                        {candidate.mission && <p className="mb-1"><strong>Misi:</strong> {candidate.mission?.substring(0, 50)}...</p>}
                      </div>
                      <button
                        onClick={() => handleEditCandidate(candidate)}
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm py-2 px-3 rounded shadow shadow-cyan-500/20"
                      >
                        Edit Kandidat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PJ Candidates Management by Bidang */}
            {Object.entries(candidates.pj).map(([bidang, pjCandidates]) => (
              <div key={bidang} className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Kelola Kandidat PJ {bidang}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pjCandidates.map((candidate) => (
                      <div key={candidate.candidateId} className="border border-slate-800 rounded-lg p-4 bg-slate-800/40">
                        <div className="text-center mb-3">
                          <img 
                            src={candidate.photo} 
                            alt={candidate.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                            onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                          />
                          <h4 className="font-medium text-slate-100">{candidate.name}</h4>
                          <p className="text-sm text-slate-400">ID: {candidate.candidateId}</p>
                        </div>
                        <div className="text-xs text-slate-300 mb-3">
                          <p className="mb-1"><strong>Visi:</strong> {candidate.vision?.substring(0, 50)}...</p>
                          {candidate.mission && <p className="mb-1"><strong>Misi:</strong> {candidate.mission?.substring(0, 50)}...</p>}
                        </div>
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white text-sm py-2 px-3 rounded shadow shadow-cyan-500/20"
                        >
                          Edit Kandidat
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

    {activeTab === 'results' && results && (
      <div className="space-y-6">
            {/* Ketua Results */}
    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
              <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Hasil Pemilihan Ketua</h3>
                <div className="space-y-3">
                  {results.ketuaResults.map((result, index) => {
                    const candidate = candidates.ketua.find(c => c.candidateId === result._id)
                    return (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-800">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={candidate?.photo || '/default-avatar.jpg'} 
                            alt={candidate?.name || 'Unknown'}
                            className="w-12 h-12 object-cover rounded-full"
                            onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                          />
                          <div>
            <div className="font-medium text-slate-100">{candidate?.name || result._id}</div>
            <div className="text-sm text-slate-400">{result.votes} votes</div>
                          </div>
                        </div>
        <div className="text-2xl font-bold text-cyan-400">{result.votes}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* PJ Results */}
    <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl shadow-lg shadow-cyan-500/10">
              <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-semibold text-slate-100 mb-4">Hasil Pemilihan PJ Bidang</h3>
                <div className="space-y-6">
                  {Object.entries(results.pjResults).map(([bidang, candidateResults]) => (
                    <div key={bidang}>
          <h4 className="font-medium text-slate-100 mb-3">{bidang}</h4>
                      <div className="space-y-2">
                        {candidateResults.map((candidateResult, index) => {
                          const candidate = candidates.pj[bidang]?.find(c => c.candidateId === candidateResult.pjId)
                          return (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-800/40 rounded border border-slate-800">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={candidate?.photo || '/default-avatar.jpg'} 
                                  alt={candidate?.name || 'Unknown'}
                                  className="w-10 h-10 object-cover rounded-full"
                                  onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                                />
                                <div>
              <div className="font-medium text-slate-100">{candidate?.name || candidateResult.pjId}</div>
              <div className="text-sm text-slate-400">{candidateResult.votes} votes</div>
                                </div>
                              </div>
          <div className="text-xl font-bold text-emerald-400">{candidateResult.votes}</div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/60 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border border-slate-800 w-96 shadow-xl rounded-lg bg-slate-900/95 backdrop-blur">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">Import Data User</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Pilih File Excel/CSV
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-300 hover:file:bg-cyan-500/20"
                />
              </div>

              <div className="mb-4 p-3 bg-slate-800/60 rounded border border-slate-700">
                <p className="text-sm text-slate-300 mb-2"><strong>Format File:</strong></p>
                <p className="text-xs text-slate-400">
                  File harus memiliki kolom: <strong>NISN, Bidang</strong><br/>
                  Contoh: 1234567890, Matematika
                </p>
              </div>

              {importFile && (
                <div className="mb-4 p-2 bg-emerald-500/10 rounded border border-emerald-700">
                  <p className="text-sm text-emerald-300">
                    File dipilih: {importFile.name}
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-md hover:bg-slate-700 border border-slate-700"
                  disabled={importing}
                >
                  Batal
                </button>
                <button
                  onClick={processImportFile}
                  disabled={!importFile || importing}
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:bg-slate-700"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900/95 backdrop-blur rounded-lg shadow-xl w-full max-w-lg p-6 relative overflow-y-auto border border-slate-800" style={{ maxHeight: '90vh' }}>
            <button
              onClick={handleCancelAdd}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xl font-semibold mb-4 text-slate-100">Tambah Kandidat Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">ID Kandidat</label>
                <input
                  type="text"
                  value={candidateForm.candidateId}
                  onChange={e => setCandidateForm({ ...candidateForm, candidateId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                  placeholder="Contoh: K01 atau PJ01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipe Kandidat</label>
                <select
                  value={candidateForm.type}
                  onChange={e => setCandidateForm({ ...candidateForm, type: e.target.value, bidang: '' })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                >
                  <option value="ketua">Ketua</option>
                  <option value="pj">PJ</option>
                </select>
              </div>
              {candidateForm.type === 'pj' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Bidang (khusus PJ)</label>
                  <select
                    value={candidateForm.bidang}
                    onChange={e => setCandidateForm({ ...candidateForm, bidang: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                  >
                    <option value="">Pilih Bidang</option>
                    <option value="Matematika">Matematika</option>
                    <option value="Fisika">Fisika</option>
                    <option value="Kimia">Kimia</option>
                    <option value="Biologi">Biologi</option>
                    <option value="Ekonomi">Ekonomi</option>
                    <option value="Astronomi">Astronomi</option>
                    <option value="Kebumian">Kebumian</option>
                    <option value="Geografi">Geografi</option>
                    <option value="Informatika">Informatika</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nama Kandidat</label>
                <input
                  type="text"
                  value={candidateForm.name}
                  onChange={e => setCandidateForm({ ...candidateForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                  placeholder="Masukkan nama kandidat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Upload Foto</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      setCropImageSrc(reader.result);
                      setShowCropModal(true);
                      setCropTarget('add');
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
                />
                {candidateForm.photo && (
                  <img src={candidateForm.photo} alt="Preview Foto" className="mt-2 h-24 rounded shadow shadow-cyan-500/20" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Visi</label>
                <textarea
                  value={candidateForm.vision}
                  onChange={e => setCandidateForm({ ...candidateForm, vision: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                  placeholder="Masukkan visi kandidat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Misi</label>
                <textarea
                  value={candidateForm.mission}
                  onChange={e => setCandidateForm({ ...candidateForm, mission: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                  placeholder="Masukkan misi kandidat"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Pengalaman</label>
                <textarea
                  value={candidateForm.experience}
                  onChange={e => setCandidateForm({ ...candidateForm, experience: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                  placeholder="Masukkan pengalaman kandidat"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-md hover:bg-slate-700 border border-slate-700"
              >
                Batal
              </button>
              <button
                onClick={handleSaveNewCandidate}
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-500 shadow shadow-cyan-500/20"
              >
                Simpan Kandidat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {showEditModal && editingCandidate && (
        <div className="fixed inset-0 bg-black/60 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border border-slate-800 w-full max-w-2xl shadow-xl rounded-lg bg-slate-900/95 backdrop-blur">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Edit Kandidat: {editingCandidate.name} ({editingCandidate.candidateId})
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nama Kandidat
                  </label>
                  <input
                    type="text"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                    placeholder="Masukkan nama kandidat"
                  />
                </div>

                <div>
  <label className="block text-sm font-medium text-slate-300 mb-2">Upload Foto</label>
  <input
  type="file"
  accept="image/*"
  onChange={e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result);
      setShowCropModal(true);
      setCropTarget('edit');
    };
    reader.readAsDataURL(file);
  }}
  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100"
/>
{candidateForm.photo && (
  <img src={candidateForm.photo} alt="Preview Foto" className="mt-2 h-24 rounded shadow shadow-cyan-500/20" />
)}
</div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Visi
                  </label>
                  <textarea
                    value={candidateForm.vision}
                    onChange={(e) => setCandidateForm({...candidateForm, vision: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                    placeholder="Masukkan visi kandidat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Misi
                  </label>
                  <textarea
                    value={candidateForm.mission}
                    onChange={(e) => setCandidateForm({...candidateForm, mission: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                    placeholder="Masukkan misi kandidat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Pengalaman
                  </label>
                  <textarea
                    value={candidateForm.experience}
                    onChange={(e) => setCandidateForm({...candidateForm, experience: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-100 placeholder-slate-400"
                    placeholder="Masukkan pengalaman kandidat"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-slate-200 bg-slate-800 rounded-md hover:bg-slate-700 border border-slate-700"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCandidate}
                  className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-500 shadow shadow-cyan-500/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    {/* CropModal universal untuk tambah/edit kandidat */}
    <CropModal
      open={showCropModal}
      image={cropImageSrc}
      onCancel={() => { setShowCropModal(false); setCropImageSrc(null); }}
      onCrop={handleCropDone}
    />
  </div>
); // penutup fungsi komponen
}
