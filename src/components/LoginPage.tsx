import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff, Calendar, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  institution: z.string().min(1, 'Instituição é obrigatória'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  
  const { login, register, forgotPassword, isLoading, isAuthenticated, user } = useAuth();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    console.log('🔍 LoginPage useEffect - Estado atual:', { isAuthenticated, user, isLoading });
    
    if (isAuthenticated && user) {
      console.log('✅ Usuário autenticado, redirecionando para dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Formulário de login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Formulário de registro
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Formulário de recuperação de senha
  const forgotPasswordForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const handleLogin = async (data: LoginFormData) => {
    if (isLoading) return; // Evita múltiplos cliques
    
    try {
      setLoginError(null);
      loginForm.clearErrors();
      await login(data.email, data.password);
      // Se o login for bem sucedido, será redirecionado pelo useEffect
    } catch (error: any) {
      console.error('Erro no login:', error);
      // Usar a mensagem do backend ou uma mensagem padrão
      const errorMessage = error.response?.data?.message || error.message || 'Email ou senha incorretos';
      setLoginError(errorMessage);
      
      // Mostrar o erro nos campos
      if (errorMessage.toLowerCase().includes('senha')) {
        loginForm.setError('password', { 
          type: 'manual',
          message: errorMessage 
        });
      } else {
        loginForm.setError('email', { 
          type: 'manual',
          message: errorMessage 
        });
        loginForm.setError('password', { 
          type: 'manual',
          message: errorMessage 
        });
      }
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    if (isLoading) return; // Evita múltiplos cliques
    
    try {
      setLoginError(null);
      registerForm.clearErrors();
      await register(data.name, data.email, data.password, data.birthDate, data.institution);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      setLoginError(error.message || 'Erro ao criar conta');
    }
  };

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      setShowForgotPassword(false);
    } catch (error) {
      // Erro já tratado no contexto
    }
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implementar login social
    console.log(`Login com ${provider} - Implementar`);
  };

  // Limpar erro quando mudar de login para registro e vice-versa
  useEffect(() => {
    setLoginError(null);
    loginForm.clearErrors();
    registerForm.clearErrors();
  }, [isSignUp]);

  if (showForgotPassword) {
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
            <p className="text-blue-600">Recuperar senha</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={forgotPasswordForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="forgot-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 border-gray-300 focus:border-blue-500"
                    {...forgotPasswordForm.register('email')}
                  />
                </div>
                {forgotPasswordForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{forgotPasswordForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
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
          <p className="text-blue-600">
            {isSignUp ? 'Crie sua conta e comece a estudar' : 'Entre em sua conta para continuar'}
          </p>
        </CardHeader>
        <CardContent>
          {isSignUp ? (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-name"
                    type="text"
                    placeholder="Seu nome completo"
                    className="pl-10 border-gray-300 focus:border-blue-500"
                    {...registerForm.register('name')}
                  />
                </div>
                {registerForm.formState.errors.name && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 border-gray-300 focus:border-blue-500"
                    {...registerForm.register('email')}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-birth-date">Data de nascimento</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-birth-date"
                    type="date"
                    className="pl-10 border-gray-300 focus:border-blue-500"
                    {...registerForm.register('birthDate')}
                  />
                </div>
                {registerForm.formState.errors.birthDate && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.birthDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-institution">Instituição</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-institution"
                    type="text"
                    placeholder="Sua instituição de ensino"
                    className="pl-10 border-gray-300 focus:border-blue-500"
                    {...registerForm.register('institution')}
                  />
                </div>
                {registerForm.formState.errors.institution && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.institution.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500"
                    {...registerForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirmar senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-10 pr-10 border-gray-300 focus:border-blue-500"
                    {...registerForm.register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 relative"
                disabled={isLoading}
              >
                <span className={isLoading ? 'invisible' : ''}>
                  {isLoading ? 'Criando conta...' : 'Criar conta'}
                </span>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    className={`pl-10 border-gray-300 focus:border-blue-500 ${
                      loginForm.formState.errors.email ? 'border-red-500' : ''
                    }`}
                    {...loginForm.register('email')}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 ${
                      loginForm.formState.errors.password ? 'border-red-500' : ''
                    }`}
                    {...loginForm.register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              {loginError && (
                <div className="p-3 rounded bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-blue-700 hover:text-blue-800 text-sm"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={isLoading}
            >
              <svg className="w-4 h-4 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuar com Facebook
            </Button>
          </div>

          <div className="text-center">
            <span className="text-gray-600">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}
            </span>
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-blue-700 hover:text-blue-800 font-medium"
            >
              {isSignUp ? 'Entrar' : 'Cadastre-se'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
