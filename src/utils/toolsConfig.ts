// ========================================
// MANUS AI ULTRA - TOOLS CONFIGURATION
// ========================================

import { Tool, DashboardModule } from '@/types';

// ========================================
// TOOL COMPONENTS (lazy loaded)
// ========================================
import { lazy } from 'react';

// Web Search Tools
const WebSearchTool = lazy(() => import('@/components/tools/WebSearchTool'));
const NewsSearchTool = lazy(() => import('@/components/tools/index.tsx').then(module => ({ default: module.NewsSearchTool })));
const ImageSearchTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.ImageSearchTool })));
const VideoSearchTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.VideoSearchTool })));
const AcademicSearchTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.AcademicSearchTool })));
const SocialSearchTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.SocialSearchTool })));

// AI Engine Tools
const ChatTool = lazy(() => import('@/components/tools/ChatTool'));
const CodeGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.CodeGeneratorTool })));
const DocumentAnalyzerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.DocumentAnalyzerTool })));
const ImageGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.ImageGeneratorTool })));
const TextToSpeechTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.TextToSpeechTool })));
const SpeechToTextTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.SpeechToTextTool })));
const TranslatorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.TranslatorTool })));
const SummarizerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.SummarizerTool })));

// Advanced Tools
const CalculatorTool = lazy(() => import('@/components/tools/CalculatorTool'));
const UnitConverterTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.UnitConverterTool })));
const QRCodeGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.QRCodeGeneratorTool })));
const ColorPickerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.ColorPickerTool })));
const TextToolsTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.TextToolsTool })));
const ImageEditorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.ImageEditorTool })));
const PDFToolsTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.PDFToolsTool })));
const DataVisualizationTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.DataVisualizationTool })));

// Creative Suite
const VideoEditorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.VideoEditorTool })));
const AudioEditorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.AudioEditorTool })));
const PresentationMakerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.PresentationMakerTool })));
const InfographicCreatorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.InfographicCreatorTool })));
const LogoDesignerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.LogoDesignerTool })));
const MemeGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.MemeGeneratorTool })));
const ArtGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.ArtGeneratorTool })));

// File Management
const FileUploaderTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.FileUploaderTool })));
const FileConverterTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.FileConverterTool })));
const CloudStorageTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.CloudStorageTool })));
const FileCompressionTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.FileCompressionTool })));
const BackupRestoreTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.BackupRestoreTool })));
const FileSharingTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.FileSharingTool })));

// Web & API Tools
const URLShortenerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.URLShortenerTool })));
const WebsiteScreenshotTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.WebsiteScreenshotTool })));
const WebsiteAnalysisTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.WebsiteAnalysisTool })));
const APITesterTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.APITesterTool })));
const JSONFormatterTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.JSONFormatterTool })));
const Base64EncoderTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.Base64EncoderTool })));
const HashGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.HashGeneratorTool })));
const PasswordGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.PasswordGeneratorTool })));

// Productivity Suite
const NoteTakingTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.NoteTakingTool })));
const TaskManagerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.TaskManagerTool })));
const CalendarTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.CalendarTool })));
const TimerStopwatchTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.TimerStopwatchTool })));
const WeatherTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.WeatherTool })));
const WorldClockTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.WorldClockTool })));
const CurrencyConverterTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.CurrencyConverterTool })));
const StockTrackerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.StockTrackerTool })));

// Entertainment
const GamesTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.GamesTool })));
const MusicPlayerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.MusicPlayerTool })));
const VideoPlayerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.VideoPlayerTool })));
const PodcastPlayerTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.PodcastPlayerTool })));
const RadioTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.RadioTool })));
const QuizGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.QuizGeneratorTool })));
const JokeGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.JokeGeneratorTool })));
const StoryGeneratorTool = lazy(() => import('@/components/tools/index').then(module => ({ default: module.StoryGeneratorTool })));

