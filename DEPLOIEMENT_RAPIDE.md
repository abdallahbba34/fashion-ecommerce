# ⚡ Déploiement Rapide - 3 méthodes simples

## 🎯 Méthode 1 : Script automatique (Le plus simple)

### Sur Windows

**Double-cliquez sur** : `deploy-simple.bat`

OU dans le terminal :
```cmd
deploy-simple.bat
```

Le script fait tout automatiquement :
1. ✅ Vérifie la connexion au VPS
2. ✅ Build le projet
3. ✅ Déploie sur le serveur
4. ✅ Redémarre l'application

### Sur Linux/Mac

```bash
bash scripts/deploy-complete.sh
```

---

## 🎯 Méthode 2 : Déploiement en 3 commandes

```bash
# 1. Build
npm run build

# 2. Synchroniser
rsync -avz --delete \
    --exclude 'node_modules' --exclude '.git' --exclude '.next' \
    -e "ssh -i ~/.ssh/id_rsa_lws" \
    ./ lwsuser@180.149.198.89:/home/lwsuser/ecom/

# 3. Restart sur le VPS
ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89 \
    "cd /home/lwsuser/ecom && npm install && npm run build && pm2 restart ecom"
```

---

## 🎯 Méthode 3 : Vercel (Le plus rapide)

### Première fois

1. **Créez un compte** sur [vercel.com](https://vercel.com)
2. **Installez Vercel CLI** :
   ```bash
   npm install -g vercel
   ```
3. **Déployez** :
   ```bash
   vercel
   ```
4. Suivez les instructions à l'écran

### Déploiements suivants

```bash
vercel --prod
```

C'est tout ! ✨

---

## ✅ Vérification

Après le déploiement, vérifiez que le site fonctionne :

**VPS** :
- http://lasuitechic.online
- http://180.149.198.89:3000

**Vercel** :
- https://votre-projet.vercel.app

---

## 🐛 Problèmes ?

### Le script ne fonctionne pas sur Windows

**Solution** : Utilisez WSL
```cmd
wsl --install
```
Redémarrez votre PC, puis relancez le script.

### Erreur de connexion SSH

**Solution** : Vérifiez votre clé SSH
```bash
ls ~/.ssh/id_rsa_lws
```

Si elle n'existe pas, créez-la ou contactez votre hébergeur.

### Erreur de build

**Solution** :
```bash
# Nettoyer et réessayer
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Plus d'informations

Pour un guide complet, consultez : **GUIDE_DEPLOIEMENT_SIMPLE.md**

---

## 🎉 C'est déployé !

Votre site est maintenant en ligne ! 🚀

**Prochaines étapes** :
1. Testez le site
2. Ajoutez vos produits
3. Partagez sur les réseaux sociaux
