// ========================================
// MANUS AI ULTRA - UNIT CONVERTER TOOL
// ========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpDown, 
  Calculator, 
  Copy, 
  History,
  RefreshCw,
  Ruler,
  Weight,
  Thermometer,
  Clock,
  Volume,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UnitConverterToolProps {
  tool?: any;
}

interface ConversionUnit {
  id: string;
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

interface ConversionCategory {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  baseUnit: string;
  units: ConversionUnit[];
}

const conversionCategories: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Lunghezza',
    icon: Ruler,
    baseUnit: 'metri',
    units: [
      { id: 'mm', name: 'Millimetri', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'cm', name: 'Centimetri', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'm', name: 'Metri', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Chilometri', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'in', name: 'Pollici', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'ft', name: 'Piedi', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'yd', name: 'Iarde', symbol: 'yd', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'mi', name: 'Miglia', symbol: 'mi', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 }
    ]
  },
  {
    id: 'weight',
    name: 'Peso',
    icon: Weight,
    baseUnit: 'grammi',
    units: [
      { id: 'mg', name: 'Milligrammi', symbol: 'mg', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'g', name: 'Grammi', symbol: 'g', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kg', name: 'Chilogrammi', symbol: 'kg', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 't', name: 'Tonnellate', symbol: 't', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { id: 'oz', name: 'Once', symbol: 'oz', toBase: (v) => v * 28.3495, fromBase: (v) => v / 28.3495 },
      { id: 'lb', name: 'Libbre', symbol: 'lb', toBase: (v) => v * 453.592, fromBase: (v) => v / 453.592 },
      { id: 'st', name: 'Stone', symbol: 'st', toBase: (v) => v * 6350.29, fromBase: (v) => v / 6350.29 }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperatura',
    icon: Thermometer,
    baseUnit: 'Celsius',
    units: [
      { 
        id: 'c', 
        name: 'Celsius', 
        symbol: '°C', 
        toBase: (v) => v, 
        fromBase: (v) => v 
      },
      { 
        id: 'f', 
        name: 'Fahrenheit', 
        symbol: '°F', 
        toBase: (v) => (v - 32) * 5/9, 
        fromBase: (v) => v * 9/5 + 32 
      },
      { 
        id: 'k', 
        name: 'Kelvin', 
        symbol: 'K', 
        toBase: (v) => v - 273.15, 
        fromBase: (v) => v + 273.15 
      },
      { 
        id: 'r', 
        name: 'Rankine', 
        symbol: '°R', 
        toBase: (v) => (v - 491.67) * 5/9, 
        fromBase: (v) => v * 9/5 + 491.67 
      }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Volume,
    baseUnit: 'litri',
    units: [
      { id: 'ml', name: 'Millilitri', symbol: 'ml', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'l', name: 'Litri', symbol: 'l', toBase: (v) => v, fromBase: (v) => v },
      { id: 'm3', name: 'Metri cubi', symbol: 'm³', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cup', name: 'Tazze', symbol: 'cup', toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
      { id: 'pt', name: 'Pinte', symbol: 'pt', toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
      { id: 'qt', name: 'Quarti', symbol: 'qt', toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
      { id: 'gal', name: 'Galloni', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    icon: Square,
    baseUnit: 'metri quadrati',
    units: [
      { id: 'mm2', name: 'Millimetri quadrati', symbol: 'mm²', toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
      { id: 'cm2', name: 'Centimetri quadrati', symbol: 'cm²', toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
      { id: 'm2', name: 'Metri quadrati', symbol: 'm²', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km2', name: 'Chilometri quadrati', symbol: 'km²', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { id: 'in2', name: 'Pollici quadrati', symbol: 'in²', toBase: (v) => v * 0.00064516, fromBase: (v) => v / 0.00064516 },
      { id: 'ft2', name: 'Piedi quadrati', symbol: 'ft²', toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
      { id: 'ac', name: 'Acri', symbol: 'ac', toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 }
    ]
  },
  {
    id: 'time',
    name: 'Tempo',
    icon: Clock,
    baseUnit: 'secondi',
    units: [
      { id: 'ms', name: 'Millisecondi', symbol: 'ms', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 's', name: 'Secondi', symbol: 's', toBase: (v) => v, fromBase: (v) => v },
      { id: 'min', name: 'Minuti', symbol: 'min', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { id: 'h', name: 'Ore', symbol: 'h', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { id: 'd', name: 'Giorni', symbol: 'd', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
      { id: 'w', name: 'Settimane', symbol: 'w', toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
      { id: 'y', name: 'Anni', symbol: 'y', toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 }
    ]
  }
];

interface ConversionHistory {
  id: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  category: string;
  timestamp: number;
}

export default function UnitConverterTool({ tool }: UnitConverterToolProps) {
  const [activeCategory, setActiveCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [history, setHistory] = useState<ConversionHistory[]>([]);

  const currentCategory = conversionCategories.find(cat => cat.id === activeCategory);

  // Carica cronologia
  useEffect(() => {
    const savedHistory = localStorage.getItem('manus_unit_converter_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Imposta unità predefinite quando cambia categoria
  useEffect(() => {
    if (currentCategory && currentCategory.units.length >= 2) {
      setFromUnit(currentCategory.units[0].id);
      setToUnit(currentCategory.units[1].id);
    }
  }, [activeCategory, currentCategory]);

  const performConversion = (value: string, isFromValue: boolean) => {
    if (!currentCategory || !fromUnit || !toUnit || !value) return;

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    const fromUnitObj = currentCategory.units.find(u => u.id === fromUnit);
    const toUnitObj = currentCategory.units.find(u => u.id === toUnit);

    if (!fromUnitObj || !toUnitObj) return;

    let result: number;
    
    if (isFromValue) {
      // Converti da fromUnit a toUnit
      const baseValue = fromUnitObj.toBase(numValue);
      result = toUnitObj.fromBase(baseValue);
      setToValue(result.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      // Converti da toUnit a fromUnit (conversione inversa)
      const baseValue = toUnitObj.toBase(numValue);
      result = fromUnitObj.fromBase(baseValue);
      setFromValue(result.toFixed(6).replace(/\.?0+$/, ''));
    }

    // Salva nella cronologia
    const historyEntry: ConversionHistory = {
      id: Date.now().toString(),
      fromValue: isFromValue ? numValue : result,
      fromUnit: fromUnitObj.symbol,
      toValue: isFromValue ? result : numValue,
      toUnit: toUnitObj.symbol,
      category: currentCategory.name,
      timestamp: Date.now()
    };

    const updatedHistory = [historyEntry, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('manus_unit_converter_history', JSON.stringify(updatedHistory));
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };

  const clearValues = () => {
    setFromValue('');
    setToValue('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="flex items-center gap-3">
          <ArrowUpDown className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Convertitore Unità</h2>
            <p className="text-sm opacity-90">Conversioni precise per tutte le unità di misura</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid grid-cols-6 gap-1 h-auto p-1">
            {conversionCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex flex-col items-center gap-1 p-2 text-xs"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Converter */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentCategory && <currentCategory.icon className="h-5 w-5" />}
              {currentCategory?.name}
              <Badge variant="outline">{currentCategory?.baseUnit}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* From Value */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Da:</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={fromValue}
                  onChange={(e) => {
                    setFromValue(e.target.value);
                    performConversion(e.target.value, true);
                  }}
                  placeholder="Inserisci valore"
                  className="flex-1"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategory?.units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={swapUnits}
                className="px-6"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Inverti
              </Button>
            </div>

            {/* To Value */}
            <div className="space-y-2">
              <label className="text-sm font-medium">A:</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={toValue}
                  onChange={(e) => {
                    setToValue(e.target.value);
                    performConversion(e.target.value, false);
                  }}
                  placeholder="Risultato"
                  className="flex-1"
                />
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategory?.units.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearValues}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cancella
              </Button>
              
              {toValue && (
                <Button onClick={() => copyToClipboard(toValue)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copia Risultato
                </Button>
              )}
            </div>

            {/* Quick Conversions */}
            {currentCategory && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Conversioni Rapide:</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {currentCategory.units.slice(0, 4).map((unit) => (
                    <Button
                      key={unit.id}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-xs h-auto py-2"
                      onClick={() => {
                        setFromUnit(currentCategory.units[0].id);
                        setToUnit(unit.id);
                        setFromValue('1');
                        performConversion('1', true);
                      }}
                    >
                      1 {currentCategory.units[0].symbol} = ? {unit.symbol}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History */}
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
            <CardContent className="space-y-3 max-h-96 overflow-auto">
              {history.length > 0 ? (
                history.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="font-mono text-sm">
                      {entry.fromValue} {entry.fromUnit} → {entry.toValue} {entry.toUnit}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {entry.category} • {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nessuna conversione nella cronologia</p>
                </div>
              )}

              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('manus_unit_converter_history');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Cancella Cronologia
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
