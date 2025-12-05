# Quick Fix - Server Not Starting

## The Problem
You're getting `ModuleNotFoundError: No module named 'pymysql'` because the virtual environment is not activated.

## The Solution

### Step 1: Open a NEW terminal/command prompt

### Step 2: Run these commands ONE BY ONE:

```bash
cd C:\Users\HP\Downloads\Nuit\BackEnd
venv\Scripts\activate
python manage.py runserver
```

**IMPORTANT:** 
- You MUST see `(venv)` at the beginning of your command prompt
- If you don't see `(venv)`, the virtual environment is NOT activated!

### Step 3: You should see:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Step 4: Keep the terminal open!

**DO NOT CLOSE** the terminal window. The server must keep running.

## Alternative: Use the Batch File

1. Go to `BackEnd` folder
2. Double-click `start_server.bat`
3. Keep the window open

## Verify Server is Running

Open browser: `http://localhost:8000/api/`

You should see JSON with API endpoints.

## After Server Starts

1. Go back to your website
2. Try signup/login again
3. It should work now!


