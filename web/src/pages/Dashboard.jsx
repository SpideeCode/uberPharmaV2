import React from 'react';
import { Link } from 'react-router-dom';
import { AppShell, AppContent, AppSidebar, AppSidebarHeader } from '../components/app';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { cn } from '../lib/utils';

// Composant de placeholder pour les graphiques
const PlaceholderPattern = ({ className }) => (
  <div className={cn("absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900", className)}>
    <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800/50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
  </div>
);

const Dashboard = () => {
  // Données de démonstration - À remplacer par des appels API
  const stats = [
    { name: 'Commandes du jour', value: '24', change: '+12%', changeType: 'increase' },
    { name: 'Revenu du jour', value: '1,234.50 €', change: '+5.4%', changeType: 'increase' },
    { name: 'Nouveaux clients', value: '8', change: '+2.1%', changeType: 'decrease' },
  ];

  return (
    <AppShell variant="sidebar">
      <AppSidebar />
      <AppContent variant="sidebar" className="overflow-x-auto">
        <AppSidebarHeader breadcrumbs={[{ title: 'Tableau de bord', href: '/dashboard' }]} />
        
        <div className="flex-1 space-y-6 p-4 md:p-6">
          {/* En-tête */}
          <div className="flex flex-col justify-between space-y-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
              <p className="text-muted-foreground">
                Aperçu de votre activité
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/orders/new"
                className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Nouvelle commande
              </Link>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.name}
                  </CardTitle>
                  <div className="h-4 w-4 text-muted-foreground">
                    {stat.changeType === 'increase' ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-green-600"
                      >
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-red-600"
                      >
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      </svg>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.change} par rapport à hier
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Graphiques */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Vue d'ensemble</CardTitle>
                <CardDescription>
                  Commandes et revenus des 12 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 relative">
                <PlaceholderPattern className="rounded-lg" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    Graphique des commandes et revenus
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>
                  Dernières commandes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          Commande #{Math.floor(Math.random() * 1000)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(Math.random() * 5) + 1} articles • {Math.random() > 0.5 ? 'En cours' : 'Terminée'}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {(Math.random() * 100 + 10).toFixed(2)} €
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tableau des commandes récentes */}
          <Card>
            <CardHeader>
              <CardTitle>Commandes récentes</CardTitle>
              <CardDescription>
                Les 5 dernières commandes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N° Commande
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Montant
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          #ORD-{1000 + i}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          Client {i}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            i % 3 === 0 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : i % 2 === 0 
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {i % 3 === 0 ? 'Livrée' : i % 2 === 0 ? 'En cours' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {(Math.random() * 200 + 10).toFixed(2)} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link to={`/orders/${i}`} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  to="/orders"
                  className="text-sm font-medium text-green-600 hover:text-green-500 dark:text-green-400 dark:hover:text-green-300"
                >
                  Voir toutes les commandes <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppContent>
    </AppShell>
  );
};

export default Dashboard;
