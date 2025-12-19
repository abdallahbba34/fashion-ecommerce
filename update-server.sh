#!/bin/bash
# ================================================
# Script de mise à jour rapide - La Suite Chic
# ================================================
# À exécuter sur le VPS après avoir pushé les modifications

echo "🚀 Mise à jour de La Suite Chic..."

# 1. Naviguer vers le répertoire
cd /var/www/lasuitechic || exit

# 2. Récupérer les dernières modifications
echo "📥 Récupération du code..."
git pull origin main

# 3. Installer les nouvelles dépendances
echo "📦 Installation des dépendances..."
npm install

# 4. Rebuild de production
echo "🔨 Build de production..."
npm run build

# 5. Redémarrer l'application
echo "🔄 Redémarrage de l'application..."
pm2 restart lasuitechic

# 6. Afficher le statut
echo "✅ Mise à jour terminée!"
pm2 status

echo ""
echo "📊 Pour voir les logs en temps réel:"
echo "pm2 logs lasuitechic"
