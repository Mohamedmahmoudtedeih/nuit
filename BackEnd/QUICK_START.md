# Quick Start - Complete These Steps

## Step 2: Create MySQL Database

**Choose ONE method:**

### Method 1: MySQL Workbench (Easiest)
1. Open **MySQL Workbench**
2. Connect to your MySQL server (usually localhost)
3. In the SQL editor, paste and run:
```sql
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Method 2: Command Line
1. Open Command Prompt
2. Navigate to MySQL bin folder (or use full path):
```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
```
3. Enter your MySQL password
4. Run:
```sql
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

---

## Step 3: Create .env File

1. In the `BackEnd` folder, **create a new file** named `.env`
   - Right-click → New → Text Document
   - Rename it to `.env` (make sure to remove .txt extension)
   - Windows might warn you - click "Yes"

2. **Open `.env`** in Notepad and paste this:

```env
SECRET_KEY=django-insecure-change-this-in-production-use-a-random-string
DEBUG=True
DB_NAME=marketplace_db
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_HOST=localhost
DB_PORT=3306
```

3. **IMPORTANT:** Replace `YOUR_MYSQL_PASSWORD_HERE` with your actual MySQL root password
   - If MySQL has no password, leave it empty: `DB_PASSWORD=`
4. **Save the file**

---

## Step 4: Run Migrations

Open PowerShell in the BackEnd folder and run:

```powershell
# Activate virtual environment
.\venv\Scripts\activate

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

---

## Step 5: Create Admin User

```powershell
# Make sure venv is activated
python manage.py createsuperuser
```

Enter:
- **Phone:** `+22242038210` (or any phone number)
- **Full name:** Your name
- **Password:** Choose a secure password

---

## Step 6: Start Server

```powershell
python manage.py runserver
```

Then visit:
- http://localhost:8000/admin/ (login with your admin credentials)
- http://localhost:8000/api/ (API root)

---

## Need Help?

If you get errors:
1. **MySQL connection error:** Check your `.env` file password is correct
2. **Database doesn't exist:** Make sure you completed Step 2
3. **Module not found:** Make sure venv is activated (`.\venv\Scripts\activate`)

