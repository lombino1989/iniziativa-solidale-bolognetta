import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  BarChart3,
  FileImage,
  FileSpreadsheet,
  Presentation,
  CheckCircle,
  AlertCircle,
  Brain,
  Languages,
  Hash
} from 'lucide-react';

interface DocumentAnalyzerToolProps {
  tool: {
    id: string;
    name: string;
    description: string;
  };
}

interface AnalysisResult {
  fileInfo: {
    name: string;
    size: number;
    type: string;
    pages?: number;
  };
  textContent: string;
  summary: string;
  keyPoints: string[];
  sentiment: {
    score: number;
    label: string;
    confidence: number;
  };
  keywords: string[];
  readability: {
    score: number;
    level: string;
    readingTime: number;
  };
  languages: string[];
  statistics: {
    words: number;
    sentences: number;
    paragraphs: number;
    characters: number;
  };
}

export default function DocumentAnalyzerTool({ tool }: DocumentAnalyzerToolProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supported file types
  const SUPPORTED_TYPES = {
    'application/pdf': { icon: FileText, name: 'PDF', color: 'text-red-600' },
    'application/msword': { icon: FileText, name: 'Word', color: 'text-blue-600' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: FileText, name: 'Word', color: 'text-blue-600' },
    'application/vnd.ms-excel': { icon: FileSpreadsheet, name: 'Excel', color: 'text-green-600' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { icon: FileSpreadsheet, name: 'Excel', color: 'text-green-600' },
    'application/vnd.ms-powerpoint': { icon: Presentation, name: 'PowerPoint', color: 'text-orange-600' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { icon: Presentation, name: 'PowerPoint', color: 'text-orange-600' },
    'text/plain': { icon: FileText, name: 'Text', color: 'text-gray-600' },
    'text/rtf': { icon: FileText, name: 'RTF', color: 'text-purple-600' }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('File troppo grande. Massimo 50MB.');
      return;
    }

    if (!Object.keys(SUPPORTED_TYPES).includes(file.type)) {
      alert('Tipo di file non supportato.');
      return;
    }

    setSelectedFile(file);
    setResult(null);
  };

  // Simulate advanced document analysis
  const analyzeDocument = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setProgress(0);

    // Simulate progressive analysis
    const steps = [
      { name: 'Lettura file...', duration: 800 },
      { name: 'Estrazione testo...', duration: 1200 },
      { name: 'Analisi linguistica...', duration: 1000 },
      { name: 'Sentiment analysis...', duration: 900 },
      { name: 'Generazione riassunto...', duration: 1100 },
      { name: 'Estrazione keywords...', duration: 700 },
      { name: 'Calcolo metriche...', duration: 600 }
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // Simulate analysis results
    const mockResult: AnalysisResult = {
      fileInfo: {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        pages: Math.floor(Math.random() * 50) + 1
      },
      textContent: generateMockText(),
      summary: generateMockSummary(),
      keyPoints: generateMockKeyPoints(),
      sentiment: {
        score: Math.random() * 2 - 1, // -1 to 1
        label: Math.random() > 0.5 ? 'Positivo' : Math.random() > 0.3 ? 'Neutrale' : 'Negativo',
        confidence: 0.7 + Math.random() * 0.3
      },
      keywords: generateMockKeywords(),
      readability: {
        score: Math.floor(Math.random() * 100),
        level: ['Elementare', 'Medio', 'Avanzato', 'Universitario'][Math.floor(Math.random() * 4)],
        readingTime: Math.floor(Math.random() * 30) + 5
      },
      languages: ['Italiano', Math.random() > 0.7 ? 'Inglese' : null].filter(Boolean) as string[],
      statistics: {
        words: Math.floor(Math.random() * 5000) + 500,
        sentences: Math.floor(Math.random() * 200) + 50,
        paragraphs: Math.floor(Math.random() * 50) + 10,
        characters: Math.floor(Math.random() * 30000) + 3000
      }
    };

    setResult(mockResult);
    setIsAnalyzing(false);
    setProgress(0);
  };

  // Generate mock content
  const generateMockText = (): string => {
    return "Questo è un estratto del documento analizzato. Il sistema ha identificato contenuti relativi a business intelligence, analisi dei dati e strategia aziendale. Il documento presenta informazioni strutturate con particolare attenzione agli aspetti tecnici e implementativi...";
  };

  const generateMockSummary = (): string => {
    return "Il documento presenta una panoramica completa delle strategie di business intelligence, con focus particolare sull'implementazione di soluzioni data-driven. Vengono analizzati i vantaggi competitivi e le best practices per l'ottimizzazione dei processi aziendali.";
  };

  const generateMockKeyPoints = (): string[] => {
    return [
      "Implementazione di dashboard analytics avanzate",
      "Integrazione di sistemi di machine learning",
      "Ottimizzazione dei processi decisionali",
      "Analisi predittiva per il business forecasting",
      "Governance dei dati e compliance"
    ];
  };

  const generateMockKeywords = (): string[] => {
    return [
      "business intelligence", "analytics", "dashboard", "KPI", "machine learning",
      "data mining", "performance", "strategia", "ottimizzazione", "ROI",
      "predictive analytics", "big data", "reporting", "insights", "automation"
    ];
  };

  // Get file type info
  const getFileTypeInfo = (type: string) => {
    return SUPPORTED_TYPES[type as keyof typeof SUPPORTED_TYPES] || {
      icon: FileText,
      name: 'Unknown',
      color: 'text-gray-600'
    };
  };

  // Download analysis report
  const downloadReport = () => {
    if (!result) return;

    const report = `
REPORT ANALISI DOCUMENTO
========================

File: ${result.fileInfo.name}
Dimensione: ${(result.fileInfo.size / 1024 / 1024).toFixed(2)} MB
Tipo: ${result.fileInfo.type}
${result.fileInfo.pages ? `Pagine: ${result.fileInfo.pages}` : ''}

RIASSUNTO
---------
${result.summary}

PUNTI CHIAVE
------------
${result.keyPoints.map((point, i) => `${i + 1}. ${point}`).join('\n')}

SENTIMENT ANALYSIS
------------------
Sentiment: ${result.sentiment.label}
Score: ${result.sentiment.score.toFixed(3)}
Confidenza: ${(result.sentiment.confidence * 100).toFixed(1)}%

PAROLE CHIAVE
-------------
${result.keywords.join(', ')}

STATISTICHE
-----------
Parole: ${result.statistics.words}
Frasi: ${result.statistics.sentences}
Paragrafi: ${result.statistics.paragraphs}
Caratteri: ${result.statistics.characters}

LEGGIBILITÀ
-----------
Score: ${result.readability.score}/100
Livello: ${result.readability.level}
Tempo di lettura: ${result.readability.readingTime} minuti

LINGUE RILEVATE
---------------
${result.languages.join(', ')}

---
Generato da Manus AI Ultra - Document Analyzer
`;

    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analisi_${selectedFile?.name}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy summary to clipboard
  const copySummary = () => {
    if (result?.summary) {
      navigator.clipboard.writeText(result.summary);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-3">
          <Brain className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Document Analyzer AI</h2>
            <p className="text-sm opacity-90">Analisi intelligente di PDF, Word, Excel, PowerPoint</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        
        {/* File Upload */}
        {!selectedFile && (
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Carica Documento</h3>
              <p className="text-gray-500 mb-4 text-center max-w-md">
                Supporta PDF, Word, Excel, PowerPoint, RTF e file di testo fino a 50MB
              </p>
              
              {/* Supported formats */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(SUPPORTED_TYPES).slice(0, 6).map(([type, info]) => {
                  const Icon = info.icon;
                  return (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      <Icon className={`h-3 w-3 ${info.color}`} />
                      {info.name}
                    </Badge>
                  );
                })}
              </div>
              
              <Button onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Seleziona File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </CardContent>
          </Card>
        )}

        {/* Selected File Info */}
        {selectedFile && !isAnalyzing && !result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                File Selezionato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-800 rounded">
                {(() => {
                  const typeInfo = getFileTypeInfo(selectedFile.type);
                  const Icon = typeInfo.icon;
                  return <Icon className={`h-8 w-8 ${typeInfo.color}`} />;
                })()}
                <div className="flex-1">
                  <h4 className="font-medium">{selectedFile.name}</h4>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {getFileTypeInfo(selectedFile.type).name}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={analyzeDocument} className="flex-1">
                  <Brain className="h-4 w-4 mr-2" />
                  Avvia Analisi AI
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedFile(null);
                    setResult(null);
                  }}
                >
                  Cambia File
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                Analisi in Corso...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-500 mt-2 text-center">
                {progress < 100 ? `Elaborazione documento... ${Math.round(progress)}%` : 'Finalizzazione analisi...'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {result && (
          <div className="space-y-4">
            
            {/* Results Header */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    Analisi Completata
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copySummary}>
                      Copia Riassunto
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadReport}>
                      <Download className="h-4 w-4 mr-2" />
                      Scarica Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{result.statistics.words}</div>
                    <div className="text-xs text-gray-500">Parole</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{result.statistics.sentences}</div>
                    <div className="text-xs text-gray-500">Frasi</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{result.readability.score}/100</div>
                    <div className="text-xs text-gray-500">Leggibilità</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{result.readability.readingTime}m</div>
                    <div className="text-xs text-gray-500">Lettura</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Details */}
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="summary">Riassunto</TabsTrigger>
                <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="stats">Statistiche</TabsTrigger>
                <TabsTrigger value="content">Contenuto</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Riassunto Automatico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm leading-relaxed">{result.summary}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Punti Chiave:</h4>
                      <ul className="space-y-2">
                        {result.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Sentiment Tab */}
              <TabsContent value="sentiment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Analisi del Sentiment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${
                        result.sentiment.label === 'Positivo' ? 'text-green-600' :
                        result.sentiment.label === 'Negativo' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {result.sentiment.label === 'Positivo' ? '😊' :
                         result.sentiment.label === 'Negativo' ? '😞' : '😐'}
                      </div>
                      <h3 className="text-xl font-semibold">{result.sentiment.label}</h3>
                      <p className="text-gray-500">Confidenza: {(result.sentiment.confidence * 100).toFixed(1)}%</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Score Sentiment</span>
                        <span>{result.sentiment.score.toFixed(3)}</span>
                      </div>
                      <Progress 
                        value={(result.sentiment.score + 1) * 50} 
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Negativo (-1)</span>
                        <span>Neutrale (0)</span>
                        <span>Positivo (+1)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Keywords Tab */}
              <TabsContent value="keywords" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hash className="h-5 w-5" />
                      Parole Chiave e Linguaggio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Keywords Estratte:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Lingue Rilevate:</h4>
                      <div className="flex gap-2">
                        {result.languages.map((language, index) => (
                          <Badge key={index} className="flex items-center gap-1">
                            <Languages className="h-3 w-3" />
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Leggibilità:</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                          <div className="text-2xl font-bold">{result.readability.score}/100</div>
                          <div className="text-xs text-gray-500">Score</div>
                        </div>
                        <div className="text-center p-3 bg-gray-100 dark:bg-gray-800 rounded">
                          <div className="text-lg font-medium">{result.readability.level}</div>
                          <div className="text-xs text-gray-500">Livello</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Statistiche Dettagliate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{result.statistics.words.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Parole Totali</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">{result.statistics.sentences.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Frasi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{result.statistics.paragraphs.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Paragrafi</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">{result.statistics.characters.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Caratteri</div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">File:</span>
                        <span className="text-sm font-medium">{result.fileInfo.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Dimensione:</span>
                        <span className="text-sm font-medium">{(result.fileInfo.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      {result.fileInfo.pages && (
                        <div className="flex justify-between">
                          <span className="text-sm">Pagine:</span>
                          <span className="text-sm font-medium">{result.fileInfo.pages}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm">Tempo di lettura:</span>
                        <span className="text-sm font-medium">{result.readability.readingTime} minuti</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Estratto del Contenuto
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-h-64 overflow-y-auto">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.textContent}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Questo è un estratto del contenuto analizzato. Il testo completo è stato processato per l'analisi.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>

          </div>
        )}

      </div>
    </div>
  );
}
