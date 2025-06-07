import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { 
  Type,
  FileText,
  Copy,
  Download,
  RotateCcw,
  Search,
  Replace,
  Hash,
  ArrowUpDown,
  Shuffle,
  Filter,
  Eye,
  Calculator
} from 'lucide-react';

interface TextToolsToolProps {
  tool: {
    id: string;
    name: string;
    description: string;
  };
}

interface ProcessingHistory {
  id: string;
  operation: string;
  input: string;
  output: string;
  timestamp: number;
}

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: number;
  averageWordsPerSentence: number;
  longestWord: string;
}

export default function TextToolsTool({ tool }: TextToolsToolProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const [history, setHistory] = useState<ProcessingHistory[]>([]);
  const [textStats, setTextStats] = useState<TextStats | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('manus_text_tools_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.warn('Errore caricamento cronologia Text Tools:', error);
    }
  }, []);

  // Calculate text statistics
  useEffect(() => {
    if (inputText) {
      setTextStats(calculateTextStats(inputText));
    } else {
      setTextStats(null);
    }
  }, [inputText]);

  // Save to history
  const saveToHistory = (operation: string, input: string, output: string) => {
    const newEntry: ProcessingHistory = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      operation,
      input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
      output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
      timestamp: Date.now()
    };

    const updatedHistory = [newEntry, ...history].slice(0, 50); // Keep last 50
    setHistory(updatedHistory);

    try {
      localStorage.setItem('manus_text_tools_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('Errore salvataggio cronologia Text Tools:', error);
    }
  };

  // Calculate comprehensive text statistics
  const calculateTextStats = (text: string): TextStats => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    const lines = text.split('\n').length;
    const readingTime = Math.ceil(words / 200); // Average reading speed: 200 words per minute
    const averageWordsPerSentence = sentences > 0 ? Math.round((words / sentences) * 10) / 10 : 0;
    
    // Find longest word
    const wordList = text.toLowerCase().match(/\b\w+\b/g);
    let longestWord = '';
    if (wordList) {
      for (const word of wordList) {
        if (word.length > longestWord.length) {
          longestWord = word;
        }
      }
    }

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      averageWordsPerSentence,
      longestWord
    };
  };

  // Text transformation functions
  const transformToUpperCase = () => {
    const result = inputText.toUpperCase();
    setOutputText(result);
    saveToHistory('Maiuscolo', inputText, result);
  };

  const transformToLowerCase = () => {
    const result = inputText.toLowerCase();
    setOutputText(result);
    saveToHistory('Minuscolo', inputText, result);
  };

  const transformToTitleCase = () => {
    const result = inputText.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    setOutputText(result);
    saveToHistory('Titolo', inputText, result);
  };

  const transformToCamelCase = () => {
    const result = inputText
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase())
      .replace(/\s+/g, '');
    setOutputText(result);
    saveToHistory('CamelCase', inputText, result);
  };

  const transformToSnakeCase = () => {
    const result = inputText
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
    setOutputText(result);
    saveToHistory('Snake_case', inputText, result);
  };

  const transformToKebabCase = () => {
    const result = inputText
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setOutputText(result);
    saveToHistory('Kebab-case', inputText, result);
  };

  // Text cleaning functions
  const removeExtraSpaces = () => {
    const result = inputText.replace(/\s+/g, ' ').trim();
    setOutputText(result);
    saveToHistory('Rimuovi spazi extra', inputText, result);
  };

  const removeLineBreaks = () => {
    const result = inputText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    setOutputText(result);
    saveToHistory('Rimuovi a capo', inputText, result);
  };

  const removePunctuation = () => {
    const result = inputText.replace(/[^\w\s]/g, '');
    setOutputText(result);
    saveToHistory('Rimuovi punteggiatura', inputText, result);
  };

  const removeNumbers = () => {
    const result = inputText.replace(/\d/g, '');
    setOutputText(result);
    saveToHistory('Rimuovi numeri', inputText, result);
  };

  const trimLines = () => {
    const result = inputText.split('\n').map(line => line.trim()).join('\n');
    setOutputText(result);
    saveToHistory('Trim righe', inputText, result);
  };

  // Text manipulation functions
  const reverseText = () => {
    const result = inputText.split('').reverse().join('');
    setOutputText(result);
    saveToHistory('Inverti testo', inputText, result);
  };

  const shuffleWords = () => {
    const words = inputText.split(/\s+/);
    for (let i = words.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [words[i], words[j]] = [words[j], words[i]];
    }
    const result = words.join(' ');
    setOutputText(result);
    saveToHistory('Mischia parole', inputText, result);
  };

  const sortLines = (ascending: boolean = true) => {
    const lines = inputText.split('\n');
    const sorted = ascending 
      ? lines.sort((a, b) => a.localeCompare(b))
      : lines.sort((a, b) => b.localeCompare(a));
    const result = sorted.join('\n');
    setOutputText(result);
    saveToHistory(`Ordina righe ${ascending ? 'ASC' : 'DESC'}`, inputText, result);
  };

  const removeDuplicateLines = () => {
    const lines = inputText.split('\n');
    const unique = [...new Set(lines)];
    const result = unique.join('\n');
    setOutputText(result);
    saveToHistory('Rimuovi duplicati', inputText, result);
  };

  const numberLines = () => {
    const lines = inputText.split('\n');
    const numbered = lines.map((line, index) => `${index + 1}. ${line}`);
    const result = numbered.join('\n');
    setOutputText(result);
    saveToHistory('Numera righe', inputText, result);
  };

  // Search and replace
  const searchAndReplace = () => {
    if (!searchTerm) return;
    
    let result;
    if (useRegex) {
      try {
        const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
        result = inputText.replace(regex, replaceTerm);
      } catch (error) {
        alert('Regex non valida');
        return;
      }
    } else {
      const searchFlags = caseSensitive ? 'g' : 'gi';
      const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedSearch, searchFlags);
      result = inputText.replace(regex, replaceTerm);
    }
    
    setOutputText(result);
    saveToHistory(`Sostituisci "${searchTerm}" con "${replaceTerm}"`, inputText, result);
  };

  // Extract functions
  const extractEmails = () => {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = inputText.match(emailRegex) || [];
    const result = emails.join('\n');
    setOutputText(result);
    saveToHistory('Estrai email', inputText, result);
  };

  const extractUrls = () => {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const urls = inputText.match(urlRegex) || [];
    const result = urls.join('\n');
    setOutputText(result);
    saveToHistory('Estrai URL', inputText, result);
  };

  const extractNumbers = () => {
    const numberRegex = /\d+(?:\.\d+)?/g;
    const numbers = inputText.match(numberRegex) || [];
    const result = numbers.join('\n');
    setOutputText(result);
    saveToHistory('Estrai numeri', inputText, result);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Download result
  const downloadResult = () => {
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `text_processed_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="flex items-center gap-3">
          <Type className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Text Tools</h2>
            <p className="text-sm opacity-90">Suite completa per l'elaborazione e analisi del testo</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          
          {/* Input/Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Testo di Input
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Inserisci il testo da elaborare..."
                  className="min-h-64 resize-none"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{inputText.length} caratteri</span>
                  {textStats && (
                    <span>{textStats.words} parole, {textStats.sentences} frasi</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Output */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Risultato
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(outputText)}
                      disabled={!outputText}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={downloadResult}
                      disabled={!outputText}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={outputText}
                  readOnly
                  className="min-h-64 resize-none bg-gray-50 dark:bg-gray-800"
                  placeholder="Il risultato apparirà qui..."
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>{outputText.length} caratteri</span>
                  <span>{outputText.split(' ').filter(w => w.length > 0).length} parole</span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Statistics Card */}
          {textStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Statistiche Testo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{textStats.characters}</div>
                    <div className="text-xs text-gray-500">Caratteri</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{textStats.words}</div>
                    <div className="text-xs text-gray-500">Parole</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{textStats.sentences}</div>
                    <div className="text-xs text-gray-500">Frasi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{textStats.paragraphs}</div>
                    <div className="text-xs text-gray-500">Paragrafi</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{textStats.readingTime}m</div>
                    <div className="text-xs text-gray-500">Lettura</div>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Parola più lunga:</strong> {textStats.longestWord}</p>
                  <p><strong>Media parole per frase:</strong> {textStats.averageWordsPerSentence}</p>
                  <p><strong>Caratteri senza spazi:</strong> {textStats.charactersNoSpaces}</p>
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Tools Panel */}
        <div className="w-80 space-y-4">
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="transform">Trasforma</TabsTrigger>
              <TabsTrigger value="clean">Pulisci</TabsTrigger>
              <TabsTrigger value="manipulate">Manipola</TabsTrigger>
              <TabsTrigger value="extract">Estrai</TabsTrigger>
            </TabsList>

            {/* Transform Tab */}
            <TabsContent value="transform" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Trasformazioni Testo</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={transformToUpperCase}>
                    MAIUSCOLO
                  </Button>
                  <Button variant="outline" size="sm" onClick={transformToLowerCase}>
                    minuscolo
                  </Button>
                  <Button variant="outline" size="sm" onClick={transformToTitleCase}>
                    Titolo
                  </Button>
                  <Button variant="outline" size="sm" onClick={transformToCamelCase}>
                    camelCase
                  </Button>
                  <Button variant="outline" size="sm" onClick={transformToSnakeCase}>
                    snake_case
                  </Button>
                  <Button variant="outline" size="sm" onClick={transformToKebabCase}>
                    kebab-case
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Clean Tab */}
            <TabsContent value="clean" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pulizia Testo</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" onClick={removeExtraSpaces}>
                    <Filter className="h-4 w-4 mr-2" />
                    Rimuovi Spazi Extra
                  </Button>
                  <Button variant="outline" size="sm" onClick={removeLineBreaks}>
                    Rimuovi A Capo
                  </Button>
                  <Button variant="outline" size="sm" onClick={removePunctuation}>
                    Rimuovi Punteggiatura
                  </Button>
                  <Button variant="outline" size="sm" onClick={removeNumbers}>
                    <Hash className="h-4 w-4 mr-2" />
                    Rimuovi Numeri
                  </Button>
                  <Button variant="outline" size="sm" onClick={trimLines}>
                    Trim Righe
                  </Button>
                </CardContent>
              </Card>

              {/* Search & Replace */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Replace className="h-4 w-4" />
                    Cerca e Sostituisci
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Cerca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Input
                    placeholder="Sostituisci con..."
                    value={replaceTerm}
                    onChange={(e) => setReplaceTerm(e.target.value)}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Switch
                        id="case-sensitive"
                        checked={caseSensitive}
                        onCheckedChange={setCaseSensitive}
                      />
                      <label htmlFor="case-sensitive">Case sensitive</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="use-regex"
                        checked={useRegex}
                        onCheckedChange={setUseRegex}
                      />
                      <label htmlFor="use-regex">RegEx</label>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={searchAndReplace} 
                    className="w-full"
                    disabled={!searchTerm}
                  >
                    <Replace className="h-4 w-4 mr-2" />
                    Sostituisci
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Manipulate Tab */}
            <TabsContent value="manipulate" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Manipolazione</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" onClick={reverseText}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Inverti Testo
                  </Button>
                  <Button variant="outline" size="sm" onClick={shuffleWords}>
                    <Shuffle className="h-4 w-4 mr-2" />
                    Mischia Parole
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sortLines(true)}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Ordina Righe A-Z
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => sortLines(false)}>
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Ordina Righe Z-A
                  </Button>
                  <Button variant="outline" size="sm" onClick={removeDuplicateLines}>
                    Rimuovi Duplicati
                  </Button>
                  <Button variant="outline" size="sm" onClick={numberLines}>
                    Numera Righe
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Extract Tab */}
            <TabsContent value="extract" className="space-y-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Estrazione</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" onClick={extractEmails}>
                    📧 Estrai Email
                  </Button>
                  <Button variant="outline" size="sm" onClick={extractUrls}>
                    🔗 Estrai URL
                  </Button>
                  <Button variant="outline" size="sm" onClick={extractNumbers}>
                    <Hash className="h-4 w-4 mr-2" />
                    Estrai Numeri
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

          {/* History */}
          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cronologia Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {history.slice(0, 10).map((operation) => (
                    <div
                      key={operation.id}
                      className="text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded"
                    >
                      <div className="font-medium">{operation.operation}</div>
                      <div className="text-gray-500 mt-1">
                        {new Date(operation.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

      </div>
    </div>
  );
}
