import { api } from './api';

// Interfaces para as estatísticas
export interface UserStatistics {
  general: {
    total_questions: number;
    total_correct: number;
    overall_accuracy: number;
    study_streak: number;
    completed_tests: number;
  };
  by_topic: Array<{
    name: string;
    questions_answered: number;
    correct_answers: number;
    accuracy: number;
    topic_progress: number;
  }>;
  by_competency: Array<{
    name: string;
    questions_answered: number;
    correct_answers: number;
    accuracy: number;
    mastery_level: number;
  }>;
}

export interface CompetencyStatistics {
    questions_answered: number;
    correct_answers: number;
    accuracy_percentage: number;
}

export interface TopicStatistics {
    questions_answered: number;
    correct_answers: number;
    accuracy_percentage: number;
}

export interface CompetencyRanking {
    subtopic_name: string;
    questions_answered: number;
    correct_answers: number;
    accuracy_percentage: number;
}

export interface WeakCompetencies {
    threshold: number;
    competencies: CompetencyRanking[];
}

export interface QuestionAnswer {
    questionId: string;
    subtopicName: string;
    topicName: string;
    isCorrect: boolean;
}

// Classe para gerenciar as APIs de estatísticas
export class StatisticsService {
    /**
     * Registra uma resposta do usuário
     */
    static async recordAnswer(answer: QuestionAnswer): Promise<void> {
        try {
            const response = await api.post('/statistics/record-answer', answer);
            return response.data;
        } catch (error) {
            console.error('Erro ao registrar resposta:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas do usuário
     */
    static async getUserStatistics(): Promise<UserStatistics> {
        try {
            const response = await api.get('/statistics/user');
            console.log('🔍 Debug - Response da API /statistics/user:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas do usuário:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas por competência específica
     */
    static async getCompetencyStatistics(subtopicName: string): Promise<CompetencyStatistics | null> {
        try {
            const response = await api.get(`/statistics/competency/${encodeURIComponent(subtopicName)}`);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas da competência:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas por tópico específico
     */
    static async getTopicStatistics(topicName: string): Promise<TopicStatistics | null> {
        try {
            const response = await api.get(`/statistics/topic/${encodeURIComponent(topicName)}`);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter estatísticas do tópico:', error);
            throw error;
        }
    }

    /**
     * Obtém ranking de competências do usuário
     */
    static async getCompetencyRanking(): Promise<CompetencyRanking[]> {
        try {
            const response = await api.get('/statistics/ranking');
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter ranking de competências:', error);
            throw error;
        }
    }

    /**
     * Obtém competências que precisam de mais atenção
     */
    static async getWeakCompetencies(threshold: number = 70): Promise<WeakCompetencies> {
        try {
            const response = await api.get(`/statistics/weak-competencies?threshold=${threshold}`);
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter competências fracas:', error);
            throw error;
        }
    }

    /**
     * Obtém todos os tópicos e subtópicos disponíveis na tabela questions
     */
    static async getAvailableTopics(): Promise<{ [topicName: string]: string[] }> {
        try {
            const response = await api.get('/statistics/available-topics');
            return response.data.data;
        } catch (error) {
            console.error('Erro ao obter tópicos disponíveis:', error);
            throw error;
        }
    }

    /**
     * Obtém estatísticas formatadas para exibição
     */
    static formatStatistics(statistics: UserStatistics) {
        console.log('🔍 Debug - Statistics recebido:', statistics);
        console.log('🔍 Debug - statistics.by_topic:', statistics.by_topic);
        console.log('🔍 Debug - statistics.by_competency:', statistics.by_competency);
        
        const byTopic = statistics.by_topic || [];
        const byCompetency = statistics.by_competency || [];
        
        return {
            general: {
                totalQuestions: statistics.general?.total_questions || 0,
                totalCorrect: statistics.general?.total_correct || 0,
                overallAccuracy: statistics.general?.overall_accuracy || 0,
                studyStreak: statistics.general?.study_streak || 0,
                completedTests: statistics.general?.completed_tests || 0
            },
            byTopic: byTopic.map(topic => ({
                name: topic.name || topic.topic_name || '',
                questionsAnswered: topic.questions_answered || 0,
                correctAnswers: topic.correct_answers || 0,
                progress: topic.topic_progress || 0, // Usar topic_progress em vez de accuracy
                accuracy: topic.accuracy || 0 // Manter accuracy para exibição
            })),
            byCompetency: byCompetency.map(comp => ({
                name: comp.name || comp.subtopic_name || '',
                questionsAnswered: comp.questions_answered || 0,
                correctAnswers: comp.correct_answers || 0,
                progress: comp.accuracy || 0,
                masteryLevel: comp.mastery_level || 0
            }))
        };
    }

    /**
     * Calcula o nível de domínio baseado na acurácia
     */
    static getMasteryLevel(accuracy: number): 'beginner' | 'intermediate' | 'advanced' {
        if (accuracy >= 80) return 'advanced';
        if (accuracy >= 60) return 'intermediate';
        return 'beginner';
    }

    /**
     * Calcula o nível de domínio numérico (0, 1, 2, 3)
     */
    static getMasteryLevelNumber(accuracy: number): 0 | 1 | 2 | 3 {
        if (accuracy >= 76) return 3; // Dominado
        if (accuracy >= 51) return 2; // Intermediário
        if (accuracy >= 26) return 1; // Básico
        return 0; // Iniciante
    }

    /**
     * Obtém cor baseada no nível de domínio
     */
    static getMasteryColor(accuracy: number): string {
        const level = this.getMasteryLevel(accuracy);
        switch (level) {
            case 'advanced':
                return 'text-green-600';
            case 'intermediate':
                return 'text-yellow-600';
            case 'beginner':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    }

    /**
     * Obtém ícone baseado no nível de domínio
     */
    static getMasteryIcon(accuracy: number): string {
        const level = this.getMasteryLevel(accuracy);
        switch (level) {
            case 'advanced':
                return '🎯';
            case 'intermediate':
                return '📈';
            case 'beginner':
                return '📚';
            default:
                return '❓';
        }
    }

    /**
     * Obtém cor da barra de progresso baseada no nível
     */
    static getProgressBarColor(accuracy: number): string {
        const level = this.getMasteryLevelNumber(accuracy);
        switch (level) {
            case 3:
                return 'bg-green-500';
            case 2:
                return 'bg-yellow-500';
            case 1:
                return 'bg-orange-500';
            case 0:
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    /**
     * Registra estudo diário do usuário
     */
    static async registerDailyStudy(questionsCount: number = 0): Promise<{
        current_streak: number;
        questions_completed: number;
        completed_daily_goal: boolean;
        date: string;
    }> {
        try {
            const response = await api.post('/statistics/register-daily-study', {
                questionsCount
            });
            return response.data.data;
        } catch (error) {
            console.error('Erro ao registrar estudo diário:', error);
            throw error;
        }
    }
} 