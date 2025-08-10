
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, SkipForward, ChevronRight } from 'lucide-react';
import DiagnosticResults from './DiagnosticResults';
import { StatisticsService } from '@/lib/statistics';

interface DiagnosticTestProps {
  onComplete: () => void;
}

interface Question {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

const DiagnosticTest = ({ onComplete }: DiagnosticTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Simulando questões do diagnóstico
  const questions: Question[] = [
    {
      id: 1,
      topic: "Álgebra",
      question: "Qual é o valor de x na equação 2x + 5 = 13?",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: 1
    },
    {
      id: 2,
      topic: "Geometria",
      question: "A área de um triângulo retângulo com base 6 cm e altura 8 cm é:",
      options: ["24 cm²", "48 cm²", "14 cm²", "28 cm²"],
      correctAnswer: 0
    },
    {
      id: 3,
      topic: "Álgebra",
      question: "Simplificando a expressão (x + 2)² - x², obtemos:",
      options: ["4x + 4", "4x", "2x + 4", "x² + 4"],
      correctAnswer: 0
    },
    {
      id: 4,
      topic: "Estatística",
      question: "A média aritmética dos números 5, 7, 9, 11 é:",
      options: ["7", "8", "9", "10"],
      correctAnswer: 1
    },
    {
      id: 5,
      topic: "Geometria",
      question: "Em um círculo de raio 3 cm, a circunferência mede aproximadamente:",
      options: ["6π cm", "9π cm", "18π cm", "3π cm"],
      correctAnswer: 0
    },
    {
      id: 6,
      topic: "Função",
      question: "Se f(x) = 2x + 1, então f(3) é igual a:",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2
    },
    {
      id: 7,
      topic: "Estatística",
      question: "Em um grupo de 20 pessoas, 12 gostam de futebol. A porcentagem é:",
      options: ["50%", "60%", "70%", "80%"],
      correctAnswer: 1
    },
    {
      id: 8,
      topic: "Geometria",
      question: "O volume de um cubo com aresta de 4 cm é:",
      options: ["16 cm³", "48 cm³", "64 cm³", "32 cm³"],
      correctAnswer: 2
    },
    {
      id: 9,
      topic: "Função",
      question: "O gráfico da função f(x) = x² é uma:",
      options: ["Reta", "Parábola", "Hipérbole", "Circunferência"],
      correctAnswer: 1
    },
    {
      id: 10,
      topic: "Álgebra",
      question: "A solução da inequação 3x - 6 > 0 é:",
      options: ["x > 2", "x < 2", "x > 3", "x < 3"],
      correctAnswer: 0
    }
  ];

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  // Função para registrar resposta no backend
  const recordAnswer = async (question: Question, isCorrect: boolean) => {
    try {
      await StatisticsService.recordAnswer({
        questionId: question.id.toString(),
        subtopicName: question.topic, // Usando topic como subtopic para diagnóstico
        topicName: question.topic,
        isCorrect
      });
    } catch (error) {
      console.error('Erro ao registrar resposta do diagnóstico:', error);
      // Não interromper o fluxo se falhar
    }
  };

  const handleConfirm = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    // Registrar resposta no backend se uma resposta foi selecionada
    if (selectedAnswer !== null) {
      const currentQ = questions[currentQuestion];
      const isCorrect = selectedAnswer === currentQ.correctAnswer;

      // Registrar estatística no backend
      recordAnswer(currentQ, isCorrect);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Salvar progresso do diagnóstico
      const diagnosticData = {
        answers: newAnswers,
        questions: questions,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('diagnostic_progress', JSON.stringify(diagnosticData));
      setShowResults(true);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      const diagnosticData = {
        answers: newAnswers,
        questions: questions,
        completedAt: new Date().toISOString()
      };
      localStorage.setItem('diagnostic_progress', JSON.stringify(diagnosticData));
      setShowResults(true);
    }
  };

  if (showResults) {
    return <DiagnosticResults answers={answers} questions={questions} onComplete={onComplete} />;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blue-900">Diagnóstico Inicial - Matemática</h2>
          <span className="text-sm text-gray-600">
            Questão {currentQuestion + 1} de {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-blue-900">
            {questions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                    }`}>
                    {selectedAnswer === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Pular
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Confirmar'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticTest;
