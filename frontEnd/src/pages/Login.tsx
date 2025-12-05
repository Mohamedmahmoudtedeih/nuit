import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Phone, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import CountryCodeSelector from '@/components/CountryCodeSelector';
import { defaultCountryCode, CountryCode } from '@/data/countryCodes';
import { auth } from '@/lib/auth';
import { api } from '@/lib/api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<CountryCode>(defaultCountryCode);
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Combine country code and phone number
      // Keep the + sign to match registration format
      const fullPhone = countryCode.dialCode + formData.phone.replace(/\D/g, '');
      
      console.log('Logging in with phone:', fullPhone);
      
      // Call the API
      const response = await api.login(fullPhone, formData.password);
      
      // Store user and tokens
      auth.setAuth(response.user, response.tokens);
      
      toast.success('Connexion réussie !');
      
      // Redirect based on role
      if (response.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Show more detailed error message from backend
      let errorMessage = 'Erreur de connexion. Vérifiez vos identifiants.';
      
      if (error.response) {
        // Backend validation errors
        if (error.response.phone) {
          errorMessage = Array.isArray(error.response.phone) ? error.response.phone[0] : error.response.phone;
        } else if (error.response.password) {
          errorMessage = Array.isArray(error.response.password) ? error.response.password[0] : error.response.password;
        } else if (error.response.non_field_errors) {
          errorMessage = Array.isArray(error.response.non_field_errors) ? error.response.non_field_errors[0] : error.response.non_field_errors;
        } else if (error.response.detail) {
          errorMessage = error.response.detail;
        } else if (error.response.message) {
          errorMessage = error.response.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à l'accueil
        </Link>

        <Card variant="elevated" className="animate-scale-in">
          <CardHeader className="text-center pb-2">
            {/* Logo */}
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-2xl">M</span>
            </div>
            <CardTitle className="text-2xl">Bon retour</CardTitle>
            <CardDescription>
              Connectez-vous à votre compte pour continuer
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <div className="flex gap-2 items-stretch">
                  <CountryCodeSelector
                    value={countryCode}
                    onChange={setCountryCode}
                  />
                  <div className="relative flex-1">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="42038210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                      className="pl-12"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez votre mot de passe"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-12 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-secondary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button 
                type="submit" 
                variant="premium" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                Vous n'avez pas de compte ?{' '}
                <Link to="/signup" className="text-secondary font-medium hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