// ========================================
// TOOLS DEFINITIONS
// ========================================
export const TOOLS: Tool[] = [
  // WEB SEARCH CATEGORY
  {
    id: 'web-search',
    name: 'Ricerca Web',
    description: 'Ricerca in tempo reale con risultati istantanei',
    category: 'web-search',
    icon: '🌐',
    component: WebSearchTool
  },
  {
    id: 'news-search',
    name: 'Ricerca News',
    description: 'Ultime notizie da fonti multiple',
    category: 'web-search',
    icon: '📰',
    component: NewsSearchTool
  },
  {
    id: 'image-search',
    name: 'Ricerca Immagini',
    description: 'Ricerca e visualizzazione immagini',
    category: 'web-search',
    icon: '🖼️',
    component: ImageSearchTool
  },
  {
    id: 'video-search',
    name: 'Ricerca Video',
    description: 'Ricerca video da YouTube e altre piattaforme',
    category: 'web-search',
    icon: '🎥',
    component: VideoSearchTool
  },
  {
    id: 'academic-search',
    name: 'Ricerca Accademica',
    description: 'Ricerca articoli scientifici e paper',
    category: 'web-search',
    icon: '🎓',
    component: AcademicSearchTool
  },
  {
    id: 'social-search',
    name: 'Ricerca Social',
    description: 'Ricerca contenuti social media',
    category: 'web-search',
    icon: '📱',
    component: SocialSearchTool
  },

  // AI ENGINE CATEGORY
  {
    id: 'ai-chat',
    name: 'Chat AI',
    description: 'Conversazioni intelligenti multi-modali',
    category: 'ai-engine',
    icon: '🤖',
    component: ChatTool
  },
  {
    id: 'code-generator',
    name: 'Generatore Codice',
    description: 'Generazione codice in tutti i linguaggi',
    category: 'ai-engine',
    icon: '💻',
    component: CodeGeneratorTool
  },
  {
    id: 'document-analyzer',
    name: 'Analizzatore Documenti',
    description: 'Analisi PDF, Word, Excel, PowerPoint',
    category: 'ai-engine',
    icon: '📄',
    component: DocumentAnalyzerTool
  },
  {
    id: 'image-generator',
    name: 'Generatore Immagini',
    description: 'Creazione immagini AI integrate',
    category: 'ai-engine',
    icon: '🎨',
    component: ImageGeneratorTool
  },
  {
    id: 'text-to-speech',
    name: 'Text-to-Speech',
    description: 'Sintesi vocale avanzata',
    category: 'ai-engine',
    icon: '🔊',
    component: TextToSpeechTool
  },
  {
    id: 'speech-to-text',
    name: 'Speech-to-Text',
    description: 'Riconoscimento vocale perfetto',
    category: 'ai-engine',
    icon: '🎤',
    component: SpeechToTextTool
  },
  {
    id: 'translator',
    name: 'Traduttore',
    description: 'Traduzione in tempo reale 100+ lingue',
    category: 'ai-engine',
    icon: '🌍',
    component: TranslatorTool
  },
  {
    id: 'summarizer',
    name: 'Riassuntore',
    description: 'Riassunti automatici intelligenti',
    category: 'ai-engine',
    icon: '📋',
    component: SummarizerTool
  },

  // ADVANCED TOOLS CATEGORY
  {
    id: 'calculator',
    name: 'Calcolatrice',
    description: 'Calcolatrice scientifica avanzata',
    category: 'advanced-tools',
    icon: '🧮',
    component: CalculatorTool
  },
  {
    id: 'unit-converter',
    name: 'Convertitore Unità',
    description: 'Convertitore unità di misura',
    category: 'advanced-tools',
    icon: '⚖️',
    component: UnitConverterTool
  },
  {
    id: 'qr-generator',
    name: 'Generatore QR',
    description: 'Generatore QR code',
    category: 'advanced-tools',
    icon: '📱',
    component: QRCodeGeneratorTool
  },
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Selettore colori avanzato',
    category: 'advanced-tools',
    icon: '🎨',
    component: ColorPickerTool
  },
  {
    id: 'text-tools',
    name: 'Text Tools',
    description: 'Conteggio parole, formattazione, cleanup',
    category: 'advanced-tools',
    icon: '📝',
    component: TextToolsTool
  },
  {
    id: 'image-editor',
    name: 'Editor Immagini',
    description: 'Resize, crop, filter, effects',
    category: 'advanced-tools',
    icon: '🖼️',
    component: ImageEditorTool
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, compress, convert',
    category: 'advanced-tools',
    icon: '📄',
    component: PDFToolsTool
  },
  {
    id: 'data-visualization',
    name: 'Visualizzazione Dati',
    description: 'Grafici e charts dinamici',
    category: 'advanced-tools',
    icon: '📊',
    component: DataVisualizationTool
  },

  // CREATIVE SUITE CATEGORY
  {
    id: 'video-editor',
    name: 'Editor Video',
    description: 'Editing video basic',
    category: 'creative-suite',
    icon: '🎬',
    component: VideoEditorTool
  },
  {
    id: 'audio-editor',
    name: 'Editor Audio',
    description: 'Editor audio professionale',
    category: 'creative-suite',
    icon: '🎵',
    component: AudioEditorTool
  },
  {
    id: 'presentation-maker',
    name: 'Creatore Presentazioni',
    description: 'Creatore presentazioni',
    category: 'creative-suite',
    icon: '📊',
    component: PresentationMakerTool
  },
  {
    id: 'infographic-creator',
    name: 'Creatore Infografiche',
    description: 'Creatore infografiche',
    category: 'creative-suite',
    icon: '📈',
    component: InfographicCreatorTool
  },
  {
    id: 'logo-designer',
    name: 'Designer Logo',
    description: 'Designer logo AI',
    category: 'creative-suite',
    icon: '🎯',
    component: LogoDesignerTool
  },
  {
    id: 'meme-generator',
    name: 'Generatore Meme',
    description: 'Generatore meme',
    category: 'creative-suite',
    icon: '😂',
    component: MemeGeneratorTool
  },
  {
    id: 'art-generator',
    name: 'Generatore Arte',
    description: 'Generatore arte AI',
    category: 'creative-suite',
    icon: '🎨',
    component: ArtGeneratorTool
  },

  // FILE MANAGEMENT CATEGORY
  {
    id: 'file-uploader',
    name: 'Upload File',
    description: 'Upload ogni tipo di file',
    category: 'file-management',
    icon: '📁',
    component: FileUploaderTool
  },
  {
    id: 'file-converter',
    name: 'Convertitore File',
    description: 'Conversione formati',
    category: 'file-management',
    icon: '🔄',
    component: FileConverterTool
  },
  {
    id: 'cloud-storage',
    name: 'Cloud Storage',
    description: 'Storage locale browser',
    category: 'file-management',
    icon: '☁️',
    component: CloudStorageTool
  },
  {
    id: 'file-compression',
    name: 'Compressione File',
    description: 'Compressione/decompressione',
    category: 'file-management',
    icon: '🗜️',
    component: FileCompressionTool
  },
  {
    id: 'backup-restore',
    name: 'Backup/Restore',
    description: 'Sistema backup completo',
    category: 'file-management',
    icon: '💾',
    component: BackupRestoreTool
  },
  {
    id: 'file-sharing',
    name: 'Condivisione File',
    description: 'Condivisione sicura',
    category: 'file-management',
    icon: '📤',
    component: FileSharingTool
  },

  // WEB & API TOOLS CATEGORY
  {
    id: 'url-shortener',
    name: 'Accorciatore URL',
    description: 'Accorciatore URL',
    category: 'web-api',
    icon: '🔗',
    component: URLShortenerTool
  },
  {
    id: 'website-screenshot',
    name: 'Screenshot Siti',
    description: 'Screenshot pagine web',
    category: 'web-api',
    icon: '📸',
    component: WebsiteScreenshotTool
  },
  {
    id: 'website-analysis',
    name: 'Analisi Siti Web',
    description: 'Analisi SEO e performance',
    category: 'web-api',
    icon: '📊',
    component: WebsiteAnalysisTool
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test API REST',
    category: 'web-api',
    icon: '🔧',
    component: APITesterTool
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Formatter JSON/XML',
    category: 'web-api',
    icon: '📋',
    component: JSONFormatterTool
  },
  {
    id: 'base64-encoder',
    name: 'Base64 Encoder',
    description: 'Codifica/decodifica',
    category: 'web-api',
    icon: '🔐',
    component: Base64EncoderTool
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'MD5, SHA1, SHA256',
    category: 'web-api',
    icon: '#️⃣',
    component: HashGeneratorTool
  },
  {
    id: 'password-generator',
    name: 'Generatore Password',
    description: 'Generatore password sicure',
    category: 'web-api',
    icon: '🔑',
    component: PasswordGeneratorTool
  },

  // PRODUCTIVITY SUITE CATEGORY
  {
    id: 'note-taking',
    name: 'Note',
    description: 'Sistema note avanzato',
    category: 'productivity',
    icon: '📝',
    component: NoteTakingTool
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Gestione attività',
    category: 'productivity',
    icon: '✅',
    component: TaskManagerTool
  },
  {
    id: 'calendar',
    name: 'Calendario',
    description: 'Calendario integrato',
    category: 'productivity',
    icon: '📅',
    component: CalendarTool
  },
  {
    id: 'timer-stopwatch',
    name: 'Timer/Cronometro',
    description: 'Timer e cronometro',
    category: 'productivity',
    icon: '⏱️',
    component: TimerStopwatchTool
  },
  {
    id: 'weather',
    name: 'Meteo',
    description: 'Previsioni meteo',
    category: 'productivity',
    icon: '🌤️',
    component: WeatherTool
  },
  {
    id: 'world-clock',
    name: 'Orologi Mondiali',
    description: 'Orologi mondiali',
    category: 'productivity',
    icon: '🌍',
    component: WorldClockTool
  },
  {
    id: 'currency-converter',
    name: 'Convertitore Valute',
    description: 'Convertitore valute',
    category: 'productivity',
    icon: '💱',
    component: CurrencyConverterTool
  },
  {
    id: 'stock-tracker',
    name: 'Tracker Azioni',
    description: 'Tracker azioni',
    category: 'productivity',
    icon: '📈',
    component: StockTrackerTool
  },

  // ENTERTAINMENT CATEGORY
  {
    id: 'games',
    name: 'Giochi',
    description: 'Mini-giochi integrati',
    category: 'entertainment',
    icon: '🎮',
    component: GamesTool
  },
  {
    id: 'music-player',
    name: 'Player Musicale',
    description: 'Player musicale',
    category: 'entertainment',
    icon: '🎵',
    component: MusicPlayerTool
  },
  {
    id: 'video-player',
    name: 'Player Video',
    description: 'Player video',
    category: 'entertainment',
    icon: '🎬',
    component: VideoPlayerTool
  },
  {
    id: 'podcast-player',
    name: 'Player Podcast',
    description: 'Player podcast',
    category: 'entertainment',
    icon: '🎧',
    component: PodcastPlayerTool
  },
  {
    id: 'radio',
    name: 'Radio',
    description: 'Radio online',
    category: 'entertainment',
    icon: '📻',
    component: RadioTool
  },
  {
    id: 'quiz-generator',
    name: 'Generatore Quiz',
    description: 'Generatore quiz',
    category: 'entertainment',
    icon: '❓',
    component: QuizGeneratorTool
  },
  {
    id: 'joke-generator',
    name: 'Generatore Barzellette',
    description: 'Generatore barzellette',
    category: 'entertainment',
    icon: '😂',
    component: JokeGeneratorTool
  },
  {
    id: 'story-generator',
    name: 'Generatore Storie',
    description: 'Generatore storie',
    category: 'entertainment',
    icon: '📚',
    component: StoryGeneratorTool
  }
];

