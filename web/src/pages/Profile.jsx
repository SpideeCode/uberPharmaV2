import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Données de démonstration pour les adresses
  const [addresses, setAddresses] = useState([
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
  ]);

  // Données de démonstration pour les commandes récentes
  const recentOrders = [
    {
      id: 'CMD-2023-001',
      date: '2023-11-15T14:30:00',
      total: 42.50,
      status: 'delivered',
      items: 3,
    },
    {
      id: 'CMD-2023-002',
      date: '2023-11-10T09:15:00',
      total: 28.75,
      status: 'delivered',
      items: 2,
    },
  ];

  // Formulaire de profil
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Formulaire de mot de passe
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, reset: resetPassword } = useForm();

  // Mettre à jour le profil
  const onSubmitProfile = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      await updateProfile(data);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setIsLoading(false);
    }
  };

  // Changer le mot de passe
  const onSubmitPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await updatePassword(data.currentPassword, data.newPassword);
      setIsSuccess(true);
      resetPassword();
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors du changement de mot de passe');
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une nouvelle adresse
  const handleAddAddress = (e) => {
    e.preventDefault();
    // Implémentez la logique pour ajouter une nouvelle adresse
  };

  // Mettre à jour l'adresse par défaut
  const setDefaultAddress = (id) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  // Supprimer une adresse
  const deleteAddress = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Barre latérale */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-600">
                  {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || 'P'}
                </div>
                <button className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1.5 hover:bg-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl font-semibold">{user?.firstName} {user?.lastName}</h2>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <p className="text-gray-500 text-sm mt-1">Membre depuis {new Date(user?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-medium">Menu</h3>
            </div>
            <nav className="p-2">
              <a href="#profile" className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-md">
                <User className="h-4 w-4 mr-3" />
                Profil
              </a>
              <a href="#password" className="flex items-center px-4 py-2 mt-1 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <Lock className="h-4 w-4 mr-3" />
                Mot de passe
              </a>
              <a href="#addresses" className="flex items-center px-4 py-2 mt-1 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <MapPin className="h-4 w-4 mr-3" />
                Adresses
              </a>
              <a href="#orders" className="flex items-center px-4 py-2 mt-1 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Commandes
              </a>
            </nav>
          </div>
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {isSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Vos modifications ont été enregistrées avec succès.</p>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="password">Mot de passe</TabsTrigger>
              <TabsTrigger value="addresses">Adresses</TabsTrigger>
              <TabsTrigger value="orders">Commandes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations personnelles et la façon dont vous apparaissez sur la plateforme.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleProfileSubmit(onSubmitProfile)}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="firstName"
                            type="text"
                            className="pl-10"
                            {...registerProfile('firstName', { required: 'Le prénom est requis' })}
                          />
                        </div>
                        {profileErrors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.firstName.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <div className="relative mt-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="lastName"
                            type="text"
                            className="pl-10"
                            {...registerProfile('lastName', { required: 'Le nom est requis' })}
                          />
                        </div>
                        {profileErrors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{profileErrors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Adresse e-mail</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          {...registerProfile('email', {
                            required: 'L\'adresse e-mail est requise',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Adresse e-mail invalide',
                            },
                          })}
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.email.message}</p>
                      )}
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
                          className="pl-10"
                          {...registerProfile('phone', {
                            pattern: {
                              value: /^(\+33|0)[1-9](\d{2}){4}$/,
                              message: 'Numéro de téléphone invalide',
                            },
                          })}
                        />
                      </div>
                      {profileErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{profileErrors.phone.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Changer de mot de passe</CardTitle>
                  <CardDescription>
                    Assurez-vous d'utiliser un mot de passe long et sécurisé.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordSubmit(onSubmitPassword)}>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="currentPassword"
                          type="password"
                          className="pl-10"
                          {...registerPassword('currentPassword', { 
                            required: 'Le mot de passe actuel est requis',
                            minLength: {
                              value: 8,
                              message: 'Le mot de passe doit contenir au moins 8 caractères',
                            },
                          })}
                        />
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="newPassword"
                          type="password"
                          className="pl-10"
                          {...registerPassword('newPassword', { 
                            required: 'Le nouveau mot de passe est requis',
                            minLength: {
                              value: 8,
                              message: 'Le mot de passe doit contenir au moins 8 caractères',
                            },
                          })}
                        />
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                      <div className="relative mt-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          className="pl-10"
                          {...registerPassword('confirmPassword', { 
                            required: 'Veuillez confirmer votre mot de passe',
                          })}
                        />
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        'Mettre à jour le mot de passe'
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="addresses">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Adresses</CardTitle>
                      <CardDescription>
                        Gérez vos adresses de livraison et de facturation.
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('new-address-dialog')?.showModal()}
                    >
                      Ajouter une adresse
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4 relative">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium">{address.name}</h4>
                              {address.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Par défaut
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {address.street}<br />
                              {address.postalCode} {address.city}
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                              Tél: {address.phone}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-600"
                              onClick={() => {
                                // Implémentez la logique pour modifier l'adresse
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {!address.isDefault && (
                              <button
                                type="button"
                                className="text-gray-400 hover:text-red-600"
                                onClick={() => deleteAddress(address.id)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                        {!address.isDefault && (
                          <div className="mt-4 pt-3 border-t">
                            <button
                              type="button"
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                              onClick={() => setDefaultAddress(address.id)}
                            >
                              Définir comme adresse par défaut
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {addresses.length === 0 && (
                      <div className="col-span-2 text-center py-8">
                        <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune adresse enregistrée</h3>
                        <p className="mt-1 text-sm text-gray-500">Commencez par ajouter une adresse de livraison.</p>
                        <div className="mt-6">
                          <Button
                            type="button"
                            onClick={() => document.getElementById('new-address-dialog')?.showModal()}
                          >
                            Ajouter une adresse
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des commandes</CardTitle>
                  <CardDescription>
                    Consultez l'historique de vos commandes passées.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recentOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Commande
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Statut
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                <div className="text-sm text-gray-500">{order.items} article{order.items > 1 ? 's' : ''}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(order.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(order.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{order.total.toFixed(2)} €</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {order.status === 'delivered' ? 'Livrée' : order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <a href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                                  Voir les détails
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
                      <p className="mt-1 text-sm text-gray-500">Vous n'avez encore passé aucune commande.</p>
                      <div className="mt-6">
                        <Button asChild>
                          <a href="/products">
                            <svg
                              className="-ml-1 mr-2 h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Parcourir les produits
                          </a>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Boîte de dialogue pour ajouter une nouvelle adresse (simplifiée) */}
          <dialog id="new-address-dialog" className="fixed inset-0 z-10 overflow-y-auto p-4 w-full max-w-md mx-auto my-8 bg-white rounded-lg shadow-xl">
            <div className="relative">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => document.getElementById('new-address-dialog')?.close()}
                >
                  <span className="sr-only">Fermer</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ajouter une adresse</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div>
                    <Label htmlFor="addressName">Nom de l'adresse</Label>
                    <Input
                      id="addressName"
                      type="text"
                      placeholder="Ex: Domicile, Bureau..."
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="street">Adresse</Label>
                    <Input
                      id="street"
                      type="text"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        type="text"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        type="text"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      id="defaultAddress"
                      type="checkbox"
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="defaultAddress" className="ml-2 block text-sm text-gray-700">
                      Définir comme adresse par défaut
                    </label>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('new-address-dialog')?.close()}
                    >
                      Annuler
                    </Button>
                    <Button type="submit">
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Profile;
