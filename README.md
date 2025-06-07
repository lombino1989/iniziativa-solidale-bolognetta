# 🌟 Volontari del Cuore Bolognetta

Sito web ufficiale dell'iniziativa di volontariato "Volontari del Cuore Bolognetta" - Un progetto dedicato al supporto sociale e alla condivisione delle meraviglie dell'astronomia con persone con fragilità.

## 🚀 Sito Live
**👀 Visita il sito:** [https://lombino1989.github.io/iniziativa-solidale-bolognetta/](https://lombino1989.github.io/iniziativa-solidale-bolognetta/)

Il sito include una sezione astronomica speciale con immagini reali dal telescopio spaziale Hubble per portare le meraviglie dell'universo nelle case di cura.

## 🌟 Caratteristiche

- **Sito Web Responsive**: Design moderno e professionale
- **Sezione Astronomia**: Immagini reali di Hubble che si aggiornano ogni 30 minuti
- **Filtri Dinamici**: Visualizza galassie, nebulose, pianeti e ammassi stellari
- **Aggiornamento Automatico**: Sistema backend che scarica le ultime immagini
- **Design Professionale**: Divise personalizzate in stile Misericordia

## 🚀 Installazione e Avvio

### 1. Installazione Dipendenze Python

```bash
# Installa le dipendenze Python
pip install -r requirements.txt
```

### 2. Avvio del Server Hubble (Opzionale)

Per immagini aggiornate automaticamente:

```bash
# Avvia il server con API Hubble
python hubble_server.py

# Oppure su una porta specifica
python hubble_server.py 8080
```

Il server sarà disponibile su `http://localhost:8000`

### 3. Apertura del Sito

Apri `index.html` nel browser o servilo tramite un web server:

```bash
# Metodo 1: Direttamente dal file
# Apri index.html nel browser

# Metodo 2: Server HTTP semplice
python -m http.server 3000
# Poi vai su http://localhost:3000

# Metodo 3: Con il server Hubble integrato
python hubble_server.py
# Il sito sarà su http://localhost:8000
```

## 📡 API Endpoints

Quando il server Hubble è attivo:

- `GET /api/hubble/images` - Ottieni tutte le immagini
- `GET /api/hubble/images?category=galaxies` - Filtra per categoria
- `GET /api/hubble/status` - Stato del servizio

## 🎯 Struttura del Progetto

```
volontari-cuore-website/
├── index.html              # Pagina principale
├── css/
│   └── styles.css          # Stili CSS
├── js/
│   └── script.js           # JavaScript principale
├── images/                 # Immagini delle divise
├── hubble_api.py          # API per immagini Hubble
├── hubble_server.py       # Server web integrato
├── requirements.txt       # Dipendenze Python
└── README.md             # Questo file
```

## 🌌 Sezione Astronomia

La sezione astronomia include:

- **Aggiornamento Automatico**: Ogni 30 minuti
- **Immagini Reali**: Dal telescopio spaziale Hubble
- **Categorie**:
  - 🌌 Galassie
  - 🌠 Nebulose  
  - 🪐 Pianeti
  - ⭐ Ammassi Stellari
- **Fallback**: Se l'API non è disponibile, usa immagini statiche

## 🛠️ Configurazione

### Personalizzazione

1. **Nome Organizzazione**: Modifica in `index.html`
2. **Colori**: Aggiorna le variabili CSS in `styles.css`
3. **Immagini Divise**: Sostituisci i file nella cartella `images/`

### Aggiornamento Immagini

Il sistema scarica automaticamente nuove immagini, ma puoi anche:

```python
# Aggiornamento manuale
from hubble_api import HubbleImageUpdater
updater = HubbleImageUpdater()
updater.fetch_latest_images()
```

## 🎨 Divise Personalizzate

Il sito include immagini delle divise personalizzate:

- **Divisa Estiva**: Polo gialla fluorescente
- **Divisa Invernale**: Giacca imbottita
- **Gilet Alta Visibilità**: Per servizi esterni
- **Pantaloni Tecnici**: Coordinati con le divise

## 📱 Responsive Design

Il sito si adatta automaticamente a:
- 💻 Desktop
- 📱 Mobile
- 📟 Tablet

## 🔧 Risoluzione Problemi

### Server Non Si Avvia
- Verifica che la porta sia libera
- Controlla le dipendenze Python

### Immagini Non Si Caricano
- Il sito funziona anche senza server (immagini statiche)
- Controlla la connessione internet
- Verifica i CORS del browser

### Aggiornamento Non Funziona
- Riavvia il server Hubble
- Controlla i log di Python

## 📄 Licenza

Progetto per uso educativo e sociale dell'iniziativa "Volontari del Cuore Bolognetta".

## 📞 Contatti

**Giulio Francesco Lombino**  
📧 Email: [telecronaca1989@gmail.com](mailto:telecronaca1989@gmail.com)  
📱 WhatsApp: [+39 380 389 9860](https://wa.me/393803899860)  
☎️ Telefono: [091 873 7047](tel:+390918737047)  

## 🤝 Contributi

Per modifiche o miglioramenti, contatta Giulio Francesco Lombino utilizzando i contatti sopra.

---

**Creato con ❤️ per portare le meraviglie dell'universo nelle case di cura**
