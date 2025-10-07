import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, Loader2, ArrowUpDown, CheckCircle2, Clock, XCircle, Truck, Package } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';

// Données de démonstration - À remplacer par un appel API
const demoOrders = [
  {
    id: 'CMD-2023-001',
    date: '2023-11-15T14:30:00',
    customer: 'Jean Dupont',
    status: 'delivered',
    total: 42.50,
    items: [
      { name: 'Doliprane 1000mg', quantity: 2, price: 2.50 },
      { name: 'Spasfon', quantity: 1, price: 3.20 },
    ],
    deliveryAddress: '123 Rue de la Paix, 75001 Paris',
    deliveryTime: '2023-11-15T16:00:00',
  },
  {
    id: 'CMD-2023-002',
    date: '2023-11-16T09:15:00',
    customer: 'Marie Martin',
    status: 'processing',
    total: 28.75,
    items: [
      { name: 'Ibuprofène 400mg', quantity: 1, price: 3.50 },
      { name: 'Vitamine C', quantity: 1, price: 5.25 },
    ],
    deliveryAddress: '456 Avenue des Champs-Élysées, 75008 Paris',
    deliveryTime: '2023-11-16T11:30:00',
  },
  // Ajoutez plus de commandes de démonstration selon les besoins
];

const statuses = {
  pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  processing: { label: 'En cours', color: 'bg-blue-100 text-blue-800', icon: Package },
  shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: Truck },
  delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  // Simuler un chargement de données
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrders(demoOrders);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Trier les commandes
  const sortedOrders = React.useMemo(() => {
    let sortableItems = [...orders];
    
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [orders, sortConfig]);

  // Filtrer les commandes
  const filteredOrders = sortedOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Gérer le tri des colonnes
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Formater la date
  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('fr-FR', options);
  };

  // Calculer le nombre d'articles dans une commande
  const getItemCount = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0);
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Commandes</h1>
          <p className="text-muted-foreground">
            Gérez les commandes de vos clients
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        {/* Barre de recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une commande..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filtre par statut */}
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            {Object.entries(statuses).map(([key, { label }]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="rounded-md border
      ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <button
                  type="button"
                  className="flex items-center space-x-1"
                  onClick={() => requestSort('id')}
                >
                  <span>Commande</span>
                  <ArrowUpDown className="h-4 w-4" />
                </button>
              </TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Date</TableHead>
              <TableHead className="text-right">Articles</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const StatusIcon = statuses[order.status]?.icon || Clock;
                const status = statuses[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
                
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                        {order.id}
                      </Link>
                    </TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell className="text-right">
                      <div className="whitespace-nowrap">
                        {formatDate(order.date).split(' ')[0]}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(order.date).split(' ')[1]}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{getItemCount(order)}</TableCell>
                    <TableCell className="text-right">{order.total.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge className={`${status.color} hover:${status.color} whitespace-nowrap`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Aucune commande trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;
