#!/bin/bash

# Script de déploiement automatique pour le VPS
# Usage: ./deploy.sh

echo "🚀 Déploiement de Fashion E-commerce..."
echo ""

# Configuration - MODIFIEZ CES VALEURS
VPS_USER="root"
VPS_HOST="lasuitechic.online"
VPS_PROJECT_PATH="/var/www/lasuitechic"
VPS_PORT="22"

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Fonction pour afficher les messages
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Vérifier que les modifications locales sont commitées
echo "📋 Vérification des modifications locales..."
if [[ -n $(git status -s) ]]; then
    log_warning "Vous avez des modifications non commitées!"
    echo "Voulez-vous continuer quand même? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Déploiement annulé."
        exit 1
    fi
fi
log_info "OK"

# Afficher le dernier commit
echo ""
echo "📦 Dernier commit:"
git log -1 --oneline
echo ""

# Confirmation
echo "Voulez-vous déployer sur le VPS ${VPS_HOST}? (y/n)"
read -r confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Déploiement annulé."
    exit 1
fi

echo ""
echo "🔄 Connexion au VPS et déploiement..."
echo ""

# Commandes à exécuter sur le VPS
ssh -p $VPS_PORT $VPS_USER@$VPS_HOST << 'ENDSSH'

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Variables
PROJECT_PATH="/var/www/lasuitechic"
APP_NAME="fashion-ecommerce"

echo "📂 Navigation vers le projet..."
cd $PROJECT_PATH || { log_error "Le répertoire $PROJECT_PATH n'existe pas!"; exit 1; }
log_info "Dans $PROJECT_PATH"

echo ""
echo "🔄 Récupération des modifications..."
git pull origin main || { log_error "Erreur lors du git pull!"; exit 1; }
log_info "Git pull réussi"

echo ""
echo "📦 Installation des dépendances..."
npm install --production || { log_error "Erreur npm install!"; exit 1; }
log_info "Dépendances installées"

echo ""
echo "🏗️  Build du projet..."
npm run build || { log_error "Erreur build!"; exit 1; }
log_info "Build réussi"

echo ""
echo "🔄 Redémarrage de l'application..."

if command -v pm2 &> /dev/null; then
    echo "Utilisation de PM2..."
    if pm2 list | grep -q "$APP_NAME"; then
        pm2 restart $APP_NAME
        log_info "Application redémarrée"
    else
        pm2 start npm --name "$APP_NAME" -- start
        pm2 save
        log_info "Application démarrée"
    fi
    echo ""
    pm2 info $APP_NAME
elif systemctl is-active --quiet fashion-ecommerce; then
    echo "Utilisation de systemd..."
    sudo systemctl restart fashion-ecommerce
    log_info "Service redémarré"
    echo ""
    sudo systemctl status fashion-ecommerce --no-pager
else
    log_error "Aucun gestionnaire détecté!"
fi

echo ""
log_info "Déploiement terminé!"

ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    log_info "✅ Déploiement réussi!"
    echo ""
    echo "🌐 Site mis à jour sur: http://${VPS_HOST}"
else
    echo ""
    log_error "❌ Erreur lors du déploiement!"
    exit 1
fi
