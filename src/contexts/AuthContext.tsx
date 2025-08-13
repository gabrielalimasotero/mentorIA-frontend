import React, { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User } from '@/lib/api';
import { authService, tokenUtils, userUtils } from '@/lib/auth';
import { dynamicQuestionsService } from '@/lib/dynamic-questions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { usePreloadStatus } from '@/hooks/use-preload-status';

interface AuthContextType {
  user: User | null;
  isLoading: boolean; // Representa apenas loading de registro
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (user: any, token: string) => Promise<void>;
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
  // Estado inicial baseado apenas no localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const hasToken = tokenUtils.isAuthenticated();
    const hasUser = userUtils.getUser();
    const result = hasToken && hasUser;
    console.log('🔍 AuthProvider - Estado inicial:', { hasToken, hasUser, result });
    return result;
  });
  
  const [user, setUser] = useState<User | null>(() => {
    const userData = userUtils.getUser();
    console.log('🔍 AuthProvider - User inicial:', userData);
    return userData;
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { markAsPreloaded, isPreloaded } = usePreloadStatus();

  // 🔍 DIAGNÓSTICO - Proteção contra mudanças suspeitas
  const prevAuthState = useRef({ isAuthenticated, user });
  
  useEffect(() => {
    const currentState = { isAuthenticated, user };
    const prevState = prevAuthState.current;
    
    if (prevState.isAuthenticated !== isAuthenticated || prevState.user !== user) {
      console.log('🔍 AuthProvider - Mudança de estado detectada:', {
        prev: { isAuthenticated: prevState.isAuthenticated, hasUser: !!prevState.user },
        current: { isAuthenticated, hasUser: !!user },
        stack: new Error().stack
      });
      
      // 🔍 ALERTA - Reset suspeito
      if (prevState.isAuthenticated && !isAuthenticated && prevState.user && !user) {
        console.error('🚨 ALERTA CRÍTICO: Reset completo no AuthProvider!');
        console.error('🚨 Stack trace completo:', new Error().stack);
      }
    }
    
    prevAuthState.current = currentState;
  }, [isAuthenticated, user]);

  // Função centralizada para fazer logout
  const handleLogout = () => {
    console.log('🔍 AuthProvider.handleLogout - Iniciando logout...');
    userUtils.clearAllAuthData();
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();
    console.log('🔍 AuthProvider.handleLogout - Logout concluído');
  };

  // Mutation para login (REMOVIDA - usando função login diretamente)
  // A mutation estava causando logout automático em caso de erro

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
      setUser(data.user);
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
    console.log('🔍 AuthContext.login - Iniciando login...');
    
    // IMPORTANTE: Não alterar isLoading aqui para evitar "piscar"
    // O isLoading será controlado apenas pela LoginPage
    
    try {
      const data = await authService.login({ email, password });
      console.log('✅ AuthContext.login - Login bem-sucedido, salvando dados...');
      
      // Limpar dados antigos antes de salvar novos
      userUtils.clearAllAuthData();
      
      // Salvar novos dados
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      setUser(data.user);
      
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
      console.error('❌ AuthContext.login - Erro capturado:', error);
      
      // IMPORTANTE: NÃO fazer logout automático em caso de credenciais inválidas
      // Isso evita o "piscar" da tela
      console.log('🔍 AuthContext.login - Mantendo estado atual, não fazendo logout...');
      
      // Propagar o erro com a mensagem do backend
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error;
    }
  };

  const loginWithGoogle = async (user: any, token: string) => {
    console.log('🔍 AuthContext.loginWithGoogle - Iniciando login com Google...');
    
    try {
      console.log('✅ AuthContext.loginWithGoogle - Salvando dados do Google...');
      
      // Limpar dados antigos antes de salvar novos
      userUtils.clearAllAuthData();
      
      // Salvar novos dados
      tokenUtils.saveToken(token);
      userUtils.saveUser(user);
      setIsAuthenticated(true);
      setUser(user);
      
      console.log('💾 Dados salvos, verificando se deve fazer pré-carregamento...');
      
      // Só fazer pré-carregamento se o usuário já completou o teste de nivelamento
      if (user.has_completed_leveling_test) {
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
        title: 'Login com Google realizado com sucesso!',
        description: `Bem-vindo(a), ${user.name}!`,
      });
      
      console.log('🎉 Login com Google finalizado com sucesso');
    } catch (error: any) {
      console.error('❌ AuthContext.loginWithGoogle - Erro capturado:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, birthDate: string, institution: string) => {
    // Não controlar loading aqui - será controlado pela LoginPage
    try {
      const data = await authService.register({ name, email, password, birthDate, institution });
      tokenUtils.saveToken(data.token);
      userUtils.saveUser(data.user);
      setIsAuthenticated(true);
      setUser(data.user);
      
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
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const value: AuthContextType = {
    user: user,
    isLoading: registerMutation.isPending, // Removido isInitializing
    isAuthenticated,
    setIsAuthenticated,
    login,
    loginWithGoogle,
    register,
    logout,
    forgotPassword,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 