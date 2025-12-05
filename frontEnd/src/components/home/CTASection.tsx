import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Shield, TrendingUp, Clock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Plateforme sécurisée',
    description: 'Toutes les annonces sont vérifiées par notre équipe',
  },
  {
    icon: TrendingUp,
    title: 'Large portée',
    description: 'Connectez-vous avec des milliers d\'acheteurs',
  },
  {
    icon: Clock,
    title: 'Processus rapide',
    description: 'Publiez votre annonce en moins de 5 minutes',
  },
];

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Prêt à vendre ?
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
              Publiez votre voiture ou propriété sur notre place de marché et atteignez des milliers d'acheteurs potentiels. 
              C'est gratuit, rapide et sécurisé.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                <Plus className="w-5 h-5 mr-2" />
                Commencer à publier maintenant
              </Link>
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
