# GUIDE DE RÉPARATION D'URGENCE - LASUITECHIC.ONLINE

**Date** : 16 décembre 2025
**Problème** : Le site ne démarre pas après modification de la configuration d'upload
**Durée estimée** : 5-10 minutes

---

## DIAGNOSTIC RAPIDE

Le problème est probablement lié à la configuration Nginx qui a été modifiée pour augmenter la limite d'upload de 1MB à 10MB.

---

## ÉTAPE 1 : CONNEXION AU SERVEUR

```bash
ssh root@180.149.198.89
```

Entrez votre mot de passe.

---

## ÉTAPE 2 : DIAGNOSTIC COMPLET

Exécutez cette commande pour voir l'état de tous les services :

```bash
echo "=== 1. NGINX STATUS ===" && \
systemctl status nginx --no-pager && \
echo "" && \
echo "=== 2. NGINX TEST CONFIGURATION ===" && \
nginx -t && \
echo "" && \
echo "=== 3. PM2 STATUS ===" && \
pm2 status && \
echo "" && \
echo "=== 4. PM2 LOGS (dernières lignes) ===" && \
pm2 logs fashion-ecommerce --lines 10 --nostream
```

### Interprétation des résultats :

#### Cas A : Nginx affiche "failed" ou "inactive"
Le problème vient de Nginx. Passez à l'ÉTAPE 3.

#### Cas B : Nginx fonctionne mais PM2 affiche "errored"
Le problème vient de l'application. Passez à l'ÉTAPE 4.

#### Cas C : Tout est "online" mais le site ne s'affiche pas
Problème de cache. Passez à l'ÉTAPE 5.

---

## ÉTAPE 3 : RÉPARER NGINX (Si Nginx est en erreur)

### 3.1 - Tester la configuration Nginx actuelle

```bash
nginx -t
```

### Si vous voyez une ERREUR de syntaxe :

Il faut restaurer la bonne configuration.

### 3.2 - Aller dans le dossier du projet

```bash
cd /var/www/ecommerce
```

### 3.3 - Récupérer la configuration corrigée depuis GitHub

```bash
git pull origin main
```

### 3.4 - Copier la nouvelle configuration Nginx

```bash
sudo cp fashion-ecommerce-nginx.conf /etc/nginx/sites-available/fashion-ecommerce
```

### 3.5 - Tester la nouvelle configuration

```bash
sudo nginx -t
```

**Résultat attendu :**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 3.6 - Redémarrer Nginx

```bash
sudo systemctl restart nginx
```

### 3.7 - Vérifier que Nginx fonctionne

```bash
systemctl status nginx --no-pager
```

**Vous devriez voir "active (running)" en vert.**

✅ **Nginx réparé !** Passez à l'ÉTAPE 6 pour vérifier le site.

---

## ÉTAPE 4 : RÉPARER L'APPLICATION (Si PM2 affiche "errored")

### 4.1 - Voir les logs d'erreur

```bash
pm2 logs fashion-ecommerce --err --lines 30
```

Notez l'erreur affichée.

### 4.2 - Aller dans le dossier du projet

```bash
cd /var/www/ecommerce
```

### 4.3 - Récupérer le code corrigé

```bash
git pull origin main
```

### 4.4 - Réinstaller les dépendances

```bash
npm install
```

### 4.5 - Rebuilder l'application

```bash
npm run build
```

**Important :** Attendez que le build se termine complètement (1-3 minutes).

### 4.6 - Redémarrer l'application

```bash
pm2 restart fashion-ecommerce
```

### 4.7 - Vérifier le statut

```bash
pm2 status
```

**Vous devriez voir "online" en vert.**

### 4.8 - Vérifier les logs

```bash
pm2 logs fashion-ecommerce --lines 20
```

**Vous devriez voir :**
```
✓ Ready in XXXms
```

✅ **Application réparée !** Passez à l'ÉTAPE 6 pour vérifier le site.

---

## ÉTAPE 5 : VIDER LE CACHE (Si tout est online mais le site ne s'affiche pas)

### 5.1 - Redémarrer Nginx et PM2

```bash
sudo systemctl restart nginx && pm2 restart fashion-ecommerce
```

### 5.2 - Vérifier les logs PM2

```bash
pm2 logs fashion-ecommerce --lines 20
```

### 5.3 - Sur votre navigateur

