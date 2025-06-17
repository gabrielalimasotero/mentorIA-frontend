
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Target, BookOpen } from 'lucide-react';
import { useState } from 'react';
import ResultsReview from './ResultsReview';

interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface DiagnosticResultsProps {
  answers: (number | null)[];
  questions: Question[];
  onComplete: () => void;
}

const DiagnosticResults = ({ answers, questions, onComplete }: DiagnosticResultsProps) => {
  const [showReview, setShowReview] = useState(false);
  
  // Calcular performance por tópico
  const topicPerformance = questions.reduce((acc, question, index) => {
    const topic = question.topic;
    const isCorrect = answers[index] === question.correctAnswer;
    
    if (!acc[topic]) {
      acc[topic] = { correct: 0, total: 0 };
    }
    
    acc[topic].total++;
    if (isCorrect) {
      acc[topic].correct++;
    }
    
    return acc;
  }, {} as Record<string, { correct: number; total: number }>);

  const overallCorrect = answers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const overallPercentage = Math.round((overallCorrect / questions.length) * 100);

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

  const handleReviewComplete = () => {
    setShowReview(false);
    onComplete();
  };

  const handleCompleteWithGoal = () => {
    // Definir meta inicial como 1 após o diagnóstico
    const currentGoals = parseInt(localStorage.getItem('user_goals') || '0');
    localStorage.setItem('user_goals', (currentGoals + 1).toString());
    onComplete();
  };

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
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg mb-6">
        <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full flex items-center justify-center">
            <Target className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-blue-900 mb-2">
            Diagnóstico Concluído!
          </CardTitle>
          <p className="text-blue-700">
            Analisamos seu desempenho para personalizar seus próximos estudos
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold text-blue-900 mb-2">
              {overallCorrect}/{questions.length}
            </div>
            <div className="text-lg text-gray-600 mb-4">
              {overallPercentage}% de aproveitamento geral
            </div>
            <Badge className={`px-4 py-2 text-sm ${getPerformanceColor(overallPercentage)}`}>
              {getPerformanceLabel(overallPercentage)}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <TrendingUp className="w-5 h-5" />
            Desempenho por Tópico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(topicPerformance).map(([topic, performance]) => {
              const percentage = Math.round((performance.correct / performance.total) * 100);
              
              return (
                <div key={topic} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{topic}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {performance.correct}/{performance.total}
                      </span>
                      <Badge className={`text-xs ${getPerformanceColor(percentage)}`}>
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    {performance.total} questão{performance.total > 1 ? 'ões' : ''} avaliada{performance.total > 1 ? 's' : ''}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button 
          onClick={() => setShowReview(true)}
          variant="outline"
          className="bg-white hover:bg-gray-50 text-blue-600 border-blue-200 px-6 py-3 text-lg font-semibold"
        >
          Ver Gabarito
        </Button>
        
        <Button 
          onClick={handleCompleteWithGoal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg font-semibold"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Iniciar Treinamento
        </Button>
      </div>

      <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-blue-900 mb-2">
              Agora vamos personalizar seu treinamento!
            </h3>
            <p className="text-blue-700">
              Com base no seu diagnóstico, nossa IA já sabe como adaptar as questões ao seu nível. 
              Pronto para começar o treinamento intensivo?
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticResults;
