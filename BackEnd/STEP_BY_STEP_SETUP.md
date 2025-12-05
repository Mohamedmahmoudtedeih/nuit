# Step-by-Step Setup Guide

Follow these steps in order to complete the backend setup.

## ✅ Step 1: Install Dependencies (COMPLETED)
You've already done this!

---

## 📋 Step 2: Create MySQL Database

You have **3 options** to create the database:

### Option A: Using MySQL Command Line
1. Open Command Prompt or PowerShell
2. Navigate to MySQL bin directory (usually `C:\Program Files\MySQL\MySQL Server X.X\bin`)
3. Or if MySQL is in PATH, just run:
```bash
mysql -u root -p
```
4. Enter your MySQL root password when prompted
5. Run this SQL command:
```sql
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
6. Type `exit` to leave MySQL

### Option B: Using MySQL Workbench (Easiest)
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Click on "SQL Editor" or press `Ctrl+Shift+Enter`
4. Copy and paste this command:
```sql
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
5. Click the execute button (⚡) or press `Ctrl+Enter`
6. You should see "1 row(s) affected"

### Option C: Using the SQL File
1. Open MySQL Workbench
2. Connect to your server
3. Go to File → Open SQL Script
4. Select `setup_database.sql` from the BackEnd folder
5. Execute it

**Verify the database was created:**
```sql
SHOW DATABASES;
```
You should see `marketplace_db` in the list.

---

## ⚙️ Step 3: Create .env File

### Option A: Use the Python Script (Recommended)
1. Make sure you're in the BackEnd directory
2. Activate your virtual environment:
```bash
venv\Scripts\activate
```
3. Run the script:
```bash
python create_env.py
```
4. Follow the prompts to enter your MySQL credentials

### Option B: Create Manually
1. In the `BackEnd` folder, create a new file named `.env` (with the dot at the beginning)
2. Copy this content into it:
```env
SECRET_KEY=django-insecure-change-this-in-production-use-a-random-string
DEBUG=True
DB_NAME=marketplace_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_HOST=localhost
DB_PORT=3306
```
3. **IMPORTANT:** Replace `your_mysql_password_here` with your actual MySQL root password
4. If your MySQL has no password, leave `DB_PASSWORD=` empty

---

## 🔄 Step 4: Run Migrations

1. Make sure you're in the BackEnd directory
2. Make sure your virtual environment is activated:
```bash
venv\Scripts\activate
```
3. Create migration files:
```bash
python manage.py makemigrations
```
4. Apply migrations to create database tables:
```bash
python manage.py migrate
```

**Expected output:**
- You should see messages like "Creating migrations..."
- Then "Applying migrations..."
- No errors should appear

**If you get a MySQL connection error:**
- Check that MySQL is running
- Verify your `.env` file has correct credentials
- Make sure the database `marketplace_db` exists

---

## 👤 Step 5: Create Admin User

1. Make sure virtual environment is activated
2. Run:
```bash
python manage.py createsuperuser
```
3. You'll be prompted for:
   - **Phone (username):** Enter a phone number (e.g., `+22242038210` or `22242038210`)
   - **Full name:** Enter your full name (e.g., `Admin User`)
   - **Email:** Press Enter to skip or enter an email
   - **Password:** Enter a secure password (you'll be asked twice)

**Note:** The phone number will be your login username.

---

## 🚀 Step 6: Start the Server

1. Make sure virtual environment is activated
2. Run:
```bash
python manage.py runserver
```

**Expected output:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

3. Open your browser and go to:
   - **API Root:** http://localhost:8000/
   - **Admin Panel:** http://localhost:8000/admin/
   - **API Auth:** http://localhost:8000/api/auth/

4. Test the admin panel:
   - Go to http://localhost:8000/admin/
   - Login with the phone and password you created in Step 5

---

## ✅ Verification Checklist

- [ ] MySQL database `marketplace_db` created
- [ ] `.env` file created with correct MySQL credentials
- [ ] Migrations run successfully (`python manage.py migrate`)
- [ ] Admin user created (`python manage.py createsuperuser`)
- [ ] Server starts without errors (`python manage.py runserver`)
- [ ] Can access admin panel at http://localhost:8000/admin/

---

## 🆘 Troubleshooting

### "Can't connect to MySQL server"
- Make sure MySQL service is running
- Check Windows Services: Search "Services" → Find "MySQL" → Make sure it's "Running"

### "Access denied for user 'root'"
- Check your MySQL password in `.env` file
- Try resetting MySQL root password if needed

### "Unknown database 'marketplace_db'"
- Make sure you created the database (Step 2)
- Check the database name in `.env` matches

### "No module named 'mysqlclient'"
- Make sure virtual environment is activated
- Try: `pip install mysqlclient`
- If that fails on Windows, you might need to install MySQL Connector/C first

### Port 8000 already in use
- Use a different port: `python manage.py runserver 8001`
- Or stop the other service using port 8000

---

## 🎉 Next Steps After Setup

Once everything is working:
1. Test the API endpoints (see README.md)
2. Connect your frontend (see API_INTEGRATION.md)
3. Start developing!

