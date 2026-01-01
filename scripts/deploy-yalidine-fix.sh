#!/bin/bash
# Script de déploiement des corrections Yalidine sur le VPS

echo "================================================"
echo "  DÉPLOIEMENT CORRECTIONS YALIDINE"
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
echo "2. Vérification de la branche actuelle..."
git branch

echo ""
echo "3. Récupération des dernières modifications..."
git pull origin main

if [ $? -eq 0 ]; then
    echo "✓ Git pull réussi!"
else
    echo "✗ Erreur lors du git pull!"
    exit 1
fi

echo ""
echo "4. Installation des dépendances (si nécessaire)..."
npm install

echo ""
echo "5. Arrêt de l'application..."
pm2 stop lasuitechic 2>/dev/null || echo "Application pas démarrée"

echo ""
echo "6. Build de l'application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✓ Build réussi!"
else
    echo "✗ Erreur lors du build!"
    exit 1
fi

echo ""
echo "7. Démarrage de l'application..."
pm2 start npm --name "lasuitechic" -- start 2>/dev/null || pm2 restart lasuitechic

echo ""
echo "8. Sauvegarde de la configuration PM2..."
pm2 save

echo ""
echo "9. État final:"
pm2 list

echo ""
echo "10. Logs récents:"
pm2 logs lasuitechic --lines 20 --nostream

echo ""
echo "================================================"
echo "  DÉPLOIEMENT TERMINÉ"
echo "================================================"
echo ""
echo "✓ Corrections Yalidine déployées avec succès!"
echo ""
echo "Testez le formulaire Yalidine sur:"
echo "https://lasuitechic.online/admin/orders"
echo ""
echo "Pour voir les logs en temps réel:"
echo "pm2 logs lasuitechic"
echo ""
