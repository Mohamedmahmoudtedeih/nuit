import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ListingCard from '@/components/listings/ListingCard';
import { useListings } from '@/hooks/useListings';
import { ArrowRight } from 'lucide-react';

const FeaturedListings = () => {
  const { listings, loading } = useListings({ adType: 'star', limit: 6 });

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Annonces en vedette
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Voitures et propriétés premium sélectionnées à la main pour les acheteurs exigeants.
            </p>
          </div>
          <Button variant="outline" size="lg" asChild>
            <Link to="/search">
              Voir tout
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing, index) => (
              <div 
                key={listing.id} 
                className={`animate-fade-in stagger-${index + 1}`}
              >
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Aucune annonce disponible</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedListings;
