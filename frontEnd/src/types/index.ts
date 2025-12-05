export type UserRole = 'visitor' | 'user' | 'admin';

export type ListingType = 'car' | 'property';
export type ListingPurpose = 'sale' | 'rent';
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'sold';
export type AdType = 'star' | 'simple';

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  profilePicture?: string;
  role: UserRole;
  createdAt: Date;
}

export interface CarDetails {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  color: string;
  engineSize?: string;
}

export interface PropertyDetails {
  propertyType: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor?: number;
  furnished: boolean;
  amenities: string[];
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  purpose: ListingPurpose;
  price: number;
  currency: string;
  location: string;
  images: string[];
  userId: string;
  user?: {
    id: number;
    phone: string;
    full_name: string;
    email?: string;
    profile_picture?: string;
  };
  status: ListingStatus;
  adType?: AdType; // Type d'annonce: star (50$) ou simple (25$)
  carDetails?: CarDetails;
  propertyDetails?: PropertyDetails;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchFilters {
  type?: ListingType;
  purpose?: ListingPurpose;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  // Car specific
  make?: string;
  minYear?: number;
  maxYear?: number;
  // Property specific
  propertyType?: string;
  minBedrooms?: number;
  minBathrooms?: number;
  minArea?: number;
}
