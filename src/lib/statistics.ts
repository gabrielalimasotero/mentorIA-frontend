import { api } from './api';

// Tipos para estatísticas
export interface UserStatistics {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    studyStreak: number;
    totalStudyTime: number;
    completedTests: number;
    averageScore: number;
    topicsProgress: {
        topic: string;
        subtopics: {
            name: string;
            progress: number;
            questionsAnswered: number;
            correctAnswers: number;
        }[];
        totalProgress: number;
        totalQuestions: number;
    }[];
    recentActivity: {
        date: string;
        questionsAnswered: number;
        accuracy: number;
    }[];
}

export interface CompetencyStatistics {
    totalCompetencies: number;
    masteredCompetencies: number;
    inProgressCompetencies: number;
    beginnerCompetencies: number;
    averageLevel: number;
}

export interface CompetencyProgress {
    competencyName: string;
    level: number;
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
}

// Serviço para estatísticas
export const statisticsService = {
    // Buscar estatísticas completas do usuário
    async getUserStatistics(): Promise<UserStatistics> {
        try {
            console.log('📊 Buscando estatísticas do usuário...');
            const response = await api.get('/statistics/user');

            if (response.data.success) {
                console.log('✅ Estatísticas carregadas:', response.data.data);
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Erro ao carregar estatísticas');
            }
        } catch (error: any) {
            console.error('❌ Erro ao buscar estatísticas:', error);

            // Fallback para dados mock se a API falhar
            console.log('🔄 Usando dados mock como fallback');
            return this.getMockStatistics();
        }
    },

    // Buscar estatísticas de competências
    async getCompetencyStatistics(): Promise<CompetencyStatistics> {
        try {
            const response = await api.get('/statistics/competencies');

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Erro ao carregar estatísticas de competências');
            }
        } catch (error: any) {
            console.error('❌ Erro ao buscar estatísticas de competências:', error);
            throw error;
        }
    },

    // Buscar progresso de competências
    async getCompetencyProgress(): Promise<CompetencyProgress[]> {
        try {
            const response = await api.get('/statistics/competencies/progress');

            if (response.data.success) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || 'Erro ao carregar progresso de competências');
            }
        } catch (error: any) {
            console.error('❌ Erro ao buscar progresso de competências:', error);
            throw error;
        }
    },

    // Salvar resposta do usuário
    async saveUserAnswer(data: {
        questionId: string;
        selectedAlternativeId?: string;
        isCorrect: boolean;
        timeSpentSeconds?: number;
    }): Promise<void> {
        try {
            const response = await api.post('/statistics/answer', data);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Erro ao salvar resposta');
            }
        } catch (error: any) {
            console.error('❌ Erro ao salvar resposta:', error);
            // Não falhar o fluxo se o salvamento falhar
            console.log('⚠️ Salvamento de resposta falhou, mas continuando...');
        }
    },

    // Dados mock para fallback
    getMockStatistics(): UserStatistics {
        return {
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            studyStreak: 0,
            totalStudyTime: 0,
            completedTests: 0,
            averageScore: 0,
            topicsProgress: [],
            recentActivity: []
        };
    }
}; 