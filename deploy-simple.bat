@echo off
REM Script de deploiement simple pour Windows
REM Usage: double-cliquez sur ce fichier ou executez: deploy-simple.bat

title Deploiement La Suite Chic
color 0A

echo.
echo ========================================
echo   DEPLOIEMENT - LA SUITE CHIC
echo ========================================
echo.

REM Verifier si WSL est installe
wsl --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] WSL n'est pas installe sur votre systeme.
    echo.
    echo Pour deployer, vous avez 2 options:
    echo.
    echo Option 1: Installer WSL
    echo   1. Ouvrez PowerShell en administrateur
    echo   2. Executez: wsl --install
    echo   3. Redemarrez votre PC
    echo   4. Relancez ce script
    echo.
    echo Option 2: Deploiement manuel
    echo   Consultez GUIDE_DEPLOIEMENT_SIMPLE.md
    echo   Section "Deploiement Manuel sur VPS"
    echo.
    pause
    exit /b 1
)

echo [1/3] Verification de la connexion VPS...
wsl ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89 "echo OK" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Impossible de se connecter au VPS
    echo.
    echo Verifiez:
    echo - Votre connexion Internet
    echo - Que la cle SSH existe: C:\Users\%USERNAME%\.ssh\id_rsa_lws
    echo - Que vous pouvez vous connecter au VPS
    echo.
    pause
    exit /b 1
)
echo [OK] Connexion VPS etablie
echo.

echo [2/3] Build du projet...
call npm run build
if %errorlevel% neq 0 (
    echo [ERREUR] Le build a echoue
    echo.
    echo Verifiez les erreurs ci-dessus
    pause
    exit /b 1
)
echo [OK] Build reussi
echo.

echo [3/3] Deploiement sur le VPS...
echo Cela peut prendre quelques minutes...
echo.
wsl bash scripts/deploy-complete.sh
if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Le deploiement a echoue
    echo.
    echo Consultez les erreurs ci-dessus ou essayez le deploiement manuel
    echo Voir: GUIDE_DEPLOIEMENT_SIMPLE.md
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   DEPLOIEMENT TERMINE AVEC SUCCES!
echo ========================================
echo.
echo Votre site est accessible sur:
echo   - http://lasuitechic.online
echo   - http://180.149.198.89:3000
echo.
echo Pour voir les logs:
echo   wsl ssh -i ~/.ssh/id_rsa_lws lwsuser@180.149.198.89
echo   pm2 logs ecom
echo.
pause
