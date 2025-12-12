# 🔐 Guide d'Administration - La Suite Chic

## 📋 Table des Matières

1. [Configuration Initiale](#configuration-initiale)
2. [Créer un Compte Administrateur](#créer-un-compte-administrateur)
3. [Connexion au Dashboard](#connexion-au-dashboard)
4. [Gestion des Produits](#gestion-des-produits)
5. [Gestion des Commandes](#gestion-des-commandes)
6. [Tableau de Bord](#tableau-de-bord)

---

## Configuration Initiale

### Prérequis
- MongoDB en cours d'exécution
- Serveur Next.js démarré (`npm run dev`)

---

## Créer un Compte Administrateur

### Étape 1 : Exécuter le Script

```bash
npm run create-admin
```

### Étape 2 : Remplir les Informations

Le script vous demandera :

```
=== Création d'un administrateur ===

Nom d'utilisateur: admin
Email: admin@lasuitechic.online
Mot de passe (min 6 caractères): ********
```

### Exemple de Création

```bash
Nom d'utilisateur: admin
Email: admin@lasuitechic.online
Mot de passe: Admin123!

✓ Administrateur créé avec succès !

Détails:
  Nom d'utilisateur: admin
  Email: admin@lasuitechic.online
  Rôle: super_admin

Vous pouvez maintenant vous connecter sur /admin/login
```

---

## Connexion au Dashboard

### URL de Connexion

- **Local**: `http://localhost:3000/admin/login`
- **Production**: `https://lasuitechic.online/admin/login`

### Se Connecter

1. Allez sur `/admin/login`
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"

### Sécurité

- ✅ **Protection par JWT** - Session sécurisée de 7 jours
- ✅ **Cookie HttpOnly** - Protection contre les attaques XSS
- ✅ **Mot de passe hashé** - Utilise bcrypt
- ✅ **Routes protégées** - Redirection automatique si non connecté

---

## Gestion des Produits

### Ajouter un Produit

1. **Accéder à la page**
   - Dashboard → Produits → "Ajouter un produit"

2. **Remplir les champs obligatoires (\*)**
   - **Nom du produit** : ex: "Robe Élégante Fleurie"
   - **Slug** : généré automatiquement
   - **Description** : description détaillée
   - **Prix (DA)** : ex: 4500
   - **Catégorie** : Femmes / Hommes / Accessoires

3. **Ajouter au moins une variante**
   - **Taille** : S, M, L, XL
   - **Couleur** : Noir, Blanc, Rouge
   - **Stock** : nombre d'unités
   - **SKU** : référence unique (ex: ROBE-001-M-NOIR)

4. **Images (optionnel)**
   - Coller les URLs d'images
   - Si vide, une image par défaut sera utilisée

5. **Options supplémentaires**
   - ☑️ Produit en vedette
   - ☑️ Nouvelle arrivée
   - ☑️ Meilleures ventes

### Modifier un Produit

1. Allez sur la page Produits
2. Cliquez sur l'icône **crayon (✏️)** du produit
3. Modifiez les informations
4. Cliquez sur "Mettre à jour le produit"

### Supprimer un Produit

1. Allez sur la page Produits
2. Cliquez sur l'icône **poubelle (🗑️)** du produit
3. Confirmez la suppression

⚠️ **Attention** : La suppression est irréversible !

---

## Gestion des Commandes

### Voir Toutes les Commandes

**Page** : `/admin/orders`

**Fonctionnalités** :
- ✅ Liste de toutes les commandes
- ✅ Filtrer par statut
- ✅ Rechercher par numéro ou nom de client
- ✅ Voir les détails en cliquant sur l'icône œil (👁️)

### Voir les Détails d'une Commande

**Informations affichées** :
- 📦 **Produits commandés** (nom, taille, couleur, quantité, prix)
- 👤 **Informations client** (nom, email, téléphone)
- 📍 **Adresse de livraison** (adresse complète, wilaya)
- 💳 **Méthode de paiement**
- 📊 **Montant** (sous-total, frais de livraison, total)
- 🚚 **Suivi de commande** (timeline visuelle)

### Changer le Statut d'une Commande

**Statuts disponibles** :

1. **En attente** (pending) - Nouvelle commande non traitée
2. **Confirmée** (confirmed) - Commande confirmée par l'admin
3. **En préparation** (preparing) - Produits en cours de préparation
4. **Expédiée** (shipped) - Commande envoyée au client
5. **Livrée** (delivered) - Client a reçu la commande
6. **Annulée** (cancelled) - Commande annulée
7. **Retournée** (returned) - Produit retourné par le client

**Comment changer le statut** :

1. Ouvrez les détails de la commande
2. Dans la sidebar "Changer le statut"
3. Cliquez sur le nouveau statut
4. Le statut est mis à jour immédiatement

---

## Tableau de Bord

**URL** : `/admin`

### Statistiques en Temps Réel

Le dashboard affiche :

#### 📊 Cartes de Statistiques

1. **Commandes**
   - Total des commandes
   - Variation ce mois vs mois dernier

2. **Produits**
   - Nombre total de produits
   - Nouveaux produits ce mois

3. **Clients**
   - Nombre de clients uniques
   - Variation ce mois vs mois dernier

4. **Revenus**
   - Revenus totaux (commandes non annulées/retournées)
   - Variation ce mois vs mois dernier

#### 📋 Commandes Récentes

- Affiche les 5 dernières commandes
- Informations : numéro, client, date, montant, statut
- Cliquez sur le numéro pour voir les détails

---

## Déconnexion

Pour vous déconnecter :

1. Cliquez sur "Déconnexion" en haut à droite
2. Vous serez redirigé vers la page de connexion

---

## Sécurité et Bonnes Pratiques

### ✅ Recommandations

1. **Mot de passe fort**
   - Minimum 8 caractères
   - Mélange de lettres, chiffres et symboles

2. **Ne partagez jamais vos identifiants**
   - Chaque admin doit avoir son propre compte

3. **Déconnexion après utilisation**
   - Surtout sur un ordinateur partagé

4. **Vérifiez les commandes régulièrement**
   - Traitez les commandes rapidement
   - Changez le statut au fur et à mesure

### 🔒 Fonctionnalités de Sécurité

- ✅ Authentification JWT avec expiration
- ✅ Cookies sécurisés (HttpOnly)
- ✅ Mots de passe hashés avec bcrypt
- ✅ Validation des entrées
- ✅ Protection des routes admin
- ✅ Messages d'erreur sécurisés

---

## Support

En cas de problème :

1. Vérifiez que MongoDB est en cours d'exécution
2. Vérifiez que le serveur Next.js est démarré
3. Consultez les logs dans la console
4. Vérifiez les variables d'environnement (.env.local)

---

## Résumé des Commandes

```bash
# Démarrer le serveur de développement
npm run dev

# Créer un administrateur
npm run create-admin

# Peupler la base avec des produits de test
npm run seed

# Build pour production
npm run build

# Démarrer en production
npm start
```

---

**Version** : 1.0
**Dernière mise à jour** : Décembre 2025
**La Suite Chic** © 2025
