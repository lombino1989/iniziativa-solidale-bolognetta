// ========================================
// MANUS AI ULTRA - QR CODE GENERATOR TOOL
// ========================================

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  QrCode,
  Download,
  Copy,
  History,
  RefreshCw,
  Share,
  Smartphone,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  User,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRGeneratorToolProps {
  tool?: any;
}

interface QRCode {
  id: string;
  data: string;
  type: string;
  size: number;
  errorCorrection: string;
  dataUrl: string;
  timestamp: number;
}

// Funzione per generare QR Code usando una libreria simulata
const generateQRCode = (text: string, size: number = 256, errorCorrection: string = 'M') => {
  // Simuliamo la generazione di un QR code
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = size;
  canvas.height = size;
  
  if (ctx) {
    // Background bianco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Simuliamo un pattern QR semplificato
    ctx.fillStyle = '#000000';
    
    // Quadrati di posizionamento
    const markerSize = size / 7;
    
    // Top-left
    ctx.fillRect(0, 0, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(markerSize/3, markerSize/3, markerSize/3, markerSize/3);
    
    // Top-right
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - markerSize + markerSize/3, markerSize/3, markerSize/3, markerSize/3);
    
    // Bottom-left
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size - markerSize, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(markerSize/3, size - markerSize + markerSize/3, markerSize/3, markerSize/3);
    
    // Pattern simulato
    ctx.fillStyle = '#000000';
    const moduleSize = size / 25;
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        // Simuliamo un pattern pseudo-casuale basato sul testo
        const hash = (text.charCodeAt(i % text.length) * i * j) % 7;
        if (hash > 3) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    // Aggiungiamo il testo in piccolo al centro (solo per demo)
    ctx.fillStyle = '#666666';
    ctx.font = `${size/32}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('QR', size/2, size/2);
  }
  
  return canvas.toDataURL('image/png');
};

const qrTypes = [
  { id: 'text', name: 'Testo', icon: MessageSquare, prefix: '' },
  { id: 'url', name: 'URL', icon: Globe, prefix: 'https://' },
  { id: 'email', name: 'Email', icon: Mail, prefix: 'mailto:' },
  { id: 'phone', name: 'Telefono', icon: Phone, prefix: 'tel:' },
  { id: 'sms', name: 'SMS', icon: MessageSquare, prefix: 'sms:' },
  { id: 'wifi', name: 'WiFi', icon: Wifi, prefix: 'WIFI:' },
  { id: 'vcard', name: 'Contatto', icon: User, prefix: 'BEGIN:VCARD' },
  { id: 'location', name: 'Posizione', icon: MapPin, prefix: 'geo:' }
];

export default function QRGeneratorTool({ tool }: QRGeneratorToolProps) {
  const [activeType, setActiveType] = useState('text');
  const [inputText, setInputText] = useState('');
  const [qrSize, setQrSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState('M');
  const [generatedQR, setGeneratedQR] = useState<string | null>(null);
  const [history, setHistory] = useState<QRCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Campi specifici per tipo
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    security: 'WPA',
    hidden: false
  });
  
  const [contactData, setContactData] = useState({
    name: '',
    phone: '',
    email: '',
    organization: ''
  });
  
  const [locationData, setLocationData] = useState({
    latitude: '',
    longitude: '',
    altitude: ''
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Carica cronologia
  useEffect(() => {
    const savedHistory = localStorage.getItem('manus_qr_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getQRData = () => {
    const type = qrTypes.find(t => t.id === activeType);
    if (!type) return inputText;

    switch (activeType) {
      case 'wifi':
        return `WIFI:T:${wifiData.security};S:${wifiData.ssid};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`;
      
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
TEL:${contactData.phone}
EMAIL:${contactData.email}
ORG:${contactData.organization}
END:VCARD`;
      
      case 'location':
        return `geo:${locationData.latitude},${locationData.longitude}${locationData.altitude ? `,${locationData.altitude}` : ''}`;
      
      case 'url':
        return inputText.startsWith('http') ? inputText : `https://${inputText}`;
      
      case 'email':
        return `mailto:${inputText}`;
      
      case 'phone':
        return `tel:${inputText}`;
      
      case 'sms':
        return `sms:${inputText}`;
      
      default:
        return inputText;
    }
  };

  const generateQR = async () => {
    const data = getQRData();
    if (!data.trim()) return;

    setIsGenerating(true);
    
    try {
      // Simuliamo un piccolo delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = generateQRCode(data, qrSize, errorCorrection);
      setGeneratedQR(dataUrl);
      
      // Salva nella cronologia
      const qrCode: QRCode = {
        id: Date.now().toString(),
        data,
        type: activeType,
        size: qrSize,
        errorCorrection,
        dataUrl,
        timestamp: Date.now()
      };
      
      const updatedHistory = [qrCode, ...history].slice(0, 20);
      setHistory(updatedHistory);
      localStorage.setItem('manus_qr_history', JSON.stringify(updatedHistory));
      
    } catch (error) {
      console.error('Errore nella generazione QR:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!generatedQR) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = generatedQR;
    link.click();
  };

  const copyQRToClipboard = async () => {
    if (!generatedQR) return;
    
    try {
      const response = await fetch(generatedQR);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
    } catch (error) {
      console.error('Errore copia QR:', error);
    }
  };

  const shareQR = async () => {
    if (!generatedQR || !navigator.share) return;
    
    try {
      const response = await fetch(generatedQR);
      const blob = await response.blob();
      const file = new File([blob], 'qr-code.png', { type: 'image/png' });
      
      await navigator.share({
        title: 'QR Code',
        text: 'QR Code generato con Manus AI',
        files: [file]
      });
    } catch (error) {
      console.error('Errore condivisione:', error);
    }
  };

  const currentType = qrTypes.find(t => t.id === activeType);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="flex items-center gap-3">
          <QrCode className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Generatore QR Code</h2>
            <p className="text-sm opacity-90">Crea QR code personalizzati per ogni tipo di dato</p>
          </div>
        </div>
      </div>

      {/* Type Selector */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <Tabs value={activeType} onValueChange={setActiveType}>
          <TabsList className="grid grid-cols-4 gap-1 h-auto p-1 md:grid-cols-8">
            {qrTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TabsTrigger
                  key={type.id}
                  value={type.id}
                  className="flex flex-col items-center gap-1 p-2 text-xs"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{type.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Input Panel */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentType && <currentType.icon className="h-5 w-5" />}
              {currentType?.name}
              <Badge variant="outline">Tipo {activeType}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Input specifico per tipo */}
            {activeType === 'wifi' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Nome Rete (SSID)</label>
                  <Input
                    value={wifiData.ssid}
                    onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                    placeholder="Nome della rete WiFi"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    value={wifiData.password}
                    onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                    placeholder="Password rete"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Sicurezza</label>
                  <Select value={wifiData.security} onValueChange={(value) => setWifiData({...wifiData, security: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="WPA">WPA/WPA2</SelectItem>
                      <SelectItem value="WEP">WEP</SelectItem>
                      <SelectItem value="nopass">Nessuna</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ) : activeType === 'vcard' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Nome Completo</label>
                  <Input
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    placeholder="Mario Rossi"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefono</label>
                  <Input
                    value={contactData.phone}
                    onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                    placeholder="+39 123 456 7890"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={contactData.email}
                    onChange={(e) => setContactData({...contactData, email: e.target.value})}
                    placeholder="mario@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Organizzazione</label>
                  <Input
                    value={contactData.organization}
                    onChange={(e) => setContactData({...contactData, organization: e.target.value})}
                    placeholder="Azienda S.r.l."
                  />
                </div>
              </div>
            ) : activeType === 'location' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Latitudine</label>
                  <Input
                    value={locationData.latitude}
                    onChange={(e) => setLocationData({...locationData, latitude: e.target.value})}
                    placeholder="41.9028"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Longitudine</label>
                  <Input
                    value={locationData.longitude}
                    onChange={(e) => setLocationData({...locationData, longitude: e.target.value})}
                    placeholder="12.4964"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Altitudine (opzionale)</label>
                  <Input
                    value={locationData.altitude}
                    onChange={(e) => setLocationData({...locationData, altitude: e.target.value})}
                    placeholder="50"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium">
                  {activeType === 'text' ? 'Testo' : 
                   activeType === 'url' ? 'URL' :
                   activeType === 'email' ? 'Indirizzo Email' :
                   activeType === 'phone' ? 'Numero di Telefono' :
                   activeType === 'sms' ? 'Numero per SMS' : 'Contenuto'}
                </label>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    activeType === 'url' ? 'www.example.com' :
                    activeType === 'email' ? 'nome@example.com' :
                    activeType === 'phone' ? '+39 123 456 7890' :
                    activeType === 'sms' ? '+39 123 456 7890' :
                    'Inserisci il contenuto...'
                  }
                  className="min-h-24"
                />
              </div>
            )}

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium">Dimensione</label>
                <Select value={qrSize.toString()} onValueChange={(value) => setQrSize(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="128">128x128</SelectItem>
                    <SelectItem value="256">256x256</SelectItem>
                    <SelectItem value="512">512x512</SelectItem>
                    <SelectItem value="1024">1024x1024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Correzione Errori</label>
                <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Bassa (~7%)</SelectItem>
                    <SelectItem value="M">Media (~15%)</SelectItem>
                    <SelectItem value="Q">Alta (~25%)</SelectItem>
                    <SelectItem value="H">Massima (~30%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generateQR} 
              disabled={isGenerating || !getQRData().trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generazione...
                </>
              ) : (
                <>
                  <QrCode className="h-4 w-4 mr-2" />
                  Genera QR Code
                </>
              )}
            </Button>

            {/* Preview Data */}
            {getQRData().trim() && (
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Anteprima dati:</p>
                <p className="text-sm font-mono break-all">
                  {getQRData().length > 100 ? getQRData().substring(0, 100) + '...' : getQRData()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Preview & History */}
        <div className="w-80 space-y-4">
          
          {/* QR Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">QR Code</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {generatedQR ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="space-y-4"
                >
                  <div className="inline-block p-4 bg-white rounded-lg shadow-sm">
                    <img 
                      src={generatedQR} 
                      alt="QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                  
                  <div className="flex gap-2 justify-center">
                    <Button size="sm" onClick={downloadQR}>
                      <Download className="h-4 w-4 mr-1" />
                      Scarica
                    </Button>
                    <Button size="sm" variant="outline" onClick={copyQRToClipboard}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copia
                    </Button>
                    {navigator.share && (
                      <Button size="sm" variant="outline" onClick={shareQR}>
                        <Share className="h-4 w-4 mr-1" />
                        Condividi
                      </Button>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="py-12">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm text-gray-500">
                    Il QR code apparirà qui dopo la generazione
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Cronologia
                <Badge>{history.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-80 overflow-auto">
              {history.length > 0 ? (
                history.map((qr) => (
                  <div
                    key={qr.id}
                    className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setGeneratedQR(qr.dataUrl)}
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={qr.dataUrl} 
                        alt="QR" 
                        className="w-12 h-12 object-contain rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {qrTypes.find(t => t.id === qr.type)?.name || qr.type}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {qr.data.length > 30 ? qr.data.substring(0, 30) + '...' : qr.data}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(qr.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <QrCode className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Nessun QR code nella cronologia</p>
                </div>
              )}

              {history.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setHistory([]);
                    localStorage.removeItem('manus_qr_history');
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Cancella Cronologia
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}