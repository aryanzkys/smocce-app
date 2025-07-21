# 🚀 PRIORITAS DEPLOYMENT SMOCCE 2025

## ⭐ **URUTAN DEPLOYMENT YANG BENAR**

### **1. DAHULUKAN BACKEND DI RAILWAY** 
**Alasan:**
- Frontend membutuhkan backend URL untuk environment variables
- Backend harus running dulu sebelum frontend bisa connect
- Railway always-on (tidak sleep seperti Render)
- Performance lebih baik untuk Node.js apps

### **2. BARU FRONTEND DI VERCEL**
- Setelah backend ready, baru deploy frontend
- Set environment variables dengan Railway URL yang sudah fix

---

## 📋 **STEP 1: DEPLOY BACKEND KE RAILWAY**

### **✅ Railway Configuration:**
```
Service Name: smocce-backend
Repository: aryanzkys/smocce-app
Root Directory: backend
Build Command: npm install (auto-detected)
Start Command: npm start (auto-detected)
```

### **✅ Environment Variables di Railway:**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://prayogoaryan63:2R9x6ywUvXLFxehs@cluster0.o2xr4ur.mongodb.net/smocce2025?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=smocce2025-super-secret-jwt-key-production-change-this
PORT=3000
CORS_ORIGIN=https://smocce-2025.vercel.app
```

**⚠️ PENTING:** 
- Railway menggunakan PORT=3000 secara default
- CORS_ORIGIN sudah disesuaikan dengan nama yang diinginkan: `smocce-2025.vercel.app`

---

## 📋 **STEP 2: DEPLOY FRONTEND KE VERCEL**

### **✅ Vercel Configuration:**
```
Project Name: smocce-2025  ← Ini akan jadi smocce-2025.vercel.app
Framework: Next.js (auto-detected)
Root Directory: frontend
Build Command: npm run build
Node Version: 18.x
```

### **✅ Environment Variables di Vercel:**
```env
NEXT_PUBLIC_API_URL=https://smocce-backend-production-xxxx.up.railway.app
NEXT_PUBLIC_APP_NAME=SMOCCE 2025
NEXT_PUBLIC_ELECTION_YEAR=2025
```

---

## 🎯 **HASIL AKHIR:**
- **Backend**: `https://smocce-backend-production-xxxx.up.railway.app`
- **Frontend**: `https://smocce-2025.vercel.app` ✅ (sesuai keinginan)
- **MongoDB**: Ready dengan connection string yang sudah diberikan

---

## 📝 **LANGKAH PRAKTIS:**

### **Phase 1: Backend First (7 menit)**
1. **Buka**: https://railway.app
2. **Sign up** dengan GitHub
3. **New Project** → **Deploy from GitHub repo**
4. **Select**: `aryanzkys/smocce-app`
5. **Configure**:
   - Service Name: `smocce-backend`
   - Root Directory: `backend`
   - Environment: Add semua variables di atas
6. **Deploy** & tunggu selesai (lebih cepat dari Render)
7. **Test**: `https://smocce-backend-production-xxxx.up.railway.app/health`

### **Phase 2: Frontend Second (5 menit)**
1. **Buka**: https://vercel.com
2. **Import project** dari GitHub
3. **PENTING**: Set project name = `smocce-2025` (bukan smocce-frontend)
4. **Configure**:
   - Root Directory: `frontend`
   - Environment: Add variables dengan Railway URL
5. **Deploy**
6. **Test**: `https://smocce-2025.vercel.app`

### **Phase 3: Integration Test (2 menit)**
```bash
# Test backend health
curl https://smocce-backend-production-xxxx.up.railway.app/health

# Test candidates API
curl https://smocce-backend-production-xxxx.up.railway.app/api/candidates

# Test frontend
open https://smocce-2025.vercel.app

# Test login flow
# NISN: 12345678, Token: ABC12345
```

---

## 🚨 **TROUBLESHOOTING**

### **Jika Backend Error:**
```
1. Check MongoDB connection string format
2. Verify environment variables di Railway
3. Check build logs di Railway dashboard
4. Test connection: curl railway-url/health
```

### **Jika Frontend Error:**
```
1. Check NEXT_PUBLIC_API_URL di Vercel (harus Railway URL)
2. Verify backend CORS allows frontend domain
3. Check browser console for API errors
4. Test API calls in network tab
```

### **Jika CORS Error:**
```
1. Update CORS_ORIGIN di Railway environment
2. Redeploy backend setelah update CORS
3. Test dengan browser developer tools
```

---

## ⏱️ **TIMELINE DEPLOYMENT**

### **Total Time: ~14 menit**
- **Backend Setup**: 7 menit (Railway lebih cepat)
- **Frontend Setup**: 5 menit (setelah backend ready)
- **Testing**: 2 menit (integration test)

### **Dependencies:**
```
Backend → MongoDB (sudah ready)
Frontend → Backend (harus deploy backend dulu)
Integration → Both ready
```

### **✅ Railway Advantages:**
- **Always-on**: Tidak sleep seperti Render
- **Faster deployment**: Build time lebih cepat
- **Better performance**: Optimized untuk Node.js
- **$5 credit/month**: Cukup untuk SMOCCE

---

## 🎉 **FINAL CHECKLIST**

### **✅ Backend Ready:**
- [ ] Deployed di Railway
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] Health endpoint responding
- [ ] CORS configured for frontend domain
- [ ] Always-on (tidak sleep)

### **✅ Frontend Ready:**
- [ ] Deployed di Vercel dengan nama `smocce-2025`
- [ ] Environment variables configured dengan Railway URL
- [ ] API connection to Railway backend working
- [ ] All pages loading correctly
- [ ] Mobile responsive

### **✅ Integration Working:**
- [ ] Frontend can call Railway backend APIs
- [ ] Login flow works
- [ ] Dashboard loads candidates
- [ ] Admin panel accessible
- [ ] No CORS errors
- [ ] Performance optimal

---

**🚀 READY TO DEPLOY!**

**Mulai dengan Backend di Railway dulu, baru Frontend di Vercel. Railway memberikan performance yang lebih baik dan always-on service!**

**URL Final:**
- Backend: `https://smocce-backend-production-xxxx.up.railway.app`
- Frontend: `https://smocce-2025.vercel.app` ✅
