# 🔥 Firebase Realtime Database (RTDB) Setup Guide

## ✅ What's Been Implemented

The codebase has been **fully converted from Firestore to Firebase Realtime Database (RTDB)**. All references to Firestore have been replaced:

### Changed Imports
```javascript
// ❌ OLD (Firestore)
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, onSnapshot, ... } from "firebase-firestore.js"

// ✅ NEW (Realtime Database)
import { getDatabase, ref, push, set, get, onValue, off, update, remove, serverTimestamp } from "firebase-database.js"
```

### Changed Database Initialization
```javascript
// ❌ OLD
const db = initializeFirestore(app, { localCache: persistentLocalCache() });

// ✅ NEW
const db = getDatabase(app);
```

### Changed All Operations

| Operation | Firestore | RTDB |
|-----------|-----------|------|
| **Send Message** | `addDoc(collection(db, 'chats'), {...})` | `push(ref(db, 'chats')).key` then `set()` |
| **Read Data** | `getDoc(doc(db, 'path'))` | `get(ref(db, 'path'))` |
| **Listen to Changes** | `onSnapshot(query(...), snap => {...})` | `onValue(ref(db, 'path'), snap => {...})` |
| **Update Data** | `setDoc(doc(db, 'path'), {...}, {merge: true})` | `update(ref(db, 'path'), {...})` |
| **Delete Data** | `deleteDoc(doc(db, 'path'))` | `remove(ref(db, 'path'))` |
| **Server Timestamp** | `serverTimestamp()` | `Date.now()` (RTDB uses milliseconds) |

---

## 📋 What You Need to Provide

### 1. **Firebase Project with Realtime Database Enabled**

You need to have a Firebase project with RTDB initialized. If you don't have it:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (e.g., `mental-health-app-6ac97`)
3. Navigate to **Build → Realtime Database**
4. Click **"Create Database"**
5. Choose region (e.g., `us-central1`)
6. **Select "Start in test mode"** (for development)
7. Click **"Enable"**

### 2. **Database URL**

You'll get a Database URL that looks like:
```
https://mental-health-app-6ac97-default-rtdb.firebaseio.com
```

**Add this to your `.env` file:**
```
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

### 3. **Update Server Configuration** (if using Admin SDK)

If you have a Firebase service account (for server-side operations), update `server.js`:

```javascript
// Optional: Use Admin SDK with RTDB (instead of Firestore)
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/service-account.json'); // or from env

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

const rtdb = admin.database();
```

### 4. **Realtime Database Security Rules**

Set up proper RTDB security rules. Go to **Realtime Database → Rules** and use:

#### **Development Rules (Test Mode - Open)**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

#### **Production Rules (Recommended)**
```json
{
  "rules": {
    "chats": {
      ".indexOn": ["timestamp"],
      "$msgId": {
        ".validate": "newData.hasChildren(['from', 'email', 'text', 'timestamp'])",
        "from": { ".validate": "newData.isString()" },
        "email": { ".validate": "newData.isString()" },
        "text": { ".validate": "newData.isString()" },
        "timestamp": { ".validate": "newData.isNumber()" },
        ".read": true,
        ".write": "auth.uid != null"
      }
    },
    "reports": {
      ".indexOn": ["reportedAt"],
      "$reportId": {
        ".validate": "newData.hasChildren(['msgId', 'chatText', 'from', 'email', 'reportedBy', 'reportedAt'])",
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
        ".validate": "newData.hasChildren(['email'])",
        "name": { ".validate": "newData.isString()" },
        "email": { ".validate": "newData.isString()" },
        "otpVerified": { ".validate": "newData.isBoolean()" },
        "createdAt": { ".validate": "newData.isNumber()" },
        ".read": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()",
        ".write": "auth.uid == $uid || root.child('admins').child(auth.uid).exists()"
      }
    }
  }
}
```

---

## 🗄️ RTDB Structure

Your RTDB will have this structure:

```
your-project-rtdb.firebaseio.com/
├── chats/
│   ├── -NxZa7bqM5Q9Kk2L/
│   │   ├── from: "John Doe"
│   │   ├── email: "john@example.com"
│   │   ├── text: "Hello world"
│   │   ├── timestamp: 1731618234567
│   │   ├── uid: "user123"
│   │   └── reported: false
│   └── -NxZb9cqM5Q9Kk2M/
│       ├── ...
│
├── reports/
│   ├── -NxZc1drM5Q9Kk2N/
│   │   ├── msgId: "-NxZa7bqM5Q9Kk2L"
│   │   ├── chatText: "inappropriate content"
│   │   ├── from: "John Doe"
│   │   ├── email: "john@example.com"
│   │   ├── uid: "user123"
│   │   ├── reportedBy: "admin@example.com"
│   │   └── reportedAt: 1731618334567
│   └── ...
│
├── banned/
│   ├── user123: { email: "john@example.com", bannedAt: 1731618334567 }
│   └── ...
│
├── admins/
│   ├── admin_uid_1: true
│   └── admin_uid_2: true
│
└── users/
    ├── user123/
    │   ├── name: "John Doe"
    │   ├── email: "john@example.com"
    │   ├── otpVerified: true
    │   └── createdAt: 1731618234567
    └── ...
