# Documentation de l'API UberPharma V2

## Authentification

### S'inscrire
- **URL**: `/api/v1/register`
- **Méthode**: `POST`
- **Description**: Crée un nouvel utilisateur
- **Accès**: Public

### Se connecter
- **URL**: `/api/v1/login`
- **Méthode**: `POST`
- **Description**: Authentifie un utilisateur et retourne un token d'accès
- **Accès**: Public

### Se déconnecter
- **URL**: `/api/v1/logout`
- **Méthode**: `POST`
- **Description**: Invalide le token d'accès de l'utilisateur
- **Accès**: Utilisateur authentifié

### Récupérer le profil utilisateur
- **URL**: `/api/v1/user`
- **Méthode**: `GET`
- **Description**: Récupère les informations de l'utilisateur connecté
- **Accès**: Utilisateur authentifié

## Utilisateurs

### Mettre à jour le profil
- **URL**: `/api/v1/profile`
- **Méthode**: `PUT`
- **Description**: Met à jour les informations du profil utilisateur
- **Accès**: Utilisateur authentifié

## Pharmacies

### Lister toutes les pharmacies
- **URL**: `/api/v1/pharmacies`
- **Méthode**: `GET`
- **Description**: Récupère la liste des pharmacies
- **Accès**: Public

### Créer une pharmacie
- **URL**: `/api/v1/pharmacies`
- **Méthode**: `POST`
- **Description**: Crée une nouvelle pharmacie
- **Accès**: Admin

### Récupérer une pharmacie
- **URL**: `/api/v1/pharmacies/{id}`
- **Méthode**: `GET`
- **Description**: Récupère les détails d'une pharmacie
- **Accès**: Public

### Mettre à jour une pharmacie
- **URL**: `/api/v1/pharmacies/{id}`
- **Méthode**: `PUT`
- **Description**: Met à jour les informations d'une pharmacie
- **Accès**: Admin ou propriétaire de la pharmacie

### Supprimer une pharmacie
- **URL**: `/api/v1/pharmacies/{id}`
- **Méthode**: `DELETE`
- **Description**: Supprime une pharmacie
- **Accès**: Admin

### Produits d'une pharmacie
- **URL**: `/api/v1/pharmacies/{id}/products`
- **Méthode**: `GET`
- **Description**: Récupère la liste des produits d'une pharmacie
- **Accès**: Public

## Produits

### Lister tous les produits
- **URL**: `/api/v1/products`
- **Méthode**: `GET`
- **Description**: Récupère la liste des produits
- **Accès**: Public

### Créer un produit
- **URL**: `/api/v1/products`
- **Méthode**: `POST`
- **Description**: Crée un nouveau produit
- **Accès**: Admin ou propriétaire de pharmacie

### Récupérer un produit
- **URL**: `/api/v1/products/{id}`
- **Méthode**: `GET`
- **Description**: Récupère les détails d'un produit
- **Accès**: Public

### Mettre à jour un produit
- **URL**: `/api/v1/products/{product}`
- **Méthode**: `POST`
- **Description**: Met à jour un produit
- **Accès**: Admin ou propriétaire de la pharmacie

### Supprimer un produit
- **URL**: `/api/v1/products/{id}`
- **Méthode**: `DELETE`
- **Description**: Supprime un produit
- **Accès**: Admin ou propriétaire de la pharmacie

### Rechercher des produits
- **URL**: `/api/v1/products/search/{query}`
- **Méthode**: `GET`
- **Description**: Recherche des produits par nom ou description
- **Accès**: Public

### Mettre à jour le stock d'un produit
- **URL**: `/api/v1/products/{product}/stock`
- **Méthode**: `POST`
- **Description**: Met à jour le stock d'un produit
- **Accès**: Propriétaire de la pharmacie

## Commandes

