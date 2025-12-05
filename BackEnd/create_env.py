"""
Script to create .env file interactively
"""
import os

print("=" * 50)
print("Creating .env file for Django Marketplace")
print("=" * 50)
print()

# Get database credentials
db_name = input("Database name (default: marketplace_db): ").strip() or "marketplace_db"
db_user = input("MySQL username (default: root): ").strip() or "root"
db_password = input("MySQL password (press Enter if no password): ").strip()
db_host = input("MySQL host (default: localhost): ").strip() or "localhost"
db_port = input("MySQL port (default: 3306): ").strip() or "3306"

# Generate a random secret key
import secrets
secret_key = secrets.token_urlsafe(50)

env_content = f"""SECRET_KEY={secret_key}
DEBUG=True
DB_NAME={db_name}
DB_USER={db_user}
DB_PASSWORD={db_password}
DB_HOST={db_host}
DB_PORT={db_port}
"""

env_path = os.path.join(os.path.dirname(__file__), '.env')
with open(env_path, 'w') as f:
    f.write(env_content)

print()
print("✅ .env file created successfully!")
print(f"📁 Location: {env_path}")
print()
print("Next steps:")
print("1. Make sure MySQL is running")
print("2. Create the database (see instructions below)")
print("3. Run: python manage.py makemigrations")
print("4. Run: python manage.py migrate")

