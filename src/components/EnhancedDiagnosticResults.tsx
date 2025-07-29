import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Target, 
  BookOpen, 
  Clock, 
  Award, 
  Brain, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Star,
  Calendar,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import ResultsReview from './ResultsReview';

interface Question {
  id: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  competency: string;
}

interface DiagnosticResultsProps {
  answers: (number | null)[];
  questions: Question[];
  onComplete: () => void;
}

interface CompetencyAnalysis {
  competency: string;
  topic: string;
  correct: number;
  total: number;
  percentage: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  priority: 'high' | 'medium' | 'low';
  estimatedWeeks: number;
}

interface LearningPath {
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  estimatedWeeks: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
  weeklyHours: number;
}

const EnhancedDiagnosticResults = ({ answers, questions, onComplete }: DiagnosticResultsProps) => {
  const [showReview, setShowReview] = useState(false);
  
  // Análise detalhada por competência
  const competencyAnalysis = questions.reduce((acc, question, index) => {
    const competency = question.competency;
    const isCorrect = answers[index] === question.correctAnswer;
    
    if (!acc[competency]) {
      acc[competency] = {
        competency,
        topic: question.topic,
        correct: 0,
        total: 0,
        percentage: 0,
        level: 'beginner' as const,
        priority: 'medium' as const,
        estimatedWeeks: 0
      };
    }
    
    acc[competency].total++;
    if (isCorrect) {
      acc[competency].correct++;
    }
    
    return acc;
  }, {} as Record<string, CompetencyAnalysis>);

  // Calcular percentuais e determinar níveis
  Object.values(competencyAnalysis).forEach(comp => {
    comp.percentage = Math.round((comp.correct / comp.total) * 100);
    
    // Determinar nível baseado na performance
    if (comp.percentage >= 80) {
      comp.level = 'advanced';
      comp.priority = 'low';
      comp.estimatedWeeks = 1;
    } else if (comp.percentage >= 60) {
      comp.level = 'intermediate';
      comp.priority = 'medium';
      comp.estimatedWeeks = 2;
    } else {
      comp.level = 'beginner';
      comp.priority = 'high';
      comp.estimatedWeeks = 3;
    }
  });

  // Análise por tópico
  const topicAnalysis = questions.reduce((acc, question, index) => {
    const topic = question.topic;
    const isCorrect = answers[index] === question.correctAnswer;
    
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0, difficulties: [] as string[] };
    }
    
    acc[topic].total++;
    if (isCorrect) {
      acc[topic].correct++;
    } else {
      acc[topic].difficulties.push(question.competency);
    }
    
    return acc;
  }, {} as Record<string, { correct: number; total: number; difficulties: string[] }>);

  const overallCorrect = answers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const overallPercentage = Math.round((overallCorrect / questions.length) * 100);

  // Gerar trilhas de aprendizado personalizadas
  const generateLearningPaths = (): LearningPath[] => {
    const paths: LearningPath[] = [];
    
    Object.entries(topicAnalysis).forEach(([topic, analysis]) => {
      const percentage = Math.round((analysis.correct / analysis.total) * 100);
      const competencies = competencyAnalysis;
      
      let level: 'beginner' | 'intermediate' | 'advanced';
      let priority: 'high' | 'medium' | 'low';
      let estimatedWeeks: number;
      let weeklyHours: number;
      
      if (percentage >= 80) {
        level = 'advanced';
        priority = 'low';
        estimatedWeeks = 1;
        weeklyHours = 2;
      } else if (percentage >= 60) {
        level = 'intermediate';
        priority = 'medium';
        estimatedWeeks = 2;
        weeklyHours = 3;
      } else {
        level = 'beginner';
        priority = 'high';
        estimatedWeeks = 3;
        weeklyHours = 4;
      }
      
      const focusAreas = analysis.difficulties.length > 0 
        ? analysis.difficulties.slice(0, 3) 
        : ['Revisão geral'];
      
      paths.push({
        subject: topic,
        level,
        focusAreas,
        estimatedWeeks,
        description: getPathDescription(topic, level, percentage),
        priority,
        weeklyHours
      });
    });
    
    return paths.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const getPathDescription = (topic: string, level: string, percentage: number): string => {
    if (percentage >= 80) {
      return `Excelente domínio em ${topic}. Foque em tópicos avançados e aplicações práticas.`;
    } else if (percentage >= 60) {
      return `Bom conhecimento em ${topic}. Reforce conceitos fundamentais e pratique mais.`;
    } else {
      return `${topic} precisa de atenção especial. Comece pelos fundamentos básicos.`;
    }
  };

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excelente';
    if (percentage >= 60) return 'Bom';
    if (percentage >= 40) return 'Regular';
    return 'Precisa melhorar';
  };

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

  const handleReviewComplete = () => {
    setShowReview(false);
    onComplete();
  };

  const handleCompleteWithGoal = () => {
    // Salvar trilhas de aprendizado personalizadas
    const learningPaths = generateLearningPaths();
    localStorage.setItem('learning_paths', JSON.stringify(learningPaths));
    localStorage.setItem('user_goals', '1');
    onComplete();
  };

  const learningPaths = generateLearningPaths();

  if (showReview) {
    return (
      <ResultsReview 
        answers={answers}
        questions={questions}
        onComplete={handleReviewComplete}
        title="Diagnóstico Revisado"
        type="diagnostic"
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header com resultado geral */}
      <Card className="shadow-lg mb-6">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="w-20 h-20 mx-auto mb-4 bg-blue-700 rounded-full flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl text-blue-800 mb-2">
            Diagnóstico Concluído!
          </CardTitle>
          <p className="text-blue-600 text-lg">
            Analisamos seu desempenho e criamos trilhas personalizadas
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-800 mb-2">
              {overallCorrect}/{questions.length}
            </div>
            <div className="text-xl text-gray-600 mb-4">
              {overallPercentage}% de aproveitamento geral
            </div>
            <Badge className={`px-6 py-3 text-lg ${getPerformanceColor(overallPercentage)}`}>
              {getPerformanceLabel(overallPercentage)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Análise por competência */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Target className="w-5 h-5" />
            Análise por Competência
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.values(competencyAnalysis).map((comp, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800">{comp.competency}</h3>
                    <p className="text-sm text-gray-500">{comp.topic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getLevelColor(comp.level)}`}>
                      {comp.level}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(comp.priority)}`}>
                      {comp.priority}
                    </Badge>
                    <span className="text-sm font-medium text-blue-600">{comp.percentage}%</span>
                  </div>
                </div>
                <Progress value={comp.percentage} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{comp.correct}/{comp.total} questões corretas</span>
                  <span>Estimativa: {comp.estimatedWeeks} semana{comp.estimatedWeeks > 1 ? 's' : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trilhas de aprendizado personalizadas */}
      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BookOpen className="w-5 h-5" />
            Trilhas de Aprendizado Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {learningPaths.map((path, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{path.subject}</h3>
                      <Badge className={`${getLevelColor(path.level)}`}>
                        {path.level}
                      </Badge>
                      <Badge className={`${getPriorityColor(path.priority)}`}>
                        Prioridade {path.priority}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{path.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">Áreas de Foco:</h4>
                  <div className="flex flex-wrap gap-2">
                    {path.focusAreas.map((area, areaIndex) => (
                      <Badge key={areaIndex} variant="outline" className="text-blue-700 border-blue-300">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações gerais */}
      <Card className="shadow-lg mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Award className="w-5 h-5" />
            Recomendações para Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-800">Pontos Fortes:</h4>
              <ul className="space-y-2 text-sm text-green-700">
                {Object.values(competencyAnalysis)
                  .filter(comp => comp.percentage >= 80)
                  .map((comp, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {comp.competency} ({comp.percentage}%)
                    </li>
                  ))}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-800">Áreas de Melhoria:</h4>
              <ul className="space-y-2 text-sm text-orange-700">
                {Object.values(competencyAnalysis)
                  .filter(comp => comp.percentage < 60)
                  .map((comp, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {comp.competency} ({comp.percentage}%)
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button 
          onClick={() => setShowReview(true)}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-blue-700 border-blue-200 px-6 py-3 text-lg font-semibold"
        >
          Ver Gabarito Detalhado
        </Button>
        
        <Button 
          onClick={handleCompleteWithGoal}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 text-lg font-semibold"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Iniciar Trilha Personalizada
        </Button>
      </div>

      {/* Call to action */}
      <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-800 mb-2">
              🚀 Pronto para acelerar seu aprendizado?
            </h3>
            <p className="text-blue-600">
              Suas trilhas personalizadas estão prontas! Com base no seu diagnóstico, 
              criamos um plano de estudos que se adapta ao seu ritmo e foca nas áreas 
              que mais precisam de atenção.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDiagnosticResults; 