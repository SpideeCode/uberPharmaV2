import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings, 
  LogOut,
  Home,
  ShoppingBag,
  Truck,
  Bell,
  Heart,
  MapPin,
  Clock
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';const navItems = [
  { 
    name: 'Tableau de bord', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    roles: ['client', 'pharmacy', 'admin']
  },
  { 
    name: 'Commandes', 
    href: '/orders', 
    icon: ShoppingBag,
    roles: ['client', 'pharmacy', 'admin']
  },
  { 
    name: 'Produits', 
    href: '/products', 
    icon: Package,
    roles: ['pharmacy', 'admin']
  },
  { 
    name: 'Livraisons', 
    href: '/deliveries', 
    icon: Truck,
    roles: ['courier', 'admin']
  },
  { 
    name: 'Pharmacies', 
    href: '/pharmacies', 
    icon: Home,
    roles: ['admin']
  },
  { 
    name: 'Utilisateurs', 
    href: '/users', 
    icon: Users,
    roles: ['admin']
  },
  { 
    name: 'Favoris', 
    href: '/favorites', 
    icon: Heart,
    roles: ['client']
  },
  { 
    name: 'Adresses', 
    href: '/addresses', 
    icon: MapPin,
    roles: ['client']
  },
  { 
    name: 'Historique', 
    href: '/history', 
    icon: Clock,
    roles: ['client']
  },
  { 
    name: 'Notifications', 
    href: '/notifications', 
    icon: Bell,
    roles: ['client', 'pharmacy', 'courier', 'admin']
  },
  { 
    name: 'Paramètres', 
    href: '/settings', 
    icon: Settings,
    roles: ['client', 'pharmacy', 'courier', 'admin']
  },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Filtrer les éléments de navigation en fonction du rôle de l'utilisateur
  const filteredNavItems = navItems.filter(item => 
    item.roles.some(role => user?.role === role || role === 'all')
  );

  return (
    <div className="hidden md:flex flex-col fixed inset-y-0 w-[280px] border-r border-gray-200 bg-white dark:bg-gray-900 z-40">
      <div className="flex h-16 items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">UP</span>
          </div>
          <span className="font-bold text-xl">UberPharma</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== '/' && location.pathname.startsWith(item.href));
              
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors',
                  isActive 
                    ? 'bg-green-50 text-green-700 dark:bg-gray-800 dark:text-green-400' 
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                )}
              >
                <item.icon 
                  className={cn(
                    'mr-3 h-5 w-5',
                    isActive 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500'
                  )} 
                  aria-hidden="true" 
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex w-full items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export { AppSidebar };
