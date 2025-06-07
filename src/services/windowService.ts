// ========================================
// MANUS AI ULTRA - WINDOW MANAGER SERVICE
// ========================================

import { WindowState, Tool, DashboardModule } from '@/types';

class WindowService {
  private windows: Map<string, WindowState> = new Map();
  private zIndexCounter = 1000;
  private listeners: Set<() => void> = new Set();

  // ========================================
  // WINDOW MANAGEMENT
  // ========================================
  openWindow(tool: Tool, position?: { x: number; y: number }): string {
    const windowId = `window_${tool.id}_${Date.now()}`;
    
    // Calcola posizione automatica se non specificata
    const autoPosition = position || this.calculateAutoPosition();
    
    const windowState: WindowState = {
      id: windowId,
      title: tool.name,
      component: tool.component,
      props: { tool },
      position: autoPosition,
      size: this.getDefaultSize(tool.category),
      zIndex: ++this.zIndexCounter,
      isMinimized: false,
      isMaximized: false,
      isResizable: true,
      isDraggable: true
    };

    this.windows.set(windowId, windowState);
    this.notifyListeners();
    
    return windowId;
  }

  closeWindow(windowId: string): boolean {
    const closed = this.windows.delete(windowId);
    if (closed) {
      this.notifyListeners();
    }
    return closed;
  }

