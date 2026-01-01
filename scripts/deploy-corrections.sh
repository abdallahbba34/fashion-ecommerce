#!/bin/bash
# Script de déploiement des corrections sur le VPS

echo "==========================================="
echo "  DÉPLOIEMENT DES CORRECTIONS"
echo "==========================================="
echo ""

# Configuration
VPS_USER="root"
VPS_HOST="vps116857.serveur-vps.net"
VPS_PATH="/var/www/lasuitechic"
LOCAL_PATH="."

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "📦 Étape 1: Build local"
echo "-------------------------------------------"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erreur lors du build${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build réussi${NC}"
echo ""

echo "📤 Étape 2: Création de l'archive"
echo "-------------------------------------------"

tar -czf deploy-corrections.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    --exclude=.claude \
    --exclude=*.png \
    --exclude=*.jpg \
    --exclude=*.md \
    --exclude=deploy-corrections.tar.gz \
    .

echo -e "${GREEN}✓ Archive créée${NC}"
echo ""

echo "📡 Étape 3: Transfert vers le VPS"
echo "-------------------------------------------"

scp deploy-corrections.tar.gz $VPS_USER@$VPS_HOST:/tmp/

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erreur lors du transfert${NC}"
    rm deploy-corrections.tar.gz
    exit 1
fi

rm deploy-corrections.tar.gz
echo -e "${GREEN}✓ Fichiers transférés${NC}"
echo ""

echo "🚀 Étape 4: Déploiement sur le VPS"
echo "-------------------------------------------"

ssh $VPS_USER@$VPS_HOST << 'ENDSSH'
cd /var/www/lasuitechic

echo "⏹️  Arrêt de l'application..."
pm2 stop lasuitechic

echo "💾 Backup .env.production..."
cp .env.production /tmp/.env.production.backup

echo "📦 Extraction des fichiers..."
tar -xzf /tmp/deploy-corrections.tar.gz
rm /tmp/deploy-corrections.tar.gz

echo "🔄 Restauration .env.production..."
cp /tmp/.env.production.backup .env.production

echo "📦 Installation des dépendances..."
npm install --production=false

echo "🔨 Build de production..."
npm run build

echo "🚀 Redémarrage..."
pm2 restart lasuitechic

sleep 3

echo ""
echo "📊 Status PM2:"
pm2 status lasuitechic

echo ""
echo "📝 Logs récents:"
pm2 logs lasuitechic --lines 20 --nostream

echo ""
echo "🧪 Test API:"
curl -s http://localhost:3000/api/products?limit=1 | head -c 200
echo ""

ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erreur lors du déploiement${NC}"
    exit 1
fi

echo ""
echo "==========================================="
echo -e "${GREEN}✅ DÉPLOIEMENT RÉUSSI!${NC}"
echo "==========================================="
echo ""
echo "🌐 Site: https://lasuitechic.online"
echo ""
echo "💡 Prochaines étapes:"
echo "  1. Testez le checkout sur le site"
echo "  2. Vérifiez que les messages d'erreur sont plus clairs"
echo "  3. Si problème, consultez: CORRECTIONS_ERREURS.md"
echo ""
echo "📝 Pour voir les logs en temps réel:"
echo "  ssh $VPS_USER@$VPS_HOST 'pm2 logs lasuitechic'"
echo ""
