# 🚀 PANDUAN DEPLOYMENT BACKEND KE RENDER

## 📋 **LANGKAH-LANGKAH DEPLOYMENT**

### **1. Persiapan Repository**
✅ Repository sudah di GitHub: https://github.com/aryanzkys/smocce-app.git

### **2. Setup MongoDB Atlas (Database)**

#### **Buat MongoDB Atlas Cluster:**
1. **Daftar di MongoDB Atlas**: https://cloud.mongodb.com
2. **Create Free Cluster** (M0 Sandbox - 512MB storage)
3. **Database Access**:
   - Username: `smocce2025`
   - Password: `[generate strong password]`
4. **Network Access**:
   - Add IP: `0.0.0.0/0` (Allow access from anywhere)
5. **Get Connection String**:
   ```
   mongodb+srv://smocce2025:<password>@cluster0.xxxxx.mongodb.net/smocce2025?retryWrites=true&w=majority
   ```

### **3. Deploy Backend ke Render**

#### **Step 1: Buat Akun Render**
1. **Daftar di Render**: https://render.com
2. **Connect GitHub Account**
3. **Authorize Render** untuk akses repository

#### **Step 2: Create Web Service**
1. **Dashboard Render** → **New** → **Web Service**
2. **Connect Repository**: Pilih `aryanzkys/smocce-app`
3. **Service Configuration**:
   ```
   Name: smocce-backend
   Region: Singapore (terdekat dengan Indonesia)
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

#### **Step 3: Environment Variables**
Tambahkan environment variables berikut di Render:

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://smocce2025:<your-password>@cluster0.xxxxx.mongodb.net/smocce2025?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-production-2025
PORT=5000
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### **Step 4: Deploy**
1. **Klik "Create Web Service"**
2. **Wait for deployment** (5-10 menit)
3. **Get Backend URL**: `https://smocce-backend.onrender.com`

### **4. Update Backend untuk Production**

Mari kita update beberapa file untuk production:

#### **Update package.json (backend)**
```json
{
  "name": "smocce-backend",
  "version": "1.0.0",
  "description": "SMOCCE 2025 Backend API",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

#### **Update app.js untuk Production**
```javascript
// Add at the top of app.js
const PORT = process.env.PORT || 5000;

// Update CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

// Add health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Update MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB Atlas');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.error('MongoDB connection error:', err));
```

### **5. Seed Database Production**

Setelah backend deploy, seed database dengan data kandidat:

#### **Option 1: Manual Seed (Recommended)**
1. **Update seed files** dengan MongoDB Atlas connection
2. **Run locally** dengan production MONGO_URI:
   ```bash
   cd backend
   MONGO_URI="mongodb+srv://..." node seed/importCandidates.js
   MONGO_URI="mongodb+srv://..." node seed/sampleUsers.js
   ```

#### **Option 2: API Endpoint Seed**
Tambahkan endpoint seed di `app.js`:
```javascript
// Seed endpoint (remove after seeding)
app.post('/api/seed', async (req, res) => {
  try {
    // Import candidates and sample users
    // ... seeding logic
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### **6. Test Backend Deployment**

#### **Test Endpoints:**
```bash
# Health check
curl https://smocce-backend.onrender.com/health

# Get candidates
curl https://smocce-backend.onrender.com/api/candidates

# Test CORS
curl -H "Origin: https://your-frontend.vercel.app" \
     https://smocce-backend.onrender.com/api/candidates
```

### **7. Frontend Configuration**

Update frontend environment variables:
```env
NEXT_PUBLIC_API_URL=https://smocce-backend.onrender.com
```

### **8. Monitoring & Maintenance**

#### **Render Dashboard Features:**
- **Logs**: Real-time application logs
- **Metrics**: CPU, Memory, Response time
- **Events**: Deployment history
- **Settings**: Environment variables, scaling

#### **Important Notes:**
- **Free Tier**: Service sleeps after 15 minutes of inactivity
- **Cold Start**: First request after sleep takes ~30 seconds
- **Upgrade**: $7/month untuk always-on service
- **Custom Domain**: Available dengan paid plan

### **9. Production Checklist**

#### **Security:**
- ✅ Strong JWT secret
- ✅ MongoDB Atlas IP whitelist
- ✅ CORS properly configured
- ✅ Environment variables secured

#### **Performance:**
- ✅ Database indexes
- ✅ Connection pooling
- ✅ Error handling
- ✅ Logging

#### **Monitoring:**
- ✅ Health check endpoint
- ✅ Error tracking
- ✅ Performance metrics
- ✅ Database monitoring

## 🎯 **HASIL AKHIR**

### **URLs Production:**
- **Backend API**: `https://smocce-backend.onrender.com`
- **Health Check**: `https://smocce-backend.onrender.com/health`
- **Admin API**: `https://smocce-backend.onrender.com/api/admin/stats`

### **Next Steps:**
1. **Deploy Frontend** ke Vercel dengan backend URL
2. **Test Integration** antara frontend dan backend
3. **Import Data** pemilih via admin dashboard
4. **Monitor Performance** dan logs

### **Cost:**
- **MongoDB Atlas**: FREE (512MB)
- **Render**: FREE (dengan sleep) atau $7/month (always-on)
- **Total**: $0-7/month

---

**SMOCCE 2025 Backend siap production di Render!** 🚀
