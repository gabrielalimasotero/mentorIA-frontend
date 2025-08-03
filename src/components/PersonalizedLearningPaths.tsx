import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp, 
  Star, 
  Zap, 
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';

interface LearningPath {
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  estimatedWeeks: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
  weeklyHours: number;
}

interface PersonalizedLearningPathsProps {
  onStartTraining: () => void;
}

const PersonalizedLearningPaths = ({ onStartTraining }: PersonalizedLearningPathsProps) => {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    // Carregar trilhas de aprendizado salvas
    const savedPaths = localStorage.getItem('learning_paths');
    if (savedPaths) {
      setLearningPaths(JSON.parse(savedPaths));
    }
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-red-600 bg-red-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'álgebra':
        return '🔢';
      case 'geometria':
        return '📐';
      case 'funções':
        return '📈';
      case 'estatística':
        return '📊';
      default:
        return '📚';
    }
  };

  const handleStartPath = (subject: string) => {
    setSelectedPath(subject);
    // Salvar o caminho selecionado para o treinamento
    localStorage.setItem('selected_learning_path', subject);
    onStartTraining();
  };

  if (learningPaths.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-800 mb-2">
              Nenhuma trilha personalizada encontrada
            </CardTitle>
            <p className="text-gray-600">
              Complete o diagnóstico inicial para receber suas trilhas personalizadas
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">
          🎯 Suas Trilhas Personalizadas
        </h2>
        <p className="text-lg text-gray-600">
          Baseadas no seu diagnóstico, criamos caminhos de estudo adaptados ao seu nível
        </p>
      </div>

      {/* Resumo geral */}
      <Card className="shadow-lg mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            Resumo do Seu Plano de Estudos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{learningPaths.length}</div>
              <div className="text-sm text-gray-600">Trilhas Criadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {learningPaths.reduce((sum, path) => sum + path.estimatedWeeks, 0)}
              </div>
              <div className="text-sm text-gray-600">Semanas Estimadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {learningPaths.filter(p => p.priority === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Prioridades Altas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {learningPaths.reduce((sum, path) => sum + path.weeklyHours, 0)}h
              </div>
              <div className="text-sm text-gray-600">Horas/Semana</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trilhas de aprendizado */}
      <div className="space-y-6">
        {learningPaths.map((path, index) => (
          <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{getSubjectIcon(path.subject)}</div>
                  <div>
                    <CardTitle className="text-xl text-gray-800">{path.subject}</CardTitle>
                    <p className="text-gray-600 mt-1">{path.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getLevelColor(path.level)}`}>
                    {path.level}
                  </Badge>
                  <Badge className={`${getPriorityColor(path.priority)}`}>
                    Prioridade {path.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações da trilha */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">
                        {path.estimatedWeeks} semana{path.estimatedWeeks > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-600">
                        {path.weeklyHours}h/semana
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-gray-600">
                        {path.focusAreas.length} área{path.focusAreas.length > 1 ? 's' : ''} de foco
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-gray-600">
                        {path.estimatedWeeks * path.weeklyHours}h total
                      </span>
                    </div>
                  </div>

                  {/* Áreas de foco */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Áreas de Foco:</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.focusAreas.map((area, areaIndex) => (
                        <Badge key={areaIndex} variant="outline" className="text-blue-700 border-blue-300">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progresso e ação */}
                <div className="flex flex-col justify-between">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progresso Geral</span>
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Conceitos básicos</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span>Prática intensiva</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-blue-500" />
                        <span>Aplicações avançadas</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleStartPath(path.subject)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Iniciar Trilha
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dicas de estudo */}
      <Card className="shadow-lg mt-8 bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <TrendingUp className="w-5 h-5" />
            Dicas para Maximizar seu Aprendizado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Estude Regularmente</h4>
              <p className="text-sm text-gray-600">
                Dedique as horas recomendadas por semana para manter o ritmo
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Foque nas Prioridades</h4>
              <p className="text-sm text-gray-600">
                Comece pelas trilhas de prioridade alta para melhor resultado
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Pratique Muito</h4>
              <p className="text-sm text-gray-600">
                A prática é essencial para consolidar o conhecimento
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedLearningPaths; 