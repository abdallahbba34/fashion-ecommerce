# 🚨 ÉTAPES À SUIVRE MAINTENANT - RÉPARATION SITE

**IMPORTANT** : Suivez ces étapes EXACTEMENT dans l'ordre

---

## ÉTAPE 1 : OUVRIR POWERSHELL OU PUTTY

1. Appuyez sur **Windows + R**
2. Tapez : `powershell`
3. Appuyez sur **Entrée**

---

## ÉTAPE 2 : SE CONNECTER AU SERVEUR

### Copiez-collez cette commande :

```bash
ssh root@180.149.198.89
```

### Appuyez sur Entrée

- On vous demandera le mot de passe
- **Tapez votre mot de passe** (il ne s'affichera pas - c'est normal)
- Appuyez sur **Entrée**

### Vous devriez voir :
```
Welcome to Ubuntu...
root@vps-...#
```

✅ **VOUS ÊTES CONNECTÉ !**

---

## ÉTAPE 3 : ALLER DANS LE DOSSIER DU SITE

### Copiez-collez cette commande :

```bash
cd /var/www/ecommerce
```

### Appuyez sur Entrée

✅ **VOUS ÊTES DANS LE BON DOSSIER**

---

## ÉTAPE 4 : VÉRIFIER L'ÉTAT ACTUEL

### Copiez-collez cette commande :

```bash
echo "=== NGINX ===" && systemctl status nginx --no-pager | head -3 && echo "" && echo "=== PM2 ===" && pm2 status
```

### Appuyez sur Entrée

### NOTEZ CE QUE VOUS VOYEZ :

- **Nginx** dit "active" ou "inactive" ou "failed" ?
- **PM2** affiche "online" ou "errored" ?

**⚠️ IMPORTANT : Envoyez-moi ce que vous voyez si vous n'êtes pas sûr**

---

## ÉTAPE 5 : RÉCUPÉRER LES CORRECTIONS

### Copiez-collez cette commande :

```bash
git pull origin main
```

### Appuyez sur Entrée

### Vous devriez voir :
```
Updating...
app/api/upload/route.ts
GUIDE_REPARATION_URGENTE.md
...
```

✅ **CORRECTIONS TÉLÉCHARGÉES**

---

## ÉTAPE 6 : RÉPARER NGINX (TRÈS IMPORTANT)

### Copiez-collez TOUTES ces commandes en UNE SEULE FOIS :

```bash
sudo cp fashion-ecommerce-nginx.conf /etc/nginx/sites-available/fashion-ecommerce && sudo nginx -t
```

### Appuyez sur Entrée

### Résultat attendu :
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### ⚠️ SI VOUS VOYEZ UNE ERREUR :
**ARRÊTEZ-VOUS ET ENVOYEZ-MOI LE MESSAGE D'ERREUR**

✅ **NGINX CONFIGURÉ**

---

## ÉTAPE 7 : REDÉMARRER NGINX

### Copiez-collez cette commande :

```bash
sudo systemctl restart nginx && systemctl status nginx --no-pager | head -5
```

### Appuyez sur Entrée

### Vous devriez voir en VERT :
```
● nginx.service - A high performance web server
   Loaded: loaded
   Active: active (running)
```

✅ **NGINX REDÉMARRÉ**

---

## ÉTAPE 8 : INSTALLER LES DÉPENDANCES

### Copiez-collez cette commande :

```bash
npm install
```

### Appuyez sur Entrée

**⏳ ATTENDEZ 1-2 MINUTES** - Beaucoup de texte va défiler

### À la fin vous devriez voir :
```
added ... packages in ...
```

✅ **DÉPENDANCES INSTALLÉES**

---

## ÉTAPE 9 : REBUILDER LE SITE

### Copiez-collez cette commande :

```bash
npm run build
```

### Appuyez sur Entrée

**⏳ ATTENDEZ 1-3 MINUTES** - C'est l'étape la plus longue

### À la fin vous devriez voir :
```
✓ Compiled successfully
✓ Generating static pages
...
Route (app)                              Size     First Load JS
...
```

