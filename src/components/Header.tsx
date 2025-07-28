import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, User, Brain, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  currentView: string;
  onBackToTrails: () => void;
}

const Header = ({ currentView, onBackToTrails }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-blue-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentView !== 'trails' && (
            <Button variant="outline" size="sm" onClick={onBackToTrails}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}
          <h1 className="text-xl font-semibold text-blue-800 flex items-center gap-2">
            <Brain className="w-6 h-6 text-blue-500" />
            MentorIA
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-blue-800"
            onClick={() => navigate('/perfil')}
          >
            <User className="w-4 h-4 mr-1" />
            Perfil
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="flex gap-1"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
