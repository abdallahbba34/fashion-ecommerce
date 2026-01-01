# Commande essentielle à exécuter sur le VPS

## 🎯 UNE SEULE commande à exécuter

Copiez-collez ceci sur le VPS:

```bash
pm2 describe lasuitechic
```

## 📋 Ce que cette commande va révéler

Cette commande va afficher **TOUTES** les informations sur votre application:

1. **Le dossier exact** où l'application tourne (`pm_cwd`)
2. **Le script** qui est lancé
3. **Les variables d'environnement** utilisées
4. **Le statut** complet du processus

## ✅ Avec cette info, je saurai:

- Si on doit utiliser `/var/www/ecommerce` ou `/var/www/lasuitechic`
- Pourquoi le site ne charge pas les produits
- La solution exacte pour corriger le problème

## 💡 Alternative si la commande ne marche pas

Si `pm2 describe lasuitechic` ne fonctionne pas, essayez:

```bash
pm2 info lasuitechic
```

Ou encore:

```bash
pm2 show lasuitechic
```

## 📸 Ce que j'ai besoin de voir

**Envoyez-moi le résultat complet** de cette commande (toutes les lignes affichées).

C'est la dernière pièce du puzzle pour résoudre définitivement votre problème!
