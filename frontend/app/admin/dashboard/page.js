'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
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

  useEffect(() => {
    // Check admin authentication
    const adminAuth = localStorage.getItem('adminAuth')
    if (!adminAuth) {
      router.push('/admin/login')
      return
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard stats
      const statsRes = await fetch('https://smocce-app-production.up.railway.app/api/admin/stats')
      const statsData = await statsRes.json()
      setStats(statsData)

      // Fetch users
      const usersRes = await fetch('https://smocce-app-production.up.railway.app/api/admin/users')
      const usersData = await usersRes.json()
      setUsers(usersData.users)

      // Fetch votes
      const votesRes = await fetch('https://smocce-app-production.up.railway.app/api/admin/votes')
      const votesData = await votesRes.json()
      setVotes(votesData.votes)

      // Fetch results
      const resultsRes = await fetch('https://smocce-app-production.up.railway.app/api/admin/results')
      const resultsData = await resultsRes.json()
      setResults(resultsData)

      // Fetch candidates
      const candidatesRes = await fetch('https://smocce-app-production.up.railway.app/api/admin/candidates')
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
    router.push('/admin/login')
  }

  const resetUserVote = async (nisn) => {
    if (!confirm(`Reset vote untuk NISN ${nisn}?`)) return

    try {
      const res = await fetch(`https://smocce-app-production.up.railway.app/api/admin/users/${nisn}/vote`, {
        method: 'DELETE'
      })
      
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
      const res = await fetch(`https://smocce-app-production.up.railway.app/api/admin/users/${nisn}/token`, {
        method: 'PUT'
      })
      
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
      const res = await fetch('https://smocce-app-production.up.railway.app/api/admin/import/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users })
      })

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
      const res = await fetch(`https://smocce-app-production.up.railway.app/api/admin/candidates/${editingCandidate.candidateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(candidateForm)
      })

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
      let url = 'https://smocce-app-production.up.railway.app/api/admin/export'
      let filename = `smocce-data-${new Date().toISOString().split('T')[0]}`
      
      switch (type) {
        case 'users-csv':
          url = 'https://smocce-app-production.up.railway.app/api/admin/export/users-csv'
          filename = `data-pemilih-${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'results-csv':
          url = 'https://smocce-app-production.up.railway.app/api/admin/export/results-csv'
          filename = `hasil-voting-${new Date().toISOString().split('T')[0]}.csv`
          break
        case 'comprehensive':
          url = 'https://smocce-app-production.up.railway.app/api/admin/export/comprehensive'
          filename = `laporan-lengkap-${new Date().toISOString().split('T')[0]}.json`
          break
        default:
          filename += '.json'
      }

      const res = await fetch(url)
      
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMOCCE Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Monitoring & Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Import Button */}
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Import Excel
              </button>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                >
                  <span>Export Data</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border">
                    <div className="py-1">
                      <button
                        onClick={() => { exportData('users-csv'); setShowExportMenu(false) }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📊 Data Pemilih (CSV)
                      </button>
                      <button
                        onClick={() => { exportData('results-csv'); setShowExportMenu(false) }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        🗳️ Hasil Voting (CSV)
                      </button>
                      <button
                        onClick={() => { exportData('comprehensive'); setShowExportMenu(false) }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        📋 Laporan Lengkap (JSON)
                      </button>
                      <button
                        onClick={() => { exportData('json'); setShowExportMenu(false) }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        💾 Data Mentah (JSON)
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
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
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.totalUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Voted</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.votedUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.pendingUsers || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Turnout</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats?.turnoutPercentage || 0}%</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Votes by Bidang */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Votes by Bidang</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats?.votesByBidang?.map((item) => (
                    <div key={item._id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">{item._id}</div>
                      <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">User Management</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.nisn}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nisn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.bidang}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.hasVoted 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.hasVoted ? 'Voted' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {user.hasVoted && (
                              <button
                                onClick={() => resetUserVote(user.nisn)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reset Vote
                              </button>
                            )}
                            <button
                              onClick={() => regenerateToken(user.nisn)}
                              className="text-blue-600 hover:text-blue-900"
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
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Vote Records</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NISN</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bidang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PJ ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {votes.map((vote, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vote.nisn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vote.bidang}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vote.ketuaId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{vote.pjId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
            {/* Ketua Candidates */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Kandidat Ketua SOC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.ketua.map((candidate) => (
                    <div key={candidate.candidateId} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-center mb-3">
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                          onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                        />
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">ID: {candidate.candidateId}</p>
                      </div>
                      <div className="text-xs text-gray-600">
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
              <div key={bidang} className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Kandidat PJ {bidang}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pjCandidates.map((candidate) => (
                      <div key={candidate.candidateId} className="border border-gray-200 rounded-lg p-4">
                        <div className="text-center mb-3">
                          <img 
                            src={candidate.photo} 
                            alt={candidate.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                            onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                          />
                          <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-gray-500">ID: {candidate.candidateId}</p>
                        </div>
                        <div className="text-xs text-gray-600">
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
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Kelola Kandidat Ketua SOC</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {candidates.ketua.map((candidate) => (
                    <div key={candidate.candidateId} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-center mb-3">
                        <img 
                          src={candidate.photo} 
                          alt={candidate.name}
                          className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                          onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                        />
                        <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                        <p className="text-sm text-gray-500">ID: {candidate.candidateId}</p>
                      </div>
                      <div className="text-xs text-gray-600 mb-3">
                        <p className="mb-1"><strong>Visi:</strong> {candidate.vision?.substring(0, 50)}...</p>
                        {candidate.mission && <p className="mb-1"><strong>Misi:</strong> {candidate.mission?.substring(0, 50)}...</p>}
                      </div>
                      <button
                        onClick={() => handleEditCandidate(candidate)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded"
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
              <div key={bidang} className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Kelola Kandidat PJ {bidang}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pjCandidates.map((candidate) => (
                      <div key={candidate.candidateId} className="border border-gray-200 rounded-lg p-4">
                        <div className="text-center mb-3">
                          <img 
                            src={candidate.photo} 
                            alt={candidate.name}
                            className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                            onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                          />
                          <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                          <p className="text-sm text-gray-500">ID: {candidate.candidateId}</p>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">
                          <p className="mb-1"><strong>Visi:</strong> {candidate.vision?.substring(0, 50)}...</p>
                          {candidate.mission && <p className="mb-1"><strong>Misi:</strong> {candidate.mission?.substring(0, 50)}...</p>}
                        </div>
                        <button
                          onClick={() => handleEditCandidate(candidate)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded"
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
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hasil Pemilihan Ketua</h3>
                <div className="space-y-3">
                  {results.ketuaResults.map((result, index) => {
                    const candidate = candidates.ketua.find(c => c.candidateId === result._id)
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={candidate?.photo || '/default-avatar.jpg'} 
                            alt={candidate?.name || 'Unknown'}
                            className="w-12 h-12 object-cover rounded-full"
                            onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                          />
                          <div>
                            <div className="font-medium text-gray-900">{candidate?.name || result._id}</div>
                            <div className="text-sm text-gray-500">{result.votes} votes</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{result.votes}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* PJ Results */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Hasil Pemilihan PJ Bidang</h3>
                <div className="space-y-6">
                  {Object.entries(results.pjResults).map(([bidang, candidateResults]) => (
                    <div key={bidang}>
                      <h4 className="font-medium text-gray-900 mb-3">{bidang}</h4>
                      <div className="space-y-2">
                        {candidateResults.map((candidateResult, index) => {
                          const candidate = candidates.pj[bidang]?.find(c => c.candidateId === candidateResult.pjId)
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div className="flex items-center space-x-3">
                                <img 
                                  src={candidate?.photo || '/default-avatar.jpg'} 
                                  alt={candidate?.name || 'Unknown'}
                                  className="w-10 h-10 object-cover rounded-full"
                                  onError={(e) => { e.target.src = '/default-avatar.jpg' }}
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{candidate?.name || candidateResult.pjId}</div>
                                  <div className="text-sm text-gray-500">{candidateResult.votes} votes</div>
                                </div>
                              </div>
                              <div className="text-xl font-bold text-green-600">{candidateResult.votes}</div>
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Import Data User</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih File Excel/CSV
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600 mb-2"><strong>Format File:</strong></p>
                <p className="text-xs text-gray-500">
                  File harus memiliki kolom: <strong>NISN, Bidang, Token</strong><br/>
                  Contoh: 1234567890, Matematika, TOKEN001
                </p>
              </div>

              {importFile && (
                <div className="mb-4 p-2 bg-green-50 rounded">
                  <p className="text-sm text-green-700">
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={importing}
                >
                  Batal
                </button>
                <button
                  onClick={processImportFile}
                  disabled={!importFile || importing}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {importing ? 'Importing...' : 'Import'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Candidate Modal */}
      {showEditModal && editingCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Kandidat: {editingCandidate.name} ({editingCandidate.candidateId})
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kandidat
                  </label>
                  <input
                    type="text"
                    value={candidateForm.name}
                    onChange={(e) => setCandidateForm({...candidateForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan nama kandidat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL Foto
                  </label>
                  <input
                    type="text"
                    value={candidateForm.photo}
                    onChange={(e) => setCandidateForm({...candidateForm, photo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visi
                  </label>
                  <textarea
                    value={candidateForm.vision}
                    onChange={(e) => setCandidateForm({...candidateForm, vision: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan visi kandidat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Misi
                  </label>
                  <textarea
                    value={candidateForm.mission}
                    onChange={(e) => setCandidateForm({...candidateForm, mission: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan misi kandidat"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pengalaman
                  </label>
                  <textarea
                    value={candidateForm.experience}
                    onChange={(e) => setCandidateForm({...candidateForm, experience: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Masukkan pengalaman kandidat"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveCandidate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
