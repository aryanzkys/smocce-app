# 📅 SISTEM PEMILIHAN BERTAHAP SMOCCE 2025

## 🎯 **KONSEP PEMILIHAN**

Sistem SMOCCE 2025 menggunakan **pemilihan bertahap** dengan 2 periode terpisah:

### **📋 JADWAL PEMILIHAN**
1. **5 Agustus 2025**: Pemilihan PJ Bidang (00:00 - 23:59 WIB)
2. **12 Agustus 2025**: Pemilihan Ketua SOC (00:00 - 23:59 WIB)

## 🔧 **IMPLEMENTASI TEKNIS**

### **Backend Configuration**
```javascript
// backend/config/election.js
const electionConfig = {
  periods: {
    PJ: {
      name: 'Pemilihan PJ Bidang',
      startDate: new Date('2025-08-05T00:00:00+07:00'),
      endDate: new Date('2025-08-05T23:59:59+07:00'),
      type: 'pj'
    },
    KETUA: {
      name: 'Pemilihan Ketua SOC',
      startDate: new Date('2025-08-12T00:00:00+07:00'),
      endDate: new Date('2025-08-12T23:59:59+07:00'),
      type: 'ketua'
    }
  }
};
```

### **Database Schema Update**
```javascript
// backend/models/vote.js
const voteSchema = new mongoose.Schema({
  nisn: { type: String, required: true, unique: true },
  bidang: { type: String, required: true },
  ketuaId: { type: String, required: false },
  pjId: { type: String, required: false },
  
  // Tracking pemilihan bertahap
  pjVotedAt: { type: Date, default: null },
  ketuaVotedAt: { type: Date, default: null },
  pjCompleted: { type: Boolean, default: false },
  ketuaCompleted: { type: Boolean, default: false }
});
```

### **API Endpoints Baru**
```
GET  /api/vote/status                 - Status periode pemilihan
GET  /api/vote/user-status/:nisn      - Status vote user
POST /api/vote/pj                     - Vote PJ Bidang
POST /api/vote/ketua                  - Vote Ketua SOC
POST /api/vote                        - Legacy endpoint (kompatibilitas)
```

## 🎨 **USER INTERFACE**

### **Dashboard Pemilih Dinamis**
Dashboard akan menampilkan interface yang berbeda berdasarkan periode aktif:

#### **1. Periode Tidak Aktif**
- Menampilkan jadwal pemilihan
- Informasi periode berikutnya
- Status user (NISN, Bidang)

#### **2. Periode PJ (5 Agustus 2025)**
- Header: "Pemilihan PJ Bidang - 5 Agustus 2025"
- Hanya menampilkan kandidat PJ sesuai bidang user
- Submit button khusus untuk PJ
- Status jika sudah vote PJ

#### **3. Periode Ketua (12 Agustus 2025)**
- Header: "Pemilihan Ketua SOC - 12 Agustus 2025"
- Status PJ yang sudah dipilih
- Menampilkan kandidat Ketua SOC
- Submit button khusus untuk Ketua

### **Thanks Page Bertahap**
- **Vote PJ**: Menampilkan info tahap selanjutnya (Ketua SOC)
- **Vote Ketua**: Menampilkan pemilihan selesai

## 🚀 **WORKFLOW PEMILIHAN**

### **Skenario 1: Pemilihan PJ (5 Agustus 2025)**
1. User login dengan NISN + Token
2. Dashboard menampilkan periode PJ aktif
3. User pilih kandidat PJ sesuai bidangnya
4. Submit → Vote PJ tersimpan
5. Thanks page dengan info periode Ketua

### **Skenario 2: Pemilihan Ketua (12 Agustus 2025)**
1. User login dengan NISN + Token yang sama
2. Dashboard menampilkan periode Ketua aktif
3. Menampilkan status PJ yang sudah dipilih
4. User pilih kandidat Ketua SOC
5. Submit → Vote Ketua tersimpan
6. Thanks page pemilihan selesai

