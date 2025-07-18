import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, User, Brain, BarChart3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onBackToTrails: () => void;
}

const Header = ({ currentView, onBackToTrails }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showStats, setShowStats] = useState(false);

  // Mock de estatísticas (pode ser substituído por dados reais/localStorage futuramente)
  const stats = {
    goalsAchieved: 3,
    totalQuestions: 120,
    totalCorrect: 90,
    topicStats: {
      'Álgebra': { correct: 30, total: 40 },
      'Geometria': { correct: 25, total: 30 },
      'Estatística': { correct: 20, total: 25 },
      'Funções': { correct: 15, total: 25 },
    },
  };
  const overallPercentage = stats.totalQuestions > 0 ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) : 0;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/perfil');
  };

  if (!user) return null;

  return (
    <>
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {currentView !== 'trails' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToTrails}
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Trilhas
              </Button>
            )}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-blue-800">
                Mentor<span className="text-blue-700">IA</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={showStats} onOpenChange={setShowStats}>
              <DialogTrigger asChild>
                <button
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                  title="Estatísticas"
                >
                  <BarChart3 className="w-4 h-4 text-blue-700" />
                  <span className="text-blue-800 font-medium">Estatísticas</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Painel de Estatísticas</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-900">{stats.goalsAchieved}</div>
                    <div className="text-sm text-blue-600">Metas Batidas</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-900">{stats.totalQuestions}</div>
                    <div className="text-sm text-green-600">Questões Resolvidas</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-900">{stats.totalCorrect}</div>
                    <div className="text-sm text-yellow-600">Total de Acertos</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-900">{overallPercentage}%</div>
                    <div className="text-sm text-purple-600">Aproveitamento</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Rendimento por Tópico</h3>
                  <div className="space-y-4">
                    {Object.entries(stats.topicStats).map(([topic, data]) => {
                      const percentage = Math.round((data.correct / data.total) * 100);
                      return (
                        <div key={topic} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{topic}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {data.correct}/{data.total}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${percentage >= 80 ? 'bg-green-100 text-green-800' : percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{percentage}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`} style={{ width: `${percentage}%` }} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {data.total} questão{data.total > 1 ? 'ões' : ''} respondida{data.total > 1 ? 's' : ''}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-700" />
              <span className="text-blue-800 font-medium">{user.name}</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-700 border-gray-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
