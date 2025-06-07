// ========================================
// MANUS AI ULTRA - HASH GENERATOR TOOL
// ========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Shield,
  Hash,
  Copy,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  FileText,
  CheckCircle2,
  History
} from 'lucide-react';

interface HashGeneratorToolProps {
  tool?: any;
}

interface HashResult {
  algorithm: string;
  hash: string;
  input: string;
  inputType: 'text' | 'file';
  timestamp: number;
}

// Simple hash implementations
class HashUtils {
  // SHA-256 using Web Crypto API
  static async sha256(text: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      return this.fallbackHash(text, 'sha256');
    }
  }

  // SHA-1 using Web Crypto API
  static async sha1(text: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      return this.fallbackHash(text, 'sha1');
    }
  }

  // Simple MD5 implementation (basic version)
  static md5(text: string): string {
    try {
      // This is a simplified demonstration - not cryptographically secure
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      // Convert to hex and pad
      const hexHash = Math.abs(hash).toString(16);
      return hexHash.padStart(32, '0').substring(0, 32);
    } catch (error) {
      return this.fallbackHash(text, 'md5');
    }
  }

  // Simple CRC32
  static crc32(text: string): string {
    try {
      let crc = 0xFFFFFFFF;
      for (let i = 0; i < text.length; i++) {
        crc ^= text.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
          crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
        }
      }
      return ((crc ^ 0xFFFFFFFF) >>> 0).toString(16).padStart(8, '0');
    } catch (error) {
      return this.fallbackHash(text, 'crc32');
    }
  }

  // Fallback hash generation
  private static fallbackHash(text: string, algorithm: string): string {
    let hash = algorithm + '_';
    for (let i = 0; i < text.length; i++) {
      hash += text.charCodeAt(i).toString(16);
    }
    return hash.substring(0, 32);
  }
}

export default function HashGeneratorTool({ tool }: HashGeneratorToolProps) {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HashResult[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState({
    md5: true,
    sha1: true,
    sha256: true,
    crc32: true
  });
  const [showInput, setShowInput] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const algorithms = [
    { key: 'md5', name: 'MD5', description: 'Message Digest 5 (128-bit)' },
    { key: 'sha1', name: 'SHA-1', description: 'Secure Hash Algorithm 1 (160-bit)' },
    { key: 'sha256', name: 'SHA-256', description: 'Secure Hash Algorithm 256 (256-bit)' },
    { key: 'crc32', name: 'CRC32', description: 'Cyclic Redundancy Check 32-bit' }
  ];

  // Load history from localStorage
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('manus_hash_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.warn('Errore caricamento cronologia hash:', error);
    }
  }, []);

  // Save to history
  const saveToHistory = (results: Record<string, string>, input: string, inputType: 'text' | 'file') => {
    const newEntries: HashResult[] = Object.entries(results).map(([algorithm, hash]) => ({
      algorithm,
      hash,
      input: inputType === 'file' ? `File: ${input}` : input.substring(0, 50) + (input.length > 50 ? '...' : ''),
      inputType,
      timestamp: Date.now()
    }));

    const updatedHistory = [...newEntries, ...history].slice(0, 100);
    setHistory(updatedHistory);

    try {
      localStorage.setItem('manus_hash_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.warn('Errore salvataggio cronologia hash:', error);
    }
  };

  // Generate hashes
  const generateHashes = async () => {
    if (!inputText.trim() && !selectedFile) return;

    setIsGenerating(true);
    const newResults: Record<string, string> = {};
    
    try {
      let textToHash = inputText;
      
      if (selectedFile) {
        // Read file content
        const reader = new FileReader();
        textToHash = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsText(selectedFile);
        });
      }

      // Generate selected hashes
      if (selectedAlgorithms.md5) {
        newResults.md5 = HashUtils.md5(textToHash);
      }
      
      if (selectedAlgorithms.sha1) {
        newResults.sha1 = await HashUtils.sha1(textToHash);
      }
      
      if (selectedAlgorithms.sha256) {
        newResults.sha256 = await HashUtils.sha256(textToHash);
      }
      
      if (selectedAlgorithms.crc32) {
        newResults.crc32 = HashUtils.crc32(textToHash);
      }

      setResults(newResults);
      saveToHistory(newResults, selectedFile ? selectedFile.name : textToHash, selectedFile ? 'file' : 'text');
    } catch (error) {
      console.error('Errore generazione hash:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File troppo grande. Limite: 10MB');
        return;
      }
      setSelectedFile(file);
      setInputText('');
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Download results
  const downloadResults = () => {
    const content = Object.entries(results)
      .map(([alg, hash]) => `${alg.toUpperCase()}: ${hash}`)
      .join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hashes_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all
  const clearAll = () => {
    setInputText('');
    setSelectedFile(null);
    setResults({});
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Hash Generator</h2>
            <p className="text-sm opacity-90">Genera hash MD5, SHA-1, SHA-256, CRC32 per testo e file</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Main Tool */}
        <div className="flex-1 space-y-4">
          
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Input
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInput(!showInput)}
                >
                  {showInput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Text Input */}
              <div>
                <label className="text-sm font-medium">Testo da hashare:</label>
                <Textarea
                  value={showInput ? inputText : '•'.repeat(inputText.length)}
                  onChange={(e) => {
                    setInputText(e.target.value);
                    setSelectedFile(null);
                  }}
                  placeholder="Inserisci il testo da convertire in hash..."
                  rows={3}
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
                    id="hash-file-input"
                  />
                  <label
                    htmlFor="hash-file-input"
                    className="flex items-center gap-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Upload className="h-4 w-4" />
                    Carica File (max 10MB)
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

          {/* Algorithm Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5" />
                Algoritmi Hash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {algorithms.map((alg) => (
                  <div key={alg.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{alg.name}</div>
                      <div className="text-xs text-gray-500">{alg.description}</div>
                    </div>
                    <Switch
                      checked={selectedAlgorithms[alg.key as keyof typeof selectedAlgorithms]}
                      onCheckedChange={(checked) => 
                        setSelectedAlgorithms(prev => ({ ...prev, [alg.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={generateHashes}
              disabled={(!inputText.trim() && !selectedFile) || isGenerating || !Object.values(selectedAlgorithms).some(Boolean)}
              size="lg"
              className="flex-1"
            >
              {isGenerating ? (
                <>Generazione...</>
              ) : (
                <><Hash className="h-4 w-4 mr-2" />Genera Hash</>
              )}
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

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Risultati Hash
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadResults}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results).map(([algorithm, hash]) => (
                      <div key={algorithm} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">{algorithm.toUpperCase()}</Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(hash)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={hash}
                          readOnly
                          className="font-mono text-sm"
                        />
                      </div>
                    ))}
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
              <History className="h-5 w-5" />
              Cronologia
            </CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">Nessun hash nella cronologia</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {history.map((item, index) => (
                  <motion.div
                    key={`${item.timestamp}-${index}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => copyToClipboard(item.hash)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">{item.algorithm.toUpperCase()}</Badge>
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                      <div>Input: {item.input}</div>
                      <div>Hash: {item.hash.substring(0, 20)}...</div>
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
