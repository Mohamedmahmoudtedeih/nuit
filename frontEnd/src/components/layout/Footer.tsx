import { Link } from 'react-router-dom';
import { Car, Building2, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <span className="text-secondary-foreground font-display font-bold text-lg">M</span>
              </div>
              <span className="font-display text-xl font-semibold">Marketplace</span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Votre destination de confiance pour les voitures et propriétés premium. 
              Trouvez votre voiture de rêve ou votre maison parfaite dès aujourd'hui.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search?type=car" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Car className="w-4 h-4" />
                  Parcourir les voitures
                </Link>
              </li>
              <li>
                <Link to="/search?type=property" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  <Building2 className="w-4 h-4" />
                  Parcourir les propriétés
                </Link>
              </li>
              <li>
                <Link to="/add-listing" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Publier votre annonce
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Conseils de sécurité
                </Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Nous contacter</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="w-4 h-4" />
                <span>support@marketplace.com</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="w-4 h-4" />
                <span>+971 50 123 4567</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-4 h-4" />
                <span>Dubai, UAE</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © 2024 Marketplace. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm">
                Facebook
              </Link>
              <Link to="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm">
                Instagram
              </Link>
              <Link to="#" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors text-sm">
                Twitter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