  minimizeWindow(windowId: string): boolean {
    const window = this.windows.get(windowId);
    if (window) {
      window.isMinimized = true;
      window.isMaximized = false;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  maximizeWindow(windowId: string): boolean {
    const window = this.windows.get(windowId);
    if (window) {
      window.isMaximized = !window.isMaximized;
      window.isMinimized = false;
      
      if (window.isMaximized) {
        // Salva posizione e dimensioni originali
        window.props = {
          ...window.props,
          originalPosition: { ...window.position },
          originalSize: { ...window.size }
        };
        
        // Imposta fullscreen
        window.position = { x: 0, y: 0 };
        window.size = { 
          width: globalThis.innerWidth || 1200, 
          height: globalThis.innerHeight || 800 
        };
      } else {
        // Ripristina posizione e dimensioni originali
        if (window.props?.originalPosition && window.props?.originalSize) {
          window.position = window.props.originalPosition;
          window.size = window.props.originalSize;
        }
      }
      
      this.notifyListeners();
      return true;
    }
    return false;
  }

  focusWindow(windowId: string): boolean {
    const window = this.windows.get(windowId);
    if (window) {
      window.zIndex = ++this.zIndexCounter;
      window.isMinimized = false;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  updateWindowPosition(windowId: string, position: { x: number; y: number }): boolean {
    const window = this.windows.get(windowId);
    if (window && window.isDraggable && !window.isMaximized) {
      window.position = position;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  updateWindowSize(windowId: string, size: { width: number; height: number }): boolean {
    const window = this.windows.get(windowId);
    if (window && window.isResizable && !window.isMaximized) {
      window.size = size;
      this.notifyListeners();
      return true;
    }
    return false;
  }

  // ========================================
  // WINDOW QUERIES
  // ========================================
  getWindow(windowId: string): WindowState | undefined {
    return this.windows.get(windowId);
  }

  getAllWindows(): WindowState[] {
    return Array.from(this.windows.values())
      .sort((a, b) => a.zIndex - b.zIndex);
  }

  getActiveWindows(): WindowState[] {
    return this.getAllWindows().filter(window => !window.isMinimized);
  }

  getMinimizedWindows(): WindowState[] {
    return this.getAllWindows().filter(window => window.isMinimized);
  }

  getFocusedWindow(): WindowState | undefined {
    const windows = this.getAllWindows();
    return windows.length > 0 ? windows[windows.length - 1] : undefined;
  }

  getWindowsByCategory(category: string): WindowState[] {
    return this.getAllWindows().filter(window => 
      window.props?.tool?.category === category
    );
  }

  // ========================================
  // WINDOW LAYOUT MANAGEMENT
  // ========================================
  tileWindows(orientation: 'horizontal' | 'vertical' = 'horizontal'): void {
    const activeWindows = this.getActiveWindows();
    if (activeWindows.length === 0) return;

    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight - 64; // Account for header
    
    if (orientation === 'horizontal') {
      const windowWidth = containerWidth / activeWindows.length;
      
      activeWindows.forEach((window, index) => {
        window.position = { x: windowWidth * index, y: 0 };
        window.size = { width: windowWidth, height: containerHeight };
        window.isMaximized = false;
        window.isMinimized = false;
      });
    } else {
      const windowHeight = containerHeight / activeWindows.length;
      
      activeWindows.forEach((window, index) => {
        window.position = { x: 0, y: windowHeight * index };
        window.size = { width: containerWidth, height: windowHeight };
        window.isMaximized = false;
        window.isMinimized = false;
      });
    }

    this.notifyListeners();
  }

  cascadeWindows(): void {
    const activeWindows = this.getActiveWindows();
    const offset = 30;
    
    activeWindows.forEach((window, index) => {
      window.position = { 
        x: offset * index, 
        y: offset * index 
      };
      window.size = this.getDefaultSize(window.props?.tool?.category || 'web-search');
      window.isMaximized = false;
      window.isMinimized = false;
    });

    this.notifyListeners();
  }

  minimizeAllWindows(): void {
    this.getAllWindows().forEach(window => {
      window.isMinimized = true;
      window.isMaximized = false;
    });
    this.notifyListeners();
  }

  closeAllWindows(): void {
    this.windows.clear();
    this.notifyListeners();
  }

  // ========================================
  // WORKSPACE MANAGEMENT
  // ========================================
  saveWorkspace(name: string): void {
    const workspace = {
      name,
      windows: Array.from(this.windows.entries()).map(([id, window]) => ({
        id,
        toolId: window.props?.tool?.id,
        position: window.position,
        size: window.size,
        isMinimized: window.isMinimized,
        isMaximized: window.isMaximized
      })),
      timestamp: Date.now()
    };

    const workspaces = this.getSavedWorkspaces();
    workspaces[name] = workspace;
    localStorage.setItem('manus_workspaces', JSON.stringify(workspaces));
  }

  loadWorkspace(name: string, tools: Tool[]): boolean {
    const workspaces = this.getSavedWorkspaces();
    const workspace = workspaces[name];
    
    if (!workspace) return false;

    // Chiudi tutte le finestre attuali
    this.closeAllWindows();

    // Ricrea le finestre del workspace
    workspace.windows.forEach(windowData => {
      const tool = tools.find(t => t.id === windowData.toolId);
      if (tool) {
        const windowId = this.openWindow(tool, windowData.position);
        const window = this.windows.get(windowId);
        
        if (window) {
          window.size = windowData.size;
          window.isMinimized = windowData.isMinimized;
          window.isMaximized = windowData.isMaximized;
        }
      }
    });

    this.notifyListeners();
    return true;
  }

  getSavedWorkspaces(): Record<string, any> {
    const stored = localStorage.getItem('manus_workspaces');
    return stored ? JSON.parse(stored) : {};
  }

  deleteWorkspace(name: string): boolean {
    const workspaces = this.getSavedWorkspaces();
    if (workspaces[name]) {
      delete workspaces[name];
      localStorage.setItem('manus_workspaces', JSON.stringify(workspaces));
      return true;
    }
    return false;
  }

  // ========================================
  // HELPER METHODS
  // ========================================
  private calculateAutoPosition(): { x: number; y: number } {
    const existingWindows = this.getActiveWindows();
    const offset = 40;
    const baseX = 100;
    const baseY = 100;
    
    // Trova una posizione libera
    for (let i = 0; i < existingWindows.length + 1; i++) {
      const x = baseX + (offset * i);
      const y = baseY + (offset * i);
      
      const hasCollision = existingWindows.some(window => 
        Math.abs(window.position.x - x) < 50 && 
        Math.abs(window.position.y - y) < 50
      );
      
      if (!hasCollision) {
        return { x, y };
      }
    }
    
    return { x: baseX, y: baseY };
  }

  private getDefaultSize(category: string): { width: number; height: number } {
    const sizes: Record<string, { width: number; height: number }> = {
      'web-search': { width: 800, height: 600 },
      'ai-engine': { width: 600, height: 500 },
      'advanced-tools': { width: 500, height: 400 },
      'creative-suite': { width: 900, height: 700 },
      'file-management': { width: 700, height: 500 },
      'web-api': { width: 600, height: 450 },
      'productivity': { width: 650, height: 500 },
      'entertainment': { width: 600, height: 400 },
      'developer': { width: 800, height: 600 }
    };
    
    return sizes[category] || { width: 600, height: 500 };
  }

  // ========================================
  // EVENT SYSTEM
  // ========================================
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  // ========================================
  // KEYBOARD SHORTCUTS
  // ========================================
  handleKeyboardShortcut(event: KeyboardEvent): boolean {
    if (!event.ctrlKey && !event.metaKey) return false;

    switch (event.key) {
      case 'w':
        // Ctrl+W: Chiudi finestra focussata
        const focused = this.getFocusedWindow();
        if (focused) {
          this.closeWindow(focused.id);
          event.preventDefault();
          return true;
        }
        break;
        
      case 'm':
        // Ctrl+M: Minimizza finestra focussata
        const focusedForMinimize = this.getFocusedWindow();
        if (focusedForMinimize) {
          this.minimizeWindow(focusedForMinimize.id);
          event.preventDefault();
          return true;
        }
        break;
        
      case 'Enter':
        // Ctrl+Enter: Massimizza finestra focussata
        const focusedForMaximize = this.getFocusedWindow();
        if (focusedForMaximize) {
          this.maximizeWindow(focusedForMaximize.id);
          event.preventDefault();
          return true;
        }
        break;
        
      case 'q':
        // Ctrl+Shift+Q: Chiudi tutte le finestre
        if (event.shiftKey) {
          this.closeAllWindows();
          event.preventDefault();
          return true;
        }
        break;
        
      case 't':
        // Ctrl+T: Tile orizzontale
        this.tileWindows('horizontal');
        event.preventDefault();
        return true;
        
      case 'y':
        // Ctrl+Y: Tile verticale
        this.tileWindows('vertical');
        event.preventDefault();
        return true;
        
      case 'u':
        // Ctrl+U: Cascade windows
        this.cascadeWindows();
        event.preventDefault();
        return true;
    }
    
    // Ctrl+1-9: Focus finestra per numero
    if (event.key >= '1' && event.key <= '9') {
      const windowIndex = parseInt(event.key) - 1;
      const windows = this.getActiveWindows();
      
      if (windows[windowIndex]) {
        this.focusWindow(windows[windowIndex].id);
        event.preventDefault();
        return true;
      }
    }
    
    return false;
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  getWindowStats() {
    const windows = this.getAllWindows();
    return {
      total: windows.length,
      active: windows.filter(w => !w.isMinimized).length,
      minimized: windows.filter(w => w.isMinimized).length,
      maximized: windows.filter(w => w.isMaximized).length,
      categories: this.getCategoryStats(windows)
    };
  }

  private getCategoryStats(windows: WindowState[]) {
    const stats: Record<string, number> = {};
    
    windows.forEach(window => {
      const category = window.props?.tool?.category || 'unknown';
      stats[category] = (stats[category] || 0) + 1;
    });
    
    return stats;
  }

  // Cleanup per unmount del componente
  cleanup(): void {
    this.windows.clear();
    this.listeners.clear();
    this.zIndexCounter = 1000;
  }
}

export const windowService = new WindowService();
