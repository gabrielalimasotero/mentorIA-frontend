import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Brain } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LevelingTestProps {
  onComplete: () => void;
  onBack: () => void;
}

interface Question {
  id: string;
  orderIndex: number;
  question: {
    id: string;
    statement: string;
    options: string[];
    competencyId: string;
  };
}

interface Session {
  id: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  isCompleted: boolean;
  startedAt: string;
  completedAt?: string;
}

const LevelingTest = ({ onComplete, onBack }: LevelingTestProps) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Iniciar ou carregar teste
  useEffect(() => {
    const startTest = async () => {
      try {
        setIsLoading(true);
        console.log('🚀 Iniciando teste de nivelamento...');
        
        const token = localStorage.getItem('token');
        console.log('🔑 Token encontrado:', !!token);
        console.log('🔑 Token (primeiros 20 chars):', token ? token.substring(0, 20) + '...' : 'null');
        
        if (!token) {
          toast.error('Token de autenticação não encontrado');
          return;
        }

        console.log('📡 Fazendo requisição para:', `${API_URL}/leveling-test/start`);
        
        const response = await fetch(`${API_URL}/leveling-test/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('📊 Status da resposta:', response.status);
        console.log('📊 Headers da resposta:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Erro na resposta:', errorText);
          throw new Error(`Erro ao iniciar teste: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        console.log('📝 Número de questões:', data.data.questions?.length || 0);
        console.log('📝 Sessão:', data.data.session);
        
        setQuestions(data.data.questions);
        setSession(data.data.session);
        setCurrentQuestionIndex(data.data.session.currentQuestionIndex);
        
        // Carregar respostas existentes se houver
        if (data.data.session.currentQuestionIndex > 0) {
          // Buscar progresso existente
          const progressResponse = await fetch(`${API_URL}/leveling-test/progress/${data.data.session.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            // Aqui você pode carregar as respostas existentes se necessário
          }
        }
      } catch (error) {
        console.error('❌ Erro ao iniciar teste:', error);
        toast.error('Erro ao iniciar teste de nivelamento');
      } finally {
        setIsLoading(false);
      }
    };

    startTest();
  }, [API_URL]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = async () => {
    if (!selectedAnswer || !session) return;

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/leveling-test/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session.id,
          questionId: questions[currentQuestionIndex].question.id,
          selectedAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar resposta');
      }

      const data = await response.json();
      
      // Salvar resposta localmente
      setAnswers(prev => ({
        ...prev,
        [questions[currentQuestionIndex].question.id]: selectedAnswer,
      }));

      // Verificar se é a última questão
      if (data.data.nextQuestionIndex >= questions.length) {
        await completeTest();
      } else {
        setCurrentQuestionIndex(data.data.nextQuestionIndex);
        setSelectedAnswer(null);
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
      toast.error('Erro ao enviar resposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeTest = async () => {
    if (!session) return;

    try {
      setIsSubmitting(true);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/leveling-test/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: session.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao finalizar teste');
      }

      const data = await response.json();
      setResults(data.data);
      setShowResults(true);
      
      toast.success('Teste de nivelamento concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao finalizar teste:', error);
      toast.error('Erro ao finalizar teste');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
              <p className="text-blue-600">Carregando teste de nivelamento...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-green-50 to-green-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-700 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl text-green-800 mb-2">
              Teste de Nivelamento Concluído!
            </CardTitle>
            <p className="text-green-600 text-lg">
              Agora você pode acessar a apostila dinâmica
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
                <p className="text-gray-600">Questões Corretas</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {results.accuracy}%
                </div>
                <p className="text-gray-600">Taxa de Acerto</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {results.competencyResults?.length || 0}
                </div>
                <p className="text-gray-600">Competências Avaliadas</p>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleComplete}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              >
                Continuar para o Treinamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium">
                Questão {currentQuestionIndex + 1} de {questions.length}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-600">Progresso</span>
              <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {currentQuestion && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {currentQuestion.question.statement}
                </h3>
                
                <div className="space-y-3">
                  {currentQuestion.question.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      className={`w-full justify-start text-left p-4 h-auto ${
                        selectedAnswer === option 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'hover:bg-blue-50 border-gray-200'
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Selecione uma resposta para continuar
                </div>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={!selectedAnswer || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  {currentQuestionIndex === questions.length - 1 ? 'Finalizar' : 'Próxima'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelingTest;
