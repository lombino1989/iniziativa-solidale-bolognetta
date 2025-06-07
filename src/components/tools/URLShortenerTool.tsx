import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Link,
  Globe,
  Copy,
  Share,
  Download,
  QrCode,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Trash2,
  Eye
} from 'lucide-react';

interface URLShortenerToolProps {
  tool: {
    id: string;
    name: string;
    description: string;
  };
}

interface ShortenedURL {
  id: string;
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  title: string;
  clicks: number;
  createdAt: number;
  lastAccessed?: number;
  isCustom: boolean;
}

export default function URLShortenerTool({ tool }: URLShortenerToolProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [useCustomCode, setUseCustomCode] = useState(false);
  const [currentShortened, setCurrentShortened] = useState<ShortenedURL | null>(null);
  const [urlHistory, setUrlHistory] = useState<ShortenedURL[]>([]);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedURL | null>(null);
  const [showQR, setShowQR] = useState(false);

  // Load URL history from localStorage
  useEffect(() => {
    try {
      const savedUrls = localStorage.getItem('manus_shortened_urls');
      if (savedUrls) {
        setUrlHistory(JSON.parse(savedUrls));
      }
    } catch (error) {
      console.warn('Errore caricamento cronologia URL:', error);
    }
  }, []);

  // Save to localStorage
  const saveToStorage = (urls: ShortenedURL[]) => {
    try {
      localStorage.setItem('manus_shortened_urls', JSON.stringify(urls));
    } catch (error) {
      console.warn('Errore salvataggio URL:', error);
    }
  };

  // Generate random short code
  const generateShortCode = (length: number = 6): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Validate URL
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.startsWith('http://') || url.startsWith('https://');
    } catch {
      return false;
    }
  };

  // Extract title from URL (simplified)
  const extractTitle = async (url: string): Promise<string> => {
    try {
      // In a real implementation, this would fetch the page and extract the title
      // For this demo, we'll generate a title based on the domain
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace('www.', '');
      const path = urlObj.pathname;
      
      if (path && path !== '/') {
        const pathParts = path.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          return `${domain} - ${pathParts[pathParts.length - 1].replace(/[-_]/g, ' ')}`;
        }
      }
      
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return 'Untitled';
    }
  };

  // Shorten URL
  const shortenUrl = async () => {
    if (!originalUrl.trim()) return;

    const isValid = validateUrl(originalUrl);
    setIsValidUrl(isValid);
    
    if (!isValid) return;

    setIsGenerating(true);

    try {
      // Check if custom code is already used
      if (useCustomCode && customCode) {
        const existingUrl = urlHistory.find(url => url.shortCode === customCode);
        if (existingUrl) {
          alert('Codice personalizzato già in uso!');
          setIsGenerating(false);
          return;
        }
      }

      const shortCode = useCustomCode && customCode ? customCode : generateShortCode();
      const baseUrl = 'https://manus.ly'; // Simulated short domain
      const shortUrl = `${baseUrl}/${shortCode}`;
      const title = await extractTitle(originalUrl);
      
      const newUrl: ShortenedURL = {
        id: `url-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        originalUrl,
        shortUrl,
        shortCode,
        title,
        clicks: 0,
        createdAt: Date.now(),
        isCustom: useCustomCode && !!customCode
      };

      setCurrentShortened(newUrl);
      const updatedHistory = [newUrl, ...urlHistory].slice(0, 100); // Keep last 100
      setUrlHistory(updatedHistory);
      saveToStorage(updatedHistory);
      
      // Clear form
      setOriginalUrl('');
      setCustomCode('');
    } catch (error) {
      console.error('Errore accorciamento URL:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate click tracking
  const simulateClick = (url: ShortenedURL) => {
    const updatedHistory = urlHistory.map(u => 
      u.id === url.id 
        ? { ...u, clicks: u.clicks + 1, lastAccessed: Date.now() }
        : u
    );
    setUrlHistory(updatedHistory);
    saveToStorage(updatedHistory);
    
    if (currentShortened?.id === url.id) {
      setCurrentShortened({ ...url, clicks: url.clicks + 1, lastAccessed: Date.now() });
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Generate QR Code (simple implementation)
  const generateQRCode = (text: string): string => {
    // Using QR Server API for QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
  };

  // Share URL
  const shareUrl = async (url: ShortenedURL) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: url.title || 'Link Condiviso',
          text: `Guarda questo link: ${url.title}`,
          url: url.shortUrl
        });
      } catch (error) {
        copyToClipboard(url.shortUrl);
      }
    } else {
      copyToClipboard(url.shortUrl);
    }
  };

  // Download analytics
  const downloadAnalytics = () => {
    const analytics = urlHistory.map(url => ({
      shortUrl: url.shortUrl,
      originalUrl: url.originalUrl,
      title: url.title,
      clicks: url.clicks,
      created: new Date(url.createdAt).toISOString(),
      lastAccessed: url.lastAccessed ? new Date(url.lastAccessed).toISOString() : 'Never'
    }));

    const content = 'Short URL,Original URL,Title,Clicks,Created,Last Accessed\n' +
      analytics.map(a => `${a.shortUrl},${a.originalUrl},"${a.title}",${a.clicks},${a.created},${a.lastAccessed}`).join('\n');
    
    const blob = new Blob([content], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `url_analytics_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const clearAll = () => {
    setUrlHistory([]);
    setCurrentShortened(null);
    setSelectedUrl(null);
    localStorage.removeItem('manus_shortened_urls');
  };

  // Calculate analytics
  const getTotalClicks = () => urlHistory.reduce((sum, url) => sum + url.clicks, 0);
  const getMostClicked = () => {
    return urlHistory.length > 0 
      ? urlHistory.reduce((max, url) => url.clicks > max.clicks ? url : max)
      : null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
        <div className="flex items-center gap-3">
          <Link className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">URL Shortener</h2>
            <p className="text-sm opacity-90">Accorcia link lunghi e monitora le statistiche di accesso</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Main Tool */}
        <div className="flex-1 space-y-4">
          
          {/* URL Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Accorcia URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Original URL */}
              <div>
                <label className="text-sm font-medium">URL da accorciare:</label>
                <Input
                  value={originalUrl}
                  onChange={(e) => {
                    setOriginalUrl(e.target.value);
                    setIsValidUrl(true);
                  }}
                  placeholder="https://example.com/very/long/url/that/needs/shortening"
                  className={!isValidUrl ? 'border-red-300' : ''}
                />
                {!isValidUrl && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    URL non valido. Deve iniziare con http:// o https://
                  </p>
                )}
              </div>

              {/* Custom Code Option */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Codice personalizzato:</label>
                  <Switch
                    checked={useCustomCode}
                    onCheckedChange={setUseCustomCode}
                  />
                </div>
                
                {useCustomCode && (
                  <div>
                    <Input
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                      placeholder="codice-personalizzato"
                      maxLength={20}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Solo lettere, numeri, trattini e underscore. Max 20 caratteri.
                    </p>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <Button 
                onClick={shortenUrl}
                disabled={!originalUrl.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generazione...
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Accorcia URL
                  </>
                )}
              </Button>

            </CardContent>
          </Card>

          {/* Result */}
          {currentShortened && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  URL Accorciato con Successo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Short URL Display */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500">URL Accorciato:</span>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => copyToClipboard(currentShortened.shortUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => shareUrl(currentShortened)}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQR(!showQR)}
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-lg font-mono text-blue-600 dark:text-blue-400 mb-2">
                    {currentShortened.shortUrl}
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Titolo:</strong> {currentShortened.title}</p>
                    <p><strong>Creato:</strong> {new Date(currentShortened.createdAt).toLocaleString()}</p>
                    <p><strong>Click:</strong> {currentShortened.clicks}</p>
                  </div>
                  
                  {/* QR Code */}
                  {showQR && (
                    <div className="mt-4 text-center">
                      <img
                        src={generateQRCode(currentShortened.shortUrl)}
                        alt="QR Code"
                        className="mx-auto rounded border"
                      />
                      <p className="text-xs text-gray-500 mt-2">Scansiona per aprire il link</p>
                    </div>
                  )}
                </div>

                {/* Original URL */}
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>URL Originale:</strong>
                  <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs break-all">
                    {currentShortened.originalUrl}
                  </div>
                </div>

              </CardContent>
            </Card>
          )}

        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-4">
          
          <Tabs defaultValue="history" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="history">Cronologia</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">URL Recenti</CardTitle>
                    {urlHistory.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAll}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {urlHistory.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      Nessun URL accorciato ancora
                    </p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {urlHistory.slice(0, 20).map((url) => (
                        <div
                          key={url.id}
                          className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm truncate flex-1">
                              {url.title}
                            </h4>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(url.shortUrl)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => simulateClick(url)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-mono mb-1">
                            {url.shortUrl}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{url.clicks} click</span>
                            <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          {url.isCustom && (
                            <Badge variant="secondary" className="text-xs mt-2">
                              Personalizzato
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Statistiche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Overview Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{urlHistory.length}</div>
                      <div className="text-xs text-gray-500">URL Totali</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{getTotalClicks()}</div>
                      <div className="text-xs text-gray-500">Click Totali</div>
                    </div>
                  </div>

                  {/* Most Clicked */}
                  {getMostClicked() && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Più Cliccato:</h4>
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                        <div className="font-medium">{getMostClicked()?.title}</div>
                        <div className="text-gray-500">{getMostClicked()?.clicks} click</div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAnalytics}
                      disabled={urlHistory.length === 0}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Scarica Analytics CSV
                    </Button>
                  </div>

                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

        </div>

      </div>
    </div>
  );
}
