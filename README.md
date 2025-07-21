# 🗳️ SMOCCE 2025 - Sistem Pemilihan Online

**Science Olympiad Club Chair Election 2025** - Sistem pemilihan online yang modern, elegan, dan user-friendly untuk memilih Ketua SOC dan PJ Bidang dengan sistem pemilihan bertahap.

![SMOCCE 2025](https://img.shields.io/badge/SMOCCE-2025-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

## 🎯 **Fitur Utama**

### **📅 Sistem Pemilihan Bertahap**
- **5 Agustus 2025**: Pemilihan PJ Bidang (00:00 - 23:59 WIB)
- **12 Agustus 2025**: Pemilihan Ketua SOC (00:00 - 23:59 WIB)
- **Dynamic Interface**: UI berubah sesuai periode pemilihan aktif

### **🎨 UI/UX Modern & Elegan**
- **Responsive Design**: Mobile-first approach
- **Modern Animations**: Hover effects, transitions, visual feedback
- **Gradient Backgrounds**: Professional appearance
- **Interactive Cards**: Candidate selection dengan visual indicators

### **👥 Manajemen User & Data**
- **Import Excel/CSV**: Upload data pemilih (NISN + Bidang, token auto-generate)
- **24 Kandidat**: 6 Ketua SOC + 18 PJ (9 bidang × 2 kandidat)
- **Export Data**: CSV/JSON untuk analisis dan backup
- **Token Management**: Generate/regenerate token otomatis

### **🔐 Keamanan & Validasi**
- **JWT Authentication**: Secure token-based authentication
- **Period Validation**: Validasi periode pemilihan aktif
- **Vote Tracking**: Mencegah vote duplikat per periode
- **Admin Dashboard**: Monitoring dan management lengkap

## 🚀 **Tech Stack**

### **Frontend**
- **Next.js 15**: React framework dengan App Router
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Modern state management
- **Responsive Design**: Mobile-friendly interface

### **Backend**
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database dengan Mongoose ODM
- **JWT**: JSON Web Token untuk authentication
- **CORS**: Cross-origin resource sharing

### **Database Schema**
- **Users**: NISN, Bidang, Token, hasVoted
- **Votes**: Tracking pemilihan PJ dan Ketua terpisah
- **Candidates**: 24 kandidat dengan data lengkap

## 📋 **Getting Started**

### **Prerequisites**
- Node.js (v16 atau lebih tinggi)
- MongoDB (local atau Atlas)
- npm atau yarn

### **Installation**

1. **Clone repository**
```bash
git clone https://github.com/yourusername/smocce-2025.git
cd smocce-2025
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

4. **Setup environment variables**

**Backend (.env)**
```env
MONGO_URI=mongodb://localhost:27017/smocce2025
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

5. **Seed database dengan kandidat dan sample users**
```bash
cd backend
node seed/importCandidates.js
node seed/sampleUsers.js
```

6. **Start backend server**
```bash
cd backend
npm start
```

7. **Start frontend development server**
```bash
cd frontend
npm run dev
```

## 🎯 **Usage**

### **Akses Sistem**
- **Voting System**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3000/admin/login`
- **Check Token**: `http://localhost:3000/check-token`

### **Default Credentials**
- **Admin**: `admin` / `smocce2025`
- **Sample User**: NISN `1234567890` / Token `SAMPLE01`

### **Workflow Pemilihan**
1. **Login** dengan NISN dan Token
2. **Periode PJ** (5 Agustus): Pilih PJ sesuai bidang
3. **Periode Ketua** (12 Agustus): Pilih Ketua SOC
4. **Thanks Page**: Konfirmasi pemilihan selesai

## 📊 **Fitur Admin**

### **Dashboard Analytics**
- Total users, votes, turnout percentage
- Statistik per bidang dan kandidat
- Real-time monitoring

### **User Management**
- Import Excel/CSV (NISN + Bidang)
- Regenerate token individual
- Reset vote untuk testing
- Export data pemilih

### **Candidate Management**
- Edit 24 kandidat (6 Ketua + 18 PJ)
- Update foto, visi, misi, pengalaman
- Real-time preview

### **Export Features**
- **Data Pemilih CSV**: Status voting per user
- **Hasil Voting CSV**: Detail semua vote
- **Laporan Lengkap JSON**: Comprehensive report
- **Data Mentah JSON**: Raw data backup

## 🚀 **Deployment**

### **Rekomendasi Platform**
1. **Vercel + Railway + MongoDB Atlas** ($5/month)
2. **Netlify + Render + MongoDB Atlas** (FREE/month)
3. **Digital Ocean App Platform** ($12-25/month)

### **Production Setup**
```bash
# Environment variables untuk production
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smocce2025
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

Lihat **DEPLOYMENT_GUIDE.md** untuk panduan lengkap deployment.

## 📁 **Project Structure**

```
smocce-2025/
├── backend/
│   ├── config/           # Election configuration
│   ├── controllers/      # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── seed/            # Database seeding
│   └── app.js           # Express app
├── frontend/
│   ├── app/             # Next.js App Router
│   ├── components/      # React components
│   └── public/          # Static assets
├── docs/
│   ├── EXPORT_GUIDE.md      # Import/Export guide
│   ├── PEMILIHAN_BERTAHAP.md # Staged voting docs
│   └── DEPLOYMENT_GUIDE.md   # Deployment guide
└── template-import-users.csv # Import template
```

## 🔧 **API Endpoints**

### **Authentication**
```
POST /api/auth/login          # User login
POST /api/auth/check-token    # Check token by NISN
```

### **Voting**
```
GET  /api/vote/status         # Election period status
POST /api/vote/pj             # Vote PJ Bidang
POST /api/vote/ketua          # Vote Ketua SOC
GET  /api/vote/user-status/:nisn # User vote status
```

### **Admin**
```
GET  /api/admin/stats         # Dashboard statistics
POST /api/admin/import/users  # Bulk import users
GET  /api/admin/export/*      # Various export formats
PUT  /api/admin/users/:nisn/token # Regenerate token
```

### **Candidates**
```
GET  /api/candidates          # Get all candidates
PUT  /api/admin/candidates/:id # Update candidate
```

## 🛠️ **Development**

### **Available Scripts**

**Backend**
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

**Frontend**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
```

### **Database Seeding**
```bash
node seed/importCandidates.js    # Import 24 candidates
node seed/sampleUsers.js         # Create sample users
node seed/importPeserta.js       # Import from Excel
```

## 📈 **Performance & Scalability**

- **Optimized for 100-200 pemilih**
- **Database indexing** untuk query performance
- **Pagination** untuk large datasets
- **Caching** untuk static data
- **CDN ready** untuk asset delivery

## 🔒 **Security Features**

- **JWT Authentication** dengan secure secrets
- **Input validation** dan sanitization
- **CORS configuration** untuk production
- **Rate limiting** untuk API endpoints
- **Environment variables** untuk sensitive data
- **HTTPS enforcement** di production

## 🤝 **Contributing**

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 **Support**

Untuk bantuan teknis atau pertanyaan:
- Cek **EXPORT_GUIDE.md** untuk panduan import/export
- Lihat **DEPLOYMENT_GUIDE.md** untuk deployment
- Review **PEMILIHAN_BERTAHAP.md** untuk sistem pemilihan

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 **Acknowledgments**

- **Next.js Team** untuk framework yang amazing
- **Tailwind CSS** untuk utility-first CSS
- **MongoDB** untuk database yang flexible
- **Vercel** untuk deployment platform yang excellent

---

**SMOCCE 2025** - Modern, Elegant, dan User-Friendly Voting System! 🚀

Made with ❤️ for Science Olympiad Club
