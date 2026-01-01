# Intégration Facebook pour le E-commerce

## Vue d'ensemble

Ce document décrit l'intégration complète de Facebook pour diffuser vos produits et recueillir des demandes depuis Facebook. Le système permet de :

1. **Tracker l'origine des commandes** (Facebook, Instagram, WhatsApp, Site web, Autre)
2. **Créer des liens trackables** pour vos publications Facebook
3. **Analyser les performances** de chaque source de trafic
4. **Partager facilement** vos produits sur les réseaux sociaux
5. **Intégrer Facebook Pixel** pour le tracking avancé (optionnel)

## Fichiers ajoutés/modifiés

### 1. Modèle de données

**`models/Order.ts`**
- Ajout du champ `source` : origine de la commande (website, facebook, instagram, whatsapp, other)
- Ajout du champ `referralInfo` : informations supplémentaires (nom de campagne, page Facebook, etc.)

**`types/index.ts`**
- Ajout du type `OrderSource`
- Mise à jour de l'interface `Order` avec les nouveaux champs

### 2. Page de checkout

**`app/checkout/page.tsx`**
- **Détection automatique de la source** via les paramètres URL (`?source=facebook`)
- **Champ "Comment nous avez-vous connu?"** dans le formulaire
- **Champ optionnel pour plus de détails** (nom de la page, campagne, etc.)
- Les données sont automatiquement envoyées lors de la création de la commande

### 3. Composants créés

**`components/FacebookPixel.tsx`**
- Intégration de Facebook Pixel pour tracker les conversions
- Fonctions utilitaires pour tracker des événements :
  - `trackAddToCart()` - Ajout au panier
  - `trackInitiateCheckout()` - Début du checkout
  - `trackPurchase()` - Achat complété
  - `trackViewContent()` - Vue d'un produit

**`components/ShareButtons.tsx`**
- Boutons de partage pour Facebook, WhatsApp
- Fonction pour générer des liens trackables
- Composant `TrackedLinkGenerator` pour les admins

**`components/admin/SourceStatistics.tsx`**
- Affichage des statistiques par source
- Graphiques visuels avec barres de progression
- Calcul automatique des pourcentages et revenus par source

### 4. API Routes

**`app/api/stats/by-source/route.ts`**
- Endpoint pour récupérer les statistiques par source
- Calcule le nombre de commandes, revenus totaux et panier moyen par source
- Accessible uniquement aux admins

### 5. Dashboard Admin

**`app/admin/page.tsx`**
- Intégration du composant `SourceStatistics`
- Affichage visuel des performances par canal

## Utilisation

### 1. Créer des liens trackables pour Facebook

#### Méthode 1 : Liens manuels

Pour partager un produit sur Facebook et tracker les commandes :

```
https://votre-site.com/products/nom-du-produit?source=facebook&ref=promo-ramadan
```

**Paramètres URL :**
- `source` : origine du trafic (facebook, instagram, whatsapp)
- `ref` : nom de la campagne ou information supplémentaire (optionnel)

#### Méthode 2 : Utiliser le générateur de liens (à venir)

Un composant `TrackedLinkGenerator` est disponible dans `ShareButtons.tsx` que vous pouvez ajouter dans la page admin des produits.

### 2. Partager des produits depuis votre site

Les boutons de partage peuvent être ajoutés sur les pages produits :

```tsx
import ShareButtons from '@/components/ShareButtons';

<ShareButtons
  url={`https://votre-site.com/products/${product.slug}`}
  title={product.name}
  description={product.description}
  image={product.images[0]}
/>
```

### 3. Activer Facebook Pixel (optionnel)

1. **Créer un Pixel Facebook** :
   - Aller sur [Facebook Events Manager](https://business.facebook.com/events_manager/)
   - Créer un nouveau Pixel
   - Copier l'ID du Pixel

2. **Configurer dans votre projet** :

Ajouter dans `.env.local` :
```env
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=votre_pixel_id_ici
```

3. **Ajouter le composant dans le layout** :

Dans `app/layout.tsx` :
```tsx
import FacebookPixel from '@/components/FacebookPixel';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FacebookPixel />
        {children}
      </body>
    </html>
  );
}
```

### 4. Consulter les statistiques

Les statistiques par source sont affichées automatiquement dans le **Dashboard Admin** :

- Nombre de commandes par source
- Revenus générés par chaque canal
- Panier moyen par source
- Pourcentage de chaque source

## Exemples de publications Facebook

### Publication 1 : Nouveau produit

```
🔥 NOUVEAU ! Découvrez notre [Nom du produit]

✨ [Description courte et attractive]

💰 Prix : [Prix] DZD
🚚 Livraison dans toute l'Algérie

👉 Commandez maintenant : https://votre-site.com/products/produit?source=facebook&ref=nouveau-produit

#fashion #algeria #mode #shopping
```

### Publication 2 : Promotion

```
⚡ PROMO EXCEPTIONNELLE ⚡

-30% sur toute la collection !

🎁 Livraison GRATUITE pour toute commande
🔥 Offre limitée

🛍️ Profitez-en : https://votre-site.com?source=facebook&ref=promo-30

