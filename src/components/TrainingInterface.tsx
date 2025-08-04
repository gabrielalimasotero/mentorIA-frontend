
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  CheckCircle,
  SkipForward,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Calendar,
  BookOpen,
  Play,
  Pause
} from 'lucide-react';
import DailyGoalComplete from './DailyGoalComplete';
import ResultsReview from './ResultsReview';
import { StatisticsService } from '@/lib/statistics';

interface TrainingQuestion {
  id: number;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subtopic?: string; // Adicionando subtópico para estatísticas
}

const TrainingInterface = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showDailyComplete, setShowDailyComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [goalsMet, setGoalsMet] = useState(0);

  // Carregar progresso salvo
  useEffect(() => {
    const savedProgress = localStorage.getItem('training_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const today = new Date().toDateString();
      if (progress.date === today) {
        setDailyProgress(progress.completed || 0);
        if (progress.currentSession) {
          setIsTraining(true);
          setCurrentQuestion(progress.currentSession.currentQuestion || 0);
          setAnswers(progress.currentSession.answers || new Array(20).fill(null));
          // Restaurar resposta selecionada se existir
          const savedAnswers = progress.currentSession.answers || [];
          setSelectedAnswer(savedAnswers[progress.currentSession.currentQuestion] || null);
        }
      }
    }

    // Carregar metas batidas
    const savedGoals = localStorage.getItem('user_goals');
    if (savedGoals) {
      setGoalsMet(parseInt(savedGoals));
    }
  }, []);

  // Questões do treinamento (simulando questões do ENEM)
  const trainingQuestions: TrainingQuestion[] = [
    {
      id: 1,
      topic: "Funções",
      subtopic: "Função Quadrática",
      difficulty: "Médio",
      question: "Uma bola é lançada verticalmente para cima. Sua altura h (em metros) em função do tempo t (em segundos) é dada por h(t) = -5t² + 20t + 1. Em que momento a bola atinge sua altura máxima?",
      options: ["t = 1s", "t = 2s", "t = 3s", "t = 4s"],
      correctAnswer: 1
    },
    {
      id: 2,
      topic: "Probabilidade e Estatística",
      subtopic: "Probabilidade",
      difficulty: "Fácil",
      question: "Em uma urna há 8 bolas vermelhas e 12 bolas azuis. Qual a probabilidade de sortear uma bola vermelha?",
      options: ["8/20", "12/20", "8/12", "12/8"],
      correctAnswer: 0
    },
    {
      id: 3,
      topic: "Geometria Espacial",
      subtopic: "Volumes",
      difficulty: "Difícil",
      question: "Um cilindro tem raio da base igual a 3 cm e altura 8 cm. Qual é o volume deste cilindro?",
      options: ["24π cm³", "48π cm³", "72π cm³", "96π cm³"],
      correctAnswer: 2
    },
    {
      id: 4,
      topic: "Álgebra",
      subtopic: "Progressão Aritmética (PA)",
      difficulty: "Médio",
      question: "Em uma PA, o primeiro termo é 5 e a razão é 3. Qual é o 10º termo?",
      options: ["30", "32", "35", "38"],
      correctAnswer: 1
    },
    {
      id: 5,
      topic: "Aritmética",
      subtopic: "Porcentagem e Razão",
      difficulty: "Fácil",
      question: "Um produto que custava R$ 80,00 teve um aumento de 15%. Qual é o novo preço?",
      options: ["R$ 85,00", "R$ 88,00", "R$ 92,00", "R$ 95,00"],
      correctAnswer: 2
    },
    {
      id: 6,
      topic: "Geometria Plana",
      subtopic: "Teorema de Pitágoras",
      difficulty: "Médio",
      question: "Em um triângulo retângulo, os catetos medem 6 cm e 8 cm. Qual é a medida da hipotenusa?",
      options: ["10 cm", "12 cm", "14 cm", "16 cm"],
      correctAnswer: 0
    },
    {
      id: 7,
      topic: "Trigonometria",
      subtopic: "Razões Trigonométricas",
      difficulty: "Difícil",
      question: "Qual é o valor de sen(30°)?",
      options: ["0", "1/2", "√2/2", "1"],
      correctAnswer: 1
    },
    {
      id: 8,
      topic: "Álgebra",
      subtopic: "Equações do 2º grau",
      difficulty: "Médio",
      question: "Resolva a equação x² - 5x + 6 = 0",
      options: ["x = 2 e x = 3", "x = -2 e x = -3", "x = 1 e x = 6", "x = -1 e x = -6"],
      correctAnswer: 0
    },
    {
      id: 9,
      topic: "Funções",
      subtopic: "Função Afim (1º grau)",
      difficulty: "Fácil",
      question: "Qual é a função afim que passa pelos pontos (0, 3) e (2, 7)?",
      options: ["f(x) = 2x + 3", "f(x) = 3x + 2", "f(x) = x + 3", "f(x) = 2x + 1"],
      correctAnswer: 0
    },
    {
      id: 10,
      topic: "Probabilidade e Estatística",
      subtopic: "Estatística Descritiva",
      difficulty: "Médio",
      question: "Qual é a média dos números 2, 4, 6, 8, 10?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 1
    }
  ];

  // Função para registrar resposta no backend
  const recordAnswer = async (question: TrainingQuestion, isCorrect: boolean) => {
    try {
      await StatisticsService.recordAnswer({
        questionId: question.id.toString(),
        subtopicName: question.subtopic || question.topic,
        topicName: question.topic,
        isCorrect
      });
    } catch (error) {
      console.error('Erro ao registrar resposta:', error);
      // Não interromper o fluxo se falhar
    }
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers(new Array(20).fill(null));
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handlePause = () => {
    // Salvar progresso atual incluindo a resposta selecionada
    const updatedAnswers = [...answers];
    if (selectedAnswer !== null) {
      updatedAnswers[currentQuestion] = selectedAnswer;
    }

    const sessionProgress = {
      date: new Date().toDateString(),
      currentSession: {
        currentQuestion: currentQuestion,
        answers: updatedAnswers
      },
      completed: dailyProgress
    };
    localStorage.setItem('training_progress', JSON.stringify(sessionProgress));

    // Voltar para a tela principal
    setIsTraining(false);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      // Salvar resposta atual antes de voltar
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestion] = selectedAnswer;
      setAnswers(updatedAnswers);

      // Voltar uma questão
      const previousQuestion = currentQuestion - 1;
      setCurrentQuestion(previousQuestion);
      setSelectedAnswer(updatedAnswers[previousQuestion]);

      // Salvar progresso
      const sessionProgress = {
        date: new Date().toDateString(),
        currentSession: {
          currentQuestion: previousQuestion,
          answers: updatedAnswers
        },
        completed: dailyProgress
      };
      localStorage.setItem('training_progress', JSON.stringify(sessionProgress));
    }
  };

  const handleConfirm = async () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    // Registrar resposta no backend se uma resposta foi selecionada
    if (selectedAnswer !== null) {
      const currentQ = trainingQuestions[currentQuestion];
      const isCorrect = selectedAnswer === currentQ.correctAnswer;

      // Registrar estatística no backend
      await recordAnswer(currentQ, isCorrect);
    }

    // Salvar progresso da sessão
    const sessionProgress = {
      date: new Date().toDateString(),
      currentSession: {
        currentQuestion: currentQuestion + 1,
        answers: newAnswers
      },
      completed: dailyProgress
    };
    localStorage.setItem('training_progress', JSON.stringify(sessionProgress));

    if (currentQuestion < 19) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1]);
    } else {
      // Completou as 20 questões
      const newDailyProgress = dailyProgress + 20;
      setDailyProgress(newDailyProgress);

      // Incrementar metas batidas
      const newGoalsMet = goalsMet + 1;
      setGoalsMet(newGoalsMet);
      localStorage.setItem('user_goals', newGoalsMet.toString());

      // Salvar histórico de respostas para revisão
      const sessionData = {
        answers: newAnswers,
        questions: trainingQuestions,
        completedAt: new Date().toISOString(),
        type: 'training'
      };

      const trainingHistory = localStorage.getItem('training_history');
      const history = trainingHistory ? JSON.parse(trainingHistory) : [];
      history.push(sessionData);
      localStorage.setItem('training_history', JSON.stringify(history));

      const finalProgress = {
        date: new Date().toDateString(),
        completed: newDailyProgress,
        currentSession: null
      };
      localStorage.setItem('training_progress', JSON.stringify(finalProgress));

      setShowResults(true);
    }
  };

  const handleSkip = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);

    const sessionProgress = {
      date: new Date().toDateString(),
      currentSession: {
        currentQuestion: currentQuestion + 1,
        answers: newAnswers
      },
      completed: dailyProgress
    };
    localStorage.setItem('training_progress', JSON.stringify(sessionProgress));

    if (currentQuestion < 19) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(newAnswers[nextQuestion]);
    } else {
      const newDailyProgress = dailyProgress + 20;
      setDailyProgress(newDailyProgress);

      // Incrementar metas batidas
      const newGoalsMet = goalsMet + 1;
      setGoalsMet(newGoalsMet);
      localStorage.setItem('user_goals', newGoalsMet.toString());

      const sessionData = {
        answers: newAnswers,
        questions: trainingQuestions,
        completedAt: new Date().toISOString(),
        type: 'training'
      };

      const trainingHistory = localStorage.getItem('training_history');
      const history = trainingHistory ? JSON.parse(trainingHistory) : [];
      history.push(sessionData);
      localStorage.setItem('training_history', JSON.stringify(history));

      const finalProgress = {
        date: new Date().toDateString(),
        completed: newDailyProgress,
        currentSession: null
      };
      localStorage.setItem('training_progress', JSON.stringify(finalProgress));

      setShowResults(true);
    }
  };

  const handleResultsComplete = () => {
    setShowResults(false);
    setShowDailyComplete(true);
  };

  const handleContinueTraining = () => {
    setShowDailyComplete(false);
    setIsTraining(false);
  };

  const handleFinishDay = () => {
    setShowDailyComplete(false);
    setIsTraining(false);
  };

  if (showResults) {
    return (
      <ResultsReview
        answers={answers}
        questions={trainingQuestions}
        onComplete={handleResultsComplete}
        title="Simulado Concluído!"
        type="training"
      />
    );
  }

  if (showDailyComplete) {
    return (
      <DailyGoalComplete
        onContinue={handleContinueTraining}
        onFinish={handleFinishDay}
      />
    );
  }

  if (!isTraining) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg mb-6">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-blue-900 mb-2">
                  Treinamento Matemática
                </CardTitle>
                <p className="text-blue-700">
                  Simulados personalizados baseados no seu diagnóstico
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Meta Diária</span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {dailyProgress}/20
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Progresso diário</span>
                <span className="text-sm text-gray-600">{Math.round((dailyProgress / 20) * 100)}%</span>
              </div>
              <Progress value={(dailyProgress / 20) * 100} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Meta Diária</div>
                  <div className="text-sm text-green-600">20 questões</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-blue-800">Nível Atual</div>
                  <div className="text-sm text-blue-600">Intermediário</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-semibold text-yellow-800">Metas Batidas</div>
                  <div className="text-sm text-yellow-600">{goalsMet}</div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleStartTraining}
                className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-3 text-lg font-semibold"
              >
                <Play className="w-5 h-5 mr-2" />
                {dailyProgress > 0 ? 'Continuar Treinamento' : 'Iniciar Simulado'}
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Questões adaptadas ao seu nível de conhecimento
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / 20) * 100;
  const question = trainingQuestions[currentQuestion];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fácil': return 'bg-green-100 text-green-800';
      case 'Médio': return 'bg-yellow-100 text-yellow-800';
      case 'Difícil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blue-900">Simulado ENEM - Matemática</h2>
          <span className="text-sm text-gray-600">
            Questão {currentQuestion + 1} de 20
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge className={`${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {question.topic}
            </Badge>
          </div>
          <CardTitle className="text-lg text-blue-900">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${selectedAnswer === index
                    ? 'border-blue-700 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-500 hover:bg-blue-25'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedAnswer === index
                      ? 'border-blue-700 bg-blue-700'
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
              onClick={handlePause}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>

            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>

            <Button
              variant="outline"
              onClick={handleSkip}
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Pular
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={selectedAnswer === null}
              className="flex-1 bg-blue-800 hover:bg-blue-900 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion === 19 ? 'Finalizar' : 'Confirmar'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingInterface;
