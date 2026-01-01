# 🔧 DIAGNOSTIC - Formulaire Yalidine incomplet

## ❌ PROBLÈME OBSERVÉ :

Le formulaire Yalidine ne montre que :
- Prix (DZD)
- Référence commande
- Stop Desk
- Dimensions

**Il MANQUE :**
- ❌ Section "Informations client" (prénom, nom, téléphone, adresse)
- ❌ Section "Localisation" (Wilaya SELECT, Commune SELECT)
- ❌ Liste des produits

## 🔎 ÉTAPE 1 : Vérifier que le bon code est sur le VPS

Connectez-vous au terminal LWS et exécutez :

```bash
cd /var/www/lasuitechic

# Vérifier le commit actuel
git log --oneline -3
```

**RÉSULTAT ATTENDU :**
```
639eec6 Fix: Correction formulaire Yalidine avec chargement dynamique des données
141d979 Chore: Ajout des scripts de déploiement automatique
34be426 Feature: Amélioration checkout, customers et paramètres
```

**SI VOUS NE VOYEZ PAS le commit `639eec6` en premier :**

```bash
# Récupérer le bon code
git pull origin main

# Vérifier à nouveau
git log --oneline -3

# Rebuilder
npm run build

# Redémarrer
pm2 restart lasuitechic
pm2 save
```

---

## 🔎 ÉTAPE 2 : Vérifier que les nouveaux fichiers existent

```bash
# Vérifier que YalidineParcelForm.tsx existe et a le bon contenu
ls -lh components/YalidineParcelForm.tsx

# Vérifier les APIs
ls -la app/api/yalidine/centers/
ls -la app/api/yalidine/communes/

# Vérifier la taille du fichier (devrait être ~15-20 KB)
du -h components/YalidineParcelForm.tsx
```

**RÉSULTAT ATTENDU :**
- `components/YalidineParcelForm.tsx` doit exister et faire ~15-20 KB
- `app/api/yalidine/centers/route.ts` doit exister
- `app/api/yalidine/communes/route.ts` doit exister

---

## 🔎 ÉTAPE 3 : Vérifier le contenu du fichier sur le VPS

```bash
# Voir les premières lignes du fichier pour vérifier qu'il contient les imports corrects
head -20 components/YalidineParcelForm.tsx
```

**VOUS DEVEZ VOIR :**
```javascript
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { WILAYA_MAPPING } from '@/lib/yalidine-wilayas';  // ← IMPORTANT !
```

**SI vous ne voyez PAS `import { WILAYA_MAPPING }` :**
Le fichier n'est pas le bon ! Il faut refaire le déploiement.

---

## 🔎 ÉTAPE 4 : Vider COMPLÈTEMENT le cache du navigateur

1. Ouvrez le site : https://lasuitechic.online/admin/orders
2. Appuyez sur **F12** pour ouvrir les DevTools
3. **CLIC DROIT** sur le bouton Refresh à côté de l'URL
4. Choisissez **"Vider le cache et actualiser de manière forcée"**
5. Ouvrez une commande et cliquez sur "Remettre au livreur Yalidine"

---

## 🔎 ÉTAPE 5 : Voir l'erreur EXACTE dans la Console

1. Gardez la console ouverte (F12)
2. Allez dans l'onglet **"Console"**
3. Cliquez sur "Créer le colis Yalidine"
4. **COPIEZ TOUTE L'ERREUR EN ROUGE**
5. Envoyez-moi l'erreur complète

---

## 🔎 ÉTAPE 6 : Voir les logs du serveur

Dans le terminal LWS :

```bash
cd /var/www/lasuitechic
pm2 logs lasuitechic --lines 50 --nostream
```

Cherchez les erreurs en rouge et copiez-les.

---

## 🔎 ÉTAPE 7 : Vérifier que les APIs fonctionnent

Testez directement les APIs dans votre navigateur :

1. **Test API Centers :**
   ```
   https://lasuitechic.online/api/yalidine/centers?wilaya_id=16
   ```
   Vous devriez voir une liste de centres JSON

2. **Test API Communes :**
   ```
   https://lasuitechic.online/api/yalidine/communes?wilaya_id=16
   ```
   Vous devriez voir une liste de communes JSON

**SI vous voyez "404 Not Found" :**
Les APIs n'ont pas été déployées ! Il faut refaire le déploiement.

---

## ✅ SI TOUT ÉCHOUE : DÉPLOIEMENT MANUEL VIA WINSCP

1. **Téléchargez depuis votre PC ces fichiers :**
   - `D:\ecom\components\YalidineParcelForm.tsx`
   - `D:\ecom\app\api\yalidine\create-parcel\route.ts`
   - `D:\ecom\app\api\yalidine\centers\route.ts` (dossier entier)
   - `D:\ecom\app\api\yalidine\communes\route.ts` (dossier entier)

2. **Connectez-vous au VPS avec WinSCP**

3. **Uploadez les fichiers vers :**
   - `/var/www/lasuitechic/components/YalidineParcelForm.tsx`
   - `/var/www/lasuitechic/app/api/yalidine/create-parcel/route.ts`
   - `/var/www/lasuitechic/app/api/yalidine/centers/` (créer le dossier si besoin)
   - `/var/www/lasuitechic/app/api/yalidine/communes/` (créer le dossier si besoin)

4. **Puis dans le terminal LWS :**
   ```bash
   cd /var/www/lasuitechic
   pm2 stop lasuitechic
   npm run build
   pm2 restart lasuitechic
   pm2 save
   ```

---

## 📋 CHECKLIST DE VÉRIFICATION

Avant de me contacter, vérifiez :

- [ ] Le commit `639eec6` est bien sur le VPS
- [ ] Le fichier `YalidineParcelForm.tsx` existe et fait ~15-20 KB
- [ ] Les APIs `/api/yalidine/centers` et `/api/yalidine/communes` existent
- [ ] Le cache du navigateur a été vidé (Ctrl + Shift + R)
- [ ] Les APIs retournent du JSON (pas 404) quand testées directement
- [ ] Le build s'est terminé sans erreur

---

## 📤 INFORMATIONS À M'ENVOYER

Si le problème persiste, envoyez-moi :

1. **Résultat de :** `git log --oneline -3`
2. **Résultat de :** `ls -lh components/YalidineParcelForm.tsx`
3. **Capture d'écran** de la console (F12) avec l'erreur en rouge
4. **Test des APIs** : ce que vous voyez sur `https://lasuitechic.online/api/yalidine/centers?wilaya_id=16`

---

Bonne chance ! 🚀
