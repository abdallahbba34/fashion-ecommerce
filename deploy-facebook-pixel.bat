@echo off
echo ========================================
echo   DEPLOIEMENT FACEBOOK PIXEL
echo ========================================
echo.

echo [1/4] Connexion au VPS et mise a jour du code...
ssh -i %USERPROFILE%\.ssh\id_rsa_lws lwsuser@180.149.198.89 "cd /home/lwsuser/ecom && git pull origin main"

if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Impossible de mettre a jour le code sur le VPS
    pause
    exit /b 1
)

echo.
echo [2/4] Verification du fichier .env.production...
ssh -i %USERPROFILE%\.ssh\id_rsa_lws lwsuser@180.149.198.89 "cd /home/lwsuser/ecom && grep -q 'NEXT_PUBLIC_FACEBOOK_PIXEL_ID' .env.production && echo 'Pixel ID present' || echo 'NEXT_PUBLIC_FACEBOOK_PIXEL_ID=4656400744579514' >> .env.production"

echo.
echo [3/4] Installation des dependances et build...
ssh -i %USERPROFILE%\.ssh\id_rsa_lws lwsuser@180.149.198.89 "cd /home/lwsuser/ecom && npm install && npm run build"

if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Le build a echoue
    pause
    exit /b 1
)

echo.
echo [4/4] Redemarrage du serveur...
ssh -i %USERPROFILE%\.ssh\id_rsa_lws lwsuser@180.149.198.89 "pm2 restart ecom"

if %ERRORLEVEL% NEQ 0 (
    echo ERREUR: Impossible de redemarrer le serveur
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOIEMENT REUSSI !
echo ========================================
echo.
echo Facebook Pixel est maintenant actif sur:
echo http://lasuitechic.online
echo.
echo Verifiez dans Facebook Events Manager dans 15-30 minutes
echo pour voir les evenements enregistres.
echo.
pause
