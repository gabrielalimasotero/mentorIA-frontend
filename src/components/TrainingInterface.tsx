
import React, { useState, useEffect } from 'react';
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
  Pause,
  ArrowLeft,
  ArrowRight,
  XCircle
} from 'lucide-react';
import DailyGoalComplete from './DailyGoalComplete';
import ResultsReview from './ResultsReview';
import OptimizedLoading from './OptimizedLoading';
import { StatisticsService } from '@/lib/statistics';
import { dynamicQuestionsService, DynamicQuestion } from '@/lib/dynamic-questions';

interface TrainingQuestion {
  id: string;
  topic: string;
  difficulty: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subtopic?: string;
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
          const savedAnswers = progress.currentSession.answers || [];
          setSelectedAnswer(savedAnswers[progress.currentSession.currentQuestion] || null);

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

    // Se não há sessão ativa, NÃO iniciar automaticamente - aguardar usuário clicar
    if (!savedProgress || JSON.parse(savedProgress || '{}').date !== new Date().toDateString()) {
      console.log('⏸️ Nenhum progresso encontrado, aguardando usuário iniciar...');
      // Não iniciar automaticamente - deixar usuário clicar no botão
    } else {
      console.log('⏸️ Sessão ativa encontrada, verificando se deve continuar...');

      const progress = JSON.parse(savedProgress);
      if (!progress.currentSession && progress.completed && progress.completed > 0) {
        console.log('🔄 Detectado que já completou questões hoje, verificando se deve continuar...');

        if (forceContinueTraining) {
          console.log('🚀 Forçando continuação do treinamento...');
          continueTraining();
        }
      }
    }
  }, []);

  // Função para continuar treinamento (carregar novas questões)
  const continueTraining = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Continuando treinamento com novas questões...');

      const session = await dynamicQuestionsService.getSession(20);

      setQuestions(session.questions);
      setIsTraining(true);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers(new Array(session.questions.length).fill(null));

      const sessionData = {
        date: new Date().toDateString(),
        sessionId: session.sessionId,
        questions: session.questions,
        currentSession: {
          currentQuestion: 0,
          answers: new Array(session.questions.length).fill(null)
        }
      };
      localStorage.setItem('training_progress', JSON.stringify(sessionData));

      console.log('✅ Nova sessão carregada com sucesso');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar nova sessão');
      console.error('Erro ao carregar nova sessão:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carregar sessão completa quando iniciar treinamento
  const startTraining = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Iniciando carregamento de sessão otimizada...');

      const session = await dynamicQuestionsService.getSession(20);

      setQuestions(session.questions);
      setIsTraining(true);
      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setAnswers(new Array(session.questions.length).fill(null));

      const sessionData = {
        date: new Date().toDateString(),
        sessionId: session.sessionId,
        questions: session.questions,
        currentSession: {
          currentQuestion: 0,
          answers: new Array(session.questions.length).fill(null)
        }
      };
      localStorage.setItem('training_progress', JSON.stringify(sessionData));

      console.log('✅ Sessão carregada com sucesso (otimizada)');
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar sessão');
      console.error('Erro ao carregar sessão:', err);
    } finally {
      setLoading(false);
    }
  };

  // Função para registrar resposta no backend
  const recordAnswer = async (question: DynamicQuestion, isCorrect: boolean) => {
    try {
      await StatisticsService.recordAnswer({
        questionId: question.id,
        subtopicName: question.subtopicName || question.topicName || '',
        topicName: question.topicName || '',
        isCorrect
      });
    } catch (error) {
      console.error('Erro ao registrar resposta:', error);
    }
  };

  const handleStartTraining = () => {
    startTraining();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;

    const submitButton = document.querySelector('[data-testid="next-button"]') as HTMLButtonElement;
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processando...';
    }

    try {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);

      const currentQ = questions[currentQuestion];
      const isCorrect = currentQ.alternatives[selectedAnswer]?.isCorrect || false;

      console.log('💾 Armazenando resposta localmente:', {
        questionId: currentQ.id,
        answer: currentQ.alternatives[selectedAnswer]?.letter || '',
        isCorrect,
        competencyName: currentQ.subtopicName || currentQ.topicName || 'Desconhecido'
      });

      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(newAnswers[nextQuestion]);

        const savedProgress = JSON.parse(localStorage.getItem('training_progress') || '{}');
        savedProgress.currentSession = {
          currentQuestion: nextQuestion,
          answers: newAnswers
        };
        localStorage.setItem('training_progress', JSON.stringify(savedProgress));
      } else {
        console.log('🏁 Treinamento concluído, enviando todas as respostas...');

        const allAnswers = newAnswers.map((answer, index) => {
          const question = questions[index];
          return {
            questionId: question.id,
            answer: question.alternatives[answer || 0]?.letter || '',
            isCorrect: question.alternatives[answer || 0]?.isCorrect || false,
            competencyName: question.subtopicName || question.topicName || 'Desconhecido',
            topicName: question.topicName || 'Matemática'
          };
        }).filter(answer => answer.answer !== '');

        await dynamicQuestionsService.completeSession(allAnswers);

        const completedToday = dailyProgress + questions.length;
        setDailyProgress(completedToday);

        // Registrar estudo diário no backend
        try {
          const studyResult = await StatisticsService.registerDailyStudy(completedToday);
          console.log('📊 Estudo diário registrado:', studyResult);
          
          // Atualizar metas se completou o objetivo diário
          if (completedToday >= 20) {
            setGoalsMet(prev => prev + 1);
            localStorage.setItem('user_goals', (goalsMet + 1).toString());
            setShowDailyComplete(true);
          } else {
            setShowResults(true);
          }
        } catch (error) {
          console.error('❌ Erro ao registrar estudo diário:', error);
          // Continuar mesmo se falhar o registro
          if (completedToday >= 20) {
            setGoalsMet(prev => prev + 1);
            localStorage.setItem('user_goals', (goalsMet + 1).toString());
            setShowDailyComplete(true);
          } else {
            setShowResults(true);
          }
        }

        const savedProgress = JSON.parse(localStorage.getItem('training_progress') || '{}');
        savedProgress.completed = completedToday;
        delete savedProgress.currentSession;
        localStorage.setItem('training_progress', JSON.stringify(savedProgress));
      }
    } catch (err) {
      console.error('❌ Erro ao processar questão:', err);
      alert('Erro ao processar questão. Tente novamente.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima';
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setSelectedAnswer(answers[prevQuestion]);

      const savedProgress = JSON.parse(localStorage.getItem('training_progress') || '{}');
      savedProgress.currentSession = {
        currentQuestion: prevQuestion,
        answers: answers
      };
      localStorage.setItem('training_progress', JSON.stringify(savedProgress));
    }
  };

  const handleSkipQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = null;
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1;
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(newAnswers[nextQuestion]);

      const savedProgress = JSON.parse(localStorage.getItem('training_progress') || '{}');
      savedProgress.currentSession = {
        currentQuestion: nextQuestion,
        answers: newAnswers
      };
      localStorage.setItem('training_progress', JSON.stringify(savedProgress));
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

  if (showDailyComplete) {
    return <DailyGoalComplete onContinue={handleFinishTraining} onFinish={() => {
      setShowDailyComplete(false);
      setIsTraining(false);
    }} />;
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
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{questions.length}</div>
                <div className="text-sm text-gray-600">Total de Questões</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Resumo por Competência:</h3>
              {questions.map((question, index) => {
                const answer = answers[index];
                const isCorrect = answer !== null && question.alternatives[answer]?.isCorrect;
                return (
                  <div key={question.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : answer !== null ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="text-sm">
                      {question.subtopicName || question.topicName} - Nível {question.competencyLevel}
                    </span>
                  </div>
                );
              })}
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
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{currentQ.title}</h3>
            <p className="text-gray-700">{currentQ.problemStatement}</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Alternativas:</h4>
            {currentQ.alternatives && currentQ.alternatives.length > 0 ? (
              currentQ.alternatives.map((alternative, index) => (
                <button
                  key={alternative.id}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left border rounded-lg transition-colors ${selectedAnswer === index
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
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleSkipQuestion}
              >
                Pular
              </Button>

              <Button
                data-testid="next-button"
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
              >
                {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingInterface;
