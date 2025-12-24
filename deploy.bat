@echo off
echo ========================================
echo   Deploiement Fashion E-commerce
echo ========================================
echo.

REM Configuration - MODIFIEZ CES VALEURS
set VPS_USER=root
set VPS_HOST=lasuitechic.online
set VPS_PROJECT_PATH=/var/www/lasuitechic
set VPS_PORT=22

echo [INFO] Verification des modifications locales...
git status --short > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERREUR] Vous n'etes pas dans un depot Git!
    pause
    exit /b 1
)

echo.
echo [INFO] Dernier commit:
git log -1 --oneline
echo.

set /p CONFIRM="Deployer sur %VPS_HOST%? (O/N): "
if /i not "%CONFIRM%"=="O" if /i not "%CONFIRM%"=="o" (
    echo Deploiement annule.
    pause
    exit /b 0
)

echo.
echo [INFO] Connexion au VPS et deploiement...
echo.

ssh -p %VPS_PORT% %VPS_USER%@%VPS_HOST% "cd %VPS_PROJECT_PATH% && git pull origin main && npm install --production && npm run build && pm2 restart fashion-ecommerce"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Deploiement reussi!
    echo.
    echo Site mis a jour sur: http://%VPS_HOST%
) else (
    echo.
    echo [ERREUR] Echec du deploiement!
)

echo.
pause
