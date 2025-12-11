# Guide de Démarrage Rapide

## 🎯 Démarrer le Projet en 3 Étapes

### Étape 1: Configurer MongoDB

#### Option Facile - MongoDB Atlas (Cloud Gratuit)
1. Allez sur https://www.mongodb.com/cloud/atlas/register
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. Whitelist votre IP: `0.0.0.0/0` (pour permettre toutes les connexions)
5. Créez un utilisateur database (exemple: username: `admin`, password: `password123`)
6. Cliquez sur "Connect" → "Connect your application"
7. Copiez la connection string (ressemble à: `mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/`)

Ensuite, modifiez le fichier `.env.local`:
```env
MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/fashion-ecommerce
```

#### Option Locale - MongoDB sur votre PC
1. Téléchargez MongoDB: https://www.mongodb.com/try/download/community
2. Installez-le avec les options par défaut
3. Démarrez MongoDB (il démarre automatiquement après installation)
4. La connection string dans `.env.local` est déjà configurée: `mongodb://localhost:27017/fashion-ecommerce`

### Étape 2: Démarrer le serveur

```bash
npm run dev
```

### Étape 3: Ouvrir le site

Ouvrez votre navigateur sur: http://localhost:3000

## ✅ Vérification

Si tout fonctionne, vous devriez voir:
- La page d'accueil moderne
- Le menu de navigation
- Les bannières et catégories

## 🛒 Ajouter des Produits de Test

### Via MongoDB Compass (Interface Graphique)

1. Téléchargez MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Connectez-vous avec votre URI MongoDB
3. Créez la database `fashion-ecommerce`
4. Créez la collection `products`
5. Insérez un document:

```json
{
  "name": "Robe Élégante Fleurie",
  "slug": "robe-elegante-fleurie",
  "description": "Belle robe élégante avec motifs floraux, parfaite pour toutes occasions.",
  "price": 4500,
  "compareAtPrice": 6000,
  "category": "femmes",
  "images": ["/placeholder.jpg"],
  "variants": [
    { "size": "S", "color": "Rouge", "stock": 10 },
    { "size": "M", "color": "Rouge", "stock": 15 },
    { "size": "L", "color": "Rouge", "stock": 8 },
    { "size": "M", "color": "Bleu", "stock": 12 }
  ],
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Rouge", "Bleu", "Vert"],
  "material": "100% Coton",
  "care": "Lavage en machine à 30°C",
  "featured": true,
  "newArrival": true,
  "bestseller": false,
  "createdAt": { "$date": "2025-12-09T00:00:00.000Z" },
  "updatedAt": { "$date": "2025-12-09T00:00:00.000Z" }
}
```

### Via l'API (avec curl ou Postman)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chemise Casual Homme",
    "slug": "chemise-casual-homme",
    "description": "Chemise casual élégante pour homme",
    "price": 3500,
    "category": "hommes",
    "images": [],
    "sizes": ["M", "L", "XL"],
    "colors": ["Blanc", "Bleu"],
    "variants": [
      {"size": "M", "color": "Blanc", "stock": 20},
      {"size": "L", "color": "Blanc", "stock": 15},
      {"size": "L", "color": "Bleu", "stock": 10}
    ],
    "featured": false,
    "newArrival": true
  }'
```

## 🎨 Navigation du Site

### Pages Client
- **Accueil**: http://localhost:3000
- **Catalogue**: http://localhost:3000/products
- **Panier**: http://localhost:3000/cart
- **Commande**: http://localhost:3000/checkout

### Pages Admin
- **Dashboard**: http://localhost:3000/admin
- **Produits**: http://localhost:3000/admin/products
- **Commandes**: http://localhost:3000/admin/orders

## 🧪 Tester le Flow Complet

1. **Ajouter un produit** (via l'admin ou l'API)
2. **Voir le produit** sur la page d'accueil ou catalogue
3. **Cliquer sur le produit** pour voir les détails
4. **Sélectionner taille et couleur**
5. **Ajouter au panier**
6. **Aller au panier** (icône en haut à droite)
7. **Passer la commande**
8. **Remplir le formulaire** avec vos informations
9. **Confirmer**
10. **Voir la confirmation**

## 🔧 Problèmes Courants

### Le site ne démarre pas
- Vérifiez que toutes les dépendances sont installées: `npm install`
- Vérifiez que le port 3000 n'est pas utilisé

### Erreur de connexion MongoDB
- Vérifiez votre connection string dans `.env.local`
- Pour Atlas: vérifiez que votre IP est whitelisted
- Pour local: vérifiez que MongoDB est démarré

### Les produits n'apparaissent pas
- Vérifiez que vous avez ajouté des produits dans la base de données
- Ouvrez la console du navigateur (F12) pour voir les erreurs

### Styles cassés
- Redémarrez le serveur: `Ctrl+C` puis `npm run dev`
- Vérifiez que Tailwind CSS est bien configuré

## 📚 Ressources

- **Documentation Next.js**: https://nextjs.org/docs
- **Documentation MongoDB**: https://www.mongodb.com/docs/
- **Documentation Tailwind**: https://tailwindcss.com/docs

## 💡 Prochaines Étapes

1. ✅ Personnalisez les couleurs dans `tailwind.config.ts`
2. ✅ Ajoutez vos propres produits
3. ✅ Modifiez les textes et descriptions
4. ✅ Ajoutez des images de produits
5. ✅ Configurez l'envoi d'emails (Resend, SendGrid, etc.)
6. ✅ Ajoutez l'authentification
7. ✅ Déployez sur Vercel

## 🆘 Besoin d'Aide?

Consultez le fichier `README.md` pour plus de détails sur:
- L'architecture du projet
- Les API endpoints
- Le déploiement
- Les améliorations futures

---

Bon développement ! 🚀
