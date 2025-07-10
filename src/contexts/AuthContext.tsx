import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/lib/api';
import { authService, tokenUtils, userUtils } from '@/lib/auth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, birthDate: string, institution: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
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
    // Inicializa o estado com base no token existente
    return tokenUtils.isAuthenticated();
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para buscar dados do usuário atual
  const { data: user, error, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const userData = await authService.getCurrentUser();
        return userData;
      } catch (error: any) {
        console.error('Erro ao buscar dados do usuário:', error);
        // Se o erro for 401, significa que o token é inválido
        if (error.response?.status === 401) {
          handleLogout();
        }
        throw error;
      }
    },
    enabled: isAuthenticated,
    retry: false, // Não tentar novamente em caso de erro
    staleTime: 5 * 60 * 1000, // 5 minutos
    onError: (error: any) => {
      // Só fazer logout se o erro for de autenticação
      if (error.response?.status === 401) {
        console.error('Token inválido ou expirado, fazendo logout');
        handleLogout();
      }
    }
  });

  // Função centralizada para fazer logout
  const handleLogout = () => {
    tokenUtils.clearToken();
    userUtils.clearUser();
    setIsAuthenticated(false);
    setIsLoading(false);
    queryClient.clear();
  };

  // Verificar autenticação na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const hasToken = tokenUtils.isAuthenticated();
        const savedUser = userUtils.getUser();
        
        if (!hasToken) {
          handleLogout();
          return;
        }

        // Se tem token e usuário salvo, usar dados do cache primeiro
        if (hasToken && savedUser) {
          setIsAuthenticated(true);
          queryClient.setQueryData(['user'], savedUser);
        }

        // Sempre tentar atualizar os dados do usuário em background
        if (hasToken) {
          try {
            const userData = await authService.getCurrentUser();
            queryClient.setQueryData(['user'], userData);
            setIsAuthenticated(true);
          } catch (error: any) {
            // Só fazer logout se o erro for de autenticação
            if (error.response?.status === 401) {
              handleLogout();
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [queryClient]);

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      setIsLoading(true);
      try {
        const result = await authService.login({ email, password });
        return result;
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
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
      // Limpar qualquer estado de autenticação em caso de erro
      tokenUtils.clearToken();
      userUtils.clearUser();
      setIsAuthenticated(false);
      queryClient.clear();
      
      const errorMessage = error.message || 'Erro ao fazer login';
      
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

  // Função de logout
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      handleLogout();
    }
  };

  // Mutation para recuperação de senha
  const forgotPasswordMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast({
        title: 'Email enviado',
        description: 'Verifique sua caixa de entrada para redefinir sua senha.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Erro ao enviar email',
        variant: 'destructive',
      });
    },
  });

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const data = await authService.login({ email, password });
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      queryClient.setQueryData(['user'], data.user);
      toast({
        title: 'Login realizado com sucesso!',
        description: `Bem-vindo(a), ${data.user.name}!`,
      });
    } catch (error: any) {
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

  const forgotPassword = async (email: string) => {
    await forgotPasswordMutation.mutateAsync(email);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 