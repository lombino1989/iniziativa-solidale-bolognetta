// ========================================
// MANUS AI ULTRA - AI CHAT TOOL
// ========================================

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Copy, 
  Download,
  RefreshCw,
  Sparkles,
  Brain,
  Code,
  Image,
  FileText,
  Languages,
  Loader2,
  MessageSquare,
  Zap,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAI, useConversations } from '@/hooks/useAI';
import { AIMessage } from '@/types';
import ReactMarkdown from 'react-markdown';

interface ChatToolProps {
  tool?: any;
}

interface MessageBubbleProps {
  message: AIMessage;
  onCopy: (text: string) => void;
  onRegenerate?: () => void;
}

function MessageBubble({ message, onCopy, onRegenerate }: MessageBubbleProps) {
  const isUser = message.type === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3 max-w-4xl",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-blue-500 text-white" 
          : "bg-gradient-to-br from-purple-500 to-blue-500 text-white"
      )}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 space-y-2",
        isUser ? "text-right" : "text-left"
      )}>
        <Card className={cn(
          "inline-block max-w-full",
          isUser 
            ? "bg-blue-500 text-white border-blue-500" 
            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
        )}>
          <CardContent className="p-4">
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Message Metadata */}
        <div className={cn(
          "flex items-center gap-2 text-xs text-gray-500",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
          {message.metadata?.responseTime && (
            <>
              <span>•</span>
              <span>{(message.metadata.responseTime / 1000).toFixed(1)}s</span>
            </>
          )}
          {message.metadata?.confidence && (
            <>
              <span>•</span>
              <span>Fiducia: {(message.metadata.confidence * 100).toFixed(0)}%</span>
            </>
          )}
        </div>

        {/* Message Actions */}
        {!isUser && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(message.content)}
              className="h-8 text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copia
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRegenerate}
              className="h-8 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Rigenera
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatTool({ tool }: ChatToolProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `🚀 **Ciao! Sono Manus AI Ultra**, il tuo assistente di intelligenza artificiale più avanzato.

**Cosa posso fare per te oggi?**

• 💬 **Chat Intelligente** - Conversazioni naturali su qualsiasi argomento
• 💻 **Generazione Codice** - Scrivo codice in tutti i linguaggi di programmazione
• 🎨 **Creazione Immagini** - Genero immagini AI da descrizioni testuali
• 📄 **Analisi Documenti** - Analizzo PDF, Word, Excel e altri formati
• 🌍 **Traduzioni** - Traduco in oltre 100 lingue
• 📝 **Riassunti** - Creo riassunti intelligenti di testi lunghi
• 🧮 **Calcoli Avanzati** - Risolvo problemi matematici complessi
• 🔍 **Ricerca Informazioni** - Cerco e analizzo informazioni dal web

**Modalità speciali:**
- Scrivi "CODE:" per generazione codice
- Scrivi "IMAGE:" per creazione immagini  
- Scrivi "TRANSLATE:" per traduzioni
- Scrivi "ANALYZE:" per analisi documenti

Dimmi, su cosa vuoi lavorare insieme?`,
      timestamp: Date.now()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { sendMessage, isProcessing } = useAI();
  const { currentConversationId, createConversation } = useConversations();

  // Auto-scroll ai nuovi messaggi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    try {
      const aiResponse = await sendMessage(inputValue.trim());
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: AIMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: '❌ Mi dispiace, si è verificato un errore durante l\'elaborazione del messaggio. Riprova.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'it-IT';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(prev => prev + transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.start();
    }
  };

  const quickActions = [
    {
      label: 'Genera Codice',
      icon: Code,
      prompt: 'CODE: Crea una funzione JavaScript per validare un indirizzo email'
    },
    {
      label: 'Crea Immagine',
      icon: Image,
      prompt: 'IMAGE: Un robot futuristico in stile cyberpunk con colori viola e blu'
    },
    {
      label: 'Traduci Testo',
      icon: Languages,
      prompt: 'TRANSLATE: Hello, how are you today? (da inglese a italiano)'
    },
    {
      label: 'Riassumi',
      icon: FileText,
      prompt: 'Riassumi in 3 punti chiave i vantaggi dell\'intelligenza artificiale'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Manus AI Ultra</h2>
              <p className="text-sm opacity-90">Assistente AI Multi-Modale</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              <Zap className="h-3 w-3 mr-1" />
              Ultra Mode
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-white border-green-500/30">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              Online
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-2 overflow-x-auto">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 whitespace-nowrap"
              onClick={() => setInputValue(action.prompt)}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onCopy={copyToClipboard}
              onRegenerate={() => {
                // Implementa rigenerazione messaggio
                console.log('Regenerate message:', message.id);
              }}
            />
          ))}
        </AnimatePresence>
        
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-4xl mr-auto"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Manus AI sta elaborando la tua richiesta...
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Scrivi il tuo messaggio... (Shift+Enter per nuova riga)"
                className="min-h-[50px] max-h-32 resize-none pr-12 focus:ring-purple-500"
                rows={1}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 bottom-2 h-8 w-8 p-0"
                onClick={handleVoiceInput}
                disabled={isListening}
              >
                {isListening ? (
                  <MicOff className="h-4 w-4 text-red-500" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Invia
                </>
              )}
            </Button>
          </div>

          {/* Input Hints */}
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>💬 Chat naturale</span>
              <span>🎤 Comandi vocali</span>
              <span>⚡ Risposte istantanee</span>
            </div>
            <div>
              {inputValue.length > 0 && (
                <span>{inputValue.length} caratteri</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
