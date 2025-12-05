import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api';
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
  ArrowLeft,
  Phone,
  Mail,
  Share2,
  Heart,
  Settings,
  Palette
} from 'lucide-react';

const ListingDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await api.getListing(id);
        setListing(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de l\'annonce');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-display font-bold mb-4">Annonce introuvable</h1>
            <p className="text-muted-foreground mb-4">{error || 'Cette annonce n\'existe pas'}</p>
            <Button asChild>
              <Link to="/search">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la recherche
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isRent = listing.purpose === 'rent';

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link 
            to="/search" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la recherche
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card variant="listing" className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant={listing.type === 'car' ? 'car' : 'property'}>
                      {listing.type === 'car' ? (
                        <Car className="w-3 h-3 mr-1" />
                      ) : (
                        <Building2 className="w-3 h-3 mr-1" />
                      )}
                      {listing.type}
                    </Badge>
                    <Badge variant={listing.purpose === 'sale' ? 'sale' : 'rent'}>
                      {listing.purpose === 'sale' ? 'À vendre' : 'À louer'}
                    </Badge>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                {listing.images.length > 1 && (
                  <div className="p-4 flex gap-4 overflow-x-auto">
                    {listing.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${listing.title} - ${index + 1}`}
                        className="w-24 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </div>
                )}
              </Card>

              {/* Details */}
              <Card className="p-6">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
                  {listing.title}
                </h1>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-6">
                  <MapPin className="w-5 h-5" />
                  <span>{listing.location}</span>
                </div>

                <div className="mb-8">
                  <p className="text-foreground leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Specifications */}
                <div className="border-t pt-6">
                  <h2 className="text-xl font-display font-semibold mb-4">Spécifications</h2>
                  
                  {listing.type === 'car' && listing.carDetails && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Calendar className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Année</p>
                          <p className="font-semibold">{listing.carDetails.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Gauge className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Kilométrage</p>
                          <p className="font-semibold">{listing.carDetails.mileage.toLocaleString()} km</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Fuel className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Type de carburant</p>
                          <p className="font-semibold">{listing.carDetails.fuelType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Settings className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Transmission</p>
                          <p className="font-semibold">{listing.carDetails.transmission}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                        <Palette className="w-5 h-5 text-secondary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Couleur</p>
                          <p className="font-semibold">{listing.carDetails.color}</p>
                        </div>
                      </div>
                      {listing.carDetails.engineSize && (
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Car className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Moteur</p>
                            <p className="font-semibold">{listing.carDetails.engineSize}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {listing.type === 'property' && listing.propertyDetails && (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Bed className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Chambres</p>
                            <p className="font-semibold">{listing.propertyDetails.bedrooms}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Bath className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Salles de bain</p>
                            <p className="font-semibold">{listing.propertyDetails.bathrooms}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Square className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Superficie</p>
                            <p className="font-semibold">{listing.propertyDetails.area.toLocaleString()} pi²</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Building2 className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="font-semibold capitalize">{listing.propertyDetails.propertyType}</p>
                          </div>
                        </div>
                        {listing.propertyDetails.floor && (
                          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                            <Building2 className="w-5 h-5 text-secondary" />
                            <div>
                              <p className="text-sm text-muted-foreground">Étage</p>
                              <p className="font-semibold">{listing.propertyDetails.floor}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                          <Settings className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Meublé</p>
                            <p className="font-semibold">{listing.propertyDetails.furnished ? 'Oui' : 'Non'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      {listing.propertyDetails.amenities.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-3">Équipements</h3>
                          <div className="flex flex-wrap gap-2">
                            {listing.propertyDetails.amenities.map((amenity) => (
                              <Badge key={amenity} variant="outline">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Card */}
              <Card variant="elevated" className="p-6 sticky top-24">
                <div className="mb-6">
                  <p className="text-3xl font-display font-bold text-foreground">
                    {formatPrice(listing.price, listing.currency)}
                    {isRent && <span className="text-lg font-sans font-normal text-muted-foreground">/mois</span>}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <Button variant="hero" size="lg" className="w-full">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Seller
                  </Button>
                  <Button variant="outline" size="lg" className="w-full">
                    <Mail className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="flex-1">
                    <Heart className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="flex-1">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </Card>

              {/* Safety Tips */}
              <Card className="p-6 bg-warning/10 border-warning/20">
                <h3 className="font-semibold mb-3 text-foreground">Safety Tips</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Meet in a safe public place</li>
                  <li>• Don't send money in advance</li>
                  <li>• Inspect the item before payment</li>
                  <li>• Use secure payment methods</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ListingDetails;
