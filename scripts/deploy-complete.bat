@echo off
REM Script de déploiement complet pour Windows
REM Version: 2.0

setlocal enabledelayedexpansion

echo ╔════════════════════════════════════════════╗
echo ║  Déploiement Complet - Facebook ^& Yalidine ║
echo ╚════════════════════════════════════════════╝
echo.

REM Configuration VPS
set VPS_USER=lwsuser
set VPS_HOST=180.149.198.89
set VPS_PATH=/home/lwsuser/ecom
set SSH_KEY=%USERPROFILE%\.ssh\id_rsa_lws

echo [1/8] Vérification de la connexion VPS...
ssh -i "%SSH_KEY%" -o ConnectTimeout=10 %VPS_USER%@%VPS_HOST% "echo OK" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible de se connecter au VPS
    echo Vérifiez votre clé SSH et les informations de connexion
    pause
    exit /b 1
)
echo [OK] Connexion VPS établie
echo.

echo [2/8] Changements récents:
echo ─────────────────────────────────────────────
git log -5 --oneline --decorate 2>nul || echo Pas d'historique git disponible
echo ─────────────────────────────────────────────
echo.

echo [3/8] Build du projet localement...
call npm run build
if %errorlevel% neq 0 (
    echo [ERREUR] Erreur lors du build
    pause
    exit /b 1
)
echo [OK] Build réussi
echo.

echo [4/8] Création d'une sauvegarde sur le VPS...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_HOST% "cd /home/lwsuser && BACKUP_NAME=ecom-backup-$(date +%%Y%%m%%d-%%H%%M%%S) && [ -d ecom ] && cp -r ecom $BACKUP_NAME && ls -dt ecom-backup-* | tail -n +4 | xargs -r rm -rf && echo Sauvegarde créée || echo Pas de sauvegarde nécessaire"
echo.

echo [5/8] Synchronisation des fichiers avec le VPS...
echo Fichiers exclus: node_modules, .git, .next (sera rebuild sur VPS)
rsync -avz --delete --exclude "node_modules" --exclude ".git" --exclude ".next" --exclude ".env.local" --exclude "public/uploads/*" --exclude "*.log" -e "ssh -i %SSH_KEY%" ./ %VPS_USER%@%VPS_HOST%:%VPS_PATH%/
if %errorlevel% neq 0 (
    echo [ERREUR] Erreur lors de la synchronisation
    pause
    exit /b 1
)
echo [OK] Fichiers synchronisés
echo.

echo [6/8] Copie de .env.production vers le VPS...
scp -i "%SSH_KEY%" .env.production %VPS_USER%@%VPS_HOST%:%VPS_PATH%/.env.production
if %errorlevel% neq 0 (
    echo [ERREUR] Erreur lors de la copie de .env.production
    pause
    exit /b 1
)
echo [OK] Variables d'environnement copiées
echo.

echo [7/8] Installation des dépendances et build sur le VPS...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_HOST% "cd %VPS_PATH% && npm install --production=false && npm run build"
if %errorlevel% neq 0 (
    echo [ERREUR] Erreur lors du build sur le VPS
    pause
    exit /b 1
)
echo.

echo [8/8] Redémarrage de l'application...
ssh -i "%SSH_KEY%" %VPS_USER%@%VPS_HOST% "cd %VPS_PATH% && pm2 stop ecom 2>/dev/null || true && pm2 delete ecom 2>/dev/null || true && pm2 start npm --name ecom -- start -- -p 3000 && pm2 save && pm2 status && echo. && echo Logs récents: && pm2 logs ecom --lines 10 --nostream"
echo.

echo ╔════════════════════════════════════════════╗
echo ║         Déploiement Terminé ! ✓            ║
echo ╚════════════════════════════════════════════╝
echo.
echo Nouveautés déployées:
echo   ✓ Formulaire Yalidine avec tous les champs
echo   ✓ Tracking des sources (Facebook, Instagram, WhatsApp)
echo   ✓ Statistiques par source dans le Dashboard Admin
echo   ✓ Champ 'Comment nous avez-vous connu?' dans checkout
echo.
echo URL de votre site:
echo   → http://lasuitechic.online
echo   → http://180.149.198.89:3000
echo.
echo Prochaines étapes:
echo   1. Testez le nouveau formulaire Yalidine (Admin ^> Commandes)
echo   2. Créez un lien Facebook avec ?source=facebook
echo   3. Consultez les statistiques (Dashboard Admin)
echo   4. Lisez GUIDE_DEMARRAGE_FACEBOOK.md pour commencer
echo.
echo Pour voir les logs en temps réel:
echo   ssh -i %USERPROFILE%\.ssh\id_rsa_lws lwsuser@180.149.198.89
echo   pm2 logs ecom
echo.
pause
