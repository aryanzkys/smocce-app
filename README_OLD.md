# SMOCCE 2025 - Online Voting System

Sistem voting online untuk pemilihan Ketua dan Penanggung Jawab Bidang Science Olympiad Club Chair Election (SMOCCE) 2025.

## 🚀 Features

### User Features
- **Authentication System**: Login menggunakan NISN dan token unik
- **Dual Voting System**: Pemilihan Ketua SOC dan PJ Bidang sesuai dengan bidang user
- **Candidate Information**: Tampilan lengkap profil kandidat dengan visi, misi, dan pengalaman
- **Vote Prevention**: Sistem mencegah double voting
- **Responsive Design**: Optimized untuk desktop dan mobile

### Admin Features
- **Comprehensive Dashboard**: Overview statistik voting real-time
- **User Management**: Monitor status voting semua user
- **Vote Monitoring**: Tracking semua vote yang masuk
- **Candidate Management**: Tampilan semua kandidat yang terdaftar
- **Results Display**: Hasil voting dengan foto dan nama kandidat
- **Data Export**: Export data voting dalam format JSON
- **Vote Reset**: Reset voting status user untuk testing

## 🛠 Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database dan ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **xlsx** - Excel file processing untuk import data

### Frontend
- **Next.js 15.4.2** - React framework dengan App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4.0** - Styling framework
- **JavaScript** - Programming language

## 📁 Project Structure

```
SMOCCE-2025/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js      # Admin dashboard logic
│   │   ├── authController.js       # Authentication logic
│   │   └── candidateController.js  # Candidate management
│   ├── models/
│   │   ├── candidate.js           # Candidate schema
│   │   ├── user.js               # User schema
│   │   └── vote.js               # Vote schema
│   ├── routes/
│   │   ├── admin.js              # Admin API routes
│   │   ├── auth.js               # Auth API routes
│   │   ├── candidates.js         # Candidate API routes
│   │   └── vote.js               # Voting API routes
│   ├── seed/
│   │   ├── importCandidates.js   # Seed candidate data
│   │   └── importPeserta.js      # Seed user data
│   ├── app.js                    # Main server file
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/page.js  # Admin dashboard
│   │   │   └── login/page.js      # Admin login
│   │   ├── dashboard/page.js      # User voting page
│   │   ├── login/page.js          # User login
│   │   ├── thanks/page.js         # Thank you page
│   │   └── page.js                # Landing page
│   ├── components/
│   │   └── CandidateCard.js       # Candidate card component
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Clone repository dan masuk ke folder backend**
```bash
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup environment variables**
```bash
# Buat file .env di folder backend
MONGO_URI=mongodb://localhost:27017/smocce2025
PORT=5000
```

4. **Import data kandidat**
```bash
node seed/importCandidates.js
```

5. **Import data peserta (opsional)**
```bash
# Siapkan file peserta.xlsx di folder seed/
node seed/importPeserta.js
```

6. **Jalankan server**
```bash
npm start
```

Server akan berjalan di `http://localhost:5000`

### Frontend Setup

1. **Masuk ke folder frontend**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Jalankan development server**
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3000`

## 📊 Database Schema

### User Schema
```javascript
{
  nisn: String (unique, required),
  token: String (required),
  bidang: String (required),
  hasVoted: Boolean (default: false)
}
```

### Candidate Schema
```javascript
{
  candidateId: String (unique, required),
  name: String (required),
  type: String (enum: ['ketua', 'pj']),
  bidang: String, // Only for PJ candidates
  photo: String,
  vision: String (required),
  mission: String,
  experience: String,
  isActive: Boolean (default: true)
}
```

### Vote Schema
```javascript
{
  nisn: String,
  bidang: String,
  ketuaId: String,
  pjId: String,
  createdAt: Date (default: Date.now)
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Voting
- `POST /api/vote` - Submit vote

### Candidates
- `GET /api/candidates` - Get all candidates
- `GET /api/candidates/search` - Search candidates by type/bidang
- `GET /api/candidates/:candidateId` - Get candidate details

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/votes` - Get all votes
- `GET /api/admin/results` - Get voting results
- `DELETE /api/admin/users/:nisn/vote` - Reset user vote
- `GET /api/admin/export` - Export all data

## 👥 User Roles & Access

### Regular Users
- Login dengan NISN dan token
- Vote untuk Ketua SOC dan PJ Bidang
- Lihat profil kandidat
- One-time voting only

### Admin
- **Username**: `admin`
- **Password**: `smocce2025`
- Access ke admin dashboard
- Monitor voting statistics
- Manage users dan votes
- Export data
- Reset votes untuk testing

## 🎯 Usage Flow

### User Voting Flow
1. **Landing Page** - Pilih "Login Pemilih"
2. **Login** - Masukkan NISN dan token
3. **Dashboard** - Pilih kandidat Ketua dan PJ Bidang
4. **Submit** - Konfirmasi pilihan
5. **Thank You** - Voting selesai

### Admin Monitoring Flow
1. **Landing Page** - Pilih "Admin Login"
2. **Admin Login** - Masukkan credentials admin
3. **Dashboard** - Monitor statistics dan data
4. **Tabs Navigation**:
   - **Overview**: Statistik umum
   - **Users**: Management user
   - **Votes**: Record voting
   - **Candidates**: Data kandidat
   - **Results**: Hasil voting

## 🔧 Development

### Adding New Candidates
1. Edit `backend/seed/importCandidates.js`
2. Tambahkan data kandidat baru
3. Jalankan: `node seed/importCandidates.js`

### Adding New Users
1. Siapkan file Excel dengan kolom: nisn, token, bidang
2. Simpan sebagai `backend/seed/peserta.xlsx`
3. Jalankan: `node seed/importPeserta.js`

### Customizing UI
- Edit komponen di `frontend/components/`
- Modify pages di `frontend/app/`
- Styling menggunakan Tailwind CSS classes

## 🚀 Production Deployment

### Backend Deployment
1. Setup MongoDB production database
2. Configure environment variables
3. Build dan deploy ke platform pilihan (Heroku, DigitalOcean, etc.)

### Frontend Deployment
1. Update API endpoints ke production URL
2. Build: `npm run build`
3. Deploy ke Vercel, Netlify, atau platform lainnya

## 🔒 Security Considerations

### Current Implementation
- Basic token-based authentication
- CORS protection
- Input validation
- Double voting prevention

### Production Recommendations
- Implement JWT authentication
- Add rate limiting
- Input sanitization
- HTTPS enforcement
- Database security hardening
- Audit logging

## 📈 Monitoring & Analytics

### Available Metrics
- Total users vs voted users
- Turnout percentage
- Votes by bidang
- Real-time voting results
- User activity tracking

### Export Capabilities
- JSON export of all data
- Vote records with timestamps
- User status reports

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📝 License

This project is developed for SMOCCE 2025 election purposes.

## 📞 Support

Untuk pertanyaan atau bantuan teknis, silakan hubungi tim developer SMOCCE 2025.

---

**SMOCCE 2025** - Empowering Democratic Elections in Science Olympiad Community
