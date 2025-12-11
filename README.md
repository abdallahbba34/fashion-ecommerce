# FASHION - Site E-commerce Mode

Une plateforme e-commerce moderne et complète pour la vente de vêtements et accessoires en Algérie, construite avec Next.js 14, TypeScript, et MongoDB.

## 🚀 Fonctionnalités

### Front-office (Client)
- ✅ Page d'accueil moderne avec bannières et catégories
- ✅ Catalogue produits avec filtres avancés (taille, couleur, prix, catégorie)
- ✅ Fiches produits détaillées avec variantes (tailles, couleurs)
- ✅ Système de panier avec gestion des quantités
- ✅ Tunnel de commande simplifié
- ✅ Calcul automatique des frais de livraison par wilaya
- ✅ Paiement à la livraison
- ✅ Design responsive et moderne
- ✅ Interface en français
- ✅ Toutes les wilayas d'Algérie supportées

### Back-office (Administration)
- ✅ Dashboard avec statistiques
- ✅ Gestion complète des produits
- ✅ Gestion des commandes avec filtres par statut
- ✅ Gestion des clients
- ✅ Interface intuitive et moderne

### Caractéristiques Techniques
- ⚡ Next.js 14 avec App Router
- 🎨 Tailwind CSS pour le design
- 📦 TypeScript pour la sécurité des types
- 🗄️ MongoDB avec Mongoose
- 🛒 Zustand pour la gestion d'état du panier
- 🎯 API Routes pour le backend
- 📱 Design responsive (mobile-first)
- 🔒 Architecture sécurisée

## 📋 Prérequis

- Node.js 18+
- MongoDB (local ou cloud via MongoDB Atlas)
- npm ou yarn

## 🛠️ Installation

### 1. Cloner le projet

Le projet est déjà dans le dossier `D:\ecom`

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de la base de données

#### Option A: MongoDB Local

1. Installez MongoDB sur votre machine : https://www.mongodb.com/try/download/community
2. Démarrez MongoDB :
   ```bash
   mongod
   ```

#### Option B: MongoDB Atlas (Cloud - Recommandé)

1. Créez un compte gratuit sur https://www.mongodb.com/cloud/atlas
2. Créez un nouveau cluster
3. Whitelist votre IP
4. Créez un utilisateur database
5. Récupérez votre connection string

### 4. Variables d'environnement

Le fichier `.env.local` existe déjà. Modifiez-le selon vos besoins :

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fashion-ecommerce
# Ou pour MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fashion-ecommerce

# JWT Secret (IMPORTANT: Changez cette valeur en production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrez http://localhost:3000 dans votre navigateur.

## 📁 Structure du Projet

```
ecom/
├── app/                          # Pages Next.js (App Router)
│   ├── page.tsx                  # Page d'accueil
│   ├── products/                 # Pages produits
│   │   ├── page.tsx             # Catalogue
│   │   └── [slug]/page.tsx      # Détail produit
│   ├── cart/                     # Panier
│   ├── checkout/                 # Page de commande
│   ├── order-confirmation/       # Confirmation de commande
│   ├── admin/                    # Back-office
│   │   ├── page.tsx             # Dashboard
│   │   ├── products/            # Gestion produits
│   │   └── orders/              # Gestion commandes
│   └── api/                      # API Routes
│       ├── products/            # CRUD produits
│       └── orders/              # CRUD commandes
├── components/                   # Composants React
│   ├── ui/                      # Composants UI réutilisables
│   ├── layout/                  # Header, Footer
│   └── ProductCard.tsx          # Carte produit
├── lib/                         # Utilitaires
│   ├── db.ts                   # Connexion MongoDB
│   └── utils.ts                # Fonctions utilitaires
├── models/                      # Modèles Mongoose
│   ├── Product.ts
│   ├── Order.ts
│   └── User.ts
├── store/                       # Gestion d'état (Zustand)
│   └── cart.ts                 # Store du panier
├── types/                       # Types TypeScript
│   └── index.ts
└── package.json
```

## 🎯 Utilisation

### Accès Client
- Page d'accueil : http://localhost:3000
- Catalogue : http://localhost:3000/products
- Panier : http://localhost:3000/cart

### Accès Admin
- Dashboard : http://localhost:3000/admin
- Gestion produits : http://localhost:3000/admin/products
- Gestion commandes : http://localhost:3000/admin/orders

## 📊 Données de Test

### Ajouter des produits via l'API

Vous pouvez utiliser l'API pour ajouter des produits :

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Robe Élégante",
    "slug": "robe-elegante",
    "description": "Belle robe pour toutes occasions",
    "price": 4500,
    "category": "femmes",
    "images": [],
    "sizes": ["S", "M", "L"],
    "colors": ["rouge", "bleu"],
    "variants": [
      {"size": "S", "color": "rouge", "stock": 10},
      {"size": "M", "color": "rouge", "stock": 15}
    ],
    "featured": true,
    "newArrival": true
  }'
```

## 🚢 Déploiement

### Vercel (Recommandé pour Next.js)

1. Push votre code sur GitHub
2. Connectez-vous sur https://vercel.com
3. Importez votre repository
4. Ajoutez vos variables d'environnement
5. Déployez !

### Autres plateformes
- Railway
- Render
- DigitalOcean App Platform
- AWS / Azure / GCP

## 🔧 Améliorations Futures

- [ ] Authentification utilisateur (JWT)
- [ ] Upload d'images produits
- [ ] Système de recherche avancé
- [ ] Filtres dynamiques en temps réel
- [ ] Wishlist / Favoris
- [ ] Avis et notes produits
- [ ] Newsletter
- [ ] Intégration paiement en ligne (Chargily, Satim, etc.)
- [ ] Système de suivi de colis
- [ ] Notifications SMS/Email
- [ ] Multi-langue (AR/FR)
- [ ] Mode sombre
- [ ] Analytics et rapports détaillés
- [ ] Gestion des promotions et codes promo
- [ ] Programme de fidélité

## 📝 API Endpoints

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/[slug]` - Détail produit
- `POST /api/products` - Créer un produit (Admin)
- `PUT /api/products/[slug]` - Modifier un produit (Admin)
- `DELETE /api/products/[slug]` - Supprimer un produit (Admin)

### Commandes
- `GET /api/orders` - Liste des commandes (Admin)
- `GET /api/orders/[id]` - Détail commande
- `POST /api/orders` - Créer une commande
- `PATCH /api/orders/[id]` - Modifier statut (Admin)

## 🛡️ Sécurité

- Validation des données avec Zod (à implémenter)
- Protection CSRF
- Rate limiting (à implémenter)
- Authentification JWT (à implémenter)
- HTTPS en production

## 📞 Support

Pour toute question ou problème, consultez la documentation ou créez une issue.

## 📄 Licence

Ce projet est sous licence MIT.

---

Développé avec ❤️ pour le marché algérien
