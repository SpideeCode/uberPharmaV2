import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-9xl font-bold text-gray-900">404</h1>
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Page non trouvée</h2>
          <p className="mt-4 text-lg text-gray-600">
            Désolé, nous n'avons pas trouvé la page que vous recherchez.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex rounded-md shadow">
            <Button asChild>
              <Link to="/" className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                Retour à l'accueil
              </Link>
            </Button>
          </div>
          <div className="ml-3 inline-flex">
            <Button variant="outline" asChild>
              <Link to="/contact" className="flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Contactez-nous
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
