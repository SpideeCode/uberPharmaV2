import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Star, Package, Shield, Plus, Minus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

// Données de démonstration - À remplacer par un appel API
const demoProduct = {
  id: 1,
  name: 'Doliprane 1000mg',
  description: 'Le paracétamol est indiqué en cas de douleur et/ou de fièvre telles que maux de tête, états grippaux, douleurs dentaires, courbatures, règles douloureuses.',
  price: 2.50,
  originalPrice: 3.20,
  discount: 22,
  inStock: true,
  stock: 45,
  rating: 4.5,
  reviewCount: 128,
  requiresPrescription: false,
  category: 'Antidouleur',
  brand: 'Doliprane',
  dosage: '1000mg',
  form: 'Comprimé',
  image: 'https://via.placeholder.com/400x400?text=Doliprane+1000mg',
  images: [
    'https://via.placeholder.com/400x400?text=Doliprane+1000mg+1',
    'https://via.placeholder.com/400x400?text=Doliprane+1000mg+2',
    'https://via.placeholder.com/400x400?text=Doliprane+1000mg+3',
  ],
  details: {
    composition: 'Paracétamol 1000 mg, Excipients à effet notoire : lactose, saccharose.',
    indications: 'Traitement symptomatique des douleurs d\'intensité faible à modérée et/ou des états fébriles.',
    posologie: '1 comprimé, à renouveler si nécessaire au bout de 4 heures minimum. Ne pas dépasser 3 g par jour (3 comprimés par jour).',
    contreIndications: 'Hypersensibilité au paracétamol ou à l\'un des composants, insuffisance hépatocellulaire sévère.',
    effetsIndesirables: 'Rarement, réactions cutanées allergiques. Exceptionnellement, atteintes hépatiques en cas de surdosage.',
    conservation: 'À conserver à température ambiante, à l\'abri de l\'humidité et de la chaleur.',
  },
  relatedProducts: [
    {
      id: 2,
      name: 'Doliprane 500mg',
      price: 2.10,
      image: 'https://via.placeholder.com/200x200?text=Doliprane+500mg',
      rating: 4.3,
    },
    {
      id: 3,
      name: 'Spasfon',
      price: 3.20,
      image: 'https://via.placeholder.com/200x200?text=Spasfon',
      rating: 4.1,
    },
    {
      id: 4,
      name: 'Efferalgan 1000mg',
      price: 2.80,
      image: 'https://via.placeholder.com/200x200?text=Efferalgan+1000mg',
      rating: 4.2,
    },
    {
      id: 5,
      name: 'Advil 400mg',
      price: 3.50,
      image: 'https://via.placeholder.com/200x200?text=Advil+400mg',
      rating: 4.4,
    },
  ],
};

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Simulation de chargement
        await new Promise(resolve => setTimeout(resolve, 500));
        setProduct(demoProduct);
        setSelectedImage(demoProduct.image);
      } catch (error) {
        console.error('Erreur lors du chargement du produit:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      // Optionnel : afficher une notification
    }
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      if (!product) return 1;
      const newQuantity = increment ? prev + 1 : prev - 1;
      return Math.max(1, Math.min(newQuantity, product.stock));
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Produit non trouvé</h2>
        <Button onClick={() => navigate('/products')}>
          Retour à la liste des produits
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Retour
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galerie d'images */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg overflow-hidden border">
            <img 
              src={selectedImage} 
              alt={product.name} 
              className="w-full h-96 object-contain p-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x400?text=Image+non+disponible';
              }}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[product.image, ...(product.images || [])].map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-16 h-16 border rounded-md overflow-hidden ${
                  selectedImage === img ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <img 
                  src={img} 
                  alt={`Vue ${index + 1} de ${product.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/100x100?text=Image+non+disponible';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Détails du produit */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviewCount} avis)
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">
                {product.price.toFixed(2)}€
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice.toFixed(2)}€
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                  -{product.discount}%
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Package size={16} />
              <span>Forme: {product.form}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield size={16} />
              <span>
                {product.requiresPrescription 
                  ? 'Sur ordonnance' 
                  : 'Sans ordonnance'}
              </span>
            </div>
            <div className={`text-sm ${
              product.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock 
                ? `En stock (${product.stock} unités disponibles)`
                : 'Rupture de stock'}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => handleQuantityChange(false)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(true)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={!product.inStock || quantity >= product.stock}
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <Button 
                onClick={handleAddToCart}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={!product.inStock}
              >
                <ShoppingCart size={18} className="mr-2" />
                Ajouter au panier
              </Button>
            </div>

            <Button variant="outline" className="w-full">
              <Heart size={18} className="mr-2" />
              Ajouter à la liste de souhaits
            </Button>
          </div>

          <div className="border-t pt-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'description' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'details' 
                    ? 'text-green-600 border-b-2 border-green-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Détails
              </button>
            </div>

            <div className="py-4 text-gray-700">
              {activeTab === 'description' ? (
                <p>{product.description}</p>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Composition</h4>
                    <p>{product.details?.composition || 'Non disponible'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Indications</h4>
                    <p>{product.details?.indications || 'Non disponible'}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Posologie</h4>
                    <p>{product.details?.posologie || 'Non disponible'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <div className="mt-16">
          <h3 className="text-xl font-bold mb-6">Produits similaires</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {product.relatedProducts.map((item) => (
              <div 
                key={item.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/products/${item.id}`)}
              >
                <div className="p-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-32 object-contain mb-3"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200x200?text=Image+non+disponible';
                    }}
                  />
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-green-600">{item.price}€</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={12} 
                          fill={i < Math.floor(item.rating) ? 'currentColor' : 'none'} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
