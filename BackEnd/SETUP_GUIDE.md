# Quick Setup Guide

## Step 1: Install Dependencies

```bash
cd BackEnd
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

## Step 2: Setup MySQL Database

1. Open MySQL command line or MySQL Workbench
2. Create the database:
```sql
CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Step 3: Configure Environment Variables

Create a `.env` file in the `BackEnd` directory:

```env
SECRET_KEY=django-insecure-change-this-in-production-use-a-random-string
DEBUG=True
DB_NAME=marketplace_db
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_HOST=localhost
DB_PORT=3306
```

**Important:** Replace `your_mysql_password_here` with your actual MySQL root password.

## Step 4: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Step 5: Create Admin User

```bash
python manage.py createsuperuser
```

When prompted:
- **Username (phone):** Enter a phone number (e.g., `+22242038210`)
- **Full name:** Enter your full name
- **Password:** Enter a secure password

## Step 6: Run the Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## Troubleshooting

### MySQL Connection Error

If you get a MySQL connection error:
1. Make sure MySQL is running
2. Check your `.env` file has correct credentials
3. Verify the database exists

### mysqlclient Installation Error (Windows)

If you have trouble installing `mysqlclient` on Windows:
1. Install MySQL Connector/C from MySQL website
2. Or use `pip install mysqlclient` with pre-built wheels
3. Alternative: Use `pymysql` (modify settings.py to use it)

### Port Already in Use

If port 8000 is already in use:
```bash
python manage.py runserver 8001
```

## Testing the API

You can test the API using curl or Postman:

```bash
# Register a user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+22242038210", "full_name": "Test User", "password": "Test1234", "confirm_password": "Test1234"}'

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+22242038210", "password": "Test1234"}'
```

## Next Steps

- Connect your frontend to the API
- Update frontend API endpoints to point to `http://localhost:8000/api/`
- Test all endpoints
- Configure CORS if needed (already set up for localhost:5173 and localhost:3000)

