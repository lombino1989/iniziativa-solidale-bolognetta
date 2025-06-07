// ========================================
// MANUS AI ULTRA - SEARCH HOOK
// ========================================

import { useState, useCallback } from 'react';
import { SearchResult, NewsResult, ImageResult, VideoResult, UseSearchReturn } from '@/types';
import { searchService } from '@/services/searchService';

export function useSearch(): UseSearchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchWeb = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchWeb(query);
      searchService.saveSearchHistory(query, 'web');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca web';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchNews = useCallback(async (query: string): Promise<NewsResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchNews(query);
      searchService.saveSearchHistory(query, 'news');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca news';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchImages = useCallback(async (query: string): Promise<ImageResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchImages(query);
      searchService.saveSearchHistory(query, 'images');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca immagini';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchVideos = useCallback(async (query: string): Promise<VideoResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchVideos(query);
      searchService.saveSearchHistory(query, 'videos');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca video';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchWeb,
    searchNews,
    searchImages,
    searchVideos,
    isLoading,
    error
  };
}

// Hook specializzato per ricerca unificata
export function useUnifiedSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAll = useCallback(async (query: string) => {
    if (!query.trim()) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchAll(query);
      searchService.saveSearchHistory(query, 'unified');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca unificata';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchAcademic = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchAcademic(query);
      searchService.saveSearchHistory(query, 'academic');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca accademica';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchSocial = useCallback(async (query: string): Promise<SearchResult[]> => {
    if (!query.trim()) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await searchService.searchSocial(query);
      searchService.saveSearchHistory(query, 'social');
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la ricerca social';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchAll,
    searchAcademic,
    searchSocial,
    isLoading,
    error
  };
}
