# 📊 PANDUAN IMPORT/EXPORT DATA PEMILIH SMOCCE 2025

## 🎯 **FITUR YANG TERSEDIA**

### **📥 IMPORT DATA USER**
- **Format**: Excel (.xlsx, .xls) atau CSV (.csv)
- **Kolom**: NISN, Bidang (Token auto-generate)
- **Kegunaan**: Import data pemilih dalam jumlah besar (100-200 user)
- **Auto-generate**: Token otomatis dibuat untuk semua user baru

### **🔄 REGENERATE TOKEN**
- **Fungsi**: Generate ulang token untuk user tertentu
- **Akses**: Melalui User Management di admin dashboard
- **Keamanan**: Token unik 8 karakter (A-Z, 0-9)

### **🔍 CEK TOKEN**
- **Fungsi**: User/pemilih bisa cek token dengan NISN
- **Akses**: Halaman publik `/check-token`
- **Kegunaan**: Untuk user yang lupa token mereka

### **✏️ EDIT KANDIDAT**
- **Fungsi**: Admin bisa edit data kandidat (6 Ketua + 18 PJ dari 9 bidang)
- **Akses**: Tab "Manage Candidates" di admin dashboard
- **Edit**: Nama, Foto, Visi, Misi, Pengalaman

## 🎯 **FITUR EXPORT YANG TERSEDIA**

Admin dashboard SMOCCE 2025 menyediakan 4 jenis export data untuk menangani 100-200 pemilih:

### **1. 📊 Data Pemilih (CSV)**
- **Format**: CSV (Excel-compatible)
- **Isi**: Daftar semua pemilih dengan status voting
- **Kolom**: NISN, Bidang, Status Voting, Tanggal Vote
- **Kegunaan**: Monitoring partisipasi pemilih
- **File**: `data-pemilih-YYYY-MM-DD.csv`

### **2. 🗳️ Hasil Voting (CSV)**
- **Format**: CSV (Excel-compatible)
- **Isi**: Detail semua vote yang masuk
- **Kolom**: NISN, Bidang, Kandidat Ketua, Kandidat PJ, Tanggal Vote, Waktu Vote
- **Kegunaan**: Analisis hasil voting detail
- **File**: `hasil-voting-YYYY-MM-DD.csv`

### **3. 📋 Laporan Lengkap (JSON)**
- **Format**: JSON (structured data)
- **Isi**: Laporan komprehensif dengan statistik
- **Konten**: 
  - Metadata export
  - Statistik lengkap
  - Hasil voting terstruktur
  - Data detail users & votes
- **Kegunaan**: Analisis mendalam dan backup
- **File**: `laporan-lengkap-YYYY-MM-DD.json`

### **4. 💾 Data Mentah (JSON)**
- **Format**: JSON (raw data)
- **Isi**: Data mentah users dan votes
- **Kegunaan**: Backup dan migrasi data
- **File**: `smocce-data-YYYY-MM-DD.json`

## 🚀 **CARA MENGGUNAKAN FITUR IMPORT/EXPORT**

### **Akses Admin Dashboard**
1. Login ke admin dashboard: `http://localhost:3000/admin/login`
2. Credentials: `admin` / `smocce2025`

### **📥 Import Data User**
1. **Klik tombol "Import Excel"** di header dashboard
2. **Pilih file** Excel (.xlsx, .xls) atau CSV (.csv)
3. **Format file** harus memiliki kolom:
   - **NISN** (wajib): Nomor Induk Siswa Nasional (hanya angka)
   - **Bidang** (wajib): Matematika, Fisika, Biologi, Kimia, Informatika, Astronomi, Ekonomi, Kebumian, Geografi
4. **Klik Import** dan tunggu proses selesai
5. **Hasil import** akan ditampilkan:
   - Berhasil dibuat (dengan token auto-generate)
   - Diupdate (user existing)
   - Gagal (dengan detail error)
   - Daftar token yang di-generate untuk user baru

### **🔄 Regenerate Token User**
1. **Masuk ke tab "Users"** di admin dashboard
2. **Cari user** yang ingin di-regenerate tokennya
3. **Klik "Regenerate Token"** di kolom Actions
4. **Token baru** akan ditampilkan dalam popup
5. **Catat token baru** untuk diberikan ke user

### **🔍 Cek Token (User)**
1. **Buka halaman**: `http://localhost:3000/check-token`
2. **Masukkan NISN** yang ingin dicek
3. **Klik "Cek Token"** untuk melihat informasi
4. **Token ditampilkan** beserta info bidang dan status voting
5. **Catat token** untuk login ke sistem voting

