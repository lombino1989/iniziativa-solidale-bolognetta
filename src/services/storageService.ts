// ========================================
// MANUS AI ULTRA - STORAGE SERVICE
// ========================================

interface StorageItem {
  id: string;
  data: any;
  timestamp: number;
  expiresAt?: number;
}

interface DatabaseSchema {
  userPreferences: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    toolsLayout: 'grid' | 'list';
    windowSettings: {
      defaultSize: { width: number; height: number };
      enableAnimations: boolean;
      rememberPositions: boolean;
    };
  };
  toolsHistory: {
    toolId: string;
    data: any;
    action: string;
    timestamp: number;
  }[];
  favorites: {
    toolId: string;
    timestamp: number;
  }[];
  workspaces: {
    id: string;
    name: string;
    windows: any[];
    layout: string;
    createdAt: number;
    updatedAt: number;
  }[];
  cache: {
    [key: string]: {
      data: any;
      timestamp: number;
      expiresAt: number;
    };
  };
}

class ManusStorageService {
  private dbName = 'ManusAI_Ultra_DB';
  private version = 1;
  private db: IDBDatabase | null = null;

  // Store names
  private stores = {
    userPreferences: 'userPreferences',
    toolsHistory: 'toolsHistory',
    favorites: 'favorites',
    workspaces: 'workspaces',
    cache: 'cache'
  };

  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB non supportato, fallback a localStorage');
        resolve(false);
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Errore apertura database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ Database ManusAI inizializzato');
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // User Preferences Store
        if (!db.objectStoreNames.contains(this.stores.userPreferences)) {
          const prefsStore = db.createObjectStore(this.stores.userPreferences);
          prefsStore.put({
            theme: 'auto',
            language: 'it',
            toolsLayout: 'grid',
            windowSettings: {
              defaultSize: { width: 800, height: 600 },
              enableAnimations: true,
              rememberPositions: true
            }
          }, 'settings');
        }

