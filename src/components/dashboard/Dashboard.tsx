// ========================================
// MANUS AI ULTRA - MAIN DASHBOARD
// ========================================

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Grid, 
  List, 
  Maximize2, 
  Minimize2, 
  Settings, 
  Star,
  ChevronRight,
  Zap,
  Brain,
  Palette,
  Users,
  Code,
  GamepadIcon,
  FolderOpen,
  Wrench,
  Filter,
  SortAsc,
  Layout,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { DASHBOARD_MODULES, TOOLS, getToolsByCategory, searchTools } from '@/utils/toolsConfig';
import { useWindowManager } from '@/hooks/useWindowManager';
import { DashboardModule, Tool } from '@/types';

interface DashboardProps {
  className?: string;
}

export default function Dashboard({ className }: DashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const { openWindow } = useWindowManager();

  // Carica preferenze utente
  useEffect(() => {
    const savedFavorites = localStorage.getItem('manus_favorite_tools');
    const savedRecent = localStorage.getItem('manus_recent_tools');
    
    if (savedFavorites) setFavoriteTools(JSON.parse(savedFavorites));
    if (savedRecent) setRecentTools(JSON.parse(savedRecent));
  }, []);

  // Filtro tools
  const filteredTools = React.useMemo(() => {
    let tools = searchQuery ? searchTools(searchQuery) : TOOLS;
    
    if (selectedCategory !== 'all') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }
    
    return tools;
  }, [searchQuery, selectedCategory]);

  // Gestione apertura tool
  const handleOpenTool = (tool: Tool) => {
    openWindow(tool);
    
    // Aggiorna tools recenti
    const updatedRecent = [tool.id, ...recentTools.filter(id => id !== tool.id)].slice(0, 10);
    setRecentTools(updatedRecent);
    localStorage.setItem('manus_recent_tools', JSON.stringify(updatedRecent));
  };

  // Toggle favoriti
  const toggleFavorite = (toolId: string) => {
    const updatedFavorites = favoriteTools.includes(toolId)
      ? favoriteTools.filter(id => id !== toolId)
      : [...favoriteTools, toolId];
    
    setFavoriteTools(updatedFavorites);
    localStorage.setItem('manus_favorite_tools', JSON.stringify(updatedFavorites));
  };

  // Categorie con contatori
  const categories = [
    { id: 'all', name: 'Tutti', icon: '🔍', count: TOOLS.length },
    { id: 'web-search', name: 'Ricerca Web', icon: '🌐', count: getToolsByCategory('web-search').length },
    { id: 'ai-engine', name: 'AI Engine', icon: '🤖', count: getToolsByCategory('ai-engine').length },
    { id: 'creative-suite', name: 'Creative', icon: '🎨', count: getToolsByCategory('creative-suite').length },
    { id: 'productivity', name: 'Produttività', icon: '📊', count: getToolsByCategory('productivity').length },
    { id: 'web-api', name: 'Developer', icon: '⚙️', count: getToolsByCategory('web-api').length },
    { id: 'entertainment', name: 'Entertainment', icon: '🎮', count: getToolsByCategory('entertainment').length },
    { id: 'file-management', name: 'File', icon: '📁', count: getToolsByCategory('file-management').length },
    { id: 'advanced-tools', name: 'Tools', icon: '🔧', count: getToolsByCategory('advanced-tools').length }
  ];

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900", className)}>
      
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Manus AI Ultra</h1>
                <p className="text-lg opacity-90">La Suite di Intelligenza Artificiale Più Avanzata</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm opacity-80">
              <div className="flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                <span>{TOOLS.length} Strumenti</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                <span>Zero Limitazioni</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Multi-Utente</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cerca tra 60+ strumenti avanzati..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 text-lg border-0 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* View Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TabsList className="grid grid-cols-3 lg:grid-cols-9 gap-1 h-auto p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-xs font-medium">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          {/* Tools Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
            >
              {/* Quick Access Section */}
              {selectedCategory === 'all' && (
                <div className="mb-8 space-y-6">
                  
                  {/* Preferiti */}
                  {favoriteTools.length > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          Preferiti
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {favoriteTools.slice(0, 6).map(toolId => {
                            const tool = TOOLS.find(t => t.id === toolId);
                            if (!tool) return null;
                            return (
                              <Button
                                key={tool.id}
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4 hover:scale-105 transition-transform"
                                onClick={() => handleOpenTool(tool)}
                              >
                                <span className="text-2xl">{tool.icon}</span>
                                <span className="text-xs text-center">{tool.name}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Recenti */}
                  {recentTools.length > 0 && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-blue-500" />
                          Usati di Recente
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {recentTools.slice(0, 6).map(toolId => {
                            const tool = TOOLS.find(t => t.id === toolId);
                            if (!tool) return null;
                            return (
                              <Button
                                key={tool.id}
                                variant="outline"
                                className="h-auto flex-col gap-2 p-4 hover:scale-105 transition-transform"
                                onClick={() => handleOpenTool(tool)}
                              >
                                <span className="text-2xl">{tool.icon}</span>
                                <span className="text-xs text-center">{tool.name}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Moduli Dashboard */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="h-5 w-5 text-purple-500" />
                        Moduli Dashboard
                      </CardTitle>
                      <CardDescription>
                        Centri di controllo specializzati per ogni categoria
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {DASHBOARD_MODULES.map((module) => (
                          <Card
                            key={module.id}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-purple-200 dark:hover:border-purple-700"
                            onClick={() => setSelectedCategory(module.tools[0]?.category || 'all')}
                          >
                            <CardContent className="p-4 text-center">
                              <div className="text-3xl mb-2">{module.icon}</div>
                              <h3 className="font-semibold mb-1">{module.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {module.description}
                              </p>
                              <Badge variant="outline">
                                {module.tools.length} strumenti
                              </Badge>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Tools Grid/List */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {selectedCategory === 'all' ? 'Tutti gli Strumenti' : categories.find(c => c.id === selectedCategory)?.name}
                      </CardTitle>
                      <CardDescription>
                        {filteredTools.length} strumenti disponibili
                      </CardDescription>
                    </div>
                    {filteredTools.length > 0 && (
                      <Badge variant="secondary" className="text-sm">
                        {filteredTools.length} / {TOOLS.length}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredTools.length > 0 ? (
                    <div className={cn(
                      "gap-4",
                      viewMode === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                        : "space-y-2"
                    )}>
                      {filteredTools.map((tool, index) => (
                        <motion.div
                          key={tool.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          {viewMode === 'grid' ? (
                            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 group hover:scale-105 border-2 hover:border-purple-200 dark:hover:border-purple-700">
                              <CardContent className="p-6 text-center">
                                <div className="relative">
                                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                                    {tool.icon}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleFavorite(tool.id);
                                    }}
                                  >
                                    <Star 
                                      className={cn(
                                        "h-4 w-4",
                                        favoriteTools.includes(tool.id) 
                                          ? "fill-yellow-400 text-yellow-400" 
                                          : "text-gray-400"
                                      )}
                                    />
                                  </Button>
                                </div>
                                
                                <h3 className="font-semibold mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                  {tool.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                  {tool.description}
                                </p>
                                
                                <Button
                                  className="w-full group-hover:bg-purple-600 group-hover:text-white transition-colors"
                                  onClick={() => handleOpenTool(tool)}
                                >
                                  Apri Strumento
                                  <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                              </CardContent>
                            </Card>
                          ) : (
                            <Card className="cursor-pointer hover:shadow-md transition-all duration-200 border hover:border-purple-200 dark:hover:border-purple-700">
                              <CardContent className="p-4">
                                <div className="flex items-center gap-4">
                                  <div className="text-2xl">{tool.icon}</div>
                                  <div className="flex-1">
                                    <h3 className="font-semibold">{tool.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                      {tool.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(tool.id);
                                      }}
                                    >
                                      <Star 
                                        className={cn(
                                          "h-4 w-4",
                                          favoriteTools.includes(tool.id) 
                                            ? "fill-yellow-400 text-yellow-400" 
                                            : "text-gray-400"
                                        )}
                                      />
                                    </Button>
                                    <Button
                                      onClick={() => handleOpenTool(tool)}
                                    >
                                      Apri
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-lg font-semibold mb-2">Nessun strumento trovato</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Prova a modificare i filtri di ricerca
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
