
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, X, Target } from 'lucide-react';

interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ResultsReviewProps {
  answers: (number | null)[];
  questions: Question[];
  onComplete: () => void;
  title: string;
  type: 'diagnostic' | 'training';
}

const ResultsReview = ({ answers, questions, onComplete, title, type }: ResultsReviewProps) => {
  
  const correctCount = answers.filter((answer, index) => 
    answer === questions[index].correctAnswer
  ).length;
  
  const percentage = Math.round((correctCount / questions.length) * 100);

  const getAnswerStatus = (questionIndex: number) => {
    const userAnswer = answers[questionIndex];
    const correctAnswer = questions[questionIndex].correctAnswer;
    
    if (userAnswer === null) return 'skipped';
    if (userAnswer === correctAnswer) return 'correct';
    return 'incorrect';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'correct': return 'text-green-600 bg-green-100';
      case 'incorrect': return 'text-red-600 bg-red-100';
      case 'skipped': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'correct': return <CheckCircle className="w-4 h-4" />;
      case 'incorrect': return <X className="w-4 h-4" />;
      case 'skipped': return <div className="w-4 h-4 rounded-full border-2 border-gray-400" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'correct': return 'Correto';
      case 'incorrect': return 'Incorreto';
      case 'skipped': return 'Pulado';
      default: return '';
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg mb-6">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-700 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-blue-900 mb-2">
              {title}
            </CardTitle>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-900 mb-2">
                {correctCount}/{questions.length}
              </div>
              <div className="text-lg text-gray-600">
                {percentage}% de aproveitamento
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-blue-900">Revisão das Respostas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const status = getAnswerStatus(index);
                const userAnswer = answers[index];
                
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-gray-800">
                            Questão {index + 1}
                          </span>
                          <Badge className={`text-xs ${getStatusColor(status)}`}>
                            {getStatusIcon(status)}
                            <span className="ml-1">{getStatusText(status)}</span>
                          </Badge>
                          {type === 'training' && (
                            <Badge variant="outline" className="text-blue-700 border-blue-200 text-xs">
                              {question.topic}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{question.question}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = optionIndex === question.correctAnswer;
                        const isUserAnswer = optionIndex === userAnswer;
                        
                        let bgColor = 'bg-gray-50';
                        let borderColor = 'border-gray-200';
                        let textColor = 'text-gray-700';
                        
                        if (isCorrect) {
                          bgColor = 'bg-green-50';
                          borderColor = 'border-green-300';
                          textColor = 'text-green-800';
                        } else if (isUserAnswer && !isCorrect) {
                          bgColor = 'bg-red-50';
                          borderColor = 'border-red-300';
                          textColor = 'text-red-800';
                        }
                        
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 ${bgColor} ${borderColor} ${textColor}`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {String.fromCharCode(65 + optionIndex)}
                              </span>
                              <span className="flex-1">{option}</span>
                              {isCorrect && <CheckCircle className="w-4 h-4 text-green-600" />}
                              {isUserAnswer && !isCorrect && <X className="w-4 h-4 text-red-600" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-3 text-sm text-gray-600">
                      {userAnswer !== null ? (
                        <span>
                          Sua resposta: <strong>{String.fromCharCode(65 + userAnswer)}</strong> | 
                          Resposta correta: <strong>{String.fromCharCode(65 + question.correctAnswer)}</strong>
                        </span>
                      ) : (
                        <span>
                          Questão pulada | 
                          Resposta correta: <strong>{String.fromCharCode(65 + question.correctAnswer)}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button 
            onClick={onComplete}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg font-semibold"
          >
            {type === 'diagnostic' ? 'Ir para Treinamento' : 'Continuar'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ResultsReview;
