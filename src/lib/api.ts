import axios from 'axios';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Instância do axios com configurações base
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Aumentado para 60 segundos devido à consulta lenta de competências
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use(
  (config) => {
    console.log('🌐 Requisição para:', config.baseURL + config.url);
    console.log('🔑 Token presente:', !!localStorage.getItem('token'));
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await api.post('/auth/refresh');
        const { token } = response.data;
        localStorage.setItem('token', token);

        // Repetir a requisição original com o novo token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, limpar tokens e redirecionar para login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // Tratar erros específicos
    if (error.response?.status === 404) {
      return Promise.reject(new Error('Usuário não encontrado'));
    }

    if (error.response?.status === 401) {
      return Promise.reject(new Error('Usuário ou senha incorretos'));
    }

    if (error.message === 'Network Error') {
      return Promise.reject(new Error('Erro de conexão com o servidor'));
    }

    return Promise.reject(error);
  }
);

// Tipos para as respostas da API
export interface ApiResponse<T = any> {
  user?: T;
  token?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  birthDate: string;
  institution: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  institution: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
} 