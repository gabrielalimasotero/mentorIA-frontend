import { api, ApiResponse, User, LoginRequest, RegisterRequest, ForgotPasswordRequest, ResetPasswordRequest } from './api';

// Serviços de autenticação
export const authService = {
  // Login do usuário
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    try {
      const response = await api.post<ApiResponse<User>>('/auth/login', credentials);
      
      if (!response.data.user || !response.data.token) {
        throw new Error('Resposta inválida do servidor');
      }

      return {
        user: response.data.user,
        token: response.data.token
      };
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Senha incorreta. Por favor, verifique suas credenciais.');
      }
      if (error.message === 'Network Error') {
        throw new Error('Erro de conexão com o servidor. Por favor, tente novamente.');
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao fazer login. Tente novamente.');
    }
  },

  // Registro de novo usuário
  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    return {
      user: response.data.user!,
      token: response.data.token!
    };
  },

  // Logout do usuário
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Mesmo se falhar, limpar tokens locais
      console.warn('Erro no logout:', error);
    } finally {
      // Sempre limpar tokens locais
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Recuperação de senha
  async forgotPassword(email: string): Promise<void> {
    await api.post<ApiResponse>('/auth/forgot-password', { email });
  },

  // Reset de senha
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await api.post<ApiResponse>('/auth/reset-password', data);
  },

  // Buscar dados do usuário atual
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    // O backend retorna o perfil diretamente, não dentro de um objeto user
    return response.data as User;
  },

  // Atualizar perfil do usuário
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    // O backend retorna o perfil diretamente, não dentro de um objeto data
    return response.data as User;
  },

  // Upload de avatar
  async uploadAvatar(file: File): Promise<{ avatar: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post<ApiResponse<{ avatar: string }>>('/auth/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // O backend retorna o objeto diretamente, não dentro de um objeto data
    return response.data as { avatar: string };
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const response = await api.post<ApiResponse>('/auth/refresh');
    return response.data.token!;
  },
};

// Utilitários para gerenciar tokens
export const tokenUtils = {
  // Salvar token no localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  },

  // Obter token
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decodificar o token (formato JWT)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const payload = JSON.parse(jsonPayload);
      
      // Verificar se o token está expirado
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        this.clearToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      this.clearToken();
      return false;
    }
  },

  // Limpar token
  clearToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Limpar outros dados relacionados à autenticação
    localStorage.removeItem('training_progress');
    localStorage.removeItem('user_goals');
    localStorage.removeItem('diagnostic_completed');
    localStorage.removeItem('diagnostic_progress');
    localStorage.removeItem('learning_paths');
    localStorage.removeItem('preload_status');
  },
};

// Utilitários para gerenciar dados do usuário
export const userUtils = {
  // Salvar dados do usuário
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obter dados do usuário
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Atualizar dados do usuário
  updateUser(updates: Partial<User>): void {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.saveUser(updatedUser);
    }
  },

  // Limpar dados do usuário
  clearUser(): void {
    localStorage.removeItem('user');
    // Limpar outros dados relacionados ao usuário
    localStorage.removeItem('training_progress');
    localStorage.removeItem('user_goals');
    localStorage.removeItem('diagnostic_completed');
    localStorage.removeItem('diagnostic_progress');
    localStorage.removeItem('learning_paths');
    localStorage.removeItem('preload_status');
  },

  // Limpar todos os dados de autenticação
  clearAllAuthData(): void {
    this.clearUser();
    tokenUtils.clearToken();
  },
}; 