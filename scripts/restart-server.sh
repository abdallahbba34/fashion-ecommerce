#!/bin/bash
# Script pour redémarrer le serveur Next.js sur le VPS

echo "================================================"
echo "  REDÉMARRAGE SERVEUR LASUITECHIC"
echo "================================================"
echo ""

# Déterminer le bon dossier
if [ -d "/var/www/lasuitechic" ]; then
    APP_DIR="/var/www/lasuitechic"
    echo "✓ Dossier trouvé: /var/www/lasuitechic"
elif [ -d "/var/www/ecommerce" ]; then
    APP_DIR="/var/www/ecommerce"
    echo "✓ Dossier trouvé: /var/www/ecommerce"
else
    echo "✗ Erreur: Aucun dossier d'application trouvé!"
    exit 1
fi

echo ""
echo "1. Navigation vers le dossier..."
cd "$APP_DIR"
pwd

echo ""
echo "2. Vérification de l'état actuel PM2..."
pm2 list

echo ""
echo "3. Arrêt de l'application..."
pm2 stop lasuitechic 2>/dev/null || echo "Application pas démarrée"

echo ""
echo "4. Build de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Build réussi!"
else
    echo "✗ Erreur lors du build!"
    exit 1
fi

echo ""
echo "5. Démarrage de l'application..."
pm2 start npm --name "lasuitechic" -- start 2>/dev/null || pm2 restart lasuitechic

echo ""
echo "6. Sauvegarde de la configuration PM2..."
pm2 save

echo ""
echo "7. État final:"
pm2 list

echo ""
echo "8. Logs récents:"
pm2 logs lasuitechic --lines 10 --nostream

echo ""
echo "================================================"
echo "  REDÉMARRAGE TERMINÉ"
echo "================================================"
echo ""
echo "Testez votre connexion admin sur:"
echo "https://lasuitechic.online/admin/login"
echo ""
echo "Pour voir les logs en temps réel:"
echo "pm2 logs lasuitechic"
echo ""
