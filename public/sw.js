// ========================================
// MANUS AI ULTRA - SERVICE WORKER
// ========================================

const CACHE_NAME = 'manus-ai-ultra-v1.0.0';
const OFFLINE_PAGE = '/offline.html';

// Risorse da cachare immediatamente
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/images/logo.png',
  '/images/manus-avatar.png'
];

// Pattern di risorse da cachare durante la navigazione
const RUNTIME_CACHE_PATTERNS = [
  /\/assets\/.+\.(js|css|woff2?|ttf|eot)$/,
  /\/images\/.+\.(png|jpg|jpeg|gif|webp|svg)$/,
  /\/api\/.*$/
];

// Risorse che non devono essere cachate
const EXCLUDED_PATTERNS = [
  /\/admin\//,
  /\?.*no-cache/,
  /\/sw\.js$/
];

// Event: Install
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching precache resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// Event: Activate
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Cleanup old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated successfully');
    })
  );
});

// Event: Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { method, url } = request;
  
  // Solo gestire richieste GET
  if (method !== 'GET') return;
  
  // Escludere pattern non cachabili
  if (EXCLUDED_PATTERNS.some(pattern => pattern.test(url))) {
    return;
  }
  
  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {\n    // Strategia Cache First per risorse statiche\n    if (shouldCacheFirst(request)) {\n      return await cacheFirst(request);\n    }\n    \n    // Strategia Network First per contenuti dinamici\n    if (shouldNetworkFirst(request)) {\n      return await networkFirst(request);\n    }\n    \n    // Strategia Stale While Revalidate per il resto\n    return await staleWhileRevalidate(request);\n    \n  } catch (error) {\n    console.error('Fetch failed:', error);\n    \n    // Fallback per navigazione offline\n    if (request.mode === 'navigate') {\n      const cachedResponse = await caches.match('/');\n      if (cachedResponse) {\n        return cachedResponse;\n      }\n      \n      // Ultima risorsa: pagina offline\n      return await caches.match(OFFLINE_PAGE) || new Response(\n        createOfflinePage(),\n        { headers: { 'Content-Type': 'text/html' } }\n      );\n    }\n    \n    throw error;\n  }\n}\n\nfunction shouldCacheFirst(request) {\n  const url = request.url;\n  return RUNTIME_CACHE_PATTERNS.some(pattern => pattern.test(url)) ||\n         url.includes('/assets/') ||\n         url.includes('/images/');\n}\n\nfunction shouldNetworkFirst(request) {\n  const url = request.url;\n  return url.includes('/api/') ||\n         url.includes('?') && url.includes('timestamp=');\n}\n\nasync function cacheFirst(request) {\n  const cachedResponse = await caches.match(request);\n  \n  if (cachedResponse) {\n    return cachedResponse;\n  }\n  \n  const networkResponse = await fetch(request);\n  \n  if (networkResponse.ok) {\n    const cache = await caches.open(CACHE_NAME);\n    cache.put(request, networkResponse.clone());\n  }\n  \n  return networkResponse;\n}\n\nasync function networkFirst(request) {\n  try {\n    const networkResponse = await fetch(request);\n    \n    if (networkResponse.ok) {\n      const cache = await caches.open(CACHE_NAME);\n      cache.put(request, networkResponse.clone());\n    }\n    \n    return networkResponse;\n  } catch (error) {\n    const cachedResponse = await caches.match(request);\n    if (cachedResponse) {\n      return cachedResponse;\n    }\n    throw error;\n  }\n}\n\nasync function staleWhileRevalidate(request) {\n  const cachedResponse = await caches.match(request);\n  \n  const networkPromise = fetch(request).then(async (networkResponse) => {\n    if (networkResponse.ok) {\n      const cache = await caches.open(CACHE_NAME);\n      cache.put(request, networkResponse.clone());\n    }\n    return networkResponse;\n  }).catch(() => {});\n  \n  return cachedResponse || await networkPromise;\n}\n\n// Gestione messaggi dal client\nself.addEventListener('message', (event) => {\n  const { type, payload } = event.data;\n  \n  switch (type) {\n    case 'SKIP_WAITING':\n      self.skipWaiting();\n      break;\n      \n    case 'CACHE_TOOL_DATA':\n      cacheToolData(payload);\n      break;\n      \n    case 'GET_CACHE_STATUS':\n      getCacheStatus().then(status => {\n        event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: status });\n      });\n      break;\n      \n    case 'CLEAR_CACHE':\n      clearAppCache().then(() => {\n        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });\n      });\n      break;\n  }\n});\n\nasync function cacheToolData(data) {\n  try {\n    const cache = await caches.open(CACHE_NAME);\n    const response = new Response(JSON.stringify(data), {\n      headers: { 'Content-Type': 'application/json' }\n    });\n    await cache.put(`/tool-data/${data.toolId}`, response);\n  } catch (error) {\n    console.error('Error caching tool data:', error);\n  }\n}\n\nasync function getCacheStatus() {\n  try {\n    const cache = await caches.open(CACHE_NAME);\n    const keys = await cache.keys();\n    \n    const status = {\n      isOnline: navigator.onLine,\n      cacheSize: keys.length,\n      lastUpdated: Date.now(),\n      version: CACHE_NAME\n    };\n    \n    return status;\n  } catch (error) {\n    return { error: error.message };\n  }\n}\n\nasync function clearAppCache() {\n  try {\n    const cacheNames = await caches.keys();\n    await Promise.all(\n      cacheNames.map(cacheName => caches.delete(cacheName))\n    );\n    console.log('🗑️ All caches cleared');\n  } catch (error) {\n    console.error('Error clearing cache:', error);\n  }\n}\n\n// Gestione notifiche push (per future implementazioni)\nself.addEventListener('push', (event) => {\n  if (!event.data) return;\n  \n  const options = {\n    body: event.data.text() || 'Nuova notifica da Manus AI',\n    icon: '/images/logo.png',\n    badge: '/images/badge.png',\n    vibrate: [100, 50, 100],\n    data: {\n      dateOfArrival: Date.now(),\n      primaryKey: 1\n    },\n    actions: [\n      {\n        action: 'open',\n        title: 'Apri App',\n        icon: '/images/open.png'\n      },\n      {\n        action: 'close',\n        title: 'Chiudi',\n        icon: '/images/close.png'\n      }\n    ]\n  };\n  \n  event.waitUntil(\n    self.registration.showNotification('Manus AI Ultra', options)\n  );\n});\n\n// Gestione click notifiche\nself.addEventListener('notificationclick', (event) => {\n  event.notification.close();\n  \n  if (event.action === 'open') {\n    event.waitUntil(\n      clients.openWindow('/')\n    );\n  }\n});\n\n// Sincronizzazione in background\nself.addEventListener('sync', (event) => {\n  if (event.tag === 'background-sync') {\n    event.waitUntil(doBackgroundSync());\n  }\n});\n\nasync function doBackgroundSync() {\n  try {\n    // Sincronizza dati tool\n    console.log('🔄 Background sync started');\n    \n    // Qui puoi implementare logica di sincronizzazione\n    // come salvare dati offline, sincronizzare preferenze, ecc.\n    \n    console.log('✅ Background sync completed');\n  } catch (error) {\n    console.error('❌ Background sync failed:', error);\n  }\n}\n\n// Funzione per creare pagina offline dinamica\nfunction createOfflinePage() {\n  return `\n    <!DOCTYPE html>\n    <html lang=\"it\">\n    <head>\n      <meta charset=\"UTF-8\">\n      <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n      <title>Manus AI Ultra - Offline</title>\n      <style>\n        * {\n          margin: 0;\n          padding: 0;\n          box-sizing: border-box;\n        }\n        \n        body {\n          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n          color: white;\n          height: 100vh;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          text-align: center;\n        }\n        \n        .container {\n          max-width: 500px;\n          padding: 2rem;\n        }\n        \n        .logo {\n          font-size: 3rem;\n          margin-bottom: 1rem;\n        }\n        \n        h1 {\n          font-size: 2rem;\n          margin-bottom: 1rem;\n          font-weight: 600;\n        }\n        \n        p {\n          font-size: 1.1rem;\n          opacity: 0.9;\n          margin-bottom: 2rem;\n          line-height: 1.6;\n        }\n        \n        .features {\n          background: rgba(255, 255, 255, 0.1);\n          border-radius: 10px;\n          padding: 1.5rem;\n          margin-bottom: 2rem;\n        }\n        \n        .feature {\n          margin-bottom: 0.5rem;\n          font-size: 0.95rem;\n        }\n        \n        .retry-btn {\n          background: rgba(255, 255, 255, 0.2);\n          border: 2px solid rgba(255, 255, 255, 0.3);\n          color: white;\n          padding: 0.75rem 1.5rem;\n          border-radius: 25px;\n          font-size: 1rem;\n          cursor: pointer;\n          transition: all 0.3s ease;\n          text-decoration: none;\n          display: inline-block;\n        }\n        \n        .retry-btn:hover {\n          background: rgba(255, 255, 255, 0.3);\n          transform: translateY(-2px);\n        }\n      </style>\n    </head>\n    <body>\n      <div class=\"container\">\n        <div class=\"logo\">🤖</div>\n        <h1>Manus AI Ultra</h1>\n        <p>Sei attualmente offline, ma molte funzionalità sono ancora disponibili!</p>\n        \n        <div class=\"features\">\n          <div class=\"feature\">✅ Convertitore unità completamente funzionale</div>\n          <div class=\"feature\">✅ Generatore QR code offline</div>\n          <div class=\"feature\">✅ Color picker avanzato</div>\n          <div class=\"feature\">✅ JSON formatter e validator</div>\n          <div class=\"feature\">✅ Password generator sicuro</div>\n          <div class=\"feature\">✅ Tutte le tue impostazioni salvate</div>\n        </div>\n        \n        <a href=\"/\" class=\"retry-btn\" onclick=\"window.location.reload()\">\n          🔄 Riprova Connessione\n        </a>\n        \n        <p style=\"margin-top: 1rem; font-size: 0.9rem; opacity: 0.7;\">\n          Manus AI Ultra funziona offline grazie alla tecnologia PWA\n        </p>\n      </div>\n      \n      <script>\n        // Auto-refresh quando torna online\n        window.addEventListener('online', () => {\n          window.location.reload();\n        });\n        \n        // Mostra stato connessione\n        function updateConnectionStatus() {\n          if (navigator.onLine) {\n            window.location.reload();\n          }\n        }\n        \n        setInterval(updateConnectionStatus, 5000);\n      </script>\n    </body>\n    </html>\n  `;\n}\n\n// Log startup\nconsole.log('🚀 Manus AI Ultra Service Worker loaded');\nconsole.log('📋 Cache version:', CACHE_NAME);\nconsole.log('🌐 Online status:', navigator.onLine);\n\n// Performance monitoring\nconst performanceObserver = new PerformanceObserver((list) => {\n  list.getEntries().forEach((entry) => {\n    if (entry.entryType === 'navigation') {\n      console.log('📊 Navigation timing:', {\n        loadTime: entry.loadEventEnd - entry.loadEventStart,\n        domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,\n        firstPaint: entry.responseEnd - entry.requestStart\n      });\n    }\n  });\n});\n\nperformanceObserver.observe({ entryTypes: ['navigation'] });\n\n// Gestione errori\nself.addEventListener('error', (event) => {\n  console.error('🚨 Service Worker error:', event.error);\n});\n\nself.addEventListener('unhandledrejection', (event) => {\n  console.error('🚨 Unhandled promise rejection in SW:', event.reason);\n});