        // Tools History Store
        if (!db.objectStoreNames.contains(this.stores.toolsHistory)) {
          const historyStore = db.createObjectStore(this.stores.toolsHistory, { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          historyStore.createIndex('toolId', 'toolId', { unique: false });
          historyStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Favorites Store
        if (!db.objectStoreNames.contains(this.stores.favorites)) {
          const favoritesStore = db.createObjectStore(this.stores.favorites, { 
            keyPath: 'toolId' 
          });
          favoritesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Workspaces Store
        if (!db.objectStoreNames.contains(this.stores.workspaces)) {
          const workspacesStore = db.createObjectStore(this.stores.workspaces, { 
            keyPath: 'id' 
          });
          workspacesStore.createIndex('name', 'name', { unique: false });
          workspacesStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        // Cache Store
        if (!db.objectStoreNames.contains(this.stores.cache)) {
          const cacheStore = db.createObjectStore(this.stores.cache, { 
            keyPath: 'key' 
          });
          cacheStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  // User Preferences
  async getUserPreferences(): Promise<DatabaseSchema['userPreferences']> {
    if (!this.db) {
      const fallback = localStorage.getItem('manus_preferences');
      return fallback ? JSON.parse(fallback) : this.getDefaultPreferences();
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.userPreferences], 'readonly');
      const store = transaction.objectStore(this.stores.userPreferences);
      const request = store.get('settings');

      request.onsuccess = () => {
        resolve(request.result || this.getDefaultPreferences());
      };

      request.onerror = () => {
        console.error('Errore lettura preferenze:', request.error);
        reject(request.error);
      };
    });
  }

  async saveUserPreferences(preferences: DatabaseSchema['userPreferences']): Promise<void> {
    if (!this.db) {
      localStorage.setItem('manus_preferences', JSON.stringify(preferences));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.userPreferences], 'readwrite');
      const store = transaction.objectStore(this.stores.userPreferences);
      const request = store.put(preferences, 'settings');

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Tools History
  async addToHistory(toolId: string, data: any, action: string): Promise<void> {
    const historyItem = {
      toolId,
      data,
      action,
      timestamp: Date.now()
    };

    if (!this.db) {
      const history = this.getFromLocalStorage('manus_tools_history', []);
      history.unshift(historyItem);
      localStorage.setItem('manus_tools_history', JSON.stringify(history.slice(0, 1000)));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.toolsHistory], 'readwrite');
      const store = transaction.objectStore(this.stores.toolsHistory);
      const request = store.add(historyItem);

      request.onsuccess = () => {
        // Mantieni solo le ultime 1000 voci
        this.cleanupHistory();
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getToolHistory(toolId: string, limit: number = 50): Promise<any[]> {
    if (!this.db) {
      const history = this.getFromLocalStorage('manus_tools_history', []);
      return history.filter((item: any) => item.toolId === toolId).slice(0, limit);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.toolsHistory], 'readonly');
      const store = transaction.objectStore(this.stores.toolsHistory);
      const index = store.index('toolId');
      const request = index.getAll(toolId);

      request.onsuccess = () => {
        const results = request.result
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Favorites
  async addToFavorites(toolId: string): Promise<void> {
    const favorite = {
      toolId,
      timestamp: Date.now()
    };

    if (!this.db) {
      const favorites = this.getFromLocalStorage('manus_favorites', []);
      if (!favorites.find((f: any) => f.toolId === toolId)) {
        favorites.push(favorite);
        localStorage.setItem('manus_favorites', JSON.stringify(favorites));
      }
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.favorites], 'readwrite');
      const store = transaction.objectStore(this.stores.favorites);
      const request = store.put(favorite);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async removeFromFavorites(toolId: string): Promise<void> {
    if (!this.db) {
      const favorites = this.getFromLocalStorage('manus_favorites', []);
      const filtered = favorites.filter((f: any) => f.toolId !== toolId);
      localStorage.setItem('manus_favorites', JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.favorites], 'readwrite');
      const store = transaction.objectStore(this.stores.favorites);
      const request = store.delete(toolId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getFavorites(): Promise<string[]> {
    if (!this.db) {
      const favorites = this.getFromLocalStorage('manus_favorites', []);
      return favorites.map((f: any) => f.toolId);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.favorites], 'readonly');
      const store = transaction.objectStore(this.stores.favorites);
      const request = store.getAll();

      request.onsuccess = () => {
        const favorites = request.result
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(f => f.toolId);
        resolve(favorites);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Workspaces
  async saveWorkspace(workspace: DatabaseSchema['workspaces'][0]): Promise<void> {
    workspace.updatedAt = Date.now();

    if (!this.db) {
      const workspaces = this.getFromLocalStorage('manus_workspaces', []);
      const existingIndex = workspaces.findIndex((w: any) => w.id === workspace.id);
      
      if (existingIndex >= 0) {
        workspaces[existingIndex] = workspace;
      } else {
        workspaces.push(workspace);
      }
      
      localStorage.setItem('manus_workspaces', JSON.stringify(workspaces));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.workspaces], 'readwrite');
      const store = transaction.objectStore(this.stores.workspaces);
      const request = store.put(workspace);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWorkspaces(): Promise<DatabaseSchema['workspaces']> {
    if (!this.db) {
      return this.getFromLocalStorage('manus_workspaces', []);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.workspaces], 'readonly');
      const store = transaction.objectStore(this.stores.workspaces);
      const request = store.getAll();

      request.onsuccess = () => {
        const workspaces = request.result.sort((a, b) => b.updatedAt - a.updatedAt);
        resolve(workspaces);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWorkspace(id: string): Promise<void> {
    if (!this.db) {
      const workspaces = this.getFromLocalStorage('manus_workspaces', []);
      const filtered = workspaces.filter((w: any) => w.id !== id);
      localStorage.setItem('manus_workspaces', JSON.stringify(filtered));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.workspaces], 'readwrite');
      const store = transaction.objectStore(this.stores.workspaces);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Cache
  async setCache(key: string, data: any, ttlMinutes: number = 60): Promise<void> {
    const cacheItem = {
      key,
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ttlMinutes * 60 * 1000)
    };

    if (!this.db) {
      const cache = this.getFromLocalStorage('manus_cache', {});
      cache[key] = cacheItem;
      localStorage.setItem('manus_cache', JSON.stringify(cache));
      return;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.cache], 'readwrite');
      const store = transaction.objectStore(this.stores.cache);
      const request = store.put(cacheItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCache(key: string): Promise<any | null> {
    if (!this.db) {
      const cache = this.getFromLocalStorage('manus_cache', {});
      const item = cache[key];
      
      if (!item) return null;
      if (item.expiresAt < Date.now()) {
        delete cache[key];
        localStorage.setItem('manus_cache', JSON.stringify(cache));
        return null;
      }
      
      return item.data;
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.stores.cache], 'readonly');
      const store = transaction.objectStore(this.stores.cache);
      const request = store.get(key);

      request.onsuccess = () => {
        const item = request.result;
        
        if (!item) {
          resolve(null);
          return;
        }
        
        if (item.expiresAt < Date.now()) {
          // Cache scaduta, rimuovi
          const deleteTransaction = this.db!.transaction([this.stores.cache], 'readwrite');
          const deleteStore = deleteTransaction.objectStore(this.stores.cache);
          deleteStore.delete(key);
          resolve(null);
          return;
        }
        
        resolve(item.data);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Utility Methods
  private getDefaultPreferences(): DatabaseSchema['userPreferences'] {
    return {
      theme: 'auto',
      language: 'it',
      toolsLayout: 'grid',
      windowSettings: {
        defaultSize: { width: 800, height: 600 },
        enableAnimations: true,
        rememberPositions: true
      }
    };
  }

  private getFromLocalStorage(key: string, defaultValue: any): any {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private async cleanupHistory(): Promise<void> {
    if (!this.db) return;

    const transaction = this.db.transaction([this.stores.toolsHistory], 'readwrite');
    const store = transaction.objectStore(this.stores.toolsHistory);
    const countRequest = store.count();

    countRequest.onsuccess = () => {
      if (countRequest.result > 1000) {
        const index = store.index('timestamp');
        const request = index.openCursor(null, 'next');
        let deleteCount = 0;
        const toDelete = countRequest.result - 1000;

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor && deleteCount < toDelete) {
            cursor.delete();
            deleteCount++;
            cursor.continue();
          }
        };
      }
    };
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) {
      const cache = this.getFromLocalStorage('manus_cache', {});
      const now = Date.now();
      
      Object.keys(cache).forEach(key => {
        if (cache[key].expiresAt < now) {
          delete cache[key];
        }
      });
      
      localStorage.setItem('manus_cache', JSON.stringify(cache));
      return;
    }

    const transaction = this.db.transaction([this.stores.cache], 'readwrite');
    const store = transaction.objectStore(this.stores.cache);
    const index = store.index('expiresAt');
    const range = IDBKeyRange.upperBound(Date.now());
    const request = index.openCursor(range);

    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }

  // Export/Import for backup
  async exportData(): Promise<string> {
    const data = {
      preferences: await this.getUserPreferences(),
      favorites: await this.getFavorites(),
      workspaces: await this.getWorkspaces(),
      exportedAt: Date.now()
    };

    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.preferences) {
        await this.saveUserPreferences(data.preferences);
      }
      
      if (data.workspaces) {
        for (const workspace of data.workspaces) {
          await this.saveWorkspace(workspace);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Errore import dati:', error);
      return false;
    }
  }
}

// Singleton instance
export const storageService = new ManusStorageService();

// Auto-initialize when module loads
storageService.init().catch(console.error);

// Cleanup expired cache every hour
setInterval(() => {
  storageService.clearExpiredCache().catch(console.error);
}, 60 * 60 * 1000);

export default storageService;
