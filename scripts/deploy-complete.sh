#!/bin/bash

# Script de déploiement complet avec Facebook et Yalidine
# Version: 2.0

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration VPS
VPS_USER="lwsuser"
VPS_HOST="180.149.198.89"
VPS_PATH="/home/lwsuser/ecom"
SSH_KEY_PATH="$HOME/.ssh/id_rsa_lws"

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Déploiement Complet - Facebook & Yalidine ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Étape 1: Vérifier la connexion SSH
echo -e "${YELLOW}[1/8]${NC} Vérification de la connexion VPS..."
if ssh -i "$SSH_KEY_PATH" -o ConnectTimeout=10 "$VPS_USER@$VPS_HOST" "echo 'OK'" > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Connexion VPS établie"
else
    echo -e "${RED}✗${NC} Impossible de se connecter au VPS"
    echo "Vérifiez votre clé SSH et les informations de connexion"
    exit 1
fi

# Étape 2: Afficher les changements récents
echo ""
echo -e "${YELLOW}[2/8]${NC} Changements récents:"
echo -e "${BLUE}─────────────────────────────────────────────${NC}"
git log -5 --oneline --decorate 2>/dev/null || echo "Pas d'historique git disponible"
echo -e "${BLUE}─────────────────────────────────────────────${NC}"
echo ""

# Étape 3: Build local
echo -e "${YELLOW}[3/8]${NC} Build du projet localement..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build réussi"
else
    echo -e "${RED}✗${NC} Erreur lors du build"
    exit 1
fi

# Étape 4: Créer une sauvegarde sur le VPS
echo ""
echo -e "${YELLOW}[4/8]${NC} Création d'une sauvegarde sur le VPS..."
ssh -i "$SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << 'EOF'
    cd /home/lwsuser
    BACKUP_NAME="ecom-backup-$(date +%Y%m%d-%H%M%S)"

    if [ -d "ecom" ]; then
        echo "Création de la sauvegarde: $BACKUP_NAME"
        cp -r ecom "$BACKUP_NAME"

        # Garder seulement les 3 dernières sauvegardes
        ls -dt ecom-backup-* | tail -n +4 | xargs -r rm -rf
        echo "✓ Sauvegarde créée"
    else
        echo "! Pas de dossier ecom existant, pas de sauvegarde nécessaire"
    fi
EOF

# Étape 5: Synchroniser les fichiers
echo ""
echo -e "${YELLOW}[5/8]${NC} Synchronisation des fichiers avec le VPS..."
echo -e "${BLUE}Fichiers exclus: node_modules, .git, .next (sera rebuild sur VPS)${NC}"

rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.next' \
    --exclude '.env.local' \
    --exclude 'public/uploads/*' \
    --exclude '*.log' \
    -e "ssh -i $SSH_KEY_PATH" \
    ./ "$VPS_USER@$VPS_HOST:$VPS_PATH/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Fichiers synchronisés"
else
    echo -e "${RED}✗${NC} Erreur lors de la synchronisation"
    exit 1
fi

# Étape 6: Copier le fichier .env.production
echo ""
echo -e "${YELLOW}[6/8]${NC} Copie de .env.production vers le VPS..."
scp -i "$SSH_KEY_PATH" .env.production "$VPS_USER@$VPS_HOST:$VPS_PATH/.env.production"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Variables d'environnement copiées"
else
    echo -e "${RED}✗${NC} Erreur lors de la copie de .env.production"
    exit 1
fi

# Étape 7: Installation et build sur le VPS
echo ""
echo -e "${YELLOW}[7/8]${NC} Installation des dépendances et build sur le VPS..."
ssh -i "$SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << 'EOF'
    cd /home/lwsuser/ecom

    echo "→ Installation des dépendances..."
    npm install --production=false

    echo "→ Build de l'application..."
    npm run build

    if [ $? -eq 0 ]; then
        echo "✓ Build terminé avec succès"
    else
        echo "✗ Erreur lors du build"
        exit 1
    fi
EOF

# Étape 8: Redémarrer l'application
echo ""
echo -e "${YELLOW}[8/8]${NC} Redémarrage de l'application..."
ssh -i "$SSH_KEY_PATH" "$VPS_USER@$VPS_HOST" << 'EOF'
    cd /home/lwsuser/ecom

    # Arrêter PM2
    echo "→ Arrêt de l'application..."
    pm2 stop ecom 2>/dev/null || true
    pm2 delete ecom 2>/dev/null || true

    # Démarrer avec PM2
    echo "→ Démarrage de l'application..."
    pm2 start npm --name "ecom" -- start -- -p 3000
    pm2 save

    # Afficher le statut
    echo ""
    echo "Status de l'application:"
    pm2 status

    echo ""
    echo "Logs récents:"
    pm2 logs ecom --lines 10 --nostream
EOF

# Récapitulatif
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         Déploiement Terminé ! ✓            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Nouveautés déployées:${NC}"
echo "  ✓ Formulaire Yalidine avec tous les champs"
echo "  ✓ Tracking des sources (Facebook, Instagram, WhatsApp)"
echo "  ✓ Statistiques par source dans le Dashboard Admin"
echo "  ✓ Champ 'Comment nous avez-vous connu?' dans checkout"
echo ""
echo -e "${BLUE}URL de votre site:${NC}"
echo "  → http://lasuitechic.online"
echo "  → http://180.149.198.89:3000"
echo ""
echo -e "${BLUE}Prochaines étapes:${NC}"
echo "  1. Testez le nouveau formulaire Yalidine (Admin > Commandes)"
echo "  2. Créez un lien Facebook avec ?source=facebook"
echo "  3. Consultez les statistiques (Dashboard Admin)"
echo "  4. Lisez GUIDE_DEMARRAGE_FACEBOOK.md pour commencer"
echo ""
echo -e "${YELLOW}Pour voir les logs en temps réel:${NC}"
echo "  ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89"
echo "  pm2 logs ecom"
echo ""
