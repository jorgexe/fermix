# Deployment Configuration Guide

## Environment Variables Setup

### Frontend (www.fermix.tech)

Your frontend hosting platform needs this environment variable:

```bash
NEXT_PUBLIC_API_BASE_URL=https://fermix-production.up.railway.app/api/v1
```

**Important:** 
- Must include `https://` protocol
- Must NOT have trailing slash after `/api/v1`
- This variable must be set in your hosting platform's dashboard (Vercel, Netlify, etc.)

### Backend (Railway)

Your Railway backend needs these environment variables:

```bash
# CORS Configuration
ALLOWED_ORIGINS=https://www.fermix.tech,https://fermix.tech

# Or use wildcard for development (not recommended for production)
ALLOWED_ORIGINS=*
```

## Current Issue Fix

The error shows the frontend is making requests to:
```
https://www.fermix.tech/fermix-production.up.railway.app/api/v1/dataset
```

This malformed URL occurs when `NEXT_PUBLIC_API_BASE_URL` is set incorrectly (missing `https://` protocol).

### Steps to Fix:

1. **Go to your frontend hosting dashboard** (where www.fermix.tech is hosted)
2. **Navigate to Environment Variables** or **Settings**
3. **Add/Update the variable:**
   - Key: `NEXT_PUBLIC_API_BASE_URL`
   - Value: `https://fermix-production.up.railway.app/api/v1`
4. **Redeploy** the frontend

### Railway Backend Configuration:

1. **Go to Railway dashboard** for your backend service
2. **Navigate to Variables tab**
3. **Add/Update:**
   - Key: `ALLOWED_ORIGINS`
   - Value: `https://www.fermix.tech,https://fermix.tech`
4. **Save** (Railway will auto-redeploy)

## Verification

After deployment, verify:

1. Frontend makes requests to: `https://fermix-production.up.railway.app/api/v1/*`
2. Backend accepts requests from: `https://www.fermix.tech`
3. Check browser console for CORS errors

## Local Development

For local development, use `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Backend `.env`:
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```
