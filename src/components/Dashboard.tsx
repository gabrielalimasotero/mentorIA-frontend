import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SubjectTrails from './SubjectTrails';
import LevelingTest from './LevelingTest';
import TrainingInterface from './TrainingInterface';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';
import { tokenUtils, userUtils } from '@/lib/auth';

type CurrentView = 'trails' | 'leveling' | 'training';

const Dashboard = () => {
  const { user, logout, isLoading, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hasCompletedLevelingTest, setHasCompletedLevelingTest] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<CurrentView>('trails');
  const [forceContinueTraining, setForceContinueTraining] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  // Verificar status do teste de nivelamento
  useEffect(() => {
    const checkLevelingTestStatus = async () => {
      try {
        console.log('🔍 Dashboard - Verificando status do teste de nivelamento...');
        const token = localStorage.getItem('token');
        console.log('🔑 Token encontrado:', !!token);
        
        if (!token) {
          console.log('❌ Token não encontrado');
          return;
        }

        const url = `${API_URL}/leveling-test/status`;
        console.log('🌐 Fazendo requisição para:', url);
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('📊 Status da resposta:', response.status);
        console.log('📊 Headers da resposta:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Dados recebidos:', data);
          setHasCompletedLevelingTest(data.data.hasCompletedLevelingTest);
          console.log('🎯 hasCompletedLevelingTest definido como:', data.data.hasCompletedLevelingTest);
        } else {
          console.error('❌ Resposta não ok:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('❌ Erro detalhado:', errorText);
        }
      } catch (error) {
        console.error('❌ Erro ao verificar status do teste de nivelamento:', error);
      }
    };

    checkLevelingTestStatus();
  }, [API_URL]);

  // Definir view inicial baseado no status do teste de nivelamento
  useEffect(() => {
    console.log('🔄 Dashboard - hasCompletedLevelingTest mudou para:', hasCompletedLevelingTest);
    // Sempre começar na tela de trilhas, independente do status do nivelamento
    console.log('🎯 Sempre começando na view: trails');
    setCurrentView('trails');
    // Garantir que não force continuação automaticamente
    setForceContinueTraining(false);
  }, [hasCompletedLevelingTest]);

  // Resetar forceContinueTraining quando sair da view de training
  useEffect(() => {
    if (currentView !== 'training') {
      setForceContinueTraining(false);
    }
  }, [currentView]);

  const handleStartLevelingTest = () => {
    setCurrentView('leveling');
  };

  const handleStartTraining = () => {
    setCurrentView('training');
  };

  const handleContinueTraining = () => {
    setForceContinueTraining(true);
    setCurrentView('training');
  };

  const handleBackToTrails = () => {
    setCurrentView('trails');
  };

  const handleLevelingTestComplete = () => {
    setHasCompletedLevelingTest(true);
    setCurrentView('training'); // Ir para treinamento após teste de nivelamento
    // Não forçar continuação - deixar usuário escolher
  };

  const handleLogout = async () => {
    await logout();
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
            hasCompletedLevelingTest={hasCompletedLevelingTest}
            onStartLevelingTest={handleStartLevelingTest}
            onStartTraining={handleStartTraining}
            onContinueTraining={handleContinueTraining}
          />
        )}

        {currentView === 'leveling' && (
          <LevelingTest
            onComplete={handleLevelingTestComplete}
            onBack={handleBackToTrails}
          />
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
