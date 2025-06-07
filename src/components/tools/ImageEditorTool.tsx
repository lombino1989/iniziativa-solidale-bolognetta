import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { 
  Image, 
  Upload, 
  Download, 
  RotateCw, 
  FlipHorizontal, 
  FlipVertical,
  Crop,
  Palette,
  Filter,
  Undo,
  Redo,
  Eye,
  Save
} from 'lucide-react';

interface ImageEditorToolProps {
  tool: {
    id: string;
    name: string;
    description: string;
  };
}

interface ImageOperation {
  id: string;
  name: string;
  timestamp: number;
  preview?: string;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
  sepia: number;
  grayscale: number;
  invert: number;
}

const DEFAULT_FILTERS: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0
};

export default function ImageEditorTool({ tool }: ImageEditorToolProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [filters, setFilters] = useState<FilterSettings>(DEFAULT_FILTERS);
  const [history, setHistory] = useState<ImageOperation[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Filter presets
  const FILTER_PRESETS = {
    'vintage': { brightness: 110, contrast: 120, saturation: 80, sepia: 30, hue: 0, blur: 0, grayscale: 0, invert: 0 },
    'bw': { brightness: 100, contrast: 120, saturation: 0, sepia: 0, hue: 0, blur: 0, grayscale: 100, invert: 0 },
    'warm': { brightness: 105, contrast: 110, saturation: 120, sepia: 10, hue: 10, blur: 0, grayscale: 0, invert: 0 },
    'cool': { brightness: 95, contrast: 110, saturation: 110, sepia: 0, hue: -10, blur: 0, grayscale: 0, invert: 0 },
    'dramatic': { brightness: 90, contrast: 150, saturation: 80, sepia: 0, hue: 0, blur: 0, grayscale: 0, invert: 0 },
    'soft': { brightness: 110, contrast: 90, saturation: 90, sepia: 5, hue: 0, blur: 1, grayscale: 0, invert: 0 }
  };

  // Load image from file
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File troppo grande. Massimo 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setProcessedImage(result);
      resetFilters();
      addToHistory('Caricamento immagine', result);
    };
    reader.readAsDataURL(file);
  }, []);

  // Reset all filters
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setSelectedPreset('');
  };

  // Add operation to history
  const addToHistory = (operation: string, imageData: string) => {
    const newOperation: ImageOperation = {
      id: `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: operation,
      timestamp: Date.now(),
      preview: imageData
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newOperation);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Apply filters to canvas
  const applyFilters = useCallback(() => {
    if (!originalImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      // Set canvas size
      canvas.width = img.width;
      canvas.height = img.height;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);

      // Apply CSS filters
      const filterString = [
        `brightness(${filters.brightness}%)`,
        `contrast(${filters.contrast}%)`,
        `saturate(${filters.saturation}%)`,
        `hue-rotate(${filters.hue}deg)`,
        `blur(${filters.blur}px)`,
        `sepia(${filters.sepia}%)`,
        `grayscale(${filters.grayscale}%)`,
        `invert(${filters.invert}%)`
      ].join(' ');

      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);
      ctx.restore();

      // Update processed image
      const processedDataUrl = canvas.toDataURL('image/png');
      setProcessedImage(processedDataUrl);
    };
    
    img.src = originalImage;
  }, [originalImage, filters, rotation, flipH, flipV]);

  // Apply filters when they change
  useEffect(() => {
    if (originalImage) {
      applyFilters();
    }
  }, [originalImage, applyFilters]);

  // Apply preset
  const applyPreset = (presetName: string) => {
    if (FILTER_PRESETS[presetName as keyof typeof FILTER_PRESETS]) {
      setFilters(FILTER_PRESETS[presetName as keyof typeof FILTER_PRESETS]);
      setSelectedPreset(presetName);
      addToHistory(`Preset: ${presetName}`, processedImage || '');
    }
  };

  // Transform operations
  const rotateImage = (degrees: number) => {
    setRotation((prev) => (prev + degrees) % 360);
    addToHistory(`Rotazione ${degrees}°`, processedImage || '');
  };

  const flipImage = (direction: 'horizontal' | 'vertical') => {
    if (direction === 'horizontal') {
      setFlipH(!flipH);
      addToHistory('Ribalta orizzontale', processedImage || '');
    } else {
      setFlipV(!flipV);
      addToHistory('Ribalta verticale', processedImage || '');
    }
  };

  // History navigation
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const prevOperation = history[historyIndex - 1];
      if (prevOperation.preview) {
        setProcessedImage(prevOperation.preview);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextOperation = history[historyIndex + 1];
      if (nextOperation.preview) {
        setProcessedImage(nextOperation.preview);
      }
    }
  };

  // Download processed image
  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.download = `manus_edited_${Date.now()}.png`;
    link.href = processedImage;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (!processedImage) return;

    try {
      const response = await fetch(processedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      alert('Immagine copiata negli appunti!');
    } catch (error) {
      console.error('Errore copia:', error);
      alert('Errore durante la copia');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="flex items-center gap-3">
          <Image className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Editor Immagini</h2>
            <p className="text-sm opacity-90">Editor avanzato con filtri, trasformazioni e effetti</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Main Editor */}
        <div className="flex-1 space-y-4">
          
          {/* Image Upload */}
          {!originalImage && (
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Carica un'immagine</h3>
                <p className="text-gray-500 mb-4 text-center">
                  Supporta JPG, PNG, GIF fino a 10MB
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Seleziona File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>
          )}

          {/* Image Display */}
          {originalImage && (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Anteprima</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={undo}
                      disabled={historyIndex <= 0}
                    >
                      <Undo className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                    >
                      <Redo className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-center">
                    {processedImage && (
                      <img
                        src={processedImage}
                        alt="Processed"
                        className="max-w-full max-h-96 object-contain rounded"
                      />
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button onClick={downloadImage} disabled={!processedImage}>
                    <Download className="h-4 w-4 mr-2" />
                    Scarica
                  </Button>
                  <Button variant="outline" onClick={copyToClipboard} disabled={!processedImage}>
                    <Save className="h-4 w-4 mr-2" />
                    Copia
                  </Button>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hidden canvas for processing */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Panel */}
        {originalImage && (
          <div className="w-80 space-y-4">
            
            <Tabs defaultValue="filters" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="filters">Filtri</TabsTrigger>
                <TabsTrigger value="transform">Trasforma</TabsTrigger>
                <TabsTrigger value="presets">Preset</TabsTrigger>
              </TabsList>

              {/* Filters Tab */}
              <TabsContent value="filters" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Filter className="h-5 w-5" />
                      Filtri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Brightness */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Luminosità: {filters.brightness}%
                      </label>
                      <Slider
                        value={[filters.brightness]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, brightness: value }))}
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Contrast */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Contrasto: {filters.contrast}%
                      </label>
                      <Slider
                        value={[filters.contrast]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, contrast: value }))}
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Saturation */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Saturazione: {filters.saturation}%
                      </label>
                      <Slider
                        value={[filters.saturation]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, saturation: value }))}
                        min={0}
                        max={200}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Hue */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Tonalità: {filters.hue}°
                      </label>
                      <Slider
                        value={[filters.hue]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, hue: value }))}
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Effects */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Sfocatura: {filters.blur}px
                      </label>
                      <Slider
                        value={[filters.blur]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, blur: value }))}
                        min={0}
                        max={10}
                        step={0.1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Seppia: {filters.sepia}%
                      </label>
                      <Slider
                        value={[filters.sepia]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, sepia: value }))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Scala di grigi: {filters.grayscale}%
                      </label>
                      <Slider
                        value={[filters.grayscale]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, grayscale: value }))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Inverti: {filters.invert}%
                      </label>
                      <Slider
                        value={[filters.invert]}
                        onValueChange={([value]) => setFilters(prev => ({ ...prev, invert: value }))}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transform Tab */}
              <TabsContent value="transform" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RotateCw className="h-5 w-5" />
                      Trasformazioni
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    {/* Rotation */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rotazione</label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateImage(-90)}
                        >
                          <RotateCw className="h-4 w-4 transform scale-x-[-1]" />
                          90° Sx
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateImage(90)}
                        >
                          <RotateCw className="h-4 w-4" />
                          90° Dx
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Rotazione attuale: {rotation}°
                      </p>
                    </div>

                    {/* Flipping */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Ribaltamento</label>
                      <div className="flex gap-2">
                        <Button
                          variant={flipH ? "default" : "outline"}
                          size="sm"
                          onClick={() => flipImage('horizontal')}
                        >
                          <FlipHorizontal className="h-4 w-4 mr-2" />
                          Orizzontale
                        </Button>
                        <Button
                          variant={flipV ? "default" : "outline"}
                          size="sm"
                          onClick={() => flipImage('vertical')}
                        >
                          <FlipVertical className="h-4 w-4 mr-2" />
                          Verticale
                        </Button>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              </TabsContent>

              {/* Presets Tab */}
              <TabsContent value="presets" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Preset Effetti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    
                    {Object.entries(FILTER_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant={selectedPreset === key ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => applyPreset(key)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {key === 'vintage' && 'Vintage'}
                        {key === 'bw' && 'Bianco e Nero'}
                        {key === 'warm' && 'Caldo'}
                        {key === 'cool' && 'Freddo'}
                        {key === 'dramatic' && 'Drammatico'}
                        {key === 'soft' && 'Morbido'}
                      </Button>
                    ))}

                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>

            {/* History */}
            {history.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Cronologia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {history.slice(-5).map((operation, index) => (
                      <div
                        key={operation.id}
                        className={`text-xs p-2 rounded ${
                          index === historyIndex ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      >
                        <div className="font-medium">{operation.name}</div>
                        <div className="text-gray-500">
                          {new Date(operation.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
