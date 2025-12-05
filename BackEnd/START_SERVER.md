# How to Start the Backend Server

## Quick Start

1. **Open a new terminal/command prompt**

2. **Navigate to BackEnd folder:**
   ```bash
   cd C:\Users\HP\Downloads\Nuit\BackEnd
   ```

3. **Activate virtual environment:**
   ```bash
   venv\Scripts\activate
   ```

4. **Start the server:**
   ```bash
   python manage.py runserver
   ```

5. **You should see:**
   ```
   Starting development server at http://127.0.0.1:8000/
   Quit the server with CTRL-BREAK.
   ```

## Keep This Terminal Open!

**IMPORTANT:** Keep the terminal window open while using the website. If you close it, the server stops and you'll get "Cannot connect to server" errors.

## Verify Server is Running

Open your browser and go to:
```
http://localhost:8000/api/
```

You should see JSON with API endpoints. If you see this, the server is running correctly!

## Troubleshooting

### "Port 8000 already in use"
- Another process is using port 8000
- Use a different port: `python manage.py runserver 8001`
- Then update frontend API URL to `http://localhost:8001/api`

### "ModuleNotFoundError: No module named 'django'"
- Virtual environment not activated
- Run: `venv\Scripts\activate` first

### "Can't connect to MySQL"
- Make sure XAMPP MySQL is running
- Check `.env` file has correct database credentials

## Always Start Server Before Using Website

The backend server must be running for:
- ✅ User registration
- ✅ User login
- ✅ Creating listings
- ✅ Viewing listings
- ✅ All API calls


