# 🚀 STEP-BY-STEP: Deploy SMOCCE Frontend ke Vercel

## 📋 **CHECKLIST DEPLOYMENT FRONTEND**

### **✅ STEP 1: Persiapan Frontend (5 menit)**

#### **Update Environment Variables**
Buat file environment untuk production:

**frontend/.env.local:**
```env
NEXT_PUBLIC_API_URL=https://smocce-backend.onrender.com
NEXT_PUBLIC_APP_NAME=SMOCCE 2025
NEXT_PUBLIC_ELECTION_YEAR=2025
```

**frontend/.env.example:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=SMOCCE 2025
NEXT_PUBLIC_ELECTION_YEAR=2025
```

### **✅ STEP 2: Update Frontend Configuration**

#### **Update next.config.mjs:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
    ];
  },
  images: {
    domains: ['localhost', 'smocce-backend.onrender.com'],
  },
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
```

### **✅ STEP 3: Deploy ke Vercel (10 menit)**

#### **Option A: Via Vercel Dashboard (Recommended)**

1. **Buka Vercel**: https://vercel.com
2. **Sign Up/Login** dengan GitHub account
3. **Import Project** → **Continue with GitHub**
4. **Select Repository**: `aryanzkys/smocce-app`
5. **Configure Project**:
   ```
   Project Name: smocce-frontend
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

#### **Option B: Via Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# Set up and deploy? Y
# Which scope? [your-username]
# Link to existing project? N
# Project name: smocce-frontend
# Directory: ./
```

### **✅ STEP 4: Environment Variables di Vercel**

**Di Vercel Dashboard → Project Settings → Environment Variables:**

```env
NEXT_PUBLIC_API_URL=https://smocce-backend.onrender.com
NEXT_PUBLIC_APP_NAME=SMOCCE 2025
NEXT_PUBLIC_ELECTION_YEAR=2025
```

**Environment untuk semua environments (Production, Preview, Development)**

### **✅ STEP 5: Update Backend CORS**

**Update backend environment di Render:**
```env
CORS_ORIGIN=https://smocce-frontend.vercel.app
FRONTEND_URL=https://smocce-frontend.vercel.app
```

**Atau multiple origins:**
```env
CORS_ORIGIN=https://smocce-frontend.vercel.app,https://your-custom-domain.com
```

### **✅ STEP 6: Test Deployment**

**Test Frontend URLs:**
```
Main App: https://smocce-frontend.vercel.app
Login: https://smocce-frontend.vercel.app/login
Dashboard: https://smocce-frontend.vercel.app/dashboard
Admin: https://smocce-frontend.vercel.app/admin/login
```

**Test Integration:**
1. **Login Page** → Test dengan sample user
2. **Dashboard** → Check kandidat loading
3. **Voting** → Test voting flow
4. **Admin** → Test admin dashboard

### **✅ STEP 7: Custom Domain (Optional)**

**Setup Custom Domain:**
1. **Vercel Dashboard** → **Domains**
2. **Add Domain**: `smocce2025.com`
3. **Configure DNS** sesuai instruksi Vercel
4. **Update CORS** di backend dengan domain baru

## 🎯 **HASIL DEPLOYMENT**

### **✅ Frontend URLs:**
- **Main App**: `https://smocce-frontend.vercel.app`
- **Login**: `https://smocce-frontend.vercel.app/login`
- **Dashboard**: `https://smocce-frontend.vercel.app/dashboard`
- **Admin**: `https://smocce-frontend.vercel.app/admin/login`
- **Check Token**: `https://smocce-frontend.vercel.app/check-token`

### **✅ Integration Ready:**
- ✅ **API Connection** ke Render backend
- ✅ **CORS** properly configured
- ✅ **Authentication** flow working
- ✅ **Responsive Design** di semua device
- ✅ **Modern UI** dengan animations
- ✅ **PWA Ready** untuk mobile experience

## 🔧 **TROUBLESHOOTING**

### **Common Issues:**

**1. API Connection Error**
```
Issue: Cannot connect to backend
Solution: Check NEXT_PUBLIC_API_URL environment variable
Verify: Backend CORS allows frontend domain
```

**2. Build Failed**
```
Issue: Build fails on Vercel
Solution: Check Node.js version compatibility
Verify: All dependencies in package.json
```

**3. CORS Error**
```
Issue: CORS policy blocks requests
Solution: Update backend CORS_ORIGIN
Add: Frontend domain to allowed origins
```

**4. Environment Variables Not Working**
```
Issue: API URL not updating
Solution: Redeploy after adding env vars
Check: NEXT_PUBLIC_ prefix for client-side vars
```

## 💰 **COST BREAKDOWN**

### **Free Tier (Perfect for SMOCCE):**
- **Vercel**: FREE (100GB bandwidth, unlimited deployments)
- **Custom Domain**: FREE (with Vercel)
- **SSL Certificate**: FREE (automatic)
- **Total**: $0/month

### **Pro Features (Optional):**
- **Vercel Pro**: $20/month (advanced analytics, more bandwidth)
- **Custom Domain**: $10-15/year (if buying new domain)

## 🚀 **PERFORMANCE OPTIMIZATIONS**

### **Vercel Automatic Features:**
- ✅ **Edge Network** - Global CDN
- ✅ **Image Optimization** - Automatic WebP conversion
- ✅ **Code Splitting** - Faster page loads
- ✅ **Static Generation** - Pre-rendered pages
- ✅ **Serverless Functions** - API routes
- ✅ **Analytics** - Performance monitoring

### **Next.js Optimizations:**
- ✅ **App Router** - Latest Next.js features
- ✅ **Tailwind CSS** - Optimized styling
- ✅ **Dynamic Imports** - Code splitting
- ✅ **Image Component** - Optimized images
- ✅ **Font Optimization** - Web font loading

## 📱 **MOBILE & PWA**

### **Mobile Optimization:**
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Touch Friendly** - Optimized for mobile voting
- ✅ **Fast Loading** - Optimized for mobile networks
- ✅ **Offline Support** - Basic offline functionality

### **PWA Features (Optional Enhancement):**
```javascript
// Add to next.config.mjs for PWA
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
```

## 🔄 **CI/CD AUTOMATIC DEPLOYMENT**

### **Vercel Git Integration:**
- ✅ **Auto Deploy** - Every push to main branch
- ✅ **Preview Deployments** - For pull requests
- ✅ **Rollback** - Easy rollback to previous versions
- ✅ **Branch Deployments** - Test different features

### **Deployment Workflow:**
```
1. Push to GitHub → Automatic build on Vercel
2. Preview URL → Test before going live
3. Merge to main → Automatic production deployment
4. Domain update → Live in seconds globally
```

## 🎯 **FINAL CHECKLIST**

### **✅ Pre-Launch:**
- [ ] Frontend deployed to Vercel
- [ ] Backend CORS updated with frontend domain
- [ ] Environment variables configured
- [ ] All pages loading correctly
- [ ] API integration working
- [ ] Mobile responsive testing
- [ ] Admin dashboard accessible
- [ ] Sample voting flow tested

### **✅ Go Live:**
- [ ] Import real user data
- [ ] Test with multiple users
- [ ] Monitor performance
- [ ] Setup analytics (optional)
- [ ] Announce to users
- [ ] Monitor during election periods

---

**🎉 SMOCCE 2025 Frontend siap production di Vercel!**

**Frontend URL**: `https://smocce-frontend.vercel.app`
**Backend URL**: `https://smocce-backend.onrender.com`
**Repository**: https://github.com/aryanzkys/smocce-app
