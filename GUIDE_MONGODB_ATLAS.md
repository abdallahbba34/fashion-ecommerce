# 🗄️ Guide MongoDB Atlas - Étape par Étape

## Temps requis : 5-10 minutes | Coût : GRATUIT

---

## Étape 1 : Créer un compte (2 min)

1. **Allez sur** : https://www.mongodb.com/cloud/atlas/register

2. **Créez un compte** avec :
   - Votre email
   - Mot de passe sécurisé

   OU connectez-vous avec Google

3. **Cliquez sur** "Sign Up"

---

## Étape 2 : Créer un Cluster Gratuit (3 min)

1. **Choisissez l'offre** :
   - Cliquez sur **"Create"** sous "M0 Free"
   - ✅ 512 MB de stockage
   - ✅ Gratuit pour toujours

2. **Configuration du cluster** :
   - **Cloud Provider** : AWS (recommandé) ou Google Cloud
   - **Region** : Choisissez la plus proche (ex: Frankfurt, Paris, ou Ireland)
   - **Cluster Name** : `fashion-ecommerce` (ou laissez par défaut)

3. **Cliquez sur** "Create Deployment"

4. **Attendez** 1-3 minutes que le cluster se crée ⏳

---

## Étape 3 : Créer un Utilisateur Database (2 min)

Une popup va apparaître "Security Quickstart" :

1. **Authentication Method** : Username and Password

2. **Créez un utilisateur** :
   ```
   Username: ecomUser
   Password: [GÉNÉREZ UN MOT DE PASSE FORT]
   ```

   ⚠️ **IMPORTANT** :
   - Cliquez sur "Autogenerate Secure Password"
   - **COPIEZ ET SAUVEGARDEZ** ce mot de passe immédiatement !
   - Vous en aurez besoin pour la connection string

3. **Cliquez sur** "Create User"

---

## Étape 4 : Configurer l'Accès Réseau (1 min)

Toujours dans la popup :

1. **IP Access List** :
   - Vous verrez "Add entries to your IP Access List"

2. **Cliquez sur** "Add My Current IP Address"

3. **IMPORTANT** : Pour le VPS, ajoutez aussi :
   - Cliquez sur "Add IP Address"
   - Entrez : `0.0.0.0/0`
   - Description : "Allow all (VPS access)"
   - Cliquez "Add Entry"

   ⚠️ Note : En production, vous devriez mettre l'IP exacte de votre VPS

4. **Cliquez sur** "Finish and Close"

---

## Étape 5 : Obtenir la Connection String (2 min)

1. **Cliquez sur** "Database" dans le menu de gauche

2. **Trouvez votre cluster** et cliquez sur "Connect"

3. **Choisissez** "Drivers"

4. **Sélectionnez** :
   - Driver : Node.js
   - Version : 6.8 or later

5. **COPIEZ** la connection string :
   ```
   mongodb+srv://ecomUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **REMPLACEZ** `<password>` par le mot de passe que vous avez copié à l'étape 3

7. **AJOUTEZ** le nom de la base de données :
   ```
   mongodb+srv://ecomUser:VotreMotDePasse@cluster0.xxxxx.mongodb.net/fashion-ecommerce?retryWrites=true&w=majority
   ```

---

## ✅ Vérification Finale

Votre connection string doit ressembler à :
```
mongodb+srv://ecomUser:VotreMotDePasseIci123@cluster0.abc123.mongodb.net/fashion-ecommerce?retryWrites=true&w=majority
```

**Points importants** :
- ✅ Le `<password>` est remplacé par votre vrai mot de passe
- ✅ `/fashion-ecommerce` est ajouté avant le `?`
- ✅ Pas d'espaces dans la string
- ✅ Le mot de passe ne contient pas de caractères spéciaux problématiques

---

## 📋 Informations à Sauvegarder

Créez un fichier texte et sauvegardez :

```
=== MONGODB ATLAS ===
Email compte : votre.email@example.com
Username DB : ecomUser
Password DB : [votre_password_généré]
Connection String : mongodb+srv://ecomUser:password@cluster0.xxxxx.mongodb.net/fashion-ecommerce?retryWrites=true&w=majority
Cluster Name : fashion-ecommerce (ou Cluster0)
Region : Frankfurt (ou autre)
```

---

## 🎯 Prochaine Étape

Maintenant que vous avez MongoDB Atlas :
1. ✅ Vous avez votre connection string
2. ➡️ Prochaine étape : Créer le fichier `.env.production`

---

## 🔧 Fonctionnalités Utiles

### Voir vos données

1. Dans MongoDB Atlas, cliquez sur "Database"
2. Cliquez sur "Browse Collections"
3. Vous verrez vos données (produits, commandes, etc.)

### Backup Automatique

- Les backups sont automatiques avec M0 Free (snapshot tous les jours)
- Accès via "Backup" dans le menu

### Monitoring

- Cliquez sur "Metrics" pour voir :
  - Nombre de connexions
  - Utilisation du stockage
  - Opérations par seconde

---

## ❓ Problèmes Courants

### "Authentication failed"
➡️ Vérifiez que le mot de passe dans la connection string est correct

### "IP not whitelisted"
➡️ Ajoutez `0.0.0.0/0` dans IP Access List

### "Database not found"
➡️ Normal ! La base sera créée automatiquement lors de la première connexion

---

## 🆘 Support MongoDB

- Documentation : https://docs.atlas.mongodb.com
- Support : https://support.mongodb.com
- Communauté : https://www.mongodb.com/community/forums

---

**Félicitations ! MongoDB Atlas est configuré ! 🎉**

Passez à l'étape suivante : Créer `.env.production`
