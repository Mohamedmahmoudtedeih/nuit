import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { Listing } from '@/types';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Car,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  Star,
  Key
} from 'lucide-react';

const Dashboard = () => {
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState<string | null>(null);
  const [soldDialogOpen, setSoldDialogOpen] = useState(false);
  const [listingToMarkAsSold, setListingToMarkAsSold] = useState<string | null>(null);

  // Fetch user listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const listings = await api.getMyListings();
        setUserListings(listings);
      } catch (error: any) {
        toast.error('Erreur lors du chargement de vos annonces');
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
  
  // Filter listings by status
  const pendingListings = userListings.filter(l => l.status === 'pending');
  const activeListings = userListings.filter(l => l.status === 'approved');
  const soldListings = userListings.filter(l => l.status === 'sold');

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
  
  const stats = [
    { 
      label: 'Annonces actives', 
      value: activeListings.length,
      icon: Package,
      color: 'text-success'
    },
    { 
      label: 'En attente d\'examen', 
      value: pendingListings.length,
      icon: Clock,
      color: 'text-warning'
    },
    { 
      label: 'Vendues', 
      value: soldListings.length,
      icon: ShoppingCart,
      color: 'text-primary'
    },
    { 
      label: 'Vues totales', 
      value: '1,234',
      icon: Eye,
      color: 'text-secondary'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="approved"><CheckCircle className="w-3 h-3 mr-1" />Actif</Badge>;
      case 'pending':
        return <Badge variant="pending"><Clock className="w-3 h-3 mr-1" />Non confirmé</Badge>;
      case 'rejected':
        return <Badge variant="rejected"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      case 'sold':
        return <Badge variant="secondary" className="bg-muted text-muted-foreground"><ShoppingCart className="w-3 h-3 mr-1" />Vendu</Badge>;
      default:
        return null;
    }
  };

  const handleMarkAsSoldClick = (listingId: string) => {
    setListingToMarkAsSold(listingId);
    setSoldDialogOpen(true);
  };

  const handleMarkAsSoldConfirm = async () => {
    if (listingToMarkAsSold) {
      try {
        await api.markListingAsSold(listingToMarkAsSold);
        const listing = userListings.find(l => l.id === listingToMarkAsSold);
        setUserListings(prev => 
          prev.map(listing => 
            listing.id === listingToMarkAsSold 
              ? { ...listing, status: 'sold' as const }
              : listing
          )
        );
        toast.success(listing?.purpose === 'sale' ? 'Produit marqué comme vendu !' : 'Produit marqué comme loué !');
        setListingToMarkAsSold(null);
        setSoldDialogOpen(false);
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la mise à jour');
      }
    }
  };

  const handleMarkAsSoldCancel = () => {
    setListingToMarkAsSold(null);
    setSoldDialogOpen(false);
  };

  const handleDeleteClick = (listingId: string) => {
    setListingToDelete(listingId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (listingToDelete) {
      try {
        await api.deleteListing(listingToDelete);
        setUserListings(prev => prev.filter(listing => listing.id !== listingToDelete));
        toast.success('Produit supprimé avec succès !');
        setListingToDelete(null);
        setDeleteDialogOpen(false);
      } catch (error: any) {
        toast.error(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleDeleteCancel = () => {
    setListingToDelete(null);
    setDeleteDialogOpen(false);
  };

  const formatPrice = (price: number, currency: string) => {
    // Format as number with thousand separators, without currency symbol
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Listing Item Component
  const ListingItem = ({ 
    listing, 
    formatPrice, 
    getStatusBadge, 
    onMarkAsSoldClick,
    onDeleteClick
  }: { 
    listing: Listing; 
    formatPrice: (price: number, currency: string) => string;
    getStatusBadge: (status: string) => JSX.Element | null;
    onMarkAsSoldClick: (id: string) => void;
    onDeleteClick: (id: string) => void;
  }) => (
    <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
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
          listing.type === 'car' ? (
            <Car className="w-8 h-8 text-muted-foreground" />
          ) : (
            <Building2 className="w-8 h-8 text-muted-foreground" />
          )
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
          {listing.adType === 'star' && (
            <Star className="w-4 h-4 text-secondary fill-secondary" />
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{formatPrice(listing.price, listing.currency)}</span>
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
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/listing/${listing.id}`}>
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
        {listing.status === 'approved' && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onMarkAsSoldClick(listing.id)}
            title={listing.purpose === 'sale' ? "Marquer comme vendu" : "Marquer comme loué"}
            className="text-success hover:text-success"
          >
            {listing.purpose === 'sale' ? (
              <ShoppingCart className="w-4 h-4 mr-1" />
            ) : (
              <Key className="w-4 h-4 mr-1" />
            )}
            {listing.purpose === 'sale' ? 'Vendu' : 'Louer'}
          </Button>
        )}
        {listing.status !== 'sold' && (
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/edit-listing/${listing.id}`}>
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive hover:text-destructive"
          onClick={() => onDeleteClick(listing.id)}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                Gérez vos annonces et suivez les performances
              </p>
            </div>
            <Button variant="hero" size="lg" asChild>
              <Link to="/add-listing">
                <Plus className="w-5 h-5 mr-2" />
                Ajouter une nouvelle annonce
              </Link>
            </Button>
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

          {/* Non confirmées (En attente) */}
          {pendingListings.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-warning" />
                  Non confirmées ({pendingListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      formatPrice={formatPrice}
                      getStatusBadge={getStatusBadge}
                      onMarkAsSoldClick={handleMarkAsSoldClick}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Annonces actives */}
          {activeListings.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Actives ({activeListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      formatPrice={formatPrice}
                      getStatusBadge={getStatusBadge}
                      onMarkAsSoldClick={handleMarkAsSoldClick}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Produits vendus */}
          {soldListings.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-muted-foreground" />
                  Vendues ({soldListings.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {soldListings.map((listing) => (
                    <ListingItem
                      key={listing.id}
                      listing={listing}
                      formatPrice={formatPrice}
                      getStatusBadge={getStatusBadge}
                      onMarkAsSoldClick={handleMarkAsSoldClick}
                      onDeleteClick={handleDeleteClick}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Message si aucune annonce */}
          {userListings.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucune annonce</h3>
                <p className="text-muted-foreground mb-4">
                  Commencez par créer votre première annonce
                </p>
                <Button variant="hero" asChild>
                  <Link to="/add-listing">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une annonce
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Mark as Sold Confirmation Dialog */}
          <AlertDialog open={soldDialogOpen} onOpenChange={setSoldDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {listingToMarkAsSold && userListings.find(l => l.id === listingToMarkAsSold)?.purpose === 'sale'
                    ? 'Marquer comme vendu'
                    : 'Marquer comme loué'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {listingToMarkAsSold && userListings.find(l => l.id === listingToMarkAsSold)?.purpose === 'sale'
                    ? 'Êtes-vous sûr de vouloir marquer ce produit comme vendu ? Le produit sera déplacé dans la section "Vendues" et ne sera plus visible dans les recherches actives.'
                    : 'Êtes-vous sûr de vouloir marquer ce produit comme loué ? Le produit sera déplacé dans la section "Vendues" et ne sera plus visible dans les recherches actives.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleMarkAsSoldCancel}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleMarkAsSoldConfirm}
                  className="bg-success text-success-foreground hover:bg-success/90"
                >
                  Confirmer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer cette annonce ? Cette action est irréversible et l'annonce sera définitivement supprimée.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleDeleteCancel}>
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" variant="elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Car className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold">Publier une voiture</h3>
                  <p className="text-sm text-muted-foreground">Ajoutez votre véhicule à vendre ou à louer</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" variant="elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Publier une propriété</h3>
                  <p className="text-sm text-muted-foreground">Ajoutez votre propriété à vendre ou à louer</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" variant="elevated">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Voir les statistiques</h3>
                  <p className="text-sm text-muted-foreground">Suivez les performances de vos annonces</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
