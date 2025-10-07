import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

// Données de démonstration - À remplacer par un appel API ou un état global
const demoCartItems = [
  {
    id: 1,
    productId: 1,
    name: 'Doliprane 1000mg',
    price: 2.50,
    quantity: 2,
    image: 'https://via.placeholder.com/80',
    maxQuantity: 10,
    requiresPrescription: false,
  },
  {
    id: 2,
    productId: 2,
    name: 'Spasfon',
    price: 3.20,
    quantity: 1,
    image: 'https://via.placeholder.com/80',
    maxQuantity: 5,
    requiresPrescription: true,
  },
];

// Données de démonstration pour l'adresse de livraison
const demoAddress = {
  name: 'Jean Dupont',
  street: '123 Rue de la Paix',
  city: 'Paris',
  postalCode: '75001',
  phone: '06 12 34 56 78',
};

const Cart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      setCartItems(demoCartItems);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Calculer le sous-total
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Frais de livraison (exemple)
  const deliveryFee = 2.99;
  
  // Total
  const total = subtotal + deliveryFee;

  // Mettre à jour la quantité d'un article
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) } : item
    ));
  };

  // Supprimer un article du panier
  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Passer la commande
  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simuler un appel API
    setTimeout(() => {
      setIsCheckingOut(false);
      // Rediriger vers la page de paiement
      // navigate('/checkout');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Panier */}
        <div className="md:w-2/3">
          <div className="flex items-center mb-6">
            <Link to="/" className="text-green-600 hover:text-green-700 mr-4">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Votre panier</h1>
            <span className="ml-2 text-gray-500">({cartItems.length} article{cartItems.length !== 1 ? 's' : ''})</span>
          </div>

          {cartItems.length > 0 ? (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start p-4 border rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 object-cover rounded-md mr-4"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-medium">
                        {item.name}
                        {item.requiresPrescription && (
                          <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                            Ordonnance requise
                          </span>
                        )}
                      </h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <p className="text-green-600 font-semibold mt-1">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                    
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="mx-3">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="text-sm text-gray-500 ml-2">
                        max: {item.maxQuantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Votre panier est vide</h3>
              <p className="mt-1 text-gray-500">Commencez à ajouter des articles à votre panier.</p>
              <div className="mt-6">
                <Link to="/products">
                  <Button>
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Voir les produits
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Récapitulatif de la commande */}
        {cartItems.length > 0 && (
          <div className="md:w-1/3">
            <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-4">
              <h2 className="text-lg font-medium mb-4">Récapitulatif de la commande</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span>{deliveryFee.toFixed(2)} €</span>
                </div>
                
                <div className="border-t border-gray-200 my-2"></div>
                
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                
                <div className="pt-2">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Traitement...
                      </>
                    ) : (
                      'Procéder au paiement'
                    )}
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  En passant commande, vous acceptez nos conditions générales de vente.
                </p>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Adresse de livraison</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{demoAddress.name}</p>
                  <p>{demoAddress.street}</p>
                  <p>{demoAddress.postalCode} {demoAddress.city}</p>
                  <p className="mt-2">Tél: {demoAddress.phone}</p>
                  <button className="mt-2 text-sm text-green-600 hover:underline">
                    Modifier l'adresse
                  </button>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h3 className="font-medium mb-2">Moyens de paiement</h3>
                <div className="flex space-x-2">
                  <div className="border rounded-md p-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" 
                      alt="Visa" 
                      className="h-6"
                    />
                  </div>
                  <div className="border rounded-md p-2">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" 
                      alt="Mastercard" 
                      className="h-6"
                    />
                  </div>
                  <div className="border rounded-md p-2">
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
        )}
      </div>
    </div>
  );
};

export default Cart;
