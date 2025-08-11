
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
  id: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subtopic?: string; // Adicionando subtópico para estatísticas
}

interface TrainingInterfaceProps {
  onContinueTraining?: () => void;
  forceContinueTraining?: boolean;
}

const TrainingInterface = ({ onContinueTraining, forceContinueTraining }: TrainingInterfaceProps) => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showDailyComplete, setShowDailyComplete] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [goalsMet, setGoalsMet] = useState(0);
  const [questions, setQuestions] = useState<DynamicQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar progresso salvo e iniciar treinamento se necessário
  useEffect(() => {
    console.log('🔍 TrainingInterface useEffect executado');
    
    const savedProgress = localStorage.getItem('training_progress');
    console.log('📦 Progresso salvo:', savedProgress);
    
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const today = new Date().toDateString();
      console.log('📅 Data do progresso:', progress.date, 'Data atual:', today);
      
      if (progress.date === today) {
        console.log('✅ Progresso de hoje encontrado, restaurando sessão...');
        setDailyProgress(progress.completed || 0);
        if (progress.currentSession) {
          console.log('🔄 Restaurando sessão ativa...');
          setIsTraining(true);
          setCurrentQuestion(progress.currentSession.currentQuestion || 0);
          setAnswers(progress.currentSession.answers || new Array(20).fill(null));
          // Restaurar resposta selecionada se existir
          const savedAnswers = progress.currentSession.answers || [];
          setSelectedAnswer(savedAnswers[progress.currentSession.currentQuestion] || null);
          
          // Restaurar questões se existirem
          if (progress.questions) {
            console.log('📚 Restaurando questões salvas...');
            setQuestions(progress.questions);
          } else {
            console.log('⚠️ Questões não encontradas, carregando novamente...');
            startTraining();
          }
        }
      } else {
        console.log('📅 Progresso de outro dia, iniciando nova sessão...');
      }
    } else {
      console.log('📦 Nenhum progresso salvo encontrado');
    }

    // Carregar metas batidas
    const savedGoals = localStorage.getItem('user_goals');
    if (savedGoals) {
      setGoalsMet(parseInt(savedGoals));
    }

    // Se não há sessão ativa, iniciar treinamento automaticamente
    if (!savedProgress || JSON.parse(savedProgress || '{}').date !== new Date().toDateString()) {
      console.log('🚀 Iniciando treinamento automaticamente...');
      startTraining();
    } else {
      console.log('⏸️ Sessão ativa encontrada, não iniciando automaticamente');
      
      // Se não há sessão ativa mas já completou questões hoje, verificar se deve continuar
      const progress = JSON.parse(savedProgress);
      if (!progress.currentSession && progress.completed && progress.completed > 0) {
        console.log('🔄 Detectado que já completou questões hoje, verificando se deve continuar...');
        
        // Se forceContinueTraining é true, continuar automaticamente
        if (forceContinueTraining) {
          console.log('🚀 Forçando continuação do treinamento...');
          continueTraining();
        }
      }
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

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;

    // Desabilitar botão durante processamento
    const submitButton = document.querySelector('[data-testid="next-button"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processando...';
    }

    try {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      // Armazenar resposta localmente (sem enviar ao backend ainda)
      const currentQ = questions[currentQuestion];
      const isCorrect = currentQ.alternatives[selectedAnswer]?.isCorrect || false;
      
      console.log('💾 Armazenando resposta localmente:', {
        questionId: currentQ.id,
        answer: currentQ.alternatives[selectedAnswer]?.letter || '',
        isCorrect,
        competencyName: currentQ.subtopicName || currentQ.topicName || 'Desconhecido'
      });

      // Avançar para próxima questão
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(newAnswers[nextQuestion]);
        
        // Atualizar sessão salva
        const savedProgress = JSON.parse(localStorage.getItem('training_progress') || '{}');
        savedProgress.currentSession = {
          currentQuestion: nextQuestion,
          answers: newAnswers
        };
        localStorage.setItem('training_progress', JSON.stringify(savedProgress));
      } else {
        // Treinamento concluído - enviar todas as respostas de uma vez
        console.log('🏁 Treinamento concluído, enviando todas as respostas...');
        
        const allAnswers = newAnswers.map((answer, index) => {
          const question = questions[index];
          return {
            questionId: question.id,
            answer: question.alternatives[answer || 0]?.letter || '',
            isCorrect: question.alternatives[answer || 0]?.isCorrect || false,
            competencyName: question.subtopicName || question.topicName || 'Desconhecido'
          };
        }).filter(answer => answer.answer !== '');

        await dynamicQuestionsService.completeSession(allAnswers);
        
        // Atualizar progresso
        const completedToday = dailyProgress + questions.length;
        setDailyProgress(completedToday);
        
        // Salvar progresso
        const savedProgress = JSON.parse(localStorage.getItem('training_progress') || '{}');
        savedProgress.completed = completedToday;
        delete savedProgress.currentSession;
        localStorage.setItem('training_progress', JSON.stringify(savedProgress));
        
        // Verificar se bateu a meta
        if (completedToday >= 20) {
          setGoalsMet(prev => prev + 1);
          localStorage.setItem('user_goals', (goalsMet + 1).toString());
          setShowDailyComplete(true);
        } else {
          setShowResults(true);
        }
      }
    } catch (err) {
      console.error('❌ Erro ao processar questão:', err);
      alert('Erro ao processar questão. Tente novamente.');
    } finally {
      // Reabilitar botão
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima';
      }
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

  const handlePreviousQuestion = () => {
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
      localStorage.setItem('training_progress', JSON.stringify(savedProgress));
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

  const handleFinishTraining = () => {
    setIsTraining(false);
    setShowResults(false);
    setShowDailyComplete(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setQuestions([]);
  };

  const calculateScore = () => {
    const answeredQuestions = answers.filter(answer => answer !== null);
    const correctAnswers = answeredQuestions.filter((answer, index) => {
      const question = questions[index];
      return question && question.alternatives[answer || 0]?.isCorrect;
    });
    return Math.round((correctAnswers.length / answeredQuestions.length) * 100);
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

  if (showResults) {
    const score = calculateScore();
    const answeredCount = answers.filter(answer => answer !== null).length;
    
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              Resultados do Treinamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{score}%</div>
                <div className="text-sm text-gray-600">Aproveitamento</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{answeredCount}</div>
                <div className="text-sm text-gray-600">Questões Respondidas</div>
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
            
            <Button onClick={handleFinishTraining} className="w-full">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isTraining) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Treinamento Diário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Progresso Diário</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Questões Completadas</span>
                    <span>{dailyProgress}/20</span>
                  </div>
                  <Progress value={(dailyProgress / 20) * 100} className="h-2" />
                </div>
                <p className="text-sm text-gray-600">
                  Complete 20 questões por dia para manter o ritmo de estudos.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Estatísticas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Metas Batidas</span>
                    <Badge variant="secondary">{goalsMet}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Questões Restantes</span>
                    <Badge variant="outline">{Math.max(0, 20 - dailyProgress)}</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={() => setError(null)} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}
            
            <Button 
              onClick={startTraining} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Carregando Questões...' : 'Iniciar Treinamento'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <OptimizedLoading 
        message="Carregando questões otimizadas..."
        showProgress={false}
      />
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  
  // Debug: verificar estrutura da questão atual
  console.log('🔍 Questão atual:', currentQ);
  console.log('📝 Alternativas:', currentQ?.alternatives);
  console.log('📊 Total de alternativas:', currentQ?.alternatives?.length);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Questão {currentQuestion + 1} de {questions.length}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Nível {currentQ.competencyLevel}
              </Badge>
              <Badge variant="secondary">
                {currentQ.subtopicName || currentQ.topicName}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
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
          
          <div className="space-y-3">
            <h4 className="font-medium">Alternativas:</h4>
            {currentQ.alternatives && currentQ.alternatives.length > 0 ? (
              currentQ.alternatives.map((alternative, index) => (
                <button
                  key={alternative.id}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${
                    selectedAnswer === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium mr-2">{alternative.letter}.</span>
                  {alternative.text}
                </button>
              ))
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">⚠️ Alternativas não encontradas para esta questão</p>
                <p className="text-sm text-yellow-600 mt-1">Estrutura da questão: {JSON.stringify(currentQ, null, 2)}</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-between">
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
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
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
