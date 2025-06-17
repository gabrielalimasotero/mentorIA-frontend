
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, User } from 'lucide-react';
import UserProfile from './UserProfile';
import { useState } from 'react';

interface HeaderProps {
  user: string;
  onLogout: () => void;
  currentView: string;
  onBackToTrails: () => void;
}

const Header = ({ user, onLogout, currentView, onBackToTrails }: HeaderProps) => {
  const [showProfile, setShowProfile] = useState(false);

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
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Trilhas
              </Button>
            )}
            <h1 className="text-2xl font-bold text-blue-900">
              Mentor<span className="text-blue-600">IA</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-blue-800 font-medium">{user}</span>
            </button>
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-700 border-gray-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <UserProfile 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
      />
    </>
  );
};

export default Header;
