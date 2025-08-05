
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Atom, Globe, BookOpen, Lock, PlayCircle, CheckCircle, Target } from 'lucide-react';
import PersonalizedLearningPaths from './PersonalizedLearningPaths';

interface SubjectTrailsProps {
  hasCompletedDiagnostic: boolean;
  onStartDiagnostic: () => void;
  onStartTraining: () => void;
  onContinueTraining?: () => void;
}

const SubjectTrails = ({ hasCompletedDiagnostic, onStartDiagnostic, onStartTraining, onContinueTraining }: SubjectTrailsProps) => {
  const [showPersonalizedPaths, setShowPersonalizedPaths] = useState(false);
  
  // Verificar se há trilhas personalizadas
  const hasPersonalizedPaths = localStorage.getItem('learning_paths') !== null;
  
  // Verificar se há uma sessão de treinamento em andamento
  const hasActiveTrainingSession = (() => {
    try {
      const trainingProgress = localStorage.getItem('training_progress');
      if (!trainingProgress) return false;
      
      const progress = JSON.parse(trainingProgress);
      const today = new Date().toDateString();
      
      // Verificar se é uma sessão de hoje
      if (progress.date !== today) return false;
      
      // Se há uma sessão ativa (currentSession existe), verificar se não foi completada
      if (progress.currentSession) {
        return progress.currentSession.currentQuestion < 20;
      }
      
      // Se não há sessão ativa, mas já completou questões hoje, considerar como "continuar"
      // (usuário pode querer fazer mais questões além das 20 diárias)
      return progress.completed && progress.completed > 0;
    } catch (error) {
      console.error('Erro ao verificar sessão ativa:', error);
      return false;
    }
  })();
  
  const subjects = [
    {
      id: 'math',
      title: 'Matemática',
      description: 'Álgebra, Geometria, Estatística e mais',
      icon: Calculator,
      available: true,
      color: 'blue',
      questions: 45
    },
    {
      id: 'sciences',
      title: 'Ciências da Natureza',
      description: 'Física, Química e Biologia',
      icon: Atom,
      available: false,
      color: 'green',
      questions: 45
    },
    {
      id: 'humanities',
      title: 'Ciências Humanas',
      description: 'História, Geografia, Filosofia e Sociologia',
      icon: Globe,
      available: false,
      color: 'purple',
      questions: 45
    },
    {
      id: 'languages',
      title: 'Linguagens e Redação',
      description: 'Português, Literatura, Inglês e Redação',
      icon: BookOpen,
      available: false,
      color: 'orange',
      questions: 45
    }
  ];

  // Se há trilhas personalizadas e o usuário quer vê-las
  if (showPersonalizedPaths && hasPersonalizedPaths) {
    return (
      <PersonalizedLearningPaths onStartTraining={onStartTraining} />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Suas Trilhas de Estudo</h2>
        <p className="text-lg text-gray-600">
          Escolha a área que deseja estudar e comece sua jornada personalizada
        </p>
        
        {/* Botão para trilhas personalizadas */}
        {hasPersonalizedPaths && (
          <div className="mt-6">
            <Button
              onClick={() => setShowPersonalizedPaths(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
            >
              <Target className="w-5 h-5 mr-2" />
              Ver Trilhas Personalizadas
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          const isLocked = !subject.available;
          
          return (
            <Card 
              key={subject.id} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                isLocked 
                  ? 'opacity-60 bg-gray-50 border-gray-200' 
                  : 'border-blue-200 hover:border-blue-300 bg-white'
              }`}
            >
              {isLocked && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <Lock className="w-4 h-4 text-gray-500" />
                    <Badge variant="secondary" className="text-gray-600 bg-gray-200">
                      Em breve
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isLocked 
                      ? 'bg-gray-100' 
                      : `bg-${subject.color}-100`
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isLocked 
                        ? 'text-gray-400' 
                        : `text-${subject.color}-600`
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className={`text-xl ${
                      isLocked ? 'text-gray-500' : 'text-blue-900'
                    }`}>
                      {subject.title}
                    </CardTitle>
                    <p className={`text-sm ${
                      isLocked ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {subject.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-sm font-medium ${
                    isLocked ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {subject.questions} questões disponíveis
                  </span>
                  {subject.id === 'math' && hasCompletedDiagnostic && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Diagnóstico concluído
                    </Badge>
                  )}
                </div>
                
                {subject.id === 'math' && !isLocked && (
                  <Button 
                    onClick={hasCompletedDiagnostic 
                      ? (hasActiveTrainingSession && onContinueTraining ? onContinueTraining : onStartTraining)
                      : onStartDiagnostic
                    }
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {hasCompletedDiagnostic 
                      ? (hasActiveTrainingSession ? 'Continuar Treinamento' : 'Iniciar Treinamento')
                      : 'Iniciar Diagnóstico'
                    }
                  </Button>
                )}
                
                {isLocked && (
                  <Button 
                    disabled 
                    className="w-full bg-gray-200 text-gray-500 cursor-not-allowed"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Disponível em breve
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {!hasCompletedDiagnostic && (
        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Primeiro acesso? Comece com o diagnóstico!
            </h3>
            <p className="text-blue-700 mb-4">
              O diagnóstico inicial ajuda nossa IA a entender seu nível e personalizar as questões para você.
            </p>
            <Button 
              onClick={onStartDiagnostic}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Fazer Diagnóstico de Matemática
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectTrails;
