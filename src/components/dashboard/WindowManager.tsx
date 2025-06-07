// ========================================
// MANUS AI ULTRA - WINDOW MANAGER
// ========================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Move,
  MoreHorizontal,
  Settings,
  Grid3X3,
  Copy,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WindowState } from '@/types';
import { useWindowManager } from '@/hooks/useWindowManager';

interface WindowManagerProps {
  className?: string;
}

interface WindowProps {
  window: WindowState;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number; y: number }) => void;
  onUpdateSize: (id: string, size: { width: number; height: number }) => void;
}

function Window({ 
  window, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus, 
  onUpdatePosition,
  onUpdateSize 
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  // Focus quando cliccato
  const handleMouseDown = () => {
    onFocus(window.id);
  };

  // Gestione drag
  const handleDrag = (e: any, data: any) => {
    setIsDragging(true);
    onUpdatePosition(window.id, { x: data.x, y: data.y });
  };

  const handleDragStop = () => {
    setIsDragging(false);
  };

  // Gestione resize
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = window.size.width;
    const startHeight = window.size.height;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(300, startWidth + (e.clientX - startX));
      const newHeight = Math.max(200, startHeight + (e.clientY - startY));
      onUpdateSize(window.id, { width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (window.isMinimized) return null;

  return (
    <Draggable
      handle=".window-header"
      position={{ x: window.position.x, y: window.position.y }}
      onDrag={handleDrag}
      onStop={handleDragStop}
      disabled={window.isMaximized || !window.isDraggable}
      bounds="parent"
    >
      <motion.div
        ref={windowRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "absolute bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden",
          isDragging && "shadow-3xl",
          isResizing && "select-none"
        )}
        style={{
          width: window.isMaximized ? '100vw' : window.size.width,
          height: window.isMaximized ? 'calc(100vh - 64px)' : window.size.height,
          zIndex: window.zIndex,
          left: window.isMaximized ? 0 : undefined,
          top: window.isMaximized ? 0 : undefined
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Window Header */}
        <div 
          className="window-header flex items-center justify-between p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white cursor-move"
        >
          <div className="flex items-center gap-3">
            <div className="text-lg">
              {window.props?.tool?.icon || '🪟'}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{window.title}</h3>
              <p className="text-xs opacity-80">
                {window.props?.tool?.description || 'Finestra applicazione'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              onClick={() => onMinimize(window.id)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              onClick={() => onMaximize(window.id)}
            >
              {window.isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-red-500 text-white"
              onClick={() => onClose(window.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Window Content */}
        <div 
          className="h-full overflow-auto"
          style={{ 
            height: window.isMaximized 
              ? 'calc(100vh - 64px - 60px)' 
              : `${window.size.height - 60}px` 
          }}
        >
          <React.Suspense 
            fallback={
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Caricamento componente...
                  </p>
                </div>
              </div>
            }
          >
            <window.component {...window.props} />
          </React.Suspense>
        </div>

        {/* Resize Handle */}
        {window.isResizable && !window.isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            onMouseDown={handleMouseDownResize}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-600 dark:border-gray-300"></div>
          </div>
        )}
      </motion.div>
    </Draggable>
  );
}

function TaskBar({ windows, onWindowFocus, onWindowMinimize }: {
  windows: WindowState[];
  onWindowFocus: (id: string) => void;
  onWindowMinimize: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-center justify-center h-full px-4">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full">
          {windows.map((window) => (
            <Button
              key={window.id}
              variant={window.isMinimized ? "outline" : "default"}
              size="sm"
              className={cn(
                "flex items-center gap-2 max-w-48 min-w-32",
                !window.isMinimized && "bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700"
              )}
              onClick={() => {
                if (window.isMinimized) {
                  onWindowFocus(window.id);
                } else {
                  onWindowMinimize(window.id);
                }
              }}
            >
              <span className="text-sm">
                {window.props?.tool?.icon || '🪟'}
              </span>
              <span className="truncate text-xs">
                {window.title}
              </span>
              {!window.isMinimized && (
                <Badge variant="secondary" className="text-xs px-1">
                  ●
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WindowManager({ className }: WindowManagerProps) {
  const {
    windows,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize
  } = useWindowManager();

  return (
    <div className={cn("fixed inset-0 pointer-events-none", className)}>
      {/* Windows Container */}
      <div className="relative w-full h-full pointer-events-auto">
        <AnimatePresence>
          {windows.map((window) => (
            <Window
              key={window.id}
              window={window}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onMaximize={maximizeWindow}
              onFocus={focusWindow}
              onUpdatePosition={updateWindowPosition}
              onUpdateSize={updateWindowSize}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Task Bar */}
      {windows.length > 0 && (
        <TaskBar
          windows={windows}
          onWindowFocus={focusWindow}
          onWindowMinimize={minimizeWindow}
        />
      )}

      {/* Window Controls Overlay */}
      {windows.length > 1 && (
        <div className="fixed top-20 right-4 z-40">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // Implementa tile orizzontale
                  // windowService.tileWindows('horizontal');
                }}
              >
                <Grid3X3 className="h-3 w-3 mr-1" />
                Tile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // Implementa cascade
                  // windowService.cascadeWindows();
                }}
              >
                <Copy className="h-3 w-3 mr-1" />
                Cascade
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => {
                  // Implementa minimize all
                  // windowService.minimizeAllWindows();
                }}
              >
                <Minus className="h-3 w-3 mr-1" />
                Minimize All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
