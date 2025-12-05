# Fix Installation Issues

## Problem
`mysqlclient` requires Microsoft Visual C++ Build Tools which can be difficult to install on Windows.

## Solution
We've switched to `pymysql` which is pure Python and doesn't require compilation.

## Steps to Fix

### 1. Reinstall Dependencies

In your terminal (make sure venv is activated), run:

```powershell
cd C:\Users\HP\Downloads\Nuit\BackEnd
venv\Scripts\activate
pip install -r requirements.txt
```

This should now work without errors!

### 2. Verify Installation

Check if Django is installed:

```powershell
python -c "import django; print(django.get_version())"
```

You should see: `4.2.7`

---

## What Changed

- Replaced `mysqlclient==2.2.0` with `pymysql==1.1.0` in requirements.txt
- Added pymysql configuration in `marketplace/__init__.py`

Both work the same way with MySQL, but pymysql is easier to install on Windows.