### **✏️ Edit Kandidat (Admin)**
1. **Masuk ke tab "Manage Candidates"** di admin dashboard
2. **Pilih kandidat** yang ingin diedit (Ketua atau PJ)
3. **Klik "Edit Kandidat"** pada card kandidat
4. **Edit informasi**:
   - Nama kandidat
   - URL foto profil
   - Visi kandidat
   - Misi kandidat
   - Pengalaman kandidat
5. **Klik "Simpan Perubahan"** untuk menyimpan

### **📤 Export Data**
1. **Klik tombol "Export Data"** di header dashboard
2. **Pilih jenis export** dari dropdown menu:
   - 📊 Data Pemilih (CSV)
   - 🗳️ Hasil Voting (CSV) 
   - 📋 Laporan Lengkap (JSON)
   - 💾 Data Mentah (JSON)
3. **File akan otomatis terdownload** dengan nama sesuai tanggal

## 📈 **CONTOH OUTPUT DATA**

### **Data Pemilih CSV**
```csv
NISN,Bidang,Status Voting,Tanggal Vote
1234567890,Matematika,Sudah Vote,12/1/2025 10:30:45
1234567891,Fisika,Belum Vote,-
1234567892,Kimia,Sudah Vote,12/1/2025 11:15:22
```

### **Hasil Voting CSV**
```csv
NISN,Bidang,Kandidat Ketua,Kandidat PJ,Tanggal Vote,Waktu Vote
1234567890,Matematika,k1,pj_mat_1,12/1/2025,10:30:45
1234567892,Kimia,k2,pj_kim_2,12/1/2025,11:15:22
```

### **Laporan Lengkap JSON**
```json
{
  "metadata": {
    "exportedAt": "2025-01-12T10:30:00.000Z",
    "exportedBy": "Admin",
    "totalRecords": {
      "users": 150,
      "votes": 120
    }
  },
  "statistics": {
    "totalUsers": 150,
    "votedUsers": 120,
    "pendingUsers": 30,
    "turnoutPercentage": "80.00",
    "votesByBidang": [...]
  },
  "results": {
    "ketua": [...],
    "pj": [...]
  },
  "detailedData": {
    "users": [...],
    "votes": [...]
  }
}
```

## 📋 **TEMPLATE IMPORT**

### **Format File CSV/Excel**
```csv
NISN,Bidang
1234567890,Matematika
1234567891,Fisika
1234567892,Biologi
1234567893,Kimia
1234567894,Informatika
1234567895,Astronomi
1234567896,Ekonomi
1234567897,Kebumian
1234567898,Geografi
```

### **Aturan Import**
- ✅ **NISN**: Harus unik, hanya angka, tidak boleh duplikat
- ✅ **Bidang**: Harus salah satu dari: Matematika, Fisika, Biologi, Kimia, Informatika, Astronomi, Ekonomi, Kebumian, Geografi
- ✅ **Token**: Otomatis di-generate untuk user baru (8 karakter A-Z, 0-9)
- ✅ **Update**: Jika NISN sudah ada, bidang akan diupdate, token tetap
- ✅ **Validasi**: Format NISN dan bidang divalidasi sebelum import
- ✅ **Unique Token**: Sistem memastikan token unik untuk setiap user

## 🔧 **FITUR TAMBAHAN**

### **API Endpoints**
```
# Import/Export
POST /api/admin/import/users           - Bulk Import Users
GET /api/admin/export/users-csv        - Data Pemilih CSV
GET /api/admin/export/results-csv      - Hasil Voting CSV  
GET /api/admin/export/comprehensive    - Laporan Lengkap JSON
GET /api/admin/export                  - Data Mentah JSON

# User Management
PUT /api/admin/users/:nisn/token       - Regenerate Token
DELETE /api/admin/users/:nisn/vote     - Reset Vote
POST /api/auth/check-token             - Cek Token by NISN

# Candidate Management
GET /api/admin/candidates              - Get All Candidates
GET /api/admin/candidates/:id          - Get Single Candidate
PUT /api/admin/candidates/:id          - Update Candidate
POST /api/admin/candidates             - Create Candidate
DELETE /api/admin/candidates/:id       - Delete Candidate
```

### **Bulk Import Format**
```json
{
  "users": [
    {
      "nisn": "1234567890",
      "bidang": "Matematika"
    }
  ]
}
```

