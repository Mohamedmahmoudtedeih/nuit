import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { 
  ArrowLeft, 
  Car, 
  Building2, 
  Upload,
  X,
  MapPin,
  DollarSign,
  Star
} from 'lucide-react';
import { AdType } from '@/types';

type ListingType = 'car' | 'property';
type ListingPurpose = 'sale' | 'rent';

// Prix des types d'annonces
const AD_TYPE_PRICES = {
  star: 50,
  simple: 25,
};

const AddListing = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [listing, setListing] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    type: '' as ListingType | '',
    purpose: '' as ListingPurpose | '',
    adType: 'simple' as AdType, // Par défaut: simple
    title: '',
    description: '',
    price: '',
    location: '',
    // Car fields
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    color: '',
    // Property fields
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    floor: '',
    furnished: false,
  });

  // Load listing data if in edit mode
  useEffect(() => {
    const loadListing = async () => {
      if (isEditMode && id) {
        try {
          const loadedListing = await api.getListing(id);
          setListing(loadedListing);
          setFormData({
            type: loadedListing.type,
            purpose: loadedListing.purpose,
            adType: loadedListing.adType || 'simple',
            title: loadedListing.title,
            description: loadedListing.description,
            price: loadedListing.price.toString(),
            location: loadedListing.location,
            make: loadedListing.carDetails?.make || '',
            model: loadedListing.carDetails?.model || '',
            year: loadedListing.carDetails?.year.toString() || '',
            mileage: loadedListing.carDetails?.mileage.toString() || '',
            fuelType: loadedListing.carDetails?.fuelType || '',
            transmission: loadedListing.carDetails?.transmission || '',
            color: loadedListing.carDetails?.color || '',
            propertyType: loadedListing.propertyDetails?.propertyType || '',
            bedrooms: loadedListing.propertyDetails?.bedrooms.toString() || '',
            bathrooms: loadedListing.propertyDetails?.bathrooms.toString() || '',
            area: loadedListing.propertyDetails?.area.toString() || '',
            floor: loadedListing.propertyDetails?.floor?.toString() || '',
            furnished: loadedListing.propertyDetails?.furnished || false,
          });
          setImages(loadedListing.images || []);
        } catch (error: any) {
          toast.error('Erreur lors du chargement de l\'annonce');
          navigate('/dashboard');
        }
      }
    };
    loadListing();
  }, [isEditMode, id, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.purpose) {
      toast.error('Veuillez sélectionner le type et l\'objectif de l\'annonce');
      return;
    }
    
    if (!formData.adType) {
      toast.error('Veuillez sélectionner un type d\'annonce');
      return;
    }
    
    if (images.length === 0) {
      toast.error('Veuillez télécharger au moins une image');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const listingData: any = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        purpose: formData.purpose,
        price: parseFloat(formData.price),
        currency: 'AED',
        location: formData.location,
        adType: formData.adType,
        images: images,
      };
      
      if (formData.type === 'car') {
        listingData.carDetails = {
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year),
          mileage: parseInt(formData.mileage),
          fuel_type: formData.fuelType,
          transmission: formData.transmission,
          color: formData.color,
        };
      } else if (formData.type === 'property') {
        listingData.propertyDetails = {
          property_type: formData.propertyType,
          bedrooms: parseInt(formData.bedrooms),
          bathrooms: parseInt(formData.bathrooms),
          area: parseFloat(formData.area),
          floor: formData.floor ? parseInt(formData.floor) : null,
          furnished: formData.furnished,
          amenities: [],
        };
      }
      
      if (isEditMode && id) {
        await api.updateListing(id, listingData);
        toast.success('Annonce mise à jour avec succès !');
      } else {
        await api.createListing(listingData);
        toast.success(`Annonce soumise pour examen ! Frais de publication : $${AD_TYPE_PRICES[formData.adType]}`);
      }
      
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la soumission');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back Link */}
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au tableau de bord
          </Link>

          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                {isEditMode ? 'Modifier l\'annonce' : 'Ajouter une nouvelle annonce'}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode 
                  ? 'Modifiez les détails de votre annonce'
                  : 'Remplissez les détails ci-dessous pour publier votre voiture ou propriété'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Que souhaitez-vous publier ?</CardTitle>
                  <CardDescription>Sélectionnez le type et l'objectif de votre annonce</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'car' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.type === 'car'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <Car className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'car' ? 'text-secondary' : 'text-muted-foreground'}`} />
                      <p className="font-semibold">Voiture</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: 'property' })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.type === 'property'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <Building2 className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'property' ? 'text-secondary' : 'text-muted-foreground'}`} />
                      <p className="font-semibold">Propriété</p>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, purpose: 'sale' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.purpose === 'sale'
                          ? 'border-success bg-success/10'
                          : 'border-border hover:border-success/50'
                      }`}
                    >
                      <p className={`font-semibold ${formData.purpose === 'sale' ? 'text-success' : ''}`}>À vendre</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, purpose: 'rent' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.purpose === 'rent'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <p className={`font-semibold ${formData.purpose === 'rent' ? 'text-secondary' : ''}`}>À louer</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Ad Type Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Type d'annonce</CardTitle>
                  <CardDescription>Choisissez le type d'annonce pour votre publication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, adType: 'simple' })}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${
                        formData.adType === 'simple'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">Simple</h3>
                        <span className={`text-2xl font-bold ${formData.adType === 'simple' ? 'text-primary' : 'text-muted-foreground'}`}>
                          ${AD_TYPE_PRICES.simple}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Annonce standard avec visibilité de base
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, adType: 'star' })}
                      className={`p-6 rounded-xl border-2 transition-all text-left relative ${
                        formData.adType === 'star'
                          ? 'border-secondary bg-secondary/10'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Star className={`w-5 h-5 ${formData.adType === 'star' ? 'text-secondary fill-secondary' : 'text-muted-foreground'}`} />
                          <h3 className="font-semibold text-lg">Star</h3>
                        </div>
                        <span className={`text-2xl font-bold ${formData.adType === 'star' ? 'text-secondary' : 'text-muted-foreground'}`}>
                          ${AD_TYPE_PRICES.star}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Annonce mise en vedette avec visibilité maximale
                      </p>
                      {formData.adType === 'star' && (
                        <div className="absolute top-2 right-2">
                          <Star className="w-4 h-4 text-secondary fill-secondary" />
                        </div>
                      )}
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Prix sélectionné :</strong>{' '}
                      <span className="text-foreground font-semibold">
                        ${AD_TYPE_PRICES[formData.adType]} USD
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informations de base</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      placeholder="ex. : Mercedes-Benz Classe S 2023 ou Villa de luxe à Palm Jumeirah"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Décrivez votre annonce en détail..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (AED) *</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="price"
                          type="number"
                          placeholder={formData.purpose === 'rent' ? 'Loyer mensuel' : 'Prix de vente'}
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Localisation *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          id="location"
                          placeholder="ex. : Dubai Marina"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="pl-12"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Car Details */}
              {formData.type === 'car' && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Détails de la voiture</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="make">Marque *</Label>
                        <Input
                          id="make"
                          placeholder="ex. : Mercedes-Benz"
                          value={formData.make}
                          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="model">Modèle *</Label>
                        <Input
                          id="model"
                          placeholder="ex. : Classe S"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Année *</Label>
                        <Input
                          id="year"
                          type="number"
                          placeholder="ex. : 2023"
                          value={formData.year}
                          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mileage">Kilométrage (km) *</Label>
                        <Input
                          id="mileage"
                          type="number"
                          placeholder="ex. : 15000"
                          value={formData.mileage}
                          onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fuelType">Type de carburant *</Label>
                        <Input
                          id="fuelType"
                          placeholder="ex. : Essence, Diesel, Électrique"
                          value={formData.fuelType}
                          onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transmission">Transmission *</Label>
                        <Input
                          id="transmission"
                          placeholder="ex. : Automatique, Manuelle"
                          value={formData.transmission}
                          onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="color">Couleur *</Label>
                        <Input
                          id="color"
                          placeholder="ex. : Noir, Blanc, Argent"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Property Details */}
              {formData.type === 'property' && (
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle>Détails de la propriété</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="propertyType">Type de propriété *</Label>
                        <Input
                          id="propertyType"
                          placeholder="ex. : Appartement, Villa, Maison"
                          value={formData.propertyType}
                          onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Superficie (pi²) *</Label>
                        <Input
                          id="area"
                          type="number"
                          placeholder="ex. : 1500"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bedrooms">Chambres *</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="ex. : 3"
                          value={formData.bedrooms}
                          onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bathrooms">Salles de bain *</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          placeholder="ex. : 2"
                          value={formData.bathrooms}
                          onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="floor">Étage (optionnel)</Label>
                        <Input
                          id="floor"
                          type="number"
                          placeholder="ex. : 15"
                          value={formData.floor}
                          onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-8">
                        <input
                          type="checkbox"
                          id="furnished"
                          checked={formData.furnished}
                          onChange={(e) => setFormData({ ...formData, furnished: e.target.checked })}
                          className="w-4 h-4 rounded border-border"
                        />
                        <Label htmlFor="furnished">Meublé</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images *</CardTitle>
                  <CardDescription>Téléchargez des images de haute qualité de votre annonce (max 10)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img src={image} alt={`Téléchargement ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 10 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-secondary transition-colors cursor-pointer flex flex-col items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Télécharger</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex gap-4">
                <Button type="button" variant="outline" size="lg" onClick={() => navigate(-1)}>
                  Annuler
                </Button>
                <Button type="submit" variant="hero" size="lg" className="flex-1" disabled={isLoading}>
                  {isLoading 
                    ? (isEditMode ? 'Mise à jour...' : 'Soumission...') 
                    : (isEditMode ? 'Mettre à jour' : 'Soumettre pour examen')
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AddListing;
