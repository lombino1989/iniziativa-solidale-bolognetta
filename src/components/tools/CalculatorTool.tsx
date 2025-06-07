// ========================================
// MANUS AI ULTRA - CALCULATOR TOOL
// ========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  Delete, 
  RotateCcw, 
  History,
  Copy,
  Save,
  Calculator as FunctionIcon,
  Pi,
  Percent
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorToolProps {
  tool?: any;
}

interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export default function CalculatorTool({ tool }: CalculatorToolProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState<'basic' | 'scientific'>('basic');

  // Carica cronologia dal localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('manus_calculator_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Salva cronologia nel localStorage
  const saveToHistory = (expression: string, result: string) => {
    const newEntry: CalculationHistory = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: Date.now()
    };
    
    const updatedHistory = [newEntry, ...history].slice(0, 50); // Mantieni ultime 50
    setHistory(updatedHistory);
    localStorage.setItem('manus_calculator_history', JSON.stringify(updatedHistory));
  };

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);
      
      if (newValue !== null) {
        const expression = `${currentValue} ${operation} ${inputValue}`;
        const result = newValue.toString();
        
        setDisplay(result);
        setPreviousValue(result);
        saveToHistory(expression, result);
      }
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number | null => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : null;
      case '%':
        return (firstValue * secondValue) / 100;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const performScientificOperation = (func: string) => {
    const value = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case '1/x':
        result = 1 / value;
        break;
      case 'x²':
        result = value * value;
        break;
      case '!':
        result = factorial(value);
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
      default:
        return;
    }

    const expression = func === 'π' || func === 'e' ? func : `${func}(${value})`;
    const resultStr = result.toString();
    
    setDisplay(resultStr);
    saveToHistory(expression, resultStr);
    setWaitingForNewValue(true);
  };

  const factorial = (n: number): number => {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const basicButtons = [
    { label: 'C', action: clear, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: '⌫', action: deleteLast, className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    { label: '%', action: () => performOperation('%'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '÷', action: () => performOperation('÷'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '7', action: () => inputNumber('7') },
    { label: '8', action: () => inputNumber('8') },
    { label: '9', action: () => inputNumber('9') },
    { label: '×', action: () => performOperation('×'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '4', action: () => inputNumber('4') },
    { label: '5', action: () => inputNumber('5') },
    { label: '6', action: () => inputNumber('6') },
    { label: '-', action: () => performOperation('-'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '1', action: () => inputNumber('1') },
    { label: '2', action: () => inputNumber('2') },
    { label: '3', action: () => inputNumber('3') },
    { label: '+', action: () => performOperation('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '0', action: () => inputNumber('0'), className: 'col-span-2' },
    { label: '.', action: inputDecimal },
    { label: '=', action: () => performOperation('='), className: 'bg-green-500 hover:bg-green-600 text-white' }
  ];

  const scientificButtons = [
    { label: 'sin', action: () => performScientificOperation('sin') },
    { label: 'cos', action: () => performScientificOperation('cos') },
    { label: 'tan', action: () => performScientificOperation('tan') },
    { label: 'π', action: () => performScientificOperation('π') },
    
    { label: 'log', action: () => performScientificOperation('log') },
    { label: 'ln', action: () => performScientificOperation('ln') },
    { label: '√', action: () => performScientificOperation('sqrt') },
    { label: 'e', action: () => performScientificOperation('e') },
    
    { label: '1/x', action: () => performScientificOperation('1/x') },
    { label: 'x²', action: () => performScientificOperation('x²') },
    { label: 'x^y', action: () => performOperation('^') },
    { label: 'n!', action: () => performScientificOperation('!') }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-bold">Calcolatrice Scientifica</h2>
              <p className="text-sm opacity-90">Calcoli avanzati e funzioni matematiche</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={mode === 'basic' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setMode('basic')}
              className="text-white border-white/20"
            >
              Base
            </Button>
            <Button
              variant={mode === 'scientific' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setMode('scientific')}
              className="text-white border-white/20"
            >
              <FunctionIcon className="h-4 w-4 mr-1" />
              Scientifica
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="text-white border-white/20"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Calculator */}
        <Card className="flex-1">
          <CardContent className="p-6">
            
            {/* Display */}
            <div className="mb-6">
              <div className="bg-gray-900 dark:bg-gray-800 text-white p-4 rounded-lg text-right">
                <div className="text-sm text-gray-400 mb-1 h-5">
                  {operation && previousValue && `${previousValue} ${operation}`}
                </div>
                <div className="text-3xl font-mono font-bold overflow-hidden">
                  {display}
                </div>
              </div>
              
              <div className="flex justify-between mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(display)}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copia
                </Button>
                
                <div className="flex gap-1">
                  <Badge variant="outline">
                    {display.length} cifre
                  </Badge>
                  {display !== '0' && (
                    <Badge variant="secondary">
                      {parseFloat(display).toExponential(2)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Scientific Functions */}
            {mode === 'scientific' && (
              <div className="mb-4">
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {scientificButtons.map((btn, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={btn.action}
                      className="h-10 text-sm"
                    >
                      {btn.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Calculator Grid */}
            <div className="grid grid-cols-4 gap-3">
              {basicButtons.map((btn, index) => (
                <Button
                  key={index}
                  onClick={btn.action}
                  className={cn(
                    "h-14 text-lg font-semibold",
                    btn.className || "bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  )}
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Cronologia
                  <Badge>{history.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full overflow-auto">
                {history.length > 0 ? (
                  <div className="space-y-2">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDisplay(entry.result)}
                      >
                        <div className="font-mono text-sm text-gray-600 dark:text-gray-400">
                          {entry.expression}
                        </div>
                        <div className="font-mono font-bold">
                          = {entry.result}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(entry.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 mt-8">
                    <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nessun calcolo nella cronologia</p>
                  </div>
                )}

                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4"
                    onClick={() => {
                      setHistory([]);
                      localStorage.removeItem('manus_calculator_history');
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Cancella Cronologia
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
