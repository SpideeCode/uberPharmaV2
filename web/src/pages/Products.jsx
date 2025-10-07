import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, X, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

// Données de démonstration - À remplacer par un appel API
const demoProducts = [
  {
    id: 1,
    name: 'Doliprane 1000mg',
    description: 'Paracétamol 1000mg, boîte de 8 comprimés',
    price: 2.50,
    stock: 45,
    category: 'Antidouleur',
    requires_prescription: false,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Spasfon',
    description: 'Antispasmodique, boîte de 30 comprimés',
    price: 3.20,
    stock: 28,
    category: 'Antispasmodique',
    requires_prescription: false,
    image: 'https://via.placeholder.com/150',
  },
  // Ajoutez plus de produits de démonstration selon les besoins
];

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(demoProducts);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Filtrer les produits en fonction de la recherche et des filtres
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Extraire les catégories uniques pour les filtres
  const categories = ['all', ...new Set(products.map(product => product.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">
            Gérer les produits de votre pharmacie
          </p>
        </div>
        <Link to="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </Link>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Bouton Filtres */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="justify-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Filtres</span>
        </Button>
      </div>

      {/* Filtres */}
      {showFilters && (
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filtres</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              Réinitialiser
            </Button>
          </div>
          
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Catégorie</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des produits */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  {product.requires_prescription && (
                    <Badge variant="destructive">Ordonnance</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold">{product.price.toFixed(2)} €</span>
                  <span className={`text-sm ${
                    product.stock > 10 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {product.stock} en stock
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full" disabled={product.stock === 0}>
                  {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">Aucun produit trouvé.</p>
          <Button
            variant="ghost"
            className="mt-2"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};

export default Products;