### Lister les commandes
- **URL**: `/api/v1/orders`
- **Méthode**: `GET`
- **Description**: Récupère la liste des commandes (selon le rôle de l'utilisateur)
- **Accès**: Utilisateur authentifié

### Créer une commande
- **URL**: `/api/v1/orders`
- **Methode**: `POST`
- **Description**: Crée une nouvelle commande
- **Accès**: Client

### Récupérer une commande
- **URL**: `/api/v1/orders/{id}`
- **Méthode**: `GET`
- **Description**: Récupère les détails d'une commande
- **Accès**: Client, propriétaire de la pharmacie ou admin

### Mettre à jour le statut d'une commande
- **URL**: `/api/v1/orders/{order}/status`
- **Méthode**: `POST`
- **Description**: Met à jour le statut d'une commande
- **Accès**: Client, propriétaire de la pharmacie ou admin

### Mes commandes
- **URL**: `/api/v1/my-orders`
- **Méthode**: `GET`
- **Description**: Récupère les commandes de l'utilisateur connecté
- **Accès**: Client

### Commandes de la pharmacie
- **URL**: `/api/v1/pharmacy/orders`
- **Méthode**: `GET`
- **Description**: Récupère les commandes des pharmacies de l'utilisateur
- **Accès**: Propriétaire de pharmacie

### Commandes disponibles pour livraison
- **URL**: `/api/v1/courier/orders`
- **Méthode**: `GET`
- **Description**: Récupère les commandes disponibles pour livraison
- **Accès**: Livreur

### Accepter une commande pour livraison
- **URL**: `/api/v1/orders/{order}/accept`
- **Méthode**: `POST`
- **Description**: Permet à un livreur d'accepter une commande pour livraison
- **Accès**: Livreur

### Marquer une commande comme livrée
- **URL**: `/api/v1/orders/{order}/complete`
- **Méthode**: `POST`
- **Description**: Marque une commande comme livrée
- **Accès**: Livreur

## Paiements

### Traiter un paiement
- **URL**: `/api/v1/payments/process`
- **Méthode**: `POST`
- **Description**: Traite un paiement pour une commande
- **Accès**: Client

### Détails de paiement d'une commande
- **URL**: `/api/v1/orders/{order}/payment`
- **Méthode**: `GET`
- **Description**: Récupère les détails de paiement d'une commande
- **Accès**: Client, propriétaire de la pharmacie ou admin

### Rembourser une commande
- **URL**: `/api/v1/orders/{order}/refund`
- **Méthode**: `POST`
- **Description**: Traite un remboursement pour une commande
- **Accès**: Admin

## Notifications

### Lister les notifications
- **URL**: `/api/v1/notifications`
- **Méthode**: `GET`
- **Description**: Récupère les notifications de l'utilisateur
- **Accès**: Utilisateur authentifié

### Marquer une notification comme lue
- **URL**: `/api/v1/notifications/{id}/read`
- **Méthode**: `PUT`
- **Description**: Marque une notification comme lue
- **Accès**: Utilisateur authentifié

### Marquer toutes les notifications comme lues
- **URL**: `/api/v1/notifications/read-all`
- **Méthode**: `POST`
- **Description**: Marque toutes les notifications comme lues
- **Accès**: Utilisateur authentifié

### Nombre de notifications non lues
- **URL**: `/api/v1/notifications/unread-count`
- **Méthode**: `GET`
- **Description**: Récupère le nombre de notifications non lues
- **Accès**: Utilisateur authentifié

### Supprimer une notification
- **URL**: `/api/v1/notifications/{id}`
- **Méthode**: `DELETE`
- **Description**: Supprime une notification
- **Accès**: Utilisateur authentifié

### Vider les notifications
- **URL**: `/api/v1/notifications`
- **Méthode**: `DELETE`
- **Description**: Supprime toutes les notifications de l'utilisateur
- **Accès**: Utilisateur authentifié

## Favoris

### Lister les favoris
- **URL**: `/api/v1/favorites`
- **Méthode**: `GET`
- **Description**: Récupère la liste des favoris de l'utilisateur
- **Accès**: Utilisateur authentifié

### Ajouter un favori
- **URL**: `/api/v1/favorites`
- **Méthode**: `POST`
- **Description**: Ajoute un produit ou une pharmacie aux favoris
- **Accès**: Utilisateur authentifié

### Vérifier si un élément est en favori
- **URL**: `/api/v1/favorites/check`
- **Méthode**: `GET`
- **Description**: Vérifie si un produit ou une pharmacie est dans les favoris
- **Accès**: Utilisateur authentifié

### Supprimer un favori
- **URL**: `/api/v1/favorites/{id}`
- **Méthode**: `DELETE`
- **Description**: Supprime un élément des favoris
- **Accès**: Utilisateur authentifié

## Adresses

### Lister les adresses
- **URL**: `/api/v1/addresses`
- **Méthode**: `GET`
- **Description**: Récupère la liste des adresses de l'utilisateur
- **Accès**: Utilisateur authentifié

### Créer une adresse
- **URL**: `/api/v1/addresses`
- **Méthode**: `POST`
- **Description**: Crée une nouvelle adresse
- **Accès**: Utilisateur authentifié

### Récupérer une adresse
- **URL**: `/api/v1/addresses/{id}`
- **Méthode**: `GET`
- **Description**: Récupère les détails d'une adresse
- **Accès**: Utilisateur authentifié

### Mettre à jour une adresse
- **URL**: `/api/v1/addresses/{id}`
- **Méthode**: `PUT`
- **Description**: Met à jour une adresse
- **Accès**: Utilisateur authentifié

### Supprimer une adresse
- **URL**: `/api/v1/addresses/{id}`
- **Méthode**: `DELETE`
- **Description**: Supprime une adresse
- **Accès**: Utilisateur authentifié

### Définir une adresse par défaut
- **URL**: `/api/v1/addresses/{id}/default`
- **Méthode**: `PUT`
- **Description**: Définit une adresse comme adresse par défaut
- **Accès**: Utilisateur authentifié

### Récupérer l'adresse par défaut
- **URL**: `/api/v1/addresses/default`
- **Méthode**: `GET`
- **Description**: Récupère l'adresse par défaut de l'utilisateur
- **Accès**: Utilisateur authentifié

### Pharmacies à proximité d'une adresse
- **URL**: `/api/v1/addresses/{id}/nearby-pharmacies`
- **Méthode**: `GET`
- **Description**: Récupère les pharmacies à proximité d'une adresse
- **Accès**: Utilisateur authentifié
