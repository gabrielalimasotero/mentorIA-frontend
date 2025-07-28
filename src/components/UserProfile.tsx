import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-2xl mx-auto p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-800">
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-blue-100 text-blue-600">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm text-gray-600 text-center">
                Foto do perfil
              </p>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="name"
                    value={user.name}
                    disabled
                    className="pl-10 border-gray-300 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="pl-10 border-gray-300 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth-date">Data de nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="birth-date"
                    value={new Date(user.birthDate).toLocaleDateString('pt-BR')}
                    disabled
                    className="pl-10 border-gray-300 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="institution">Instituição</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="institution"
                    value={user.institution}
                    disabled
                    className="pl-10 border-gray-300 bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Membro desde</Label>
                <Input
                  value={new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  disabled
                  className="border-gray-300 bg-gray-50"
                />
              </div>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-gray-500">
                Para alterar suas informações, entre em contato com o suporte.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
