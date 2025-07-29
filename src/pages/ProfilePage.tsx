import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';

  // Detecta dd/mm/yyyy e converte
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  // Detecta formato ISO com T
  if (dateString.includes('T')) {
    return dateString.split('T')[0];
  }

  return dateString; // assume já estar ok
};


// Importa a URL base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Para invalidar cache do React Query

  // Estados para os dados do formulário
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    birth_date: '',
    institution: '',
    avatar: ''
  });

  // Estados de controle
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [dataWasUpdated, setDataWasUpdated] = useState(false); // Nova flag

  // Carrega os dados do usuário quando o componente monta
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        birth_date: user.birth_date ? user.birth_date.split('T')[0] : '', // Remove hora se vier do backend
        institution: user.institution || '',
        avatar: user.avatar || ''
      };
      setProfileData(userData);
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  // Atualiza um campo do formulário
  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Processa upload de imagem
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Converte para base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setAvatarPreview(base64);
      handleInputChange('avatar', base64);
    };
    reader.readAsDataURL(file);
  };

  // Remove a imagem
  const removeAvatar = () => {
    setAvatarPreview('');
    handleInputChange('avatar', '');
  };

  // Cancela a edição e restaura os dados originais
  const cancelEdit = () => {
    setDataWasUpdated(false); // Permite carregamento do contexto novamente
    
    if (user) {
      const originalData = {
        name: user.name || '',
        email: user.email || '',
        birth_date: formatDateForDisplay(user.birth_date), // ✅ USA FUNÇÃO AUXILIAR
        institution: user.institution || '',
        avatar: user.avatar || ''
      };
      setProfileData(originalData);
      setAvatarPreview(user.avatar || '');
    }
    setIsEditing(false);
  };

  // Salva as alterações no backend
  const saveProfile = async () => {
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token não encontrado');
      }

      console.log('=== DEBUG SAVE PROFILE ===');
      console.log('Token existe:', !!token);
      console.log('API_BASE_URL:', API_BASE_URL);
      console.log('URL completa:', `${API_BASE_URL}/auth/profile`);
      console.log('ANTES - Nome atual no formulário:', profileData.name);
      console.log('Dados que serão enviados:', {
        name: profileData.name,
        birth_date: profileData.birth_date,
        institution: profileData.institution,
        avatar: profileData.avatar ? 'base64 image data' : 'sem avatar'
      });

      const requestBody = {
        name: profileData.name,
        birth_date: profileData.birth_date,
        institution: profileData.institution,
        avatar: profileData.avatar
      };

      console.log('Fazendo requisição...');

      // Teste simples primeiro
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        mode: 'cors', // Força CORS
        credentials: 'omit', // Remove cookies que podem causar problema
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Resposta recebida:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro da API:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      const updatedData = await response.json();
      console.log('Resposta da API:', updatedData);

      // Sucesso - atualiza os dados locais com a resposta da API
      if (updatedData) {
        const newData = {
          name: updatedData.name || '',
          email: updatedData.email || '',
          birth_date: formatDateForDisplay(updatedData.birth_date), // ✅ USA FUNÇÃO AUXILIAR
          institution: updatedData.institution || '',
          avatar: updatedData.avatar || ''
        };
        setProfileData(newData);
        setAvatarPreview(updatedData.avatar || '');
        setDataWasUpdated(true); // Marca que os dados foram atualizados
      }

      // FORÇA atualização do contexto buscando dados frescos do servidor
      try {
        console.log('Buscando dados atualizados para o contexto...');
        const freshResponse = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (freshResponse.ok) {
          const freshUserData = await freshResponse.json();
          console.log('DEPOIS - Nome que voltou do servidor:', freshUserData.name);
          console.log('Dados frescos do servidor:', freshUserData);
          
          // COMPARAÇÃO CRÍTICA
          if (freshUserData.name !== profileData.name) {
            console.error('🚨 PROBLEMA: Backend não salvou os dados!');
            console.error('Nome enviado:', profileData.name);
            console.error('Nome que voltou:', freshUserData.name);
          } else {
            console.log('✅ Backend salvou corretamente!');
          }
          
          // Se o contexto tem uma função para atualizar os dados, usa ela
          if (typeof refreshUser === 'function') {
            await refreshUser();
          }
        }
      } catch (refreshError) {
        console.log('Erro ao buscar dados frescos:', refreshError);
      }

      alert('Perfil atualizado com sucesso!');
      setIsEditing(false);

    } catch (error) {
      console.error('=== ERRO DETALHADO ===');
      console.error('Tipo do erro:', typeof error);
      console.error('Nome do erro:', error.name);
      console.error('Mensagem:', error.message);
      console.error('Stack:', error.stack);
      
      alert('Erro ao salvar perfil: ' + error.message);
      
      // Se deu erro de rede, não cancela a edição
      if (error.message !== 'Failed to fetch') {
        cancelEdit();
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow" style={{ backgroundColor: '#3B82F630' }}>
      {/* Header com botão voltar */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>

      {/* Seção da foto */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">
          Foto de perfil
        </label>
        
        <div className="flex items-center gap-4">
          {/* Preview da imagem */}
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-white">
            {avatarPreview ? (
              <img 
                src={avatarPreview} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-4xl">👤</span>
            )}
          </div>

          {/* Botões de ação da imagem */}
          {isEditing && (
            <div className="flex flex-col gap-2">
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium cursor-pointer">
                Alterar foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              <button
                type="button"
                onClick={removeAvatar}
                className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded text-sm font-medium"
              >
                Remover foto
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Formulário */}
      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Nome
          </label>
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={profileData.email}
            disabled
            className="w-full px-3 py-2 border border-gray-200 bg-gray-100 text-gray-500 rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Email não pode ser alterado
          </p>
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            value={profileData.birth_date}
            onChange={(e) => handleInputChange('birth_date', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
          />
        </div>

        {/* Instituição */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Instituição
          </label>
          <input
            type="text"
            value={profileData.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 border rounded ${
              isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
            }`}
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 mt-6">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
          >
            Editar Perfil
          </button>
        ) : (
          <>
            <button
              onClick={saveProfile}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded font-medium"
            >
              {isSaving ? 'Salvando...' : 'Salvar'}
            </button>
            
            <button
              onClick={cancelEdit}
              disabled={isSaving}
              className="bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 px-4 py-2 rounded font-medium"
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;