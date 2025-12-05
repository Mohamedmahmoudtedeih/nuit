# Marketplace Backend API

Django REST API backend for the Marketplace application (cars and properties).

## Features

- User authentication with phone-based login
- JWT token-based authentication
- CRUD operations for listings (cars and properties)
- Image upload support
- Advanced filtering and search
- Admin dashboard
- MySQL database support

## Prerequisites

- Python 3.8+
- MySQL 5.7+ or MariaDB 10.3+
- pip (Python package manager)

## Installation

1. **Navigate to the BackEnd directory:**
   ```bash
   cd BackEnd
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create MySQL database:**
   ```sql
   CREATE DATABASE marketplace_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

6. **Create `.env` file:**
   Copy `.env.example` to `.env` and update with your database credentials:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   DB_NAME=marketplace_db
   DB_USER=root
   DB_PASSWORD=your-mysql-password
   DB_HOST=localhost
   DB_PORT=3306
   ```

7. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Create a superuser (admin):**
   ```bash
   python manage.py createsuperuser
   ```
   Note: Use phone number as username (e.g., `+22242038210`)

9. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication

- `POST /api/auth/register/` - Register a new user
- `POST /api/auth/login/` - Login user (returns JWT tokens)
- `GET /api/auth/profile/` - Get current user profile (requires authentication)
- `PUT /api/auth/profile/update/` - Update user profile (requires authentication)

### Listings

- `GET /api/listings/` - List all approved listings (with filtering)
- `POST /api/listings/` - Create a new listing (requires authentication)
- `GET /api/listings/{id}/` - Get listing details
- `PUT /api/listings/{id}/` - Update listing (requires authentication, owner only)
- `PATCH /api/listings/{id}/` - Partially update listing
- `DELETE /api/listings/{id}/` - Delete listing (requires authentication, owner only)
- `GET /api/listings/my_listings/` - Get current user's listings
- `POST /api/listings/{id}/approve/` - Approve listing (admin only)
- `POST /api/listings/{id}/reject/` - Reject listing (admin only)
- `POST /api/listings/{id}/mark_sold/` - Mark listing as sold

### Query Parameters for Listings

- `type` - Filter by type: `car` or `property`
- `purpose` - Filter by purpose: `sale` or `rent`
- `status` - Filter by status: `pending`, `approved`, `rejected`, `sold`
- `ad_type` - Filter by ad type: `simple` or `star`
- `min_price` - Minimum price
- `max_price` - Maximum price
- `location` - Search by location
- `make` - Car make (for car listings)
- `min_year` / `max_year` - Car year range
- `property_type` - Property type (for property listings)
- `min_bedrooms` - Minimum bedrooms
- `min_bathrooms` - Minimum bathrooms
- `min_area` - Minimum area
- `search` - Search in title, description, location
- `ordering` - Order by: `price`, `-price`, `created_at`, `-created_at`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. After login, include the token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Example API Requests

### Register User
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+22242038210",
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+22242038210",
    "password": "SecurePass123"
  }'
```

### Create Listing
```bash
curl -X POST http://localhost:8000/api/listings/ \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Mercedes-Benz Classe S 2023" \
  -F "description=Beautiful luxury car" \
  -F "type=car" \
  -F "purpose=sale" \
  -F "price=50000" \
  -F "currency=AED" \
  -F "location=Dubai Marina" \
  -F "ad_type=star" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg" \
  -F "car_details[make]=Mercedes-Benz" \
  -F "car_details[model]=Classe S" \
  -F "car_details[year]=2023" \
  -F "car_details[mileage]=15000" \
  -F "car_details[fuel_type]=Essence" \
  -F "car_details[transmission]=Automatique" \
  -F "car_details[color]=Noir"
```

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/` using your superuser credentials.

## Project Structure

```
BackEnd/
├── marketplace/          # Main project settings
│   ├── settings.py      # Django settings
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py          # WSGI configuration
├── accounts/            # User authentication app
│   ├── models.py        # User model
│   ├── serializers.py   # API serializers
│   ├── views.py         # API views
│   └── urls.py          # URL routes
├── listings/            # Listings app
│   ├── models.py        # Listing, CarDetails, PropertyDetails models
│   ├── serializers.py   # API serializers
│   ├── views.py         # API views
│   └── urls.py          # URL routes
├── media/               # Uploaded files (created automatically)
├── requirements.txt     # Python dependencies
└── manage.py           # Django management script
```

## Notes

- Make sure MySQL is running before starting the server
- The `media/` directory will be created automatically for uploaded images
- For production, set `DEBUG=False` and configure proper `ALLOWED_HOSTS`
- Use a strong `SECRET_KEY` in production
- Consider using environment variables or a secrets manager for sensitive data

