import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  Car, 
  Building2, 
  Menu, 
  X, 
  User, 
  LogIn,
  LogOut,
  Plus,
  LayoutDashboard
} from 'lucide-react';
import { auth } from '@/lib/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check auth state on mount and when storage changes
    setIsLoggedIn(auth.isLoggedIn());
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      setIsLoggedIn(auth.isLoggedIn());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
    toast.success('Déconnexion réussie !');
    navigate('/');
    // Force page reload to update header
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">M</span>
            </div>
            <span className="font-display text-xl font-semibold text-foreground hidden sm:block">
              Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/search?type=car" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Car className="w-4 h-4" />
              <span>Voitures</span>
            </Link>
            <Link 
              to="/search?type=property" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>Propriétés</span>
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Tableau de bord
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/add-listing">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter une annonce
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Connexion
                  </Link>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/signup">
                    <User className="w-4 h-4 mr-2" />
                    S'inscrire
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link 
                to="/search?type=car" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Car className="w-5 h-5 text-muted-foreground" />
                <span>Voitures</span>
              </Link>
              <Link 
                to="/search?type=property" 
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <span>Propriétés</span>
              </Link>
              <div className="h-px bg-border my-2" />
              {isLoggedIn ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
                    <span>Tableau de bord</span>
                  </Link>
                  <Link 
                    to="/add-listing" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/20 text-secondary-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter une annonce</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5 text-muted-foreground" />
                    <span>Connexion</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary/20 text-secondary-foreground transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>S'inscrire</span>
                  </Link>
                </>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5 text-muted-foreground" />
                  <span>Déconnexion</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
