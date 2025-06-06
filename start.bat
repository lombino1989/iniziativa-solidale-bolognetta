@echo off
title Volontari del Cuore Bolognetta - Sito Web

echo === VOLONTARI DEL CUORE BOLOGNETTA ===
echo Avvio del sito web con sezione astronomica
echo ========================================

REM Controlla se Python è installato
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non trovato. Installalo prima di continuare.
    pause
    exit /b 1
)

echo ✅ Python trovato

REM Installa le dipendenze
echo 📦 Installazione dipendenze...
pip install -r requirements.txt >nul 2>&1

if %errorlevel% equ 0 (
    echo ✅ Dipendenze installate correttamente
) else (
    echo ⚠️ Errore nell'installazione delle dipendenze
    echo Procedo comunque con il sito base...
)

REM Parametri di default
set PORT=8000
if not "%1"=="" set PORT=%1

set MODE=full
if not "%2"=="" set MODE=%2

echo.
echo 🚀 Avvio del sito...
echo Porta: %PORT%

if "%MODE%"=="simple" (
    echo Modalità: Solo sito web ^(senza aggiornamenti Hubble^)
    echo.
    echo 🌍 Sito disponibile su: http://localhost:%PORT%
    echo Premi Ctrl+C per fermare
    echo.
    python -m http.server %PORT%
) else (
    echo Modalità: Completa ^(con aggiornamenti Hubble ogni 30 minuti^)
    echo.
    echo 🌍 Sito disponibile su: http://localhost:%PORT%
    echo 🛰️ API Hubble su: http://localhost:%PORT%/api/hubble/images
    echo 📊 Status API: http://localhost:%PORT%/api/hubble/status
    echo.
    echo Premi Ctrl+C per fermare
    echo.
    python hubble_server.py %PORT%
)

pause
