import React from 'react';

type UserProfileProps = {
  name: string;
  email: string;
  birth_date: string;
  institution: string;
};

const UserProfile: React.FC<UserProfileProps> = ({ name, email, birth_date, institution }) => {
  return (
    <div className="p-4 border rounded bg-blue-800">
      <h3 className="text-lg font-semibold mb-2">Informações do Usuário</h3>
      <p><strong>Nome:</strong> {name}</p>
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Data de Nascimento:</strong> {birth_date}</p>
      <p><strong>Instituição:</strong> {institution}</p>
    </div>
  );
};

export default UserProfile;
