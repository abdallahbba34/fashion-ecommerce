# 🔍 Guide : Utiliser la Console du Navigateur

Guide simple pour ouvrir la console et vérifier Facebook Pixel.

---

## 🌐 ÉTAPE 1 : Ouvrir votre site

1. Ouvrez votre navigateur (Chrome, Firefox, Edge, etc.)
2. Allez sur : **http://lasuitechic.online**
3. Attendez que la page soit complètement chargée

---

## 🛠️ ÉTAPE 2 : Ouvrir la Console (F12)

### Méthode 1 : Touche F12 (La plus simple)

1. **Appuyez sur la touche F12** de votre clavier
   - C'est la touche tout en haut, à droite

**Résultat :** Une fenêtre s'ouvre en bas ou à droite du navigateur

### Méthode 2 : Clic droit

1. **Clic droit** n'importe où sur la page
2. Cliquez sur **"Inspecter"** ou **"Inspecter l'élément"**

### Méthode 3 : Menu du navigateur

**Google Chrome / Edge :**
1. Cliquez sur les 3 points en haut à droite
2. **"Plus d'outils"**
3. **"Outils de développement"**

**Firefox :**
1. Menu en haut à droite (3 barres)
2. **"Outils supplémentaires"**
3. **"Outils de développement web"**

---

## 📊 ÉTAPE 3 : Aller dans l'onglet Console

Une fois la fenêtre des outils de développement ouverte :

1. Cherchez les onglets en haut : **Elements, Console, Network, etc.**
2. **Cliquez sur l'onglet "Console"**

**Vous verrez :**
- Un fond blanc ou noir
- Peut-être des messages en rouge, bleu ou gris
- En bas, une ligne avec un curseur qui clignote : `>`

---

## ⌨️ ÉTAPE 4 : Taper la commande

1. **Cliquez dans la zone en bas** (là où il y a le `>`)
2. **Tapez exactement** (sans faute) :
   ```
   window.fbq
   ```
3. **Appuyez sur Entrée**

---

## ✅ ÉTAPE 5 : Interpréter le résultat

### Résultat A : Vous voyez quelque chose comme ça
```
ƒ fbq() { [native code] }
```
ou
```
function fbq() { ... }
```
✅ **C'EST BON !** Facebook Pixel est installé et fonctionne !

### Résultat B : Vous voyez
```
undefined
```
❌ Facebook Pixel n'est PAS installé ou pas chargé

### Résultat C : Vous voyez une erreur
```
ReferenceError: fbq is not defined
```
❌ Facebook Pixel n'est PAS installé

---

## 📸 CAPTURES D'ÉCRAN

### À quoi ça ressemble :

```
┌─────────────────────────────────────────────┐
│ Elements  Console  Sources  Network   ...   │ ← Onglets
├─────────────────────────────────────────────┤
│                                             │
│ [Log] Page chargée                          │
│ [Warning] Cookie warning                    │
│                                             │
├─────────────────────────────────────────────┤
│ > window.fbq                                │ ← Vous tapez ici
│ ƒ fbq() { [native code] }                  │ ← Résultat
│ >                                           │ ← Curseur
└─────────────────────────────────────────────┘
```

---

## 🧪 AUTRES TESTS UTILES

### Test 2 : Vérifier si jQuery est chargé
```
window.jQuery
```
ou
```
$
```

### Test 3 : Voir toutes les variables globales
```
Object.keys(window)
```

### Test 4 : Vérifier un élément spécifique
```
document.querySelector('.product-card')
```

---

## 🔍 VÉRIFIER LES ERREURS

### Dans la Console, cherchez les messages en ROUGE

Exemples d'erreurs courantes :

**Erreur 404 (image manquante) :**
```
GET http://lasuitechic.online/images/produit.jpg 404 (Not Found)
```
→ L'image n'existe pas sur le serveur

**Erreur de script :**
```
Uncaught ReferenceError: fbq is not defined
```
→ Facebook Pixel n'est pas chargé

**Erreur de réseau :**
```
Failed to load resource: net::ERR_CONNECTION_REFUSED
```
→ Problème de connexion

---

## 📱 SUR MOBILE

### Android (Chrome)
1. Ouvrez Chrome
2. Allez sur votre site
3. Menu (3 points) > **"Outils de développement"**
4. Onglet **"Console"**

### iPhone (Safari)
1. Activez d'abord le mode développeur :
   - Réglages > Safari > Avancé > "Inspecteur web"
2. Ouvrez Safari sur Mac
3. Développement > [Votre iPhone] > Console

---

## 🎯 CE QUE VOUS DEVEZ FAIRE

### Pour vérifier Facebook Pixel :

1. **F12** sur votre clavier
2. Cliquez sur **"Console"**
3. Tapez : **`window.fbq`**
4. Appuyez sur **Entrée**
5. **Faites une capture d'écran** du résultat
6. Envoyez-moi la capture ou décrivez ce que vous voyez

---

## 💡 ASTUCES

### Effacer la console
- Cliquez sur l'icône **🚫** (Interdiction) en haut
- Ou tapez : `clear()`

### Recharger la page
- **F5** ou **Ctrl + R**
- Ou clic droit > **Recharger**

### Fermer les outils de développement
- Appuyez à nouveau sur **F12**
- Ou cliquez sur le **X** en haut à droite

---

## 🐛 PROBLÈMES COURANTS

### "Je ne vois pas l'onglet Console"
→ Cherchez parmi tous les onglets, il est peut-être caché
→ Cliquez sur les **»** pour voir plus d'onglets

### "La fenêtre est trop petite"
→ Redimensionnez-la en tirant le bord

### "Tout est en anglais"
→ C'est normal, la console est toujours en anglais

### "Il y a plein de messages rouges"
→ C'est normal, concentrez-vous juste sur votre commande

---

## ✅ RÉCAPITULATIF SIMPLE

1. **Ouvrez** http://lasuitechic.online
2. **Appuyez** sur F12
3. **Cliquez** sur "Console"
4. **Tapez** : `window.fbq`
5. **Appuyez** sur Entrée
6. **Regardez** le résultat

**Si vous voyez une fonction = ✅ Facebook OK**
**Si vous voyez "undefined" = ❌ Facebook pas installé**

---

**C'est tout ! Simple non ? 😊**
