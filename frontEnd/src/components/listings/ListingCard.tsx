import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Listing } from '@/types';
import { 
  MapPin, 
  Calendar, 
  Gauge, 
  Fuel,
  Bed,
  Bath,
  Square,
  Car,
  Building2,
  Star,
  ShoppingCart,
  Key
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const formatPrice = (price: number, currency: string) => {
    // Format as number with thousand separators, without currency symbol
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isRent = listing.purpose === 'rent';

  return (
    <Link to={`/listing/${listing.id}`}>
      <Card variant="listing" className="group h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {listing.images && listing.images.length > 0 ? (
            <img
              src={listing.images[0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {listing.type === 'car' ? (
                <Car className="w-16 h-16 text-muted-foreground" />
              ) : (
                <Building2 className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <Badge variant={listing.purpose === 'sale' ? 'sale' : 'rent'}>
              {listing.purpose === 'sale' ? (
                <ShoppingCart className="w-3 h-3" />
              ) : (
                <Key className="w-3 h-3" />
              )}
            </Badge>
            {listing.adType === 'star' && (
              <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                <Star className="w-3 h-3 fill-secondary" />
              </Badge>
            )}
          </div>

          {/* Price Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-display text-xl font-semibold">
              {formatPrice(listing.price, listing.currency)}
              {isRent && <span className="text-sm font-sans font-normal opacity-80">/mois</span>}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {listing.type === 'car' && listing.carDetails && (
              <>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{listing.carDetails.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  <span>{listing.carDetails.mileage.toLocaleString()} km</span>
                </div>
                <div className="flex items-center gap-1">
                  <Fuel className="w-4 h-4" />
                  <span>{listing.carDetails.fuelType}</span>
                </div>
              </>
            )}

            {listing.type === 'property' && listing.propertyDetails && (
              <>
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4" />
                  <span>{listing.propertyDetails.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4" />
                  <span>{listing.propertyDetails.bathrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4" />
                  <span>{listing.propertyDetails.area.toLocaleString()} sqft</span>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ListingCard;
