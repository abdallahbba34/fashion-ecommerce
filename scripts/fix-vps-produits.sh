#!/bin/bash
# Script de correction pour le problème de chargement des produits

echo "==========================================="
echo "  CORRECTION PROBLÈME PRODUITS VPS"
echo "==========================================="
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Vérifier le bon dossier
echo "📂 Étape 1: Identification du dossier actif"
echo "-------------------------------------------"

if [ -d "/var/www/ecommerce" ]; then
    cd /var/www/ecommerce
    echo -e "${GREEN}✓ Dossier trouvé: /var/www/ecommerce${NC}"
else
    echo -e "${RED}✗ Dossier /var/www/ecommerce introuvable!${NC}"
    exit 1
fi

echo ""

# 2. Vérifier PM2
echo "⚙️  Étape 2: Vérification PM2"
echo "-------------------------------------------"
pm2 status fashion-ecommerce
echo ""

# 3. Test API
echo "🔍 Étape 3: Test de l'API produits"
echo "-------------------------------------------"
echo "Test de l'API sur http://localhost:3000/api/products..."

API_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/products?limit=1)
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n 1)
API_BODY=$(echo "$API_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ API répond (HTTP $HTTP_CODE)${NC}"

    # Vérifier si l'API retourne des produits
    PRODUCT_COUNT=$(echo "$API_BODY" | grep -o '"products"' | wc -l)
    if [ "$PRODUCT_COUNT" -gt 0 ]; then
        echo -e "${GREEN}✓ L'API retourne des produits${NC}"
        echo ""
        echo "Aperçu de la réponse:"
        echo "$API_BODY" | head -c 500
        echo ""
    else
        echo -e "${YELLOW}⚠ L'API répond mais ne retourne pas de produits${NC}"
        echo "Réponse: $API_BODY"
    fi
else
    echo -e "${RED}✗ Erreur API (HTTP $HTTP_CODE)${NC}"
    echo "Réponse: $API_BODY"
    echo ""
    echo "Vérification des logs PM2..."
    pm2 logs fashion-ecommerce --lines 30 --nostream
fi

echo ""

# 4. Vérifier les variables d'environnement
echo "🔐 Étape 4: Vérification des variables d'environnement"
echo "-------------------------------------------"

if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓ Fichier .env.production trouvé${NC}"

    # Vérifier MONGODB_URI (masqué pour la sécurité)
    if grep -q "MONGODB_URI" .env.production; then
        echo -e "${GREEN}✓ MONGODB_URI défini${NC}"
        MONGODB_URI=$(grep "MONGODB_URI" .env.production | cut -d '=' -f 2-)
        echo "  URI: ${MONGODB_URI:0:30}... (tronqué)"
    else
        echo -e "${RED}✗ MONGODB_URI non défini!${NC}"
    fi

    # Vérifier NODE_ENV
    if grep -q "NODE_ENV" .env.production; then
        NODE_ENV=$(grep "NODE_ENV" .env.production | cut -d '=' -f 2-)
        echo -e "${GREEN}✓ NODE_ENV=$NODE_ENV${NC}"
    else
        echo -e "${YELLOW}⚠ NODE_ENV non défini${NC}"
    fi
else
    echo -e "${RED}✗ Fichier .env.production introuvable!${NC}"
fi

echo ""

# 5. Vérifier MongoDB
echo "🗄️  Étape 5: Test de connexion MongoDB"
echo "-------------------------------------------"

# Créer un script Node.js temporaire pour tester MongoDB
cat > /tmp/test-mongodb.js << 'ENDJS'
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.production' });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ Connexion MongoDB réussie!');
    return mongoose.connection.db.admin().listDatabases();
  })
  .then((result) => {
    console.log('Bases de données disponibles:');
    result.databases.forEach(db => console.log(`  - ${db.name}`));
    process.exit(0);
  })
  .catch((err) => {
    console.error('✗ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  });

setTimeout(() => {
  console.error('✗ Timeout - MongoDB ne répond pas');
  process.exit(1);
}, 10000);
ENDJS

node /tmp/test-mongodb.js
MONGO_TEST=$?
rm /tmp/test-mongodb.js

echo ""

# 6. Diagnostic final
echo "📊 Étape 6: Diagnostic final"
echo "-------------------------------------------"

if [ "$HTTP_CODE" = "200" ] && [ "$MONGO_TEST" = "0" ]; then
    echo -e "${GREEN}✅ TOUT FONCTIONNE CORRECTEMENT!${NC}"
    echo ""
    echo "Le problème peut venir:"
    echo "  1. Cache du navigateur - Videz le cache (Ctrl+Shift+R)"
    echo "  2. CDN/Proxy - Attendez quelques minutes"
    echo "  3. HTTPS vs HTTP - Vérifiez l'URL"
    echo ""
else
    echo -e "${RED}❌ PROBLÈMES DÉTECTÉS${NC}"
    echo ""

    if [ "$HTTP_CODE" != "200" ]; then
        echo "🔴 L'API ne fonctionne pas correctement"
        echo "   Solutions:"
        echo "   1. Vérifier les logs: pm2 logs fashion-ecommerce"
        echo "   2. Redémarrer: pm2 restart fashion-ecommerce"
    fi

    if [ "$MONGO_TEST" != "0" ]; then
        echo "🔴 MongoDB n'est pas accessible"
        echo "   Solutions:"
        echo "   1. Vérifier MONGODB_URI dans .env.production"
        echo "   2. Vérifier la whitelist IP sur MongoDB Atlas"
        echo "   3. Vérifier les credentials MongoDB"
    fi
    echo ""
fi

# 7. Actions recommandées
echo "🛠️  Actions recommandées"
echo "-------------------------------------------"
echo "1. Voir les logs en temps réel:"
echo "   pm2 logs fashion-ecommerce"
echo ""
echo "2. Redémarrer l'application:"
echo "   pm2 restart fashion-ecommerce --update-env"
echo ""
echo "3. Vérifier la page en production:"
echo "   curl http://localhost:3000/ | grep -i product"
echo ""
echo "4. Tester depuis votre navigateur:"
echo "   https://lasuitechic.online"
echo ""

echo "==========================================="
echo "  FIN DU DIAGNOSTIC"
echo "==========================================="
