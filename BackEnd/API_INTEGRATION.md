# Frontend-Backend Integration Guide

This guide explains how to connect your React frontend to the Django backend API.

## Base URL

Set your API base URL:
```typescript
const API_BASE_URL = 'http://localhost:8000/api';
```

## Authentication Flow

### 1. Update Auth Library

Update `frontEnd/src/lib/auth.ts` to store JWT tokens:

```typescript
const AUTH_KEY = 'marketplace_auth';
const TOKEN_KEY = 'marketplace_token';
const REFRESH_TOKEN_KEY = 'marketplace_refresh_token';

export interface AuthUser {
  id: number;
  phone: string;
  full_name: string;
  email?: string;
  profile_picture?: string;
  role: 'visitor' | 'user' | 'admin';
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export const auth = {
  // Store tokens and user data
  setAuth: (user: AuthUser, tokens: AuthTokens): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, tokens.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
  },

  // Get access token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Check if user is logged in
  isLoggedIn: (): boolean => {
    return auth.getToken() !== null;
  },

  // Get current user
  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null;
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    try {
      return JSON.parse(authData);
    } catch {
      return null;
    }
  },

  // Logout user
  logout: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Check if user is admin
  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.role === 'admin';
  },
};
```

### 2. Create API Client

Create `frontEnd/src/lib/api.ts`:

```typescript
import { auth } from './auth';

const API_BASE_URL = 'http://localhost:8000/api';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = auth.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token expired, try to refresh
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry request with new token
        headers['Authorization'] = `Bearer ${auth.getToken()}`;
        const retryResponse = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers,
        });
        if (!retryResponse.ok) {
          auth.logout();
          window.location.href = '/login';
          throw new Error('Authentication failed');
        }
        return retryResponse.json();
      } else {
        auth.logout();
        window.location.href = '/login';
        throw new Error('Authentication failed');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || error.message || 'Request failed');
    }

    return response.json();
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = auth.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('marketplace_token', data.access);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return false;
  }

  // Auth endpoints
  async register(data: {
    phone: string;
    full_name: string;
    email?: string;
    password: string;
    confirm_password: string;
    profile_picture?: File;
  }) {
    const formData = new FormData();
    formData.append('phone', data.phone);
    formData.append('full_name', data.full_name);
    if (data.email) formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirm_password', data.confirm_password);
    if (data.profile_picture) {
      formData.append('profile_picture', data.profile_picture);
    }

    return fetch(`${this.baseURL}/auth/register/`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }

  async login(phone: string, password: string) {
    return this.request<{ user: any; tokens: { access: string; refresh: string } }>(
      '/auth/login/',
      {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      }
    );
  }

  async getProfile() {
    return this.request('/auth/profile/');
  }

  async updateProfile(data: Partial<{ full_name: string; email: string; profile_picture: File }>) {
    const formData = new FormData();
    if (data.full_name) formData.append('full_name', data.full_name);
    if (data.email) formData.append('email', data.email);
    if (data.profile_picture) formData.append('profile_picture', data.profile_picture);

    const token = auth.getToken();
    return fetch(`${this.baseURL}/auth/profile/update/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  }

  // Listing endpoints
  async getListings(params?: {
    type?: 'car' | 'property';
    purpose?: 'sale' | 'rent';
    min_price?: number;
    max_price?: number;
    location?: string;
    search?: string;
    page?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const query = queryParams.toString();
    return this.request(`/listings/${query ? `?${query}` : ''}`);
  }

  async getListing(id: string) {
    return this.request(`/listings/${id}/`);
  }

  async createListing(data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file: File) => formData.append('images', file));
        } else if (key === 'car_details' || key === 'property_details') {
          Object.entries(value as object).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${subKey}]`, subValue as string);
          });
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const token = auth.getToken();
    return fetch(`${this.baseURL}/listings/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  }

  async updateListing(id: string, data: any) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file: File) => formData.append('images', file));
        } else if (key === 'car_details' || key === 'property_details') {
          Object.entries(value as object).forEach(([subKey, subValue]) => {
            formData.append(`${key}[${subKey}]`, subValue as string);
          });
        } else {
          formData.append(key, value as string);
        }
      }
    });

    const token = auth.getToken();
    return fetch(`${this.baseURL}/listings/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  }

  async deleteListing(id: string) {
    return this.request(`/listings/${id}/`, { method: 'DELETE' });
  }

  async getMyListings() {
    return this.request('/listings/my_listings/');
  }
}

export const api = new ApiClient(API_BASE_URL);
```

### 3. Update Login Page

Update `frontEnd/src/pages/Login.tsx`:

```typescript
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';

// In handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const fullPhone = (countryCode.dialCode.replace('+', '') + formData.phone.replace(/\D/g, '')).replace(/\s/g, '');
    const response = await api.login(fullPhone, formData.password);
    
    auth.setAuth(response.user, response.tokens);
    toast.success('Connexion réussie !');
    
    if (response.user.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }
  } catch (error: any) {
    toast.error(error.message || 'Erreur de connexion');
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Update Signup Page

Update `frontEnd/src/pages/Signup.tsx`:

```typescript
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';

// In handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateForm()) {
    toast.error('Veuillez corriger les erreurs dans le formulaire');
    return;
  }
  
  setIsLoading(true);
  
  try {
    const fullPhone = (countryCode.dialCode.replace('+', '') + formData.phone.replace(/\D/g, '')).replace(/\s/g, '');
    
    const profilePictureFile = profileImage ? await dataURLtoFile(profileImage) : undefined;
    
    const response = await api.register({
      phone: fullPhone,
      full_name: formData.fullName,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      profile_picture: profilePictureFile,
    });
    
    auth.setAuth(response.user, response.tokens);
    toast.success('Compte créé avec succès !');
    navigate('/dashboard');
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de la création du compte');
  } finally {
    setIsLoading(false);
  }
};

