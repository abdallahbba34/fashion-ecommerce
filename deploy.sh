#!/bin/bash

# Script de déploiement pour Fashion E-commerce sur LWS VPS
# Usage: bash deploy.sh

echo "🚀 Démarrage du déploiement..."

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables (à modifier selon votre configuration)
APP_DIR="/home/votre_user/fashion-ecommerce"
APP_NAME="fashion-ecommerce"

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Erreur: package.json non trouvé. Exécutez ce script depuis la racine du projet.${NC}"
    exit 1
fi

# Vérifier si .env.production existe
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Erreur: .env.production non trouvé.${NC}"
    echo "Créez le fichier .env.production en vous basant sur .env.production.example"
    exit 1
fi

echo -e "${YELLOW}📦 Installation des dépendances...${NC}"
npm install --production

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors de l'installation des dépendances${NC}"
    exit 1
fi

echo -e "${YELLOW}🔨 Build de production...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du build${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Redémarrage de l'application avec PM2...${NC}"

# Vérifier si l'app existe déjà dans PM2
if pm2 list | grep -q "$APP_NAME"; then
    echo "Application trouvée dans PM2, redémarrage..."
    pm2 restart $APP_NAME
else
    echo "Première installation, démarrage avec PM2..."
    pm2 start ecosystem.config.js
    pm2 save
fi

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du redémarrage PM2${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Déploiement réussi !${NC}"
echo ""
echo "📊 Status de l'application:"
pm2 status

echo ""
echo "📝 Pour voir les logs:"
echo "   pm2 logs $APP_NAME"
echo ""
echo "🌐 Votre site devrait être accessible à:"
echo "   http://votresite.com (configurez votre domaine dans Nginx)"
