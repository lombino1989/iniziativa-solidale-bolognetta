// ========================================
// MANUS AI ULTRA - COLOR PICKER TOOL
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette,
  Copy,
  History,
  RefreshCw,
  Eye,
  Pipette,
  Download,
  Heart,
  Shuffle,
  Grid,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerToolProps {
  tool?: any;
}

interface ColorHistory {
  id: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  timestamp: number;
  name?: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

// Utilità per conversioni colore
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return `#${[r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  
  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255)
  };
};

// Palette predefinite
const predefinedPalettes: ColorPalette[] = [
  {
    id: 'material',
    name: 'Material Design',
    colors: ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4']
  },
  {
    id: 'pastel',
    name: 'Pastello',
    colors: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E8B3FF', '#FFB3F7', '#C7B3FF']
  },
  {
    id: 'warm',
    name: 'Toni Caldi',
    colors: ['#FF6B6B', '#FF8E53', '#FF6B9D', '#FFAB6B', '#FFD93D', '#6BCF7F', '#4ECDC4', '#45B7D1']
  },
  {
    id: 'vintage',
    name: 'Vintage',
    colors: ['#8B4513', '#CD853F', '#D2691E', '#F4A460', '#DEB887', '#BC8F8F', '#F5DEB3', '#FFE4B5']
  },
  {
    id: 'ocean',
    name: 'Oceano',
    colors: ['#003459', '#007EA7', '#009FBD', '#62C5DA', '#7DBBC3', '#8FD5C7', '#B5E5CF', '#D7F3E3']
  }
];

export default function ColorPickerTool({ tool }: ColorPickerToolProps) {
  const [currentColor, setCurrentColor] = useState('#3B82F6');
  const [activeTab, setActiveTab] = useState('picker');
  const [colorHistory, setColorHistory] = useState<ColorHistory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedPalette, setSelectedPalette] = useState('material');
  
  // Stato del picker
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 });
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 });
  const [hexInput, setHexInput] = useState('#3B82F6');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Carica dati salvati
  useEffect(() => {
    const savedHistory = localStorage.getItem('manus_color_history');
    if (savedHistory) {
      setColorHistory(JSON.parse(savedHistory));
    }
    
    const savedFavorites = localStorage.getItem('manus_color_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Aggiorna valori quando cambia il colore
  useEffect(() => {
    const newRgb = hexToRgb(currentColor);
    const newHsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    
    setRgb(newRgb);
    setHsl(newHsl);
    setHexInput(currentColor);
  }, [currentColor]);

  const updateColorFromHex = (hex: string) => {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setCurrentColor(hex);
    }
  };

  const updateColorFromRgb = (newRgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(hex);
  };

  const updateColorFromHsl = (newHsl: { h: number; s: number; l: number }) => {
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setCurrentColor(hex);
  };

  const addToHistory = (color: string) => {
    const colorRgb = hexToRgb(color);
    const colorHsl = rgbToHsl(colorRgb.r, colorRgb.g, colorRgb.b);
    
    const historyItem: ColorHistory = {
      id: Date.now().toString(),
      hex: color,
      rgb: colorRgb,
      hsl: colorHsl,
      timestamp: Date.now()
    };
    
    const updatedHistory = [historyItem, ...colorHistory.filter(h => h.hex !== color)].slice(0, 50);
    setColorHistory(updatedHistory);
    localStorage.setItem('manus_color_history', JSON.stringify(updatedHistory));
  };

  const addToFavorites = (color: string) => {
    if (!favorites.includes(color)) {
      const updatedFavorites = [...favorites, color];
      setFavorites(updatedFavorites);
      localStorage.setItem('manus_color_favorites', JSON.stringify(updatedFavorites));
    }
  };

  const removeFromFavorites = (color: string) => {
    const updatedFavorites = favorites.filter(f => f !== color);
    setFavorites(updatedFavorites);
    localStorage.setItem('manus_color_favorites', JSON.stringify(updatedFavorites));
  };

  const generateRandomColor = () => {
    const randomHex = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    setCurrentColor(randomHex);
    addToHistory(randomHex);
  };

  const generateAnalogousColors = (baseColor: string) => {
    const baseRgb = hexToRgb(baseColor);
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const colors = [];
    
    for (let i = -60; i <= 60; i += 30) {
      if (i === 0) continue;
      const newHue = (baseHsl.h + i + 360) % 360;
      const newRgb = hslToRgb(newHue, baseHsl.s, baseHsl.l);
      colors.push(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    }
    
    return colors;
  };

  const generateComplementaryColors = (baseColor: string) => {
    const baseRgb = hexToRgb(baseColor);
    const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
    const complementaryHue = (baseHsl.h + 180) % 360;
    const complementaryRgb = hslToRgb(complementaryHue, baseHsl.s, baseHsl.l);
    
    return [rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b)];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToHistory(text);
  };

  const currentPalette = predefinedPalettes.find(p => p.id === selectedPalette);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white">
        <div className="flex items-center gap-3">
          <Palette className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Color Picker</h2>
            <p className="text-sm opacity-90">Selettore colori avanzato con palette e strumenti</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="picker" className="flex items-center gap-2">
              <Pipette className="h-4 w-4" />
              Picker
            </TabsTrigger>
            <TabsTrigger value="palettes" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Palette
            </TabsTrigger>
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generatore
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Preferiti
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Main Content */}
        <div className="flex-1 space-y-4">
          
          {/* Color Preview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <div 
                  className="w-32 h-32 rounded-lg border-2 border-gray-200 shadow-lg cursor-pointer"
                  style={{ backgroundColor: currentColor }}
                  onClick={() => addToHistory(currentColor)}
                />
                
                <div className="flex-1 space-y-4">
                  
                  {/* Color Values */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* HEX */}
                    <div>
                      <label className="text-sm font-medium">HEX</label>
                      <div className="flex gap-2">
                        <Input
                          value={hexInput}
                          onChange={(e) => {
                            setHexInput(e.target.value);
                            updateColorFromHex(e.target.value);
                          }}
                          className="font-mono"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(currentColor)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* RGB */}
                    <div>
                      <label className="text-sm font-medium">RGB</label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgb.r}
                          onChange={(e) => updateColorFromRgb({...rgb, r: parseInt(e.target.value) || 0})}
                          className="text-xs"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgb.g}
                          onChange={(e) => updateColorFromRgb({...rgb, g: parseInt(e.target.value) || 0})}
                          className="text-xs"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="255"
                          value={rgb.b}
                          onChange={(e) => updateColorFromRgb({...rgb, b: parseInt(e.target.value) || 0})}
                          className="text-xs"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* HSL */}
                    <div>
                      <label className="text-sm font-medium">HSL</label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min="0"
                          max="360"
                          value={hsl.h}
                          onChange={(e) => updateColorFromHsl({...hsl, h: parseInt(e.target.value) || 0})}
                          className="text-xs"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={hsl.s}
                          onChange={(e) => updateColorFromHsl({...hsl, s: parseInt(e.target.value) || 0})}
                          className="text-xs"
                        />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={hsl.l}
                          onChange={(e) => updateColorFromHsl({...hsl, l: parseInt(e.target.value) || 0})}
                          className="text-xs"
                        />
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button onClick={generateRandomColor}>
                      <Shuffle className="h-4 w-4 mr-2" />
                      Casuale
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => addToFavorites(currentColor)}
                      disabled={favorites.includes(currentColor)}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", favorites.includes(currentColor) && "fill-current")} />
                      {favorites.includes(currentColor) ? 'Salvato' : 'Salva'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tab Content */}
          <TabsContent value="picker" className="space-y-4">
            
            {/* HSL Sliders */}
            <Card>
              <CardHeader>
                <CardTitle>Controlli HSL</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Hue */}
                <div>
                  <label className="text-sm font-medium">Tonalità (H): {hsl.h}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={hsl.h}
                    onChange={(e) => updateColorFromHsl({...hsl, h: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(0, ${hsl.s}%, ${hsl.l}%), 
                        hsl(60, ${hsl.s}%, ${hsl.l}%), 
                        hsl(120, ${hsl.s}%, ${hsl.l}%), 
                        hsl(180, ${hsl.s}%, ${hsl.l}%), 
                        hsl(240, ${hsl.s}%, ${hsl.l}%), 
                        hsl(300, ${hsl.s}%, ${hsl.l}%), 
                        hsl(360, ${hsl.s}%, ${hsl.l}%))`
                    }}
                  />
                </div>
                
                {/* Saturation */}
                <div>
                  <label className="text-sm font-medium">Saturazione (S): {hsl.s}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hsl.s}
                    onChange={(e) => updateColorFromHsl({...hsl, s: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hsl.h}, 0%, ${hsl.l}%), 
                        hsl(${hsl.h}, 100%, ${hsl.l}%))`
                    }}
                  />
                </div>
                
                {/* Lightness */}
                <div>
                  <label className="text-sm font-medium">Luminosità (L): {hsl.l}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hsl.l}
                    onChange={(e) => updateColorFromHsl({...hsl, l: parseInt(e.target.value)})}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(${hsl.h}, ${hsl.s}%, 0%), 
                        hsl(${hsl.h}, ${hsl.s}%, 50%), 
                        hsl(${hsl.h}, ${hsl.s}%, 100%))`
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="palettes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Palette Predefinite</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={selectedPalette} onValueChange={setSelectedPalette}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedPalettes.map((palette) => (
                      <SelectItem key={palette.id} value={palette.id}>
                        {palette.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {currentPalette && (
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                    {currentPalette.colors.map((color, index) => (
                      <div
                        key={index}
                        className="aspect-square rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCurrentColor(color);
                          addToHistory(color);
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generator" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Generatore Armonie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Analogous Colors */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Colori Analoghi</h3>
                  <div className="flex gap-2">
                    {generateAnalogousColors(currentColor).map((color, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCurrentColor(color);
                          addToHistory(color);
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Complementary Colors */}
                <div>
                  <h3 className="text-sm font-medium mb-2">Colore Complementare</h3>
                  <div className="flex gap-2">
                    {generateComplementaryColors(currentColor).map((color, index) => (
                      <div
                        key={index}
                        className="w-12 h-12 rounded cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setCurrentColor(color);
                          addToHistory(color);
                        }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Colori Preferiti
                  <Badge>{favorites.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
                    {favorites.map((color, index) => (
                      <div key={index} className="relative group">
                        <div
                          className="aspect-square rounded cursor-pointer hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setCurrentColor(color);
                            addToHistory(color);
                          }}
                          title={color}
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFromFavorites(color)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-8 w-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Nessun colore nei preferiti</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </div>

        {/* History Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64"
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Cronologia
                <Badge>{colorHistory.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-auto">
              {colorHistory.length > 0 ? (
                colorHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => setCurrentColor(item.hex)}
                  >
                    <div
                      className="w-8 h-8 rounded border"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-mono">{item.hex}</div>
                      <div className="text-xs text-gray-500">
                        RGB({item.rgb.r}, {item.rgb.g}, {item.rgb.b})
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Palette className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nessun colore nella cronologia</p>
                </div>
              )}

              {colorHistory.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setColorHistory([]);
                    localStorage.removeItem('manus_color_history');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Cancella
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
