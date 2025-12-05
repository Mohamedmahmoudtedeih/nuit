import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/listings/ListingCard';
import { useListings } from '@/hooks/useListings';
import { ArrowRight, Car } from 'lucide-react';

const CarListings = () => {
  const { listings, loading } = useListings({ type: 'car', limit: 10 });

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </div>
      </section>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="py-1 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <Car className="w-8 h-8 text-secondary" />
              Voitures
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Découvrez notre sélection de véhicules
            </p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/search?type=car">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing, index) => (
            <div 
              key={listing.id} 
              className={`animate-fade-in stagger-${index + 1}`}
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarListings;

