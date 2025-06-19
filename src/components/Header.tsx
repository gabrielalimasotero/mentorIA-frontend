
import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, User, Brain } from 'lucide-react';
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
                className="text-[#084d6e] hover:text-[#073f56] hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar às Trilhas
              </Button>
            )}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#084d6e] rounded-lg flex items-center justify-center mr-3">
                <Brain className="w-5 h-5 text-white" strokeWidth={1.5} />
              </div>
              <h1 className="text-2xl font-bold text-[#084d6e]">
                Mentor<span className="text-[#0a5a7a]">IA</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-[#084d6e]" />
              <span className="text-[#084d6e] font-medium">{user}</span>
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
