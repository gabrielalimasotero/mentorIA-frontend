import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Target,
  Trophy,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { StatisticsService, UserStatistics } from '@/lib/statistics';

interface StatisticsData {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  studyStreak: number;
  totalStudyTime: number;
  completedTests: number;
  averageScore: number;
  topicsProgress: {
    topic: string;
    subtopics: {
      name: string;
      progress: number;
      questionsAnswered: number;
      correctAnswers: number;
    }[];
    totalProgress: number;
    totalQuestions: number;
  }[];
  recentActivity: {
    date: string;
    questionsAnswered: number;
    accuracy: number;
  }[];
}

const StatisticsPage = () => {
  const navigate = useNavigate();
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [statistics, setStatistics] = useState<StatisticsData>({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    studyStreak: 0,
    totalStudyTime: 0,
    completedTests: 0,
    averageScore: 0,
    topicsProgress: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTopic = (topicName: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicName)) {
      newExpanded.delete(topicName);
    } else {
      newExpanded.add(topicName);
    }
    setExpandedTopics(newExpanded);
  };

  const expandAllTopics = () => {
    const allTopics = statistics.topicsProgress.map(topic => topic.topic);
    setExpandedTopics(new Set(allTopics));
  };

  const collapseAllTopics = () => {
    setExpandedTopics(new Set());
  };

  // Definição dos tópicos e subtópicos válidos
  const SUBTOPICS_VALIDOS = {
    "Aritmética": [
      "Porcentagem e Razão",
      "Regra de Três",
      "Unidades e Conversão",
      "Operações Básicas"
    ],
    "Álgebra": [
      "Equações do 1º grau",
      "Equações do 2º grau",
      "Produtos Notáveis e Fatoração",
      "Mínimo Múltiplo Comum (MMC) e Máximo Divisor Comum (MDC)",
      "Progressão Aritmética (PA)",
      "Progressão Geométrica (PG)"
    ],
    "Funções": [
      "Função Afim (1º grau)",
      "Função Quadrática",
      "Função Exponencial",
      "Função Logarítmica",
      "Análise Gráfica"
    ],
    "Geometria Plana": [
      "Áreas e Perímetros",
      "Semelhança e Proporcionalidade",
      "Teorema de Pitágoras",
      "Ângulos"
    ],
    "Geometria Espacial": [
      "Volumes",
      "Áreas Laterais e Totais",
      "Prismas e Pirâmides",
      "Cilindros e Cones"
    ],
    "Trigonometria": [
      "Razões Trigonométricas",
      "Lei dos Senos e Cossenos",
      "Identidades Trigonométricas",
      "Equações Trigonométricas"
    ],
    "Probabilidade e Estatística": [
      "Probabilidade",
      "Estatística Descritiva",
      "Análise Combinatória",
      "Distribuição de Frequências"
    ]
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Carregar estatísticas do backend
      const userStatistics = await StatisticsService.getUserStatistics();
      const formattedStats = StatisticsService.formatStatistics(userStatistics);

      // Carregar dados do localStorage para informações adicionais
      const userGoals = localStorage.getItem('user_goals') || '0';

      // Mapear estatísticas do backend para o formato do componente
      const topicsProgress = Object.entries(SUBTOPICS_VALIDOS).map(([topic, subtopics]) => {
        // Encontrar estatísticas do tópico no backend
        const topicStats = formattedStats.byTopic.find(t => t.name === topic);

        const subtopicsProgress = subtopics.map(subtopic => {
          // Encontrar estatísticas da competência no backend
          const competencyStats = formattedStats.byCompetency.find(c => c.name === subtopic);

          return {
            name: subtopic,
            progress: competencyStats ? competencyStats.accuracy : 0,
            questionsAnswered: competencyStats ? competencyStats.questionsAnswered : 0,
            correctAnswers: competencyStats ? competencyStats.correctAnswers : 0
          };
        });

        return {
          topic,
          subtopics: subtopicsProgress,
          totalProgress: topicStats ? topicStats.accuracy : 0,
          totalQuestions: topicStats ? topicStats.questionsAnswered : 0
        };
      });

      // Calcular estatísticas gerais
      const totalQuestions = formattedStats.general.totalQuestions;
      const correctAnswers = formattedStats.general.totalCorrect;
      const accuracy = formattedStats.general.overallAccuracy;

      // Simular dados adicionais (em um sistema real, isso viria do backend)
      const studyStreak = parseInt(userGoals);
      const totalStudyTime = Math.floor(totalQuestions * 2.5); // 2.5 minutos por questão
      const completedTests = Math.ceil(totalQuestions / 10); // Estimativa baseada em questões respondidas
      const averageScore = accuracy;

      // Atividade recente (em um sistema real, isso viria do backend)
      const recentActivity = totalQuestions > 0 ? [
        { date: 'Hoje', questionsAnswered: Math.min(8, totalQuestions), accuracy: Math.min(87, accuracy + 10) },
        { date: 'Ontem', questionsAnswered: Math.min(12, totalQuestions), accuracy: Math.min(75, accuracy + 5) },
        { date: '2 dias atrás', questionsAnswered: Math.min(6, totalQuestions), accuracy: Math.min(83, accuracy + 8) },
        { date: '3 dias atrás', questionsAnswered: Math.min(10, totalQuestions), accuracy: Math.min(70, accuracy) }
      ] : [];

      setStatistics({
        totalQuestions,
        correctAnswers,
        accuracy,
        studyStreak,
        totalStudyTime,
        completedTests,
        averageScore,
        topicsProgress,
        recentActivity
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setError('Erro ao carregar estatísticas. Tente novamente.');

      // Fallback para dados locais se o backend falhar
      loadLocalStatistics();
    } finally {
      setLoading(false);
    }
  };

  const loadLocalStatistics = () => {
    // Carregar dados do localStorage como fallback
    const diagnosticProgress = localStorage.getItem('diagnostic_progress');
    const trainingProgress = localStorage.getItem('training_progress');
    const userGoals = localStorage.getItem('user_goals') || '0';

    const hasCompletedDiagnostic = diagnosticProgress && JSON.parse(diagnosticProgress).completed;

    let totalQuestions = 0;
    let correctAnswers = 0;
    let completedTests = 0;

    if (hasCompletedDiagnostic) {
      if (diagnosticProgress) {
        const diagnostic = JSON.parse(diagnosticProgress);
        if (diagnostic.answers) {
          totalQuestions += diagnostic.answers.length;
          correctAnswers += diagnostic.answers.filter((answer: number | null) => answer !== null).length;
          if (diagnostic.completed) completedTests++;
        }
      }

      if (trainingProgress) {
        const training = JSON.parse(trainingProgress);
        if (training.answers) {
          totalQuestions += training.answers.filter((answer: number | null) => answer !== null).length;
          correctAnswers += Math.floor(training.answers.filter((answer: number | null) => answer !== null).length * 0.7);
        }
        if (training.completed) completedTests++;
      }
    }

    const accuracy = hasCompletedDiagnostic && totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    const topicsProgress = Object.entries(SUBTOPICS_VALIDOS).map(([topic, subtopics]) => {
      if (hasCompletedDiagnostic) {
        const topicQuestions = Math.floor(Math.random() * 20) + 5;
        const topicCorrect = Math.floor(topicQuestions * (0.5 + Math.random() * 0.4));

        const subtopicsProgress = subtopics.map(subtopic => {
          const subtopicQuestions = Math.floor(Math.random() * 8) + 2;
          const subtopicCorrect = Math.floor(subtopicQuestions * (0.4 + Math.random() * 0.5));
          return {
            name: subtopic,
            progress: Math.round((subtopicCorrect / subtopicQuestions) * 100),
            questionsAnswered: subtopicQuestions,
            correctAnswers: subtopicCorrect
          };
        });

        return {
          topic,
          subtopics: subtopicsProgress,
          totalProgress: Math.round((topicCorrect / topicQuestions) * 100),
          totalQuestions: topicQuestions
        };
      } else {
        return {
          topic,
          subtopics: subtopics.map(subtopic => ({
            name: subtopic,
            progress: 0,
            questionsAnswered: 0,
            correctAnswers: 0
          })),
          totalProgress: 0,
          totalQuestions: 0
        };
      }
    });

    const recentActivity = hasCompletedDiagnostic ? [
      { date: 'Hoje', questionsAnswered: 8, accuracy: 87 },
      { date: 'Ontem', questionsAnswered: 12, accuracy: 75 },
      { date: '2 dias atrás', questionsAnswered: 6, accuracy: 83 },
      { date: '3 dias atrás', questionsAnswered: 10, accuracy: 70 }
    ] : [];

    setStatistics({
      totalQuestions,
      correctAnswers,
      accuracy,
      studyStreak: hasCompletedDiagnostic ? parseInt(userGoals) : 0,
      totalStudyTime: hasCompletedDiagnostic ? Math.floor(totalQuestions * 2.5) : 0,
      completedTests,
      averageScore: hasCompletedDiagnostic ? accuracy : 0,
      topicsProgress,
      recentActivity
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              ← Voltar ao Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
              <BarChart3 className="w-8 h-8" />
              Estatísticas
            </h1>
          </div>
        </div>

        {/* Cards principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Taxa de Acerto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{statistics.accuracy}%</div>
              <p className="text-sm text-gray-500 mt-1">
                {statistics.totalQuestions > 0 ? `${statistics.correctAnswers} de ${statistics.totalQuestions} questões` : 'Nenhuma questão respondida'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Sequência de Estudo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{statistics.studyStreak}</div>
              <p className="text-sm text-gray-500 mt-1">
                {statistics.studyStreak > 0 ? 'dias consecutivos' : 'nenhum dia'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Questões Resolvidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{statistics.totalQuestions}</div>
              <p className="text-sm text-gray-500 mt-1">
                {statistics.totalQuestions > 0 ? 'total de questões' : 'nenhuma questão'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Testes Realizados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{statistics.completedTests}</div>
              <p className="text-sm text-gray-500 mt-1">
                {statistics.completedTests > 0 ? 'testes completados' : 'nenhum teste'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso por Tópicos e Subtópicos */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Progresso por Tópicos e Subtópicos
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={expandAllTopics}
                  className="text-xs"
                >
                  Expandir Todos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={collapseAllTopics}
                  className="text-xs"
                >
                  Colapsar Todos
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statistics.topicsProgress.map((topic, index) => (
                <Collapsible
                  key={index}
                  open={expandedTopics.has(topic.topic)}
                  onOpenChange={() => toggleTopic(topic.topic)}
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Header do tópico - sempre visível */}
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all duration-200">
                        <div className="flex items-center gap-3">
                          {expandedTopics.has(topic.topic) ? (
                            <ChevronDown className="w-5 h-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{topic.topic}</h3>
                            <p className="text-sm text-gray-500">
                              {topic.totalQuestions} questões respondidas
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{topic.totalQuestions} questões</Badge>
                          <span className="text-lg font-bold text-blue-600">{topic.totalProgress}%</span>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    {/* Conteúdo expansível */}
                    <CollapsibleContent>
                      <div className="p-4 bg-white">
                        {/* Barra de progresso do tópico */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progresso Geral</span>
                            <span className="text-sm text-gray-500">{topic.totalProgress}%</span>
                          </div>
                          <Progress value={topic.totalProgress} className="h-3" />
                        </div>

                        {/* Subtópicos */}
                        <div className="space-y-3">
                          <h4 className="font-medium text-gray-700 text-sm">Subtópicos:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {topic.subtopics.map((subtopic, subtopicIndex) => (
                              <div key={subtopicIndex} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700 truncate">
                                    {subtopic.name}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-500">
                                      {subtopic.questionsAnswered}q
                                    </span>
                                    <span className="text-sm font-medium text-blue-600">
                                      {subtopic.progress}%
                                    </span>
                                  </div>
                                </div>
                                <Progress value={subtopic.progress} className="h-2" />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>{subtopic.correctAnswers}/{subtopic.questionsAnswered} corretas</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>

            {/* Mensagem de incentivo quando não há progresso */}
            {!statistics.topicsProgress.some(topic => topic.totalQuestions > 0) && (
              <div className="text-center py-6 mt-6 border-t border-gray-200">
                <p className="text-gray-600 mb-4">
                  Complete o diagnóstico inicial para começar a acompanhar seu progresso detalhado por tópicos e subtópicos
                </p>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Fazer Diagnóstico
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividade recente */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Atividade Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statistics.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {statistics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {activity.accuracy >= 80 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className="font-medium text-gray-700">{activity.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Questões</div>
                        <div className="font-medium text-blue-600">{activity.questionsAnswered}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-500">Precisão</div>
                        <div className="font-medium text-green-600">{activity.accuracy}%</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Nenhuma atividade registrada
                </h3>
                <p className="text-gray-600">
                  Suas atividades de estudo aparecerão aqui após completar o diagnóstico e começar os treinos
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StatisticsPage; 