### **Import Response Format**
```json
{
  "message": "Bulk import completed",
  "results": {
    "success": 5,
    "failed": 1,
    "updated": 2,
    "duplicates": 2,
    "errors": ["Invalid NISN format: abc123"],
    "tokensGenerated": [
      {
        "nisn": "1234567890",
        "bidang": "Matematika", 
        "token": "A1B2C3D4"
      }
    ]
  },
  "summary": {
    "total": 8,
    "success": 5,
    "updated": 2,
    "failed": 1,
    "tokensGenerated": 5
  }
}
```

## 📊 **MANAJEMEN DATA SKALA BESAR**

### **Untuk 100-200 Pemilih**
- ✅ **Import Massal**: Upload Excel/CSV dengan ratusan user sekaligus
- ✅ **Auto-generate Token**: Token otomatis dibuat untuk user baru
- ✅ **Update Existing**: User yang sudah ada akan diupdate, bukan error
- ✅ **Pagination**: Data users dan votes menggunakan pagination (20 per halaman)
- ✅ **Performance**: Query database dioptimasi dengan aggregation
- ✅ **Memory**: Export streaming untuk file besar
- ✅ **Format**: CSV untuk kompatibilitas Excel
- ✅ **Timestamp**: Semua data include timestamp Indonesia

### **Best Practices**
1. **Import data** menggunakan template CSV/Excel
2. **Regenerate token** jika user lupa atau token bermasalah
3. **Export berkala** untuk backup data
4. **Gunakan CSV** untuk analisis di Excel/Google Sheets
5. **Gunakan JSON** untuk backup lengkap
6. **Monitor turnout** melalui Data Pemilih CSV
7. **Analisis hasil** melalui Hasil Voting CSV

## 🛠️ **TROUBLESHOOTING**

### **Import Issues**
- **File tidak terbaca**: Pastikan format CSV/Excel dengan kolom NISN, Bidang, Token
- **Error NISN**: NISN harus berupa angka dan unik
- **Error Bidang**: Bidang harus salah satu dari 9 bidang yang tersedia
- **Token duplikat**: Sistem akan generate token baru otomatis

### **Export Issues**
- **File tidak terdownload**: Pastikan browser mengizinkan download
- **Data kosong**: Pastikan ada data di database
- **Format error**: CSV buka dengan Excel, JSON validasi online

### **Token Issues**
- **Token tidak muncul**: Cek console browser untuk error
- **Token tidak unik**: Sistem otomatis generate token unik
- **User lupa token**: Gunakan fitur Regenerate Token

## 📞 **SUPPORT**

Untuk bantuan teknis atau pertanyaan tentang fitur export:
- Cek console browser untuk error messages
- Pastikan backend server running di port 5000
- Verifikasi database connection

## 📞 **CONTOH PENGGUNAAN**

### **Skenario 1: Import 150 Pemilih**
1. Siapkan file Excel dengan 150 baris data (NISN, Bidang saja)
2. Upload melalui "Import Excel" di admin dashboard
3. Sistem auto-generate token unik untuk user baru
4. Catat token yang di-generate dari response import
5. Export "Data Pemilih CSV" untuk distribusi token ke pemilih

### **Skenario 2: User Lupa Token**
1. **User sendiri**: Buka `/check-token`, masukkan NISN, lihat token
2. **Admin**: Cari user di tab "Users", klik "Regenerate Token"
3. **Distribusi**: Berikan token ke user yang membutuhkan
4. User bisa login dengan token yang sudah dicek/regenerate

### **Skenario 3: Edit Kandidat (24 Kandidat Total)**
1. **Login admin** → Tab "Manage Candidates"
2. **Edit kandidat Ketua**: Update 6 kandidat ketua SOC
3. **Edit kandidat PJ**: Update 18 kandidat PJ (9 bidang × 2 kandidat)
   - Matematika, Fisika, Biologi, Kimia, Informatika
   - Astronomi, Ekonomi, Kebumian, Geografi
4. **Simpan perubahan** → Data kandidat terupdate real-time

### **Skenario 4: Monitoring Real-time**
1. Export "Data Pemilih CSV" untuk cek partisipasi
2. Export "Hasil Voting CSV" untuk analisis hasil
3. Gunakan "Laporan Lengkap JSON" untuk backup

---

**SMOCCE 2025** - Sistem Import/Export Data Pemilih yang Efisien untuk Skala Besar
