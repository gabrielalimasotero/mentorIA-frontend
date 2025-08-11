import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface StateLog {
  timestamp: string;
  isAuthenticated: boolean;
  hasUser: boolean;
  hasToken: boolean;
  action: string;
  details?: string;
}

const DebugAuthState: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [logs, setLogs] = useState<StateLog[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  
  // 🔍 DIAGNÓSTICO AVANÇADO - Rastrear mudanças de estado
  const prevState = useRef({
    isAuthenticated,
    hasUser: !!user,
    hasToken: !!localStorage.getItem('token')
  });

  useEffect(() => {
    const currentState = {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!localStorage.getItem('token')
    };

    const newLog: StateLog = {
      timestamp: new Date().toLocaleTimeString(),
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!localStorage.getItem('token'),
      action: 'State Change',
      details: `Auth: ${isAuthenticated}, User: ${!!user}`
    };

    // 🔍 DIAGNÓSTICO - Detectar mudanças suspeitas
    const prev = prevState.current;
    const changes = [];
    
    if (prev.isAuthenticated !== currentState.isAuthenticated) {
      changes.push(`Auth: ${prev.isAuthenticated} → ${currentState.isAuthenticated}`);
    }
    if (prev.hasUser !== currentState.hasUser) {
      changes.push(`User: ${prev.hasUser} → ${currentState.hasUser}`);
    }
    if (prev.hasToken !== currentState.hasToken) {
      changes.push(`Token: ${prev.hasToken} → ${currentState.hasToken}`);
    }

    if (changes.length > 0) {
      console.log(`🔍 DebugAuthState - Mudanças detectadas: ${changes.join(', ')}`);
      
      // 🔍 ALERTA - Mudanças suspeitas
      if (prev.isAuthenticated && !currentState.isAuthenticated && prev.hasUser && !currentState.hasUser) {
        console.error('🚨 ALERTA CRÍTICO: Reset completo detectado!');
        console.error('🚨 Stack trace:', new Error().stack);
        
        // Adicionar alerta visual
        newLog.details = `🚨 RESET DETECTADO: ${changes.join(', ')}`;
      }
    }

    prevState.current = currentState;
    setLogs(prev => [newLog, ...prev.slice(0, 9)]); // Manter apenas os últimos 10 logs
  }, [isAuthenticated, user]);

  // 🔍 DIAGNÓSTICO - Monitorar localStorage
  useEffect(() => {
    const checkLocalStorage = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token && prevState.current.hasToken) {
        console.error('🚨 ALERTA: Token removido do localStorage!');
      }
      if (!user && prevState.current.hasUser) {
        console.error('🚨 ALERTA: User removido do localStorage!');
      }
    };

    // Verificar a cada 100ms
    const interval = setInterval(checkLocalStorage, 100);
    return () => clearInterval(interval);
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusColor = (value: boolean) => {
    return value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const checkForReset = () => {
    if (logs.length < 2) return null;
    
    const current = logs[0];
    const previous = logs[1];
    
    // Verificar se houve reset (mudança brusca de estado)
    if (previous.isAuthenticated && !current.isAuthenticated && previous.hasUser && !current.hasUser) {
      return 'RESET DETECTADO: Usuário foi desautenticado';
    }
    
    if (previous.hasToken && !current.hasToken) {
      return 'RESET DETECTADO: Token foi removido';
    }
    
    return null;
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed top-4 left-4 bg-blue-600 text-white p-2 rounded-full shadow-lg z-50"
      >
        🐛
      </button>
    );
  }

  const resetWarning = checkForReset();

  return (
    <div className="fixed top-4 left-4 w-96 max-h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">🐛 Debug Auth State</span>
            <div className="flex gap-2">
              <button
                onClick={clearLogs}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded"
              >
                X
              </button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Alerta de Reset */}
          {resetWarning && (
            <div className="p-2 bg-red-100 border border-red-300 rounded text-xs text-red-800">
              ⚠️ {resetWarning}
            </div>
          )}

          {/* Estado Atual */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Estado Atual:</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span>isAuthenticated:</span>
                <Badge className={getStatusColor(isAuthenticated)}>
                  {isAuthenticated ? 'true' : 'false'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>hasUser:</span>
                <Badge className={getStatusColor(!!user)}>
                  {!!user ? 'true' : 'false'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>hasToken:</span>
                <Badge className={getStatusColor(!!localStorage.getItem('token'))}>
                  {!!localStorage.getItem('token') ? 'true' : 'false'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Logs */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Logs de Mudança:</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-xs p-2 bg-gray-50 rounded border">
                  <div className="flex justify-between">
                    <span className="font-mono">{log.timestamp}</span>
                    <span className="text-gray-500">{log.action}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-1">
                    <span>Auth: {log.isAuthenticated ? '✓' : '✗'}</span>
                    <span>User: {log.hasUser ? '✓' : '✗'}</span>
                    <span>Token: {log.hasToken ? '✓' : '✗'}</span>
                  </div>
                  {log.details && (
                    <div className="mt-1 text-gray-600 font-mono text-xs">
                      {log.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="text-xs text-gray-600">
            <p><strong>Objetivo:</strong> Monitorar mudanças de estado em tempo real</p>
            <p><strong>Problema:</strong> Identificar quando e por que a tela "pisca"</p>
            <p><strong>Nova Arquitetura:</strong> Sem useEffect de inicialização</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugAuthState;
