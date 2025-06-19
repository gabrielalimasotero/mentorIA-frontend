
import { useState } from 'react';
import Home from './Home';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard'>('home');
  const [user, setUser] = useState<string | null>(localStorage.getItem('enem_user'));
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState<boolean>(
    localStorage.getItem('diagnostic_completed') === 'true'
  );

  const handleGetStarted = () => {
    setCurrentView('login');
  };

  const handleLogin = (username: string) => {
    localStorage.setItem('enem_user', username);
    setUser(username);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('enem_user');
    localStorage.removeItem('diagnostic_completed');
    localStorage.removeItem('diagnostic_progress');
    localStorage.removeItem('training_progress');
    setUser(null);
    setHasCompletedDiagnostic(false);
    setCurrentView('home');
  };

  const handleDiagnosticComplete = () => {
    localStorage.setItem('diagnostic_completed', 'true');
    setHasCompletedDiagnostic(true);
  };

  // Check if user is already logged in on initial load
  if (user && currentView === 'home') {
    setCurrentView('dashboard');
  }

  if (currentView === 'home') {
    return <Home onGetStarted={handleGetStarted} />;
  }

  if (currentView === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      user={user!}
      hasCompletedDiagnostic={hasCompletedDiagnostic}
      onLogout={handleLogout}
      onDiagnosticComplete={handleDiagnosticComplete}
    />
  );
};

export default Index;
