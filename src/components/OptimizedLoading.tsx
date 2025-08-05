import React from 'react';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Loader2, Zap, Clock } from 'lucide-react';

interface OptimizedLoadingProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
}

const OptimizedLoading = ({ 
  message = 'Carregando questões...', 
  showProgress = false,
  progress = 0 
}: OptimizedLoadingProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardContent className="text-center py-12">
          <div className="flex flex-col items-center space-y-6">
            {/* Ícone de loading animado */}
            <div className="relative">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              <Zap className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            
            {/* Mensagem principal */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {message}
              </h3>
              <p className="text-gray-600 max-w-md">
                Estamos otimizando sua experiência de estudo...
              </p>
            </div>

            {/* Progress bar se habilitada */}
            {showProgress && (
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Carregando competências</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Dicas de otimização */}
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Primeira vez pode demorar um pouco mais</span>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-green-600">
              <Zap className="h-4 w-4" />
              <span>Próximas vezes serão muito mais rápidas!</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedLoading; 