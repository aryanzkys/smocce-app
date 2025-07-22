import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">🗳️ SMOCCE 2025</h1>
            <p className="text-lg text-gray-600 mt-2">Sistem Pemilihan Ketua SOC & PJ Bidang</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-4xl">🏆</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Selamat Datang di Sistem Pemilihan SMOCCE 2025
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistem pemilihan online untuk memilih Ketua SMANESI Olympiad Club dan Penanggung Jawab Bidang
          </p>
        </div>

        {/* Schedule Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📅 Jadwal Pemilihan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-indigo-900">Pemilihan PJ Bidang</h4>
                  <p className="text-indigo-700">Tahap Pertama</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-indigo-800"><strong>Tanggal:</strong> 5 Agustus 2025</p>
                <p className="text-indigo-800"><strong>Waktu:</strong> 00:00 - 23:59 WIB</p>
                <p className="text-sm text-indigo-600">
                  Pilih Penanggung Jawab untuk bidang Anda (Matematika, Fisika, Biologi, Kimia, Informatika, Astronomi, Ekonomi, Kebumian, Geografi)
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-xl">👑</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-blue-900">Pemilihan Ketua SOC</h4>
                  <p className="text-blue-700">Tahap Kedua</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-blue-800"><strong>Tanggal:</strong> 12 Agustus 2025</p>
                <p className="text-blue-800"><strong>Waktu:</strong> 00:00 - 23:59 WIB</p>
                <p className="text-sm text-blue-600">
                  Pilih Ketua SMANESI Olympiad Club yang akan memimpin organisasi
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link 
            href="/login" 
            className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all">
              <span className="text-2xl">🗳️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Login Pemilih</h3>
            <p className="text-blue-100">Masuk untuk memberikan suara Anda</p>
          </Link>
          
          <Link 
            href="/check-token" 
            className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Cek Token</h3>
            <p className="text-green-100">Lihat token pemilihan Anda</p>
          </Link>
          
          <Link 
            href="/admin/login" 
            className="group bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl p-6 text-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-opacity-30 transition-all">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Admin Panel</h3>
            <p className="text-gray-100">Kelola sistem pemilihan</p>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">ℹ️</span>
            </div>
            <h3 className="text-2xl font-bold text-yellow-900 mb-4">Informasi Penting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <h4 className="font-bold text-yellow-900">📋 Cara Pemilihan:</h4>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Login menggunakan NISN dan Token</li>
                  <li>• Pilih PJ Bidang pada 5 Agustus 2025</li>
                  <li>• Pilih Ketua SOC pada 12 Agustus 2025</li>
                  <li>• Setiap pemilihan hanya bisa dilakukan sekali</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-bold text-yellow-900">🔐 Keamanan:</h4>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Token unik untuk setiap pemilih</li>
                  <li>• Sistem logout otomatis setelah vote</li>
                  <li>• Data vote tersimpan aman</li>
                  <li>• Tidak dapat mengubah pilihan setelah submit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
          </p>
          <p className="text-xs mt-2">
            SMOCCE 2025 - SMANESI Olympiad Club Election System
          </p>
        </div>
      </div>
    </div>
  );
}
