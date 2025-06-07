// ========================================
// MANUS AI ULTRA - BASE64 ENCODER TOOL
// ========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Lock,
  Unlock,
  Copy,
  Download,
  Upload,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

interface Base64EncoderToolProps {
  tool?: any;
}

interface ConversionHistory {
  id: string;
  type: 'encode' | 'decode';
  input: string;
  output: string;
  timestamp: number;
  inputType: 'text' | 'file';
}

export default function Base64EncoderTool({ tool }: Base64EncoderToolProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [isValidBase64, setIsValidBase64] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('manus_base64_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.warn('Errore caricamento cronologia Base64:', error);
    }
  }, []);

  // Save to history
  const saveToHistory = (conversion: Omit<ConversionHistory, 'id' | 'timestamp'>) => {
    const newEntry: ConversionHistory = {
      ...conversion,
      id: `base64-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    const updatedHistory = [newEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);

    try {
      localStorage.setItem('manus_base64_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('Errore salvataggio cronologia Base64:', error);
    }
  };

  // Encode to Base64
  const encodeToBase64 = () => {
    try {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const base64 = result.split(',')[1];
          setOutputText(base64);
          saveToHistory({
            type: 'encode',
            input: selectedFile.name,
            output: base64.substring(0, 100) + (base64.length > 100 ? '...' : ''),
            inputType: 'file'
          });
        };
        reader.readAsDataURL(selectedFile);
      } else {
        const encoded = btoa(unescape(encodeURIComponent(inputText)));
        setOutputText(encoded);
        saveToHistory({
          type: 'encode',
          input: inputText.substring(0, 50) + (inputText.length > 50 ? '...' : ''),
          output: encoded.substring(0, 50) + (encoded.length > 50 ? '...' : ''),
          inputType: 'text'
        });
      }
    } catch (error) {
      console.error('Errore encoding Base64:', error);
      setOutputText('Errore: Impossibile codificare il testo');
    }
  };

  // Decode from Base64
  const decodeFromBase64 = () => {
    try {
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(inputText.replace(/\\s/g, ''))) {
        setIsValidBase64(false);
        setOutputText('Errore: String Base64 non valida');
        return;
      }

      setIsValidBase64(true);
      const decoded = decodeURIComponent(escape(atob(inputText.replace(/\\s/g, ''))));
      setOutputText(decoded);
      saveToHistory({
        type: 'decode',
        input: inputText.substring(0, 50) + (inputText.length > 50 ? '...' : ''),
        output: decoded.substring(0, 50) + (decoded.length > 50 ? '...' : ''),
        inputType: 'text'
      });
    } catch (error) {
      setIsValidBase64(false);
      setOutputText('Errore: String Base64 non valida o corrotta');
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File troppo grande. Limite: 1MB');
        return;
      }
      setSelectedFile(file);
      setInputText(`File selezionato: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
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
    a.download = `base64_${activeTab}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all
  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setSelectedFile(null);
    setIsValidBase64(true);
  };

  // Process conversion
  const processConversion = () => {
    if (activeTab === 'encode') {
      encodeToBase64();
    } else {
      decodeFromBase64();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <Lock className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Base64 Encoder/Decoder</h2>
            <p className="text-sm opacity-90">Codifica e decodifica testo e file in Base64</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Main Tool */}
        <div className="flex-1 space-y-4">
          
          {/* Mode Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'encode' | 'decode')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="encode" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Codifica
              </TabsTrigger>
              <TabsTrigger value="decode" className="flex items-center gap-2">
                <Unlock className="h-4 w-4" />
                Decodifica
              </TabsTrigger>
            </TabsList>

            {/* Encode Tab */}
            <TabsContent value="encode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Input (Testo o File)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Text Input */}
                  <div>
                    <label className="text-sm font-medium">Testo da codificare:</label>
                    <Textarea
                      value={selectedFile ? `File: ${selectedFile.name}` : inputText}
                      onChange={(e) => {
                        setInputText(e.target.value);
                        setSelectedFile(null);
                      }}
                      placeholder="Inserisci il testo da codificare in Base64..."
                      rows={4}
                      disabled={!!selectedFile}
                    />
                  </div>

                  {/* File Input */}
                  <div>
                    <label className="text-sm font-medium">Oppure seleziona un file:</label>
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-input"
                      />
                      <label
                        htmlFor="file-input"
                        className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Upload className="h-4 w-4" />
                        Carica File (max 1MB)
                      </label>
                      {selectedFile && (
                        <Badge variant="secondary">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Decode Tab */}
            <TabsContent value="decode" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Input Base64
                    {!isValidBase64 && (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={inputText}
                    onChange={(e) => {
                      setInputText(e.target.value);
                      setIsValidBase64(true);
                    }}
                    placeholder="Inserisci la stringa Base64 da decodificare..."
                    rows={4}
                    className={!isValidBase64 ? 'border-red-300' : ''}
                  />
                  {!isValidBase64 && (
                    <p className="text-sm text-red-500 mt-2">Formato Base64 non valido</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={processConversion}
              disabled={!inputText.trim() && !selectedFile}
              size="lg"
              className="flex-1"
            >
              {activeTab === 'encode' ? <Lock className="h-4 w-4 mr-2" /> : <Unlock className="h-4 w-4 mr-2" />}
              {activeTab === 'encode' ? 'Codifica Base64' : 'Decodifica Base64'}
            </Button>
            
            <Button
              variant="outline"
              onClick={clearAll}
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Output */}
          {outputText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Risultato
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(outputText)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copia
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadResult}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={outputText}
                    readOnly
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span>Lunghezza: {outputText.length} caratteri</span>
                    <span>Dimensione: {new Blob([outputText]).size} bytes</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* History Sidebar */}
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cronologia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nessuna conversione nella cronologia</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => {
                      if (item.type === 'encode') {
                        setActiveTab('decode');
                        setInputText(item.output.replace('...', ''));
                      } else {
                        setActiveTab('encode');
                        setInputText(item.input.replace('...', ''));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.type === 'encode' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      <Badge variant={item.type === 'encode' ? 'default' : 'secondary'}>
                        {item.type === 'encode' ? 'Codifica' : 'Decodifica'}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Input: {item.input}</div>
                      <div>Output: {item.output}</div>
                      <div>{new Date(item.timestamp).toLocaleString()}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
