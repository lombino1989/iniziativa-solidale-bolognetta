# Deployment su GitHub Pages

Guida per pubblicare il sito su GitHub Pages all'indirizzo: 
`https://lombino1989.github.io/iniziativa-solidale-bolognetta/`

## 🚀 Passi per il Deployment

### 1. Preparazione Repository

```bash
# 1. Vai nella directory del sito
cd volontari-cuore-website

# 2. Inizializza Git (se non già fatto)
git init

# 3. Aggiungi il remote del repository GitHub
git remote add origin https://github.com/lombino1989/iniziativa-solidale-bolognetta.git

# 4. Configura il branch principale
git branch -M main
```

### 2. Upload dei File

```bash
# 1. Aggiungi tutti i file
git add .

# 2. Commit iniziale
git commit -m "🌟 Sito Volontari del Cuore Bolognetta con sezione astronomia"

# 3. Push al repository
git push -u origin main
```

### 3. Attivazione GitHub Pages

1. Vai su: https://github.com/lombino1989/iniziativa-solidale-bolognetta/settings/pages
2. Nella sezione "Source", seleziona "Deploy from a branch"
3. Seleziona il branch "main"
4. Seleziona la cartella "/ (root)"
5. Clicca "Save"

### 4. Verifica del Sito

Dopo qualche minuto, il sito sarà disponibile su:
`https://lombino1989.github.io/iniziativa-solidale-bolognetta/`

## 📁 File Necessari per GitHub Pages

I seguenti file sono già pronti per GitHub Pages:

- ✅ `index.html` - Pagina principale
- ✅ `css/styles.css` - Stili CSS
- ✅ `js/script.js` - JavaScript con fallback per immagini statiche
- ✅ `images/` - Tutte le immagini delle divise
- ✅ `README.md` - Documentazione

## ⚙️ Differenze GitHub Pages vs Server Locale

### Su GitHub Pages:
- ✅ Sito web completo funzionante
- ✅ Sezione astronomia con immagini statiche
- ❌ Aggiornamento automatico ogni 30 minuti (non supportato)
- ❌ API Python Hubble (non supportato)

### Con Server Locale:
- ✅ Sito web completo
- ✅ Sezione astronomia con immagini aggiornate
- ✅ Aggiornamento automatico ogni 30 minuti
- ✅ API Python Hubble attiva

## 🔧 Personalizzazione per GitHub Pages

Il JavaScript è già configurato per funzionare in entrambi i modi:
1. **Con API locale** - Se il server Python è attivo
2. **Fallback statico** - Se l'API non è disponibile (come su GitHub Pages)

## 📝 Comandi Rapidi

```bash
# Upload modifiche
git add .
git commit -m "Aggiornamento sito"
git push

# Clona il repository (per nuovi computer)
git clone https://github.com/lombino1989/iniziativa-solidale-bolognetta.git
```

## 🌟 URL Finale

Una volta attivato, il sito sarà accessibile a:
**https://lombino1989.github.io/iniziativa-solidale-bolognetta/**

## 🎯 Note Aggiuntive

- GitHub Pages si aggiorna automaticamente quando fai push di nuovi commit
- Il sito può richiedere qualche minuto per aggiornare le modifiche
- Per domini personalizzati, puoi configurare un CNAME nella repository
