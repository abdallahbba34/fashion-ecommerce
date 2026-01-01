# Correction du problème d'affichage

## Diagnostic

Le problème que vous rencontrez **n'est PAS un problème de connexion** mais un **problème de build de production**.

### Ce qui se passe:
- ✅ L'API fonctionne correctement et retourne toutes les données produits
- ✅ Les composants React sont corrects
- ✅ Les images s'affichent correctement
- ❌ Le texte ne s'affiche pas car les styles CSS Tailwind ne sont pas chargés

### Cause:
Le build de production déployé sur votre VPS n'a pas généré correctement les fichiers CSS Tailwind.

## Solution

### Option 1: Déploiement automatique (RECOMMANDÉ)

J'ai créé un script qui va:
1. Nettoyer tous les caches
2. Créer un nouveau build de production propre
3. Déployer automatiquement sur votre VPS
4. Redémarrer l'application

**Pour exécuter:**

```bash
# Rendre le script exécutable
chmod +x scripts/deploy-vps-fix-styles.sh

# Lancer le déploiement
./scripts/deploy-vps-fix-styles.sh
```

### Option 2: Déploiement manuel

Si vous préférez déployer manuellement:

#### Sur votre machine locale:

```bash
# 1. Nettoyer les caches
rm -rf .next
rm -rf node_modules/.cache

# 2. Créer un nouveau build
npm run build

# 3. Créer une archive (exclure node_modules)
tar -czf deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    --exclude=.claude \
    --exclude=nul \
    .

# 4. Transférer vers le VPS
scp deploy.tar.gz root@vps116857.serveur-vps.net:/tmp/
```

#### Sur le VPS:

```bash
# 1. Se connecter au VPS
ssh root@vps116857.serveur-vps.net

# 2. Aller dans le dossier du site
cd /var/www/ecommerce

# 3. Arrêter l'application
pm2 stop fashion-ecommerce

# 4. Sauvegarder .env.production
cp .env.production /tmp/.env.production.backup

# 5. Extraire les nouveaux fichiers
tar -xzf /tmp/deploy.tar.gz -C /var/www/ecommerce

# 6. Restaurer .env.production
cp /tmp/.env.production.backup .env.production

# 7. Installer les dépendances
npm install --production=false

# 8. Redémarrer l'application
pm2 restart fashion-ecommerce

# 9. Vérifier le statut
pm2 status
pm2 logs fashion-ecommerce --lines 20
```

## Après le déploiement

1. **Videz le cache de votre navigateur**: Appuyez sur `Ctrl+Shift+R` (Windows/Linux) ou `Cmd+Shift+R` (Mac)

2. **Vérifiez le site**: Allez sur https://lasuitechic.online

3. **Si le problème persiste**, vérifiez les logs:
   ```bash
   ssh root@vps116857.serveur-vps.net 'pm2 logs fashion-ecommerce --lines 50'
   ```

## Vérification locale avant déploiement

Pour tester le build localement avant de déployer:

```bash
# 1. Créer le build
npm run build

# 2. Démarrer le serveur de production sur le port 3001
PORT=3001 npm start

# 3. Ouvrir http://localhost:3001 dans votre navigateur
```

## Notes importantes

- Le build de production est maintenant créé avec un cache propre
- Tous les styles CSS Tailwind sont correctement générés
- Le dossier `.next` contient le build optimisé
- Les styles sont dans `.next/static/css/`

## Support

Si vous rencontrez des problèmes:
1. Vérifiez que PM2 tourne: `pm2 status`
2. Vérifiez les logs d'erreur: `pm2 logs fashion-ecommerce --err`
3. Vérifiez que Nginx est actif: `systemctl status nginx`
4. Testez l'API directement: `curl http://localhost:3000/api/products?limit=1`
