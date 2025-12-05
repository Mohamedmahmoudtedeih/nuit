# Troubleshooting Guide

## "Failed to fetch" Error in Signup/Login

### Common Causes:

1. **Backend Server Not Running**
   - Make sure Django server is running
   - Check: `http://localhost:8000/api/` should show API info

2. **Wrong Port**
   - Backend should be on port 8000
   - Frontend should be on port 5173 (Vite default)

3. **CORS Issues**
   - Backend is configured for `localhost:5173` and `localhost:3000`
   - If using different port, update `BackEnd/marketplace/settings.py`

### How to Fix:

1. **Start Backend Server:**
   ```bash
   cd BackEnd
   venv\Scripts\activate
   python manage.py runserver
   ```

2. **Check Backend is Running:**
   - Open browser: `http://localhost:8000/api/`
   - Should see JSON with API endpoints

3. **Check Frontend Port:**
   - Make sure frontend is running
   - Usually on `http://localhost:5173`

4. **Check Browser Console:**
   - Open Developer Tools (F12)
   - Check Console tab for errors
   - Check Network tab to see if request is being sent

5. **Verify Database:**
   - Make sure MySQL/XAMPP is running
   - Check `.env` file has correct database credentials

### Testing the Connection:

1. Open browser console (F12)
2. Go to Network tab
3. Try to sign up
4. Check if request appears:
   - If NO request: Frontend issue
   - If request with error: Backend issue
   - If "Failed to fetch": Server not running or CORS

### Quick Test:

Open this URL in browser:
```
http://localhost:8000/api/auth/register/
```

If you see an error page (not "Failed to fetch"), backend is running but endpoint might have issues.

If you see "Failed to fetch" or connection error, backend is NOT running.


