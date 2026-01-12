# Security Guide

## Environment Variables

This project uses environment variables to manage Firebase configuration. This prevents API keys from being committed to version control.

### Local Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Firebase configuration values in `.env.local`

3. The `.env.local` file is gitignored and will never be committed

### CI/CD Setup (GitHub Actions)

For the CI/CD pipeline to work, you must add the following secrets to your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** for each:

| Secret Name | Value |
|-------------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | `your-project.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Your messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` |

You can find these values in your Firebase Console:
**Project Settings** → **General** → **Your apps** → **SDK setup and configuration**

---

## Firebase Security Best Practices

### Understanding Firebase API Keys

Firebase API keys are **different from typical API keys**:
- They are NOT used to control access to backend resources
- They are safe to include in client-side code (per Firebase docs)
- Access control is handled by **Firebase Security Rules** and **App Check**

However, we still use environment variables to:
1. Stop GitHub secret scanner alerts
2. Allow different configs for dev/staging/prod
3. Follow security best practices

### Essential Security Layers

#### 1. Firebase Security Rules (CRITICAL)

Your Firestore rules should restrict access. Example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Entries belong to users
    match /entries/{entryId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### 2. API Key Restrictions (Recommended)

In Google Cloud Console:
1. Go to **APIs & Services** → **Credentials**
2. Click on your Firebase API key
3. Under **Application restrictions**, select **HTTP referrers**
4. Add your domains:
   - `https://thelastaairbenderang.github.io/*`
   - `http://localhost:*` (for development)

#### 3. Firebase App Check (Optional but Recommended)

App Check helps protect your backend from abuse:
1. Enable App Check in Firebase Console
2. Register your app with reCAPTCHA v3
3. Enforce App Check in your Firebase services

#### 4. Authentication Quotas

If using password-based auth, consider tightening quotas:
1. Go to **Google Cloud Console** → **APIs & Services** → **Quotas**
2. Find `identitytoolkit.googleapis.com`
3. Adjust rate limits to match expected traffic

---

## Rotating Compromised Keys

If you believe your API key has been compromised:

1. **Firebase Console** → **Project Settings** → **General**
2. Scroll to your web app
3. Click the menu (⋮) → **Manage API key in Google Cloud Console**
4. Create a new key with proper restrictions
5. Update your `.env.local` and GitHub Secrets
6. Delete the old key

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore`
- [ ] GitHub Secrets are configured for CI/CD
- [ ] Firebase Security Rules restrict data access
- [ ] API key is restricted to your domains
- [ ] (Optional) App Check is enabled
- [ ] No hardcoded credentials in source code
