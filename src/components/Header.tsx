import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, User, Brain } from 'lucide-react';
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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (!user) return null;

  return (
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
  );
};

export default Header;
