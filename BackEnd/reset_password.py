#!/usr/bin/env python
"""
Script to reset a user's password.
Usage: python reset_password.py
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from accounts.models import User

def reset_password():
    """Reset a user's password."""
    print("=" * 50)
    print("Reset User Password")
    print("=" * 50)
    
    # List all users
    users = User.objects.all()
    print("\nUsers in database:")
    for i, user in enumerate(users, 1):
        print(f"  {i}. Phone: {user.phone}, Name: {user.full_name}")
    
    # Get phone number
    phone = input("\nEnter phone number to reset password: ").strip()
    if not phone:
        print("Error: Phone number is required!")
        return
    
    # Try to find user (with or without +)
    phone_normalized = phone.strip()
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
                print(f"Error: User with phone {phone} not found!")
                return
    
    print(f"\nFound user: {user.full_name} ({user.phone})")
    
    # Get new password
    new_password = input("Enter new password: ").strip()
    if not new_password:
        print("Error: Password is required!")
        return
    
    confirm_password = input("Confirm new password: ").strip()
    if new_password != confirm_password:
        print("Error: Passwords do not match!")
        return
    
    # Set new password
    user.set_password(new_password)
    user.save()
    
    print(f"\n✓ Password reset successfully!")
    print(f"  Phone: {user.phone}")
    print(f"  Name: {user.full_name}")
    print(f"\nYou can now login with:")
    print(f"  Phone: {user.phone}")
    print(f"  Password: {new_password}")
    print("=" * 50)

if __name__ == '__main__':
    reset_password()

