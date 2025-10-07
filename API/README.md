# UberPharma V2 - API

<p align="center">
  <img src="https://via.placeholder.com/400x200?text=UberPharma+Logo" alt="UberPharma Logo" width="400">
</p>

<p align="center">
  <a href="https://github.com/yourusername/uberpharma-v2/actions"><img src="https://github.com/yourusername/uberpharma-v2/workflows/Tests/badge.svg" alt="Build Status"></a>
  <a href="https://packagist.org/packages/uberpharma/api"><img src="https://img.shields.io/packagist/dt/uberpharma/api" alt="Total Downloads"></a>
  <a href="https://packagist.org/packages/uberpharma/api"><img src="https://img.shields.io/packagist/v/uberpharma/api" alt="Latest Stable Version"></a>
  <a href="https://packagist.org/packages/uberpharma/api"><img src="https://img.shields.io/packagist/l/uberpharma/api" alt="License"></a>
</p>

## 🚀 À propos d'UberPharma V2

UberPharma est une plateforme de livraison de médicaments qui connecte les pharmacies locales aux clients. Cette API RESTful est le backend de l'application UberPharma, alimentant à la fois l'application web et mobile.

## ✨ Fonctionnalités

- **🔐 Authentification utilisateur** avec JWT
- **🏪 Gestion des pharmacies** (CRUD complet)
- **💊 Catalogue de produits** avec recherche et filtrage
- **🛒 Panier d'achat** persistant
- **📦 Passer une commande** avec suivi en temps réel
- **💳 Paiement en ligne** sécurisé
- **🚚 Livraison** avec suivi du livreur
- **⭐ Système de notation et d'avis**
- **🔔 Notifications en temps réel**
- **📍 Gestion des adresses** avec géolocalisation

## 📋 Prérequis

- PHP 8.1+
- Composer 2.0+
- MySQL 8.0+ / MariaDB 10.4+
- Node.js 16.x & NPM 8.x
- Serveur web (Apache/Nginx) avec PHP-FPM
- Extensions PHP requises: 
  - BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

## 🛠 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/yourusername/uberpharma-v2.git
   cd uberpharma-v2/API
   ```

2. **Installer les dépendances**
   ```bash
   composer install
   npm install
   ```

3. **Configurer l'environnement**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Configurer la base de données**
   - Créer une base de données MySQL/MariaDB
   - Mettre à jour le fichier `.env` avec les informations de connexion

5. **Exécuter les migrations et les seeders**
   ```bash
   php artisan migrate --seed
   ```

6. **Générer la clé JWT**
   ```bash
   php artisan jwt:secret
   ```

7. **Configurer le stockage**
   ```bash
   php artisan storage:link
   ```

8. **Démarrer le serveur**
   ```bash
   php artisan serve
   ```

L'API sera disponible à l'adresse : http://localhost:8000/api

## 📚 Documentation

La documentation complète de l'API est disponible dans le dossier [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## 🧪 Développement

### Lancer les tests
```bash
php artisan test
```

### Générer la documentation Swagger/OpenAPI
```bash
php artisan l5-swagger:generate
```

### Lancer l'analyse de code
```bash
composer check
```

## 🔒 Sécurité

Si vous découvrez une vulnérabilité de sécurité, veuillez envoyer un e-mail à `security@uberpharma.com`. Toutes les vulnérabilités de sécurité seront traitées rapidement.

## 📄 Licence

Ce projet est sous licence [MIT](https://opensource.org/licenses/MIT).
