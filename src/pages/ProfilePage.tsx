import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<any>({});
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Buscar perfil real ao montar
    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/me`, { withCredentials: true })
            .then(res => {
                setUser(res.data);
                setForm(res.data);
                setAvatarPreview(res.data.avatar || '');
                setLoading(false);
            })
            .catch(() => {
                setError('Erro ao carregar perfil.');
                setLoading(false);
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                setForm({ ...form, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEdit = () => setEditMode(true);
    const handleCancel = () => {
        setForm(user);
        setAvatarPreview(user?.avatar || '');
        setEditMode(false);
    };
    const handleSave = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/profile`,
                {
                    name: form.name,
                    birth_date: form.birth_date,
                    institution: form.institution,
                },
                { withCredentials: true }
            );
            setUser(res.data);
            setForm(res.data);
            setEditMode(false);
        } catch (err: any) {
            setError('Erro ao salvar perfil.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="max-w-md mx-auto mt-10 p-6 rounded shadow bg-white">Carregando perfil...</div>;
    }
    if (error) {
        return <div className="max-w-md mx-auto mt-10 p-6 rounded shadow bg-white text-red-600">{error}</div>;
    }
    if (!user) {
        return <div className="max-w-md mx-auto mt-10 p-6 rounded shadow bg-white">Perfil não encontrado.</div>;
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
                            <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer text-sm font-medium">Modificar imagem</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => { setAvatarPreview(''); setForm({ ...form, avatar: '' }); }}
                            className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium"
                        >
                            Deletar imagem
                        </button>
                    </div>
                </div>
            </div>
            <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                    <label className="block text-sm font-medium">Nome</label>
                    <input
                        type="text"
                        name="name"
                        value={editMode ? form.name : user.name}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        disabled
                        className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Data de Nascimento</label>
                    <input
                        type="date"
                        name="birth_date"
                        value={editMode ? form.birth_date : user.birth_date}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Instituição</label>
                    <input
                        type="text"
                        name="institution"
                        value={editMode ? form.institution : user.institution}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="mt-1 block w-full border rounded px-3 py-2"
                    />
                </div>
                <div className="flex gap-2 mt-4">
                    {editMode ? (
                        <>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
                            <button type="button" onClick={handleCancel} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                        </>
                    ) : (
                        <button type="button" onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded">Editar Perfil</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProfilePage; 