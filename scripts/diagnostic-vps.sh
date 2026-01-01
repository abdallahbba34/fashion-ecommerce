#!/bin/bash
# Script de diagnostic pour identifier le bon dossier sur le VPS

echo "========================================"
echo "  DIAGNOSTIC VPS - LASUITECHIC"
echo "========================================"
echo ""

# Fonction pour vérifier un dossier
check_folder() {
    local folder=$1
    echo "--- Vérification: $folder ---"

    if [ -d "$folder" ]; then
        echo "✓ Le dossier existe"

        # Vérifier .env.production
        if [ -f "$folder/.env.production" ]; then
            echo "✓ .env.production trouvé"
        else
            echo "✗ .env.production manquant"
        fi

        # Vérifier package.json
        if [ -f "$folder/package.json" ]; then
            echo "✓ package.json trouvé"
        else
            echo "✗ package.json manquant"
        fi

        # Vérifier scripts
        if [ -d "$folder/scripts" ]; then
            echo "✓ Dossier scripts trouvé"
            if [ -f "$folder/scripts/update-admin-password.js" ]; then
                echo "✓ Script update-admin-password.js présent"
            fi
        fi

        # Date de dernière modification
        echo "Dernière modification:"
        ls -lt "$folder" | head -3

    else
        echo "✗ Le dossier n'existe pas"
    fi
    echo ""
}

# Vérifier les deux dossiers
check_folder "/var/www/ecommerce"
check_folder "/var/www/lasuitechic"

# Vérifier les processus Node
echo "--- Processus Node actifs ---"
ps aux | grep node | grep -v grep | grep -v diagnostic
echo ""

# Vérifier PM2
echo "--- Configuration PM2 ---"
if command -v pm2 &> /dev/null; then
    pm2 list
else
    echo "PM2 n'est pas installé"
fi
echo ""

# Vérifier Nginx
echo "--- Configuration Nginx ---"
if [ -f "/etc/nginx/sites-available/lasuitechic.online" ]; then
    echo "Configuration trouvée:"
    grep "root" /etc/nginx/sites-available/lasuitechic.online | head -1
elif [ -f "/etc/nginx/sites-enabled/lasuitechic.online" ]; then
    echo "Configuration trouvée:"
    grep "root" /etc/nginx/sites-enabled/lasuitechic.online | head -1
else
    echo "Configuration Nginx non trouvée"
fi
echo ""

echo "========================================"
echo "  RECOMMANDATION"
echo "========================================"
echo ""
echo "Le dossier actif est probablement celui qui:"
echo "1. Contient tous les fichiers nécessaires"
echo "2. A la date de modification la plus récente"
echo "3. Est référencé dans la config Nginx"
echo ""
echo "Pour mettre à jour le mot de passe admin,"
echo "utilisez le bon dossier avec cette commande:"
echo ""
echo "cd [DOSSIER_ACTIF]"
echo "node scripts/update-admin-password.js admin@lasuitechic.online \"Admin2025!\""
echo ""