### ⚠️ SI VOUS VOYEZ "ERROR" EN ROUGE :
**ARRÊTEZ-VOUS ET ENVOYEZ-MOI L'ERREUR**

✅ **BUILD RÉUSSI**

---

## ÉTAPE 10 : REDÉMARRER L'APPLICATION

### Copiez-collez cette commande :

```bash
pm2 restart fashion-ecommerce && sleep 5 && pm2 status
```

### Appuyez sur Entrée

### Vous devriez voir un tableau comme ça :
```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ status  │ restart │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ fashion-ecommerce    │ online  │ XX      │
└─────┴──────────────────────┴─────────┴─────────┘
```

**IMPORTANT : "status" doit dire "online" en VERT**

### ⚠️ SI "status" dit "errored" EN ROUGE :

Copiez-collez cette commande :
```bash
pm2 logs fashion-ecommerce --err --lines 20
```

**ENVOYEZ-MOI CE QUE VOUS VOYEZ**

✅ **APPLICATION REDÉMARRÉE**

---

## ÉTAPE 11 : VÉRIFIER LES LOGS

### Copiez-collez cette commande :

```bash
pm2 logs fashion-ecommerce --lines 15
```

### Appuyez sur Entrée

### Vous devriez voir :
```
✓ Ready in XXXms
```

**Pour quitter les logs, appuyez sur CTRL + C**

✅ **LOGS VÉRIFIÉS**

---

## ÉTAPE 12 : TESTER LE SITE

### Ouvrez votre navigateur :

1. Allez sur : **https://lasuitechic.online**
2. Appuyez sur **CTRL + SHIFT + R** (pour vider le cache)

### Vous devriez voir :
- ✅ La page d'accueil
- ✅ Pas d'erreur 502 ou 503
- ✅ Le site fonctionne normalement

---

## ÉTAPE 13 : TESTER L'UPLOAD D'IMAGES (BONUS)

1. Allez sur : **https://lasuitechic.online/admin/login**
2. Connectez-vous
3. Allez dans "Produits" > Modifier un produit
4. Essayez d'uploader une image (jusqu'à 10MB maintenant)

✅ **L'UPLOAD DEVRAIT FONCTIONNER**

---

## ÉTAPE 14 : SE DÉCONNECTER DU SERVEUR

### Copiez-collez cette commande :

```bash
exit
```

### Appuyez sur Entrée

✅ **DÉCONNECTÉ DU SERVEUR**

---

## 🎉 FÉLICITATIONS !

Votre site **lasuitechic.online** est maintenant :
- ✅ En ligne
- ✅ Avec upload d'images jusqu'à 10MB
- ✅ Toutes les corrections appliquées

---

## 🆘 EN CAS DE PROBLÈME

### Si quelque chose ne marche pas :

1. **NOTEZ** le numéro de l'étape où ça bloque
2. **COPIEZ** le message d'erreur complet
3. **ENVOYEZ-MOI** ces informations

Je vous aiderai immédiatement !

---

## COMMANDE DE DIAGNOSTIC D'URGENCE

Si le site ne fonctionne toujours pas après toutes les étapes, exécutez cette commande :

```bash
ssh root@180.149.198.89
cd /var/www/ecommerce
echo "=== DIAGNOSTIC COMPLET ===" && nginx -t && echo "" && systemctl status nginx --no-pager | head -10 && echo "" && pm2 status && echo "" && pm2 logs fashion-ecommerce --lines 20 --nostream
```

Envoyez-moi tout ce que cette commande affiche.

---

## RÉSUMÉ DES ÉTAPES

1. ✅ Connexion SSH
2. ✅ Aller dans /var/www/ecommerce
3. ✅ Vérifier état actuel
4. ✅ git pull (récupérer corrections)
5. ✅ Copier config nginx
6. ✅ Redémarrer nginx
7. ✅ npm install
8. ✅ npm run build
9. ✅ pm2 restart
10. ✅ Vérifier logs
11. ✅ Tester le site
12. ✅ Déconnexion

---

**BON COURAGE ! VOUS ALLEZ Y ARRIVER !** 💪

Si vous avez besoin d'aide à n'importe quelle étape, dites-moi où vous êtes bloqué.
