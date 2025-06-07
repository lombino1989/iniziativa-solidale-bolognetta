// ========================================
// MANUS AI ULTRA - TYPES DEFINITIONS
// ========================================

export interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: number;
  metadata?: {
    responseTime?: number;
    tokens?: number;
    model?: string;
    confidence?: number;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  url: string;
  favicon?: string;
  thumbnail?: string;
  source: string;
  timestamp: number;
  relevanceScore?: number;
}

export interface NewsResult extends SearchResult {
  publishedAt: string;
  author?: string;
  category?: string;
}

export interface ImageResult {
  id: string;
  url: string;
  thumbnailUrl: string;
  title: string;
  source: string;
  width: number;
  height: number;
  size?: string;
}

export interface VideoResult {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnailUrl: string;
  duration: string;
  views: string;
  channel: string;
  publishedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content?: ArrayBuffer | string;
  thumbnail?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string;
  component: React.ComponentType<any>;
  settings?: Record<string, any>;
}

export type ToolCategory = 
  | 'web-search'
  | 'ai-engine'
  | 'advanced-tools'
  | 'creative-suite'
  | 'file-management'
  | 'web-api'
  | 'productivity'
  | 'entertainment'
  | 'developer';

export interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  tools: Tool[];
  position: { x: number; y: number; w: number; h: number };
  isMinimized?: boolean;
  isMaximized?: boolean;
}

export interface WindowState {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isResizable: boolean;
  isDraggable: boolean;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  gradients: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface UserSettings {
  theme: string;
  language: string;
  darkMode: boolean;
  animations: boolean;
  sounds: boolean;
  notifications: boolean;
  defaultTools: string[];
  customLayouts: Record<string, any>;
}

export interface ConversationContext {
  id: string;
  title: string;
  messages: AIMessage[];
  metadata: {
    createdAt: number;
    updatedAt: number;
    tokenCount: number;
    model: string;
  };
}

export interface CalculatorHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface ColorData {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  name?: string;
}

export interface QRCodeData {
  id: string;
  content: string;
  size: number;
  format: 'png' | 'svg';
  color: string;
  backgroundColor: string;
  timestamp: number;
}

export interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
  category: 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'time';
  baseMultiplier: number;
}

export interface TextAnalysis {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  keywordDensity: Record<string, number>;
}

export interface ImageEditOperation {
  type: 'resize' | 'crop' | 'filter' | 'brightness' | 'contrast' | 'saturation';
  params: Record<string, any>;
  timestamp: number;
}

export interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  background?: string;
  layout: 'title' | 'content' | 'image' | 'comparison';
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  thumbnail?: string;
}

export interface GameState {
  id: string;
  name: string;
  score: number;
  level: number;
  state: Record<string, any>;
  timestamp: number;
}

// API Response Types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
}

export interface WebSearchResponse extends APIResponse {
  data: {
    results: SearchResult[];
    totalResults: number;
    searchTime: number;
    query: string;
  };
}

export interface NewsSearchResponse extends APIResponse {
  data: {
    articles: NewsResult[];
    totalResults: number;
    searchTime: number;
    query: string;
  };
}

export interface ImageSearchResponse extends APIResponse {
  data: {
    images: ImageResult[];
    totalResults: number;
    searchTime: number;
    query: string;
  };
}

export interface VideoSearchResponse extends APIResponse {
  data: {
    videos: VideoResult[];
    totalResults: number;
    searchTime: number;
    query: string;
  };
}

// Event Types
export type AppEvent = 
  | { type: 'WINDOW_OPEN'; payload: { windowId: string; tool: Tool } }
  | { type: 'WINDOW_CLOSE'; payload: { windowId: string } }
  | { type: 'WINDOW_MINIMIZE'; payload: { windowId: string } }
  | { type: 'WINDOW_MAXIMIZE'; payload: { windowId: string } }
  | { type: 'WINDOW_FOCUS'; payload: { windowId: string } }
  | { type: 'THEME_CHANGE'; payload: { themeId: string } }
  | { type: 'SETTINGS_UPDATE'; payload: Partial<UserSettings> }
  | { type: 'SEARCH_PERFORM'; payload: { query: string; type: string } }
  | { type: 'FILE_UPLOAD'; payload: { files: FileItem[] } }
  | { type: 'NOTIFICATION_SHOW'; payload: { message: string; type: 'success' | 'error' | 'warning' | 'info' } };

// Hook Types
export interface UseWindowManagerReturn {
  windows: WindowState[];
  openWindow: (tool: Tool) => void;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, position: { x: number; y: number }) => void;
  updateWindowSize: (windowId: string, size: { width: number; height: number }) => void;
}

export interface UseSearchReturn {
  searchWeb: (query: string) => Promise<SearchResult[]>;
  searchNews: (query: string) => Promise<NewsResult[]>;
  searchImages: (query: string) => Promise<ImageResult[]>;
  searchVideos: (query: string) => Promise<VideoResult[]>;
  isLoading: boolean;
  error: string | null;
}

export interface UseAIEngineReturn {
  sendMessage: (message: string) => Promise<AIMessage>;
  generateCode: (language: string, description: string) => Promise<string>;
  analyzeDocument: (file: FileItem) => Promise<any>;
  generateImage: (prompt: string) => Promise<string>;
  translate: (text: string, from: string, to: string) => Promise<string>;
  summarize: (text: string) => Promise<string>;
  isProcessing: boolean;
  error: string | null;
}
