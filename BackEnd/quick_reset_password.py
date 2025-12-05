#!/usr/bin/env python
"""
Quick script to reset password - modify values below and run
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from accounts.models import User

# ===== MODIFY THESE VALUES =====
PHONE = "22242038210"  # Change this to the phone number you want to reset
NEW_PASSWORD = "newpassword123"  # Change this to your desired password
# ===============================

# Try to find user (with or without +)
phone_normalized = PHONE.strip()
phone_without_plus = phone_normalized.lstrip('+')

try:
    user = User.objects.get(phone=phone_normalized)
except User.DoesNotExist:
    try:
        user = User.objects.get(phone=phone_without_plus)
    except User.DoesNotExist:
        try:
            user = User.objects.get(phone=f'+{phone_without_plus}')
        except User.DoesNotExist:
            print(f"Error: User with phone {PHONE} not found!")
            sys.exit(1)

print(f"Found user: {user.full_name} ({user.phone})")
user.set_password(NEW_PASSWORD)
user.save()

print(f"\n✓ Password reset successfully!")
print(f"\nLogin with:")
print(f"  Phone: {user.phone}")
print(f"  Password: {NEW_PASSWORD}")

