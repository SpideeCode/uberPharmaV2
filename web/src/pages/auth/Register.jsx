import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderCircle, User, Mail, Lock, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import InputError from '../../components/InputError';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des mots de passe
    if (password !== passwordConfirmation) {
      setErrors({
        password_confirmation: ['Les mots de passe ne correspondent pas.']
      });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      // Redirection après inscription réussie
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setErrors({
          email: ['Une erreur est survenue. Veuillez réessayer plus tard.']
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Règles de validation du mot de passe
  const passwordRequirements = [
    { id: 'length', text: '8 caractères minimum', validate: (pwd) => pwd.length >= 8 },
    { id: 'uppercase', text: '1 lettre majuscule', validate: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'number', text: '1 chiffre', validate: (pwd) => /\d/.test(pwd) },
    { id: 'special', text: '1 caractère spécial', validate: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            UberPharma
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Créez votre compte
          </p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="space-y-1">
            <div className="w-16 h-16 bg-green-100 text-green-700 flex items-center justify-center rounded-full mx-auto mb-4">
              <span className="text-2xl font-bold">UP</span>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Créer un compte
            </CardTitle>
            <CardDescription className="text-center">
              Remplissez le formulaire pour vous inscrire
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    placeholder="Votre nom complet"
                    className="pl-10"
                  />
                </div>
                <InputError message={errors.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    placeholder="email@exemple.com"
                    className="pl-10"
                  />
                </div>
                <InputError message={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                
                {/* Indicateurs de force du mot de passe */}
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req) => {
                    const isValid = req.validate(password);
                    return (
                      <div key={req.id} className="flex items-center text-sm">
                        {isValid ? (
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <div className="h-4 w-4 border border-gray-300 rounded-full mr-2" />
                        )}
                        <span className={isValid ? 'text-green-600' : 'text-gray-500'}>
                          {req.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                
                <InputError message={errors.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirmez le mot de passe</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password_confirmation"
                    type="password"
                    required
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
                <InputError message={errors.password_confirmation} />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 mt-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                    Création du compte...
                  </>
                ) : 'Créer un compte'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Vous avez déjà un compte ?
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/login">
                Se connecter
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        <p className="mt-4 text-center text-sm text-gray-600">
          En vous inscrivant, vous acceptez nos{' '}
          <Link to="/terms" className="font-medium text-green-600 hover:text-green-500">
            conditions d'utilisation
          </Link>{' '}
          et notre{' '}
          <Link to="/privacy" className="font-medium text-green-600 hover:text-green-500">
            politique de confidentialité
          </Link>.
        </p>
      </div>
    </div>
  );
};

export default Register;