```

---

## 🔧 Configuration Checklist

- [ ] **Firebase Project Created** with Realtime Database enabled
- [ ] **Database URL** obtained and added to `.env`:
  ```
  VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
  ```
- [ ] **Security Rules** set (use test mode for dev, production rules for live)
- [ ] **Firebase Config** in `.env` is complete:
  ```
  VITE_FIREBASE_API_KEY=AIzaSy...
  VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
  VITE_FIREBASE_PROJECT_ID=your-project-id
  VITE_FIREBASE_APP_ID=1:...:web:...
  VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
  ```

---

## ✨ Key Differences Between Firestore & RTDB

| Feature | Firestore | RTDB |
|---------|-----------|------|
| **Data Model** | Documents & Collections | JSON Tree |
| **Querying** | Complex queries (orderBy, where) | Limited (orderByChild, limitToLast) |
| **Indexing** | Automatic for most fields | Manual via `.indexOn` |
| **Real-time Updates** | Via `onSnapshot` | Via `onValue` |
| **Timestamps** | `serverTimestamp()` (Cloud timestamp) | `Date.now()` (milliseconds) |
| **Offline Support** | Persistent cache included | Manual caching |
| **Pricing** | Per read/write operation | Per data transferred |
| **Ideal For** | Complex apps, documents | Simple JSON data, games |

---

## 🚀 Next Steps

1. **Enable Realtime Database** in Firebase Console
2. **Update `.env`** with your Database URL
3. **Set Security Rules** (use test mode for dev, production rules for live)
4. **Commit changes** to git:
   ```bash
   git add -A
   git commit -m "feat: switch from Firestore to Firebase Realtime Database"
   git push origin main
   ```
5. **Deploy to Vercel** and add `VITE_FIREBASE_DATABASE_URL` env variable
6. **Test the application** (chat, login, reporting should work identically)

---

## 🐛 Troubleshooting

### "Permission Denied" on Chat Send
- **Cause**: RTDB rules don't allow unauthenticated writes
- **Fix**: Update rules to allow `auth.uid != null` or use test mode (dev only)

### Chat Messages Not Loading
- **Cause**: RTDB rules restrict reads
- **Fix**: Update rules to allow `.read: true` or `auth.uid != null`

### Timestamps Showing as Numbers
- **Cause**: RTDB stores timestamps as milliseconds (not Cloud timestamps)
- **Fix**: Use `new Date(timestamp)` to convert when displaying

### Reports/Admin Features Not Working
- **Cause**: Missing `admins` node or incorrect rules
- **Fix**: Manually add admin users to `admins` node:
  ```json
  {
    "admins": {
      "admin_uid_from_auth": true
    }
  }
```

---

## 📚 Additional Resources

- [Firebase RTDB Documentation](https://firebase.google.com/docs/database)
- [Security Rules Guide](https://firebase.google.com/docs/database/security)
- [RTDB Best Practices](https://firebase.google.com/docs/database/usage/best-practices)

