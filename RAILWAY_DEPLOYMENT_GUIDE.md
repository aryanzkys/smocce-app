# 🚀 RAILWAY DEPLOYMENT GUIDE: SMOCCE 2025 Backend

## 🎯 **MENGAPA RAILWAY?**

### **✅ Keunggulan Railway:**
- **Always-on** bahkan di free tier (tidak sleep seperti Render)
- **Faster deployment** dan build time
- **Better performance** untuk Node.js apps
- **Simpler configuration** dan environment setup
- **Built-in database** support (PostgreSQL, MySQL, Redis)
- **Automatic HTTPS** dan custom domains

### **✅ Railway vs Render:**
```
Railway Free:
- $5 credit/month (cukup untuk SMOCCE)
- Always-on (tidak sleep)
- Faster cold starts
- Better Node.js performance

Render Free:
- Unlimited tapi sleep after 15min
- Slower cold starts
- Limited resources
```

---

## 📋 **STEP-BY-STEP RAILWAY DEPLOYMENT**

### **✅ STEP 1: Setup Railway Account (2 menit)**

1. **Buka**: https://railway.app
2. **Sign up** dengan GitHub account
3. **Authorize Railway** untuk akses repository
4. **Verify email** jika diminta

### **✅ STEP 2: Deploy Backend (5 menit)**

1. **New Project** → **Deploy from GitHub repo**
2. **Select Repository**: `aryanzkys/smocce-app`
3. **Configure Service**:
   ```
   Service Name: smocce-backend
   Root Directory: backend
   Build Command: npm install (auto-detected)
   Start Command: npm start (auto-detected)
   ```

### **✅ STEP 3: Environment Variables**

**Di Railway Dashboard → Variables:**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://prayogoaryan63:2R9x6ywUvXLFxehs@cluster0.o2xr4ur.mongodb.net/smocce2025?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=smocce2025-super-secret-jwt-key-production-change-this
PORT=3000
CORS_ORIGIN=https://smocce-2025.vercel.app
```

**⚠️ PENTING:** Railway menggunakan PORT=3000 secara default

### **✅ STEP 4: Custom Domain (Optional)**

1. **Settings** → **Domains**
2. **Generate Domain** → Railway akan memberikan URL seperti:
   ```
   https://smocce-backend-production-xxxx.up.railway.app
   ```
3. **Custom Domain** (optional):
   ```
   api.smocce2025.com → Point to Railway
   ```

---

## 🎯 **HASIL DEPLOYMENT**

### **✅ Backend URLs:**
- **Railway URL**: `https://smocce-backend-production-xxxx.up.railway.app`
- **Health Check**: `https://your-railway-url.up.railway.app/health`
- **API Endpoints**: `https://your-railway-url.up.railway.app/api/candidates`

### **✅ Update Frontend Environment:**
```env
NEXT_PUBLIC_API_URL=https://smocce-backend-production-xxxx.up.railway.app
```

---

## 🔧 **RAILWAY CONFIGURATION**

### **✅ railway.json (Optional)**
Buat file `backend/railway.json` untuk konfigurasi advanced:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **✅ Nixpacks Configuration**
Railway menggunakan Nixpacks (seperti Heroku buildpacks):
```toml
# backend/nixpacks.toml
[phases.setup]
nixPkgs = ["nodejs-18_x", "npm-9_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## 🚀 **DEPLOYMENT WORKFLOW**

### **✅ Automatic Deployment:**
```
1. Push to GitHub → Railway auto-deploys
2. Build logs → Real-time di Railway dashboard
3. Deploy success → URL ready to use
4. Environment sync → Variables applied automatically
```

### **✅ Manual Deployment:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

---

## 📊 **MONITORING & LOGS**

### **✅ Railway Dashboard Features:**
- **Real-time logs** dengan filtering
- **Metrics** (CPU, Memory, Network)
- **Deployment history** dengan rollback
- **Environment variables** management
- **Custom domains** dan SSL

### **✅ Health Monitoring:**
```bash
# Test health endpoint
curl https://your-railway-url.up.railway.app/health

