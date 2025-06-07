// ========================================
// MANUS AI ULTRA - MAIN APPLICATION
// ========================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Shield, 
  Heart,
  Menu,
  Settings,
  Moon,
  Sun,
  Sparkles,
  Bot
} from 'lucide-react';

import Dashboard from '@/components/dashboard/Dashboard';
import WindowManager from '@/components/dashboard/WindowManager';
import { useAICapabilities } from '@/hooks/useAI';
import './App.css';

function App() {
  const [isDark, setIsDark] = useState(false);
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  
  const { systemStatus, runSelfTest } = useAICapabilities();

  // Inizializzazione sistema
  useEffect(() => {
    const initializeSystem = async () => {
      console.log('🚀 Inizializzazione Manus AI Ultra...');
      
      try {
        // Test del sistema AI
        const testResult = await runSelfTest();
        
        if (testResult) {
          console.log('✅ Sistema Manus AI Ultra completamente operativo');
        } else {
          console.warn('⚠️ Sistema avviato con limitazioni');
        }
        
        setIsSystemReady(true);
        
        // Nascondi welcome screen dopo 3 secondi
        setTimeout(() => {
          setShowWelcome(false);
        }, 3000);
        
      } catch (error) {
        console.error('❌ Errore inizializzazione:', error);
        setIsSystemReady(true);
        setShowWelcome(false);
      }
    };

    initializeSystem();
  }, [runSelfTest]);

  // Gestione tema
  useEffect(() => {
    const savedTheme = localStorage.getItem('manus_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(shouldUseDark);
    
    if (shouldUseDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('manus_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('manus_theme', 'light');
    }
  };

  const getStatusConfig = () => {
    switch (systemStatus.status) {
      case 'excellent':
        return {
          color: 'bg-green-500',
          text: 'Sistema Eccellente',
          icon: Zap
        };
      case 'good':
        return {
          color: 'bg-yellow-500',
          text: 'Sistema Buono',
          icon: Shield
        };
      case 'warning':
        return {
          color: 'bg-orange-500',
          text: 'Funzionamento Limitato',
          icon: Shield
        };
      default:
        return {
          color: 'bg-gray-500',
          text: 'Stato Sconosciuto',
          icon: Bot
        };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  // Welcome Screen
  if (!isSystemReady || showWelcome) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white space-y-8 max-w-2xl mx-auto p-8"
        >
          {/* Logo animato */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ 
              repeat: Infinity, 
              repeatType: "reverse", 
              duration: 2,
              ease: "easeInOut"
            }}
            className="relative mx-auto w-32 h-32"
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-400 rounded-full flex items-center justify-center border-4 border-white/20">
              <Brain className="h-16 w-16 text-white" />
            </div>
            
            {/* Animazione orbite */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-white/30 rounded-full"
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full"></div>
            </motion.div>
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-2 border-dashed border-blue-300/30 rounded-full"
            >
              <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
            </motion.div>
          </motion.div>
          
          {/* Titolo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Manus AI Ultra
            </h1>
            <p className="text-2xl text-white/90 mb-2">
              La Suite di Intelligenza Artificiale Più Avanzata
            </p>
            <p className="text-lg text-white/70">
              Inizializzazione sistema di intelligenza artificiale...
            </p>
          </motion.div>
          
          {/* Statistiche */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-3 gap-6 max-w-md mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">60+</div>
              <div className="text-sm text-white/70">Strumenti</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">8</div>
              <div className="text-sm text-white/70">Categorie</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">∞</div>
              <div className="text-sm text-white/70">Possibilità</div>
            </div>
          </motion.div>
          
          {/* Loading indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center gap-2"
          >
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  className="w-3 h-3 bg-white rounded-full"
                />
              ))}
            </div>
            <span className="text-white/80 ml-4">Caricamento completato...</span>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm relative z-50">
          <div className="flex items-center justify-between px-6 py-4">
            
            {/* Left section */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Manus AI Ultra
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Assistente Intelligenza Artificiale Avanzato
                  </p>
                </div>
              </div>
            </div>

            {/* Center section - Status */}
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 ${statusConfig.color} rounded-full animate-pulse`}></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {statusConfig.text}
              </span>
              <StatusIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              
              <Badge variant="secondary" className="ml-2">
                v{systemStatus.version}
              </Badge>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              >
                <Heart className="h-3 w-3 mr-1" />
                Online
              </Badge>
              
              <Badge 
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Ultra Mode
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative">
          <Dashboard />
          <WindowManager />
        </main>

        {/* System Info Footer */}
        <div className="fixed bottom-4 left-4 z-30">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3"
          >
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Sistema AI Operativo</span>
              <span className="text-gray-400">•</span>
              <span>{systemStatus.availableCapabilities}/{systemStatus.totalCapabilities} Funzionalità</span>
              <span className="text-gray-400">•</span>
              <span>Salute: {(systemStatus.healthScore * 100).toFixed(0)}%</span>
            </div>
          </motion.div>
        </div>

        {/* Performance Stats */}
        <div className="fixed bottom-4 right-4 z-30">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3"
          >
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>Ultra Performance</span>
              <span className="text-gray-400">•</span>
              <span>60+ Strumenti Disponibili</span>
              <span className="text-gray-400">•</span>
              <span>Zero Limitazioni</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
