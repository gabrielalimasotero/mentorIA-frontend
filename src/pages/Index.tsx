
import { useState } from 'react';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';

const Index = () => {
  const [user, setUser] = useState<string | null>(localStorage.getItem('enem_user'));
  const [hasCompletedDiagnostic, setHasCompletedDiagnostic] = useState<boolean>(
    localStorage.getItem('diagnostic_completed') === 'true'
  );

  const handleLogin = (username: string) => {
    localStorage.setItem('enem_user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('enem_user');
    localStorage.removeItem('diagnostic_completed');
    localStorage.removeItem('diagnostic_progress');
    localStorage.removeItem('training_progress');
    setUser(null);
    setHasCompletedDiagnostic(false);
  };

  const handleDiagnosticComplete = () => {
    localStorage.setItem('diagnostic_completed', 'true');
    setHasCompletedDiagnostic(true);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      user={user}
      hasCompletedDiagnostic={hasCompletedDiagnostic}
      onLogout={handleLogout}
      onDiagnosticComplete={handleDiagnosticComplete}
    />
  );
};

export default Index;
