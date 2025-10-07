import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const AppSidebarHeader = ({ breadcrumbs = [] }) => {
  const location = useLocation();
  
  // Si aucun fil d'Ariane n'est fourni, en générer un basé sur l'URL
  const generatedBreadcrumbs = breadcrumbs.length > 0 
    ? breadcrumbs 
    : generateBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center">
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          <Link
            to="/dashboard"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4 mr-2" />
            Accueil
          </Link>
          
          {generatedBreadcrumbs.length > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          )}
          
          {generatedBreadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={breadcrumb.href}>
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
              )}
              <Link
                to={breadcrumb.href}
                className={`${
                  index === generatedBreadcrumbs.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {breadcrumb.title}
              </Link>
            </React.Fragment>
          ))}
        </nav>
      </div>
      
      <div className="flex flex-1 items-center justify-end space-x-4">
        {/* Ici, vous pouvez ajouter des éléments comme des notifications, profil utilisateur, etc. */}
      </div>
    </header>
  );
};

// Fonction utilitaire pour générer des breadcrumbs à partir de l'URL
function generateBreadcrumbs(pathname) {
  const pathSegments = pathname.split('/').filter(Boolean);
  
  return pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const title = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { title, href };
  });
}

export { AppSidebarHeader };
