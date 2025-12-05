#!/usr/bin/env python
"""
Script to create or update a superuser account.
Usage: 
    python create_superuser.py
    python create_superuser.py --phone +22242038210 --name "Admin User" --password mypassword
"""
import os
import sys
import django
import argparse

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
django.setup()

from accounts.models import User

def create_or_update_superuser(phone, full_name, password, email=None):
    """Create or update a superuser account."""
    if not phone or not full_name or not password:
        print("Error: Phone, full_name, and password are required!")
        return False
    
    # Check if user exists
    try:
        user = User.objects.get(phone=phone)
        print(f"\nUser with phone {phone} already exists. Updating...")
        
        # Update user
        user.full_name = full_name
        if email:
            user.email = email
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.role = 'admin'
        user.is_active = True
        user.save()
        
        print(f"✓ Superuser updated successfully!")
        print(f"  Phone: {user.phone}")
        print(f"  Name: {user.full_name}")
        print(f"  Email: {user.email or 'N/A'}")
        print(f"  Role: {user.role}")
        
    except User.DoesNotExist:
        print(f"\nCreating new superuser...")
        
        # Create new superuser
        user = User.objects.create_superuser(
            phone=phone,
            password=password,
            full_name=full_name,
            email=email
        )
        
        print(f"✓ Superuser created successfully!")
        print(f"  Phone: {user.phone}")
        print(f"  Name: {user.full_name}")
        print(f"  Email: {user.email or 'N/A'}")
        print(f"  Role: {user.role}")
    
    print("\n" + "=" * 50)
    print("You can now login to the admin panel with:")
    print(f"  Phone: {phone}")
    print(f"  Password: [the password you entered]")
    print("=" * 50)
    return True

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Create or update a superuser account')
    parser.add_argument('--phone', type=str, help='Phone number (e.g., +22242038210)')
    parser.add_argument('--name', type=str, help='Full name')
    parser.add_argument('--password', type=str, help='Password')
    parser.add_argument('--email', type=str, help='Email (optional)')
    
    args = parser.parse_args()
    
    # If arguments provided, use them
    if args.phone and args.name and args.password:
        create_or_update_superuser(args.phone, args.name, args.password, args.email)
    else:
        # Interactive mode
        print("=" * 50)
        print("Create/Update Superuser Account")
        print("=" * 50)
        
        phone = input("Enter phone number (e.g., +22242038210): ").strip()
        if not phone:
            print("Error: Phone number is required!")
            sys.exit(1)
        
        full_name = input("Enter full name: ").strip()
        if not full_name:
            print("Error: Full name is required!")
            sys.exit(1)
        
        email = input("Enter email (optional, press Enter to skip): ").strip() or None
        
        password = input("Enter password: ").strip()
        if not password:
            print("Error: Password is required!")
            sys.exit(1)
        
        confirm_password = input("Confirm password: ").strip()
        if password != confirm_password:
            print("Error: Passwords do not match!")
            sys.exit(1)
        
        create_or_update_superuser(phone, full_name, password, email)
