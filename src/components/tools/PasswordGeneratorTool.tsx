// ========================================
// MANUS AI ULTRA - PASSWORD GENERATOR TOOL
// ========================================

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  KeyRound,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';

interface PasswordGeneratorToolProps {
  tool?: any;
}

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

const CHARACTER_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export default function PasswordGeneratorTool({ tool }: PasswordGeneratorToolProps) {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const calculatePasswordStrength = (password: string): number => {
    let score = 0;

    if (password.length >= 12) score += 25;
    else if (password.length >= 8) score += 15;
    else score += 5;

    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/\d/.test(password)) score += 15;
    if (/[^\\w\\s]/.test(password)) score += 20;

    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 10;

    return Math.min(score, 100);
  };

  const generatePassword = () => {
    let charset = '';
    
    if (options.uppercase) charset += CHARACTER_SETS.uppercase;
    if (options.lowercase) charset += CHARACTER_SETS.lowercase;
    if (options.numbers) charset += CHARACTER_SETS.numbers;
    if (options.symbols) charset += CHARACTER_SETS.symbols;

    if (!charset) return;

    let password = '';
    const array = new Uint32Array(options.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < options.length; i++) {
      password += charset[array[i] % charset.length];
    }

    setCurrentPassword(password);
    setStrength(calculatePasswordStrength(password));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    generatePassword();
  }, [options]);

  const hasValidOptions = options.uppercase || options.lowercase || options.numbers || options.symbols;

  const getStrengthLabel = (score: number) => {
    if (score >= 80) return { label: 'Eccellente', color: 'green' };
    if (score >= 60) return { label: 'Forte', color: 'blue' };
    if (score >= 40) return { label: 'Media', color: 'yellow' };
    if (score >= 20) return { label: 'Debole', color: 'orange' };
    return { label: 'Molto Debole', color: 'red' };
  };

  const strengthInfo = getStrengthLabel(strength);

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="flex items-center gap-3">
          <KeyRound className="h-6 w-6" />
          <div>
            <h2 className="text-lg font-bold">Generatore Password</h2>
            <p className="text-sm opacity-90">Crea password sicure e personalizzate</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4 p-4">
        
        {/* Settings Panel */}
        <Card className="w-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Impostazioni
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Length */}
            <div>
              <label className="text-sm font-medium">Lunghezza: {options.length}</label>
              <input
                type="range"
                min="4"
                max="64"
                value={options.length}
                onChange={(e) => setOptions({...options, length: parseInt(e.target.value)})}
                className="w-full mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>64</span>
              </div>
            </div>

            {/* Character Types */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Maiuscole (A-Z)</label>
                <Switch
                  checked={options.uppercase}
                  onCheckedChange={(checked) => setOptions({...options, uppercase: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Minuscole (a-z)</label>
                <Switch
                  checked={options.lowercase}
                  onCheckedChange={(checked) => setOptions({...options, lowercase: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Numeri (0-9)</label>
                <Switch
                  checked={options.numbers}
                  onCheckedChange={(checked) => setOptions({...options, numbers: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Simboli (!@#$)</label>
                <Switch
                  checked={options.symbols}
                  onCheckedChange={(checked) => setOptions({...options, symbols: checked})}
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generatePassword}
              disabled={!hasValidOptions}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Genera Password
            </Button>

            {!hasValidOptions && (
              <div className="text-sm text-red-500 text-center">
                Seleziona almeno un tipo di carattere
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Password */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Password Generata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Password Display */}
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  readOnly
                  className="font-mono text-lg pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(currentPassword)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="outline">{currentPassword.length} caratteri</Badge>
              </div>
            </div>

            {/* Strength Meter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Forza Password</span>
                  <Badge 
                    variant={strength >= 60 ? 'default' : strength >= 30 ? 'secondary' : 'destructive'}
                  >
                    {strengthInfo.label} ({strength}%)
                  </Badge>
                </div>
                <Progress value={strength} className="h-2" />
              </div>

              {/* Security Tips */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Consigli di Sicurezza
                </h4>
                <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <div>• Non riutilizzare la password</div>
                  <div>• Conserva in un password manager</div>
                  <div>• Abilita autenticazione 2FA</div>
                </div>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
