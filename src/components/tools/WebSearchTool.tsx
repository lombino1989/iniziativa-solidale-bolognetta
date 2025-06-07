// ========================================
// MANUS AI ULTRA - WEB SEARCH TOOL
// ========================================

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  Clock, 
  Star,
  Filter,
  SortAsc,
  Download,
  Share,
  Copy,
  History,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { realSearchService, type SearchResult, type NewsResult, type ImageResult } from '@/services/realSearchService';

interface WebSearchToolProps {
  tool?: any;
}

export default function WebSearchTool({ tool }: WebSearchToolProps) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [webResults, setWebResults] = useState<SearchResult[]>([]);
  const [newsResults, setNewsResults] = useState<NewsResult[]>([]);
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [videoResults, setVideoResults] = useState<SearchResult[]>([]);
  const [allResults, setAllResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'all') {
        // Ricerca unificata su tutti i tipi
        const [webRes, newsRes, imagesRes, videosRes] = await Promise.all([
          realSearchService.searchWeb(query, 5),
          realSearchService.searchNews(query, 5),
          realSearchService.searchImages(query, 6),
          realSearchService.searchVideos(query, 4)
        ]);
        
        setWebResults(webRes);
        setNewsResults(newsRes);
        setImageResults(imagesRes);
        setVideoResults(videosRes);
        setAllResults({
          web: webRes,
          news: newsRes,
          images: imagesRes,
          videos: videosRes
        });
      } else if (activeTab === 'web') {
        const results = await realSearchService.searchWeb(query, 15);
        setWebResults(results);
      } else if (activeTab === 'news') {
        const results = await realSearchService.searchNews(query, 15);
        setNewsResults(results);
      } else if (activeTab === 'images') {
        const results = await realSearchService.searchImages(query, 20);
        setImageResults(results);
      } else if (activeTab === 'videos') {
        const results = await realSearchService.searchVideos(query, 12);
        setVideoResults(results);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Errore durante la ricerca. Riprova.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-8 w-8" />
          <div>
            <h2 className="text-2xl font-bold">Ricerca Web Avanzata</h2>
            <p className="opacity-90">Ricerca intelligente multi-fonte in tempo reale</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Inserisci la tua ricerca..."
              className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={!query.trim() || isLoading}
            className="h-12 px-8 bg-white text-blue-600 hover:bg-gray-100"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Cerca
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-14 grid grid-cols-5 gap-0 rounded-none bg-transparent">
            <TabsTrigger value="all" className="flex-col gap-1 h-12">
              <span className="text-sm">🔍</span>
              <span className="text-xs">Tutto</span>
            </TabsTrigger>
            <TabsTrigger value="web" className="flex-col gap-1 h-12">
              <span className="text-sm">🌐</span>
              <span className="text-xs">Web</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex-col gap-1 h-12">
              <span className="text-sm">📰</span>
              <span className="text-xs">News</span>
            </TabsTrigger>
            <TabsTrigger value="images" className="flex-col gap-1 h-12">
              <span className="text-sm">🖼️</span>
              <span className="text-xs">Immagini</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-col gap-1 h-12">
              <span className="text-sm">🎥</span>
              <span className="text-xs">Video</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-6">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <span className="text-lg">⚠️</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Results View */}
        {activeTab === 'all' && allResults && (
          <div className="space-y-6">
            {/* Web Results Summary */}
            {webResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Risultati Web
                    <Badge>{webResults.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {webResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 
                            className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                            onClick={() => openLink(result.url)}
                          >
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {result.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{result.source}</span>
                            <span>•</span>
                            <span>🌐 {new URL(result.url).hostname}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => openLink(result.url)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.url)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {webResults.length > 3 && (
                    <Button variant="outline" onClick={() => setActiveTab('web')}>
                      Vedi tutti i {webResults.length} risultati web
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* News Results Summary */}
            {newsResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">📰</span>
                    Ultime News
                    <Badge>{newsResults.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {newsResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 
                            className="font-medium text-green-600 dark:text-green-400 cursor-pointer hover:underline"
                            onClick={() => openLink(result.url)}
                          >
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {result.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{result.source}</span>
                            <span>•</span>
                            <span>{result.publishedAt}</span>
                            {result.author && (
                              <>
                                <span>•</span>
                                <span>{result.author}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => openLink(result.url)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {newsResults.length > 3 && (
                    <Button variant="outline" onClick={() => setActiveTab('news')}>
                      Vedi tutte le {newsResults.length} news
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Images Preview */}
            {imageResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🖼️</span>
                    Immagini
                    <Badge>{imageResults.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-3">
                    {imageResults.slice(0, 8).map((image) => (
                      <div key={image.id} className="relative group cursor-pointer">
                        <img
                          src={image.thumbnail || image.imageUrl}
                          alt={image.title}
                          className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition-opacity"
                          onClick={() => openLink(image.url)}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                  {imageResults.length > 8 && (
                    <Button variant="outline" className="mt-3" onClick={() => setActiveTab('images')}>
                      Vedi tutte le {imageResults.length} immagini
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Videos Preview */}
            {videoResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-lg">🎥</span>
                    Video
                    <Badge>{videoResults.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {videoResults.slice(0, 2).map((video) => (
                    <div key={video.id} className="flex gap-3 cursor-pointer" onClick={() => openLink(video.url)}>
                      <img
                        src={video.thumbnail || ''}
                        alt={video.title}
                        className="w-32 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-purple-600 dark:text-purple-400 hover:underline">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>Video</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {videoResults.length > 2 && (
                    <Button variant="outline" onClick={() => setActiveTab('videos')}>
                      Vedi tutti i {videoResults.length} video
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Individual Tab Results */}
        {activeTab !== 'all' && (
          <div>
            {activeTab === 'web' && webResults.length > 0 && (
              <div className="space-y-4">
                {webResults.map((result) => (
                  <Card key={result.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 
                            className="font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline text-lg"
                            onClick={() => openLink(result.url)}
                          >
                            {result.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {result.description}
                          </p>
                          <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {result.source}
                            </span>
                            <span>•</span>
                            <span>{new URL(result.url).hostname}</span>

                          </div>
                        </div>
                        <div className="flex gap-1 ml-4">
                          <Button variant="ghost" size="sm" onClick={() => openLink(result.url)}>
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(result.url)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Similar structure for other tabs... */}
            {/* News, Images, Videos tabs implementation */}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !webResults.length && !newsResults.length && !imageResults.length && !videoResults.length && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Inizia la tua ricerca</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Digita qualsiasi cosa nella barra di ricerca per trovare risultati da tutto il web
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <Button variant="outline" onClick={() => setQuery('intelligenza artificiale')}>
                <span className="mr-2">🤖</span>
                AI Technology
              </Button>
              <Button variant="outline" onClick={() => setQuery('notizie oggi')}>
                <span className="mr-2">📰</span>
                Ultime News
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
