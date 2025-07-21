# 🚀 STEP-BY-STEP: Deploy SMOCCE Backend ke Render

## 📋 **CHECKLIST DEPLOYMENT**

### **✅ STEP 1: Setup MongoDB Atlas (5 menit)**

1. **Buka MongoDB Atlas**: https://cloud.mongodb.com
2. **Sign Up/Login** dengan Google atau email
3. **Create New Project**: "SMOCCE 2025"
4. **Build Database** → **FREE (M0 Sandbox)**
5. **Choose Provider**: AWS, Region: Singapore (ap-southeast-1)
6. **Cluster Name**: "smocce-cluster"
7. **Create Cluster** (tunggu 3-5 menit)

### **✅ STEP 2: Setup Database Access**

1. **Database Access** → **Add New Database User**:
   ```
   Username: smocce2025
   Password: [Generate Secure Password] - SIMPAN PASSWORD INI!
   Database User Privileges: Read and write to any database
   ```

2. **Network Access** → **Add IP Address**:
   ```
   Access List Entry: 0.0.0.0/0 (Allow access from anywhere)
   Comment: Render deployment
   ```

3. **Get Connection String**:
   - **Connect** → **Drivers** → **Node.js**
   - Copy connection string:
   ```
   mongodb+srv://smocce2025:<password>@smocce-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - **Replace `<password>`** dengan password yang tadi dibuat

### **✅ STEP 3: Deploy ke Render (10 menit)**

1. **Buka Render**: https://render.com
2. **Sign Up** dengan GitHub account
3. **Authorize Render** untuk akses repository
4. **New** → **Web Service**
5. **Connect Repository**: Pilih `aryanzkys/smocce-app`

### **✅ STEP 4: Configure Web Service**

**Basic Settings:**
```
Name: smocce-backend
Region: Singapore
Branch: master
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

**Advanced Settings:**
```
Node Version: 18
Auto-Deploy: Yes
```

### **✅ STEP 5: Environment Variables**

Tambahkan environment variables berikut di Render:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://smocce2025:YOUR_PASSWORD@smocce-cluster.xxxxx.mongodb.net/smocce2025?retryWrites=true&w=majority
JWT_SECRET=smocce2025-super-secret-jwt-key-production-change-this
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

**⚠️ PENTING**: 
- Ganti `YOUR_PASSWORD` dengan password MongoDB Atlas
- Ganti `your-frontend-domain.vercel.app` dengan domain frontend nanti

### **✅ STEP 6: Deploy & Test**

1. **Create Web Service** (tunggu 5-10 menit)
2. **Cek Logs** untuk memastikan deployment berhasil
3. **Test Backend URL**: `https://smocce-backend.onrender.com`

**Test Endpoints:**
```bash
# Health check
https://smocce-backend.onrender.com/health

# API info
https://smocce-backend.onrender.com/

# Get candidates (should return empty array initially)
https://smocce-backend.onrender.com/api/candidates
```

### **✅ STEP 7: Seed Database (5 menit)**

**Option A: Manual Seed (Recommended)**
1. **Clone repository** di local:
   ```bash
   git clone https://github.com/aryanzkys/smocce-app.git
   cd smocce-app/backend
   npm install
   ```

2. **Create .env file**:
   ```env
   MONGO_URI=mongodb+srv://smocce2025:YOUR_PASSWORD@smocce-cluster.xxxxx.mongodb.net/smocce2025?retryWrites=true&w=majority
   ```

3. **Seed database**:
   ```bash
   npm run seed:candidates
   npm run seed:users
   ```

**Option B: Via API (Alternative)**
- Buat endpoint seed sementara di backend
- Call endpoint via Postman/curl
- Hapus endpoint setelah seeding

### **✅ STEP 8: Verify Deployment**

**Test semua endpoint:**
```bash
# Get 24 candidates
curl https://smocce-backend.onrender.com/api/candidates

# Test login
curl -X POST https://smocce-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nisn":"12345678","token":"ABC12345"}'

# Admin login
curl -X POST https://smocce-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"smocce2025"}'
```

## 🎯 **HASIL AKHIR**

### **✅ Backend URLs:**
- **Main API**: `https://smocce-backend.onrender.com`
- **Health Check**: `https://smocce-backend.onrender.com/health`
- **Candidates**: `https://smocce-backend.onrender.com/api/candidates`
- **Admin**: `https://smocce-backend.onrender.com/api/admin/stats`

### **✅ Database:**
- **MongoDB Atlas**: Cluster dengan 24 kandidat dan sample users
- **Connection**: Secure dengan authentication
- **Backup**: Automatic dengan Atlas

### **✅ Features Ready:**
- ✅ 24 Kandidat (6 Ketua + 18 PJ)
- ✅ Authentication system
- ✅ Staged voting (PJ & Ketua)
- ✅ Admin dashboard APIs
- ✅ Import/export functionality
- ✅ Security headers & CORS
- ✅ Health monitoring

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

**1. MongoDB Connection Error**
```
Solution: Check MONGO_URI format and password
Verify: Network access allows 0.0.0.0/0
```

**2. Build Failed**
```
Solution: Check Node version (use 18+)
Verify: package.json has correct start script
```

**3. CORS Error**
```
Solution: Update CORS_ORIGIN environment variable
Add frontend domain to allowed origins
```

**4. Service Sleeping (Free Tier)**
```
Issue: Service sleeps after 15 minutes inactivity
Solution: Upgrade to $7/month for always-on
Workaround: Use cron job to ping health endpoint
```

## 💰 **COST BREAKDOWN**

### **Free Tier:**
- **MongoDB Atlas**: FREE (512MB)
- **Render**: FREE (with sleep after 15min)
- **Total**: $0/month

### **Production Ready:**
- **MongoDB Atlas**: FREE (512MB)
- **Render**: $7/month (always-on)
- **Total**: $7/month

## 🔄 **NEXT STEPS**

1. **Deploy Frontend** ke Vercel
2. **Update Frontend** dengan backend URL
3. **Test Integration** end-to-end
4. **Import Real Data** via admin dashboard
5. **Go Live** untuk pemilihan!

---

**🎉 SMOCCE 2025 Backend siap production di Render!**

**Backend URL**: `https://smocce-backend.onrender.com`
**Repository**: https://github.com/aryanzkys/smocce-app
