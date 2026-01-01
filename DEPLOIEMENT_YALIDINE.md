# Déploiement des Corrections Yalidine

## Ce qui a été corrigé :

✅ **Erreur `stopdesk_id.trim()` qui causait le crash du formulaire**
✅ **Chargement dynamique des wilayas** depuis le mapping local (58 wilayas)
✅ **Chargement dynamique des communes** depuis l'API Yalidine
✅ **Chargement dynamique des stop desks** depuis l'API Yalidine
✅ **Transformation des champs en selects** pour une meilleure UX
✅ **API mise à jour** pour accepter wilaya_id, commune_id et stopdesk_id

## Méthode 1 : Commandes directes (RECOMMANDÉ)

Connectez-vous à votre VPS via SSH et exécutez ces commandes :

```bash
# 1. Aller dans le dossier du site
cd /var/www/lasuitechic

# 2. Récupérer les dernières modifications
git pull origin main

# 3. Installer les dépendances (si nécessaire)
npm install

# 4. Arrêter l'application
pm2 stop lasuitechic

# 5. Rebuilder l'application
npm run build

# 6. Redémarrer l'application
pm2 restart lasuitechic

# 7. Sauvegarder la configuration PM2
pm2 save

# 8. Vérifier que tout fonctionne
pm2 logs lasuitechic --lines 20
```

## Méthode 2 : Script automatique

```bash
# Copier le script sur le VPS (via WinSCP ou autre)
# Puis exécuter :
cd /var/www/lasuitechic
chmod +x scripts/deploy-yalidine-fix.sh
./scripts/deploy-yalidine-fix.sh
```

## Méthode 3 : Commande unique

```bash
cd /var/www/lasuitechic && git pull origin main && npm install && pm2 stop lasuitechic && npm run build && pm2 restart lasuitechic && pm2 save && pm2 logs lasuitechic --lines 20
```

## Vérification

Après le déploiement, testez le formulaire :

1. Allez sur https://lasuitechic.online/admin/orders
2. Cliquez sur une commande
3. Cliquez sur "Remettre au livreur Yalidine"
4. Vérifiez que :
   - La liste des wilayas s'affiche correctement
   - Les communes se chargent quand vous sélectionnez une wilaya
   - Les stop desks se chargent quand vous cochez "Livraison en point relais"
   - Le formulaire s'envoie sans erreur

## En cas d'erreur

Si vous voyez des erreurs, vérifiez :

```bash
# Voir les logs en temps réel
pm2 logs lasuitechic

# Redémarrer complètement PM2
pm2 restart all

# Vérifier l'état de l'application
pm2 status
```

## Variables d'environnement

Assurez-vous que votre fichier `.env.production` sur le VPS contient :

```env
YALIDINE_API_ID=votre_api_id
YALIDINE_API_TOKEN=votre_api_token
```

Ces variables sont nécessaires pour que les APIs Yalidine fonctionnent correctement.
