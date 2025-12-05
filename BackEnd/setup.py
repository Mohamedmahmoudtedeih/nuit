"""
Setup script to help initialize the Django project.
Run this after installing dependencies to set up the database.
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'marketplace.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
django.setup()

from django.core.management import execute_from_command_line

if __name__ == '__main__':
    print("Setting up Django Marketplace Backend...")
    print("\n1. Making migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    print("\n2. Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("\n3. Setup complete!")
    print("\nNext steps:")
    print("  - Create a superuser: python manage.py createsuperuser")
    print("  - Run the server: python manage.py runserver")
    print("\nNote: Make sure you have:")
    print("  - Created the MySQL database")
    print("  - Created and configured the .env file")

