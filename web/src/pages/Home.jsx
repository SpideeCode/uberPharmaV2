import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Phone, Clock as ClockIcon, Star, Shield, Truck, Check, Plus, Minus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Charger les pharmacies depuis l'API
  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/pharmacies');
        setPharmacies(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des pharmacies:', err);
        setError('Impossible de charger les pharmacies. Veuillez réessayer plus tard.');
        // Données de démonstration en cas d'erreur
        setPharmacies([
          {
            id: 1,
            name: 'Pharmacie Centrale',
            address: '123 Avenue de la République, 75011 Paris',
            phone: '01 23 45 67 89',
            is_open: true,
            rating: 4.5,
            delivery_time: '30-45 min',
            image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 2,
            name: 'Pharmacie du Marché',
            address: '45 Rue du Commerce, 75015 Paris',
            phone: '01 34 56 78 90',
            is_open: true,
            rating: 4.2,
            delivery_time: '20-35 min',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          },
          {
            id: 3,
            name: 'Pharmacie de la Gare',
            address: '8 Place de la Gare, 75010 Paris',
            phone: '01 45 67 89 01',
            is_open: false,
            rating: 4.0,
            delivery_time: '15-30 min',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  // Filtrer les pharmacies en fonction de la recherche et des filtres
  const filteredPharmacies = React.useMemo(() => {
    let result = [...pharmacies];

    // Filtre par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(pharmacy =>
        pharmacy.name.toLowerCase().includes(query) ||
        (pharmacy.address && pharmacy.address.toLowerCase().includes(query))
      );
    }

    // Filtre par statut d'ouverture
    if (activeFilter === 'open') {
      result = result.filter(pharmacy => pharmacy.is_open);
    }

    return result;
  }, [pharmacies, searchQuery, activeFilter]);

  // Afficher les étoiles de notation
  const renderStars = (rating = 0) => {
    return Array(5).fill(0).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Gérer le clic sur une pharmacie
  const handlePharmacyClick = (pharmacyId) => {
    navigate(`/pharmacies/${pharmacyId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-600 text-white py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
            Votre santé, notre priorité
          </h1>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto">
            Commandez vos médicaments en ligne et faites-vous livrer rapidement
          </p>

          {/* Barre de recherche */}
          <div className="max-w-2xl mx-auto relative bg-white rounded-full shadow-lg overflow-hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une pharmacie, un médicament..."
                className="w-full py-3 md:py-4 pl-12 pr-6 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Section des pharmacies */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Nos pharmacies partenaires
              </h2>
              <p className="text-gray-600">Trouvez la pharmacie la plus proche de chez vous</p>
            </div>
            <div className="flex space-x-2 bg-white p-1 rounded-full shadow-sm border border-gray-200 mt-4 md:mt-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === 'all' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Toutes
              </button>
              <button
                onClick={() => setActiveFilter('open')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  activeFilter === 'open' 
                    ? 'bg-green-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Ouvertes maintenant
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          ) : filteredPharmacies.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aucune pharmacie trouvée</h3>
              <p className="mt-1 text-gray-500">Essayez de modifier votre recherche ou vos filtres.</p>
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPharmacies.map((pharmacy) => (
                <div
                  key={pharmacy.id}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-green-100 cursor-pointer"
                  onClick={() => handlePharmacyClick(pharmacy.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    {pharmacy.image ? (
                      <img
                        src={pharmacy.image}
                        alt={pharmacy.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <MapPin className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent">
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex justify-between items-end">
                          <h3 className="text-white font-bold text-xl drop-shadow-md">
                            {pharmacy.name}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                            {pharmacy.delivery_time || 'Rapidement'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {pharmacy.is_open ? (
                      <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 mr-1.5 bg-green-500 rounded-full"></span>
                        Ouvert maintenant
                      </span>
                    ) : (
                      <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 mr-1.5 bg-red-500 rounded-full"></span>
                        Fermé
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {renderStars(pharmacy.rating)}
                        <span className="text-sm text-gray-600 ml-1.5">
                          {pharmacy.rating ? `(${pharmacy.rating.toFixed(1)})` : '(Nouveau)'}
                        </span>
                      </div>
                      <span className="mx-2 text-gray-300">•</span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Truck className="w-4 h-4 mr-1" />
                        {pharmacy.delivery_time || 'Livraison rapide'}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 flex items-start">
                      <MapPin className="flex-shrink-0 w-4 h-4 mt-0.5 mr-1.5 text-gray-400" />
                      <span>{pharmacy.address || 'Adresse non disponible'}</span>
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1.5 text-gray-400" />
                        {pharmacy.phone || 'N/A'}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePharmacyClick(pharmacy.id);
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                      >
                        Voir la pharmacie
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section Avantages */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir UberPharma ?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un service de livraison de médicaments rapide, fiable et sécurisé
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center px-6 py-8 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Livraison rapide</h3>
              <p className="text-gray-600">
                Recevez vos médicaments en moins d'une heure, 7j/7, de 8h à 22h
              </p>
            </div>

            <div className="text-center px-6 py-8 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sécurité garantie</h3>
              <p className="text-gray-600">
                Tous nos produits sont certifiés et nos livreurs formés aux bonnes pratiques
              </p>
            </div>

            <div className="text-center px-6 py-8 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service client 24/7</h3>
              <p className="text-gray-600">
                Une équipe à votre écoute pour répondre à toutes vos questions
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
