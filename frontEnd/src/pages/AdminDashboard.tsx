import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Listing } from '@/types';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';
import { 
  Eye, 
  Check,
  X,
  Car,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Star,
  MessageCircle,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Bed,
  Bath,
  Square,
  Settings,
  Palette,
  ChevronDown,
  ChevronUp,
  ShoppingBag
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  const [soldDialogOpen, setSoldDialogOpen] = useState(false);
  const [listingToMarkAsSold, setListingToMarkAsSold] = useState<string | null>(null);
  
  // Check if user is admin
  useEffect(() => {
    if (!auth.isLoggedIn() || !auth.isAdmin()) {
      toast.error('Accès refusé. Vous devez être administrateur.');
      navigate('/');
      return;
    }
  }, [navigate]);

  // Fetch all listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const allListings = await api.getAllListings();
        setListings(allListings);
      } catch (error: any) {
        toast.error('Erreur lors du chargement des annonces');
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (auth.isAdmin()) {
      fetchListings();
    }
  }, []);
  
  const pendingListings = listings.filter(l => l.status === 'pending');
  const approvedListings = listings.filter(l => l.status === 'approved');
  const soldListings = listings.filter(l => l.status === 'sold');
  
  const stats = [
    { 
      label: 'Total des annonces', 
      value: listings.length,
      icon: Package,
      color: 'text-primary'
    },
    { 
      label: 'En attente d\'examen', 
      value: pendingListings.length,
      icon: Clock,
      color: 'text-warning'
    },
    { 
      label: 'Approuvées', 
      value: approvedListings.length,
      icon: CheckCircle,
      color: 'text-success'
    },
    { 
      label: 'Vendues', 
      value: soldListings.length,
      icon: ShoppingBag,
      color: 'text-secondary'
    },
  ];

  const handleApprove = async (id: string) => {
    try {
      await api.approveListing(id);
      setListings(prev => prev.map(l => 
        l.id === id ? { ...l, status: 'approved' as const } : l
      ));
      toast.success('Annonce approuvée avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.rejectListing(id);
      setListings(prev => prev.map(l => 
        l.id === id ? { ...l, status: 'rejected' as const } : l
      ));
      toast.success('Annonce rejetée');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors du rejet');
    }
  };

  const handleMarkAsSoldClick = (id: string) => {
    setListingToMarkAsSold(id);
    setSoldDialogOpen(true);
  };

  const handleMarkAsSoldConfirm = async () => {
    if (listingToMarkAsSold) {
      try {
        await api.markListingAsSold(listingToMarkAsSold);
        setListings(prev => prev.map(l => 
          l.id === listingToMarkAsSold ? { ...l, status: 'sold' as const } : l
        ));
        toast.success('Produit marqué comme vendu');
        setSoldDialogOpen(false);
        setListingToMarkAsSold(null);
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour');
      }
    }
  };

  const handleMarkAsSoldCancel = () => {
    setSoldDialogOpen(false);
    setListingToMarkAsSold(null);
  };

  const handleMarkAsNotSold = async (id: string) => {
    try {
      // Note: This would need a backend endpoint to mark as not sold
      // For now, we'll just update locally
      setListings(prev => prev.map(l => 
        l.id === id ? { ...l, status: 'approved' as const } : l
      ));
      toast.success('Produit marqué comme non vendu');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="approved"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'pending':
        return <Badge variant="pending"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
      case 'rejected':
        return <Badge variant="rejected"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      case 'sold':
        return <Badge variant="secondary" className="bg-green-600 text-white"><ShoppingBag className="w-3 h-3 mr-1" />Vendu</Badge>;
      default:
        return null;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    // Format as number with thousand separators, without currency symbol
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = (listingId: string) => {
    if (expandedListingId === listingId) {
      setExpandedListingId(null);
    } else {
      setExpandedListingId(listingId);
    }
  };

  const handleWhatsApp = (listing: Listing) => {
    if (!listing.user || !listing.user.phone) {
      toast.error('Numéro de téléphone de l\'utilisateur introuvable');
      return;
    }

    // Format phone number (remove + and spaces)
    const formattedPhone = listing.user.phone.replace(/[+\s]/g, '');
    
    // Create WhatsApp message
    const adTypeText = listing.adType === 'star' ? 'Star (50$)' : 'Simple (25$)';
    const message = `Bonjour, je suis intéressé(e) par votre annonce :

📌 ${listing.title}
💰 Prix: ${formatPrice(listing.price, listing.currency)}
📍 Localisation: ${listing.location}
⭐ Type d'annonce: ${adTypeText}
${listing.type === 'car' && listing.carDetails ? `🚗 ${listing.carDetails.make} ${listing.carDetails.model} ${listing.carDetails.year}` : ''}
${listing.type === 'property' && listing.propertyDetails ? `🏠 ${listing.propertyDetails.bedrooms} chambres, ${listing.propertyDetails.bathrooms} salles de bain` : ''}

Pouvez-vous me donner plus d'informations ?`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-muted/30">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Chargement...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Tableau de bord administrateur
            </h1>
            <p className="text-muted-foreground">
              Gérez les annonces, les utilisateurs et le contenu du site
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pending Reviews */}
          {pendingListings.length > 0 && (
            <Card className="mb-8 border-warning/50">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <CardTitle>Examens en attente</CardTitle>
                  <p className="text-sm text-muted-foreground">{pendingListings.length} annonces en attente d'examen</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingListings.map((listing) => (
                    <div key={listing.id}>
                      <div 
                        className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                      >
                        {/* Image */}
                        <div className="w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                          {listing.images && listing.images.length > 0 ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          ) : (
                            <Package className="w-8 h-8 text-muted-foreground" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {listing.type === 'car' ? (
                              <Car className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <Building2 className="w-4 h-4 text-muted-foreground" />
                            )}
                            <h3 className="font-semibold text-foreground truncate">
                              {listing.title}
                            </h3>
                            <Badge 
                              variant={listing.purpose === 'sale' ? 'sale' : 'rent'}
                            >
                              {listing.purpose === 'sale' ? 'À vendre' : 'À louer'}
                            </Badge>
                            {listing.adType && (
                              <Badge 
                                variant={listing.adType === 'star' ? 'secondary' : 'outline'}
                                className={listing.adType === 'star' ? 'bg-yellow-500 text-white' : ''}
                              >
                                {listing.adType === 'star' ? (
                                  <>
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Star
                                  </>
                                ) : (
                                  <>Simple</>
                                )}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{formatPrice(listing.price, listing.currency)}</span>
                            {listing.purpose === 'rent' && <span className="text-xs">/mois</span>}
                            <span>•</span>
                            <span>{listing.location}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Soumis le {listing.createdAt.toLocaleDateString()}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleViewDetails(listing.id)}
                            title={expandedListingId === listing.id ? "Masquer les détails" : "Voir les détails"}
                          >
                            {expandedListingId === listing.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-success border-success hover:bg-success hover:text-success-foreground"
                            onClick={() => handleApprove(listing.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleReject(listing.id)}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedListingId === listing.id && (
                        <div className="mt-4 p-6 border rounded-lg bg-muted/30 space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                              {/* Image */}
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                                {listing.images && listing.images.length > 0 ? (
                                  <img
                                    src={listing.images[0]}
                                    alt={listing.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                                    }}
                                  />
                                ) : (
                                  <Package className="w-16 h-16 text-muted-foreground" />
                                )}
                              </div>

                              {/* Price and Location */}
                              <div>
                                <p className="text-2xl font-display font-bold text-foreground mb-2">
                                  {formatPrice(listing.price, listing.currency)}
                                  {listing.purpose === 'rent' && <span className="text-base font-normal text-muted-foreground">/mois</span>}
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  <span>{listing.location}</span>
                                </div>
                              </div>

                              {/* Description */}
                              <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">{listing.description}</p>
                              </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                              {/* Specifications */}
                              <div>
                                <h3 className="font-semibold mb-3">Spécifications</h3>
                                
                                {listing.type === 'car' && listing.carDetails && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Calendar className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Année</p>
                                        <p className="font-semibold text-sm">{listing.carDetails.year}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Gauge className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Kilométrage</p>
                                        <p className="font-semibold text-sm">{listing.carDetails.mileage.toLocaleString()} km</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Fuel className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Carburant</p>
                                        <p className="font-semibold text-sm">{listing.carDetails.fuelType}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Settings className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Transmission</p>
                                        <p className="font-semibold text-sm">{listing.carDetails.transmission}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Palette className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Couleur</p>
                                        <p className="font-semibold text-sm">{listing.carDetails.color}</p>
                                      </div>
                                    </div>
                                    {listing.carDetails.engineSize && (
                                      <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                        <Car className="w-4 h-4 text-secondary" />
                                        <div>
                                          <p className="text-xs text-muted-foreground">Moteur</p>
                                          <p className="font-semibold text-sm">{listing.carDetails.engineSize}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {listing.type === 'property' && listing.propertyDetails && (
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Bed className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Chambres</p>
                                        <p className="font-semibold text-sm">{listing.propertyDetails.bedrooms}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Bath className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Salles de bain</p>
                                        <p className="font-semibold text-sm">{listing.propertyDetails.bathrooms}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Square className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Superficie</p>
                                        <p className="font-semibold text-sm">{listing.propertyDetails.area.toLocaleString()} pi²</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Building2 className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Type</p>
                                        <p className="font-semibold text-sm capitalize">{listing.propertyDetails.propertyType}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Settings className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Meublé</p>
                                        <p className="font-semibold text-sm">{listing.propertyDetails.furnished ? 'Oui' : 'Non'}</p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* User Info */}
                              <div className="border-t pt-4">
                                <h3 className="font-semibold mb-2">Informations utilisateur</h3>
                                {listing.user ? (
                                  <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                                    <div>
                                      <p className="font-semibold text-sm">{listing.user.full_name}</p>
                                      <p className="text-xs text-muted-foreground">{listing.user.phone}</p>
                                      {listing.user.email && (
                                        <p className="text-xs text-muted-foreground">{listing.user.email}</p>
                                      )}
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleWhatsApp(listing)}
                                      className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                                    >
                                      <MessageCircle className="w-4 h-4 mr-2" />
                                      WhatsApp
                                    </Button>
                                  </div>
                                ) : (
                                  <p className="text-muted-foreground text-sm">Utilisateur introuvable</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Listings */}
          <Card>
            <CardHeader>
              <CardTitle>Toutes les annonces</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div key={listing.id}>
                    <div 
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      {/* Image */}
                      <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted flex items-center justify-center">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <Package className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {listing.type === 'car' ? (
                            <Car className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold text-foreground truncate">
                            {listing.title}
                          </h3>
                          <Badge 
                            variant={listing.purpose === 'sale' ? 'sale' : 'rent'}
                          >
                            {listing.purpose === 'sale' ? 'À vendre' : 'À louer'}
                          </Badge>
                          {listing.adType && (
                            <Badge 
                              variant={listing.adType === 'star' ? 'secondary' : 'outline'}
                              className={listing.adType === 'star' ? 'bg-yellow-500 text-white' : ''}
                            >
                              {listing.adType === 'star' ? (
                                <>
                                  <Star className="w-3 h-3 mr-1 fill-current" />
                                  Star
                                </>
                              ) : (
                                <>Simple</>
                              )}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{formatPrice(listing.price, listing.currency)}</span>
                          {listing.purpose === 'rent' && <span className="text-xs">/mois</span>}
                          <span>•</span>
                          <span>{listing.location}</span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="hidden sm:block">
                        {getStatusBadge(listing.status)}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewDetails(listing.id)}
                          title={expandedListingId === listing.id ? "Masquer les détails" : "Voir les détails"}
                        >
                          {expandedListingId === listing.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        {listing.status === 'approved' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                            onClick={() => handleMarkAsSoldClick(listing.id)}
                            title={listing.purpose === 'sale' ? "Marquer comme vendu" : "Marquer comme loué"}
                          >
                            <ShoppingBag className="w-4 h-4 mr-1" />
                            {listing.purpose === 'sale' ? 'Vendu' : 'Louer'}
                          </Button>
                        )}
                        {listing.status === 'sold' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                            onClick={() => handleMarkAsNotSold(listing.id)}
                            title={listing.purpose === 'sale' ? "Marquer comme non vendu" : "Marquer comme non loué"}
                          >
                            <X className="w-4 h-4 mr-1" />
                            {listing.purpose === 'sale' ? 'Non vendu' : 'Non loué'}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedListingId === listing.id && (
                      <div className="mt-4 p-6 border rounded-lg bg-muted/30 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Left Column */}
                          <div className="space-y-4">
                            {/* Image */}
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                              {listing.images && listing.images.length > 0 ? (
                                <img
                                  src={listing.images[0]}
                                  alt={listing.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                                  }}
                                />
                              ) : (
                                <Package className="w-16 h-16 text-muted-foreground" />
                              )}
                            </div>

                            {/* Price and Location */}
                            <div>
                              <p className="text-2xl font-display font-bold text-foreground mb-2">
                                {formatPrice(listing.price, listing.currency)}
                                {listing.purpose === 'rent' && <span className="text-base font-normal text-muted-foreground">/mois</span>}
                              </p>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{listing.location}</span>
                              </div>
                            </div>

                            {/* Description */}
                            <div>
                              <h3 className="font-semibold mb-2">Description</h3>
                              <p className="text-muted-foreground leading-relaxed text-sm">{listing.description}</p>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                            {/* Specifications */}
                            <div>
                              <h3 className="font-semibold mb-3">Spécifications</h3>
                              
                              {listing.type === 'car' && listing.carDetails && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Calendar className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Année</p>
                                      <p className="font-semibold text-sm">{listing.carDetails.year}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Gauge className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Kilométrage</p>
                                      <p className="font-semibold text-sm">{listing.carDetails.mileage.toLocaleString()} km</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Fuel className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Carburant</p>
                                      <p className="font-semibold text-sm">{listing.carDetails.fuelType}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Settings className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Transmission</p>
                                      <p className="font-semibold text-sm">{listing.carDetails.transmission}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Palette className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Couleur</p>
                                      <p className="font-semibold text-sm">{listing.carDetails.color}</p>
                                    </div>
                                  </div>
                                  {listing.carDetails.engineSize && (
                                    <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                      <Car className="w-4 h-4 text-secondary" />
                                      <div>
                                        <p className="text-xs text-muted-foreground">Moteur</p>
                                        <p className="font-semibold text-sm">{listing.carDetails.engineSize}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {listing.type === 'property' && listing.propertyDetails && (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Bed className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Chambres</p>
                                      <p className="font-semibold text-sm">{listing.propertyDetails.bedrooms}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Bath className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Salles de bain</p>
                                      <p className="font-semibold text-sm">{listing.propertyDetails.bathrooms}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Square className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Superficie</p>
                                      <p className="font-semibold text-sm">{listing.propertyDetails.area.toLocaleString()} pi²</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Building2 className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Type</p>
                                      <p className="font-semibold text-sm capitalize">{listing.propertyDetails.propertyType}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 p-3 bg-background rounded-lg">
                                    <Settings className="w-4 h-4 text-secondary" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Meublé</p>
                                      <p className="font-semibold text-sm">{listing.propertyDetails.furnished ? 'Oui' : 'Non'}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* User Info */}
                            <div className="border-t pt-4">
                              <h3 className="font-semibold mb-2">Informations utilisateur</h3>
                              {listing.user ? (
                                <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                                  <div>
                                    <p className="font-semibold text-sm">{listing.user.full_name}</p>
                                    <p className="text-xs text-muted-foreground">{listing.user.phone}</p>
                                    {listing.user.email && (
                                      <p className="text-xs text-muted-foreground">{listing.user.email}</p>
                                    )}
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleWhatsApp(listing)}
                                    className="bg-green-500 hover:bg-green-600 text-white border-green-500"
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    WhatsApp
                                  </Button>
                                </div>
                              ) : (
                                <p className="text-muted-foreground text-sm">Utilisateur introuvable</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />

      {/* Confirmation Dialog for Mark as Sold */}
      <AlertDialog open={soldDialogOpen} onOpenChange={setSoldDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {listingToMarkAsSold && listings.find(l => l.id === listingToMarkAsSold)?.purpose === 'sale' 
                ? 'Confirmer la vente' 
                : 'Confirmer la location'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {listingToMarkAsSold && listings.find(l => l.id === listingToMarkAsSold)?.purpose === 'sale'
                ? 'Êtes-vous sûr de vouloir marquer ce produit comme vendu ? Cette action changera le statut du produit.'
                : 'Êtes-vous sûr de vouloir marquer ce produit comme loué ? Cette action changera le statut du produit.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleMarkAsSoldCancel}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkAsSoldConfirm}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
