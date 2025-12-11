# 🖥️ Guide Commande VPS LWS

## 💰 Prix et Offres VPS LWS

### VPS Recommandés pour votre projet :

| Offre | Prix/mois | RAM | CPU | Stockage | Recommandation |
|-------|-----------|-----|-----|----------|----------------|
| **VPS-S** | 4,99€ | 2 GB | 1 vCore | 25 GB SSD | ✅ **Recommandé pour démarrer** |
| **VPS-M** | 9,99€ | 4 GB | 2 vCores | 50 GB SSD | Bon pour croissance |
| **VPS-L** | 19,99€ | 8 GB | 4 vCores | 100 GB SSD | Pour gros trafic |

**Pour votre site e-commerce qui démarre : VPS-S suffit largement !**

---

## 📝 Étapes de Commande

### 1. Aller sur le site LWS

🔗 **URL** : https://www.lws.fr/serveur_dedie_linux.php

### 2. Choisir votre VPS

- Cliquez sur **"VPS-S"** (4,99€/mois)
- Ou choisissez l'offre qui vous convient

### 3. Configuration du VPS

**Système d'exploitation :**
- Choisissez : **Ubuntu 22.04 LTS** (recommandé)
- OU : **Debian 12**

**Options à cocher :**
- ✅ Accès SSH (normalement inclus)
- ❌ Panel de contrôle (pas nécessaire pour notre projet)

### 4. Durée d'engagement

- 1 mois : Sans engagement
- 12 mois : Réduction possible
- 24 mois : Meilleur prix

**Conseil** : Commencez par 1 mois pour tester

### 5. Finaliser la commande

1. Ajoutez au panier
2. Créez un compte LWS (si nouveau client)
3. Procédez au paiement
4. Attendez l'email de confirmation (10-30 minutes)

---

## 📧 Après la Commande

Vous recevrez un email avec :

```
=== ACCÈS VPS ===
IP du serveur : XXX.XXX.XXX.XXX
Username : root (ou autre)
Password : MotDePasseTemporaire
Port SSH : 22
```

**⚠️ IMPORTANT** : Sauvegardez ces informations !

---

## 🌐 Nom de Domaine

Vous avez 2 options :

### Option A : Acheter chez LWS (pratique)

- Lors de la commande VPS, ajoutez un domaine
- Prix : ~10€/an pour un .com
- Avantage : Tout chez le même hébergeur

### Option B : Acheter ailleurs

Fournisseurs populaires :
- **OVH** : https://www.ovhcloud.com/fr/domains/
- **Namecheap** : https://www.namecheap.com
- **Gandi** : https://www.gandi.net

Prix moyen : 8-15€/an

---

## ✅ Configuration DNS (Important)

Une fois que vous avez le VPS ET le domaine :

### Si domaine chez LWS :
- DNS configuré automatiquement

### Si domaine ailleurs :
Dans votre gestionnaire de domaine, ajoutez :

**Type A Record :**
```
Nom : @
Type : A
Valeur : IP_DE_VOTRE_VPS
TTL : 3600
```

**Type A Record (www) :**
```
Nom : www
Type : A
Valeur : IP_DE_VOTRE_VPS
TTL : 3600
```

---

## ⏱️ Temps de Propagation DNS

- DNS prend 1-24h pour se propager (généralement 1-2h)
- Vous pouvez tester avec : https://dnschecker.org

---

## 💡 Alternatives au Domaine

Si vous ne voulez pas de domaine tout de suite :

1. **Utilisez l'IP du VPS** temporairement
   - Exemple : http://123.45.67.89
   - ⚠️ Pas de HTTPS sans domaine

2. **Sous-domaine gratuit** (temporaire)
   - Certains services offrent des sous-domaines gratuits
   - Ex: votresite.freehosting.com

---

## 📋 Checklist Commande

- [ ] VPS LWS commandé (Ubuntu 22.04 ou Debian 12)
- [ ] Email de confirmation reçu
- [ ] IP du serveur notée
- [ ] Username/Password SSH sauvegardés
- [ ] Nom de domaine acheté (optionnel mais recommandé)
- [ ] DNS configurés (si domaine externe)

---

## 🆘 Support LWS

Si problème lors de la commande :

- 📞 Téléphone : +33 (0)1 77 62 30 03
- 💬 Chat en ligne : Sur le site LWS
- 📧 Email : Via espace client
- 📚 FAQ : https://aide.lws.fr

---

## 🎯 Prochaine Étape

Une fois que vous avez :
- ✅ VPS LWS avec accès SSH
- ✅ Nom de domaine (optionnel)

➡️ On peut passer au **déploiement** !

---

## 💰 Récapitulatif Coûts

| Service | Coût Initial | Coût Mensuel |
|---------|--------------|--------------|
| VPS LWS (VPS-S) | 4,99€ | 4,99€ |
| Domaine .com | ~10€/an | ~0,83€ |
| MongoDB Atlas | GRATUIT | GRATUIT |
| SSL/HTTPS | GRATUIT | GRATUIT |
| **TOTAL** | ~15€ | **~6€/mois** |

---

**Prêt à commander ? 🚀**

Allez sur : https://www.lws.fr/serveur_dedie_linux.php
