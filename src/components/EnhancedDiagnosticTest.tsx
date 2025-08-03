import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, SkipForward, ChevronRight, Brain, Target, BookOpen, TrendingUp } from 'lucide-react';
import EnhancedDiagnosticResults from './EnhancedDiagnosticResults';

interface DiagnosticTestProps {
  onComplete: () => void;
}

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

interface LearningPath {
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  estimatedWeeks: number;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const EnhancedDiagnosticTest = ({ onComplete }: DiagnosticTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testPhase, setTestPhase] = useState<'intro' | 'test' | 'results'>('intro');

  // Enhanced diagnostic questions with difficulty levels and competencies
  const questions: Question[] = [
    // Álgebra - Básico
    {
      id: 1,
      topic: "Álgebra",
      difficulty: "easy",
      competency: "Equações de 1º grau",
      question: "Qual é o valor de x na equação 2x + 5 = 13?",
      options: ["x = 3", "x = 4", "x = 5", "x = 6"],
      correctAnswer: 1,
      explanation: "2x + 5 = 13 → 2x = 13 - 5 → 2x = 8 → x = 4"
    },
    {
      id: 2,
      topic: "Álgebra",
      difficulty: "medium",
      competency: "Produtos notáveis",
      question: "Simplificando a expressão (x + 2)² - x², obtemos:",
      options: ["4x + 4", "4x", "2x + 4", "x² + 4"],
      correctAnswer: 0,
      explanation: "(x + 2)² - x² = x² + 4x + 4 - x² = 4x + 4"
    },
    {
      id: 3,
      topic: "Álgebra",
      difficulty: "hard",
      competency: "Inequações",
      question: "A solução da inequação 3x - 6 > 0 é:",
      options: ["x > 2", "x < 2", "x > 3", "x < 3"],
      correctAnswer: 0,
      explanation: "3x - 6 > 0 → 3x > 6 → x > 2"
    },
    
    // Geometria - Básico
    {
      id: 4,
      topic: "Geometria",
      difficulty: "easy",
      competency: "Áreas de figuras planas",
      question: "A área de um triângulo retângulo com base 6 cm e altura 8 cm é:",
      options: ["24 cm²", "48 cm²", "14 cm²", "28 cm²"],
      correctAnswer: 0,
      explanation: "Área = (base × altura) ÷ 2 = (6 × 8) ÷ 2 = 24 cm²"
    },
    {
      id: 5,
      topic: "Geometria",
      difficulty: "medium",
      competency: "Circunferência e círculo",
      question: "Em um círculo de raio 3 cm, a circunferência mede aproximadamente:",
      options: ["6π cm", "9π cm", "18π cm", "3π cm"],
      correctAnswer: 0,
      explanation: "C = 2πr = 2π × 3 = 6π cm"
    },
    {
      id: 6,
      topic: "Geometria",
      difficulty: "hard",
      competency: "Volumes",
      question: "O volume de um cubo com aresta de 4 cm é:",
      options: ["16 cm³", "48 cm³", "64 cm³", "32 cm³"],
      correctAnswer: 2,
      explanation: "V = a³ = 4³ = 64 cm³"
    },
    
    // Funções - Básico
    {
      id: 7,
      topic: "Funções",
      difficulty: "easy",
      competency: "Função afim",
      question: "Se f(x) = 2x + 1, então f(3) é igual a:",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      explanation: "f(3) = 2(3) + 1 = 6 + 1 = 7"
    },
    {
      id: 8,
      topic: "Funções",
      difficulty: "medium",
      competency: "Função quadrática",
      question: "O gráfico da função f(x) = x² é uma:",
      options: ["Reta", "Parábola", "Hipérbole", "Circunferência"],
      correctAnswer: 1,
      explanation: "Funções do tipo f(x) = ax² + bx + c têm gráfico parabólico"
    },
    
    // Estatística - Básico
    {
      id: 9,
      topic: "Estatística",
      difficulty: "easy",
      competency: "Média aritmética",
      question: "A média aritmética dos números 5, 7, 9, 11 é:",
      options: ["7", "8", "9", "10"],
      correctAnswer: 1,
      explanation: "Média = (5 + 7 + 9 + 11) ÷ 4 = 32 ÷ 4 = 8"
    },
    {
      id: 10,
      topic: "Estatística",
      difficulty: "medium",
      competency: "Porcentagem",
      question: "Em um grupo de 20 pessoas, 12 gostam de futebol. A porcentagem é:",
      options: ["50%", "60%", "70%", "80%"],
      correctAnswer: 1,
      explanation: "Porcentagem = (12 ÷ 20) × 100 = 0,6 × 100 = 60%"
    }
  ];

  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleConfirm = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Salvar progresso do diagnóstico
      const diagnosticData = {
        answers: newAnswers,
        questions: questions,
        completedAt: new Date().toISOString(),
        version: 'enhanced'
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
        completedAt: new Date().toISOString(),
        version: 'enhanced'
      };
      localStorage.setItem('diagnostic_progress', JSON.stringify(diagnosticData));
      setShowResults(true);
    }
  };

  const startTest = () => {
    setTestPhase('test');
  };

  if (testPhase === 'intro') {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-blue-700 rounded-full flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-blue-800 mb-2">
              Diagnóstico Inteligente
            </CardTitle>
            <p className="text-blue-600 text-lg">
              Vamos descobrir seu nível atual para criar uma trilha personalizada
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Avaliação Completa</h3>
                <p className="text-sm text-gray-600">
                  10 questões que avaliam diferentes competências e níveis de dificuldade
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Análise Detalhada</h3>
                <p className="text-sm text-gray-600">
                  Identificamos seus pontos fortes e áreas que precisam de atenção
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Trilha Personalizada</h3>
                <p className="text-sm text-gray-600">
                  Criamos um plano de estudos adaptado ao seu perfil de aprendizado
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">O que você vai encontrar:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Questões de Álgebra, Geometria, Funções e Estatística</li>
                <li>• Diferentes níveis de dificuldade (fácil, médio, difícil)</li>
                <li>• Análise por competência específica</li>
                <li>• Recomendações personalizadas de estudo</li>
                <li>• Estimativa de tempo para dominar cada área</li>
              </ul>
            </div>

            <div className="text-center">
              <Button
                onClick={startTest}
                className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 text-lg font-semibold"
              >
                <Brain className="w-5 h-5 mr-2" />
                Começar Diagnóstico
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <EnhancedDiagnosticResults 
        answers={answers} 
        questions={questions} 
        onComplete={onComplete} 
      />
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return 'N/A';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blue-900">Diagnóstico Inteligente</h2>
          <div className="flex items-center gap-3">
            <Badge className={`px-3 py-1 ${getDifficultyColor(currentQ.difficulty)}`}>
              {getDifficultyLabel(currentQ.difficulty)}
            </Badge>
            <span className="text-sm text-gray-600">
              Questão {currentQuestion + 1} de {questions.length}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-blue-700 border-blue-300">
              {currentQ.topic}
            </Badge>
            <span className="text-sm text-gray-500">{currentQ.competency}</span>
          </div>
          <CardTitle className="text-lg text-blue-900">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === index
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

export default EnhancedDiagnosticTest; 