#!/bin/bash
# Script de déploiement des corrections finales

echo "==========================================="
echo "  DÉPLOIEMENT CORRECTIONS FINALES"
echo "==========================================="
echo ""

# Configuration
VPS_USER="root"
VPS_HOST="vps116857.serveur-vps.net"
VPS_PATH="/var/www/lasuitechic"

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

tar -czf corrections-finales.tar.gz \
    --exclude=node_modules \
    --exclude=.git \
    --exclude=.env.local \
    --exclude=.claude \
    --exclude=*.png \
    --exclude=*.jpg \
    --exclude=*.md \
    --exclude=corrections-finales.tar.gz \
    .

echo -e "${GREEN}✓ Archive créée${NC}"
echo ""

echo "📡 Étape 3: Transfert vers le VPS"
echo "-------------------------------------------"

scp corrections-finales.tar.gz $VPS_USER@$VPS_HOST:/tmp/

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Erreur lors du transfert${NC}"
    rm corrections-finales.tar.gz
    exit 1
fi

rm corrections-finales.tar.gz
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
tar -xzf /tmp/corrections-finales.tar.gz
rm /tmp/corrections-finales.tar.gz

echo "🔄 Restauration .env.production..."
cp /tmp/.env.production.backup .env.production

echo "🔨 Build de production..."
npm run build

echo "🚀 Redémarrage..."
pm2 restart lasuitechic

sleep 3

echo ""
echo "📊 Status PM2:"
pm2 status lasuitechic

echo ""
echo "📝 Logs récents (vérification des erreurs):"
pm2 logs lasuitechic --lines 30 --nostream | tail -20

echo ""
echo "🧪 Test API produits:"
curl -s http://localhost:3000/api/products?limit=1 | head -c 200
echo ""

echo ""
echo "🧪 Test création commande (simulé):"
echo "  - Vérifiez manuellement le checkout sur le site"

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
echo "🎯 Prochaines étapes:"
echo ""
echo "1. Testez le CHECKOUT:"
echo "   https://lasuitechic.online"
echo "   → Ajoutez un produit au panier"
echo "   → Vérifiez que les champs Address et Commune apparaissent"
echo "   → Finalisez une commande test"
echo ""
echo "2. Testez la page ACCOUNT:"
echo "   https://lasuitechic.online/account"
echo "   → Devrait afficher la page (plus de 404)"
echo ""
echo "3. Testez le CHANGEMENT DE MOT DE PASSE admin:"
echo "   https://lasuitechic.online/admin/change-password"
echo "   → Connectez-vous à l'admin d'abord"
echo "   → Changez votre mot de passe"
echo ""
echo "📝 Pour voir les logs en temps réel:"
echo "  ssh $VPS_USER@$VPS_HOST 'pm2 logs lasuitechic'"
echo ""
echo "📖 Documentation complète:"
echo "  Consultez CORRECTIONS_FINALES.md"
echo ""
