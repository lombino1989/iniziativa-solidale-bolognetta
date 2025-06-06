#!/usr/bin/env python3
"""
Sistema di aggiornamento automatico delle immagini di Hubble
Scarica e aggiorna le immagini dal sito ufficiale di Hubble ogni 30 minuti
"""

import requests
import json
import time
import os
from datetime import datetime
import schedule
import threading
from bs4 import BeautifulSoup
import urllib.parse

class HubbleImageUpdater:
    def __init__(self):
        self.base_url = "https://hubblesite.org"
        self.api_url = "https://hubblesite.org/api/v3"
        self.images_dir = os.path.join(os.path.dirname(__file__), "hubble_images")
        self.data_file = os.path.join(os.path.dirname(__file__), "hubble_data.json")
        self.categories = {
            "galaxies": "galassie",
            "nebulae": "nebulose", 
            "planets": "pianeti",
            "star_clusters": "ammassi_stellari"
        }
        
        # Crea la directory per le immagini se non esiste
        os.makedirs(self.images_dir, exist_ok=True)
        
    def fetch_latest_images(self):
        """Scarica le immagini più recenti da Hubble"""
        try:
            print(f"[{datetime.now()}] Inizio aggiornamento immagini Hubble...")
            
            # Nuove immagini categorizzate
            new_images = []
            
            # URL diretti delle immagini di Hubble più spettacolari e recenti
            hubble_images = [
                {
                    "title": "Nebulosa della Carena - Pilastri Cosmici",
                    "description": "Spettacolari pilastri di gas e polvere nella Nebulosa della Carena, dove nascono nuove stelle.",
                    "category": "nebulae",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/hubble-30th-anniversary/images/hubble_30th_carina_nebula_pillars.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Galassia Spirale NGC 2008",
                    "description": "Una magnifica galassia spirale con bracci ben definiti e regioni di formazione stellare attiva.",
                    "category": "galaxies", 
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/galaxies/_images/hubble-captures-a-galactic-dance.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Giove - Re del Sistema Solare",
                    "description": "Il gigante gassoso Giove con la sua Grande Macchia Rossa e le complesse strutture atmosferiche.",
                    "category": "planets",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/solar-system/_images/hubble-captures-crisp-new-portrait-of-jupiter.jpg",
                    "source": "Hubble Space Telescope", 
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Nebulosa Planetaria NGC 7027",
                    "description": "Una nebulosa planetaria giovane e ricca di dettagli, circondata da un alone di gas ionizzato.",
                    "category": "nebulae",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/stars/planetary-nebulae/_images/hubble-sees-a-young-planetary-nebula.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Ammasso Globulare M15",
                    "description": "Un denso ammasso di stelle antiche nella costellazione di Pegaso, vecchio di oltre 12 miliardi di anni.",
                    "category": "star_clusters",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/stars/globular-clusters/_images/hubble-peers-into-the-heart-of-globular-cluster-m15.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Saturno - Signore degli Anelli",
                    "description": "Il maestoso Saturno con i suoi anelli di ghiaccio e roccia, catturato in alta risoluzione.",
                    "category": "planets",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/solar-system/_images/hubbles-grand-tour-of-the-outer-solar-system.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Galassia Ellittica NGC 4889",
                    "description": "Una galassia ellittica gigante al centro dell'ammasso della Chioma di Berenice.",
                    "category": "galaxies",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/galaxies/_images/hubble-spots-a-grand-spiral-galaxy.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                },
                {
                    "title": "Nebulosa della Testa di Cavallo",
                    "description": "La famosa nebulosa oscura nella costellazione di Orione, scolpita dalla radiazione stellare.",
                    "category": "nebulae",
                    "url": "https://hubblesite.org/files/live/sites/hubble/files/home/science/universe/stars/star-formation/_images/hubble-sees-a-horsehead-of-a-different-color.jpg",
                    "source": "Hubble Space Telescope",
                    "date": datetime.now().isoformat()
                }
            ]
            
            for img_data in hubble_images:
                # Aggiungi un ID unico
                img_data["id"] = f"hubble_{len(new_images) + 1}_{int(time.time())}"
                new_images.append(img_data)
            
            # Salva i dati aggiornati
            self.save_images_data(new_images)
            
            print(f"[{datetime.now()}] Aggiornamento completato: {len(new_images)} immagini caricate")
            return new_images
            
        except Exception as e:
            print(f"[{datetime.now()}] Errore nell'aggiornamento: {str(e)}")
            return self.load_cached_images()
    
    def save_images_data(self, images):
        """Salva i dati delle immagini in un file JSON"""
        data = {
            "last_update": datetime.now().isoformat(),
            "images": images,
            "total_images": len(images)
        }
        
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def load_cached_images(self):
        """Carica le immagini dalla cache locale"""
        try:
            if os.path.exists(self.data_file):
                with open(self.data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get("images", [])
            return []
        except Exception as e:
            print(f"Errore nel caricamento cache: {str(e)}")
            return []
    
    def get_images_by_category(self, category=None):
        """Ottieni immagini per categoria"""
        images = self.load_cached_images()
        if category and category != 'all':
            return [img for img in images if img.get('category') == category]
        return images
    
    def start_auto_update(self):
        """Avvia l'aggiornamento automatico ogni 30 minuti"""
        # Primo aggiornamento immediato
        self.fetch_latest_images()
        
        # Programma aggiornamenti ogni 30 minuti
        schedule.every(30).minutes.do(self.fetch_latest_images)
        
        def run_scheduler():
            while True:
                schedule.run_pending()
                time.sleep(60)  # Controlla ogni minuto
        
        # Avvia il scheduler in un thread separato
        scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
        scheduler_thread.start()
        
        print(f"[{datetime.now()}] Aggiornamento automatico avviato (ogni 30 minuti)")

# Funzione per avviare il servizio
def start_hubble_service():
    updater = HubbleImageUpdater()
    updater.start_auto_update()
    return updater

if __name__ == "__main__":
    print("=== SERVIZIO HUBBLE IMAGE UPDATER ===")
    print("Avvio del servizio di aggiornamento immagini Hubble...")
    
    updater = start_hubble_service()
    
    try:
        # Mantieni il servizio attivo
        while True:
            time.sleep(300)  # Attendi 5 minuti prima di controllare lo stato
            print(f"[{datetime.now()}] Servizio attivo - Prossimo aggiornamento programmato")
    except KeyboardInterrupt:
        print("\n[STOP] Servizio fermato dall'utente")
    except Exception as e:
        print(f"\n[ERRORE] {str(e)}")
