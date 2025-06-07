// ========================================
// MANUS AI ULTRA - JSON FORMATTER TOOL
// ========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  FileJson,
  Copy,
  Download,
  RefreshCw,
  Check,
  AlertTriangle,
  Code,
  Minimize,
  Maximize
} from 'lucide-react';

interface JSONFormatterToolProps {
  tool?: any;
}

interface JSONError {
  line: number;
  column: number;
  message: string;
}

export default function JSONFormatterTool({ tool }: JSONFormatterToolProps) {
  const [inputJSON, setInputJSON] = useState('');
  const [formattedJSON, setFormattedJSON] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<JSONError[]>([]);
  const [indentation, setIndentation] = useState(2);

  const validateAndFormat = (json: string) => {
    try {
      if (!json.trim()) {
        setFormattedJSON('');
        setIsValid(true);
        setErrors([]);
        return;
      }

      const parsed = JSON.parse(json);
      const formatted = JSON.stringify(parsed, null, indentation);
      
      setFormattedJSON(formatted);
      setIsValid(true);
      setErrors([]);
    } catch (error: any) {
      setIsValid(false);
      setFormattedJSON('');
      
      const errorMessage = error.message;
      const match = errorMessage.match(/at position (\d+)/);
      const position = match ? parseInt(match[1]) : 0;
      
      const lines = json.substring(0, position).split('\n');
      const line = lines.length;
      const column = lines[lines.length - 1].length + 1;
      
      setErrors([{
        line,
        column,
        message: errorMessage
      }]);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      validateAndFormat(inputJSON);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [inputJSON, indentation]);

  const minifyJSON = () => {
    try {
      if (inputJSON.trim()) {
        const parsed = JSON.parse(inputJSON);
        const minified = JSON.stringify(parsed);
        setFormattedJSON(minified);
      }
    } catch (error) {
      console.error('Errore minificazione:', error);
    }
  };

  const beautifyJSON = () => {
    validateAndFormat(inputJSON);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadJSON = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadExample = () => {
    const example = {
      "name": "Mario Rossi",
      "age": 30,
      "city": "Roma",
      "hobbies": ["lettura", "sport", "viaggi"],
      "active": true
    };
    setInputJSON(JSON.stringify(example));
  };

  const clearAll = () => {
    setInputJSON('');
    setFormattedJSON('');
    setIsValid(true);
    setErrors([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <div className="flex items-center gap-3">
          <FileJson className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">JSON Formatter</h2>
            <p className="text-sm opacity-90">Formatta, valida e analizza file JSON</p>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant={isValid ? "default" : "destructive"} className="flex items-center gap-1">
              {isValid ? <Check className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {isValid ? 'Valido' : 'Errore'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={indentation.toString()} onValueChange={(value) => setIndentation(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spazi</SelectItem>
                <SelectItem value="4">4 spazi</SelectItem>
                <SelectItem value="8">Tab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4">
        
        {/* Input Panel */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Input JSON</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={loadExample}>
                  Esempio
                </Button>
                <Button size="sm" variant="outline" onClick={clearAll}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <Textarea
              value={inputJSON}
              onChange={(e) => setInputJSON(e.target.value)}
              placeholder="Incolla qui il tuo JSON..."
              className="font-mono text-sm resize-none h-96"
            />
            
            {errors.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600 dark:text-red-400">
                    <strong>Errore riga {error.line}, colonna {error.column}:</strong> {error.message}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Output Formattato</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={beautifyJSON} disabled={!isValid}>
                  <Maximize className="h-4 w-4 mr-1" />
                  Formatta
                </Button>
                <Button size="sm" variant="outline" onClick={minifyJSON} disabled={!isValid}>
                  <Minimize className="h-4 w-4 mr-1" />
                  Minifica
                </Button>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(formattedJSON)} disabled={!formattedJSON}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copia
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadJSON(formattedJSON, 'formatted.json')} disabled={!formattedJSON}>
                  <Download className="h-4 w-4 mr-1" />
                  Scarica
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formattedJSON}
              readOnly
              className="font-mono text-sm resize-none h-96"
              placeholder="Il JSON formattato apparirà qui..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
