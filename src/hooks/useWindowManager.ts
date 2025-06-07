// ========================================
// MANUS AI ULTRA - WINDOW MANAGER HOOK
// ========================================

import { useState, useEffect, useCallback } from 'react';
import { WindowState, Tool, UseWindowManagerReturn } from '@/types';
import { windowService } from '@/services/windowService';

export function useWindowManager(): UseWindowManagerReturn {
  const [windows, setWindows] = useState<WindowState[]>([]);

  // Sincronizza lo stato con il service
  useEffect(() => {
    const updateWindows = () => {
      setWindows(windowService.getAllWindows());
    };

    // Inizializza lo stato
    updateWindows();

    // Subscribe ai cambiamenti
    const unsubscribe = windowService.subscribe(updateWindows);

    return unsubscribe;
  }, []);

  // Gestione keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      windowService.handleKeyboardShortcut(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openWindow = useCallback((tool: Tool, position?: { x: number; y: number }) => {
    windowService.openWindow(tool, position);
  }, []);

  const closeWindow = useCallback((windowId: string) => {
    windowService.closeWindow(windowId);
  }, []);

  const minimizeWindow = useCallback((windowId: string) => {
    windowService.minimizeWindow(windowId);
  }, []);

  const maximizeWindow = useCallback((windowId: string) => {
    windowService.maximizeWindow(windowId);
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    windowService.focusWindow(windowId);
  }, []);

  const updateWindowPosition = useCallback((windowId: string, position: { x: number; y: number }) => {
    windowService.updateWindowPosition(windowId, position);
  }, []);

  const updateWindowSize = useCallback((windowId: string, size: { width: number; height: number }) => {
    windowService.updateWindowSize(windowId, size);
  }, []);

  return {
    windows,
    openWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize
  };
}
