import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/api';
import { authService, tokenUtils, userUtils } from '@/lib/auth';
import { dynamicQuestionsService } from '@/lib/dynamic-questions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { usePreloadStatus } from '@/hooks/use-preload-status';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, birthDate: string, institution: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return tokenUtils.isAuthenticated();
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { markAsPreloaded, isPreloaded } = usePreloadStatus();

  // Query para buscar dados do usuário atual
  const { data: user, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const userData = await authService.getCurrentUser();
        return userData;
      } catch (error: any) {
        console.error('Erro ao buscar dados do usuário:', error);
        if (error.response?.status === 401) {
          handleLogout();
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Função centralizada para fazer logout
  const handleLogout = () => {
    userUtils.clearAllAuthData();
    setIsAuthenticated(false);
    setIsLoading(false);
    queryClient.clear();
  };

  // Verificar autenticação na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Verificando autenticação na inicialização...');
        const hasToken = tokenUtils.isAuthenticated();

        if (!hasToken) {
          console.log('❌ Sem token, fazendo logout');
          handleLogout();
          return;
        }

        // Se tem token, verificar se é válido
        try {
          const userData = await authService.getCurrentUser();
          queryClient.setQueryData(['user'], userData);
          setIsAuthenticated(true);
        } catch (error: any) {
          if (error.response?.status === 401) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [queryClient]);

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      return await authService.login({ email, password });
    },
    onSuccess: (data) => {
      // Limpar dados antigos antes de salvar novos
      userUtils.clearAllAuthData();
      
      // Salvar novos dados
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo(a), ${data.user.name}!`,
      });
    },
    onError: (error: any) => {
      tokenUtils.clearToken();
      userUtils.clearUser();
      setIsAuthenticated(false);
      queryClient.clear();

      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';

      toast({
        title: 'Erro no login',
        description: errorMessage,
        variant: 'destructive',
      });
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: ({ name, email, password, birthDate, institution }: {
      name: string;
      email: string;
      password: string;
      birthDate: string;
      institution: string;
    }) =>
      authService.register({ name, email, password, birthDate, institution }),
    onSuccess: (data) => {
      // Limpar dados antigos antes de salvar novos
      userUtils.clearAllAuthData();
      
      // Salvar novos dados
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo(a), ${data.user.name}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro no cadastro',
        description: error.response?.data?.message || 'Erro ao criar conta',
        variant: 'destructive',
      });
    },
  });

  // Mutation para forgot password
  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro ao enviar email',
        description: error.response?.data?.message || 'Erro ao enviar email de recuperação',
        variant: 'destructive',
      });
    },
  });

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login({ email, password });
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      
      console.log('💾 Dados salvos, verificando se deve fazer pré-carregamento...');
      
      // Só fazer pré-carregamento se o usuário já completou o teste de nivelamento
      if (data.user.has_completed_leveling_test) {
        try {
          await dynamicQuestionsService.preloadUserData();
          markAsPreloaded();
          console.log('✅ Pré-carregamento concluído (usuário já completou nivelamento)');
        } catch (preloadError) {
          console.log('⚠️ Pré-carregamento falhou, mas login continuará');
        }
      } else {
        console.log('⏭️ Pulando pré-carregamento - usuário ainda não completou teste de nivelamento');
      }
      
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo(a), ${data.user.name}!`,
      });
      
      console.log('🎉 Login finalizado com sucesso');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      // Limpar dados de autenticação
      handleLogout();
      
      // Propagar o erro com a mensagem do backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, birthDate: string, institution: string) => {
    setIsLoading(true);
    try {
      const data = await authService.register({ name, email, password, birthDate, institution });
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      
      console.log('💾 Dados salvos, verificando se deve fazer pré-carregamento...');
      
      // Só fazer pré-carregamento se o usuário já completou o teste de nivelamento
      if (data.user.has_completed_leveling_test) {
        try {
          await dynamicQuestionsService.preloadUserData();
          markAsPreloaded();
          console.log('✅ Pré-carregamento concluído (usuário já completou nivelamento)');
        } catch (preloadError) {
          console.log('⚠️ Pré-carregamento falhou, mas registro continuará');
        }
      } else {
        console.log('⏭️ Pulando pré-carregamento - usuário ainda não completou teste de nivelamento');
      }
      
      toast({
        title: 'Conta criada com sucesso!',
        description: `Bem-vindo(a), ${data.user.name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Erro ao criar conta';
      toast({
        title: 'Erro no cadastro',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      handleLogout();
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
    }
  };

  const forgotPassword = async (email: string) => {
    await forgotPasswordMutation.mutateAsync(email);
  };

  const refetchUser = async () => {
    await refetch();
  };

  const value: AuthContextType = {
    user: user || null,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    isAuthenticated,
    setIsAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 