# Test API endpoints
curl https://your-railway-url.up.railway.app/api/candidates

# Test admin login
curl -X POST https://your-railway-url.up.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"smocce2025"}'
```

---

## 💰 **RAILWAY PRICING**

### **✅ Free Tier:**
```
$5 credit/month (gratis)
Always-on services
No sleep/hibernation
Shared CPU & Memory
Community support
```

### **✅ Usage Estimate untuk SMOCCE:**
```
Backend service: ~$3-4/month
Database calls: Minimal (external MongoDB)
Bandwidth: ~$0.50/month
Total: ~$4/month (masih dalam $5 credit)
```

### **✅ Pro Tier ($20/month):**
```
$20 credit/month
Priority support
More resources
Team collaboration
Advanced metrics
```

---

## 🔄 **MIGRATION DARI RENDER**

### **✅ Jika sudah deploy di Render:**
1. **Keep Render running** sementara
2. **Deploy ke Railway** dengan config yang sama
3. **Test Railway deployment** thoroughly
4. **Update frontend** environment variables
5. **Switch traffic** ke Railway
6. **Delete Render service** setelah yakin

### **✅ Zero-downtime Migration:**
```
1. Deploy ke Railway (parallel dengan Render)
2. Test Railway endpoints
3. Update Vercel environment variables
4. Monitor for 24 hours
5. Decommission Render
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

**1. Build Failed**
```
Check: Node.js version (Railway auto-detects)
Verify: package.json scripts
Review: Build logs in Railway dashboard
```

**2. Environment Variables**
```
Check: All required variables set
Verify: MongoDB connection string format
Test: Variables in Railway dashboard
```

**3. Port Configuration**
```
Issue: Railway uses PORT=3000 by default
Solution: Update backend to use process.env.PORT
Check: app.js listens on correct port
```

**4. CORS Issues**
```
Update: CORS_ORIGIN with Railway URL
Redeploy: After environment changes
Test: Browser network tab for CORS errors
```

---

## 🎯 **FINAL CONFIGURATION**

### **✅ Backend (Railway):**
```
URL: https://smocce-backend-production-xxxx.up.railway.app
MongoDB: Your existing connection string
Environment: Production-ready
Always-on: No sleep issues
```

### **✅ Frontend (Vercel):**
```
URL: https://smocce-2025.vercel.app
API URL: Railway backend URL
Environment: Updated with Railway endpoint
Integration: Tested and working
```

### **✅ Complete Stack:**
```
Database: MongoDB Atlas (Free)
Backend: Railway ($5 credit/month)
Frontend: Vercel (Free)
Total Cost: $0/month (within free credits)
```

---

## 🎉 **DEPLOYMENT CHECKLIST**

### **✅ Railway Backend:**
- [ ] Account created and verified
- [ ] Repository connected
- [ ] Environment variables configured
- [ ] MongoDB connection tested
- [ ] Health endpoint responding
- [ ] API endpoints working
- [ ] CORS configured for Vercel

### **✅ Vercel Frontend:**
- [ ] Environment updated with Railway URL
- [ ] Redeployed with new API endpoint
- [ ] Integration tested
- [ ] All pages loading
- [ ] API calls working
- [ ] Mobile responsive

### **✅ Integration:**
- [ ] Frontend → Railway backend working
- [ ] Authentication flow tested
- [ ] Dashboard loading candidates
- [ ] Admin panel accessible
- [ ] No CORS errors
- [ ] Performance acceptable

---

**🚀 RAILWAY DEPLOYMENT READY!**

**Railway URL**: `https://smocce-backend-production-xxxx.up.railway.app`
**Vercel URL**: `https://smocce-2025.vercel.app`
**Always-on**: ✅ No sleep issues
**Cost**: $0/month (within free credits)

**Railway memberikan performance yang lebih baik dan always-on service bahkan di free tier!**
