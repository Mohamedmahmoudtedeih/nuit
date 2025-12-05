import { auth } from './auth';
import { Listing, User, SearchFilters } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

// Helper to convert data URL to File
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

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

    try {
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
    } catch (error: any) {
      // Handle network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
      }
      throw error;
    }
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
        auth.setToken(data.access);
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
    profile_picture?: string;
  }) {
    const formData = new FormData();
    formData.append('phone', data.phone);
    formData.append('full_name', data.full_name);
    if (data.email) formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirm_password', data.confirm_password);
    
    if (data.profile_picture && data.profile_picture.startsWith('data:')) {
      const file = dataURLtoFile(data.profile_picture, 'profile.jpg');
      formData.append('profile_picture', file);
    }

    const token = auth.getToken();
    const headers: HeadersInit = {};
    // Don't set Content-Type for FormData - browser sets it automatically with boundary
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/register/`, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Registration failed' }));
        console.error('Registration error response:', error);
        
        // Handle validation errors - check all possible error fields
        if (error.phone) {
          throw new Error(Array.isArray(error.phone) ? error.phone[0] : error.phone);
        }
        if (error.full_name) {
          throw new Error(Array.isArray(error.full_name) ? error.full_name[0] : error.full_name);
        }
        if (error.password) {
          throw new Error(Array.isArray(error.password) ? error.password[0] : error.password);
        }
        if (error.confirm_password) {
          throw new Error(Array.isArray(error.confirm_password) ? error.confirm_password[0] : error.confirm_password);
        }
        if (error.non_field_errors) {
          throw new Error(Array.isArray(error.non_field_errors) ? error.non_field_errors[0] : error.non_field_errors);
        }
        // Show all errors if available
        const errorMessages = Object.entries(error)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
          .join(', ');
        throw new Error(errorMessages || error.detail || error.message || 'Registration failed');
      }

      return response.json();
    } catch (error: any) {
      // Handle network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
      }
      throw error;
    }
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
    return this.request<User>('/auth/profile/');
  }

  async updateProfile(data: Partial<{ full_name: string; email: string; profile_picture: string }>) {
    const formData = new FormData();
    if (data.full_name) formData.append('full_name', data.full_name);
    if (data.email) formData.append('email', data.email);
    if (data.profile_picture && data.profile_picture.startsWith('data:')) {
      const file = dataURLtoFile(data.profile_picture, 'profile.jpg');
      formData.append('profile_picture', file);
    }

    const token = auth.getToken();
    const response = await fetch(`${this.baseURL}/auth/profile/update/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Update failed' }));
      throw new Error(error.detail || error.message || 'Update failed');
    }

    return response.json();
  }

  // Listing endpoints
  async getListings(params?: SearchFilters & { page?: number; limit?: number; adType?: string }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Map frontend filter names to API parameter names
          if (key === 'adType') {
            queryParams.append('ad_type', value.toString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    const query = queryParams.toString();
    const endpoint = query ? `/listings/?${query}` : '/listings/';
    const response = await this.request<{ results: any[]; count: number; next: string | null; previous: string | null }>(
      endpoint
    );
    
    // Transform API response to match frontend types
    return {
      results: response.results.map(this.transformListing),
      count: response.count,
    };
  }

  async getListing(id: string) {
    const listing = await this.request<any>(`/listings/${id}/`);
    return this.transformListing(listing);
  }

  async createListing(data: any) {
    const formData = new FormData();
    
    // Basic fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('type', data.type);
    formData.append('purpose', data.purpose);
    formData.append('price', data.price.toString());
    formData.append('currency', data.currency || 'AED');
    formData.append('location', data.location);
    formData.append('ad_type', data.adType || 'simple');
    
    // Images
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img: string, index: number) => {
        if (img.startsWith('data:')) {
          const file = dataURLtoFile(img, `image-${index}.jpg`);
          formData.append('images', file);
        }
      });
    }
    
    // Car details
    if (data.carDetails) {
      Object.entries(data.carDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`car_details[${key}]`, value.toString());
        }
      });
    }
    
    // Property details
    if (data.propertyDetails) {
      Object.entries(data.propertyDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'amenities' && Array.isArray(value)) {
            formData.append(`property_details[${key}]`, JSON.stringify(value));
          } else {
            formData.append(`property_details[${key}]`, value.toString());
          }
        }
      });
    }

    const token = auth.getToken();
    const response = await fetch(`${this.baseURL}/listings/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Creation failed' }));
      throw new Error(error.detail || error.message || 'Creation failed');
    }

    const listing = await response.json();
    
    // Ensure we have valid listing data before transforming
    if (!listing || !listing.id) {
      console.error('Invalid listing response:', listing);
      throw new Error('Invalid response from server. Please try again.');
    }
    
    return this.transformListing(listing);
  }

  async updateListing(id: string, data: any) {
    const formData = new FormData();
    
    // Basic fields
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.type) formData.append('type', data.type);
    if (data.purpose) formData.append('purpose', data.purpose);
    if (data.price) formData.append('price', data.price.toString());
    if (data.currency) formData.append('currency', data.currency);
    if (data.location) formData.append('location', data.location);
    if (data.adType) formData.append('ad_type', data.adType);
    
    // Images
    if (data.images && Array.isArray(data.images)) {
      data.images.forEach((img: string, index: number) => {
        if (img.startsWith('data:')) {
          const file = dataURLtoFile(img, `image-${index}.jpg`);
          formData.append('images', file);
        }
      });
    }
    
    // Car details
    if (data.carDetails) {
      Object.entries(data.carDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`car_details[${key}]`, value.toString());
        }
      });
    }
    
    // Property details
    if (data.propertyDetails) {
      Object.entries(data.propertyDetails).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'amenities' && Array.isArray(value)) {
            formData.append(`property_details[${key}]`, JSON.stringify(value));
          } else {
            formData.append(`property_details[${key}]`, value.toString());
          }
        }
      });
    }

    const token = auth.getToken();
    const response = await fetch(`${this.baseURL}/listings/${id}/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Update failed' }));
      throw new Error(error.detail || error.message || 'Update failed');
    }

    const listing = await response.json();
    return this.transformListing(listing);
  }

  async deleteListing(id: string) {
    return this.request(`/listings/${id}/`, { method: 'DELETE' });
  }

  async getMyListings() {
    const response = await this.request<{ results: any[] }>('/listings/my_listings/');
    return response.results.map(this.transformListing);
  }

  async getAllListings() {
    // Get all listings including pending (for admin)
    // Admin users will see all listings regardless of status
    const response = await this.request<{ results: any[]; count: number; next: string | null; previous: string | null }>('/listings/');
    return response.results.map(this.transformListing);
  }

  async approveListing(id: string) {
    return this.request(`/listings/${id}/approve/`, { method: 'POST' });
  }

  async rejectListing(id: string) {
    return this.request(`/listings/${id}/reject/`, { method: 'POST' });
  }

  async markListingAsSold(id: string) {
    return this.request(`/listings/${id}/mark_sold/`, { method: 'POST' });
  }

  // Transform API response to match frontend Listing type
  private transformListing(apiListing: any): Listing {
    if (!apiListing) {
      throw new Error('Invalid listing data received from API');
    }
    
    return {
      id: apiListing.id ? apiListing.id.toString() : '',
      title: apiListing.title || '',
      description: apiListing.description || '',
      type: apiListing.type || 'car',
      purpose: apiListing.purpose || 'sale',
      price: apiListing.price ? parseFloat(apiListing.price) : 0,
      currency: apiListing.currency || 'AED',
      location: apiListing.location || '',
      images: apiListing.images?.map((img: any) => {
        const imageUrl = img.image || img;
        return imageUrl?.startsWith('http') ? imageUrl : `http://localhost:8000${imageUrl}`;
      }) || [],
      userId: apiListing.user_id ? apiListing.user_id.toString() : (apiListing.user?.id ? apiListing.user.id.toString() : ''),
      user: apiListing.user ? {
        id: apiListing.user.id,
        phone: apiListing.user.phone || '',
        full_name: apiListing.user.full_name || '',
        email: apiListing.user.email,
        profile_picture: apiListing.user.profile_picture,
      } : undefined,
      status: apiListing.status || 'pending',
      adType: apiListing.ad_type || 'simple',
      carDetails: apiListing.car_details ? {
        make: apiListing.car_details.make,
        model: apiListing.car_details.model,
        year: apiListing.car_details.year,
        mileage: apiListing.car_details.mileage,
        fuelType: apiListing.car_details.fuel_type,
        transmission: apiListing.car_details.transmission,
        color: apiListing.car_details.color,
        engineSize: apiListing.car_details.engine_size,
      } : undefined,
      propertyDetails: apiListing.property_details ? {
        propertyType: apiListing.property_details.property_type,
        bedrooms: apiListing.property_details.bedrooms,
        bathrooms: apiListing.property_details.bathrooms,
        area: parseFloat(apiListing.property_details.area),
        floor: apiListing.property_details.floor,
        furnished: apiListing.property_details.furnished,
        amenities: Array.isArray(apiListing.property_details.amenities) 
          ? apiListing.property_details.amenities 
          : [],
      } : undefined,
      createdAt: apiListing.created_at ? new Date(apiListing.created_at) : new Date(),
      updatedAt: apiListing.updated_at ? new Date(apiListing.updated_at) : new Date(),
    };
  }
}

export const api = new ApiClient(API_BASE_URL);

