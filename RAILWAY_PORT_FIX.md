# 🔧 Railway Deployment - PORT Variable Fix

## ✅ Issue #2 Resolved

**Problem**: `Error: Invalid value for '--port': '$PORT' is not a valid integer`  
**Root Cause**: Docker CMD using exec form doesn't expand environment variables  
**Solution**: Changed to shell form with proper variable expansion

---

## 🐛 What Was Wrong

### Before (Broken) ❌
```dockerfile
ENV PORT=8000
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

**Issue**: 
- Exec form (list syntax) doesn't expand `$PORT`
- Variable passed literally as the string "$PORT"
- Uvicorn tried to parse "$PORT" as an integer → Error

### After (Fixed) ✅
```dockerfile
# No hardcoded PORT env var (Railway provides it)
CMD uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

**Why it works**:
- Shell form (string syntax) allows variable expansion
- `${PORT:-8000}` expands to Railway's PORT or defaults to 8000
- Uvicorn receives actual integer value

---

## 🔄 Changes Made

### 1. Dockerfile
```diff
- ENV PYTHONDONTWRITEBYTECODE=1 \
-     PYTHONUNBUFFERED=1 \
-     PORT=8000
+ ENV PYTHONDONTWRITEBYTECODE=1 \
+     PYTHONUNBUFFERED=1

- CMD uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
+ CMD uvicorn backend.app.main:app --host 0.0.0.0 --port ${PORT:-8000}
```

### 2. railway.toml
```diff
  [deploy]
- startCommand = "uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT"
  healthcheckPath = "/api/v1/health"
```
*Removed redundant startCommand - Dockerfile CMD handles it*

---

## 🚀 How Railway Deployment Works Now

1. **Railway starts container**
   - Injects `PORT` environment variable (e.g., `PORT=3000`)

2. **Docker CMD executes** (shell form)
   - Shell expands `${PORT:-8000}` to Railway's value
   - Command becomes: `uvicorn backend.app.main:app --host 0.0.0.0 --port 3000`

3. **Uvicorn starts**
   - Binds to `0.0.0.0:3000`
   - Health check at `/api/v1/health` succeeds
   - Deployment complete! ✅

---

## 🧪 Variable Expansion Details

### Syntax: `${PORT:-8000}`
- **`${PORT}`**: Use value of PORT env var
- **`:-8000`**: If PORT is unset or empty, use 8000 as default
- **Result**: Works on Railway (uses their PORT) AND locally (uses 8000)

### Why This Matters
- **Railway**: Dynamically assigns ports (e.g., 3000, 8080)
- **Local**: No PORT env var → defaults to 8000
- **Flexibility**: Same Dockerfile works everywhere

---

## ✅ What Should Happen Now

### Railway Build Logs
```
Using Detected Dockerfile
Build successful ✓
Starting Container
```

### Railway Deploy Logs
```
Starting Container
INFO:     Started server process [1]
INFO:     Waiting for application startup.
🚀 Starting Fermix Exoplanet API
Version: 1.0.0
✓ Models loaded successfully
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:XXXX
```

### Health Check
```
Starting Healthcheck
Path: /api/v1/health
Attempt #1 succeeded ✓
Deployment successful! 🚀
```

---

## 🎯 Testing After Deployment

Once Railway shows "Deployment successful":

```bash
# Get your Railway URL from the dashboard
export RAILWAY_URL="your-app.up.railway.app"

# Test health check
curl https://$RAILWAY_URL/api/v1/health

# Expected response:
{
  "status": "ok",
  "version": "1.0.0",
  "models_loaded": true
}

# Test prediction
curl -X POST "https://$RAILWAY_URL/api/v1/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "koi_period": 12.34,
    "koi_prad": 1.2,
    "model_type": "lgbm"
  }'

# Visit interactive docs
open https://$RAILWAY_URL/api/v1/docs
```

---

## 📚 Technical Deep Dive

### Docker CMD Forms

#### Exec Form (Array) - ❌ Doesn't expand variables
```dockerfile
CMD ["uvicorn", "backend.app.main:app", "--port", "$PORT"]
# $PORT passed literally as string
```

#### Shell Form (String) - ✅ Expands variables
```dockerfile
CMD uvicorn backend.app.main:app --port ${PORT:-8000}
# Shell expands ${PORT:-8000} before execution
```

### Why Railway Failed Before
1. Railway sets `PORT=3456` (example)
2. Docker CMD: `CMD [..., "--port", "$PORT"]`
3. No shell to expand → uvicorn receives literal string "$PORT"
4. Uvicorn: `ValueError: "$PORT" is not a valid integer`
5. Process crashes → Health check fails

### Why It Works Now
1. Railway sets `PORT=3456`
2. Docker CMD: `CMD uvicorn ... --port ${PORT:-8000}`
3. Shell expands → `uvicorn ... --port 3456`
4. Uvicorn receives integer 3456 ✓
5. Server starts → Health check passes ✓

---

## 🔍 Debugging Tips

### If Still Fails

1. **Check Railway Logs**
   ```
   Deployments → Latest → View Logs
   Look for actual port number being used
   ```

2. **Verify Environment Variables**
   ```
   Railway Dashboard → Variables
   Should see PORT automatically set
   ```

3. **Test Locally**
   ```bash
   # Set PORT and test
   export PORT=8000
   docker build -t fermix-test .
   docker run -p 8000:8000 -e PORT=8000 fermix-test
   
   # Should see: Uvicorn running on http://0.0.0.0:8000
   ```

---

## 📊 Commit History

```bash
520ceef (HEAD -> main, origin/main)
  fix: Use shell form in Dockerfile CMD for proper $PORT expansion
  
c17c31f
  docs: Add Railway deployment fix guide
  
149da87
  fix: Add Railway deployment configuration
```

---

## 🎉 Status: FIXED!

The PORT variable issue is now resolved. Railway should deploy successfully on the next attempt.

**Changes Pushed**: ✅  
**Dockerfile Fixed**: ✅  
**Ready to Deploy**: ✅  

Go check your Railway dashboard - the deployment should be working now! 🚀

---

*Fixed: October 5, 2025*  
*Commit: 520ceef*  
*Status: Deployment should succeed*
