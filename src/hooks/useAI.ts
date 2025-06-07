// ========================================
// MANUS AI ULTRA - AI ENGINE HOOK
// ========================================

import { useState, useCallback, useEffect } from 'react';
import { AIMessage, FileItem, UseAIEngineReturn, ConversationContext } from '@/types';
import { aiService } from '@/services/aiService';

export function useAI(): UseAIEngineReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, conversationId?: string): Promise<AIMessage> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const response = await aiService.sendMessage(message, conversationId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'elaborazione del messaggio';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateCode = useCallback(async (language: string, description: string): Promise<string> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const code = await aiService.generateCode(language, description);
      return code;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la generazione del codice';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const analyzeDocument = useCallback(async (file: FileItem): Promise<any> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const analysis = await aiService.analyzeDocument(file);
      return analysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante l\'analisi del documento';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateImage = useCallback(async (prompt: string): Promise<string> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const imageUrl = await aiService.generateImage(prompt);
      return imageUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la generazione dell\'immagine';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const translate = useCallback(async (text: string, from: string, to: string): Promise<string> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const translation = await aiService.translate(text, from, to);
      return translation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la traduzione';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const summarize = useCallback(async (text: string): Promise<string> => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const summary = await aiService.summarize(text);
      return summary;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore durante la creazione del riassunto';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    sendMessage,
    generateCode,
    analyzeDocument,
    generateImage,
    translate,
    summarize,
    isProcessing,
    error
  };
}

// Hook per la gestione delle conversazioni
export function useConversations() {
  const [conversations, setConversations] = useState<ConversationContext[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);

  useEffect(() => {
    // Carica conversazioni salvate
    loadConversations();
  }, []);

  const loadConversations = useCallback(() => {
    const allConversations = aiService.getAllConversations();
    setConversations(allConversations);
  }, []);

  const createConversation = useCallback((title?: string): string => {
    const id = aiService.createConversation(title);
    loadConversations();
    setCurrentConversationId(id);
    return id;
  }, [loadConversations]);

  const deleteConversation = useCallback((id: string): boolean => {
    const deleted = aiService.deleteConversation(id);
    if (deleted) {
      loadConversations();
      if (currentConversationId === id) {
        setCurrentConversationId(null);
      }
    }
    return deleted;
  }, [currentConversationId, loadConversations]);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  const getCurrentConversation = useCallback((): ConversationContext | undefined => {
    return currentConversationId ? aiService.getConversation(currentConversationId) : undefined;
  }, [currentConversationId]);

  return {
    conversations,
    currentConversationId,
    createConversation,
    deleteConversation,
    selectConversation,
    getCurrentConversation,
    loadConversations
  };
}

// Hook per le capacità AI
export function useAICapabilities() {
  const [capabilities, setCapabilities] = useState(aiService.getCapabilities());
  const [systemStatus, setSystemStatus] = useState(aiService.getSystemStatus());

  const refreshCapabilities = useCallback(() => {
    setCapabilities(aiService.getCapabilities());
    setSystemStatus(aiService.getSystemStatus());
  }, []);

  const runSelfTest = useCallback(async (): Promise<boolean> => {
    try {
      const result = await aiService.runSelfTest();
      refreshCapabilities();
      return result;
    } catch (error) {
      console.error('AI Self Test Error:', error);
      return false;
    }
  }, [refreshCapabilities]);

  useEffect(() => {
    // Refresh periodico dello status
    const interval = setInterval(refreshCapabilities, 30000); // ogni 30 secondi
    return () => clearInterval(interval);
  }, [refreshCapabilities]);

  return {
    capabilities,
    systemStatus,
    refreshCapabilities,
    runSelfTest
  };
}