#promo #soldes #algeria
```

### Publication 3 : Témoignage client

```
❤️ Nos clients satisfaits !

"[Témoignage client]" - [Prénom]

Rejoignez les centaines de clients satisfaits !

🛒 Découvrez nos produits : https://votre-site.com/products?source=facebook&ref=temoignage

#satisfaction #qualité #algeria
```

## Stratégie de diffusion sur Facebook

### 1. Créer une Page Facebook

1. Créez une Page Facebook Business pour votre boutique
2. Ajoutez une photo de profil et de couverture professionnelles
3. Remplissez toutes les informations (description, contact, horaires)

### 2. Types de publications

**Publications régulières :**
- Nouveaux produits (2-3 fois/semaine)
- Promotions et offres spéciales
- Témoignages clients
- Conseils mode et styling
- Behind-the-scenes

**Stories :**
- Arrivages quotidiens
- Promotions flash
- Sondages (quel produit préférez-vous?)
- Compte à rebours pour les promos

### 3. Groupes Facebook

Rejoignez et partagez dans des groupes pertinents :
- Groupes de shopping en Algérie
- Groupes de mode féminine/masculine
- Groupes de vente par wilaya
- Groupes de bonnes affaires

**⚠️ Important :** Créez toujours des liens trackés différents pour chaque groupe :
```
Groupe Alger : ?source=facebook&ref=groupe-alger
Groupe Shopping DZ : ?source=facebook&ref=groupe-shopping-dz
```

### 4. Facebook Marketplace

Publiez vos produits sur Marketplace avec :
- Photos de haute qualité
- Description détaillée
- Prix clair
- Lien vers votre site avec tracking : `?source=facebook&ref=marketplace`

## Analyse des performances

### Dans le Dashboard Admin

Vous verrez :

```
📊 Commandes par source
━━━━━━━━━━━━━━━━━━━━━
🌐 Site Web          45%  |  23 commandes  |  345,000 DZD
📘 Facebook          30%  |  15 commandes  |  225,000 DZD
📸 Instagram         15%  |   8 commandes  |  120,000 DZD
💬 WhatsApp          10%  |   5 commandes  |   75,000 DZD
```

### Optimiser votre stratégie

- Si **Facebook** performe bien → Investir plus dans les publications Facebook
- Si **Instagram** génère peu → Améliorer votre présence Instagram
- Si **WhatsApp** convertit bien → Encourager les contacts WhatsApp

## Intégration avec WhatsApp Business

Vous pouvez également créer des liens WhatsApp trackables :

```
https://wa.me/213XXXXXXXXX?text=Bonjour,%20je%20suis%20intéressé%20par%20vos%20produits

Puis sur votre site:
https://votre-site.com?source=whatsapp&ref=contact-direct
```

## Conseils pour maximiser les conversions

### 1. Répondez rapidement

- Activez les notifications Facebook
- Répondez aux messages en moins de 1h
- Utilisez les réponses automatiques

### 2. Utilisez de belles photos

- Photos haute résolution
- Fond neutre ou lifestyle
- Plusieurs angles du produit
- Photos portées si possible

### 3. Créez un sentiment d'urgence

- "Dernières pièces disponibles !"
- "Offre valable jusqu'à [date]"
- "Stock limité"

### 4. Facilitez la commande

- Liens directs vers les produits
- Process de checkout simple
- Plusieurs options de paiement

### 5. Collectez des témoignages

- Demandez des avis après chaque livraison
- Partagez les photos clients (avec permission)
- Mettez en avant les avis positifs

## Prochaines étapes suggérées

1. **Créer votre Page Facebook Business**
2. **Publier vos premiers produits** avec des liens trackés
3. **Rejoindre des groupes** pertinents
4. **Publier régulièrement** (au moins 1x/jour)
5. **Analyser les statistiques** après 1 semaine
6. **Ajuster votre stratégie** selon les résultats

## Support et ressources

- **Facebook Business Suite** : https://business.facebook.com/
- **Facebook Events Manager** : https://business.facebook.com/events_manager/
- **Guide publicité Facebook** : https://www.facebook.com/business/ads

## Questions fréquentes

**Q : Dois-je activer Facebook Pixel ?**
R : C'est optionnel. Utile si vous prévoyez de faire de la publicité Facebook payante.

**Q : Comment savoir quelle source performe le mieux ?**
R : Consultez le Dashboard Admin, section "Commandes par source".

**Q : Puis-je modifier la source d'une commande ?**
R : Oui, dans les détails de la commande (fonctionnalité à ajouter si nécessaire).

**Q : Les liens trackés fonctionnent aussi pour Instagram ?**
R : Oui ! Utilisez `?source=instagram` dans vos liens Instagram.

## Conclusion

Avec cette intégration, vous pouvez maintenant :
- ✅ Diffuser vos produits sur Facebook
- ✅ Tracker l'origine de chaque commande
- ✅ Analyser quelle source génère le plus de ventes
- ✅ Optimiser votre stratégie marketing
- ✅ Partager facilement sur les réseaux sociaux

**Prêt à déployer ? Consultez `AMELIORATION_YALIDINE.md` pour la gestion des livraisons !**
