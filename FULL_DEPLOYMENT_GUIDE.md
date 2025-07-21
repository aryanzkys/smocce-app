# 🚀 COMPLETE DEPLOYMENT GUIDE: SMOCCE 2025

## 📋 **OVERVIEW**

Panduan lengkap untuk deploy SMOCCE 2025 ke production dengan:
- **Backend**: Render + MongoDB Atlas
- **Frontend**: Vercel + Next.js
- **Total waktu**: ~30 menit
- **Total biaya**: $0/month (Free tier)

---

## 🎯 **DEPLOYMENT SEQUENCE**

### **Phase 1: Database Setup (5 menit)**
### **Phase 2: Backend Deployment (10 menit)**  
### **Phase 3: Frontend Deployment (10 menit)**
### **Phase 4: Integration Testing (5 menit)**

---

## 📊 **PHASE 1: DATABASE SETUP**

### **✅ MongoDB Atlas Setup**

1. **Create Account**: https://cloud.mongodb.com
2. **Create Project**: "SMOCCE 2025"
3. **Build Database**: FREE M0 Sandbox
4. **Choose Region**: AWS Singapore (ap-southeast-1)
5. **Cluster Name**: "smocce-cluster"

### **✅ Database Security**

1. **Database Access**:
   ```
   Username: smocce2025
   Password: [Generate & Save Password]
   Role: Read and write to any database
   ```

2. **Network Access**:
   ```
   IP Address: 0.0.0.0/0 (Allow from anywhere)
   Comment: Production deployment
   ```

3. **Connection String**:
   ```
   mongodb+srv://smocce2025:PASSWORD@smocce-cluster.xxxxx.mongodb.net/smocce2025?retryWrites=true&w=majority
   ```

---

## 🖥️ **PHASE 2: BACKEND DEPLOYMENT**

### **✅ Deploy to Render**

1. **Create Account**: https://render.com (with GitHub)
2. **New Web Service** → Connect `aryanzkys/smocce-app`
3. **Configuration**:
   ```
   Name: smocce-backend
   Region: Singapore
   Branch: master
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Node Version: 18
   ```

### **✅ Environment Variables**

```env
NODE_ENV=production
MONGO_URI=mongodb+srv://smocce2025:YOUR_PASSWORD@smocce-cluster.xxxxx.mongodb.net/smocce2025?retryWrites=true&w=majority
JWT_SECRET=smocce2025-super-secret-jwt-key-production-change-this
PORT=5000
CORS_ORIGIN=https://smocce-frontend.vercel.app
```

### **✅ Test Backend**

```bash
# Health check
curl https://smocce-backend.onrender.com/health

# Get candidates (should return 24 candidates)
curl https://smocce-backend.onrender.com/api/candidates

# Admin login test
curl -X POST https://smocce-backend.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"smocce2025"}'
```

---

## 🌐 **PHASE 3: FRONTEND DEPLOYMENT**

### **✅ Deploy to Vercel**

1. **Create Account**: https://vercel.com (with GitHub)
2. **Import Project** → `aryanzkys/smocce-app`
3. **Configuration**:
   ```
   Project Name: smocce-frontend
   Framework: Next.js (auto-detected)
   Root Directory: frontend
   Build Command: npm run build
   Node Version: 18.x
   ```

### **✅ Environment Variables**

```env
NEXT_PUBLIC_API_URL=https://smocce-backend.onrender.com
NEXT_PUBLIC_APP_NAME=SMOCCE 2025
NEXT_PUBLIC_ELECTION_YEAR=2025
```

### **✅ Update Backend CORS**

**Di Render Environment Variables, update:**
```env
CORS_ORIGIN=https://smocce-frontend.vercel.app
```

**Redeploy backend** setelah update CORS.

---

## 🧪 **PHASE 4: INTEGRATION TESTING**

### **✅ Frontend Testing**

1. **Homepage**: https://smocce-frontend.vercel.app
2. **Login Test**: 
   - NISN: `12345678`
   - Token: `ABC12345`
3. **Dashboard**: Should load 24 candidates
4. **Admin**: Login dengan `admin` / `smocce2025`

### **✅ API Integration**

```bash
# Test from frontend to backend
# Open browser console on https://smocce-frontend.vercel.app
# Run: fetch('/api/candidates').then(r => r.json()).then(console.log)
```

### **✅ Mobile Testing**

1. Open frontend URL on mobile device
2. Test responsive design
3. Test voting interface
4. Verify touch interactions

---

## 🎯 **PRODUCTION URLS**

### **✅ Live URLs:**
- **Frontend**: `https://smocce-frontend.vercel.app`
- **Backend**: `https://smocce-backend.onrender.com`
- **Admin**: `https://smocce-frontend.vercel.app/admin/login`
- **Health**: `https://smocce-backend.onrender.com/health`

