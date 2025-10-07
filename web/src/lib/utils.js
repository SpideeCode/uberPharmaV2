import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine les noms de classes avec clsx et les fusionne avec tailwind-merge
 * pour éviter les conflits de classes Tailwind
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un nombre en tant que monnaie
 * @param {number} amount - Le montant à formater
 * @param {string} currency - La devise (par défaut: 'EUR')
 * @returns {string} Le montant formaté
 */
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formate une date en français
 * @param {string|Date} date - La date à formater
 * @param {Object} options - Options de formatage
 * @returns {string} La date formatée
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };

  return new Date(date).toLocaleDateString('fr-FR', defaultOptions);
}

/**
 * Tronque un texte à une longueur maximale
 * @param {string} text - Le texte à tronquer
 * @param {number} maxLength - La longueur maximale
 * @returns {string} Le texte tronqué avec "..." si nécessaire
 */
export function truncate(text, maxLength = 100) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Génère un ID unique
 * @returns {string} Un ID unique
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 * @param {Object} user - L'utilisateur
 * @param {string|string[]} roles - Le ou les rôles à vérifier
 * @returns {boolean} Vrai si l'utilisateur a le rôle
 */
export function hasRole(user, roles) {
  if (!user || !user.role) return false;
  if (Array.isArray(roles)) {
    return roles.includes(user.role);
  }
  return user.role === roles;
}

/**
 * Gestionnaire d'erreurs pour les appels API
 * @param {Error} error - L'erreur à gérer
 * @returns {Object} Un objet contenant le message d'erreur
 */
export function handleApiError(error) {
  console.error('API Error:', error);
  
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un statut hors 2xx
    const { status, data } = error.response;
    
    if (status === 422) {
      // Erreur de validation
      return { 
        error: 'Erreur de validation',
        details: data.errors || data.message,
      };
    }
    
    if (status === 401) {
      // Non autorisé
      return { error: 'Non autorisé. Veuillez vous reconnecter.' };
    }
    
    if (status === 403) {
      // Interdit
      return { error: 'Vous n\'êtes pas autorisé à effectuer cette action.' };
    }
    
    if (status === 404) {
      // Non trouvé
      return { error: 'Ressource non trouvée.' };
    }
    
    // Autres erreurs serveur
    return { 
      error: data.message || 'Une erreur est survenue. Veuillez réessayer plus tard.',
    };
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    return { error: 'Pas de réponse du serveur. Vérifiez votre connexion internet.' };
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    return { error: 'Erreur de configuration de la requête.' };
  }
}

/**
 * Télécharge un fichier à partir d'une URL
 * @param {string} url - L'URL du fichier à télécharger
 * @param {string} filename - Le nom du fichier
 */
export function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copie du texte dans le presse-papiers
 * @param {string} text - Le texte à copier
 * @returns {Promise<boolean>} Vrai si la copie a réussi
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Erreur lors de la copie dans le presse-papiers:', err);
    return false;
  }
}

/**
 * Filtre les propriétés nulles ou non définies d'un objet
 * @param {Object} obj - L'objet à filtrer
 * @returns {Object} Un nouvel objet sans les propriétés nulles ou non définies
 */
export function filterNullValues(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

/**
 * Met en majuscule la première lettre d'une chaîne
 * @param {string} string - La chaîne à formater
 * @returns {string} La chaîne avec la première lettre en majuscule
 */
export function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default {
  cn,
  formatCurrency,
  formatDate,
  truncate,
  generateId,
  hasRole,
  handleApiError,
  downloadFile,
  copyToClipboard,
  filterNullValues,
  capitalizeFirstLetter,
};
