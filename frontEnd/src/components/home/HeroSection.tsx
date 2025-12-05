import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Car, Building2, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'car' | 'property'>('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (activeTab !== 'all') params.set('type', activeTab);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920')] bg-cover bg-center opacity-20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight">
              Trouvez votre
              <span className="block text-secondary">Voiture ou Propriété parfaite</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Découvrez des véhicules premium et des propriétés exclusives sur une seule place de marché. 
              Votre style de vie de rêve vous attend.
            </p>
          </div>

          {/* Search Box */}
          <div className="animate-slide-up stagger-1">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-2 md:p-3 max-w-3xl mx-auto">
              {/* Tabs */}
              <div className="flex items-center gap-1 mb-3 p-1 bg-muted rounded-xl">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'all'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Tout
                </button>
                <button
                  onClick={() => setActiveTab('car')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'car'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  Voitures
                </button>
                <button
                  onClick={() => setActiveTab('property')}
                  className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'property'
                      ? 'bg-white text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  Propriétés
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      activeTab === 'car'
                        ? 'Rechercher par marque, modèle ou localisation...'
                        : activeTab === 'property'
                        ? 'Rechercher par localisation, type de propriété...'
                        : 'Rechercher des voitures ou propriétés...'
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 border-0 bg-muted/50 text-base"
                  />
                </div>
                <Button type="submit" variant="hero" size="xl">
                  <span className="hidden sm:inline">Rechercher</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 pt-8 animate-fade-in stagger-2">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-white">2,500+</p>
              <p className="text-white/60 text-sm">Annonces actives</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-white">500+</p>
              <p className="text-white/60 text-sm">Voitures premium</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-display font-bold text-white">1,000+</p>
              <p className="text-white/60 text-sm">Propriétés</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
