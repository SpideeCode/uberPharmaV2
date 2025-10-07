import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Loader2, CheckCircle, ArrowLeft, MapPin, Clock, User, Phone, Mail } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';

// Données de démonstration - À remplacer par des appels API ou un état global
const demoCartItems = [
  {
    id: 1,
    name: 'Doliprane 1000mg',
    price: 2.50,
    quantity: 2,
    requiresPrescription: false,
  },
  {
    id: 2,
    name: 'Spasfon',
    price: 3.20,
    quantity: 1,
    requiresPrescription: true,
  },
];

const demoAddresses = [
  {
    id: 1,
    name: 'Domicile',
    street: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    phone: '06 12 34 56 78',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Bureau',
    street: '456 Avenue des Champs-Élysées',
    city: 'Paris',
    postalCode: '75008',
    phone: '06 87 65 43 21',
    isDefault: false,
  },
];

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      setSelectedAddress(demoAddresses.find(addr => addr.isDefault) || demoAddresses[0]);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Calculer le total
  const subtotal = demoCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const total = subtotal + deliveryFee;

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};
    
    if (!selectedAddress) {
      errors.address = 'Veuillez sélectionner une adresse de livraison';
    }
    
    if (paymentMethod === 'card') {
      if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
        errors.cardNumber = 'Numéro de carte invalide';
      }
      if (!cardDetails.name) {
        errors.cardName = 'Nom du titulaire requis';
      }
      if (!cardDetails.expiry || !/\d{2}\/\d{2}/.test(cardDetails.expiry)) {
        errors.cardExpiry = 'Date d\'expiration invalide (MM/AA)';
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        errors.cardCvv = 'Code de sécurité invalide';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Soumettre la commande
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    // Simuler un appel API
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Rediriger vers la page de confirmation après 3 secondes
      setTimeout(() => {
        navigate('/order-confirmation/12345');
      }, 3000);
    }, 2000);
  };

  // Formater le numéro de carte
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Formater la date d'expiration
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande validée !</h1>
        <p className="text-gray-600 mb-8">
          Votre commande a été passée avec succès. Vous allez être redirigé vers la page de confirmation...
        </p>
        <div className="animate-pulse">
          <Loader2 className="h-8 w-8 mx-auto text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Retour au panier
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne de gauche - Informations */}
            <div className="lg:col-span-2 space-y-8">
              {/* Adresse de livraison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                    Adresse de livraison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={selectedAddress?.id?.toString()} 
                    onValueChange={(value) => {
                      const address = demoAddresses.find(addr => addr.id.toString() === value);
                      setSelectedAddress(address);
                      setFormErrors({...formErrors, address: null});
                    }}
                    className="space-y-4"
                  >
                    {demoAddresses.map((address) => (
                      <div key={address.id} className="flex items-start space-x-3">
                        <RadioGroupItem value={address.id.toString()} id={`address-${address.id}`} />
                        <div className="grid gap-1.5 leading-none">
                          <div className="flex items-center">
                            <Label htmlFor={`address-${address.id}`} className="font-medium">
                              {address.name} {address.isDefault && '(Par défaut)'}
                            </Label>
                          </div>
                          <p className="text-sm text-gray-600">
                            {address.street}<br />
                            {address.postalCode} {address.city}<br />
                            Tél: {address.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {formErrors.address && (
                    <p className="mt-2 text-sm text-red-600">{formErrors.address}</p>
                  )}
                  
                  <button 
                    type="button"
                    className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    + Ajouter une nouvelle adresse
                  </button>
                </CardContent>
              </Card>
              
              {/* Méthode de paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={paymentMethod} 
                    onValueChange={setPaymentMethod}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="card" id="card" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="card" className="font-medium">
                          Carte bancaire
                        </Label>
                        <p className="text-sm text-gray-600">
                          Paiement sécurisé par carte bancaire
                        </p>
                      </div>
                    </div>
                    
                    {paymentMethod === 'card' && (
                      <div className="mt-4 space-y-4 pl-7">
                        <div>
                          <Label htmlFor="cardNumber">Numéro de carte</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => {
                              setCardDetails({
                                ...cardDetails,
                                number: formatCardNumber(e.target.value)
                              });
                              setFormErrors({...formErrors, cardNumber: null});
                            }}
                            className={formErrors.cardNumber ? 'border-red-500' : ''}
                            maxLength={19}
                          />
                          {formErrors.cardNumber && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="cardName">Nom du titulaire</Label>
                          <Input
                            id="cardName"
                            placeholder="NOM PRENOM"
                            value={cardDetails.name}
                            onChange={(e) => {
                              setCardDetails({
                                ...cardDetails,
                                name: e.target.value.toUpperCase()
                              });
                              setFormErrors({...formErrors, cardName: null});
                            }}
                            className={formErrors.cardName ? 'border-red-500' : ''}
                          />
                          {formErrors.cardName && (
                            <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Date d'expiration (MM/AA)</Label>
                            <Input
                              id="cardExpiry"
                              placeholder="MM/AA"
                              value={cardDetails.expiry}
                              onChange={(e) => {
                                setCardDetails({
                                  ...cardDetails,
                                  expiry: formatExpiry(e.target.value)
                                });
                                setFormErrors({...formErrors, cardExpiry: null});
                              }}
                              className={formErrors.cardExpiry ? 'border-red-500' : ''}
                              maxLength={5}
                            />
                            {formErrors.cardExpiry && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.cardExpiry}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="cardCvv">Code de sécurité</Label>
                            <Input
                              id="cardCvv"
                              placeholder="123"
                              value={cardDetails.cvv}
                              onChange={(e) => {
                                setCardDetails({
                                  ...cardDetails,
                                  cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                                });
                                setFormErrors({...formErrors, cardCvv: null});
                              }}
                              className={formErrors.cardCvv ? 'border-red-500' : ''}
                              maxLength={4}
                            />
                            {formErrors.cardCvv && (
                              <p className="mt-1 text-sm text-red-600">{formErrors.cardCvv}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start space-x-3">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="paypal" className="font-medium">
                          PayPal
                        </Label>
                        <p className="text-sm text-gray-600">
                          Payer avec votre compte PayPal
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
              
              {/* Informations de contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-green-600" />
                    Informations de contact
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Adresse e-mail</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        defaultValue={user?.email || ''}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="06 12 34 56 78"
                        defaultValue={selectedAddress?.phone || ''}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Colonne de droite - Récapitulatif */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {demoCartItems.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × {item.price.toFixed(2)} €
                          </p>
                        </div>
                        <span className="font-medium">
                          {(item.price * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between py-1">
                      <span>Sous-total</span>
                      <span>{subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Livraison</span>
                      <span>{deliveryFee.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg text-amber-800 text-sm">
                    <p className="font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Livraison estimée
                    </p>
                    <p className="mt-1">
                      Votre commande sera livrée dans les 30 à 60 minutes.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      `Payer ${total.toFixed(2)} €`
                    )}
                  </Button>
                </CardFooter>
              </Card>
              
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 text-sm text-gray-600">
                <p className="font-medium mb-2">Paiement sécurisé</p>
                <p className="mb-2">
                  Vos informations de paiement sont cryptées et sécurisées. Nous ne stockons jamais les détails de votre carte.
                </p>
                <div className="flex space-x-2 mt-3">
                  <div className="p-1.5 border rounded">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                      alt="Visa" 
                      className="h-6"
                    />
                  </div>
                  <div className="p-1.5 border rounded">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                      alt="Mastercard" 
                      className="h-6"
                    />
                  </div>
                  <div className="p-1.5 border rounded">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_Pay_logo.svg/800px-Apple_Pay_logo.svg.png" 
                      alt="Apple Pay" 
                      className="h-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
