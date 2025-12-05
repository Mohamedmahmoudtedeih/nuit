import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Listing, SearchFilters } from '@/types';

export const useListings = (filters?: SearchFilters & { limit?: number }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const response = await api.getListings(filters);
        let results = response.results || [];
        
        // Apply limit if specified
        if (filters?.limit) {
          results = results.slice(0, filters.limit);
        }
        
        setListings(results);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des annonces');
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [JSON.stringify(filters)]);

  return { listings, loading, error };
};


