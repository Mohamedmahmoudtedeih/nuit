#!/usr/bin/env python
"""
Quick script to create/update superuser - modify values below and run
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from accounts.models import User

# ===== MODIFY THESE VALUES =====
PHONE = "+22242038210"  # Change this to your phone number
FULL_NAME = "Admin User"  # Change this to your name
PASSWORD = "admin123"  # Change this to your desired password
EMAIL = "admin@example.com"  # Optional, can be None
# ===============================

try:
    user = User.objects.get(phone=PHONE)
    print(f"User exists. Updating...")
    user.full_name = FULL_NAME
    if EMAIL:
        user.email = EMAIL
    user.set_password(PASSWORD)
    user.is_staff = True
    user.is_superuser = True
    user.role = 'admin'
    user.is_active = True
    user.save()
    print(f"✓ Superuser updated! Phone: {PHONE}")
except User.DoesNotExist:
    user = User.objects.create_superuser(
        phone=PHONE,
        password=PASSWORD,
        full_name=FULL_NAME,
        email=EMAIL
    )
    print(f"✓ Superuser created! Phone: {PHONE}")

print(f"\nLogin with:")
print(f"  Phone: {PHONE}")
print(f"  Password: {PASSWORD}")

