#!/usr/bin/env python3
"""
Server web semplice per servire le immagini di Hubble aggiornate
"""

import http.server
import socketserver
import json
import os
from urllib.parse import urlparse, parse_qs
from hubble_api import start_hubble_service
import threading
import time

class HubbleRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Inizializza il servizio Hubble se non è già stato fatto
        if not hasattr(HubbleRequestHandler, 'hubble_updater'):
            HubbleRequestHandler.hubble_updater = start_hubble_service()
        super().__init__(*args, **kwargs)

    def do_GET(self):
        parsed_path = urlparse(self.path)
        
        if parsed_path.path == '/api/hubble/images':
            self.handle_api_request(parsed_path)
        elif parsed_path.path == '/api/hubble/status':
            self.handle_status_request()
        else:
            # Servire file statici normalmente
            super().do_GET()
    
    def handle_api_request(self, parsed_path):
        """Gestisce le richieste API per le immagini"""
        try:
            # Parsing dei parametri query
            query_params = parse_qs(parsed_path.query)
            category = query_params.get('category', [None])[0]
            
            # Ottieni le immagini dal servizio Hubble
            images = self.hubble_updater.get_images_by_category(category)
            
            # Prepara la risposta
            response_data = {
                "success": True,
                "last_update": self.get_last_update_time(),
                "total_images": len(images),
                "category": category or "all",
                "images": images
            }
            
            # Invia la risposta JSON
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')  # CORS
            self.end_headers()
            
            json_response = json.dumps(response_data, ensure_ascii=False, indent=2)
            self.wfile.write(json_response.encode('utf-8'))
            
        except Exception as e:
            self.send_error_response(f"Errore nel caricamento immagini: {str(e)}")
    
    def handle_status_request(self):
        """Gestisce le richieste di stato del servizio"""
        try:
            status_data = {
                "service": "Hubble Image Updater",
                "status": "active",
                "last_update": self.get_last_update_time(),
                "next_update": "30 minuti",
                "total_cached_images": len(self.hubble_updater.load_cached_images())
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            json_response = json.dumps(status_data, ensure_ascii=False, indent=2)
            self.wfile.write(json_response.encode('utf-8'))
            
        except Exception as e:
            self.send_error_response(f"Errore nello stato del servizio: {str(e)}")
    
    def get_last_update_time(self):
        """Ottieni il timestamp dell'ultimo aggiornamento"""
        try:
            data_file = os.path.join(os.path.dirname(__file__), "hubble_data.json")
            if os.path.exists(data_file):
                with open(data_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    return data.get("last_update", "Mai aggiornato")
            return "Nessun dato disponibile"
        except:
            return "Errore nel recupero timestamp"
    
    def send_error_response(self, error_message):
        """Invia una risposta di errore JSON"""
        error_data = {
            "success": False,
            "error": error_message,
            "timestamp": time.time()
        }
        
        self.send_response(500)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        json_response = json.dumps(error_data, ensure_ascii=False, indent=2)
        self.wfile.write(json_response.encode('utf-8'))

def start_server(port=8000):
    """Avvia il server web"""
    try:
        with socketserver.TCPServer(("", port), HubbleRequestHandler) as httpd:
            print(f"=== SERVER HUBBLE AVVIATO ===")
            print(f"Porta: {port}")
            print(f"URL Base: http://localhost:{port}")
            print(f"API Immagini: http://localhost:{port}/api/hubble/images")
            print(f"API Status: http://localhost:{port}/api/hubble/status")
            print("Premere Ctrl+C per fermare il server")
            print("=" * 40)
            
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n[STOP] Server fermato dall'utente")
    except Exception as e:
        print(f"[ERRORE] Impossibile avviare il server: {str(e)}")

if __name__ == "__main__":
    import sys
    
    # Porta di default
    port = 8000
    
    # Se specificata una porta come argomento
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("Porta non valida, uso la porta 8000")
    
    start_server(port)
