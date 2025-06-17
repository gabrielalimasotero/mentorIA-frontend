
import { useState } from 'react';
import SubjectTrails from './SubjectTrails';
import DiagnosticTest from './DiagnosticTest';
import TrainingInterface from './TrainingInterface';
import Header from './Header';

interface DashboardProps {
  user: string;
  hasCompletedDiagnostic: boolean;
  onLogout: () => void;
  onDiagnosticComplete: () => void;
}

type CurrentView = 'trails' | 'diagnostic' | 'training';

const Dashboard = ({ user, hasCompletedDiagnostic, onLogout, onDiagnosticComplete }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<CurrentView>(
    hasCompletedDiagnostic ? 'training' : 'trails'
  );

  const handleStartDiagnostic = () => {
    setCurrentView('diagnostic');
  };

  const handleStartTraining = () => {
    setCurrentView('training');
  };

  const handleBackToTrails = () => {
    setCurrentView('trails');
  };

  const handleDiagnosticComplete = () => {
    onDiagnosticComplete();
    setCurrentView('training');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header 
        user={user} 
        onLogout={onLogout}
        currentView={currentView}
        onBackToTrails={handleBackToTrails}
      />
      
      <div className="container mx-auto px-4 py-8">
        {currentView === 'trails' && (
          <SubjectTrails 
            hasCompletedDiagnostic={hasCompletedDiagnostic}
            onStartDiagnostic={handleStartDiagnostic}
            onStartTraining={handleStartTraining}
          />
        )}
        
        {currentView === 'diagnostic' && (
          <DiagnosticTest onComplete={handleDiagnosticComplete} />
        )}
        
        {currentView === 'training' && (
          <TrainingInterface />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
