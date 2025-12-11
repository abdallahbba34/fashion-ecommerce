#!/bin/bash

#######################################
# Script d'Installation Automatique VPS
# Fashion E-commerce - Next.js
# Ubuntu 24.04 LTS
#######################################

echo "🚀 Installation automatique du VPS LWS"
echo "======================================"
echo ""

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Vérifier si root
if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}❌ Ce script doit être exécuté en tant que root${NC}"
  exit 1
fi

echo -e "${YELLOW}📦 Étape 1/8 : Mise à jour du système...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ Système mis à jour${NC}"
echo ""

echo -e "${YELLOW}📦 Étape 2/8 : Installation de Node.js 20...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
echo -e "${GREEN}✅ Node.js installé : $(node -v)${NC}"
echo ""

echo -e "${YELLOW}📦 Étape 3/8 : Installation de PM2...${NC}"
npm install -g pm2
echo -e "${GREEN}✅ PM2 installé${NC}"
echo ""

echo -e "${YELLOW}📦 Étape 4/8 : Installation de Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✅ Nginx installé et démarré${NC}"
echo ""

echo -e "${YELLOW}📦 Étape 5/8 : Installation de Certbot (SSL)...${NC}"
apt install -y certbot python3-certbot-nginx
echo -e "${GREEN}✅ Certbot installé${NC}"
echo ""

echo -e "${YELLOW}🔥 Étape 6/8 : Configuration du pare-feu...${NC}"
apt install -y ufw
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable
echo -e "${GREEN}✅ Pare-feu configuré${NC}"
echo ""

echo -e "${YELLOW}📦 Étape 7/8 : Installation d'outils supplémentaires...${NC}"
apt install -y git curl htop nano
echo -e "${GREEN}✅ Outils installés${NC}"
echo ""

echo -e "${YELLOW}📁 Étape 8/8 : Création du répertoire de travail...${NC}"
mkdir -p /root/logs
echo -e "${GREEN}✅ Répertoire créé${NC}"
echo ""

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Installation terminée avec succès !${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📋 Résumé des versions installées :"
echo "   - Node.js : $(node -v)"
echo "   - npm : $(npm -v)"
echo "   - PM2 : $(pm2 -v)"
echo "   - Nginx : $(nginx -v 2>&1 | grep version)"
echo ""
echo "🎯 Prochaines étapes :"
echo "   1. Transférez votre projet dans /root/fashion-ecommerce"
echo "   2. Copiez le fichier .env.production"
echo "   3. Exécutez : cd /root/fashion-ecommerce && npm install --production"
echo "   4. Exécutez : npm run build"
echo "   5. Exécutez : pm2 start ecosystem.config.js"
echo "   6. Configurez Nginx avec le fichier de configuration fourni"
echo ""
echo "📚 Consultez le fichier DEPLOIEMENT_VPS_LWS_GUIDE_FINAL.md pour plus de détails"
echo ""
