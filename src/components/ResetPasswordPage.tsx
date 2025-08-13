import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Brain, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

// Schema de validação para reset de senha
const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra e um número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  // Formulário de reset de senha
  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  // Extrair token da URL
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Extrair access_token do hash
      const tokenMatch = hash.match(/access_token=([^&]+)/);
      if (tokenMatch) {
        setToken(tokenMatch[1]);
        console.log('🔍 Token extraído da URL:', tokenMatch[1].substring(0, 50) + '...');
      }
    }
  }, [location]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    if (isLoading || !token) return;

    setIsLoading(true);
    try {
      await authService.resetPassword({
        token,
        newPassword: data.newPassword,
      });

      toast({
        title: 'Senha redefinida!',
        description: 'Sua senha foi alterada com sucesso. Você pode fazer login agora.',
      });

      // Redirecionar para login
      navigate('/');
    } catch (error: any) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: 'Erro ao redefinir senha',
        description: error.message || 'Erro ao redefinir senha. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-700 rounded-2xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-red-800 mb-2">
              Token Inválido
            </CardTitle>
            <p className="text-red-600">Link de recuperação inválido ou expirado</p>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate('/')}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
            >
              Voltar ao Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-700 rounded-2xl flex items-center justify-center">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-blue-800 mb-2">
            Mentor<span className="text-blue-700">IA</span>
          </CardTitle>
          <p className="text-blue-600">Redefinir senha</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-500"
                  {...resetForm.register('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="text-sm text-red-600">{resetForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10 border-gray-300 focus:border-blue-500"
                  {...resetForm.register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-600">{resetForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
              disabled={isLoading}
            >
              {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-blue-700 hover:text-blue-800 font-medium"
              >
                Voltar ao login
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