// ========================================
// DASHBOARD MODULES
// ========================================
export const DASHBOARD_MODULES: DashboardModule[] = [
  {
    id: 'web-search-center',
    title: 'Centro Ricerche Web',
    description: 'Ricerca web avanzata con tutti i tipi di contenuto',
    icon: '🌐',
    category: 'Ricerca',
    tools: TOOLS.filter(tool => tool.category === 'web-search'),
    position: { x: 0, y: 0, w: 4, h: 3 }
  },
  {
    id: 'ai-chat-hub',
    title: 'AI Chat Hub',
    description: 'Centro di controllo AI con tutte le modalità',
    icon: '🤖',
    category: 'Intelligenza Artificiale',
    tools: TOOLS.filter(tool => tool.category === 'ai-engine'),
    position: { x: 4, y: 0, w: 4, h: 3 }
  },
  {
    id: 'creative-studio',
    title: 'Creative Studio',
    description: 'Suite creativa completa per contenuti multimediali',
    icon: '🎨',
    category: 'Creatività',
    tools: TOOLS.filter(tool => tool.category === 'creative-suite'),
    position: { x: 8, y: 0, w: 4, h: 3 }
  },
  {
    id: 'productivity-suite',
    title: 'Suite Produttività',
    description: 'Strumenti per produttività e organizzazione',
    icon: '📊',
    category: 'Produttività',
    tools: TOOLS.filter(tool => tool.category === 'productivity'),
    position: { x: 0, y: 3, w: 4, h: 3 }
  },
  {
    id: 'developer-tools',
    title: 'Developer Tools',
    description: 'Strumenti avanzati per sviluppatori',
    icon: '⚙️',
    category: 'Sviluppo',
    tools: TOOLS.filter(tool => tool.category === 'web-api'),
    position: { x: 4, y: 3, w: 4, h: 3 }
  },
  {
    id: 'entertainment-hub',
    title: 'Entertainment Hub',
    description: 'Centro intrattenimento e giochi',
    icon: '🎮',
    category: 'Intrattenimento',
    tools: TOOLS.filter(tool => tool.category === 'entertainment'),
    position: { x: 8, y: 3, w: 4, h: 3 }
  },
  {
    id: 'file-manager',
    title: 'File Manager',
    description: 'Gestione file avanzata e cloud storage',
    icon: '📁',
    category: 'File',
    tools: TOOLS.filter(tool => tool.category === 'file-management'),
    position: { x: 0, y: 6, w: 6, h: 2 }
  },
  {
    id: 'advanced-tools',
    title: 'Strumenti Avanzati',
    description: 'Calcolatrici, convertitori e utility',
    icon: '🔧',
    category: 'Utility',
    tools: TOOLS.filter(tool => tool.category === 'advanced-tools'),
    position: { x: 6, y: 6, w: 6, h: 2 }
  }
];

// ========================================
// UTILITY FUNCTIONS
// ========================================
export function getToolById(id: string): Tool | undefined {
  return TOOLS.find(tool => tool.id === id);
}

export function getToolsByCategory(category: string): Tool[] {
  return TOOLS.filter(tool => tool.category === category);
}

export function getModuleById(id: string): DashboardModule | undefined {
  return DASHBOARD_MODULES.find(module => module.id === id);
}

export function getAllCategories(): string[] {
  const categories = new Set(TOOLS.map(tool => tool.category));
  return Array.from(categories);
}

export function searchTools(query: string): Tool[] {
  const lowerQuery = query.toLowerCase();
  return TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery)
  );
}
