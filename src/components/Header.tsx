import { Button } from '@/components/ui/button';
import { LogOut, ArrowLeft, User, Brain, BarChart3, Edit, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { authService, userUtils } from '@/lib/auth';

interface HeaderProps {
  currentView: string;
  onBackToTrails: () => void;
}

const Header = ({ currentView, onBackToTrails }: HeaderProps) => {
  const { user, logout, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    institution: '',
    avatar: ''
  });

  // Função para carregar dados atualizados do perfil
  const loadProfileData = async () => {
    try {
      // Busca dados diretamente da API para garantir que estão atualizados
      const freshUserData = await authService.getCurrentUser();
      setProfileData({
        name: freshUserData.name || '',
        email: freshUserData.email || '',
        institution: freshUserData.institution || '',
        avatar: (freshUserData as any).avatar || ''
      });
    } catch (error) {
      console.error('Erro ao carregar dados do perfil:', error);
      // Fallback para dados do contexto
      if (user) {
        setProfileData({
          name: user.name || '',
          email: user.email || '',
          institution: user.institution || '',
          avatar: (user as any).avatar || ''
        });
      }
    }
  };

  // Carrega dados do usuário quando o modal abre
  useEffect(() => {
    if (isProfileOpen) {
      loadProfileData();
    }
  }, [isProfileOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      // Envia dados atualizados para o backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          institution: profileData.institution,
          avatar: profileData.avatar
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar perfil');
      }

      // Atualiza o contexto com os dados novos
      if (refetchUser) {
        await refetchUser();
      }

      // Atualiza localStorage com os dados novos
      const freshUserData = await authService.getCurrentUser();
      userUtils.saveUser(freshUserData);

      alert('Perfil atualizado com sucesso!');
      setIsEditing(false);
      // Fecha o modal após a atualização bem-sucedida
      setIsProfileOpen(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Restaura dados originais buscando da API
    loadProfileData();
    setIsEditing(false);
  };

  const handleOpenProfile = async () => {
    setIsProfileOpen(true);
    // Força atualização dos dados antes de abrir o modal
    await loadProfileData();
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
            onClick={() => navigate('/statistics')}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Estatísticas
          </Button>
          
          <Dialog open={isProfileOpen} onOpenChange={(open) => {
            setIsProfileOpen(open);
            if (!open) {
              // Reseta o estado de edição quando o modal fecha
              setIsEditing(false);
            }
          }}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="text-blue-800"
                onClick={handleOpenProfile}
              >
                <User className="w-4 h-4 mr-1" />
                Perfil
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-blue-800">
                  Perfil do Usuário
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                      {profileData.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Informações do perfil */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      value={profileData.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Instituição</Label>
                    <Input
                      id="institution"
                      value={profileData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex justify-end gap-2">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