### **✅ Repository:**
- **GitHub**: https://github.com/aryanzkys/smocce-app

---

## 📊 **FEATURES READY**

### **✅ Voting System:**
- 🗳️ **Staged Voting**: PJ (5 Aug) → Ketua (12 Aug 2025)
- 👥 **24 Kandidat**: 6 Ketua + 18 PJ (9 bidang)
- 🔐 **Authentication**: NISN + Token system
- 📱 **Responsive**: Mobile-friendly interface
- ⚡ **Real-time**: Instant vote validation

### **✅ Admin Features:**
- 📊 **Dashboard**: Real-time statistics
- 👤 **User Management**: Import/export users
- 📈 **Analytics**: Vote tracking and results
- 🔧 **Configuration**: Election period management

### **✅ Technical Features:**
- 🛡️ **Security**: JWT auth, CORS, input validation
- 🚀 **Performance**: CDN, image optimization, caching
- 📱 **PWA Ready**: Can be installed as mobile app
- 🔄 **Auto Deploy**: Git push → automatic deployment

---

## 💰 **COST BREAKDOWN**

### **Free Tier (Recommended):**
```
MongoDB Atlas: FREE (512MB)
Render Backend: FREE (sleeps after 15min)
Vercel Frontend: FREE (100GB bandwidth)
Domain (optional): $10-15/year
Total: $0/month
```

### **Production Tier:**
```
MongoDB Atlas: FREE (512MB)
Render Backend: $7/month (always-on)
Vercel Frontend: FREE (100GB bandwidth)
Custom Domain: $10-15/year
Total: $7/month
```

---

## 🚨 **TROUBLESHOOTING**

### **Backend Issues:**

**1. MongoDB Connection Error**
```
Check: MONGO_URI format and password
Verify: Network access allows 0.0.0.0/0
Test: Connection string in MongoDB Compass
```

**2. Render Build Failed**
```
Check: Node.js version (18.x)
Verify: package.json start script
Review: Build logs in Render dashboard
```

**3. Service Sleeping (Free Tier)**
```
Issue: Backend sleeps after 15min inactivity
Solution: Upgrade to $7/month for always-on
Workaround: Frontend will wake it up automatically
```

### **Frontend Issues:**

**1. API Connection Error**
```
Check: NEXT_PUBLIC_API_URL environment variable
Verify: Backend CORS allows frontend domain
Test: API calls in browser network tab
```

**2. Vercel Build Failed**
```
Check: Node.js version compatibility
Verify: All dependencies in package.json
Review: Build logs in Vercel dashboard
```

**3. CORS Error**
```
Update: Backend CORS_ORIGIN with frontend domain
Redeploy: Backend after CORS update
Test: Browser console for exact error
```

---

## 🎉 **GO LIVE CHECKLIST**

### **✅ Pre-Launch:**
- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] Database seeded with 24 candidates
- [ ] Sample users imported for testing
- [ ] Admin dashboard accessible
- [ ] Mobile responsive testing complete
- [ ] API integration working
- [ ] CORS properly configured

### **✅ Launch Day:**
- [ ] Import real user data (100-200 users)
- [ ] Test with multiple concurrent users
- [ ] Monitor backend logs
- [ ] Monitor frontend analytics
- [ ] Have admin credentials ready
- [ ] Prepare user support

### **✅ Election Days:**
- [ ] **5 Agustus 2025**: PJ Election monitoring
- [ ] **12 Agustus 2025**: Ketua Election monitoring
- [ ] Real-time vote tracking
- [ ] Technical support availability
- [ ] Results compilation ready

---

## 📞 **SUPPORT & MONITORING**

### **Monitoring URLs:**
- **Backend Health**: https://smocce-backend.onrender.com/health
- **Frontend Status**: https://smocce-frontend.vercel.app
- **Admin Dashboard**: https://smocce-frontend.vercel.app/admin/login

### **Key Metrics to Watch:**
- Response times
- Error rates
- Concurrent users
- Vote submission success rate
- Database performance

---

**🎉 SMOCCE 2025 READY FOR PRODUCTION!**

**Deployment Time**: ~30 minutes
**Monthly Cost**: $0 (Free tier) or $7 (Production)
**Capacity**: 100-200 concurrent users
**Uptime**: 99.9% (with paid tiers)

**Repository**: https://github.com/aryanzkys/smocce-app
**Frontend**: https://smocce-frontend.vercel.app
**Backend**: https://smocce-backend.onrender.com

**Ready for SMOCCE 2025 Elections! 🗳️**
