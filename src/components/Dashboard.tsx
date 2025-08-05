import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectTrails from './SubjectTrails';
import EnhancedDiagnosticTest from './EnhancedDiagnosticTest';
import TrainingInterface from './TrainingInterface';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { tokenUtils, userUtils } from '@/lib/auth';

type CurrentView = 'trails' | 'diagnostic' | 'training';

const Dashboard = () => {
  const { user, logout, isLoading, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState<boolean>(
    localStorage.getItem('diagnostic_completed') === 'true'
  );
  const [currentView, setCurrentView] = useState<CurrentView>(
    hasCompletedDiagnostic ? 'training' : 'trails'
  );
  const [forceContinueTraining, setForceContinueTraining] = useState(false);

  // Resetar forceContinueTraining quando sair da view de training
  useEffect(() => {
    if (currentView !== 'training') {
      setForceContinueTraining(false);
    }
  }, [currentView]);

  const handleStartDiagnostic = () => {
    setCurrentView('diagnostic');
  };

  const handleStartTraining = () => {
    setCurrentView('training');
  };

  const handleContinueTraining = () => {
    setForceContinueTraining(true);
    setCurrentView('training');
    // A função continueTraining será chamada automaticamente pelo TrainingInterface
    // quando detectar que não há sessão ativa mas já completou questões hoje
  };

  const handleBackToTrails = () => {
    setCurrentView('trails');
  };

  const handleDiagnosticComplete = () => {
    localStorage.setItem('diagnostic_completed', 'true');
    setHasCompletedDiagnostic(true);
    setCurrentView('training');
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('diagnostic_completed');
    localStorage.removeItem('diagnostic_progress');
    localStorage.removeItem('training_progress');
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-blue-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const handleBackToLogin = async () => {
      try {
        // Primeiro limpa todos os estados
        setIsAuthenticated(false);
        tokenUtils.clearToken();
        userUtils.clearUser();
        localStorage.removeItem('diagnostic_completed');
        localStorage.removeItem('diagnostic_progress');
        localStorage.removeItem('training_progress');
        
        // Então navega para o login
        navigate('/', { replace: true });
      } catch (error) {
        console.error('Erro ao voltar para login:', error);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar dados do usuário.</p>
          <button 
            onClick={handleBackToLogin}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Voltar para o login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header 
        user={user.name} 
        onLogout={handleLogout}
        currentView={currentView}
        onBackToTrails={handleBackToTrails}
      />
      
      <div className="container mx-auto px-4 py-8">
        {currentView === 'trails' && (
          <SubjectTrails 
            hasCompletedDiagnostic={hasCompletedDiagnostic}
            onStartDiagnostic={handleStartDiagnostic}
            onStartTraining={handleStartTraining}
            onContinueTraining={handleContinueTraining}
          />
        )}
        
        {currentView === 'diagnostic' && (
          <EnhancedDiagnosticTest onComplete={handleDiagnosticComplete} />
        )}
        
        {currentView === 'training' && (
          <TrainingInterface 
            onContinueTraining={handleContinueTraining} 
            forceContinueTraining={forceContinueTraining}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
