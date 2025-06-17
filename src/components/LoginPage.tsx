
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            EnemPrep <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Simulados inteligentes e personalizados que se adaptam ao seu nível de conhecimento
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Diagnóstico IA</h3>
              <p className="text-sm text-gray-600 text-center">Avaliação inicial para personalizar seu aprendizado</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Trilhas Adaptativas</h3>
              <p className="text-sm text-gray-600 text-center">Questões que evoluem com seu progresso</p>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Progresso Gamificado</h3>
              <p className="text-sm text-gray-600 text-center">Metas diárias e acompanhamento detalhado</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-blue-100">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-blue-900">Começar Agora</CardTitle>
            <p className="text-gray-600">Digite seu nome para acessar a plataforma</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Seu nome completo"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-lg p-3 border-blue-200 focus:border-blue-500"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                disabled={!username.trim()}
              >
                Iniciar Jornada
              </Button>
            </form>
            <p className="text-xs text-gray-500 text-center mt-4">
              Ao continuar, você aceita participar do programa de mentoria personalizada
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
