#!/bin/bash

# Script di avvio per il sito Volontari del Cuore Bolognetta
# Con supporto per la sezione astronomica Hubble

echo "=== VOLONTARI DEL CUORE BOLOGNETTA ==="
echo "Avvio del sito web con sezione astronomica"
echo "========================================"

# Controlla se Python è installato
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 non trovato. Installalo prima di continuare."
    exit 1
fi

# Controlla se pip è installato
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 non trovato. Installalo prima di continuare."
    exit 1
fi

echo "✅ Python3 e pip3 trovati"

# Installa le dipendenze se necessario
echo "📦 Controllo dipendenze..."
pip3 install -r requirements.txt --quiet

if [ $? -eq 0 ]; then
    echo "✅ Dipendenze installate correttamente"
else
    echo "⚠️ Errore nell'installazione delle dipendenze"
    echo "Procedo comunque con il sito base..."
fi

# Parametri
PORT=${1:-8000}
MODE=${2:-"full"}

echo ""
echo "🚀 Avvio del sito..."
echo "Porta: $PORT"

if [ "$MODE" = "simple" ]; then
    echo "Modalità: Solo sito web (senza aggiornamenti Hubble)"
    echo ""
    echo "🌍 Sito disponibile su: http://localhost:$PORT"
    echo "Premi Ctrl+C per fermare"
    echo ""
    python3 -m http.server $PORT
else
    echo "Modalità: Completa (con aggiornamenti Hubble ogni 30 minuti)"
    echo ""
    echo "🌍 Sito disponibile su: http://localhost:$PORT"
    echo "🛰️ API Hubble su: http://localhost:$PORT/api/hubble/images"
    echo "📊 Status API: http://localhost:$PORT/api/hubble/status"
    echo ""
    echo "Premi Ctrl+C per fermare"
    echo ""
    python3 hubble_server.py $PORT
fi
