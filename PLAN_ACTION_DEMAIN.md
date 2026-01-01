# 📋 PLAN D'ACTION POUR DEMAIN - Yalidine

## 🎯 OBJECTIF
Faire fonctionner le formulaire "Remettre au livreur Yalidine" avec les listes déroulantes (Wilaya, Commune, Stop Desk)

---

## 🔴 PROBLÈMES IDENTIFIÉS

1. **❌ Identifiants Yalidine incorrects sur le VPS**
   - Le .env.production contient des valeurs par défaut
   - L'API Yalidine rejette les requêtes

2. **❌ Formulaire incomplet**
   - Manque les sections Informations client et Localisation
   - Probablement lié au cache ou au code pas déployé

---

## ✅ ÉTAPES À SUIVRE (DANS L'ORDRE)

### 📌 ÉTAPE 1 : Corriger les identifiants Yalidine (CRITIQUE)

**Fichier guide :** `FIX_YALIDINE_ENV.md`

**Commande rapide :**
```bash
cd /var/www/lasuitechic && \
sed -i 's/YALIDINE_API_ID=.*/YALIDINE_API_ID=99569450964952578887/' .env.production && \
sed -i 's/YALIDINE_API_TOKEN=.*/YALIDINE_API_TOKEN=b9XQrNSJ5ukLytnIHBcmjsd03TeaCxigwvRP6DAO82Wo1Vlpfh4M7EqGYUKZzF/' .env.production && \
cat .env.production | grep YALIDINE && \
pm2 restart lasuitechic && \
pm2 save
```

**Vérification :**
```bash
cat /var/www/lasuitechic/.env.production | grep YALIDINE
```

Vous devez voir :
```
YALIDINE_API_ID=99569450964952578887
YALIDINE_API_TOKEN=b9XQrNSJ5ukLytnIHBcmjsd03TeaCxigwvRP6DAO82Wo1Vlpfh4M7EqGYUKZzF
```

---

### 📌 ÉTAPE 2 : Vérifier que le bon code est déployé

**Fichier guide :** `DIAGNOSTIC_YALIDINE_FORMULAIRE.md`

**Commandes :**
```bash
cd /var/www/lasuitechic

# Vérifier le commit
git log --oneline -3

# SI vous ne voyez PAS "639eec6 Fix: Correction formulaire Yalidine..."
git pull origin main
npm run build
pm2 restart lasuitechic
pm2 save
```

**Vérifier les fichiers :**
```bash
ls -lh components/YalidineParcelForm.tsx
ls -la app/api/yalidine/centers/
ls -la app/api/yalidine/communes/
```

---

### 📌 ÉTAPE 3 : Tester les APIs directement

Ouvrez dans votre navigateur :

1. **Test Centers :**
   ```
   https://lasuitechic.online/api/yalidine/centers?wilaya_id=16
   ```
   ✅ Devrait afficher une liste JSON de centres

2. **Test Communes :**
   ```
   https://lasuitechic.online/api/yalidine/communes?wilaya_id=16
   ```
   ✅ Devrait afficher une liste JSON de communes

**SI vous voyez "404 Not Found" :**
Les APIs ne sont pas déployées, refaites l'ÉTAPE 2.

**SI vous voyez "Configuration Yalidine manquante" :**
Les identifiants ne sont pas corrects, refaites l'ÉTAPE 1.

---

### 📌 ÉTAPE 4 : Vider le cache du navigateur

1. Allez sur https://lasuitechic.online/admin/orders
2. Appuyez sur **F12**
3. **CLIC DROIT** sur le bouton refresh (à côté de l'URL)
4. Choisissez **"Vider le cache et actualiser de manière forcée"**

---

### 📌 ÉTAPE 5 : Tester le formulaire

1. Ouvrez une commande
2. Cliquez "Remettre au livreur Yalidine"
3. **Vous devriez voir :**
   - ✅ Section "Informations client" (prénom, nom, téléphone, adresse)
   - ✅ Section "Localisation" avec :
     - SELECT Wilaya (liste des 58 wilayas)
     - SELECT Commune (chargé dynamiquement)
   - ✅ Section "Options d'expédition" avec :
     - Checkbox "Livraison en point relais"
     - Si coché : SELECT Stop Desk (chargé dynamiquement)

---

### 📌 ÉTAPE 6 : Si ça ne marche toujours pas

Ouvrez la console (F12) et envoyez-moi :

1. **L'erreur dans la console** (onglet Console, en rouge)
2. **Le résultat de :**
   ```bash
   git log --oneline -3
   cat /var/www/lasuitechic/.env.production | grep YALIDINE
   ls -lh components/YalidineParcelForm.tsx
   ```
3. **Une capture d'écran** du formulaire

---

## 📊 CHECKLIST DE VÉRIFICATION

Avant de me contacter, vérifiez que TOUT est ✅ :

- [ ] Les identifiants Yalidine sont corrects dans .env.production
- [ ] Le commit 639eec6 est déployé sur le VPS
- [ ] Les APIs /api/yalidine/centers et /api/yalidine/communes retournent du JSON
- [ ] Le fichier YalidineParcelForm.tsx existe et fait ~15-20 KB
- [ ] Le cache du navigateur a été vidé (Ctrl + Shift + R)
- [ ] PM2 montre que l'app tourne : `pm2 list`

---

## 🎯 RÉSULTAT ATTENDU

Après avoir suivi toutes ces étapes, le formulaire devrait :

1. S'ouvrir complètement avec toutes les sections
2. Charger automatiquement la liste des wilayas
3. Charger les communes quand vous sélectionnez une wilaya
4. Charger les stop desks quand vous cochez "Livraison en point relais"
5. Créer le colis sur Yalidine sans erreur

---

Bon courage ! 🚀

Si après avoir tout fait dans l'ordre le problème persiste, envoyez-moi les informations de l'ÉTAPE 6.
