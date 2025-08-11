import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const AuthErrorTest: React.FC = () => {
  const [email, setEmail] = useState('teste@inexistente.com');
  const [password, setPassword] = useState('senha123');
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const runTest = async () => {
    setIsLoading(true);
    setTestResult('Iniciando teste...');
    
    try {
      console.log('🧪 AuthErrorTest - Iniciando teste com credenciais inválidas');
      await login(email, password);
      setTestResult('❌ ERRO: Login não deveria ter sido bem-sucedido!');
    } catch (error: any) {
      console.log('🧪 AuthErrorTest - Erro capturado:', error);
      const errorMessage = error.message || 'Erro desconhecido';
      setTestResult(`✅ SUCESSO: Erro capturado corretamente - "${errorMessage}"`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearTest = () => {
    setTestResult('');
    setEmail('teste@inexistente.com');
    setPassword('senha123');
  };

  return (
    <div className="fixed top-4 left-4 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">🧪 Teste de Erro</span>
            <Badge variant="outline">Debug</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Email (inválido)</Label>
            <Input
              id="test-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teste@inexistente.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="test-password">Senha (inválida)</Label>
            <Input
              id="test-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="senha123"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={runTest}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Testando...' : 'Executar Teste'}
            </Button>
            <Button
              onClick={clearTest}
              variant="outline"
              size="sm"
            >
              Limpar
            </Button>
          </div>

          {testResult && (
            <div className="p-3 rounded border">
              <p className="text-sm font-medium">Resultado do Teste:</p>
              <p className="text-xs mt-1">{testResult}</p>
            </div>
          )}

          <div className="text-xs text-gray-600">
            <p><strong>Objetivo:</strong> Verificar se erro de credenciais inválidas é tratado corretamente</p>
            <p><strong>Esperado:</strong> Mensagem de erro deve aparecer na tela sem "piscar"</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthErrorTest;
