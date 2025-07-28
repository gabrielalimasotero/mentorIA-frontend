import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    birth_date: '',
    institution: '',
    avatar: '',
  });

  const [avatarPreview, setAvatarPreview] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (user && typeof user === 'object') {
      const newForm = {
        name: user.name || '',
        email: user.email || '',
        birth_date: user.birth_date ? user.birth_date.slice(0, 10) : '',
        institution: user.institution || '',
        avatar: user.avatar || '',
      };
      setForm(newForm);
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        setAvatarPreview(result as string);
        setForm((prev) => ({ ...prev, avatar: result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    if (user && typeof user === 'object') {
      const resetForm = {
        name: user.name || '',
        email: user.email || '',
        birth_date: user.birth_date ? user.birth_date.slice(0, 10) : '',
        institution: user.institution || '',
        avatar: user.avatar || '',
      };
      setForm(resetForm);
      setAvatarPreview(user.avatar || '');
    }
    setEditMode(false);
  };

 const handleSave = async () => {
    console.log('===> Entrou no handleSave');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado. Faça login novamente.');

      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          birth_date: form.birth_date,
          institution: form.institution,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro ${response.status}: ${errorData}`);
      }

      await response.json();
      setEditMode(false);
      alert('Perfil atualizado com sucesso!');
      window.location.reload(); // Você pode substituir por refetchUser() se estiver usando React Query

    } catch (error) {
      alert('Erro ao salvar perfil: ' + (error as Error).message);
    }
  };

  if (!user || typeof user !== 'object') {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 rounded shadow bg-white">
        <p>Carregando perfil...</p>
        <p className="text-sm text-gray-500 mt-2">Debug: user = {JSON.stringify(user)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded shadow" style={{ backgroundColor: '#3B82F630' }}>
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Perfil do Usuário</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2 text-gray-700">Foto de perfil</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border-2 border-white">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Foto de perfil" className="object-cover w-full h-full" />
            ) : (
              <span className="text-gray-400 text-4xl">👤</span>
            )}
          </div>
          <div className="flex gap-2">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer text-sm font-medium">
                Modificar imagem
              </span>
            </label>
            <button
              type="button"
              onClick={() => {
                setAvatarPreview('');
                setForm((prev) => ({ ...prev, avatar: '' }));
              }}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium"
            >
              Deletar imagem
            </button>
          </div>
        </div>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            disabled
            className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100 text-gray-500 border-gray-200"
          />
          <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Data de Nascimento</label>
          <input
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Instituição</label>
          <input
            type="text"
            name="institution"
            value={form.institution}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-2 mt-6">
          {editMode ? (
            <>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
                Salvar
              </button>
              <button type="button" onClick={handleCancel} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded font-medium transition-colors">
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors">
              Editar Perfil
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
