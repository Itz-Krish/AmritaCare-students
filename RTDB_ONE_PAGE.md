# Firebase Realtime Database - One-Page Reference

## 🎯 What You Need to Do

### Step 1️⃣ Firebase Console (2 min)
```
1. firebase.google.com → Console
2. Select "mental-health-app-6ac97"
3. Build → Realtime Database
4. Create Database → Test Mode → Enable
5. Copy the URL (looks like: https://mental-health-app-6ac97-default-rtdb.firebaseio.com)
```

### Step 2️⃣ Update .env (1 min)
```env
# Add this line to your .env file:
VITE_FIREBASE_DATABASE_URL=https://mental-health-app-6ac97-default-rtdb.firebaseio.com
```

### Step 3️⃣ Test Locally (5 min)
```bash
npm start
# Check browser console for: "[DEBUG] Firebase Realtime Database initialized"
# Test: signup → send message → message appears instantly
```

### Step 4️⃣ Vercel Deployment (5 min)
```
1. vercel.com → Your project → Settings
2. Environment Variables
3. Add: VITE_FIREBASE_DATABASE_URL = [your-url]
4. Redeploy
```

---

## 📊 RTDB vs Firestore

| | Firestore | RTDB |
|---|-----------|------|
| **Data** | Documents/Collections | JSON Tree |
| **Send** | `addDoc(collection(...), {})` | `push(ref(...)); set(newRef, {})` |
| **Read** | `getDoc(doc(...))` | `get(ref(...))` |
| **Listen** | `onSnapshot(query(...), snap => {})` | `onValue(ref(...), snap => {})` |
| **ID Format** | `"XyZ123abc"` | `"-NxZa7bqM5Q9"` |
| **Timestamp** | `serverTimestamp()` | `Date.now()` |

---

## 🔐 Security Rules (Copy & Paste)

For **development**, Firebase auto-sets:
```json
{ "rules": { ".read": true, ".write": true } }
```

For **production**, update to:
```json
{
  "rules": {
    "chats": {
      ".indexOn": ["timestamp"],
      "$msgId": {
        ".read": true,
        ".write": "auth.uid != null",
        ".validate": "newData.hasChildren(['from','email','text','timestamp'])"
      }
    },
    "reports": {
      ".indexOn": ["reportedAt"],
      "$reportId": {
        ".read": "root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid != null"
      }
    },
    "banned": {
      "$uid": {
        ".read": true,
        ".write": "root.child('admins').child(auth.uid).exists()"
      }
    },
    "admins": {
      "$uid": {
        ".read": true,
        ".write": "root.child('admins').child(auth.uid).exists()"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()"
      }
    }
  }
}
```

---

## 🗄️ RTDB Structure

```
your-rtdb.firebaseio.com/
├── chats/ ...................... Messages
├── reports/ .................... Reported messages (admin only)
├── banned/ ..................... Banned user IDs
├── admins/ ..................... Admin user IDs
└── users/ ...................... User profiles
```

---

## 🔄 Message Flow

```
User sends message
    ↓
Creates LOCAL message instantly ⏳ sending...
    ↓
Sends to RTDB async (doesn't block UI)
    ↓
RTDB confirms + listener syncs
    ↓
Message ID updated, removes pending ✅ confirmed
```

---

## ✅ Everything Changed in Code

| Component | Changed? | Details |
|-----------|----------|---------|
| Imports | ✅ | Firestore → RTDB imports |
| Init | ✅ | `getDatabase()` instead of `getFirestore()` |
| sendChatMessage() | ✅ | Uses `push()` + `set()` |
| startChatListener() | ✅ | Uses `onValue()` |
| reportChat() | ✅ | Uses `ref()` + `update()` |
| Admin listeners | ✅ | RTDB structure |
| Auth handlers | ✅ | All use RTDB refs |

---

## 🧪 Test Checklist

- [ ] RTDB shows up in Firebase Console
- [ ] Database URL in `.env`
- [ ] App starts without errors
- [ ] Can sign up
- [ ] Can send messages
- [ ] Messages show pending → confirmed
- [ ] Can report messages
- [ ] Admin dashboard works

---

## 🚨 If Stuck

1. **Check console** (F12) for red errors
2. **Verify RTDB enabled** in Firebase Console  
3. **Check `.env`** for Database URL
4. **Read `FIREBASE_RTDB_SETUP.md`** → Troubleshooting section
5. **Contact me** if still stuck

---

## 📚 Full Guides

- `QUICK_RTDB_SETUP.md` ← **15-minute checklist**
- `FIREBASE_RTDB_SETUP.md` ← Complete guide + rules
- `RTDB_ARCHITECTURE.md` ← Visual diagrams

---

## ⏱️ Total Setup Time: **15 minutes**

1. Enable RTDB (2 min)
2. Update .env (1 min)  
3. Test locally (5 min)
4. Deploy (5 min)
5. Verify (2 min)

**Done! 🎉**

