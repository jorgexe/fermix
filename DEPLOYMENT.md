# Deployment Configuration Guide

## Current Issue: 502 Bad Gateway on Railway

### Status
- ✅ Backend works locally (verified with diagnostic tests)
- ✅ Config.py fixed to handle empty ALLOWED_ORIGINS
- ✅ Code pushed to GitHub (commits: 0caed6e, f807f81)
- ❌ Railway still returning 502 errors
- 🔄 Railway should be rebuilding now with diagnostic logging

### Immediate Action Required

**Go to Railway Dashboard NOW:**
1. Open https://railway.app/dashboard
2. Select your `fermix-production` project
3. Click on the backend service
4. Go to **"Deployments"** tab
5. Check if a new build started (should show commits `0caed6e` or `f807f81`)
6. Click on the latest deployment
7. Check **"Build Logs"** and **"Deploy Logs"** for errors

### What to Look For in Railway Logs

**If build fails:**
- Missing dependencies
- Python version mismatch
- File not found errors

**If deployment fails:**
- Look for this in deploy logs:
  ```
  🚀 Starting Fermix Exoplanet API
  Version: 1.0.0
  API Prefix: /api/v1
  ALLOWED_ORIGINS: ['*']
  PORT: 8000
  Models dir exists: True/False  ← Check this
  Sample data exists: True/False ← Check this
  ✓ Models loaded successfully
  ```

**Common Errors:**
1. **ModuleNotFoundError** → Missing package in requirements.txt
2. **FileNotFoundError** → Data/model files not deployed
3. **Port binding error** → Railway PORT env variable issue
4. **SettingsError** → Still old ALLOWED_ORIGINS code (cache issue)

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

## Troubleshooting Steps

### If Railway Build is Stuck
1. Go to Railway dashboard
2. Click "View Logs" on the latest deployment
3. If stuck on "Building...", manually redeploy:
   - Click three dots (...) menu
   - Select "Redeploy"

### If 502 Persists After Successful Build
1. Check Railway deployment logs show: "✓ Models loaded successfully"
2. Verify Railway environment variables:
   - Go to "Variables" tab
   - Ensure `ALLOWED_ORIGINS` is set (or empty for wildcard)
3. Test the API directly:
   ```bash
   curl https://fermix-production.up.railway.app/api/v1/health
   ```
4. If curl returns 502, check Railway service status

### If Railway Shows "Healthy" but 502 Persists
- This is a Railway routing issue
- Check if domain is properly configured
- Verify no firewall/WAF blocking requests

### Force Railway Cache Clear
If Railway is using old cached code:
1. Railway Dashboard → Service → Settings
2. Scroll to "Danger Zone"
3. Click "Restart Service"
4. Or: Make a small change (add a comment) and push again

## Current Issue Fix

The error shows the frontend is making requests to:
```
https://fermix-production.up.railway.app/api/v1/dataset
```

And getting **502 Bad Gateway** with **CORS error**.

**Root cause:** Backend isn't running on Railway (crashed during startup or health check failed).

**Solution Steps:**
1. ✅ Fixed config.py to handle empty ALLOWED_ORIGINS
2. ✅ Added diagnostic logging to main.py
3. ✅ Pushed to GitHub
4. 🔄 **NOW:** Check Railway deployment logs
5. ⏳ **WAIT:** 2-3 minutes for Railway to rebuild
6. ✅ **TEST:** `curl https://fermix-production.up.railway.app/api/v1/health`

## Verification

After deployment, verify:

1. **Railway logs show successful startup:**
   ```
   ✓ Models loaded successfully
   ```

2. **Health endpoint responds:**
   ```bash
   curl https://fermix-production.up.railway.app/api/v1/health
   # Should return: {"status":"ok","version":"1.0.0","models_loaded":true}
   ```

3. **Dataset endpoint works:**
   ```bash
   curl https://fermix-production.up.railway.app/api/v1/dataset?sample=true
   ```

4. **Frontend can access API** (no CORS errors in browser console)

## Local Development

For local development, use `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

Backend `.env`:
```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

## Quick Test Commands

Test backend health:
```bash
# Should return JSON with status
curl https://fermix-production.up.railway.app/api/v1/health

# Should return API info
curl https://fermix-production.up.railway.app/

# Test with CORS (from your frontend domain)
curl -H "Origin: https://www.fermix.tech" -I https://fermix-production.up.railway.app/api/v1/health
```

Look for `Access-Control-Allow-Origin` header in response.

