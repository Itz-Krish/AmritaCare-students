# ⚡ Quick Reference Guide

## 🎯 Your Next 5 Actions

### 1️⃣ Create GitHub Repository
```powershell
# Go to https://github.com/new
# Name: mental-health-students
# Keep default settings, click "Create"
```

### 2️⃣ Push Your Code
```powershell
cd "c:\Users\singh\Desktop\aaaaa\main copy - Copy"

git remote add origin https://github.com/YOUR_USERNAME/mental-health-students.git
git branch -M main
git push -u origin main
```

### 3️⃣ Set Up Services (If Not Done)

**Firebase:**
- Go to console.firebase.google.com
- Create project, enable Auth, copy config
- Add to `.env`

**Cloudinary:**
- Go to cloudinary.com, sign up
- Create unsigned upload preset named `mental-health-upload`
- Add Cloud Name to `.env`

**FormSubmit:**
- Already configured to send to: singhkrish.np@gmail.com

### 4️⃣ Deploy to Vercel
```
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repo
4. Add all .env variables in Settings
5. Click Deploy
```

### 5️⃣ Test Your Live Site
- Try login with Firebase
- Send a chat message
- Upload a file
- Submit contact form

---

## 📝 Quick Command Reference

### Local Development
```powershell
# Install & run
npm install
npm start

# Now open http://localhost:3000
```

### Git Workflow
```powershell
# Make changes, then:
git add .
git commit -m "Your message"
git push origin main

# Vercel auto-deploys!
```

### Troubleshooting
```powershell
# Check Git status
git status

# View recent commits
git log --oneline -5

# Pull latest from GitHub
git pull origin main
```

---

## 🔑 Environment Variables Needed

```
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=mental-health-upload
VITE_FORMSUBMIT_EMAIL=singhkrish.np@gmail.com
```

---

## 📂 Key Files Explained

| File | Purpose |
|------|---------|
| `index.html` | Main app - login, chat, upload, contact |
| `server.js` | Backend API - chat endpoint |
| `firebase-config.js` | Firebase & Cloudinary setup |
| `.env.example` | Template for env variables |
| `.gitignore` | Prevents .env from being committed |
| `vercel.json` | Vercel deployment config |

---

## ✨ Features Checklist

- [x] Firebase Authentication (login/signup)
- [x] Real-time AI Chat (OpenAI GPT-4)
- [x] File Upload (Cloudinary)
- [x] Contact Form (FormSubmit.io)
- [x] Video Gallery (4 videos)
- [x] Dark Mode Toggle
- [x] Responsive Design
- [x] Vercel Ready
- [x] Git Initialized
- [x] Complete Documentation

---

## 🌐 URLs You'll Need

| Service | URL |
|---------|-----|
| GitHub | https://github.com/new |
| Vercel | https://vercel.com/dashboard |
| Firebase | https://console.firebase.google.com |
| Cloudinary | https://cloudinary.com/console |
| FormSubmit | https://formsubmit.co |

---

## 💡 Pro Tips

1. **Test locally first** before pushing to GitHub
2. **Never commit .env** - it's in .gitignore for a reason
3. **Vercel auto-deploys** - every push to main is live in 1-2 minutes
4. **Check Vercel logs** if something breaks after deployment
5. **Use Cloudinary dashboard** to manage uploaded files

---

## ❓ Need Help?

- **Setup issues?** → Read `SETUP_GUIDE.md`
- **Deployment stuck?** → Read `DEPLOYMENT_GUIDE.md`
- **Project overview?** → Read `README.md`
- **Full summary?** → Read `PROJECT_SUMMARY.md`

---

## 🎉 Current Status

✅ Project ready for deployment
✅ All integrations configured
✅ Documentation complete
✅ Git initialized
✅ Now ready to push to GitHub!

**Next step:** Push to GitHub following the commands above! 🚀