// Helper function to convert data URL to File
function dataURLtoFile(dataurl: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], 'profile.jpg', { type: mime });
}
```

### 5. Update AddListing Page

Update `frontEnd/src/pages/AddListing.tsx` to use the API:

```typescript
import { api } from '@/lib/api';

// In handleSubmit:
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // ... validation ...
  
  setIsLoading(true);
  
  try {
    // Convert base64 images to Files
    const imageFiles = await Promise.all(
      images.map(async (img, index) => {
        if (img.startsWith('data:')) {
          return dataURLtoFile(img, `image-${index}.jpg`);
        }
        // If it's already a URL, you might need to fetch it
        return null;
      })
    ).then(files => files.filter(Boolean) as File[]);
    
    const listingData: any = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      purpose: formData.purpose,
      price: formData.price,
      currency: 'AED',
      location: formData.location,
      ad_type: formData.adType,
      images: imageFiles,
    };
    
    if (formData.type === 'car') {
      listingData.car_details = {
        make: formData.make,
        model: formData.model,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        fuel_type: formData.fuelType,
        transmission: formData.transmission,
        color: formData.color,
      };
    } else if (formData.type === 'property') {
      listingData.property_details = {
        property_type: formData.propertyType,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        floor: formData.floor ? parseInt(formData.floor) : null,
        furnished: formData.furnished,
        amenities: [],
      };
    }
    
    if (isEditMode) {
      await api.updateListing(id!, listingData);
      toast.success('Annonce mise à jour avec succès !');
    } else {
      await api.createListing(listingData);
      toast.success(`Annonce soumise pour examen ! Frais de publication : $${AD_TYPE_PRICES[formData.adType]}`);
    }
    
    navigate('/dashboard');
  } catch (error: any) {
    toast.error(error.message || 'Erreur lors de la soumission');
  } finally {
    setIsLoading(false);
  }
};
```

## CORS Configuration

The backend is already configured to allow requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:3000` (React default)

If you're using a different port, update `CORS_ALLOWED_ORIGINS` in `BackEnd/marketplace/settings.py`.

## Testing

1. Start the Django backend: `python manage.py runserver`
2. Start the frontend: `npm run dev`
3. Test registration and login
4. Test creating listings
5. Test viewing listings

## Error Handling

The API client includes automatic token refresh. If a 401 error occurs:
1. It attempts to refresh the token
2. Retries the request
3. If refresh fails, logs out the user and redirects to login

