# README - Corrections et Nettoyage VPS

## 📋 Résumé des actions

### 1. Problèmes identifiés

**echec.png**: Erreur générique au checkout sans message informatif
- ❌ "Une erreur est survenue. Veuillez réessayer"
- ✅ Maintenant: Message d'erreur détaillé

**insuf.png**: Message "Stock insuffisant" inapproprié
- Peut être résolu en vidant le cache du navigateur

**Dossier inutile**: `/var/www/ecommerce` existe mais n'est pas utilisé
- PM2 tourne depuis `/var/www/lasuitechic`
- Nettoyage recommandé

### 2. Corrections apportées

✅ **Meilleure gestion des erreurs au checkout**
  - Messages d'erreur détaillés côté client
  - Logs d'erreur dans la console
  - API retourne maintenant des messages spécifiques

✅ **Script de nettoyage VPS**
  - Supprime `/var/www/ecommerce` en toute sécurité
  - Crée un backup avant suppression
  - Vérifie que PM2 ne l'utilise pas

✅ **Script de déploiement**
  - Déploiement automatisé
  - Build, transfer, et restart
  - Vérifications post-déploiement

## 🚀 Comment appliquer les corrections

### Option A: Déploiement automatique (RECOMMANDÉ)

```bash
# Sur votre machine Windows
chmod +x scripts/deploy-corrections.sh
./scripts/deploy-corrections.sh
```

### Option B: Déploiement manuel

```bash
# 1. Build local
npm run build

# 2. Créer archive
tar -czf deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    .

# 3. Transférer
scp deploy.tar.gz root@vps116857.serveur-vps.net:/tmp/

# 4. Déployer sur le VPS
ssh root@vps116857.serveur-vps.net
cd /var/www/lasuitechic
pm2 stop lasuitechic
tar -xzf /tmp/deploy.tar.gz
npm install
npm run build
pm2 restart lasuitechic
pm2 logs lasuitechic --lines 20
```

## 🗑️ Supprimer le dossier /var/www/ecommerce

### Option 1: Script automatique (RECOMMANDÉ)

```bash
# Transférer le script
scp scripts/cleanup-vps.sh root@vps116857.serveur-vps.net:/tmp/

# Se connecter au VPS
ssh root@vps116857.serveur-vps.net

# Exécuter le nettoyage
bash /tmp/cleanup-vps.sh
```

Le script va:
1. ✅ Vérifier que PM2 ne l'utilise pas
2. ✅ Créer un backup de sécurité
3. ✅ Supprimer le dossier
4. ✅ Vérifier que tout fonctionne encore

### Option 2: Suppression manuelle (DANGEREUX)

```bash
# Sur le VPS
ssh root@vps116857.serveur-vps.net

# Vérifier d'abord que PM2 ne l'utilise pas
pm2 describe lasuitechic | grep "exec cwd"
# Doit montrer: /var/www/lasuitechic

# Créer backup
cp -r /var/www/ecommerce /root/backup_ecommerce

# Supprimer
rm -rf /var/www/ecommerce
```

## 🔍 Vérifications après déploiement

### 1. Vérifier PM2

```bash
ssh root@vps116857.serveur-vps.net
pm2 status lasuitechic
pm2 logs lasuitechic --lines 30
```

**Résultat attendu**:
- Status: `online`
- Pas d'erreurs dans les logs

### 2. Tester le site

1. Ouvrez https://lasuitechic.online
2. Videz le cache: `Ctrl+Shift+R`
3. Testez une commande jusqu'au checkout
4. Vérifiez que les messages d'erreur sont plus clairs

### 3. Tester l'API

```bash
# Test de l'API produits
curl https://lasuitechic.online/api/products?limit=1

# Doit retourner un JSON avec les produits
```

## 📁 Fichiers créés

| Fichier | Description |
|---------|-------------|
| `scripts/cleanup-vps.sh` | Script de nettoyage du dossier ecommerce |
| `scripts/deploy-corrections.sh` | Script de déploiement automatique |
| `CORRECTIONS_ERREURS.md` | Documentation détaillée des corrections |
| `README_CORRECTIONS.md` | Ce fichier |

## ❓ FAQ

### Q: Dois-je vraiment supprimer /var/www/ecommerce ?

R: **Non, ce n'est pas obligatoire**. Le dossier ne cause pas de problème, il occupe juste de l'espace disque (~200-500 MB). Si vous n'êtes pas sûr, gardez-le.

### Q: Que faire si le script de nettoyage échoue ?

R: Le script ne supprimera rien si:
- PM2 utilise ce dossier (sécurité)
- Vous n'avez pas confirmé avec "oui"

Si ça échoue, c'est qu'il y a un problème. Ne forcez pas.

### Q: Les corrections vont-elles vraiment résoudre l'erreur au checkout ?

R: Les corrections vont afficher **le vrai message d'erreur** au lieu de "Une erreur est survenue". Ça vous permettra de comprendre ce qui ne va pas:
- Erreur MongoDB → Vérifier la connexion
- Stock insuffisant → Vérifier les produits
- Erreur de validation → Vérifier le formulaire

### Q: Comment restaurer le backup après nettoyage ?

R: Le script crée un backup dans `/root/backup_ecommerce_YYYYMMDD_HHMMSS/`

Pour restaurer:
```bash
rsync -a /root/backup_ecommerce_*/  /var/www/ecommerce/
```

## 🎯 Actions recommandées (dans l'ordre)

1. **Déployer les corrections** (priorité haute)
   ```bash
   ./scripts/deploy-corrections.sh
   ```

2. **Tester le checkout** sur le site pour voir le nouveau message d'erreur

3. **Si tout fonctionne**, supprimer /var/www/ecommerce (optionnel)
   ```bash
   # Transférer et exécuter cleanup-vps.sh
   ```

4. **Libérer l'espace** en supprimant le backup (après quelques jours)
   ```bash
   ssh root@vps116857.serveur-vps.net 'rm -rf /root/backup_ecommerce_*'
   ```

## 📞 Support

Si vous rencontrez des problèmes:

1. Consultez `CORRECTIONS_ERREURS.md` pour le diagnostic
2. Vérifiez les logs PM2: `pm2 logs lasuitechic`
3. Envoyez-moi les logs et captures d'écran

---

**Tout est prêt pour être déployé!** Commencez par déployer les corrections, puis nettoyez le VPS si vous le souhaitez.
