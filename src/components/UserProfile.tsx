
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, CheckCircle, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: string;
}

interface UserStats {
  goalsAchieved: number;
  totalQuestions: number;
  totalCorrect: number;
  topicStats: Record<string, { correct: number; total: number }>;
}

const UserProfile = ({ isOpen, onClose, user }: UserProfileProps) => {
  const [stats, setStats] = useState<UserStats>({
    goalsAchieved: 0,
    totalQuestions: 0,
    totalCorrect: 0,
    topicStats: {}
  });

  useEffect(() => {
    if (isOpen) {
      loadUserStats();
    }
  }, [isOpen]);

  const loadUserStats = () => {
    // Carregar estatísticas do diagnóstico
    const diagnosticData = localStorage.getItem('diagnostic_progress');
    const trainingData = localStorage.getItem('training_progress');
    
    let totalQuestions = 0;
    let totalCorrect = 0;
    let topicStats: Record<string, { correct: number; total: number }> = {};
    let goalsAchieved = 0;

    // Processar dados do diagnóstico
    if (diagnosticData) {
      const diagnostic = JSON.parse(diagnosticData);
      if (diagnostic.questions && diagnostic.answers) {
        diagnostic.questions.forEach((question: any, index: number) => {
          const topic = question.topic;
          const isCorrect = diagnostic.answers[index] === question.correctAnswer;
          
          if (!topicStats[topic]) {
            topicStats[topic] = { correct: 0, total: 0 };
          }
          
          topicStats[topic].total++;
          totalQuestions++;
          
          if (isCorrect) {
            topicStats[topic].correct++;
            totalCorrect++;
          }
        });
      }
    }

    // Processar dados do treinamento
    if (trainingData) {
      const training = JSON.parse(trainingData);
      goalsAchieved = Math.floor((training.completed || 0) / 20);
      
      // Adicionar estatísticas das sessões de treinamento se houver histórico
      const trainingHistory = localStorage.getItem('training_history');
      if (trainingHistory) {
        const history = JSON.parse(trainingHistory);
        history.forEach((session: any) => {
          session.questions.forEach((question: any, index: number) => {
            const topic = question.topic;
            const isCorrect = session.answers[index] === question.correctAnswer;
            
            if (!topicStats[topic]) {
              topicStats[topic] = { correct: 0, total: 0 };
            }
            
            topicStats[topic].total++;
            totalQuestions++;
            
            if (isCorrect) {
              topicStats[topic].correct++;
              totalCorrect++;
            }
          });
        });
      }
    }

    setStats({
      goalsAchieved,
      totalQuestions,
      totalCorrect,
      topicStats
    });
  };

  const overallPercentage = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Perfil - {user}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{stats.goalsAchieved}</div>
              <div className="text-sm text-blue-600">Metas Batidas</div>
            </div>

            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-900">{stats.totalQuestions}</div>
              <div className="text-sm text-green-600">Questões Resolvidas</div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-900">{stats.totalCorrect}</div>
              <div className="text-sm text-yellow-600">Total de Acertos</div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-900">{overallPercentage}%</div>
              <div className="text-sm text-purple-600">Aproveitamento</div>
            </div>
          </div>

          {/* Rendimento por Tópico */}
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Rendimento por Tópico</h3>
            <div className="space-y-4">
              {Object.entries(stats.topicStats).length > 0 ? (
                Object.entries(stats.topicStats).map(([topic, data]) => {
                  const percentage = Math.round((data.correct / data.total) * 100);
                  
                  return (
                    <div key={topic} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{topic}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {data.correct}/{data.total}
                          </span>
                          <Badge 
                            className={`text-xs ${
                              percentage >= 80 ? 'bg-green-100 text-green-800' :
                              percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {percentage}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-gray-500 mt-1">
                        {data.total} questão{data.total > 1 ? 'ões' : ''} respondida{data.total > 1 ? 's' : ''}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma estatística disponível ainda.</p>
                  <p className="text-sm">Complete o diagnóstico para ver seu progresso!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile;
