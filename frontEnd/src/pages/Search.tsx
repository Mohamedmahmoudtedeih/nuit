import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ListingCard from '@/components/listings/ListingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { Listing } from '@/types';
import { 
  Search as SearchIcon, 
  SlidersHorizontal, 
  X,
  Car,
  Building2,
  MapPin,
  Star
} from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const initialType = searchParams.get('type') as 'car' | 'property' | null;
  const initialQuery = searchParams.get('q') || '';
  const initialAdType = searchParams.get('adType') as 'star' | null;
  
  const [filters, setFilters] = useState({
    query: initialQuery,
    type: initialType || 'all',
    purpose: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    adType: initialAdType || 'all',
  });

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchParams: any = {};
        
        if (filters.type !== 'all') {
          searchParams.type = filters.type;
        }
        if (filters.purpose !== 'all') {
          searchParams.purpose = filters.purpose;
        }
        if (filters.adType !== 'all') {
          searchParams.adType = filters.adType;
        }
        if (filters.minPrice) {
          searchParams.min_price = filters.minPrice;
        }
        if (filters.maxPrice) {
          searchParams.max_price = filters.maxPrice;
        }
        if (filters.location) {
          searchParams.location = filters.location;
        }
        if (filters.query) {
          searchParams.search = filters.query;
        }

        const response = await api.getListings(searchParams);
        setListings(response.results || []);
      } catch (error: any) {
        console.error('Error fetching listings:', error);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      query: '',
      type: 'all',
      purpose: 'all',
      minPrice: '',
      maxPrice: '',
      location: '',
      adType: 'all',
    });
    setSearchParams({});
  };

  const hasActiveFilters = 
    filters.type !== 'all' || 
    filters.purpose !== 'all' || 
    filters.adType !== 'all' ||
    filters.minPrice || 
    filters.maxPrice || 
    filters.location;

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              {filters.adType === 'star' 
                ? 'Annonces Star' 
                : filters.type === 'car' 
                ? 'Parcourir les voitures' 
                : filters.type === 'property' 
                ? 'Parcourir les propriétés' 
                : 'Rechercher des annonces'}
            </h1>
            <p className="text-muted-foreground">
              {loading ? 'Chargement...' : `${listings.length} ${listings.length === 1 ? 'annonce trouvée' : 'annonces trouvées'}`}
            </p>
          </div>

          {/* Search Bar & Filter Toggle */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, localisation ou description..."
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                className="pl-12 h-12 bg-background"
              />
            </div>
            <Button 
              variant={showFilters ? 'secondary' : 'outline'} 
              size="lg"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-secondary" />
              )}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <Card className="p-6 mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Filtres</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Tout effacer
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Type Filter */}
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.type === 'all' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, type: 'all' })}
                    >
                      Tout
                    </Button>
                    <Button
                      variant={filters.type === 'car' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, type: 'car' })}
                    >
                      <Car className="w-4 h-4 mr-1" />
                      Voitures
                    </Button>
                    <Button
                      variant={filters.type === 'property' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, type: 'property' })}
                    >
                      <Building2 className="w-4 h-4 mr-1" />
                      Propriétés
                    </Button>
                  </div>
                </div>

                {/* Purpose Filter */}
                <div className="space-y-2">
                  <Label>Objectif</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.purpose === 'all' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, purpose: 'all' })}
                    >
                      Tout
                    </Button>
                    <Button
                      variant={filters.purpose === 'sale' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, purpose: 'sale' })}
                    >
                      À vendre
                    </Button>
                    <Button
                      variant={filters.purpose === 'rent' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, purpose: 'rent' })}
                    >
                      À louer
                    </Button>
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2">
                  <Label>Fourchette de prix (AED)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="h-10"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="h-10"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label>Localisation</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="N'importe quelle localisation"
                      value={filters.location}
                      onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>

                {/* Ad Type Filter */}
                <div className="space-y-2">
                  <Label>Type d'annonce</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={filters.adType === 'all' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, adType: 'all' })}
                    >
                      Tout
                    </Button>
                    <Button
                      variant={filters.adType === 'star' ? 'secondary' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, adType: 'star' })}
                    >
                      <Star className="w-4 h-4 mr-1" />
                      Star
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.adType !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  <Star className="w-3 h-3" />
                  Star
                  <button onClick={() => setFilters({ ...filters, adType: 'all' })}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.type !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {filters.type === 'car' ? 'Voitures' : 'Propriétés'}
                  <button onClick={() => setFilters({ ...filters, type: 'all' })}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.purpose !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  {filters.purpose === 'sale' ? 'À vendre' : 'À louer'}
                  <button onClick={() => setFilters({ ...filters, purpose: 'all' })}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.location && (
                <Badge variant="secondary" className="gap-1">
                  {filters.location}
                  <button onClick={() => setFilters({ ...filters, location: '' })}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Chargement des annonces...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing, index) => (
                <div key={listing.id} className={`animate-fade-in stagger-${(index % 6) + 1}`}>
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <SearchIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Aucune annonce trouvée</h3>
              <p className="text-muted-foreground mb-6">
                Essayez d'ajuster vos filtres ou vos termes de recherche
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
