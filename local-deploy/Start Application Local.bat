@echo off
title TrackYourProject - Local Starter
cd /d "%~dp0"

echo.
echo   ============================================
echo        TrackYourProject - Lokaler Start
echo   ============================================
echo.

:: Check if Docker is installed
where docker >nul 2>&1
if errorlevel 1 (
    echo   [FEHLER] Docker ist nicht installiert!
    echo.
    echo   Bitte lade Docker Desktop herunter und installiere es:
    echo   https://www.docker.com/products/docker-desktop/
    echo.
    echo   Nach der Installation: Docker Desktop starten,
    echo   warten bis es bereit ist, dann dieses Script
    echo   erneut ausfuehren.
    echo.
    pause
    exit /b 1
)

:: Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo   [FEHLER] Docker ist installiert aber nicht gestartet!
    echo.
    echo   Bitte starte Docker Desktop und warte bis es
    echo   bereit ist, dann versuche es erneut.
    echo.
    pause
    exit /b 1
)

:: Check if tar files exist or if we need to build from source
if exist frontend.tar if exist backend.tar if exist db.tar goto :load_images

echo   Keine .tar-Dateien gefunden.
echo   Images werden aus dem Quellcode gebaut...
echo   (Das kann beim ersten Mal einige Minuten dauern)
echo.

echo   [1/6] Baue Frontend-Image aus Quellcode...
echo          (Angular Build + Nginx)
docker build -t trackyourproject-frontend -f ..\docker\frontend\Dockerfile ..
if errorlevel 1 (
    echo.
    echo   [FEHLER] Frontend-Build fehlgeschlagen!
    pause
    exit /b 1
)
echo          Fertig.
echo.

echo   [2/6] Baue Backend-Image aus Quellcode...
echo          (PHP + Apache)
docker build -t trackyourproject-backend -f ..\docker\backend\Dockerfile ..
if errorlevel 1 (
    echo.
    echo   [FEHLER] Backend-Build fehlgeschlagen!
    pause
    exit /b 1
)
echo          Fertig.
echo.

echo   [3/6] Lade Datenbank-Image von Docker Hub...
docker pull mysql:8.0
echo          Fertig.
echo.

goto :start_containers

:load_images
echo   .tar-Dateien gefunden. Lade gespeicherte Images...
echo.

echo   [1/6] Lade Frontend-Image...
docker load -i frontend.tar
echo          Fertig.
echo.

echo   [2/6] Lade Backend-Image...
docker load -i backend.tar
echo          Fertig.
echo.

echo   [3/6] Lade Datenbank-Image...
docker load -i db.tar
echo          Fertig.
echo.

:start_containers
echo   [4/6] Raeume alte Container auf...
docker compose down 2>nul
docker rm -f trackyourproject-db trackyourproject-backend trackyourproject-frontend 2>nul
echo          Fertig.
echo.

echo   [5/6] Starte alle Container...
docker compose up -d
echo.

echo   [6/6] Warte bis Datenbank bereit ist...
echo          (Das kann bis zu 30 Sekunden dauern)
:wait_loop
docker inspect --format="{{.State.Health.Status}}" trackyourproject-db 2>nul | findstr "healthy" >nul
if errorlevel 1 (
    <nul set /p =.
    timeout /t 2 /nobreak >nul
    goto wait_loop
)
echo.
echo          Datenbank ist bereit!
echo.

echo   ============================================
echo.
echo      Anwendung laeuft erfolgreich!
echo.
echo      Oeffne im Browser:
echo      http://localhost/Login
echo.
echo   ============================================
echo.
echo   Druecke eine beliebige Taste um die
echo   Container zu STOPPEN und zu beenden...
pause >nul

echo.
echo   Stoppe Container...
docker compose down
echo.
echo   Alle Container gestoppt. Auf Wiedersehen!
timeout /t 3 >nul
