import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

interface TestScenario {
  id: string;
  name: string;
  description: string;
  category: 'login' | 'register' | 'validation' | 'network' | 'protection';
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  instructions: string;
  expectedResult: string;
}

const AuthTestPanel: React.FC = () => {
  const [scenarios, setScenarios] = useState<TestScenario[]>([
    // Cenários de Login
    {
      id: 'login-empty-fields',
      name: 'Campos Vazios no Login',
      description: 'Tentar fazer login deixando campos vazios',
      category: 'login',
      status: 'pending',
      instructions: '1. Deixe o campo email vazio\n2. Deixe o campo senha vazio\n3. Clique em "Entrar"',
      expectedResult: 'Mensagens de erro específicas para cada campo'
    },
    {
      id: 'login-invalid-email',
      name: 'Email Inválido',
      description: 'Inserir email com formato inválido',
      category: 'login',
      status: 'pending',
      instructions: '1. Digite "teste" no campo email\n2. Digite qualquer senha\n3. Clique em "Entrar"',
      expectedResult: 'Mensagem "Email inválido"'
    },
    {
      id: 'login-short-password',
      name: 'Senha Muito Curta',
      description: 'Inserir senha com menos de 6 caracteres',
      category: 'login',
      status: 'pending',
      instructions: '1. Digite um email válido\n2. Digite "123" no campo senha\n3. Clique em "Entrar"',
      expectedResult: 'Mensagem "Senha deve ter pelo menos 6 caracteres"'
    },
    {
      id: 'login-invalid-credentials',
      name: 'Credenciais Inválidas',
      description: 'Usar email/senha que não existem',
      category: 'login',
      status: 'pending',
      instructions: '1. Digite "teste@inexistente.com"\n2. Digite "senha123"\n3. Clique em "Entrar"',
      expectedResult: 'Toast de erro "Senha incorreta. Por favor, verifique suas credenciais."'
    },
    {
      id: 'login-loading-state',
      name: 'Estado de Loading',
      description: 'Verificar se o botão fica desabilitado durante login',
      category: 'login',
      status: 'pending',
      instructions: '1. Digite credenciais válidas\n2. Clique em "Entrar"\n3. Observe o botão',
      expectedResult: 'Botão desabilitado com texto "Entrando..." e spinner'
    },

    // Cenários de Registro
    {
      id: 'register-empty-fields',
      name: 'Campos Vazios no Registro',
      description: 'Tentar registrar deixando campos obrigatórios vazios',
      category: 'register',
      status: 'pending',
      instructions: '1. Mude para "Cadastre-se"\n2. Deixe campos vazios\n3. Clique em "Criar conta"',
      expectedResult: 'Mensagens de erro para campos obrigatórios'
    },
    {
      id: 'register-duplicate-email',
      name: 'Email Duplicado',
      description: 'Tentar registrar com email já existente',
      category: 'register',
      status: 'pending',
      instructions: '1. Use um email já registrado\n2. Preencha outros campos\n3. Clique em "Criar conta"',
      expectedResult: 'Toast de erro sobre email já existente'
    },
    {
      id: 'register-password-mismatch',
      name: 'Senhas Não Coincidem',
      description: 'Inserir senhas diferentes nos campos',
      category: 'register',
      status: 'pending',
      instructions: '1. Digite "senha123" na senha\n2. Digite "senha456" na confirmação\n3. Clique em "Criar conta"',
      expectedResult: 'Mensagem "Senhas não coincidem"'
    },

    // Cenários de Validação
    {
      id: 'validation-real-time',
      name: 'Validação em Tempo Real',
      description: 'Verificar se validação acontece durante digitação',
      category: 'validation',
      status: 'pending',
      instructions: '1. Digite "teste" no campo email\n2. Observe se aparece erro imediatamente',
      expectedResult: 'Erro aparece assim que o campo perde foco'
    },

    // Cenários de Proteção
    {
      id: 'protection-unauthorized-access',
      name: 'Acesso Não Autorizado',
      description: 'Tentar acessar rota protegida sem login',
      category: 'protection',
      status: 'pending',
      instructions: '1. Limpe o localStorage\n2. Tente acessar /dashboard diretamente',
      expectedResult: 'Redirecionamento para página de login'
    },

    // Cenários de Rede
    {
      id: 'network-error',
      name: 'Erro de Rede',
      description: 'Simular erro de conexão',
      category: 'network',
      status: 'pending',
      instructions: '1. Desconecte a internet\n2. Tente fazer login\n3. Reconecte a internet',
      expectedResult: 'Toast "Erro de conexão com o servidor"'
    }
  ]);

  const updateScenarioStatus = (id: string, status: TestScenario['status']) => {
    setScenarios(prev => 
      prev.map(scenario => 
        scenario.id === id ? { ...scenario, status } : scenario
      )
    );
  };

  const getStatusIcon = (status: TestScenario['status']) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'skipped': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestScenario['status']) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      skipped: 'secondary',
      pending: 'outline'
    } as const;

    const labels = {
      passed: 'Aprovado',
      failed: 'Falhou',
      skipped: 'Pulado',
      pending: 'Pendente'
    };

    return (
      <Badge variant={variants[status]}>
        {getStatusIcon(status)}
        <span className="ml-1">{labels[status]}</span>
      </Badge>
    );
  };

  const getCategoryColor = (category: TestScenario['category']) => {
    const colors = {
      login: 'bg-blue-100 text-blue-800',
      register: 'bg-green-100 text-green-800',
      validation: 'bg-purple-100 text-purple-800',
      network: 'bg-orange-100 text-orange-800',
      protection: 'bg-red-100 text-red-800'
    };
    return colors[category];
  };

  const clearAllTests = () => {
    setScenarios(prev => 
      prev.map(scenario => ({ ...scenario, status: 'pending' }))
    );
  };

  const exportResults = () => {
    const results = scenarios.map(s => ({
      name: s.name,
      status: s.status,
      category: s.category
    }));
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'auth-test-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-4 right-4 w-96 max-h-screen overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">🧪 Testes de Auth</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={clearAllTests}>
                Limpar
              </Button>
              <Button size="sm" variant="outline" onClick={exportResults}>
                Exportar
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="border rounded-lg p-3 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{scenario.name}</h4>
                    <Badge className={`text-xs ${getCategoryColor(scenario.category)}`}>
                      {scenario.category}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{scenario.description}</p>
                  
                  <div className="space-y-1">
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium text-gray-700">
                        Instruções
                      </summary>
                      <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">
                        {scenario.instructions}
                      </pre>
                    </details>
                    
                    <details className="text-xs">
                      <summary className="cursor-pointer font-medium text-gray-700">
                        Resultado Esperado
                      </summary>
                      <p className="mt-1 text-xs text-gray-600">
                        {scenario.expectedResult}
                      </p>
                    </details>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1 ml-2">
                  {getStatusBadge(scenario.status)}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => updateScenarioStatus(scenario.id, 'passed')}
                    >
                      ✓
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => updateScenarioStatus(scenario.id, 'failed')}
                    >
                      ✗
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => updateScenarioStatus(scenario.id, 'skipped')}
                    >
                      -
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <Separator />
          
          <div className="text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Total: {scenarios.length}</span>
              <span>Aprovados: {scenarios.filter(s => s.status === 'passed').length}</span>
              <span>Falharam: {scenarios.filter(s => s.status === 'failed').length}</span>
              <span>Pulados: {scenarios.filter(s => s.status === 'skipped').length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTestPanel;