1. Allez sur https://lasuitechic.online
2. Appuyez sur **CTRL + SHIFT + DELETE**
3. Cochez "Images et fichiers en cache"
4. Cliquez sur "Effacer les données"
5. Ou ouvrez une fenêtre de navigation privée

✅ **Cache vidé !** Le site devrait maintenant s'afficher.

---

## ÉTAPE 6 : VÉRIFICATION FINALE

### 6.1 - Tester le site web

Ouvrez votre navigateur et allez sur :
- https://lasuitechic.online

**Vous devriez voir :**
- ✅ La page d'accueil s'affiche
- ✅ Pas de message d'erreur 502 ou 503
- ✅ Les images se chargent

### 6.2 - Tester l'upload d'images (NOUVEAU)

1. Allez sur : https://lasuitechic.online/admin/login
2. Connectez-vous avec vos identifiants admin
3. Allez dans "Produits" > Modifier un produit
4. Essayez d'uploader une image jusqu'à **10MB**

**Résultat attendu :** L'upload doit fonctionner sans erreur.

---

## ÉTAPE 7 : COMMITER LES CHANGEMENTS

Si tout fonctionne, commitez les changements :

```bash
cd /var/www/ecommerce
git add .
git commit -m "Fix: augmentation limite upload à 10MB"
git push origin main
```

---

## CONFIGURATION APPLIQUÉE

### Ce qui a été corrigé :

1. **Nginx** : Ajout de `client_max_body_size 10M;`
2. **Nginx** : Ajout de timeouts pour uploads longs
3. **API Upload** : Limite passée de 5MB à 10MB

### Fichiers modifiés :

- `fashion-ecommerce-nginx.conf` (ligne 6)
- `app/api/upload/route.ts` (ligne 42)

---

## SI LE PROBLÈME PERSISTE

### Option 1 : Restaurer une version stable

```bash
cd /var/www/ecommerce
git log --oneline -5  # Voir les derniers commits
git checkout [hash-du-commit-stable]  # Remplacez par le hash d'un commit qui fonctionnait
npm install
npm run build
pm2 restart fashion-ecommerce
```

### Option 2 : Réinitialiser complètement

```bash
cd /var/www/ecommerce

# Sauvegarder l'ancien .env.production
cp .env.production .env.production.backup

# Réinitialiser le code
git fetch origin
git reset --hard origin/main

# Restaurer .env.production
cp .env.production.backup .env.production

# Reconstruire
npm install
npm run build

# Redémarrer tous les services
pm2 restart fashion-ecommerce
sudo systemctl restart nginx
```

---

## COMMANDES DE VÉRIFICATION RAPIDE

Pour vérifier l'état de tout en une seule commande :

```bash
echo "=== NGINX ===" && nginx -t && systemctl status nginx --no-pager | head -5 && \
echo "" && echo "=== PM2 ===" && pm2 status && \
echo "" && echo "=== DERNIERS LOGS ===" && pm2 logs fashion-ecommerce --lines 5 --nostream
```

---

## RÉSUMÉ DES MODIFICATIONS

| Élément | Avant | Après |
|---------|-------|-------|
| Nginx `client_max_body_size` | Non défini (1MB par défaut) | **10MB** |
| API Upload max size | 5MB | **10MB** |
| Nginx timeouts | Non défini | 600 secondes |

---

## POINTS DE VÉRIFICATION

Après la réparation, vérifiez que :

- [ ] Nginx est "active (running)"
- [ ] PM2 affiche "online" en vert
- [ ] Le site https://lasuitechic.online s'affiche
- [ ] L'admin est accessible
- [ ] L'upload d'images fonctionne jusqu'à 10MB
- [ ] Aucune erreur dans les logs PM2

---

## BESOIN D'AIDE ?

Si le problème persiste après avoir suivi toutes ces étapes :

1. Exécutez cette commande et envoyez-moi le résultat :

```bash
echo "=== DIAGNOSTIC COMPLET ===" && \
echo "Nginx status:" && systemctl status nginx --no-pager && \
echo "" && echo "Nginx test:" && nginx -t && \
echo "" && echo "PM2 status:" && pm2 status && \
echo "" && echo "PM2 logs:" && pm2 logs fashion-ecommerce --err --lines 50 --nostream && \
echo "" && echo "Disk space:" && df -h && \
echo "" && echo "Memory:" && free -h
```

2. Envoyez-moi également le contenu de :
```bash
cat /var/log/nginx/error.log | tail -50
```

---

**BON COURAGE !** 🚀

Le site devrait être de nouveau opérationnel après ces étapes.
