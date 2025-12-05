import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { 
  Car, 
  Building2, 
  ArrowRight
} from 'lucide-react';

const categories = [
  {
    icon: Car,
    title: 'Voitures à vendre',
    description: 'Trouvez la voiture de vos rêves à vendre',
    link: '/search?type=car&purpose=sale',
    count: '250+',
  },
  {
    icon: Car,
    title: 'Voitures à louer',
    description: 'Louez une voiture pour vos besoins',
    link: '/search?type=car&purpose=rent',
    count: '180+',
  },
  {
    icon: Building2,
    title: 'Propriétés à vendre',
    description: 'Découvrez des propriétés à vendre',
    link: '/search?type=property&purpose=sale',
    count: '320+',
  },
  {
    icon: Building2,
    title: 'Propriétés à louer',
    description: 'Trouvez une propriété à louer',
    link: '/search?type=property&purpose=rent',
    count: '450+',
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Parcourir par catégorie
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explorez notre gamme variée de voitures et propriétés. Trouvez exactement ce que vous cherchez.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link 
              key={category.title} 
              to={category.link}
              className={`animate-fade-in stagger-${index + 1}`}
            >
              <Card variant="elevated" className="p-6 h-full group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <category.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {category.count}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {category.description}
                </p>
                <div className="flex items-center text-secondary font-medium text-sm group-hover:gap-3 gap-2 transition-all">
                  <span>Parcourir maintenant</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