### **Skenario 3: Di Luar Periode**
1. User login → Dashboard menampilkan jadwal
2. Informasi periode berikutnya
3. Tidak ada form voting

## 🔐 **KEAMANAN & VALIDASI**

### **Validasi Periode**
```javascript
// Cek periode aktif sebelum vote
const electionStatus = getCurrentElectionPeriod();
if (!electionStatus.active || electionStatus.period !== 'PJ') {
  return res.status(403).json({ 
    message: 'Periode pemilihan PJ tidak aktif' 
  });
}
```

### **Validasi Vote Duplikat**
```javascript
// Cek apakah user sudah vote di periode ini
if (vote && vote.pjCompleted) {
  return res.status(403).json({ 
    message: 'Anda sudah memilih PJ Bidang' 
  });
}
```

### **Session Management**
- User tetap bisa login dengan token yang sama
- Logout otomatis hanya setelah vote Ketua (pemilihan selesai)
- Data vote tersimpan per periode

## 📊 **MONITORING & ADMIN**

### **Admin Dashboard Enhancement**
- Statistik per periode (PJ vs Ketua)
- Export data berdasarkan periode
- Monitor turnout per tahap

### **Export Data Bertahap**
```csv
NISN,Bidang,PJ_Completed,PJ_VotedAt,Ketua_Completed,Ketua_VotedAt
1234567890,Matematika,true,2025-08-05 10:30:00,true,2025-08-12 14:20:00
1234567891,Fisika,true,2025-08-05 11:15:00,false,null
```

## 🎯 **KEUNGGULAN SISTEM BERTAHAP**

### **Untuk Pemilih**
- ✅ Fokus pada satu jenis pemilihan per periode
- ✅ Tidak terburu-buru memilih keduanya sekaligus
- ✅ Bisa memikirkan pilihan Ketua setelah PJ terpilih
- ✅ Interface yang lebih sederhana dan jelas

### **Untuk Organisasi**
- ✅ Hasil PJ bisa diumumkan dulu
- ✅ Kandidat Ketua bisa menyesuaikan strategi
- ✅ Proses pemilihan lebih terstruktur
- ✅ Mengurangi beban server (traffic terbagi)

### **Untuk Admin**
- ✅ Monitoring lebih mudah per periode
- ✅ Troubleshooting lebih fokus
- ✅ Data analytics per tahap
- ✅ Backup dan recovery per periode

## 🔄 **KOMPATIBILITAS**

### **Legacy Support**
- Endpoint `POST /api/vote` tetap tersedia
- Untuk testing atau pemilihan sekaligus
- Backward compatibility dengan sistem lama

### **Migration Path**
- Database schema mendukung kedua mode
- Gradual migration dari sistem lama
- Data existing tetap valid

## 📱 **RESPONSIVE DESIGN**

### **Mobile-First Approach**
- Dashboard responsive untuk semua device
- Touch-friendly candidate cards
- Optimized untuk mobile voting

### **Progressive Enhancement**
- Bekerja tanpa JavaScript (fallback)
- Offline-first untuk reliability
- Fast loading dengan lazy loading

## 🎉 **HASIL IMPLEMENTASI**

### **✅ Yang Sudah Diimplementasi**
- ✅ Konfigurasi periode pemilihan
- ✅ Database schema bertahap
- ✅ API endpoints baru
- ✅ Dashboard dinamis berdasarkan periode
- ✅ Thanks page bertahap
- ✅ Validasi dan keamanan
- ✅ UI/UX yang menarik dan elegan

### **🎯 Siap untuk Production**
- Backend server dengan periode management
- Frontend responsive dengan UI modern
- Database dengan tracking bertahap
- Security validation per periode
- Admin monitoring tools

---

**SMOCCE 2025** - Sistem Pemilihan Bertahap yang Elegan dan User-Friendly! 🚀
