#!/bin/bash
# Script de nettoyage VPS - Suppression du dossier /var/www/ecommerce

echo "==========================================="
echo "  NETTOYAGE VPS - SUPPRESSION ECOMMERCE"
echo "==========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ACTIVE_DIR="/var/www/lasuitechic"
OLD_DIR="/var/www/ecommerce"
BACKUP_DIR="/root/backup_ecommerce_$(date +%Y%m%d_%H%M%S)"

echo "🔍 Étape 1: Vérification du dossier actif"
echo "-------------------------------------------"

# Vérifier que PM2 tourne bien depuis lasuitechic
PM2_CWD=$(pm2 describe lasuitechic 2>/dev/null | grep "exec cwd" | awk '{print $NF}')

if [ "$PM2_CWD" != "$ACTIVE_DIR" ]; then
    echo -e "${RED}✗ ERREUR: PM2 ne tourne PAS depuis $ACTIVE_DIR${NC}"
    echo "  PM2 tourne depuis: $PM2_CWD"
    echo ""
    echo "⚠️  Abandon de la suppression pour éviter de casser le site!"
    exit 1
fi

echo -e "${GREEN}✓ PM2 tourne bien depuis $ACTIVE_DIR${NC}"
echo ""

# Vérifier que le dossier ecommerce existe
echo "🔍 Étape 2: Vérification du dossier à supprimer"
echo "-------------------------------------------"

if [ ! -d "$OLD_DIR" ]; then
    echo -e "${YELLOW}⚠ Le dossier $OLD_DIR n'existe pas${NC}"
    echo "  Rien à supprimer."
    exit 0
fi

echo -e "${GREEN}✓ Dossier trouvé: $OLD_DIR${NC}"
du -sh "$OLD_DIR"
echo ""

# Demander confirmation (ou skip si -y)
if [ "$1" != "-y" ]; then
    echo "⚠️  ATTENTION: Cette action va supprimer définitivement:"
    echo "   $OLD_DIR"
    echo ""
    echo "Un backup sera créé dans: $BACKUP_DIR"
    echo ""
    read -p "Continuer? (oui/NON): " confirm

    if [ "$confirm" != "oui" ]; then
        echo -e "${YELLOW}Abandon.${NC}"
        exit 0
    fi
fi

# Créer un backup avant suppression
echo ""
echo "💾 Étape 3: Backup de sécurité"
echo "-------------------------------------------"

echo "Création du backup dans $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"

# Copier seulement les fichiers importants (pas node_modules ni .next)
rsync -a \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='.git' \
    "$OLD_DIR/" "$BACKUP_DIR/"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backup créé avec succès${NC}"
    echo "  Taille: $(du -sh $BACKUP_DIR | cut -f1)"
else
    echo -e "${RED}✗ Erreur lors du backup${NC}"
    exit 1
fi

echo ""

# Supprimer le dossier
echo "🗑️  Étape 4: Suppression du dossier"
echo "-------------------------------------------"

rm -rf "$OLD_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Dossier $OLD_DIR supprimé avec succès${NC}"
else
    echo -e "${RED}✗ Erreur lors de la suppression${NC}"
    exit 1
fi

echo ""

# Vérification finale
echo "✅ Étape 5: Vérification finale"
echo "-------------------------------------------"

if [ -d "$OLD_DIR" ]; then
    echo -e "${RED}✗ Le dossier existe encore!${NC}"
    exit 1
else
    echo -e "${GREEN}✓ Dossier supprimé${NC}"
fi

# Vérifier que PM2 tourne toujours
pm2 status lasuitechic > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PM2 tourne toujours correctement${NC}"
else
    echo -e "${RED}✗ PM2 ne tourne plus!${NC}"
    echo "  Tentative de redémarrage..."
    cd "$ACTIVE_DIR"
    pm2 restart lasuitechic
fi

echo ""
echo "==========================================="
echo "✅ NETTOYAGE TERMINÉ"
echo "==========================================="
echo ""
echo "📊 Résumé:"
echo "  - Dossier supprimé: $OLD_DIR"
echo "  - Backup créé: $BACKUP_DIR"
echo "  - Dossier actif: $ACTIVE_DIR"
echo "  - PM2 status: $(pm2 status lasuitechic 2>/dev/null | grep -o 'online\|stopped\|errored' | head -1)"
echo ""
echo "💡 Si vous voulez restaurer le backup:"
echo "   rsync -a $BACKUP_DIR/ /var/www/ecommerce/"
echo ""
echo "💡 Pour supprimer le backup (libérer de l'espace):"
echo "   rm -rf $BACKUP_DIR"
echo ""
