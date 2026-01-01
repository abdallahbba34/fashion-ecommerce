#!/bin/bash
# Script de déploiement VPS avec correction des styles CSS

echo "========================================"
echo "  DÉPLOIEMENT VPS - CORRECTION STYLES"
echo "========================================"
echo ""

# Configuration
VPS_USER="root"
VPS_HOST="vps116857.serveur-vps.net"
VPS_PATH="/var/www/ecommerce"
LOCAL_PATH="."

echo "📦 Étape 1: Création du build de production local..."
echo "----------------------------------------"

# Nettoyer les caches
rm -rf .next
rm -rf node_modules/.cache

# Build de production
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

echo "✅ Build créé avec succès"
echo ""

echo "📤 Étape 2: Transfert des fichiers vers le VPS..."
echo "----------------------------------------"

# Créer une archive tar excluant node_modules et autres fichiers inutiles
tar -czf deploy.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    --exclude=deploy.tar.gz \
    --exclude=.claude \
    --exclude=nul \
    --exclude=*.png \
    --exclude=*.jpg \
    .

# Transférer l'archive
scp deploy.tar.gz $VPS_USER@$VPS_HOST:/tmp/

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du transfert"
    rm deploy.tar.gz
    exit 1
fi

rm deploy.tar.gz
echo "✅ Fichiers transférés"
echo ""

echo "🔧 Étape 3: Déploiement sur le VPS..."
echo "----------------------------------------"

# Exécuter les commandes sur le VPS
ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /var/www/ecommerce

# Arrêter l'application
echo "⏹️  Arrêt de l'application..."
pm2 stop fashion-ecommerce

# Backup de l'ancien .env.production
if [ -f .env.production ]; then
    cp .env.production /tmp/.env.production.backup
fi

# Extraire les nouveaux fichiers
echo "📂 Extraction des fichiers..."
tar -xzf /tmp/deploy.tar.gz -C /var/www/ecommerce
rm /tmp/deploy.tar.gz

# Restaurer .env.production
if [ -f /tmp/.env.production.backup ]; then
    cp /tmp/.env.production.backup .env.production
    rm /tmp/.env.production.backup
fi

# Installer les dépendances de production
echo "📥 Installation des dépendances..."
npm install --production=false

# Vérifier que le build .next existe
if [ ! -d ".next" ]; then
    echo "❌ Le dossier .next n'existe pas!"
    exit 1
fi

# Redémarrer l'application
echo "🚀 Redémarrage de l'application..."
pm2 restart fashion-ecommerce

# Attendre que l'application démarre
sleep 3

# Vérifier le statut
pm2 status fashion-ecommerce

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "📊 Vérification finale:"
curl -s -o /dev/null -w "  Status HTTP: %{http_code}\n" http://localhost:3000/api/products?limit=1

ENDSSH

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du déploiement sur le VPS"
    exit 1
fi

echo ""
echo "========================================"
echo "✅ DÉPLOIEMENT RÉUSSI!"
echo "========================================"
echo ""
echo "🌐 Votre site est maintenant en ligne:"
echo "   https://lasuitechic.online"
echo ""
echo "💡 Si le problème persiste:"
echo "   1. Videz le cache de votre navigateur (Ctrl+Shift+R)"
echo "   2. Vérifiez les logs: ssh root@vps116857.serveur-vps.net 'pm2 logs fashion-ecommerce --lines 50'"
echo ""
