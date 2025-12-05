import { Listing, User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'Ahmed Al-Rashid',
    phone: '+971501234567',
    email: 'ahmed@example.com',
    role: 'user',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fullName: 'Sarah Johnson',
    phone: '+971507654321',
    email: 'sarah@example.com',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
];

export const mockListings: Listing[] = [
  {
    id: '1',
    title: '2023 Mercedes-Benz S-Class',
    description: 'Luxury sedan in pristine condition. Full service history, warranty until 2026.',
    type: 'car',
    purpose: 'sale',
    price: 450000,
    currency: 'AED',
    location: 'Dubai Marina',
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
    ],
    userId: '1',
    status: 'approved',
    adType: 'star',
    carDetails: {
      make: 'Mercedes-Benz',
      model: 'S-Class',
      year: 2023,
      mileage: 12000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'Black',
      engineSize: '3.0L',
    },
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: '2',
    title: 'Luxury Villa in Palm Jumeirah',
    description: 'Stunning 5-bedroom villa with private beach access and panoramic sea views.',
    type: 'property',
    purpose: 'sale',
    price: 25000000,
    currency: 'AED',
    location: 'Palm Jumeirah',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    ],
    userId: '1',
    status: 'approved',
    adType: 'star',
    propertyDetails: {
      propertyType: 'villa',
      bedrooms: 5,
      bathrooms: 6,
      area: 8500,
      furnished: true,
      amenities: ['Private Pool', 'Beach Access', 'Smart Home', 'Garden'],
    },
    createdAt: new Date('2024-10-28'),
    updatedAt: new Date('2024-10-28'),
  },
  {
    id: '3',
    title: '2024 Porsche 911 Carrera',
    description: 'Brand new, never registered. Dealer warranty. Sports Chrono package.',
    type: 'car',
    purpose: 'sale',
    price: 680000,
    currency: 'AED',
    location: 'Downtown Dubai',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f377e?w=800',
    ],
    userId: '1',
    status: 'approved',
    carDetails: {
      make: 'Porsche',
      model: '911 Carrera',
      year: 2024,
      mileage: 0,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'White',
      engineSize: '3.0L Twin-Turbo',
    },
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-10'),
  },
  {
    id: '4',
    title: 'Modern Apartment in Business Bay',
    description: '2-bedroom apartment with stunning Burj Khalifa views. High floor, fully furnished.',
    type: 'property',
    purpose: 'rent',
    price: 15000,
    currency: 'AED',
    location: 'Business Bay',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    ],
    userId: '1',
    status: 'approved',
    propertyDetails: {
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      floor: 42,
      furnished: true,
      amenities: ['Gym', 'Pool', 'Parking', 'Concierge'],
    },
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: '5',
    title: 'Range Rover Sport HSE',
    description: 'Perfect family SUV. Full options, low mileage, excellent condition.',
    type: 'car',
    purpose: 'rent',
    price: 800,
    currency: 'AED',
    location: 'Abu Dhabi',
    images: [
      'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800',
    ],
    userId: '1',
    status: 'pending',
    carDetails: {
      make: 'Land Rover',
      model: 'Range Rover Sport',
      year: 2023,
      mileage: 25000,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      color: 'Grey',
      engineSize: '3.0L',
    },
    createdAt: new Date('2024-11-12'),
    updatedAt: new Date('2024-11-12'),
  },
  {
    id: '6',
    title: 'Penthouse in DIFC',
    description: 'Exclusive penthouse with private terrace. Premium finishes throughout.',
    type: 'property',
    purpose: 'sale',
    price: 18500000,
    currency: 'AED',
    location: 'DIFC',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
    userId: '1',
    status: 'approved',
    propertyDetails: {
      propertyType: 'apartment',
      bedrooms: 4,
      bathrooms: 5,
      area: 6200,
      floor: 50,
      furnished: true,
      amenities: ['Private Terrace', 'Smart Home', 'Wine Cellar', 'Cinema Room'],
    },
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
  },
];

export const getApprovedListings = () => 
  mockListings.filter(listing => listing.status === 'approved');

export const getFeaturedListings = () => {
  const approved = getApprovedListings();
  // Trier pour mettre les produits Star en premier
  const sorted = [...approved].sort((a, b) => {
    // Si a est Star et b ne l'est pas, a vient en premier
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    // Si b est Star et a ne l'est pas, b vient en premier
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    // Sinon, garder l'ordre original
    return 0;
  });
  return sorted.slice(0, 6);
};

export const getStarListings = () => {
  const approved = getApprovedListings();
  return approved.filter(listing => listing.adType === 'star').slice(0, 10);
};

export const getCarListings = () => {
  const approved = getApprovedListings();
  const cars = approved.filter(listing => listing.type === 'car');
  // Trier pour mettre les produits Star en premier
  const sorted = [...cars].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};

export const getPropertyListings = () => {
  const approved = getApprovedListings();
  const properties = approved.filter(listing => listing.type === 'property');
  // Trier pour mettre les produits Star en premier
  const sorted = [...properties].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};

export const getListingsByType = (type: 'car' | 'property') => 
  getApprovedListings().filter(listing => listing.type === type);

export const getCarListingsForSale = () => {
  const approved = getApprovedListings();
  const cars = approved.filter(listing => listing.type === 'car' && listing.purpose === 'sale');
  // Trier pour mettre les produits Star en premier
  const sorted = [...cars].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};

export const getCarListingsForRent = () => {
  const approved = getApprovedListings();
  const cars = approved.filter(listing => listing.type === 'car' && listing.purpose === 'rent');
  // Trier pour mettre les produits Star en premier
  const sorted = [...cars].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};

export const getPropertyListingsForSale = () => {
  const approved = getApprovedListings();
  const properties = approved.filter(listing => listing.type === 'property' && listing.purpose === 'sale');
  // Trier pour mettre les produits Star en premier
  const sorted = [...properties].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};

export const getPropertyListingsForRent = () => {
  const approved = getApprovedListings();
  const properties = approved.filter(listing => listing.type === 'property' && listing.purpose === 'rent');
  // Trier pour mettre les produits Star en premier
  const sorted = [...properties].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};

export const getAllListings = () => {
  const approved = getApprovedListings();
  // Trier pour mettre les produits Star en premier
  const sorted = [...approved].sort((a, b) => {
    if (a.adType === 'star' && b.adType !== 'star') return -1;
    if (b.adType === 'star' && a.adType !== 'star') return 1;
    return 0;
  });
  return sorted.slice(0, 10);
};
